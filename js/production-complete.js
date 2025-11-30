// Production Complete Features

class ProductionFeatures {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.notifications = [];
    this.init();
  }

  init() {
    this.setupThemeToggle();
    this.setupLoadingStates();
    this.setupErrorHandling();
    this.setupNotifications();
    this.setupQuickActions();
    this.setupBreadcrumbs();
    this.setupPerformanceOptimizations();
    this.setupAccessibility();
    this.applyTheme();
  }

  // Theme Toggle
  setupThemeToggle() {
    const toggle = document.createElement('div');
    toggle.className = 'theme-toggle';
    toggle.innerHTML = `
      <button class="theme-btn ${this.theme === 'light' ? 'active' : ''}" data-theme="light">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      </button>
      <button class="theme-btn ${this.theme === 'dark' ? 'active' : ''}" data-theme="dark">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    `;
    
    document.body.appendChild(toggle);
    
    toggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-btn');
      if (btn) {
        this.theme = btn.dataset.theme;
        this.applyTheme();
        this.updateThemeButtons();
      }
    });
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
  }

  updateThemeButtons() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === this.theme);
    });
  }

  // Loading States
  setupLoadingStates() {
    window.showLoading = (container, type = 'spinner') => {
      const element = typeof container === 'string' ? document.getElementById(container) : container;
      if (!element) return;

      if (type === 'skeleton') {
        element.innerHTML = this.generateSkeletonLoader();
      } else if (type === 'dots') {
        element.innerHTML = `
          <div class="loading-dots">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
        `;
      } else {
        element.innerHTML = '<div class="loading-spinner"></div>';
      }
    };

    window.hideLoading = (container) => {
      const element = typeof container === 'string' ? document.getElementById(container) : container;
      if (element) {
        element.innerHTML = '';
      }
    };
  }

  generateSkeletonLoader() {
    return `
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text" style="width: 80%;"></div>
      <div class="skeleton skeleton-text" style="width: 60%;"></div>
    `;
  }

  // Error Handling
  setupErrorHandling() {
    window.showError = (container, message, retry) => {
      const element = typeof container === 'string' ? document.getElementById(container) : container;
      if (!element) return;

      element.innerHTML = `
        <div class="error-state">
          <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <div class="error-title">Something went wrong</div>
          <div class="error-message">${message}</div>
          ${retry ? '<button class="retry-btn" onclick="' + retry + '">Try Again</button>' : ''}
        </div>
      `;
    };

    window.showEmpty = (container, message, action) => {
      const element = typeof container === 'string' ? document.getElementById(container) : container;
      if (!element) return;

      element.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
          <h3>No results found</h3>
          <p>${message}</p>
          ${action ? '<button class="btn btn-primary" onclick="' + action + '">Browse Services</button>' : ''}
        </div>
      `;
    };
  }

  // Notification System
  setupNotifications() {
    window.showNotification = (message, type = 'success', duration = 5000) => {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${type === 'success' ? '<polyline points="20,6 9,17 4,12"></polyline>' : 
              type === 'error' ? '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>' :
              '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>'}
          </svg>
          <span>${message}</span>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => notification.classList.add('show'), 100);
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, duration);
    };
  }

  // Quick Actions
  setupQuickActions() {
    const quickActions = document.createElement('div');
    quickActions.className = 'quick-actions';
    quickActions.innerHTML = `
      <div class="quick-action" onclick="scrollToTop()" title="Back to top">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5,12 12,5 19,12"></polyline>
        </svg>
      </div>
      <div class="quick-action" onclick="toggleHelp()" title="Help">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
    `;
    
    document.body.appendChild(quickActions);

    window.scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.toggleHelp = () => {
      showNotification('Help: Use the search bar to find AWS services, or browse by category below.', 'info');
    };
  }

  // Breadcrumbs
  setupBreadcrumbs() {
    window.updateBreadcrumbs = (items) => {
      let breadcrumbContainer = document.querySelector('.breadcrumb');
      if (!breadcrumbContainer) {
        breadcrumbContainer = document.createElement('div');
        breadcrumbContainer.className = 'breadcrumb';
        const container = document.querySelector('.container');
        if (container) {
          container.insertBefore(breadcrumbContainer, container.firstChild);
        }
      }

      breadcrumbContainer.innerHTML = items.map((item, index) => `
        <div class="breadcrumb-item">
          ${item.link ? `<a href="${item.link}" class="breadcrumb-link">${item.text}</a>` : `<span>${item.text}</span>`}
          ${index < items.length - 1 ? '<span class="breadcrumb-separator">/</span>' : ''}
        </div>
      `).join('');
    };
  }

  // Performance Optimizations
  setupPerformanceOptimizations() {
    // Add GPU acceleration to animated elements
    document.querySelectorAll('.service-card, .pattern-card, .btn').forEach(el => {
      el.classList.add('gpu-accelerated');
    });

    // Lazy load images
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });

    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
      }, 16); // ~60fps
    });
  }

  handleScroll() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Parallax effect for hero background
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
      heroBackground.style.transform = `translateY(${rate}px)`;
    }
  }

  // Accessibility
  setupAccessibility() {
    // Focus management
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // Skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'sr-only focus-visible';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '10px';
    skipLink.style.left = '10px';
    skipLink.style.zIndex = '9999';
    skipLink.style.background = 'white';
    skipLink.style.padding = '8px 16px';
    skipLink.style.borderRadius = '4px';
    
    skipLink.addEventListener('focus', () => {
      skipLink.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // ARIA live regions
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);

    window.announceToScreenReader = (message) => {
      const liveRegion = document.getElementById('live-region');
      if (liveRegion) {
        liveRegion.textContent = message;
        setTimeout(() => {
          liveRegion.textContent = '';
        }, 1000);
      }
    };
  }
}

// Initialize production features
document.addEventListener('DOMContentLoaded', () => {
  new ProductionFeatures();
  
  // Add main content ID for skip link
  const main = document.querySelector('main') || document.querySelector('.main-content');
  if (main) {
    main.id = 'main-content';
  }
});