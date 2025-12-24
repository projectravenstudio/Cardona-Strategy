class ContactModal extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._shadow.innerHTML = `
      <style>
        :host { all: initial; }
        :host * { box-sizing: border-box; }
        .contact-modal {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
        }
        .contact-modal.active { display: flex; }
        .contact-modal-content {
          background: #ffffff;
          border-radius: 16px;
          max-width: 440px;
          width: calc(100% - 48px);
          max-height: 95vh;
          height: auto;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          animation: slideUp 0.3s ease-out;
          transition: height 0.28s ease;
          position: relative;
          padding: 28px;
        }
        .contact-modal-flipper { position: relative; width: 100%; transition: transform 0.6s; transform-style: preserve-3d; }
        .contact-modal-flipper.flipped { transform: rotateY(180deg); }
        .contact-modal-front, .contact-modal-back { padding: 28px; width: 100%; backface-visibility: hidden; display: flex; flex-direction: column; gap: 16px; align-items: center; text-align: center; }
        .contact-modal-back { transform: rotateY(180deg); position: absolute; top: 0; left: 0; width: 100%; }
        .send-message-btn { min-width: 240px; width: auto; align-self: center; background-color: #043763; color: white; border: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer; margin-top: 12px; transition: all 0.2s; }
        .send-message-btn:hover { background-color: #0a4d8c; transform: translateY(-2px); }
        .contact-form { display: flex; flex-direction: column; gap: 8px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 12px; font-weight: 600; color: #1d1d1f; }
        .form-group input, .form-group textarea { padding: 12px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-family: inherit; font-size: 12px; transition: border-color 0.2s; }
        .form-group select { padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; font-family: inherit; font-size: 12px; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #043763; box-shadow: 0 0 0 3px rgba(4, 55, 99, 0.1); }
        .form-group textarea { resize: vertical; min-height: 20px; }
        .submit-btn { background-color: #043763; color: white; border: none; padding: 14px 24px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s; margin-top: 12px; }
        .submit-btn:hover { background-color: #0a4d8c; transform: translateY(-2px); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        .contact-modal-close { position: absolute; top: 10px; right: 20px; background: none; border: none; font-size: 28px; cursor: pointer; color: #6b7280; padding: 8px; display: flex; align-items: center; justify-content: center; z-index: 10; pointer-events: auto; }
        .contact-modal-close:hover { color: #1d1d1f; }
        .contact-modal h2 { font-size: 34px; font-weight: 600; margin: 0 0 24px 0; color: #1d1d1f; }
        .contact-info-section { margin-bottom: 32px; }
        .contact-info-section h3 { font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 14px 0; }
        .contact-info-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; color: #374151; font-size: 15px; line-height: 1.6; }
        .contact-info-icon { flex-shrink: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; margin-top: 2px; }
        .contact-info-icon svg { width: 18px; height: 18px; stroke: #0A4D8C; stroke-width: 2; }
        @media (max-width: 768px) { .contact-modal-content { padding: 32px 24px; max-width: 95%; width: 95%; } .contact-modal h2 { font-size: 24px; } .contact-modal-close { top: 16px; right: 16px; } .contact-modal-front, .contact-modal-back { padding: 20px 16px; padding-top: 10px; } .form-group input, .form-group textarea { padding: 10px 12px; font-size: 14px; } }
      </style>

      <div class="contact-modal" part="overlay">
        <div class="contact-modal-content" part="content">
          <button class="contact-modal-close" part="close">&times;</button>
          <div class="contact-modal-flipper" part="flipper">
            <div class="contact-modal-front" part="front">
              <h2>Get In Touch</h2>
              <p style="color:#374151;line-height:1.6;margin-top:12px;margin-bottom:18px;">Submit the initial scope questionnaire. The Cardona Strategy team will review your response and coordinate next steps.</p>
              <button id="messageBtn" class="send-message-btn">Send us a Message</button>
            </div>

            <div class="contact-modal-back" part="back">
              <h2>Send us a Message!</h2>
              <form id="contactForm" class="contact-form" novalidate>
                <div class="form-group">
                  <label for="companyInput">Company name</label>
                  <input type="text" id="companyInput" name="company" required placeholder="Company name" aria-required="true">
                </div>

                <div class="form-group">
                  <label for="contactInput">Contact name</label>
                  <input type="text" id="contactInput" name="contact" required placeholder="Your name" aria-required="true">
                </div>

                <div class="form-group">
                  <label for="phoneInput">Phone number</label>
                  <input type="tel" id="phoneInput" name="phone" required placeholder="(123) 456-7890" aria-required="true">
                </div>

                <div class="form-group">
                  <label for="emailInput">Email</label>
                  <input type="email" id="emailInput" name="email" required placeholder="your@email.com" aria-required="true">
                </div>

                <div class="form-group">
                  <label for="industrySelect">Industry</label>
                  <select id="industrySelect" name="industry" required aria-required="true">
                    <option value="">Choose industry</option>
                    <option>Healthcare</option>
                    <option>Technology</option>
                    <option>Government</option>
                    <option>Construction</option>
                    <option>Logistics</option>
                    <option>Hospitality</option>
                    <option>Energy</option>
                    <option>Public Safety</option>
                    <option>Community Impact</option>
                    <option>Other</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="serviceSelect">Service interest</label>
                  <select id="serviceSelect" name="service" required aria-required="true">
                    <option value="">Choose service</option>
                    <option>Strategy</option>
                    <option>Brand & Marketing</option>
                    <option>Capital Funding</option>
                    <option>Procurement & Operations</option>
                    <option>Technology & Digital</option>
                    <option>Community & Stakeholders</option>
                    <option>Other</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="challengeInput">Challenge details</label>
                  <textarea id="challengeInput" name="challenge" required placeholder="Describe the challenge or scope..." rows="5" aria-required="true"></textarea>
                </div>

                <button type="submit" class="submit-btn">Send Message</button>
              </form>
            </div>

          </div>
        </div>
      </div>
    `;

    this._overlay = this._shadow.querySelector('.contact-modal');
    this._content = this._shadow.querySelector('.contact-modal-content');
    this._flipper = this._shadow.querySelector('.contact-modal-flipper');
    this._messageBtn = this._shadow.getElementById('messageBtn');
    this._form = this._shadow.getElementById('contactForm');
    this._closeBtn = this._shadow.querySelector('.contact-modal-close');

    // Bindings
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this._onOverlayClick = this._onOverlayClick.bind(this);
    this._onMessageClick = this._onMessageClick.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._onResize = this._onResize.bind(this);
  }

  connectedCallback() {
    this._overlay.addEventListener('click', this._onOverlayClick);
    this._closeBtn.addEventListener('click', this.close);
    this._messageBtn.addEventListener('click', this._onMessageClick);
    this._form.addEventListener('submit', this._onSubmit);
    window.addEventListener('resize', this._onResize);
  }

  disconnectedCallback() {
    this._overlay.removeEventListener('click', this._onOverlayClick);
    this._closeBtn.removeEventListener('click', this.close);
    this._messageBtn.removeEventListener('click', this._onMessageClick);
    this._form.removeEventListener('submit', this._onSubmit);
    window.removeEventListener('resize', this._onResize);
  }

  _onOverlayClick(e) {
    if (e.target === this._overlay) this.close();
  }

  _onMessageClick() {
    // measure current (front) and next (back) heights and animate container to prevent overlap
    const front = this._content.querySelector('.contact-modal-front');
    const back = this._content.querySelector('.contact-modal-back');
    if (!front || !back) {
      this._flipper.classList.add('flipped');
      return;
    }

    const frontHeight = Math.ceil(front.scrollHeight) + 28; // include padding
    const backHeight = Math.ceil(back.scrollHeight) + 28;

    // store for resize handling
    this._backHeight = backHeight;

    // clear any pending open reset so it doesn't interfere with the flip animation
    if (this._openResetTimer) {
      clearTimeout(this._openResetTimer);
      this._openResetTimer = null;
    }

    // Set explicit height to current front height to start transition
    this._content.style.height = frontHeight + 'px';

    // Force reflow so the transition starts from the set height
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this._content.offsetHeight;

    // listen for transition end to fix height to back height and focus
    const onTransitionEnd = (e) => {
      if (e.target === this._content && e.propertyName === 'height') {
        // Keep the container at the back height so it doesn't revert to front sizing
        this._content.style.height = backHeight + 'px';
        // re-apply after a short tick to guard against other layout changes that might override it
        setTimeout(() => { this._content.style.height = backHeight + 'px'; }, 40);
        this._content.removeEventListener('transitionend', onTransitionEnd);
        back.querySelector('#companyInput')?.focus();
      }
    };

    this._content.addEventListener('transitionend', onTransitionEnd);

    // trigger flip and animate to back height
    this._flipper.classList.add('flipped');
    // give the flipper a tick to begin transform then set new height
    requestAnimationFrame(() => {
      this._content.style.height = backHeight + 'px';
    });
  }



  async _onSubmit(e) {
    e.preventDefault();

    // HTML5 validation inside shadow DOM
    if (!this._form.checkValidity()) {
      this._form.reportValidity();
      return;
    }

    const company = this._form.querySelector('#companyInput').value.trim();
    const contact = this._form.querySelector('#contactInput').value.trim();
    const phone = this._form.querySelector('#phoneInput').value.trim();
    const email = this._form.querySelector('#emailInput').value.trim();
    const industry = this._form.querySelector('#industrySelect').value;
    const service = this._form.querySelector('#serviceSelect').value;
    const challenge = this._form.querySelector('#challengeInput').value.trim();

    try {
      const response = await fetch('https://formspree.io/f/mgegqpvq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          contact,
          phone,
          email,
          industry,
          service,
          challenge,
          _subject: `New business inquiry from ${company} / ${contact}`,
          _replyto: email
        })
      });

      if (response.ok) {
        alert('Message sent successfully! We\'ll get back to you soon.');
        this._form.reset();
        this.close();
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    }
  }

  open() {
    // attach to DOM if needed
    if (!this.isConnected) document.body.appendChild(this);

    // show overlay & prevent body scroll
    this._overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // ensure front side sizing is used when opening
    const front = this._content.querySelector('.contact-modal-front');
    if (front) {
      const h = Math.ceil(front.scrollHeight) + 28;
      this._content.style.height = h + 'px';
    }

    // also set back height if the back content is taller so the container can expand smoothly
    const back = this._content.querySelector('.contact-modal-back');
    if (back) {
      this._backHeight = Math.ceil(back.scrollHeight) + 28;
    }

    // reset height to auto after opening transition so layout can adapt
    if (this._openResetTimer) clearTimeout(this._openResetTimer);
    this._openResetTimer = setTimeout(() => {
      // only reset to auto if we're not flipped to back
      if (!this._flipper.classList.contains('flipped')) this._content.style.height = 'auto';
      this._openResetTimer = null;
    }, 350);
  }

  _onResize() {
    // Recompute heights on viewport changes and re-apply the correct explicit height
    const front = this._content.querySelector('.contact-modal-front');
    const back = this._content.querySelector('.contact-modal-back');

    const frontHeight = front ? Math.ceil(front.scrollHeight) + 28 : 0;
    const backHeight = back ? Math.ceil(back.scrollHeight) + 28 : 0;
    this._backHeight = backHeight;

    if (this._flipper.classList.contains('flipped')) {
      // if showing the back, ensure the container matches the back height
      this._content.style.height = backHeight + 'px';
    } else {
      // if showing the front, let it size naturally unless an explicit height was set
      // keep the current explicit front height if present, otherwise set to auto
      if (this._content.style.height) {
        this._content.style.height = frontHeight + 'px';
      } else {
        this._content.style.height = 'auto';
      }
    }
  }

  close() {
    this._overlay.classList.remove('active');
    this._flipper.classList.remove('flipped');
    document.body.style.overflow = 'auto';
    this._form.reset();
    // clear any pending timers
    if (this._openResetTimer) {
      clearTimeout(this._openResetTimer);
      this._openResetTimer = null;
    }
    // reset any explicit height so the next open will size correctly
    this._content.style.height = 'auto';
  }
}

customElements.define('contact-modal', ContactModal);

// Backwards compatibility helpers
window.openContactModal = function() {
  const cmp = document.querySelector('contact-modal');
  if (cmp && typeof cmp.open === 'function') cmp.open();
};

window.closeContactModal = function() {
  const cmp = document.querySelector('contact-modal');
  if (cmp && typeof cmp.close === 'function') cmp.close();
};
