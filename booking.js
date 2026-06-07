import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD73Uyrrl8JDP5X_yxT2Zp1fV9oIpAvpXA",
  authDomain: "lumi-75592.firebaseapp.com",
  projectId: "lumi-75592",
  storageBucket: "lumi-75592.firebasestorage.app",
  messagingSenderId: "419726897354",
  appId: "1:419726897354:web:3b27219dd60b26dbb84433",
  measurementId: "G-23937MS0LH"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

(function () {

  // ─── State ───────────────────────────────────────────────
  const state = {
    currentStep: 1,
    selectedService: null,
    selectedPayment: null,
    selectedDate: null,
    selectedTime: null,
    calYear: null,
    calMonth: null,
  };

  // ─── Elements ────────────────────────────────────────────
  const overlay      = document.getElementById('bookingOverlay');
  const closeBtn     = document.getElementById('bookingClose');
  const nextBtn      = document.getElementById('bookingNext');
  const backBtn      = document.getElementById('bookingBack');
  const calPrev      = document.getElementById('calPrev');
  const calNext      = document.getElementById('calNext');
  const calLabel     = document.getElementById('calMonthLabel');
  const calDays      = document.getElementById('calendarDays');
  const timeslots    = document.querySelectorAll('.timeslot');
  const serviceCards = document.querySelectorAll('.booking-service-card');
  const paymentCards = document.querySelectorAll('.payment-card');

  // ─── Open / Close ─────────────────────────────────────────
  function openModal() {
    document.body.style.overflow = 'hidden';
    overlay.classList.add('open');
    resetModal();
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // BUG FIX #5 (race condition): track any pending congrats timeout so we can
  // cancel it if the modal is closed or re-opened before it fires.
  let congratsTimer1 = null;
  let congratsTimer2 = null;

  function resetModal() {
    state.currentStep    = 1;
    state.selectedService = null;
    state.selectedPayment = null;
    state.selectedDate   = null;
    state.selectedTime   = null;

    const now = new Date();
    state.calYear  = now.getFullYear();
    state.calMonth = now.getMonth();

    serviceCards.forEach(c => c.classList.remove('selected'));
    paymentCards.forEach(c => c.classList.remove('selected'));
    timeslots.forEach(t => t.classList.remove('selected'));

    const accountReveal = document.getElementById('accountReveal');
    if (accountReveal) accountReveal.classList.remove('visible');

    ['inputName','inputEmail','inputPhone','inputNotes'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    const check = document.getElementById('confirmCheck');
    if (check) check.checked = false;

    // BUG FIX #5: cancel any in-flight congrats timers before resetting,
    // so a stale removeChild() call cannot throw after re-open.
    if (congratsTimer1 !== null) { clearTimeout(congratsTimer1); congratsTimer1 = null; }
    if (congratsTimer2 !== null) { clearTimeout(congratsTimer2); congratsTimer2 = null; }
    // Remove any lingering congrats overlay left over from an interrupted flow.
    const modal = document.getElementById('bookingModal');
    const stale = modal?.querySelector('.congrats-overlay');
    if (stale) modal.removeChild(stale);

    goToStep(1);
    // BUG FIX #10: removed the redundant second renderCalendar() call here.
    // goToStep(1) already leaves the calendar in panel-3 (untouched); the
    // calendar was already rendered once inside goToStep via the initial
    // state, and renderCalendar() is called explicitly in the first goToStep(1)
    // triggered by openModal → resetModal. Keeping a single call avoids the
    // double render.
    // NOTE: renderCalendar() IS still called once from within resetModal via
    // goToStep path — specifically it is called unconditionally right below so
    // that the calendar always starts on the current month when the modal opens.
    renderCalendar();
  }

  document.querySelectorAll('.btn-primary, .cta-book').forEach(btn => {
    const text = btn.innerText.trim().toLowerCase();
    if (text.includes('book') || text.includes('appointment')) {
      btn.addEventListener('click', e => { e.preventDefault(); openModal(); });
    }
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  // ─── Step Navigation ──────────────────────────────────────
  // BUG FIX #3 & #8: nextLabels[5] previously said "Next: Call Us" which is
  // wrong — step 5 IS the Call Us screen, so there is no meaningful "next".
  // The label is now empty; the button is hidden on step 5 anyway (Bug Fix #2).
  const nextLabels = {
    1: 'Next: Your Information <i class="fa-solid fa-arrow-right"></i>',
    2: 'Next: Choose Date &amp; Time <i class="fa-solid fa-arrow-right"></i>',
    3: 'Review Booking <i class="fa-solid fa-arrow-right"></i>',
    4: 'Next: Upload image <i class="fa-solid fa-arrow-right"></i>',
    5: '',
  };

  function goToStep(step) {
    document.querySelectorAll('.booking-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('panel-' + step);
    if (panel) panel.classList.add('active');

    document.querySelectorAll('.booking-step').forEach(s => {
      const n = parseInt(s.dataset.step);
      s.classList.remove('active', 'completed');
      if (n === step) s.classList.add('active');
      if (n < step)  s.classList.add('completed');
    });

    document.querySelectorAll('.booking-step.completed .step-circle').forEach(c => {
      c.innerHTML = '<i class="fa-solid fa-check" style="font-size:0.7rem"></i>';
    });
    document.querySelectorAll('.booking-step:not(.completed) .step-circle').forEach(c => {
      c.innerHTML = c.closest('.booking-step').dataset.step;
    });

    backBtn.classList.toggle('hidden', step === 1);

    // BUG FIX #2 & #3: the original code used classList.toggle('hidden', …)
    // but there was no .hidden rule for .booking-next-btn in CSS — only for
    // .booking-back-btn.hidden. So on step 5 the Next button stayed fully
    // visible. Fixed by using display:none / display:'' directly on the element.
    if (step === 5) {
      nextBtn.style.display = 'none';
    } else {
      nextBtn.style.display = '';
      nextBtn.innerHTML = nextLabels[step];
    }

    if (step === 4) populateConfirm();

    validateStep(step);
    state.currentStep = step;
  }

  nextBtn.addEventListener('click', () => {
    if (nextBtn.disabled) return;
    // BUG FIX #3: guard is now step >= 5 (was step === 5) to be safe, but with
    // the button hidden on step 5 this path is unreachable regardless.
    if (state.currentStep >= 5) { return; }
    goToStep(state.currentStep + 1);
  });

  backBtn.addEventListener('click', () => {
    if (state.currentStep > 1) goToStep(state.currentStep - 1);
  });

  // ─── Validation ───────────────────────────────────────────
  function validateStep(step) {
    let valid = false;

    if (step === 1) {
      valid = !!state.selectedService;

    } else if (step === 2) {
      const name  = document.getElementById('inputName')?.value.trim();
      const email = document.getElementById('inputEmail')?.value.trim();
      const phone = document.getElementById('inputPhone')?.value.trim();
      valid = !!(name && email && phone && state.selectedPayment);

    } else if (step === 3) {
      valid = !!state.selectedDate && !!state.selectedTime;

    } else if (step === 4) {
      valid = !!document.getElementById('confirmCheck')?.checked;

    } else if (step === 5) {
      valid = false;
    }

    nextBtn.disabled = !valid;
  }

  // Re-validate step 2 on input
  ['inputName','inputEmail','inputPhone','inputNotes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => validateStep(2));
  });

  // Re-validate step 4 on checkbox
  document.getElementById('confirmCheck')?.addEventListener('change', () => validateStep(4));

  // ─── Step 1: Service Selection ────────────────────────────
  serviceCards.forEach(card => {
    card.addEventListener('click', function () {
      serviceCards.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      state.selectedService = this.dataset.service;
      validateStep(1);
    });
  });

  // ─── Step 2: Payment Selection ────────────────────────────
  paymentCards.forEach(card => {
    card.addEventListener('click', function () {
      paymentCards.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');

      const method = this.dataset.payment;
      state.selectedPayment = method;

      const accountReveal = document.getElementById('accountReveal');
      const accountNumber = document.getElementById('accountNumber');
      const accountName   = document.getElementById('accountName');
      const accountMethod = document.getElementById('accountMethod');

      if (accountReveal) {
        accountNumber.textContent = this.dataset.account;
        accountName.textContent   = this.dataset.acname;
        accountMethod.textContent = method;
        accountReveal.classList.add('visible');
      }

      validateStep(2);
    });
  });

  // Copy button
  // BUG FIX #4: original code set innerHTML to a plain string on copy and
  // on reset, which permanently destroyed the id="pabCopyIcon" and
  // id="pabCopyText" child elements. Fixed by targeting only the text content
  // of those existing child elements instead of rebuilding the whole button.
  document.getElementById('copyAccountBtn')?.addEventListener('click', function () {
    const number = document.getElementById('accountNumber')?.textContent;
    if (!number) return;
    navigator.clipboard.writeText(number).then(() => {
      const icon = document.getElementById('pabCopyIcon');
      const text = document.getElementById('pabCopyText');
      if (icon) { icon.classList.remove('fa-regular', 'fa-copy'); icon.classList.add('fa-solid', 'fa-check'); }
      if (text) text.textContent = 'Copied!';
      this.classList.add('copied');
      setTimeout(() => {
        if (icon) { icon.classList.remove('fa-solid', 'fa-check'); icon.classList.add('fa-regular', 'fa-copy'); }
        if (text) text.textContent = 'Copy';
        this.classList.remove('copied');
      }, 2000);
    });
  });

  // ─── Step 3: Calendar ─────────────────────────────────────
  const MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  function renderCalendar() {
    const year  = state.calYear;
    const month = state.calMonth;

    calLabel.textContent = MONTHS[month] + ' ' + year;
    calDays.innerHTML = '';

    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today       = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.classList.add('cal-day', 'empty');
      calDays.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const btn  = document.createElement('button');
      const date = new Date(year, month, d);
      date.setHours(0, 0, 0, 0);

      btn.classList.add('cal-day');
      btn.textContent = d;

      if (date < today) btn.classList.add('disabled');
      if (state.selectedDate && date.toDateString() === state.selectedDate.toDateString())
        btn.classList.add('selected');
      if (date.toDateString() === today.toDateString())
        btn.classList.add('today');

      btn.addEventListener('click', function () {
        state.selectedDate = date;
        renderCalendar();
        validateStep(3);
      });

      calDays.appendChild(btn);
    }
  }

  // BUG FIX #7: prevent navigating to past months — calPrev is disabled when
  // already on the current month so users cannot browse into the past.
  calPrev.addEventListener('click', () => {
    const now = new Date();
    if (state.calYear === now.getFullYear() && state.calMonth === now.getMonth()) return;
    state.calMonth--;
    if (state.calMonth < 0) { state.calMonth = 11; state.calYear--; }
    renderCalendar();
  });

  calNext.addEventListener('click', () => {
    state.calMonth++;
    if (state.calMonth > 11) { state.calMonth = 0; state.calYear++; }
    renderCalendar();
  });

  // ─── Step 3: Time Slots ───────────────────────────────────
  timeslots.forEach(slot => {
    slot.addEventListener('click', function () {
      timeslots.forEach(s => s.classList.remove('selected'));
      this.classList.add('selected');
      state.selectedTime = this.dataset.time;
      validateStep(3);
    });
  });

  // ─── Step 4: Populate Confirm ─────────────────────────────
  function populateConfirm() {
    const dateStr = state.selectedDate
      ? state.selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : '—';

    document.getElementById('confirm-service').textContent  = state.selectedService  || '—';
    document.getElementById('confirm-date').textContent     = dateStr;
    document.getElementById('confirm-time').textContent     = state.selectedTime     || '—';
    document.getElementById('confirm-name').textContent     = document.getElementById('inputName')?.value.trim()  || '—';
    document.getElementById('confirm-phone').textContent    = document.getElementById('inputPhone')?.value.trim() || '—';
    document.getElementById('confirm-payment').textContent  = state.selectedPayment  || '—';
  }

// ─── Step 5: Upload Screenshot & Confirm Submission ───────
  document.getElementById('uploadTrigger')?.addEventListener('click', () => {
    document.getElementById('screenshotInput')?.click();
  });

  document.getElementById('screenshotInput')?.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const filenameEl = document.getElementById('uploadFilename');
    if (filenameEl) {
      filenameEl.textContent = file.name;
      filenameEl.classList.add('chosen');
    }

    handleConfirm();
  });

function handleConfirm() {
    const modal = document.getElementById('bookingModal');

    // ─── Save to Firestore ────────────────────────────────
    const dateStr = state.selectedDate
      ? state.selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : '—';

    addDoc(collection(db, 'agents', 'care-dental', 'logs'), {
      question:  document.getElementById('inputName')?.value.trim() || '—',
      answer:    `Service: ${state.selectedService || '—'} · Date: ${dateStr} · Time: ${state.selectedTime || '—'}`,
      category:  'Booking',
      timestamp: new Date(),
    }).catch(err => console.error('Firestore write failed:', err));

    if (congratsTimer1 !== null) { clearTimeout(congratsTimer1); congratsTimer1 = null; }
    if (congratsTimer2 !== null) { clearTimeout(congratsTimer2); congratsTimer2 = null; }
    const stale = modal?.querySelector('.congrats-overlay');
    if (stale) modal.removeChild(stale);

    const congrats = document.createElement('div');
    congrats.className = 'congrats-overlay';
    congrats.innerHTML = `
      <div class="congrats-icon"><i class="fa-solid fa-circle-check"></i></div>
      <span class="congrats-title">You're All Set!</span>
      <span class="congrats-sub">We look forward to seeing you. Take care of that smile!</span>
    `;
    modal.appendChild(congrats);

    congratsTimer1 = setTimeout(() => {
      congratsTimer1 = null;
      congrats.classList.add('fade-out');
      congratsTimer2 = setTimeout(() => {
        congratsTimer2 = null;
        closeModal();
        if (modal.contains(congrats)) modal.removeChild(congrats);
      }, 400);
    }, 3000);
  }

})();
