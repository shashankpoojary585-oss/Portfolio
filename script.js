/**
 * Shashank Poojary - Developer Portfolio Scripts
 * Handles:
 * - Light/Dark Theme Switching (defaults to Light, remembers preference)
 * - Sticky Header with active section indicator
 * - Mobile Drawer navigation & focus management
 * - Category filter tabs for Academic Labs & Learning Roadmap
 * - Interactive Resume Modal (preview, print, save)
 * - Copy-to-clipboard for Email & Phone with Toast alerts
 * - Accessible contact form with mailto fallback
 */

(function () {
  'use strict';

  // ----------------------------------------------------------------------------
  // 1. Theme Management (Orange & Charcoal: Light default, Dark toggle)
  // ----------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeToggleMobileBtn = document.getElementById('themeToggleMobileBtn');

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Default to 'light' per requirements, or follow system if user explicitly set dark
    return 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const isDark = theme === 'dark';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    [themeToggleBtn, themeToggleMobileBtn].forEach((btn) => {
      if (btn) {
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
        // Switch between sun and moon icon
        const sunIcon = btn.querySelector('.theme-icon-sun');
        const moonIcon = btn.querySelector('.theme-icon-moon');
        if (sunIcon && moonIcon) {
          if (isDark) {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
          } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
          }
        }
      }
    });
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} theme`);
  }

  // Initialize theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  if (themeToggleMobileBtn) {
    themeToggleMobileBtn.addEventListener('click', toggleTheme);
  }

  // ----------------------------------------------------------------------------
  // 2. Sticky Header & Active Nav Intersection Observer
  // ----------------------------------------------------------------------------
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  }, { passive: true });

  // Highlight active section on scroll
  const observedSections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && observedSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          updateActiveNavLinks(currentId);
        }
      });
    }, observerOptions);

    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  function updateActiveNavLinks(sectionId) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });

    drawerLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  // ----------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // ----------------------------------------------------------------------------
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  function openDrawer() {
    mobileDrawer.classList.add('is-open');
    drawerBackdrop.classList.add('is-open');
    mobileNavToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    if (drawerCloseBtn) drawerCloseBtn.focus();
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('is-open');
    drawerBackdrop.classList.remove('is-open');
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', openDrawer);
  }
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      closeDrawer();
      if (mobileNavToggle) mobileNavToggle.focus();
    }
  });

  // ----------------------------------------------------------------------------
  // 4. Learning Journey & Active Explorations Filter Tabs
  // ----------------------------------------------------------------------------
  const filterTabs = document.querySelectorAll('.tab-btn');
  const labCards = document.querySelectorAll('.lab-card');

  filterTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetFilter = btn.getAttribute('data-filter');

      // Update active tab button
      filterTabs.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      // Filter cards
      labCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (targetFilter === 'all' || category === targetFilter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ----------------------------------------------------------------------------
  // 5. Interactive Resume Modal
  // ----------------------------------------------------------------------------
  const resumeModal = document.getElementById('resumeModal');
  const openResumeButtons = document.querySelectorAll('.js-open-resume');
  const closeResumeBtn = document.getElementById('closeResumeBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  function openResume() {
    if (!resumeModal) return;
    resumeModal.classList.add('is-open');
    resumeModal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    if (closeResumeBtn) closeResumeBtn.focus();
  }

  function closeResume() {
    if (!resumeModal) return;
    resumeModal.classList.remove('is-open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openResumeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openResume();
    });
  });

  if (closeResumeBtn) {
    closeResumeBtn.addEventListener('click', closeResume);
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResume();
      }
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('is-open')) {
      closeResume();
    }
  });

  // ----------------------------------------------------------------------------
  // 6. Copy to Clipboard Utility & Toast Notification
  // ----------------------------------------------------------------------------
  const toastElement = document.getElementById('toast');
  let toastTimeout = null;

  function showToast(message) {
    if (!toastElement) return;
    const toastMsg = toastElement.querySelector('.toast-message') || toastElement;
    toastMsg.textContent = message;

    toastElement.classList.add('is-active');

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      toastElement.classList.remove('is-active');
    }, 3200);
  }

  window.copyTextToClipboard = function (text, successMsg) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg || `Copied to clipboard: ${text}`);
      }).catch(() => {
        fallbackCopyText(text, successMsg);
      });
    } else {
      fallbackCopyText(text, successMsg);
    }
  };

  function fallbackCopyText(text, successMsg) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg || `Copied to clipboard: ${text}`);
    } catch (err) {
      showToast('Could not copy automatically. Please select text.');
    }
    document.body.removeChild(textArea);
  }

  // Bind copy buttons
  const copyEmailButtons = document.querySelectorAll('.js-copy-email');
  copyEmailButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.copyTextToClipboard('shashankpoojary585@gmail.com', 'Email copied to clipboard!');
    });
  });

  const copyPhoneButtons = document.querySelectorAll('.js-copy-phone');
  copyPhoneButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.copyTextToClipboard('7022953137', 'Phone number copied to clipboard!');
    });
  });

  // ----------------------------------------------------------------------------
  // 7. Contact Message Form Handling
  // ----------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const senderName = document.getElementById('senderName').value.trim();
      const senderEmail = document.getElementById('senderEmail').value.trim();
      const senderSubject = document.getElementById('senderSubject').value.trim();
      const senderMessage = document.getElementById('senderMessage').value.trim();

      if (!senderName || !senderEmail || !senderMessage) {
        alert('Please fill out all required fields.');
        return;
      }

      // Build mailto URI with encoded content
      const subject = encodeURIComponent(senderSubject || `Portfolio Inquiry from ${senderName}`);
      const body = encodeURIComponent(
        `Hello Shashank,\n\nName: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${senderMessage}\n\nSent via Portfolio Website`
      );
      const mailtoUrl = `mailto:shashankpoojary585@gmail.com?subject=${subject}&body=${body}`;

      // Show success feedback
      if (formFeedback) {
        formFeedback.textContent = 'Opening your email client to send message to Shashank...';
        formFeedback.className = 'form-feedback is-visible is-success';
      }

      showToast('Opening email client...');

      // Trigger mailto link
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);

      // Optional form reset after a delay
      setTimeout(() => {
        contactForm.reset();
        if (formFeedback) {
          formFeedback.textContent = 'Message drafted! Thank you for connecting.';
        }
      }, 2500);
    });
  }

  // ----------------------------------------------------------------------------
  // 8. Back to Top Button
  // ----------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

})();
