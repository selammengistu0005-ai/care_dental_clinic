(function () {
  'use strict';

  // ─── Inject Styles ───────────────────────────────────────────────────────────
  const css = `
    /* ── FAB Button ── */
    #cd-support-fab {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 9998;
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
      border: 2px solid rgba(46, 207, 187, 0.75);
      background: linear-gradient(135deg, #2ecfbb 0%, #2a9d8f 50%, #1f7a6e 100%);
      color: #fff;
      font-size: 1.3rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 15px rgba(46,207,187,0.4), 0 0 35px rgba(46,207,187,0.2);
      animation: cdBreath 3s ease-in-out infinite;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      outline: none;
    }
    #cd-support-fab::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 1px solid rgba(46,207,187,0.5);
      animation: cdOuterRing 3s ease-in-out infinite;
      pointer-events: none;
    }
    #cd-support-fab:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 0 20px rgba(46,207,187,0.7), 0 0 45px rgba(46,207,187,0.45);
    }
    #cd-support-fab .cd-fab-icon-open,
    #cd-support-fab .cd-fab-icon-close {
      position: absolute;
      transition: opacity 0.25s ease, transform 0.3s ease;
    }
    #cd-support-fab .cd-fab-icon-close {
      opacity: 0;
      transform: rotate(-90deg) scale(0.7);
    }
    #cd-support-fab.open .cd-fab-icon-open {
      opacity: 0;
      transform: rotate(90deg) scale(0.7);
    }
    #cd-support-fab.open .cd-fab-icon-close {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }

    /* ── Tooltip ── */
    #cd-support-fab .cd-fab-tooltip {
      position: absolute;
      right: calc(100% + 0.75rem);
      top: 50%;
      transform: translateY(-50%);
      background: #1a2a4a;
      color: #fff;
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      white-space: nowrap;
      padding: 0.4rem 0.75rem;
      border-radius: 999px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    #cd-support-fab:hover .cd-fab-tooltip {
      opacity: 1;
    }

    /* ── Panel ── */
    #cd-support-panel {
      position: fixed;
      bottom: 6.25rem;
      right: 2rem;
      z-index: 9999;
      width: 22rem;
      max-height: 80vh;
      background: #ffffff;
      border-radius: 1.5rem;
      box-shadow: 0 1.5rem 4rem rgba(0,0,0,0.14), 0 0 0 1px rgba(232,237,242,0.8);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transform: scale(0.92) translateY(1rem);
      transform-origin: bottom right;
      transition: opacity 0.3s cubic-bezier(0.34,1.56,0.64,1), transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }
    #cd-support-panel.open {
      opacity: 1;
      pointer-events: all;
      transform: scale(1) translateY(0);
    }

    /* ── Panel Header ── */
    .cd-panel-header {
      background: linear-gradient(135deg, #1a2a4a 0%, #223560 100%);
      padding: 1.25rem 1.5rem 1rem;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }
    .cd-panel-header::before {
      content: '';
      position: absolute;
      top: -1.5rem;
      right: -1.5rem;
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      background: rgba(46,207,187,0.12);
      pointer-events: none;
    }
    .cd-panel-header::after {
      content: '';
      position: absolute;
      bottom: -1rem;
      right: 2.5rem;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: rgba(46,207,187,0.07);
      pointer-events: none;
    }
    .cd-header-top {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }
    .cd-header-avatar {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      background: rgba(46,207,187,0.2);
      border: 1.5px solid rgba(46,207,187,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .cd-header-avatar i {
      font-size: 1rem;
      color: #2ecfbb;
    }
    .cd-header-text {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .cd-header-name {
      font-family: 'Georgia', serif;
      font-size: 0.95rem;
      font-weight: 400;
      color: #ffffff;
      letter-spacing: -0.01em;
    }
    .cd-header-status {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.68rem;
      color: #8a9bb5;
      letter-spacing: 0.03em;
    }
    .cd-status-dot {
      width: 0.45rem;
      height: 0.45rem;
      border-radius: 50%;
      background: #2ecfbb;
      animation: cdPulse 2s ease-in-out infinite;
      flex-shrink: 0;
    }
    .cd-header-subtitle {
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.78rem;
      color: #7a8fa8;
      line-height: 1.5;
    }

    /* ── Home View ── */
    .cd-home-view,
    .cd-detail-view {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }
    .cd-home-view.hidden,
    .cd-detail-view.hidden {
      display: none;
    }

    /* ── Buttons List ── */
    .cd-buttons-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 1rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      scrollbar-width: thin;
      scrollbar-color: #e8edf2 transparent;
    }
    .cd-buttons-scroll::-webkit-scrollbar { width: 4px; }
    .cd-buttons-scroll::-webkit-scrollbar-track { background: transparent; }
    .cd-buttons-scroll::-webkit-scrollbar-thumb { background: #e8edf2; border-radius: 4px; }

    .cd-section-label {
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #9aabb8;
      padding: 0.25rem 0 0.1rem;
    }

    .cd-topic-btn {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 0.875rem 1rem;
      background: #f8f9fb;
      border: 1px solid #e8edf2;
      border-radius: 0.875rem;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
      text-align: left;
      width: 100%;
      outline: none;
    }
    .cd-topic-btn:hover {
      background: #f0faf8;
      border-color: #20b79a;
      transform: translateX(2px);
      box-shadow: 0 4px 12px rgba(32,183,154,0.1);
    }
    .cd-topic-icon {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.625rem;
      background: rgba(32,183,154,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.2s ease;
    }
    .cd-topic-btn:hover .cd-topic-icon {
      background: rgba(32,183,154,0.18);
    }
    .cd-topic-icon i {
      font-size: 0.95rem;
      color: #20b79a;
    }
    .cd-topic-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .cd-topic-title {
      font-family: 'Georgia', serif;
      font-size: 0.88rem;
      color: #1b1f23;
      font-weight: 400;
      letter-spacing: -0.01em;
    }
    .cd-topic-hint {
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.7rem;
      color: #9aabb8;
      line-height: 1.4;
    }
    .cd-topic-arrow {
      color: #c8d0da;
      font-size: 0.75rem;
      flex-shrink: 0;
      transition: color 0.2s ease, transform 0.2s ease;
    }
    .cd-topic-btn:hover .cd-topic-arrow {
      color: #20b79a;
      transform: translateX(2px);
    }

    /* ── Detail View ── */
    .cd-detail-topbar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.25rem;
      border-bottom: 1px solid #e8edf2;
      flex-shrink: 0;
      background: #f8f9fb;
    }
    .cd-back-btn {
      width: 1.875rem;
      height: 1.875rem;
      border-radius: 50%;
      border: 1px solid #e8edf2;
      background: #fff;
      color: #64748b;
      font-size: 0.75rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: border-color 0.2s, color 0.2s;
      outline: none;
    }
    .cd-back-btn:hover {
      border-color: #20b79a;
      color: #20b79a;
    }
    .cd-detail-topbar-text {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }
    .cd-detail-topbar-title {
      font-family: 'Georgia', serif;
      font-size: 0.9rem;
      color: #1b1f23;
    }
    .cd-detail-topbar-sub {
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.68rem;
      color: #9aabb8;
    }

    .cd-detail-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
      scrollbar-width: thin;
      scrollbar-color: #e8edf2 transparent;
    }
    .cd-detail-scroll::-webkit-scrollbar { width: 4px; }
    .cd-detail-scroll::-webkit-scrollbar-track { background: transparent; }
    .cd-detail-scroll::-webkit-scrollbar-thumb { background: #e8edf2; border-radius: 4px; }

    /* ── FAQ Item ── */
    .cd-faq-item {
      border: 1px solid #e8edf2;
      border-radius: 0.875rem;
      overflow: hidden;
      transition: border-color 0.2s ease;
    }
    .cd-faq-item.open {
      border-color: #20b79a;
    }
    .cd-faq-q {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      cursor: pointer;
      background: #ffffff;
      transition: background 0.2s ease;
      outline: none;
      border: none;
      width: 100%;
      text-align: left;
    }
    .cd-faq-q:hover {
      background: #f8f9fb;
    }
    .cd-faq-item.open .cd-faq-q {
      background: #f0faf8;
    }
    .cd-faq-q-text {
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.8rem;
      font-weight: 600;
      color: #1b1f23;
      line-height: 1.45;
      flex: 1;
    }
    .cd-faq-chevron {
      color: #9aabb8;
      font-size: 0.7rem;
      flex-shrink: 0;
      transition: transform 0.25s ease, color 0.2s ease;
    }
    .cd-faq-item.open .cd-faq-chevron {
      transform: rotate(180deg);
      color: #20b79a;
    }
    .cd-faq-a {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.32s ease, padding 0.25s ease;
      padding: 0 1rem;
      background: #f8fffe;
    }
    .cd-faq-item.open .cd-faq-a {
      max-height: 30rem;
      padding: 0 1rem 1rem;
    }
    .cd-faq-a-inner {
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.78rem;
      line-height: 1.7;
      color: #4a5568;
      border-top: 1px solid #e8edf2;
      padding-top: 0.75rem;
    }
    .cd-faq-a-inner ul {
      margin: 0.5rem 0 0.25rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .cd-faq-a-inner li {
      color: #4a5568;
    }
    .cd-faq-a-inner strong {
      color: #1b1f23;
      font-weight: 700;
    }
    .cd-faq-a-inner .cd-accent {
      color: #20b79a;
      font-weight: 600;
    }

    /* ── Info Card ── */
    .cd-info-card {
      background: #f8f9fb;
      border: 1px solid #e8edf2;
      border-radius: 0.875rem;
      padding: 1rem 1.125rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .cd-info-card-title {
      font-family: 'Georgia', serif;
      font-size: 0.85rem;
      color: #1b1f23;
    }
    .cd-info-row {
      display: flex;
      align-items: flex-start;
      gap: 0.625rem;
    }
    .cd-info-row i {
      color: #20b79a;
      font-size: 0.8rem;
      margin-top: 0.15rem;
      flex-shrink: 0;
    }
    .cd-info-row span {
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.775rem;
      color: #4a5568;
      line-height: 1.55;
    }

    /* ── Service Row ── */
    .cd-service-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0;
      border-bottom: 1px solid #f0f2f5;
    }
    .cd-service-row:last-child { border-bottom: none; }
    .cd-service-row-icon {
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      background: rgba(32,183,154,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .cd-service-row-icon i { font-size: 0.8rem; color: #20b79a; }
    .cd-service-row-body { flex: 1; display: flex; flex-direction: column; gap: 0.1rem; }
    .cd-service-row-name {
      font-family: 'Georgia', serif;
      font-size: 0.825rem;
      color: #1b1f23;
    }
    .cd-service-row-dur {
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.68rem;
      color: #20b79a;
    }

    /* ── Payment Row ── */
    .cd-payment-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.55rem 0;
      border-bottom: 1px solid #f0f2f5;
    }
    .cd-payment-row:last-child { border-bottom: none; }
    .cd-payment-row-icon {
      width: 1.875rem;
      height: 1.875rem;
      border-radius: 50%;
      background: rgba(32,183,154,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .cd-payment-row-icon i { font-size: 0.75rem; color: #20b79a; }
    .cd-payment-row-name {
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.775rem;
      font-weight: 600;
      color: #1b1f23;
    }

    /* ── Step Row ── */
    .cd-step-row {
      display: flex;
      align-items: flex-start;
      gap: 0.875rem;
    }
    .cd-step-num {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 50%;
      background: #20b79a;
      color: #fff;
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.72rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 0.1rem;
    }
    .cd-step-body { display: flex; flex-direction: column; gap: 0.15rem; }
    .cd-step-title {
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.8rem;
      font-weight: 700;
      color: #1b1f23;
    }
    .cd-step-desc {
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.73rem;
      color: #64748b;
      line-height: 1.5;
    }
    .cd-step-connector {
      width: 1px;
      height: 0.75rem;
      background: #e0e8ee;
      margin: 0.1rem 0 0.1rem 0.875rem;
    }

    /* ── Stat Row ── */
    .cd-stats-row {
      display: flex;
      gap: 0.75rem;
    }
    .cd-stat-pill {
      flex: 1;
      background: #f0faf8;
      border: 1px solid rgba(32,183,154,0.2);
      border-radius: 0.75rem;
      padding: 0.75rem 0.625rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
    }
    .cd-stat-pill-num {
      font-family: 'Georgia', serif;
      font-size: 1.05rem;
      color: #1b1f23;
    }
    .cd-stat-pill-label {
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.62rem;
      color: #64748b;
      text-align: center;
      line-height: 1.3;
    }

    /* ── CTA Button ── */
    .cd-cta-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.875rem 1.5rem;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #2ecfbb 0%, #2a9d8f 50%, #1f7a6e 100%);
      color: #fff;
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(32,183,154,0.28);
      transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
      outline: none;
      margin-top: 0.25rem;
      text-decoration: none;
    }
    .cd-cta-btn:hover {
      transform: translateY(-2px);
      filter: brightness(1.06);
      box-shadow: 0 12px 28px rgba(32,183,154,0.38);
    }
    .cd-cta-btn i { font-size: 0.85rem; }

    .cd-cta-btn-outline {
      background: transparent;
      border: 1.5px solid #20b79a;
      color: #20b79a;
      box-shadow: none;
    }
    .cd-cta-btn-outline:hover {
      background: rgba(32,183,154,0.06);
      box-shadow: 0 4px 12px rgba(32,183,154,0.15);
    }

    /* ── Panel Footer ── */
    .cd-panel-footer {
      padding: 0.625rem 1.25rem 0.875rem;
      border-top: 1px solid #f0f2f5;
      text-align: center;
      flex-shrink: 0;
    }
    .cd-panel-footer span {
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 0.65rem;
      color: #b0bec8;
    }
    .cd-panel-footer strong {
      color: #8a9bb5;
      font-weight: 600;
    }

    /* ── Animations ── */
    @keyframes cdBreath {
      0%, 100% {
        border-color: rgba(46,207,187,0.45);
        box-shadow: 0 0 10px rgba(46,207,187,0.25), 0 0 20px rgba(46,207,187,0.15);
      }
      50% {
        border-color: rgba(46,207,187,1);
        box-shadow: 0 0 20px rgba(46,207,187,0.7), 0 0 45px rgba(46,207,187,0.45);
      }
    }
    @keyframes cdOuterRing {
      0%, 100% { opacity: 0.35; transform: scale(1); }
      50% { opacity: 0.9; transform: scale(1.06); }
    }
    @keyframes cdPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }

    /* ── Mobile ── */
    @media (max-width: 480px) {
      #cd-support-panel {
        width: calc(100vw - 2rem);
        right: 1rem;
        bottom: 5.5rem;
      }
      #cd-support-fab {
        right: 1rem;
        bottom: 1.25rem;
      }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ─── Data ────────────────────────────────────────────────────────────────────

  const TOPICS = [
    {
      id: 'services',
      icon: 'fa-solid fa-tooth',
      title: 'Our Services',
      hint: 'What we treat & how long it takes',
    },
    {
      id: 'booking',
      icon: 'fa-solid fa-calendar-days',
      title: 'How to Book',
      hint: 'Step-by-step booking guide',
    },
    {
      id: 'payment',
      icon: 'fa-solid fa-building-columns',
      title: 'Payment Methods',
      hint: 'Accepted banks & mobile wallets',
    },
    {
      id: 'hours',
      icon: 'fa-solid fa-clock',
      title: 'Hours & Contact',
      hint: 'Opening times, phone & address',
    },
    {
      id: 'about',
      icon: 'fa-solid fa-shield-heart',
      title: 'About the Clinic',
      hint: 'Our team, mission & values',
    },
  ];

  const DETAIL_CONTENT = {

    services: {
      topbarTitle: 'Our Services',
      topbarSub: '6 treatments available',
      render: function () {
        return `
          <div class="cd-info-card">
            <span class="cd-info-card-title">All Treatments We Offer</span>
            <div class="cd-service-row">
              <div class="cd-service-row-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
              <div class="cd-service-row-body">
                <span class="cd-service-row-name">Teeth Whitening</span>
                <span class="cd-service-row-dur"><i class="fa-regular fa-clock"></i> 60 min</span>
              </div>
            </div>
            <div class="cd-service-row">
              <div class="cd-service-row-icon"><i class="fa-solid fa-tooth"></i></div>
              <div class="cd-service-row-body">
                <span class="cd-service-row-name">Dental Implants</span>
                <span class="cd-service-row-dur"><i class="fa-regular fa-clock"></i> 90 min</span>
              </div>
            </div>
            <div class="cd-service-row">
              <div class="cd-service-row-icon"><i class="fa-solid fa-shield-heart"></i></div>
              <div class="cd-service-row-body">
                <span class="cd-service-row-name">Preventive Care</span>
                <span class="cd-service-row-dur"><i class="fa-regular fa-clock"></i> 45 min</span>
              </div>
            </div>
            <div class="cd-service-row">
              <div class="cd-service-row-icon"><i class="fa-solid fa-face-smile"></i></div>
              <div class="cd-service-row-body">
                <span class="cd-service-row-name">Smile Makeover</span>
                <span class="cd-service-row-dur"><i class="fa-regular fa-clock"></i> 120 min</span>
              </div>
            </div>
            <div class="cd-service-row">
              <div class="cd-service-row-icon"><i class="fa-solid fa-teeth"></i></div>
              <div class="cd-service-row-body">
                <span class="cd-service-row-name">Orthodontics</span>
                <span class="cd-service-row-dur"><i class="fa-regular fa-clock"></i> 60 min</span>
              </div>
            </div>
            <div class="cd-service-row">
              <div class="cd-service-row-icon"><i class="fa-solid fa-syringe"></i></div>
              <div class="cd-service-row-body">
                <span class="cd-service-row-name">Dental Surgery</span>
                <span class="cd-service-row-dur"><i class="fa-regular fa-clock"></i> 75 min</span>
              </div>
            </div>
          </div>

          <div class="cd-faq-item">
            <button class="cd-faq-q">
              <span class="cd-faq-q-text">Which service is right for me?</span>
              <i class="fa-solid fa-chevron-down cd-faq-chevron"></i>
            </button>
            <div class="cd-faq-a">
              <div class="cd-faq-a-inner">
                Not sure where to start? Here's a quick guide:
                <ul>
                  <li><strong>Stained/yellow teeth?</strong> → Teeth Whitening</li>
                  <li><strong>Missing a tooth?</strong> → Dental Implants</li>
                  <li><strong>Just a routine checkup?</strong> → Preventive Care</li>
                  <li><strong>Crooked teeth?</strong> → Orthodontics</li>
                  <li><strong>Multiple concerns?</strong> → Smile Makeover</li>
                  <li><strong>Tooth pain or extraction?</strong> → Dental Surgery</li>
                </ul>
                Book a consultation and our team will advise the best plan for you.
              </div>
            </div>
          </div>

          <div class="cd-faq-item">
            <button class="cd-faq-q">
              <span class="cd-faq-q-text">Do you offer cosmetic & emergency services?</span>
              <i class="fa-solid fa-chevron-down cd-faq-chevron"></i>
            </button>
            <div class="cd-faq-a">
              <div class="cd-faq-a-inner">
                Yes! In addition to the 6 bookable treatments, we also offer:
                <ul>
                  <li><strong>Cosmetic Dentistry</strong> — veneers, bonding & contouring</li>
                  <li><strong>Root Canal Therapy</strong> — pain relief & tooth saving</li>
                  <li><strong>Emergency Care</strong> — prompt care when you need it most</li>
                </ul>
                Visit our <a href="services.html" style="color:#20b79a;font-weight:600;">Services page</a> for the full list.
              </div>
            </div>
          </div>

          <button class="cd-cta-btn" id="cd-book-from-services">
            <i class="fa-solid fa-calendar-days"></i> Book an Appointment
          </button>
        `;
      }
    },

    booking: {
      topbarTitle: 'How to Book',
      topbarSub: '5 simple steps',
      render: function () {
        return `
          <div class="cd-info-card">
            <span class="cd-info-card-title">Booking Process — Step by Step</span>
            <div class="cd-step-row">
              <div class="cd-step-num">1</div>
              <div class="cd-step-body">
                <span class="cd-step-title">Choose a Service</span>
                <span class="cd-step-desc">Select from 6 treatments — each shows its duration.</span>
              </div>
            </div>
            <div class="cd-step-connector"></div>
            <div class="cd-step-row">
              <div class="cd-step-num">2</div>
              <div class="cd-step-body">
                <span class="cd-step-title">Your Information & Payment</span>
                <span class="cd-step-desc">Fill in your name, email, phone, and choose a payment method.</span>
              </div>
            </div>
            <div class="cd-step-connector"></div>
            <div class="cd-step-row">
              <div class="cd-step-num">3</div>
              <div class="cd-step-body">
                <span class="cd-step-title">Pick a Date & Time</span>
                <span class="cd-step-desc">Use the calendar to pick a future date and a time slot.</span>
              </div>
            </div>
            <div class="cd-step-connector"></div>
            <div class="cd-step-row">
              <div class="cd-step-num">4</div>
              <div class="cd-step-body">
                <span class="cd-step-title">Confirm Booking</span>
                <span class="cd-step-desc">Review all your details and tick the confirmation checkbox.</span>
              </div>
            </div>
            <div class="cd-step-connector"></div>
            <div class="cd-step-row">
              <div class="cd-step-num">5</div>
              <div class="cd-step-body">
                <span class="cd-step-title">Upload Payment Screenshot</span>
                <span class="cd-step-desc">Send a screenshot of your payment to confirm the appointment.</span>
              </div>
            </div>
          </div>

          <div class="cd-faq-item">
            <button class="cd-faq-q">
              <span class="cd-faq-q-text">Can I book on the same day?</span>
              <i class="fa-solid fa-chevron-down cd-faq-chevron"></i>
            </button>
            <div class="cd-faq-a">
              <div class="cd-faq-a-inner">
                The calendar only allows you to select <strong>today or any future date</strong> — past dates are disabled automatically. Same-day slots are available as long as the clinic is still open. We recommend calling ahead to confirm same-day availability: <span class="cd-accent">+1 (555) 012-3456</span>.
              </div>
            </div>
          </div>

          <div class="cd-faq-item">
            <button class="cd-faq-q">
              <span class="cd-faq-q-text">What time slots are available?</span>
              <i class="fa-solid fa-chevron-down cd-faq-chevron"></i>
            </button>
            <div class="cd-faq-a">
              <div class="cd-faq-a-inner">
                Available time slots are:
                <ul>
                  <li>09:00 AM, 10:00 AM, 11:00 AM, 12:00 PM</li>
                  <li>02:00 PM, 03:00 PM, 04:00 PM, 05:00 PM</li>
                </ul>
                Monday–Friday slots run until <strong>5:00 PM</strong>. On <strong>Saturday</strong>, the clinic closes at 2:00 PM so only morning slots apply.
              </div>
            </div>
          </div>

          <div class="cd-faq-item">
            <button class="cd-faq-q">
              <span class="cd-faq-q-text">How do I cancel or reschedule?</span>
              <i class="fa-solid fa-chevron-down cd-faq-chevron"></i>
            </button>
            <div class="cd-faq-a">
              <div class="cd-faq-a-inner">
                To cancel or reschedule, please contact us directly:
                <ul>
                  <li><strong>Phone:</strong> +1 (555) 012-3456</li>
                  <li><strong>Email:</strong> hello@caredental.com</li>
                </ul>
                We kindly ask for at least <strong>24 hours notice</strong> so we can offer the slot to another patient.
              </div>
            </div>
          </div>

          <div class="cd-faq-item">
            <button class="cd-faq-q">
              <span class="cd-faq-q-text">What should I bring to my first visit?</span>
              <i class="fa-solid fa-chevron-down cd-faq-chevron"></i>
            </button>
            <div class="cd-faq-a">
              <div class="cd-faq-a-inner">
                For your first visit, please bring:
                <ul>
                  <li>A valid photo ID</li>
                  <li>Your payment confirmation screenshot</li>
                  <li>Any previous dental records if available</li>
                  <li>A list of current medications (if any)</li>
                </ul>
                Arrive <strong>5–10 minutes early</strong> so we can get you checked in comfortably.
              </div>
            </div>
          </div>

          <button class="cd-cta-btn" id="cd-book-from-booking">
            <i class="fa-solid fa-calendar-days"></i> Book Now
          </button>
        `;
      }
    },

    payment: {
      topbarTitle: 'Payment Methods',
      topbarSub: '7 options accepted',
      render: function () {
        return `
          <div class="cd-info-card">
            <span class="cd-info-card-title">Accepted Payment Options</span>
            <div class="cd-payment-row">
              <div class="cd-payment-row-icon"><i class="fa-solid fa-mobile-screen-button"></i></div>
              <span class="cd-payment-row-name">Telebirr</span>
            </div>
            <div class="cd-payment-row">
              <div class="cd-payment-row-icon"><i class="fa-solid fa-building-columns"></i></div>
              <span class="cd-payment-row-name">Awash Bank</span>
            </div>
            <div class="cd-payment-row">
              <div class="cd-payment-row-icon"><i class="fa-solid fa-landmark"></i></div>
              <span class="cd-payment-row-name">CBE Birr</span>
            </div>
            <div class="cd-payment-row">
              <div class="cd-payment-row-icon"><i class="fa-solid fa-building-columns"></i></div>
              <span class="cd-payment-row-name">Zemen Bank</span>
            </div>
            <div class="cd-payment-row">
              <div class="cd-payment-row-icon"><i class="fa-solid fa-building-columns"></i></div>
              <span class="cd-payment-row-name">Tsedey Bank</span>
            </div>
            <div class="cd-payment-row">
              <div class="cd-payment-row-icon"><i class="fa-solid fa-building-columns"></i></div>
              <span class="cd-payment-row-name">Dashen Bank</span>
            </div>
            <div class="cd-payment-row">
              <div class="cd-payment-row-icon"><i class="fa-solid fa-building-columns"></i></div>
              <span class="cd-payment-row-name">Wegagen Bank</span>
            </div>
          </div>

          <div class="cd-faq-item">
            <button class="cd-faq-q">
              <span class="cd-faq-q-text">How does the payment process work?</span>
              <i class="fa-solid fa-chevron-down cd-faq-chevron"></i>
            </button>
            <div class="cd-faq-a">
              <div class="cd-faq-a-inner">
                During booking (Step 2), you select your preferred payment method. The clinic's <strong>account number</strong> and <strong>account name</strong> will appear — you can copy the number with one tap. Transfer your payment, then in <strong>Step 5</strong> upload a screenshot of the transaction to confirm your appointment.
              </div>
            </div>
          </div>

          <div class="cd-faq-item">
            <button class="cd-faq-q">
              <span class="cd-faq-q-text">Do I pay before or at the clinic?</span>
              <i class="fa-solid fa-chevron-down cd-faq-chevron"></i>
            </button>
            <div class="cd-faq-a">
              <div class="cd-faq-a-inner">
                Payment is made <strong>before your visit</strong> as part of the online booking process. This confirms and secures your appointment slot. The screenshot you upload serves as proof of payment — our team reviews it before your visit.
              </div>
            </div>
          </div>

          <div class="cd-faq-item">
            <button class="cd-faq-q">
              <span class="cd-faq-q-text">What if I transferred to the wrong account?</span>
              <i class="fa-solid fa-chevron-down cd-faq-chevron"></i>
            </button>
            <div class="cd-faq-a">
              <div class="cd-faq-a-inner">
                Please contact us immediately if a transfer issue occurs:
                <ul>
                  <li><strong>Phone:</strong> +1 (555) 012-3456</li>
                  <li><strong>Email:</strong> hello@caredental.com</li>
                </ul>
                Always use the account number displayed inside the booking form — it is specific to <span class="cd-accent">Care Dental Clinic</span>.
              </div>
            </div>
          </div>

          <button class="cd-cta-btn" id="cd-book-from-payment">
            <i class="fa-solid fa-calendar-days"></i> Book & Pay Now
          </button>
        `;
      }
    },

    hours: {
      topbarTitle: 'Hours & Contact',
      topbarSub: 'We\'re here for you',
      render: function () {
        return `
          <div class="cd-info-card">
            <span class="cd-info-card-title">Opening Hours</span>
            <div class="cd-info-row">
              <i class="fa-solid fa-clock"></i>
              <span><strong>Monday – Friday:</strong> 8:00 AM – 6:00 PM</span>
            </div>
            <div class="cd-info-row">
              <i class="fa-solid fa-clock"></i>
              <span><strong>Saturday:</strong> 9:00 AM – 2:00 PM</span>
            </div>
            <div class="cd-info-row">
              <i class="fa-solid fa-xmark" style="color:#e05a5a;"></i>
              <span><strong>Sunday:</strong> Closed</span>
            </div>
          </div>

          <div class="cd-info-card">
            <span class="cd-info-card-title">Phone Numbers</span>
            <div class="cd-info-row">
              <i class="fa-solid fa-phone"></i>
              <span>+1 (555) 012-3456</span>
            </div>
            <div class="cd-info-row">
              <i class="fa-solid fa-phone"></i>
              <span>+1 (555) 098-7654</span>
            </div>
            <div class="cd-info-row">
              <i class="fa-solid fa-phone"></i>
              <span>+1 (555) 246-8101</span>
            </div>
            <div class="cd-info-row">
              <i class="fa-solid fa-envelope"></i>
              <span>hello@caredental.com</span>
            </div>
          </div>

          <div class="cd-info-card">
            <span class="cd-info-card-title">Our Location</span>
            <div class="cd-info-row">
              <i class="fa-solid fa-location-dot"></i>
              <span>24 Bright Smile Avenue, Suite 101, Downtown, New York, NY 10001</span>
            </div>
          </div>

          <div class="cd-faq-item">
            <button class="cd-faq-q">
              <span class="cd-faq-q-text">Do you accept walk-ins?</span>
              <i class="fa-solid fa-chevron-down cd-faq-chevron"></i>
            </button>
            <div class="cd-faq-a">
              <div class="cd-faq-a-inner">
                We <strong>strongly recommend booking in advance</strong> to guarantee your slot. Walk-ins may be seen if a slot is available, but we cannot promise availability without a prior booking. For the best experience, book online or call us ahead of your visit.
              </div>
            </div>
          </div>

          <div class="cd-faq-item">
            <button class="cd-faq-q">
              <span class="cd-faq-q-text">What if I have a dental emergency?</span>
              <i class="fa-solid fa-chevron-down cd-faq-chevron"></i>
            </button>
            <div class="cd-faq-a">
              <div class="cd-faq-a-inner">
                We offer <strong>Emergency Care</strong> for urgent dental situations. Call us immediately at <span class="cd-accent">+1 (555) 012-3456</span> and we will prioritise you. For after-hours emergencies, please call all three numbers as staff availability may vary.
              </div>
            </div>
          </div>

          <a href="services.html" class="cd-cta-btn cd-cta-btn-outline" style="text-align:center;">
            <i class="fa-solid fa-arrow-right"></i> View All Services
          </a>
        `;
      }
    },

    about: {
      topbarTitle: 'About the Clinic',
      topbarSub: 'Our story & team',
      render: function () {
        return `
          <div class="cd-stats-row">
            <div class="cd-stat-pill">
              <span class="cd-stat-pill-num">10+</span>
              <span class="cd-stat-pill-label">Years of Experience</span>
            </div>
            <div class="cd-stat-pill">
              <span class="cd-stat-pill-num">1,000+</span>
              <span class="cd-stat-pill-label">Happy Patients</span>
            </div>
            <div class="cd-stat-pill">
              <span class="cd-stat-pill-num">97%</span>
              <span class="cd-stat-pill-label">Satisfaction Rate</span>
            </div>
          </div>

          <div class="cd-faq-item">
            <button class="cd-faq-q">
              <span class="cd-faq-q-text">Who are Care Dental Clinic?</span>
              <i class="fa-solid fa-chevron-down cd-faq-chevron"></i>
            </button>
            <div class="cd-faq-a">
              <div class="cd-faq-a-inner">
                Care Dental Clinic was founded on the belief that every person deserves <strong>exceptional dental care</strong> in a welcoming, stress-free environment. Our experienced team combines the latest clinical techniques with a genuinely compassionate approach — making every visit comfortable, personal, and professional.
              </div>
            </div>
          </div>

          <div class="cd-faq-item">
            <button class="cd-faq-q">
              <span class="cd-faq-q-text">Who is on your team?</span>
              <i class="fa-solid fa-chevron-down cd-faq-chevron"></i>
            </button>
            <div class="cd-faq-a">
              <div class="cd-faq-a-inner">
                Our dedicated team includes:
                <ul>
                  <li><strong>Dentists</strong> — general & restorative dental care</li>
                  <li><strong>Oral Surgeons</strong> — extractions, implants & advanced procedures</li>
                  <li><strong>Hygienists</strong> — preventive care & thorough cleanings</li>
                  <li><strong>Orthodontists</strong> — braces, aligners & bite correction</li>
                  <li><strong>Receptionists</strong> — always ready to help & assist</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="cd-faq-item">
            <button class="cd-faq-q">
              <span class="cd-faq-q-text">What are your core values?</span>
              <i class="fa-solid fa-chevron-down cd-faq-chevron"></i>
            </button>
            <div class="cd-faq-a">
              <div class="cd-faq-a-inner">
                Everything we do is guided by four values:
                <ul>
                  <li><strong>Integrity</strong> — honest, transparent & accountable</li>
                  <li><strong>Compassion</strong> — empathy & warmth in every interaction</li>
                  <li><strong>Excellence</strong> — the highest clinical standards</li>
                  <li><strong>Innovation</strong> — latest dental technologies & practices</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="cd-faq-item">
            <button class="cd-faq-q">
              <span class="cd-faq-q-text">What is your mission?</span>
              <i class="fa-solid fa-chevron-down cd-faq-chevron"></i>
            </button>
            <div class="cd-faq-a">
              <div class="cd-faq-a-inner">
                To provide every patient with <strong>personalised, compassionate dental care</strong> that prioritises their comfort, health, and confidence. We strive to make high-quality dentistry accessible, transparent, and genuinely life-changing — <span class="cd-accent">one smile at a time.</span>
              </div>
            </div>
          </div>

          <a href="about.html" class="cd-cta-btn cd-cta-btn-outline">
            <i class="fa-solid fa-arrow-right"></i> Learn More About Us
          </a>
          <button class="cd-cta-btn" id="cd-book-from-about" style="margin-top:0.5rem;">
            <i class="fa-solid fa-calendar-days"></i> Book an Appointment
          </button>
        `;
      }
    }

  };

  // ─── Build DOM ───────────────────────────────────────────────────────────────

  // FAB
  const fab = document.createElement('button');
  fab.id = 'cd-support-fab';
  fab.setAttribute('aria-label', 'Customer Support');
  fab.innerHTML = `
    <span class="cd-fab-tooltip">Need help?</span>
    <i class="fa-solid fa-comment-dots cd-fab-icon-open"></i>
    <i class="fa-solid fa-xmark cd-fab-icon-close"></i>
  `;
  document.body.appendChild(fab);

  // Panel
  const panel = document.createElement('div');
  panel.id = 'cd-support-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Customer Support');
  panel.innerHTML = `
    <!-- Header -->
    <div class="cd-panel-header">
      <div class="cd-header-top">
        <div class="cd-header-avatar">
          <i class="fa-solid fa-tooth"></i>
        </div>
        <div class="cd-header-text">
          <span class="cd-header-name">Care Dental Support</span>
          <span class="cd-header-status">
            <span class="cd-status-dot"></span>
            We're online &amp; ready to help
          </span>
        </div>
      </div>
      <p class="cd-header-subtitle">Hi there! 👋 What can we help you with today?</p>
    </div>

    <!-- Home View -->
    <div class="cd-home-view" id="cd-home-view">
      <div class="cd-buttons-scroll">
        <span class="cd-section-label">Quick Help Topics</span>
        ${TOPICS.map(t => `
          <button class="cd-topic-btn" data-topic="${t.id}">
            <div class="cd-topic-icon"><i class="${t.icon}"></i></div>
            <div class="cd-topic-body">
              <span class="cd-topic-title">${t.title}</span>
              <span class="cd-topic-hint">${t.hint}</span>
            </div>
            <i class="fa-solid fa-chevron-right cd-topic-arrow"></i>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Detail View -->
    <div class="cd-detail-view hidden" id="cd-detail-view">
      <div class="cd-detail-topbar">
        <button class="cd-back-btn" id="cd-back-btn" aria-label="Back">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <div class="cd-detail-topbar-text">
          <span class="cd-detail-topbar-title" id="cd-detail-topbar-title">—</span>
          <span class="cd-detail-topbar-sub" id="cd-detail-topbar-sub">—</span>
        </div>
      </div>
      <div class="cd-detail-scroll" id="cd-detail-scroll"></div>
    </div>

    <!-- Footer -->
    <div class="cd-panel-footer">
      <span>Powered by <strong>Care Dental Clinic</strong> · Your smile, our priority.</span>
    </div>
  `;
  document.body.appendChild(panel);

  // ─── Logic ───────────────────────────────────────────────────────────────────

  let isOpen = false;

  function openPanel() {
    isOpen = true;
    fab.classList.add('open');
    panel.classList.add('open');
  }

  function closePanel() {
    isOpen = false;
    fab.classList.remove('open');
    panel.classList.remove('open');
  }

  fab.addEventListener('click', function () {
    isOpen ? closePanel() : openPanel();
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (isOpen && !panel.contains(e.target) && e.target !== fab && !fab.contains(e.target)) {
      closePanel();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closePanel();
  });

  // ── Topic navigation ──
  const homeView   = panel.querySelector('#cd-home-view');
  const detailView = panel.querySelector('#cd-detail-view');
  const detailScroll       = panel.querySelector('#cd-detail-scroll');
  const detailTopbarTitle  = panel.querySelector('#cd-detail-topbar-title');
  const detailTopbarSub    = panel.querySelector('#cd-detail-topbar-sub');
  const backBtn            = panel.querySelector('#cd-back-btn');

  function showTopic(topicId) {
    const content = DETAIL_CONTENT[topicId];
    if (!content) return;

    detailTopbarTitle.textContent = content.topbarTitle;
    detailTopbarSub.textContent   = content.topbarSub;
    detailScroll.innerHTML        = content.render();

    homeView.classList.add('hidden');
    detailView.classList.remove('hidden');

    // Attach FAQ toggles
    detailScroll.querySelectorAll('.cd-faq-item').forEach(function (item) {
      const qBtn = item.querySelector('.cd-faq-q');
      qBtn.addEventListener('click', function () {
        const isCurrentlyOpen = item.classList.contains('open');
        // Close all others
        detailScroll.querySelectorAll('.cd-faq-item.open').forEach(function (o) {
          o.classList.remove('open');
        });
        if (!isCurrentlyOpen) item.classList.add('open');
      });
    });

    // Attach Book Now buttons
    ['cd-book-from-services', 'cd-book-from-booking', 'cd-book-from-payment', 'cd-book-from-about'].forEach(function (id) {
      const btn = detailScroll.querySelector('#' + id);
      if (btn) {
        btn.addEventListener('click', function () {
          closePanel();
          // Trigger existing booking modal — fire click on any .btn-primary or .cta-book that contains "book"
          const bookTrigger = document.querySelector('.cta-book, .btn-primary');
          if (bookTrigger) {
            bookTrigger.click();
          }
        });
      }
    });

    detailScroll.scrollTop = 0;
  }

  panel.querySelectorAll('.cd-topic-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showTopic(this.dataset.topic);
    });
  });

  backBtn.addEventListener('click', function () {
    detailView.classList.add('hidden');
    homeView.classList.remove('hidden');
  });

})();