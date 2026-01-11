/**
 * Scroll Animations using Intersection Observer API
 * Triggers animations when elements come into viewport
 */

(function() {
  'use strict';

  /**
   * Initialize scroll animations
   */
  function initScrollAnimations() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      console.log('Intersection Observer not supported, animations disabled');
      // Fallback: show all elements immediately
      const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right, .scale-in');
      animatedElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    // Intersection Observer options
    const observerOptions = {
      root: null, // use viewport
      rootMargin: '0px 0px -100px 0px', // trigger slightly before element enters viewport
      threshold: 0.1 // trigger when 10% of element is visible
    };

    // Create observer instance
    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Select all elements to animate
    const animatedElements = document.querySelectorAll(
      '.fade-in, .slide-up, .slide-in-left, .slide-in-right, .scale-in'
    );

    // Observe each element
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * Handle intersection events
   * @param {IntersectionObserverEntry[]} entries
   * @param {IntersectionObserver} observer
   */
  function handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Element is in viewport, add animate class
        entry.target.classList.add('animate');

        // Optional: unobserve after animation to improve performance
        // Uncomment if you want one-time animations only
        // observer.unobserve(entry.target);
      } else {
        // Optional: remove animate class when element leaves viewport
        // This allows re-animation when scrolling back
        // Uncomment if you want repeating animations
        // entry.target.classList.remove('animate');
      }
    });
  }

  /**
   * Number counter animation
   * Animates numbers from 0 to target value
   */
  function initNumberCounters() {
    const counters = document.querySelectorAll('.trainer__stat-number');

    const observerOptions = {
      root: null,
      threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          animateCounter(entry.target);
          entry.target.classList.add('counted');
        }
      });
    }, observerOptions);

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  /**
   * Animate a counter element
   * @param {HTMLElement} element
   */
  function animateCounter(element) {
    const target = element.textContent.trim();
    const isNumber = !isNaN(parseInt(target.replace(/[^0-9]/g, '')));

    if (!isNumber) return;

    const targetNumber = parseInt(target.replace(/[^0-9]/g, ''));
    const duration = 2000; // 2 seconds
    const increment = targetNumber / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNumber) {
        element.textContent = target; // restore original text with + or other characters
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString() + (target.includes('+') ? '+' : '');
      }
    }, 16);
  }

  /**
   * Parallax effect on scroll
   */
  function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');

    if (parallaxElements.length === 0) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }, { passive: true });
  }

  /**
   * Reveal elements progressively as they enter viewport
   */
  function initProgressiveReveal() {
    const revealElements = document.querySelectorAll('.reveal-progressive');

    if (revealElements.length === 0) return;

    const observerOptions = {
      root: null,
      threshold: 0.2
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  }

  /**
   * Header scroll behavior
   * Add/remove classes based on scroll position
   */
  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Add shadow when scrolled
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide header on scroll down, show on scroll up
      if (currentScroll > scrollThreshold) {
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
          // Scrolling down
          header.classList.add('scroll-down');
          header.classList.remove('scroll-up');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
          // Scrolling up
          header.classList.add('scroll-up');
          header.classList.remove('scroll-down');
        }
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  /**
   * Lazy load images
   */
  function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      return;
    }

    // Fallback for browsers that don't support native lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }

  /**
   * Add entrance animation to page on load
   */
  function initPageEntrance() {
    document.body.classList.add('page-enter');
  }

  /**
   * Performance optimization
   * Add will-change property before animation, remove after
   */
  function optimizeAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right, .scale-in');

    animatedElements.forEach(element => {
      // Add will-change before animation
      element.addEventListener('animationstart', () => {
        element.style.willChange = 'transform, opacity';
      }, { once: true });

      // Remove will-change after animation
      element.addEventListener('animationend', () => {
        element.style.willChange = 'auto';
      }, { once: true });
    });
  }

  /**
   * Initialize all scroll animations on DOM ready
   */
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initScrollAnimations();
        initNumberCounters();
        initParallax();
        initProgressiveReveal();
        initHeaderScroll();
        initLazyLoad();
        initPageEntrance();
        optimizeAnimations();
      });
    } else {
      // DOM is already ready
      initScrollAnimations();
      initNumberCounters();
      initParallax();
      initProgressiveReveal();
      initHeaderScroll();
      initLazyLoad();
      initPageEntrance();
      optimizeAnimations();
    }
  }

  // Start initialization
  init();

  // Export functions for external use if needed
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      initScrollAnimations,
      initNumberCounters,
      initParallax
    };
  }

})();
