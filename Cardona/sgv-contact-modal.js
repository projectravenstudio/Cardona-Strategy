class SGVContactModal extends HTMLElement {
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
          padding: 16px;
        }
        .contact-modal.active { display: flex; }
        .contact-modal-content {
          background: #ffffff;
          border-radius: 12px;
          max-width: 420px;
          width: calc(100% - 40px);
          max-height: 90vh;
          height: auto;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
          animation: slideUp 0.28s ease-out;
          transition: height 0.28s ease;
          position: relative;
          padding: 20px;
          align-items: center;
        }
        .contact-modal-flipper { position: relative; width: 100%; transition: transform 0.6s; transform-style: preserve-3d; }
        .contact-modal-flipper.flipped { transform: rotateY(180deg); }
        .contact-modal-front, .contact-modal-back { padding: 20px; width: 100%; backface-visibility: hidden; display: flex; flex-direction: column; gap: 12px; align-items: center; text-align: left; }
        .contact-modal-back { transform: rotateY(180deg); position: absolute; top: 0; left: 0; width: 100%; }
        .send-message-btn { min-width: 180px; width: auto; align-self: center; background-color: #043763; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; margin-top: 8px; transition: all 0.16s; }
        .send-message-btn:hover { background-color: #0a4d8c; transform: translateY(-2px); }
        .contact-form { display: flex; flex-direction: column; gap: 10px; width: 100%;}
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 12px; font-weight: 600; color: #1d1d1f; }
        .form-group input, .form-group textarea { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-family: inherit; font-size: 14px; transition: border-color 0.2s; }
        .form-group select { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; font-family: inherit; font-size: 14px; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #043763; box-shadow: 0 0 0 3px rgba(4, 55, 99, 0.06); }
        .form-group textarea { resize: vertical; min-height: 80px; }
        .submit-btn { background-color: #043763; color: white; border: none; padding: 12px 10px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.16s; margin-top: 8px; width: 100%; }
        .submit-btn:hover { background-color: #0a4d8c; transform: translateY(-2px); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        .contact-modal-close { position: absolute; top: 10px; right: 14px; background: none; border: none; font-size: 22px; cursor: pointer; color: #6b7280; padding: 6px; display: flex; align-items: center; justify-content: center; z-index: 10; pointer-events: auto; }
        .contact-modal-close:hover { color: #1d1d1f; }
        .contact-modal h2 { font-size: 28px; font-weight: 600; margin: 0; color: #1d1d1f; text-align: left; }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .contact-modal-content { padding: 18px; max-width: 380px; width: calc(100% - 28px); max-height: 82vh; border-radius: 12px; }
          .contact-modal h2 { font-size: 22px; }
          .contact-modal-close { top: 12px; right: 12px; font-size: 20px; }
          .contact-modal-front, .contact-modal-back { padding: 12px; padding-top: 8px; }
          .form-group input, .form-group textarea { padding: 10px 12px; font-size: 14px; }
          .send-message-btn { width: 100%; align-self: stretch; min-width: 0; }
          .submit-btn { padding: 12px; font-size: 14px; }
        }

        @media (max-width: 420px) {
          .contact-modal-content { max-width: 340px; width: calc(100% - 24px); padding: 14px; border-radius: 10px; max-height: 80vh; }
          .contact-modal h2 { font-size: 20px; }
          .contact-modal-close { font-size: 18px; top: 10px; right: 10px; }
          .form-group textarea { min-height: 72px; }
        }
      </style> 

      <div class="contact-modal" part="overlay">
        <div class="contact-modal-content" part="content">
          <button class="contact-modal-close" part="close">&times;</button>
          <div class="contact-modal-flipper" part="flipper">
            <div class="contact-modal-front" part="front">
              <h2>San Gabriel Valley Cities – Let's Connect</h2>
              <p style="color:#374151;line-height:1.6;margin-bottom:18px; text-align: center;">Tell us about your city's priorities and challenges. We'll respond within 24 hours to explore how Cardona Strategy can support your team.</p>
              <button id="messageBtn" class="send-message-btn">Send us a Message</button>
            </div>

            <div class="contact-modal-back" part="back">
              <h2>Send us a Message!</h2>
              <form id="contactForm" class="contact-form" novalidate>
                <div class="form-group">
                  <label for="companyInput">City / Organization</label>
                  <input type="text" id="companyInput" name="company" required placeholder="City or organization name" aria-required="true">
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
                  <label for="messageInput">Tell us about your priorities and challenges</label>
                  <textarea id="messageInput" name="message" required placeholder="What are your city's key priorities?" aria-required="true"></textarea>
                </div>

                <button type="submit" class="submit-btn" id="submitBtn">Let's Connect</button>
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
    const front = this._content.querySelector('.contact-modal-front');
    const back = this._content.querySelector('.contact-modal-back');
    if (!front || !back) {
      this._flipper.classList.add('flipped');
      return;
    }

 
    const maxAllowed = Math.max(200, Math.floor(window.innerHeight * 0.82));
    let frontHeight = Math.min(Math.ceil(front.scrollHeight) + 28, maxAllowed);
    let backHeight = Math.min(Math.ceil(back.scrollHeight) + 28, maxAllowed);

    
    this._backHeight = backHeight;

    if (backHeight >= maxAllowed) {
      this._content.style.overflowY = 'auto';
      this._content.style.webkitOverflowScrolling = 'touch';
    } else {
      this._content.style.overflowY = 'visible';
    }

    if (this._openResetTimer) {
      clearTimeout(this._openResetTimer);
      this._openResetTimer = null;
    }

    this._content.style.height = frontHeight + 'px';

    this._content.offsetHeight;

    const onTransitionEnd = (e) => {
      if (e.target === this._content && e.propertyName === 'height') {
       
        this._content.style.height = backHeight + 'px';
        
        setTimeout(() => { this._content.style.height = backHeight + 'px'; }, 40);
        this._content.removeEventListener('transitionend', onTransitionEnd);
        back.querySelector('#companyInput')?.focus();
      }
    };

    this._content.addEventListener('transitionend', onTransitionEnd);

    this._flipper.classList.add('flipped');

    requestAnimationFrame(() => {
      this._content.style.height = backHeight + 'px';
    });
  }

  async _onSubmit(e) {
    e.preventDefault();

    if (!this._form.checkValidity()) {
      this._form.reportValidity();
      return;
    }

    const company = this._form.querySelector('#companyInput').value.trim();
    const contact = this._form.querySelector('#contactInput').value.trim();
    const phone = this._form.querySelector('#phoneInput').value.trim();
    const email = this._form.querySelector('#emailInput').value.trim();
    const message = this._form.querySelector('#messageInput').value.trim();

    try {
      const response = await fetch('https://formspree.io/f/mojjjjvl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          contact_name: contact,
          phone,
          email,
          message,
          _subject: 'New Website Lead | Cardona Strategy',
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

    if (!this.isConnected) document.body.appendChild(this);

    this._overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    const front = this._content.querySelector('.contact-modal-front');
    if (front) {
      const maxAllowed = Math.max(200, Math.floor(window.innerHeight * 0.82));
      const h = Math.min(Math.ceil(front.scrollHeight) + 28, maxAllowed);
      this._content.style.height = h + 'px';

      if (h >= maxAllowed) {
        this._content.style.overflowY = 'auto';
        this._content.style.webkitOverflowScrolling = 'touch';
      } else {
        this._content.style.overflowY = 'visible';
      }
    }

    const back = this._content.querySelector('.contact-modal-back');
    if (back) {
      const maxAllowed = Math.max(200, Math.floor(window.innerHeight * 0.82));
      this._backHeight = Math.min(Math.ceil(back.scrollHeight) + 28, maxAllowed);
    }

    if (this._openResetTimer) clearTimeout(this._openResetTimer);
    this._openResetTimer = setTimeout(() => {
      if (!this._flipper.classList.contains('flipped')) this._content.style.height = 'auto';
      this._openResetTimer = null;
    }, 350);
  }

  _onResize() {
    const front = this._content.querySelector('.contact-modal-front');
    const back = this._content.querySelector('.contact-modal-back');

    const maxAllowed = Math.max(200, Math.floor(window.innerHeight * 0.82));
    const frontHeight = front ? Math.min(Math.ceil(front.scrollHeight) + 28, maxAllowed) : 0;
    const backHeight = back ? Math.min(Math.ceil(back.scrollHeight) + 28, maxAllowed) : 0;
    this._backHeight = backHeight;

    if (this._flipper.classList.contains('flipped')) {
      this._content.style.height = backHeight + 'px';
      this._content.style.overflowY = backHeight >= maxAllowed ? 'auto' : 'visible';
    } else {
      if (this._content.style.height) {
        this._content.style.height = frontHeight + 'px';
        this._content.style.overflowY = frontHeight >= maxAllowed ? 'auto' : 'visible';
      } else {
        this._content.style.height = 'auto';
        this._content.style.overflowY = 'visible';
      }
    }
  }

  close() {
    this._overlay.classList.remove('active');
    this._flipper.classList.remove('flipped');
    document.body.style.overflow = 'auto';
    this._form.reset();
    if (this._openResetTimer) {
      clearTimeout(this._openResetTimer);
      this._openResetTimer = null;
    }
    this._content.style.height = 'auto';
    this._content.style.overflowY = 'visible';
  }
}

customElements.define('sgv-contact-modal', SGVContactModal);

window.openSGVContactModal = function() {
  const cmp = document.querySelector('sgv-contact-modal');
  if (cmp && typeof cmp.open === 'function') cmp.open();
};

window.closeSGVContactModal = function() {
  const cmp = document.querySelector('sgv-contact-modal');
  if (cmp && typeof cmp.close === 'function') cmp.close();
};
