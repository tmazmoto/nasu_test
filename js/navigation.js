/**
 * Navigation Control
 * Handles smooth scrolling, mobile menu, and active link highlighting
 */

(function() {
  'use strict';

  /**
   * Smooth scroll to anchor links
   */
  function initSmoothScroll() {
    // Select all anchor links that start with #
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Ignore empty anchors
        if (href === '#' || href === '#!') {
          e.preventDefault();
          return;
        }

        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();

          // Get header height for offset
          const header = document.getElementById('header');
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.offsetTop - headerHeight;

          // Smooth scroll to target
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          closeMobileMenu();

          // Update URL without scrolling
          if (history.pushState) {
            history.pushState(null, null, href);
          } else {
            window.location.hash = href;
          }

          // Focus target for accessibility
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  /**
   * Mobile menu toggle
   */
  function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('nav');

    if (!mobileToggle || !nav) return;

    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = nav.classList.contains('active');

      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('active') &&
          !nav.contains(e.target) &&
          !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    // Close menu on window resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1023 && nav.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  /**
   * Open mobile menu
   */
  function openMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('nav');

    if (!nav || !mobileToggle) return;

    nav.classList.add('active');
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-label', 'メニューを閉じる');
    mobileToggle.setAttribute('aria-expanded', 'true');

    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';

    // Add padding to compensate for scrollbar removal
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Create overlay
    createOverlay();
  }

  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('nav');

    if (!nav || !mobileToggle) return;

    nav.classList.remove('active');
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-label', 'メニューを開く');
    mobileToggle.setAttribute('aria-expanded', 'false');

    // Restore body scroll
    document.body.style.overflow = '';

    // Remove overlay
    removeOverlay();
  }

  /**
   * Create overlay for mobile menu
   */
  function createOverlay() {
    if (document.getElementById('menu-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'menu-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9999;
    `;

    overlay.addEventListener('click', closeMobileMenu);
    document.body.appendChild(overlay);
  }

  /**
   * Remove overlay
   */
  function removeOverlay() {
    const overlay = document.getElementById('menu-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  /**
   * Highlight active navigation link based on scroll position
   */
  function initActiveNavLink() {
    const navLinks = document.querySelectorAll('.header__nav-link');
    const sections = document.querySelectorAll('section[id]');

    if (navLinks.length === 0 || sections.length === 0) return;

    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset + 150; // offset for header

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { passive: true });
  }

  /**
   * Add active class styling
   */
  function addActiveNavStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .header__nav-link.active {
        color: var(--color-nasu-blue);
        background-color: var(--color-soft-gray);
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Scroll to top button
   */
  function initScrollToTop() {
    // Create button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scrollToTop';
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.setAttribute('aria-label', 'ページトップに戻る');
    scrollTopBtn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background-color: var(--color-nasu-blue);
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 24px;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
      z-index: 999;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(scrollTopBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
      } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
      }
    }, { passive: true });

    // Scroll to top on click
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Hover effect
    scrollTopBtn.addEventListener('mouseenter', () => {
      scrollTopBtn.style.transform = 'translateY(-5px)';
    });

    scrollTopBtn.addEventListener('mouseleave', () => {
      scrollTopBtn.style.transform = 'translateY(0)';
    });
  }

  /**
   * Handle keyboard navigation
   */
  function initKeyboardNav() {
    const navLinks = document.querySelectorAll('.header__nav-link');

    navLinks.forEach((link, index) => {
      link.addEventListener('keydown', (e) => {
        // Arrow key navigation
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextLink = navLinks[index + 1] || navLinks[0];
          nextLink.focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevLink = navLinks[index - 1] || navLinks[navLinks.length - 1];
          prevLink.focus();
        }
      });
    });
  }

  /**
   * Prevent layout shift on page load
   */
  function preventLayoutShift() {
    // Add min-height to body to prevent content jump
    const viewportHeight = window.innerHeight;
    document.body.style.minHeight = `${viewportHeight}px`;
  }

  /**
   * Handle hash on page load (deep linking)
   */
  function handleInitialHash() {
    if (window.location.hash) {
      // Small delay to ensure page is loaded
      setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) {
          const header = document.getElementById('header');
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }

  /**
   * Initialize all navigation features
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initSmoothScroll();
        initMobileMenu();
        initActiveNavLink();
        addActiveNavStyles();
        initScrollToTop();
        initKeyboardNav();
        preventLayoutShift();
        handleInitialHash();
      });
    } else {
      initSmoothScroll();
      initMobileMenu();
      initActiveNavLink();
      addActiveNavStyles();
      initScrollToTop();
      initKeyboardNav();
      preventLayoutShift();
      handleInitialHash();
    }
  }

  // Start initialization
  init();

  // Export functions for external use
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      initSmoothScroll,
      initMobileMenu,
      openMobileMenu,
      closeMobileMenu
    };
  }

})();
