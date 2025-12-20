document.addEventListener('DOMContentLoaded', function () {
  (function () {
    const SIDEBAR_KEY = 'cordona_sidebar_expanded';

    function openContactModal() {
      const modal = document.getElementById('contactModal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeContactModal() {
      const modal = document.getElementById('contactModal');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';

        const flipper = modal.querySelector('.contact-modal-flipper');
        if (flipper) {
          flipper.classList.remove('flipped');
        }

        const form = document.getElementById('contactForm');
        if (form) form.reset();
      }
    }

    const flipper = document.querySelector('.contact-modal-flipper');
    
    document.getElementById('messageBtn')?.addEventListener('click', () => {
      flipper?.classList.add('flipped');
    });

    document.getElementById('backBtn')?.addEventListener('click', () => {
      flipper?.classList.remove('flipped');
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('nameInput').value;
        const email = document.getElementById('emailInput').value;
        const message = document.getElementById('messageInput').value;

        try {
          const response = await fetch('https://formspree.io/f/mgegqpvq', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: name,
              email: email,
              message: message,
              _subject: `New message from ${name}`,
              _replyto: email
            })
          });

          if (response.ok) {
            alert('Message sent successfully! We\'ll get back to you soon.');
            contactForm.reset();
            closeContactModal();
          } else {
            alert('Failed to send message. Please try again.');
          }
        } catch (error) {
          console.error('Error sending message:', error);
          alert('Error sending message. Please try again.');
        }
      });
    }

    const modal = document.getElementById('contactModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('contact-modal-close')) {
          closeContactModal();
        }
      });
    }

    function setLocalStorage(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {}
    }

    function restoreSidebarState() {
      try {
        const stored = localStorage.getItem(SIDEBAR_KEY);
        if (stored === 'false') document.body.classList.remove('sidebar-expanded');
        else if (stored === 'true') document.body.classList.add('sidebar-expanded');
      } catch (e) {}
    }

    function saveSidebarState() {
      try {
        const expanded = document.body.classList.contains('sidebar-expanded');
        localStorage.setItem(SIDEBAR_KEY, expanded ? 'true' : 'false');
      } catch (e) {}
    }

    let isNavigating = false;

    function toggleSidebar() {
      if (isNavigating) return;
      document.body.classList.toggle('sidebar-expanded');
      saveSidebarState();
    }

    document.getElementById('logoRail')?.addEventListener('click', toggleSidebar);

    function navigateWithTransition(url) {
      document.body.classList.add('page-exit');
      setTimeout(() => {
        let finalUrl = url;
        const currentPath = window.location.pathname + window.location.hash;
        const isOfferingDetailPage = currentPath.includes('/offerings/') && 
                                     !currentPath.includes('offerings.html') &&
                                     !currentPath.includes('offerings.html');
        const isIndustryDetailPage = currentPath.includes('/industries/') && 
                                     !currentPath.includes('industries.html') &&
                                     !currentPath.includes('industries.html');

        if ((isOfferingDetailPage || isIndustryDetailPage) && !url.startsWith('../')) {
          finalUrl = '../' + url;
        }
        window.location.href = finalUrl;
        isNavigating = false;
      }, 50);
    }

    document.querySelectorAll('.sidebar-menu-button').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (isNavigating) return;

        const key = btn.getAttribute('data-key');
        if (key === 'home' || key === 'offerings' || key === 'industries') {
          isNavigating = true;
          e.preventDefault();
          e.stopPropagation();

          requestAnimationFrame(() => {
            document.querySelectorAll('.sidebar-menu-item').forEach((item) => {
              item.classList.remove('active');
            });
            btn.closest('.sidebar-menu-item')?.classList.add('active');
          });

          setLocalStorage('cordona_active_menu', key);

          if (window.innerWidth <= 768) {
            closeSidebar();
          }

          const currentPath = window.location.pathname;
          const isInOfferings = currentPath.includes('/offerings/');
          const isInIndustries = currentPath.includes('/industries/');
          
          let finalPage = '';
          if (key === 'home') {
            finalPage = (isInOfferings || isInIndustries) ? '../index.html' : 'index.html';
          } else if (key === 'offerings') {
            finalPage = (isInOfferings || isInIndustries) ? '../offerings.html' : 'offerings.html';
          } else if (key === 'industries') {
            finalPage = (isInOfferings || isInIndustries) ? '../industries.html' : 'industries.html';
          }

          if (finalPage) {
            navigateWithTransition(finalPage);
          }
        }
      });
    });

    document.getElementById('contactBtn')?.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && document.body.classList.contains('sidebar-expanded')) {
        closeSidebar();
      }
      openContactModal();
    });
    document.getElementById('initiateBtn')?.addEventListener('click', openContactModal);
    document.getElementById('scheduleBtn')?.addEventListener('click', openContactModal);
    document.getElementById('customSolutionBtn')?.addEventListener('click', openContactModal);

    document.querySelectorAll('.cta-btn, .custom-cta').forEach((btn) => {
      if (btn.textContent.includes('Start a Conversation') || btn.textContent.includes('Work With Us')) {
        btn.addEventListener('click', openContactModal);
      }
    });

    document.querySelectorAll('.offering-card').forEach((card) => {
      card.addEventListener('click', () => {
        const offering = card.getAttribute('data-offering');
        const offeringPages = {
          'strategy': 'strategic-planning-detail.html',
          'marketing': 'brand-marketing-detail.html',
          'capital': 'capital-funding-detail.html',
          'procurement': 'procurement-operations-detail.html',
          'technology': 'technology-digital-detail.html',
          'community': 'community-stakeholders.html'
        };
        
        if (offeringPages[offering]) {
          setLocalStorage('cordona_active_menu', 'offerings');
          navigateWithTransition(offeringPages[offering]);
        }
      });
    });

    document.querySelectorAll('.industry-card').forEach(card => {
      card.addEventListener('click', function() {
        const industry = this.dataset.industry;
        const industryPages = {
          'healthcare': 'healthcare-detail.html',
          'automotive': 'automotive-transportation-detail.html',
          'government': 'government-detail.html',
          'construction': 'construction-detail.html',
          'technology': 'technology-detail.html',
          'logistics': 'logistics-detail.html',
          'hospitality': 'hospitality-detail.html',
          'energy': 'energy-utilities.html',
          'public-safety': 'publicsafety-detail.html',
          'community-impact': 'community-impact-detail.html'
        };
        
        if (industryPages[industry]) {
          setLocalStorage('cordona_active_menu', 'industries');
          navigateWithTransition(industryPages[industry]);
        }
      });
    });

    function setupDetailCardNavigation(cardSelector, menuKey) {
      document.querySelectorAll(cardSelector).forEach(card => {
        card.addEventListener('click', function(e) {
          const link = e.target.closest('a') || this.querySelector('a');
          if (link) {
            const href = link.getAttribute('href');
            if (href) {
              e.preventDefault();
              setLocalStorage('cordona_active_menu', menuKey);
              navigateWithTransition(href);
            }
          }
        });
      });
    }

    setupDetailCardNavigation('.offering-detail-card', 'offerings');
    setupDetailCardNavigation('.industry-detail-card', 'industries');


    (function setupMetricsRotation() {
      const metrics = Array.from(document.querySelectorAll('.metric-card'));
      if (!metrics.length) return;
      let active = 1; 
      function setActive(i) {
        metrics.forEach((m, idx) => {
          m.classList.toggle('highlight', idx === i);
        });
      }
      setActive(active);
      setInterval(() => {
        active = (active + 1) % metrics.length;
        setActive(active);
      }, 3500);
    })();

    document.body.classList.add('page-enter');
    setTimeout(() => {
      document.body.classList.remove('page-enter');
    }, 500);

    restoreSidebarState();

    try {
      const activeKey = localStorage.getItem('cordona_active_menu') || 'home';
      const activeBtn = document.querySelector(`[data-key="${activeKey}"]`);
      if (activeBtn) {
        activeBtn.closest('.sidebar-menu-item')?.classList.add('active');
      }
    } catch (e) {}

    function closeSidebar() {
      document.body.classList.remove('sidebar-expanded');
      saveSidebarState();
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeContactModal();
        closeSidebar();
      }
    });

    window.openContactModal = openContactModal;
    window.closeContactModal = closeContactModal;
  })();
});


  

