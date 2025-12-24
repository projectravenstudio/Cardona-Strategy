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
          max-width: 450px;
          max-height: 450px;
          width: 50%;
          height: 90%;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          animation: slideUp 0.3s ease-out;
          position: relative;
          padding-top: 20px;
        }
        .contact-modal-flipper { position: relative; width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d; }
        .contact-modal-flipper.flipped { transform: rotateY(180deg); }
        .contact-modal-front, .contact-modal-back { padding: 28px; padding-top: 10px; padding-bottom: 10px; width: 100%; backface-visibility: hidden; align-items: center; }
        .contact-modal-back { transform: rotateY(180deg); position: absolute; top: 0; left: 0; }
        .send-message-btn { width: 100%; background-color: #043763; color: white; border: none; padding: 14px 24px; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer; margin-top: 26px; transition: all 0.2s; }
        .send-message-btn:hover { background-color: #0a4d8c; transform: translateY(-2px); }
        .contact-form { display: flex; flex-direction: column; gap: 8px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 12px; font-weight: 600; color: #1d1d1f; }
        .form-group input, .form-group textarea { padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-family: inherit; font-size: 12px; transition: border-color 0.2s; }
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
              <div class="contact-info-section">
                <h3>Phone</h3>
                <div class="contact-info-item">
                  <div class="contact-info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    +1(626) 692-4925<br/>
                    <span style="font-size: 13px; color: #9ca3af;">Available Mon-Fri, 9AM-6PM EST</span>
                  </div>
                </div>
              </div>
              <div class="contact-info-section">
                <h3>Email</h3>
                <div class="contact-info-item">
                  <div class="contact-info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    gaguirre@cardonastrategy.com<br/>
                    <span style="font-size: 13px; color: #9ca3af;">We'll respond within 24 hours</span>
                  </div>
                </div>
              </div>
              <button id="messageBtn" class="send-message-btn">Send us a Message</button>
            </div>

            <div class="contact-modal-back" part="back">
              <h2>Send us a Message!</h2>
              <form id="contactForm" class="contact-form">
                <div class="form-group">
                  <label for="nameInput">Enter your name</label>
                  <input type="text" id="nameInput" name="name" required placeholder="Your name">
                </div>

                <div class="form-group">
                  <label for="emailInput">Enter your email</label>
                  <input type="email" id="emailInput" name="email" required placeholder="your@email.com">
                </div>

                <div class="form-group">
                  <label for="messageInput">Enter your message</label>
                  <textarea id="messageInput" name="message" required placeholder="Your message..." rows="4"></textarea>
                </div>

                <button type="submit" class="submit-btn">Send Message</button>
              </form>
            </div>

          </div>
        </div>
      </div>
    `;

    this._overlay = this._shadow.querySelector('.contact-modal');
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
  }

  connectedCallback() {
    this._overlay.addEventListener('click', this._onOverlayClick);
    this._closeBtn.addEventListener('click', this.close);
    this._messageBtn.addEventListener('click', this._onMessageClick);
    this._form.addEventListener('submit', this._onSubmit);
  }

  disconnectedCallback() {
    this._overlay.removeEventListener('click', this._onOverlayClick);
    this._closeBtn.removeEventListener('click', this.close);
    this._messageBtn.removeEventListener('click', this._onMessageClick);
    this._form.removeEventListener('submit', this._onSubmit);
  }

  _onOverlayClick(e) {
    if (e.target === this._overlay) this.close();
  }

  _onMessageClick() {
    this._flipper.classList.add('flipped');
  }

  async _onSubmit(e) {
    e.preventDefault();
    const name = this._form.querySelector('#nameInput').value;
    const email = this._form.querySelector('#emailInput').value;
    const message = this._form.querySelector('#messageInput').value;

    try {
      const response = await fetch('https://formspree.io/f/mgegqpvq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, _subject: `New message from ${name}`, _replyto: email })
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
    this._overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this._overlay.classList.remove('active');
    this._flipper.classList.remove('flipped');
    document.body.style.overflow = 'auto';
    this._form.reset();
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
