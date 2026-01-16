document.addEventListener('DOMContentLoaded', function () {
  (function () {
    const SIDEBAR_KEY = 'cordona_sidebar_expanded';

    function openContactModal() {
      const cmp = document.querySelector('contact-modal');
      if (cmp && typeof cmp.open === 'function') {
        if (window.innerWidth <= 1024 && document.body.classList.contains('sidebar-expanded')) {
          closeSidebar();
        }
        cmp.open();
      }
    }

    function closeContactModal() {
      const cmp = document.querySelector('contact-modal');
      if (cmp && typeof cmp.close === 'function') {
        cmp.close();
      }
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
      isNavigating = true;
      setTimeout(() => {
        let finalUrl = url;
        const currentPath = window.location.pathname + window.location.hash;
        const isOfferingDetailPage = currentPath.includes('/offerings/') && !currentPath.includes('offerings.html');
        const isIndustryDetailPage = currentPath.includes('/industries/') && !currentPath.includes('industries.html');

        if ((isOfferingDetailPage || isIndustryDetailPage) && !url.startsWith('../')) {
          finalUrl = '../' + url;
        }
        window.location.href = finalUrl;
      }, 50);
    }

    document.querySelectorAll('.sidebar-menu-button').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (isNavigating) return;

        const key = btn.getAttribute('data-key');
        if (key === 'home' || key === 'offerings' || key === 'industries' || key === 'local-sled') {
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
          } else if (key === 'local-sled') {
            finalPage = (isInOfferings || isInIndustries) ? '../local-sled.html' : 'local-sled.html';
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

    document.querySelectorAll('.cta-btn, .custom-cta, .offering-cta .btn-primary, .region-cta .btn-primary').forEach((btn) => {
      if (btn.textContent.includes('Start a Conversation') || btn.textContent.includes('Work With Us') || btn.textContent.includes('Discuss Custom')) {
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

    document.querySelectorAll('.community-header-wrapper').forEach(header => {
      header.addEventListener('click', function() {
        const item = this.closest('.community-item');
        const details = item.querySelector('.community-details');
        const actionText = item.querySelector('.action-text');
        const actionWrapper = item.querySelector('.action-wrapper');
        
        if (item.classList.contains('open')) {
          item.classList.remove('open');
          item.classList.add('closing');
          
          setTimeout(() => {
            details.style.display = 'none';
            if (actionText) actionText.textContent = 'Explore';
            item.classList.remove('closing');
          }, 200);
        } else {
          item.classList.add('opening');
          details.style.display = 'block';
          if (actionText) actionText.textContent = 'Close';
          
          setTimeout(() => {
            item.classList.remove('opening');
            item.classList.add('open');
          }, 500);
        }
      });
    });


    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', function() {
        const item = this.closest('.accordion-item');
        const isOpen = item.classList.contains('open');
        const actionText = item.querySelector('.accordion-action-text');

        if (isOpen) {
          item.classList.remove('open');
          item.classList.add('closing-accordion');
          if (actionText) actionText.textContent = 'Details';
          
          setTimeout(() => {
            item.classList.remove('closing-accordion');
          }, 500);
        } else {
          document.querySelectorAll('.accordion-item').forEach(accordionItem => {
            if (accordionItem !== item && accordionItem.classList.contains('open')) {
              accordionItem.classList.remove('open');
              accordionItem.classList.add('closing-accordion');
              const text = accordionItem.querySelector('.accordion-action-text');
              if (text) text.textContent = 'Explore';
              
              setTimeout(() => {
                accordionItem.classList.remove('closing-accordion');
              }, 500);
            }
          });
          
          item.classList.add('opening-accordion');
          if (actionText) actionText.textContent = 'Close';
          
          setTimeout(() => {
            item.classList.remove('opening-accordion');
            item.classList.add('open');
          }, 200);
        }
      });
    });

    document.querySelectorAll('.partner-section .btn-primary').forEach(btn => {
      btn.addEventListener('click', function() {
        const sgvModal = document.querySelector('sgv-contact-modal');
        if (sgvModal && typeof sgvModal.open === 'function') {
          sgvModal.open();
        }
      });
    });

    window.openContactModal = openContactModal;
    window.closeContactModal = closeContactModal;
  })();
});


  

