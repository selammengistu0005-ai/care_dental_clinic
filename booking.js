(function () {

  // ─── State ───────────────────────────────────────────────
  const state = {
    currentStep: 1,
    selectedService: null,
    selectedDate: null,
    selectedTime: null,
    calYear: null,
    calMonth: null,
  };

  // ─── Elements ────────────────────────────────────────────
  const overlay     = document.getElementById('bookingOverlay');
  const modal       = document.getElementById('bookingModal');
  const closeBtn    = document.getElementById('bookingClose');
  const nextBtn     = document.getElementById('bookingNext');
  const backBtn     = document.getElementById('bookingBack');
  const calPrev     = document.getElementById('calPrev');
  const calNext     = document.getElementById('calNext');
  const calLabel    = document.getElementById('calMonthLabel');
  const calDays     = document.getElementById('calendarDays');
  const timeslots   = document.querySelectorAll('.timeslot');
  const serviceCards = document.querySelectorAll('.booking-service-card');

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

  function resetModal() {
    state.currentStep = 1;
    state.selectedService = null;
    state.selectedDate = null;
    state.selectedTime = null;

    const now = new Date();
    state.calYear  = now.getFullYear();
    state.calMonth = now.getMonth();

    serviceCards.forEach(c => c.classList.remove('selected'));
    timeslots.forEach(t => t.classList.remove('selected'));
    document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));

    const nameEl  = document.getElementById('inputName');
    const emailEl = document.getElementById('inputEmail');
    const phoneEl = document.getElementById('inputPhone');
    const notesEl = document.getElementById('inputNotes');
    const check   = document.getElementById('confirmCheck');
    if (nameEl)  nameEl.value  = '';
    if (emailEl) emailEl.value = '';
    if (phoneEl) phoneEl.value = '';
    if (notesEl) notesEl.value = '';
    if (check)   check.checked = false;

    goToStep(1);
    renderCalendar();
  }

  // ─── Trigger: all "Book an Appointment" buttons ──────────
  document.querySelectorAll('.btn-primary, .cta-book').forEach(btn => {
    const text = btn.textContent.trim().toLowerCase();
    if (text.includes('book') || text.includes('appointment')) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    }
  });

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  // ─── Step Navigation ──────────────────────────────────────
  const nextLabels = {
    1: 'Next: Choose Date & Time <i class="fa-solid fa-arrow-right"></i>',
    2: 'Next: Your Information <i class="fa-solid fa-arrow-right"></i>',
    3: 'Review Booking <i class="fa-solid fa-arrow-right"></i>',
    4: 'Confirm Booking <i class="fa-solid fa-arrow-right"></i>',
  };

  function goToStep(step) {
    // Hide all panels
    document.querySelectorAll('.booking-panel').forEach(p => p.classList.remove('active'));
    // Show target panel
    const panel = document.getElementById('panel-' + step);
    if (panel) panel.classList.add('active');

    // Update stepper
    document.querySelectorAll('.booking-step').forEach(s => {
      const n = parseInt(s.dataset.step);
      s.classList.remove('active', 'completed');
      if (n === step) s.classList.add('active');
      if (n < step)  s.classList.add('completed');
    });

    // Update completed step circles to show checkmark
    document.querySelectorAll('.booking-step.completed .step-circle').forEach(c => {
      c.innerHTML = '<i class="fa-solid fa-check" style="font-size:0.7rem"></i>';
    });
    // Restore number for non-completed steps
    document.querySelectorAll('.booking-step:not(.completed) .step-circle').forEach(c => {
      const n = parseInt(c.closest('.booking-step').dataset.step);
      c.innerHTML = n;
    });

    // Back button
    if (step === 1) {
      backBtn.classList.add('hidden');
    } else {
      backBtn.classList.remove('hidden');
    }

    // Next button label
    nextBtn.innerHTML = nextLabels[step];

    // If step 4, populate confirm card
    if (step === 4) populateConfirm();

    // Validate next button
    validateStep(step);

    state.currentStep = step;
  }

  nextBtn.addEventListener('click', function () {
    if (nextBtn.disabled) return;

    if (state.currentStep === 4) {
      handleConfirm();
      return;
    }
    goToStep(state.currentStep + 1);
  });

  backBtn.addEventListener('click', function () {
    if (state.currentStep > 1) goToStep(state.currentStep - 1);
  });

  // ─── Validation ───────────────────────────────────────────
  function validateStep(step) {
    let valid = false;

    if (step === 1) {
      valid = !!state.selectedService;
    } else if (step === 2) {
      valid = !!state.selectedDate && !!state.selectedTime;
    } else if (step === 3) {
      const name  = document.getElementById('inputName')?.value.trim();
      const email = document.getElementById('inputEmail')?.value.trim();
      const phone = document.getElementById('inputPhone')?.value.trim();
      valid = !!(name && email && phone);
    } else if (step === 4) {
      valid = document.getElementById('confirmCheck')?.checked;
    }

    nextBtn.disabled = !valid;
  }

  // Re-validate step 3 on input
  ['inputName', 'inputEmail', 'inputPhone', 'inputNotes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => validateStep(3));
  });

  // Re-validate step 4 on checkbox
  const confirmCheck = document.getElementById('confirmCheck');
  if (confirmCheck) confirmCheck.addEventListener('change', () => validateStep(4));

  // ─── Step 1: Service Selection ────────────────────────────
  serviceCards.forEach(card => {
    card.addEventListener('click', function () {
      serviceCards.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      state.selectedService = this.dataset.service;
      validateStep(1);
    });
  });

  // ─── Step 2: Calendar ─────────────────────────────────────
  const MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  function renderCalendar() {
    const year  = state.calYear;
    const month = state.calMonth;

    calLabel.textContent = MONTHS[month] + ' ' + year;
    calDays.innerHTML = '';

    const firstDay  = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells before first day
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

      if (date < today) {
        btn.classList.add('disabled');
      }

      if (
        state.selectedDate &&
        date.toDateString() === state.selectedDate.toDateString()
      ) {
        btn.classList.add('selected');
      }

      if (date.toDateString() === today.toDateString()) {
        btn.classList.add('today');
      }

      btn.addEventListener('click', function () {
        state.selectedDate = date;
        renderCalendar();
        validateStep(2);
      });

      calDays.appendChild(btn);
    }
  }

  calPrev.addEventListener('click', function () {
    state.calMonth--;
    if (state.calMonth < 0) {
      state.calMonth = 11;
      state.calYear--;
    }
    renderCalendar();
  });

  calNext.addEventListener('click', function () {
    state.calMonth++;
    if (state.calMonth > 11) {
      state.calMonth = 0;
      state.calYear++;
    }
    renderCalendar();
  });

  // ─── Step 2: Time Slots ───────────────────────────────────
  timeslots.forEach(slot => {
    slot.addEventListener('click', function () {
      timeslots.forEach(s => s.classList.remove('selected'));
      this.classList.add('selected');
      state.selectedTime = this.dataset.time;
      validateStep(2);
    });
  });

  // ─── Step 4: Populate Confirm Card ───────────────────────
  function populateConfirm() {
    const dateStr = state.selectedDate
      ? state.selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : '—';

    document.getElementById('confirm-service').textContent = state.selectedService || '—';
    document.getElementById('confirm-date').textContent    = dateStr;
    document.getElementById('confirm-time').textContent    = state.selectedTime || '—';
    document.getElementById('confirm-name').textContent    = document.getElementById('inputName')?.value.trim() || '—';
    document.getElementById('confirm-phone').textContent   = document.getElementById('inputPhone')?.value.trim() || '—';
  }

  // ─── Step 4: Confirm Submission ───────────────────────────
  function handleConfirm() {
    nextBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Booking Confirmed!';
    nextBtn.disabled  = true;
    nextBtn.style.background = '#16a085';

    setTimeout(() => {
      closeModal();
      nextBtn.style.background = '';
    }, 2200);
  }

})();