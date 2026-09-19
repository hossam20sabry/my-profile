/**
 * HOSSAM SABRY — MODERN BRUTALIST LANDING PAGE JAVASCRIPT
 * Multi-Language (Arabic default + English toggle)
 * Vanilla JS, lightweight, responsive, accessible.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Language Management & i18n Engine
  // --------------------------------------------------------------------------
  const DEFAULT_LANG = 'ar'; // Arabic is the primary default for target Arab clients
  let currentLang = localStorage.getItem('hossam_lang') || DEFAULT_LANG;

  // Helper to safely access nested translation keys like 'hero.title'
  const getTranslation = (keyPath, lang = currentLang) => {
    if (!window.translations || !window.translations[lang]) return null;
    const keys = keyPath.split('.');
    let current = window.translations[lang];
    for (const key of keys) {
      if (current === undefined || current === null) return null;
      current = current[key];
    }
    return current;
  };

  const updateMarquee = (lang) => {
    const track = document.getElementById('marquee-track');
    if (!track || !window.translations || !window.translations[lang]) return;
    const items = window.translations[lang].marquee || [];
    let html = '';
    // Repeat items to ensure seamless loop
    const combined = [...items, ...items];
    combined.forEach(item => {
      html += `<span class="marquee-item">${item}</span><span class="marquee-star">✦</span>`;
    });
    track.innerHTML = html;
  };

  const updateDeliverableLists = (lang) => {
    if (!window.translations || !window.translations[lang]) return;
    const services = window.translations[lang].services;
    for (let i = 1; i <= 6; i++) {
      const listEl = document.getElementById(`service-${i}-list`);
      const items = services[`s${i}List`];
      if (listEl && Array.isArray(items)) {
        listEl.innerHTML = items.map(item => `<li>${item}</li>`).join('');
      }
    }
  };

  const updateProjectCapabilities = (lang) => {
    if (!window.translations || !window.translations[lang]) return;
    const projects = window.translations[lang].projects;
    for (let i = 1; i <= 4; i++) {
      const capsEl = document.getElementById(`proj-${i}-caps`);
      const caps = projects[`p${i}Caps`];
      if (capsEl && Array.isArray(caps)) {
        capsEl.innerHTML = caps.map(cap => `<span class="cap-pill">${cap}</span>`).join('');
      }
    }

    // Domain competencies pills
    const compPillsWrap = document.getElementById('comp-pills-wrap');
    if (compPillsWrap && Array.isArray(projects.compPills)) {
      compPillsWrap.innerHTML = projects.compPills
        .map(pill => `<span class="comp-badge">${pill}</span>`)
        .join('');
    }
  };

  const updateScalabilityLists = (lang) => {
    if (!window.translations || !window.translations[lang]) return;
    const sc = window.translations[lang].scalability;

    const fragileList = document.getElementById('fragile-list');
    if (fragileList && Array.isArray(sc.fragileList)) {
      fragileList.innerHTML = sc.fragileList
        .map(item => `<li><strong>${item.title}</strong> ${item.text}</li>`)
        .join('');
    }

    const robustList = document.getElementById('robust-list');
    if (robustList && Array.isArray(sc.robustList)) {
      robustList.innerHTML = sc.robustList
        .map(item => `<li><strong>${item.title}</strong> ${item.text}</li>`)
        .join('');
    }

    const quoteEl = document.getElementById('scalability-quote');
    if (quoteEl && sc.quote) {
      quoteEl.innerHTML = sc.quote;
    }

    const leadEl = document.getElementById('scalability-lead');
    if (leadEl && sc.lead) {
      leadEl.innerHTML = sc.lead;
    }
  };

  const updateTechGrid = (lang) => {
    if (!window.translations || !window.translations[lang]) return;
    const techGrid = document.getElementById('tech-tags-grid');
    const items = window.translations[lang].tech?.items;
    if (techGrid && Array.isArray(items)) {
      techGrid.innerHTML = items
        .map(t => `
          <div class="tech-tag-item">
            <span class="tech-name">${t.name}</span>
            <small class="tech-desc">${t.desc}</small>
          </div>
        `)
        .join('');
    }
  };

  const setLanguage = (lang) => {
    if (!window.translations || !window.translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('hossam_lang', lang);

    const isRtl = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

    const t = window.translations[lang];

    // Document Title & Meta Description
    if (t.meta) {
      document.title = t.meta.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', t.meta.description);
    }

    // Update simple text nodes with data-i18n
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = getTranslation(key, lang);
      if (translation !== null && typeof translation === 'string') {
        el.textContent = translation;
      }
    });

    // Update directional arrows on buttons: ↖ for RTL (Arabic) vs ↗ for LTR (English)
    const arrowChar = isRtl ? '↖' : '↗';
    document.querySelectorAll('.btn-arrow').forEach(arrow => {
      if (arrow.textContent.trim() !== '↓' && arrow.textContent.trim() !== '↑') {
        arrow.textContent = arrowChar;
      }
    });

    // Update Header Language Toggle button text
    const langLabel = document.getElementById('lang-label');
    if (langLabel) {
      langLabel.textContent = isRtl ? 'EN' : 'عربي';
    }

    // Update Drawer Language button text
    const drawerLangText = document.getElementById('drawer-lang-text');
    if (drawerLangText) {
      drawerLangText.textContent = isRtl ? 'Switch to English (EN)' : 'التبديل إلى العربية (AR)';
    }

    // Update Form placeholders and option texts
    const nameInput = document.getElementById('client-name');
    if (nameInput && t.contact) {
      nameInput.placeholder = t.contact.namePlaceholder;
    }

    const emailInput = document.getElementById('client-email');
    if (emailInput && t.contact) {
      emailInput.placeholder = t.contact.emailPlaceholder;
    }

    const detailsInput = document.getElementById('project-details');
    if (detailsInput && t.contact) {
      detailsInput.placeholder = t.contact.detailsPlaceholder;
    }

    // Complex lists & components
    updateMarquee(lang);
    updateDeliverableLists(lang);
    updateProjectCapabilities(lang);
    updateScalabilityLists(lang);
    updateTechGrid(lang);

    // Update Footer Copyright with year
    const currentYear = new Date().getFullYear();
    const footerCopy = document.getElementById('footer-copy');
    if (footerCopy && t.footer) {
      footerCopy.textContent = t.footer.copyright.replace('{year}', currentYear);
    }
  };

  // Language toggle click handlers
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const newLang = currentLang === 'ar' ? 'en' : 'ar';
      setLanguage(newLang);
    });
  }

  const drawerLangBtn = document.getElementById('drawer-lang-btn');
  if (drawerLangBtn) {
    drawerLangBtn.addEventListener('click', () => {
      const newLang = currentLang === 'ar' ? 'en' : 'ar';
      setLanguage(newLang);
      closeDrawer();
    });
  }

  // Initial load
  setLanguage(currentLang);

  // --------------------------------------------------------------------------
  // 2. Sticky Header Elevation on Scroll
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerClose = document.getElementById('drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    drawerBackdrop?.classList.add('active');
    mobileToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    drawerBackdrop?.classList.remove('active');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer?.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  // Close drawer on clicking ANY link inside it (nav links and the bottom CTA button)
  const allDrawerLinks = mobileDrawer?.querySelectorAll('a');
  allDrawerLinks?.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      closeDrawer();
    }
  });

  // --------------------------------------------------------------------------
  // 4. Client-Focused Questions Accordion ("DO YOU NEED...")
  // --------------------------------------------------------------------------
  const questionCards = document.querySelectorAll('.question-card');

  questionCards.forEach(card => {
    const header = card.querySelector('.question-header');
    const toggleBtn = card.querySelector('.question-toggle-btn');

    const toggleCard = () => {
      const isExpanded = card.getAttribute('data-expanded') === 'true';
      card.setAttribute('data-expanded', !isExpanded);
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', !isExpanded);
      }
    };

    if (header) {
      header.addEventListener('click', toggleCard);
    }
  });

  // --------------------------------------------------------------------------
  // 5. Copy to Clipboard (Email & WhatsApp)
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.stopPropagation();
      const textToCopy = button.getAttribute('data-copy');
      const textSpan = button.querySelector('.copy-text');
      const originalText = textSpan ? textSpan.textContent : (currentLang === 'ar' ? 'نسخ' : 'COPY');
      const copiedText = currentLang === 'ar' ? 'تم النسخ!' : 'COPIED!';

      if (!textToCopy) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        if (textSpan) {
          textSpan.textContent = copiedText;
          button.style.backgroundColor = 'var(--color-accent)';
          button.style.color = 'var(--color-black)';
        }

        setTimeout(() => {
          if (textSpan) {
            textSpan.textContent = originalText;
            button.style.backgroundColor = '';
            button.style.color = '';
          }
        }, 2200);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. Project Inquiry Form Handling
  // --------------------------------------------------------------------------
  const form = document.getElementById('project-inquiry-form');
  const formFeedback = document.getElementById('form-feedback');

  if (form) {
    const nameInput = document.getElementById('client-name');
    const emailInput = document.getElementById('client-email');
    const detailsInput = document.getElementById('project-details');

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const clearErrors = () => {
      const errorGroups = form.querySelectorAll('.form-group.has-error');
      errorGroups.forEach(group => group.classList.remove('has-error'));
      if (formFeedback) {
        formFeedback.className = 'form-feedback';
        formFeedback.textContent = '';
      }
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let hasError = false;
      const t = window.translations[currentLang].contact;

      // Validate Name
      if (!nameInput || !nameInput.value.trim()) {
        nameInput?.closest('.form-group')?.classList.add('has-error');
        hasError = true;
      }

      // Validate Email
      if (!emailInput || !emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        emailInput?.closest('.form-group')?.classList.add('has-error');
        hasError = true;
      }

      // Validate Project Details
      if (!detailsInput || !detailsInput.value.trim()) {
        detailsInput?.closest('.form-group')?.classList.add('has-error');
        hasError = true;
      }

      if (hasError) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.textContent = t.errors.general;
        }
        return;
      }

      // Successful client-side interaction
      const clientName = nameInput.value.trim();
      const projectTypeSelect = document.getElementById('project-type');
      const projectType = projectTypeSelect ? projectTypeSelect.options[projectTypeSelect.selectedIndex]?.text : 'Project';

      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        let successHtml = t.success.body
          .replace('{name}', clientName)
          .replace('{type}', projectType)
          .replace('{nameEncoded}', encodeURIComponent(clientName))
          .replace('{detailsEncoded}', encodeURIComponent(detailsInput.value.trim()));

        formFeedback.innerHTML = `
          <strong>${t.success.title}</strong><br>
          ${successHtml}
        `;
      }

      // Reset fields
      form.reset();
    });
  }
});
