/**
 * Main JavaScript
 * General functionality for the website
 */

(function() {
  'use strict';

  /**
   * Pricing tabs functionality
   */
  function initPricingTabs() {
    const tabs = document.querySelectorAll('.pricing__tab');
    const contents = document.querySelectorAll('.pricing__content');

    if (tabs.length === 0 || contents.length === 0) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('pricing__tab--active'));
        contents.forEach(c => c.classList.remove('pricing__content--active'));

        // Add active class to clicked tab and corresponding content
        tab.classList.add('pricing__tab--active');
        const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
        if (targetContent) {
          targetContent.classList.add('pricing__content--active');
        }
      });
    });

    // Keyboard navigation for tabs
    tabs.forEach((tab, index) => {
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const nextTab = tabs[index + 1] || tabs[0];
          nextTab.click();
          nextTab.focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevTab = tabs[index - 1] || tabs[tabs.length - 1];
          prevTab.click();
          prevTab.focus();
        }
      });
    });
  }

  /**
   * Phone number click tracking
   */
  function initPhoneTracking() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(link => {
      link.addEventListener('click', () => {
        console.log('Phone number clicked:', link.href);
        // Add analytics tracking here if needed
        // Example: gtag('event', 'phone_click', { phone_number: link.href });
      });
    });
  }

  /**
   * LINE button click tracking
   */
  function initLineTracking() {
    const lineLinks = document.querySelectorAll('a[href*="lin.ee"]');

    lineLinks.forEach(link => {
      link.addEventListener('click', () => {
        console.log('LINE button clicked:', link.href);
        // Add analytics tracking here if needed
        // Example: gtag('event', 'line_click');
      });
    });
  }

  /**
   * Form validation (if forms are added later)
   */
  function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            showError(input, '必須項目です');
          } else {
            input.classList.remove('error');
            hideError(input);
          }

          // Email validation
          if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
              isValid = false;
              input.classList.add('error');
              showError(input, '有効なメールアドレスを入力してください');
            }
          }

          // Phone validation
          if (input.type === 'tel' && input.value) {
            const phoneRegex = /^[\d\-+()]+$/;
            if (!phoneRegex.test(input.value)) {
              isValid = false;
              input.classList.add('error');
              showError(input, '有効な電話番号を入力してください');
            }
          }
        });

        if (isValid) {
          console.log('Form submitted successfully');
          // Submit form or send data via AJAX
        }
      });

      // Clear error on input
      form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
          input.classList.remove('error');
          hideError(input);
        });
      });
    });
  }

  /**
   * Show form error message
   */
  function showError(input, message) {
    let errorElement = input.nextElementSibling;

    if (!errorElement || !errorElement.classList.contains('error-message')) {
      errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      errorElement.style.cssText = `
        display: block;
        color: #D32F2F;
        font-size: 12px;
        margin-top: 4px;
      `;
      input.parentNode.insertBefore(errorElement, input.nextSibling);
    }

    errorElement.textContent = message;
  }

  /**
   * Hide form error message
   */
  function hideError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.remove();
    }
  }

  /**
   * External links - open in new tab
   */
  function initExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');

    externalLinks.forEach(link => {
      // Check if it's not an internal link
      if (!link.href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');

        // Add visual indicator for external links
        if (!link.querySelector('.external-icon')) {
          const icon = document.createElement('span');
          icon.className = 'external-icon';
          icon.innerHTML = ' ↗';
          icon.style.cssText = 'font-size: 0.8em; opacity: 0.7;';
          // Only add icon if the link doesn't have a button class
          if (!link.classList.contains('btn')) {
            link.appendChild(icon);
          }
        }
      }
    });
  }

  /**
   * Copy to clipboard functionality
   */
  function initCopyToClipboard() {
    const copyButtons = document.querySelectorAll('[data-copy]');

    copyButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const textToCopy = button.dataset.copy;

        try {
          await navigator.clipboard.writeText(textToCopy);
          showCopyFeedback(button, 'コピーしました！');
        } catch (err) {
          console.error('Failed to copy:', err);
          showCopyFeedback(button, 'コピーに失敗しました');
        }
      });
    });
  }

  /**
   * Show copy feedback
   */
  function showCopyFeedback(button, message) {
    const feedback = document.createElement('span');
    feedback.className = 'copy-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
      position: absolute;
      background-color: var(--color-dark-navy);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      top: -35px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      opacity: 0;
      animation: fadeInOut 2s ease-out;
    `;

    button.style.position = 'relative';
    button.appendChild(feedback);

    setTimeout(() => {
      feedback.remove();
    }, 2000);
  }

  /**
   * Add fade in/out animation for copy feedback
   */
  function addCopyFeedbackStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(-5px); }
        20% { opacity: 1; transform: translateX(-50%) translateY(0); }
        80% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-5px); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Print page functionality
   */
  function initPrint() {
    const printButtons = document.querySelectorAll('[data-print]');

    printButtons.forEach(button => {
      button.addEventListener('click', () => {
        window.print();
      });
    });
  }

  /**
   * Detect if user is on mobile device
   */
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Add mobile class to body
   */
  function detectDevice() {
    if (isMobileDevice()) {
      document.body.classList.add('is-mobile');
    } else {
      document.body.classList.add('is-desktop');
    }
  }

  /**
   * Console welcome message
   */
  function showConsoleMessage() {
    console.log('%c🏋️ なすしおばらパーソナルジム&整体ルーム', 'font-size: 20px; font-weight: bold; color: #4A90E2;');
    console.log('%c身体と心を整える、那須高原の本格派パーソナルジム', 'font-size: 14px; color: #7CB342;');
    console.log('%cWebサイトに関するお問い合わせは: 0287-47-6181', 'font-size: 12px; color: #6C757D;');
  }

  /**
   * Error handling
   */
  function initErrorHandling() {
    window.addEventListener('error', (e) => {
      console.error('Error occurred:', e.message);
      // Add error reporting to analytics if needed
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      // Add error reporting to analytics if needed
    });
  }

  /**
   * Page visibility tracking
   */
  function initVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('Page hidden');
        // Pause videos, animations, etc. if needed
      } else {
        console.log('Page visible');
        // Resume videos, animations, etc. if needed
      }
    });
  }

  /**
   * Performance monitoring
   */
  function monitorPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = window.performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          console.log(`Page load time: ${pageLoadTime}ms`);

          // Log to analytics if needed
          // Example: gtag('event', 'timing_complete', {
          //   name: 'load',
          //   value: pageLoadTime
          // });
        }, 0);
      });
    }
  }

  /**
   * Initialize all main features
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initPricingTabs();
        initPhoneTracking();
        initLineTracking();
        initFormValidation();
        initExternalLinks();
        initCopyToClipboard();
        addCopyFeedbackStyles();
        initPrint();
        detectDevice();
        showConsoleMessage();
        initErrorHandling();
        initVisibilityTracking();
        monitorPerformance();
      });
    } else {
      initPricingTabs();
      initPhoneTracking();
      initLineTracking();
      initFormValidation();
      initExternalLinks();
      initCopyToClipboard();
      addCopyFeedbackStyles();
      initPrint();
      detectDevice();
      showConsoleMessage();
      initErrorHandling();
      initVisibilityTracking();
      monitorPerformance();
    }
  }

  // Start initialization
  init();

  // Export for external use
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      initPricingTabs,
      isMobileDevice
    };
  }

})();
