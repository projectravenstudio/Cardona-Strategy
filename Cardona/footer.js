class FooterComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <footer class="footer" role="contentinfo">
        <div class="container footer-content">
          <p>&copy; 2025 Cardona Strategy. All Rights Reserved.</p>
        </div>
      </footer>
    `;
  }
}

customElements.define('footer-component', FooterComponent);
