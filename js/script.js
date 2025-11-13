// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the website
    initWebsite();
});

// Translation data
let translations = {};

// Initialize all website functionality
function initWebsite() {
    // Load translations first
    loadTranslations().then(() => {
        // Initialize theme
        initTheme();
        // Initialize navigation
        initNavigation();
        // Initialize language switcher
        initLanguageSwitcher();
        // Initialize contact form
        initContactForm();
        // Initialize modals (NEW)
        initModals();
        // Initialize accessibility features
        initAccessibility();
        // Initialize performance monitoring
        initPerformanceMonitoring();
        // Initialize lazy loading
        initLazyLoading();

        // Apply initial language
        const savedLanguage = localStorage.getItem('language') || 'hr';
        applyTranslations(savedLanguage);

        // Track page view
        trackPageView();
    });
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log('Performance Metric:', entry.name, entry.value);
                    // You can send these to your analytics service
                }
            });

            observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        } catch (e) {
            console.log('Performance Observer not supported');
        }
    }

    // Track page load time
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime, 'ms');
    });
}

// Lazy loading for images
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.classList.add('loaded');
        });
    }
}

// Track page views for analytics
function trackPageView() {
    // Simple page view tracking
    console.log('Page viewed:', window.location.href);

    // You can integrate with Google Analytics here
    // gtag('config', 'GA_MEASUREMENT_ID');
}

// Load translation files
async function loadTranslations() {
    try {
        const currentLang = localStorage.getItem('language') || 'hr';
        const response = await fetch(`translations/${currentLang}.json`);
        if (!response.ok) throw new Error('Translation file not found');
        translations = await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to empty translations
        translations = {};
    }
}

// Theme functionality
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');

    if (!themeToggle || !themeIcon) return;

    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Toggle theme on button click
    themeToggle.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);

        // Track theme change
        console.log('Theme changed to:', newTheme);
    });

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update theme icon
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun theme-icon';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            themeIcon.className = 'fas fa-moon theme-icon';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
}

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!navToggle || !navMenu) return;

    // Toggle mobile navigation
    navToggle.addEventListener('click', function () {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');

        // Update menu state for screen readers
        if (!isExpanded) {
            // Menu opened - focus first item
            const firstMenuItem = navMenu.querySelector('.nav-link');
            if (firstMenuItem) firstMenuItem.focus();
        }

        // Track menu interaction
        console.log('Mobile menu toggled:', !isExpanded);
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');

            // Update aria-current for active page
            navLinks.forEach(l => l.removeAttribute('aria-current'));
            this.setAttribute('aria-current', 'page');

            // Track navigation
            console.log('Navigated to:', this.getAttribute('href'));
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.nav') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Keyboard navigation for menu
    initKeyboardNavigation();
}

// Language switcher functionality
function initLanguageSwitcher() {
    const languageButtons = document.querySelectorAll('.language-dropdown button');
    const languageSwitcher = document.querySelector('.language-switcher');
    const languageBtn = document.querySelector('.language-btn');

    if (!languageButtons.length || !languageSwitcher || !languageBtn) return;

    // Set initial language
    const savedLanguage = localStorage.getItem('language') || 'hr';
    setLanguage(savedLanguage);

    // Add click event to language buttons
    languageButtons.forEach(button => {
        button.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            languageSwitcher.classList.remove('open');

            // Track language change
            console.log('Language changed to:', lang);
        });
    });

    // Keyboard navigation for language switcher
    languageBtn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            languageSwitcher.classList.add('open');
            const firstItem = languageSwitcher.querySelector('.language-dropdown button');
            if (firstItem) firstItem.focus();
        }
    });

    // Close dropdown when focus leaves
    languageSwitcher.addEventListener('focusout', function (e) {
        if (!this.contains(e.relatedTarget)) {
            this.classList.remove('open');
        }
    });

    async function setLanguage(lang) {
        try {
            // Load new translation file
            const response = await fetch(`translations/${lang}.json`);
            if (!response.ok) throw new Error('Translation file not found');
            translations = await response.json();

            // Update current language display
            const currentLangElement = document.querySelector('.current-lang');
            if (currentLangElement) {
                currentLangElement.textContent = lang.toUpperCase();
            }

            // Save language preference
            localStorage.setItem('language', lang);

            // Update HTML lang attribute
            document.documentElement.setAttribute('lang', lang);

            // Announce language change to screen readers
            announceToScreenReader(
                lang === 'hr'
                    ? 'Jezik je promijenjen na hrvatski'
                    : 'Language changed to English'
            );

            // Apply translations
            applyTranslations(lang);
        } catch (error) {
            console.error('Error loading language:', error);
            announceToScreenReader('Error changing language', 'assertive');
        }
    }
}

// Cookie Consent and Newsletter Modals functionality
function initModals() {
    initCookieConsent();
    initNewsletterModal();
    initNewsletterTrigger();
}

// Cookie Consent functionality
function initCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    const cookieAcceptAll = document.getElementById('cookie-accept-all');
    const cookieCustomize = document.getElementById('cookie-customize');
    const necessaryCookies = document.getElementById('necessary-cookies');
    const analyticsCookies = document.getElementById('analytics-cookies');
    const marketingCookies = document.getElementById('marketing-cookies');

    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');

    if (!cookieChoice) {
        // Show cookie consent after a short delay
        setTimeout(() => {
            showCookieConsent();
        }, 1000);
    } else {
        // Apply saved cookie preferences
        applyCookiePreferences(JSON.parse(cookieChoice));
    }

    // Event listeners
    if (cookieAcceptAll) {
        cookieAcceptAll.addEventListener('click', () => {
            acceptAllCookies();
        });
    }

    if (cookieCustomize) {
        cookieCustomize.addEventListener('click', () => {
            customizeCookies();
        });
    }

    // Close modal when clicking outside
    if (cookieConsent) {
        cookieConsent.addEventListener('click', (e) => {
            if (e.target === cookieConsent) {
                hideCookieConsent();
            }
        });
    }
}

function showCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    if (cookieConsent) {
        cookieConsent.classList.add('active');
        cookieConsent.setAttribute('aria-hidden', 'false');

        // Focus management for accessibility
        const firstFocusable = cookieConsent.querySelector('button');
        if (firstFocusable) firstFocusable.focus();

        // Track cookie consent view
        console.log('Cookie consent modal shown');
    }
}

function hideCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    if (cookieConsent) {
        cookieConsent.classList.remove('active');
        cookieConsent.setAttribute('aria-hidden', 'true');
    }
}

function acceptAllCookies() {
    const preferences = {
        necessary: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString()
    };

    saveCookiePreferences(preferences);
    applyCookiePreferences(preferences);
    hideCookieConsent();

    // Show confirmation
    showNotification(
        translations.cookie?.accepted || 'Cookie preferences saved!',
        'success'
    );

    console.log('All cookies accepted:', preferences);
}

function customizeCookies() {
    const analyticsCookies = document.getElementById('analytics-cookies');
    const marketingCookies = document.getElementById('marketing-cookies');

    const preferences = {
        necessary: true, // Always required
        analytics: analyticsCookies ? analyticsCookies.checked : false,
        marketing: marketingCookies ? marketingCookies.checked : false,
        timestamp: new Date().toISOString()
    };

    saveCookiePreferences(preferences);
    applyCookiePreferences(preferences);
    hideCookieConsent();

    // Show confirmation
    showNotification(
        translations.cookie?.customized || 'Cookie preferences customized!',
        'success'
    );

    console.log('Cookies customized:', preferences);
}

function saveCookiePreferences(preferences) {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));

    // Set a cookie expiry date (1 year)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    document.cookie = `cookieConsent=${JSON.stringify(preferences)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
}

function applyCookiePreferences(preferences) {
    // Apply analytics cookies
    if (preferences.analytics) {
        enableAnalytics();
    } else {
        disableAnalytics();
    }

    // Apply marketing cookies
    if (preferences.marketing) {
        enableMarketing();
    } else {
        disableMarketing();
    }

    console.log('Applied cookie preferences:', preferences);
}

function enableAnalytics() {
    // Initialize Google Analytics, Matomo, etc.
    console.log('Analytics cookies enabled');
    // Example: gtag('config', 'GA_MEASUREMENT_ID');
}

function disableAnalytics() {
    // Disable analytics tracking
    console.log('Analytics cookies disabled');
}

function enableMarketing() {
    // Initialize marketing tools (Facebook Pixel, etc.)
    console.log('Marketing cookies enabled');
}

function disableMarketing() {
    // Disable marketing tools
    console.log('Marketing cookies disabled');
}

// Newsletter Modal functionality
function initNewsletterModal() {
    const newsletterModal = document.getElementById('newsletter-modal');
    const newsletterForm = document.getElementById('newsletter-form');
    const closeButtons = document.querySelectorAll('.modal-close');

    // Close modal events
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = button.closest('.modal');
            if (modal) hideModal(modal);
        });
    });

    // Close modal when clicking outside
    if (newsletterModal) {
        newsletterModal.addEventListener('click', (e) => {
            if (e.target === newsletterModal) {
                hideModal(newsletterModal);
            }
        });
    }

    // Newsletter form submission
    if (newsletterForm) {
        initNewsletterFormValidation(newsletterForm);

        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (validateNewsletterForm(newsletterForm)) {
                await submitNewsletterForm(newsletterForm);
            }
        });
    }

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) hideModal(activeModal);
        }
    });
}

function initNewsletterTrigger() {
    const newsletterTrigger = document.getElementById('newsletter-trigger');

    if (newsletterTrigger) {
        newsletterTrigger.addEventListener('click', () => {
            showNewsletterModal();
        });

        // Show newsletter trigger after delay
        setTimeout(() => {
            if (newsletterTrigger) {
                newsletterTrigger.style.display = 'flex';
            }
        }, 5000);
    }
}

function showNewsletterModal() {
    const newsletterModal = document.getElementById('newsletter-modal');
    if (newsletterModal) {
        showModal(newsletterModal);

        // Track newsletter modal view
        console.log('Newsletter modal shown');

        // You can add analytics here
        // gtag('event', 'newsletter_modal_view');
    }
}

function showModal(modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Focus management
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
}

function hideModal(modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scrolling
}

function initNewsletterFormValidation(form) {
    const emailInput = form.querySelector('#newsletter-email');
    const privacyCheckbox = form.querySelector('#newsletter-privacy');

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            clearFieldError(emailInput);
        });

        emailInput.addEventListener('blur', () => {
            if (emailInput.value.trim() && !isValidEmail(emailInput.value)) {
                showFieldError(emailInput, translations.newsletter?.invalidEmail || 'Please enter a valid email address');
            }
        });
    }

    if (privacyCheckbox) {
        privacyCheckbox.addEventListener('change', () => {
            clearFieldError(privacyCheckbox);
        });
    }
}

function validateNewsletterForm(form) {
    let isValid = true;
    const emailInput = form.querySelector('#newsletter-email');
    const privacyCheckbox = form.querySelector('#newsletter-privacy');

    // Validate email
    if (!emailInput.value.trim()) {
        showFieldError(emailInput, translations.newsletter?.emailRequired || 'Email address is required');
        isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
        showFieldError(emailInput, translations.newsletter?.invalidEmail || 'Please enter a valid email address');
        isValid = false;
    }

    // Validate privacy agreement
    if (!privacyCheckbox.checked) {
        showFieldError(privacyCheckbox, translations.newsletter?.privacyRequired || 'You must agree to the privacy policy');
        isValid = false;
    }

    return isValid;
}

async function submitNewsletterForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + (translations.newsletter?.submitting || 'Subscribing...');
    submitButton.disabled = true;

    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Simulate API call - replace with your actual endpoint
        await simulateNewsletterSubscription(data);

        // Show success message
        showNotification(
            translations.newsletter?.success || 'Thank you for subscribing!',
            'success'
        );

        // Reset form
        form.reset();
        clearFormErrors(form);

        // Close modal after success
        const modal = form.closest('.modal');
        if (modal) hideModal(modal);

        // Track successful subscription
        console.log('Newsletter subscription successful:', data);
        // gtag('event', 'newsletter_subscription');

    } catch (error) {
        // Show error message
        showNotification(
            translations.newsletter?.error || 'Subscription failed. Please try again.',
            'error'
        );

        console.error('Newsletter subscription error:', error);
    } finally {
        // Restore button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

async function simulateNewsletterSubscription(data) {
    // Simulate API delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random success/failure for demo
            if (Math.random() > 0.1) { // 90% success rate for demo
                resolve({ success: true, message: 'Subscribed successfully' });
            } else {
                reject(new Error('Subscription service temporarily unavailable'));
            }
        }, 1500);
    });
}

// Apply translations to the page
function applyTranslations(lang) {
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks[0] && translations.navigation?.home) navLinks[0].textContent = translations.navigation.home;
    if (navLinks[1] && translations.navigation?.services) navLinks[1].textContent = translations.navigation.services;
    if (navLinks[2] && translations.navigation?.about) navLinks[2].textContent = translations.navigation.about;
    if (navLinks[3] && translations.navigation?.contact) navLinks[3].textContent = translations.navigation.contact;

    // Update hero section
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && translations.hero?.title) heroTitle.textContent = translations.hero.title;

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && translations.hero?.subtitle) heroSubtitle.textContent = translations.hero.subtitle;

    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    if (heroButtons[0] && translations.hero?.ourServices) heroButtons[0].textContent = translations.hero.ourServices;
    if (heroButtons[1] && translations.hero?.getInTouch) heroButtons[1].textContent = translations.hero.getInTouch;

    // Update services section
    const servicesTitle = document.querySelector('.services .section-title');
    if (servicesTitle && translations.services?.title) servicesTitle.textContent = translations.services.title;

    const serviceTitles = document.querySelectorAll('.service-title');
    if (serviceTitles[0] && translations.services?.responsiveWebsites) serviceTitles[0].textContent = translations.services.responsiveWebsites;
    if (serviceTitles[1] && translations.services?.seoOptimization) serviceTitles[1].textContent = translations.services.seoOptimization;
    if (serviceTitles[2] && translations.services?.logoDesign) serviceTitles[2].textContent = translations.services.logoDesign;
    if (serviceTitles[3] && translations.services?.customDevelopment) serviceTitles[3].textContent = translations.services.customDevelopment;
    if (serviceTitles[4] && translations.services?.mobileCleanup) serviceTitles[4].textContent = translations.services.mobileCleanup;
    if (serviceTitles[5] && translations.services?.osInstallation) serviceTitles[5].textContent = translations.services.osInstallation;
    if (serviceTitles[6] && translations.services?.pcCleanup) serviceTitles[6].textContent = translations.services.pcCleanup;

    const serviceDescriptions = document.querySelectorAll('.service-description');
    if (serviceDescriptions[0] && translations.services?.responsiveWebsitesDesc) serviceDescriptions[0].textContent = translations.services.responsiveWebsitesDesc;
    if (serviceDescriptions[1] && translations.services?.seoOptimizationDesc) serviceDescriptions[1].textContent = translations.services.seoOptimizationDesc;
    if (serviceDescriptions[2] && translations.services?.logoDesignDesc) serviceDescriptions[2].textContent = translations.services.logoDesignDesc;
    if (serviceDescriptions[3] && translations.services?.customDevelopmentDesc) serviceDescriptions[3].textContent = translations.services.customDevelopmentDesc;
    if (serviceDescriptions[4] && translations.services?.mobileCleanupDesc) serviceDescriptions[4].textContent = translations.services.mobileCleanupDesc;
    if (serviceDescriptions[5] && translations.services?.osInstallationDesc) serviceDescriptions[5].textContent = translations.services.osInstallationDesc;
    if (serviceDescriptions[6] && translations.services?.pcCleanupDesc) serviceDescriptions[6].textContent = translations.services.pcCleanupDesc;

    // Update About section
    const aboutTitle = document.querySelector('.about .section-title');
    if (aboutTitle && translations.about?.title) aboutTitle.textContent = translations.about.title;

    const aboutTexts = document.querySelectorAll('.about-text p');
    if (aboutTexts[0] && translations.about?.text1) aboutTexts[0].textContent = translations.about.text1;
    if (aboutTexts[1] && translations.about?.text2) aboutTexts[1].textContent = translations.about.text2;

    // Update services overview
    const servicesOverview = document.querySelector('.services-overview h3');
    if (servicesOverview && translations.about?.servicesOverview) servicesOverview.textContent = translations.about.servicesOverview;

    // Update expertise items
    const expertiseTitles = document.querySelectorAll('.expertise-item h4');
    if (expertiseTitles[0] && translations.about?.customWebDev) expertiseTitles[0].textContent = translations.about.customWebDev;
    if (expertiseTitles[1] && translations.about?.digitalGrowth) expertiseTitles[1].textContent = translations.about.digitalGrowth;
    if (expertiseTitles[2] && translations.about?.brandIdentity) expertiseTitles[2].textContent = translations.about.brandIdentity;
    if (expertiseTitles[3] && translations.about?.completeIt) expertiseTitles[3].textContent = translations.about.completeIt;

    const expertiseDescriptions = document.querySelectorAll('.expertise-item p');
    if (expertiseDescriptions[0] && translations.about?.customWebDevDesc) expertiseDescriptions[0].textContent = translations.about.customWebDevDesc;
    if (expertiseDescriptions[1] && translations.about?.digitalGrowthDesc) expertiseDescriptions[1].textContent = translations.about.digitalGrowthDesc;
    if (expertiseDescriptions[2] && translations.about?.brandIdentityDesc) expertiseDescriptions[2].textContent = translations.about.brandIdentityDesc;
    if (expertiseDescriptions[3] && translations.about?.completeItDesc) expertiseDescriptions[3].textContent = translations.about.completeItDesc;

    // Update mission section
    const commitmentTitle = document.querySelector('.mission-section h3');
    if (commitmentTitle && translations.about?.commitment) commitmentTitle.textContent = translations.about.commitment;

    const commitmentText = document.querySelector('.mission-section p');
    if (commitmentText && translations.about?.commitmentText) commitmentText.textContent = translations.about.commitmentText;

    // Update value propositions
    const valueTitles = document.querySelectorAll('.value-item h4');
    if (valueTitles[0] && translations.about?.resultsDriven) valueTitles[0].textContent = translations.about.resultsDriven;
    if (valueTitles[1] && translations.about?.timelyDelivery) valueTitles[1].textContent = translations.about.timelyDelivery;
    if (valueTitles[2] && translations.about?.ongoingSupport) valueTitles[2].textContent = translations.about.ongoingSupport;

    const valueDescriptions = document.querySelectorAll('.value-item p');
    if (valueDescriptions[0] && translations.about?.resultsDrivenDesc) valueDescriptions[0].textContent = translations.about.resultsDrivenDesc;
    if (valueDescriptions[1] && translations.about?.timelyDeliveryDesc) valueDescriptions[1].textContent = translations.about.timelyDeliveryDesc;
    if (valueDescriptions[2] && translations.about?.ongoingSupportDesc) valueDescriptions[2].textContent = translations.about.ongoingSupportDesc;

    // Update owner information
    const ownerName = document.querySelector('.owner-info h4');
    if (ownerName && translations.about?.ownerName) ownerName.textContent = translations.about.ownerName;

    const ownerTitle = document.querySelector('.owner-info p');
    if (ownerTitle && translations.about?.ownerTitle) ownerTitle.textContent = translations.about.ownerTitle;

    const ownerEmail = document.querySelector('.owner-contact a[href^="mailto:"] span');
    if (ownerEmail && translations.about?.ownerEmail) {
        ownerEmail.textContent = translations.about.ownerEmail;
        // Also update the href attribute
        const emailLink = ownerEmail.closest('a');
        if (emailLink) emailLink.href = `mailto:${translations.about.ownerEmail}`;
    }

    const ownerPhone = document.querySelector('.owner-contact a[href^="tel:"] span');
    if (ownerPhone && translations.about?.ownerPhone) {
        ownerPhone.textContent = translations.about.ownerPhone;
        // Also update the href attribute
        const phoneLink = ownerPhone.closest('a');
        if (phoneLink) phoneLink.href = `tel:${translations.about.ownerPhone.replace(/\s/g, '')}`;
    }

    // Update contact section
    const contactTitle = document.querySelector('.contact .section-title');
    if (contactTitle && translations.contact?.title) contactTitle.textContent = translations.contact.title;

    const contactInfo = document.querySelector('.contact-info h3');
    if (contactInfo && translations.contact?.info) contactInfo.textContent = translations.contact.info;

    const contactText = document.querySelector('.contact-info p');
    if (contactText && translations.contact?.text) contactText.textContent = translations.contact.text;

    const contactDetails = document.querySelectorAll('.contact-details strong');
    if (contactDetails[0] && translations.contact?.address) contactDetails[0].textContent = translations.contact.address;
    if (contactDetails[1] && translations.contact?.phone) contactDetails[1].textContent = translations.contact.phone;
    if (contactDetails[2] && translations.contact?.email) contactDetails[2].textContent = translations.contact.email;

    // Update form labels
    const formLabels = document.querySelectorAll('.form-group label');
    if (formLabels[0] && translations.contact?.name) {
        formLabels[0].innerHTML = `${translations.contact.name} <span class="required" aria-hidden="true">*</span><span class="sr-only">required</span>`;
    }
    if (formLabels[1] && translations.contact?.email) {
        formLabels[1].innerHTML = `${translations.contact.email} <span class="required" aria-hidden="true">*</span><span class="sr-only">required</span>`;
    }
    if (formLabels[2] && translations.contact?.subject) {
        formLabels[2].innerHTML = `${translations.contact.subject} <span class="required" aria-hidden="true">*</span><span class="sr-only">required</span>`;
    }
    if (formLabels[3] && translations.contact?.message) {
        formLabels[3].innerHTML = `${translations.contact.message} <span class="required" aria-hidden="true">*</span><span class="sr-only">required</span>`;
    }

    // Update form placeholders
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    if (formInputs[0] && translations.contact?.name) formInputs[0].placeholder = translations.contact.name;
    if (formInputs[1] && translations.contact?.email) formInputs[1].placeholder = translations.contact.email;
    if (formInputs[2] && translations.contact?.subject) formInputs[2].placeholder = translations.contact.subject;
    if (formInputs[3] && translations.contact?.message) formInputs[3].placeholder = translations.contact.message;

    // Update submit button
    const submitButton = document.querySelector('.contact-form .btn');
    if (submitButton && translations.contact?.sendMessage) {
        submitButton.innerHTML = `<i class="fas fa-paper-plane" aria-hidden="true"></i> ${translations.contact.sendMessage}`;
    }

    // Update footer
    const footerLinks = document.querySelector('.footer-links h3');
    if (footerLinks && translations.footer?.quickLinks) footerLinks.textContent = translations.footer.quickLinks;

    const footerNavLinks = document.querySelectorAll('.footer-links a');
    if (footerNavLinks[0] && translations.navigation?.home) footerNavLinks[0].textContent = translations.navigation.home;
    if (footerNavLinks[1] && translations.navigation?.services) footerNavLinks[1].textContent = translations.navigation.services;
    if (footerNavLinks[2] && translations.navigation?.about) footerNavLinks[2].textContent = translations.navigation.about;
    if (footerNavLinks[3] && translations.navigation?.contact) footerNavLinks[3].textContent = translations.navigation.contact;

    const footerContact = document.querySelector('.footer-contact h3');
    if (footerContact && translations.contact?.info) footerContact.textContent = translations.contact.info;

    const copyright = document.querySelector('.footer-bottom p');
    if (copyright && translations.footer?.copyright) copyright.textContent = translations.footer.copyright;

    // Update cookie consent texts
    const cookieTitle = document.getElementById('cookie-consent-title');
    if (cookieTitle && translations.cookie?.title) cookieTitle.textContent = translations.cookie.title;

    const cookieMessage = document.querySelector('#cookie-consent .modal-body p');
    if (cookieMessage && translations.cookie?.message) cookieMessage.textContent = translations.cookie.message;

    const necessaryLabel = document.querySelector('[data-translate="cookie.necessary"]');
    if (necessaryLabel && translations.cookie?.necessary) necessaryLabel.textContent = translations.cookie.necessary;

    const necessaryDesc = document.querySelector('[data-translate="cookie.necessaryDesc"]');
    if (necessaryDesc && translations.cookie?.necessaryDesc) necessaryDesc.textContent = translations.cookie.necessaryDesc;

    const analyticsLabel = document.querySelector('[data-translate="cookie.analytics"]');
    if (analyticsLabel && translations.cookie?.analytics) analyticsLabel.textContent = translations.cookie.analytics;

    const analyticsDesc = document.querySelector('[data-translate="cookie.analyticsDesc"]');
    if (analyticsDesc && translations.cookie?.analyticsDesc) analyticsDesc.textContent = translations.cookie.analyticsDesc;

    const marketingLabel = document.querySelector('[data-translate="cookie.marketing"]');
    if (marketingLabel && translations.cookie?.marketing) marketingLabel.textContent = translations.cookie.marketing;

    const marketingDesc = document.querySelector('[data-translate="cookie.marketingDesc"]');
    if (marketingDesc && translations.cookie?.marketingDesc) marketingDesc.textContent = translations.cookie.marketingDesc;

    const customizeBtn = document.getElementById('cookie-customize');
    if (customizeBtn && translations.cookie?.customize) customizeBtn.textContent = translations.cookie.customize;

    const acceptAllBtn = document.getElementById('cookie-accept-all');
    if (acceptAllBtn && translations.cookie?.acceptAll) acceptAllBtn.textContent = translations.cookie.acceptAll;

    // Update newsletter texts
    const newsletterTitle = document.getElementById('newsletter-title');
    if (newsletterTitle && translations.newsletter?.title) newsletterTitle.textContent = translations.newsletter.title;

    const newsletterSubtitle = document.querySelector('#newsletter-modal .modal-header p');
    if (newsletterSubtitle && translations.newsletter?.subtitle) newsletterSubtitle.textContent = translations.newsletter.subtitle;

    const newsletterNameLabel = document.querySelector('label[for="newsletter-name"]');
    if (newsletterNameLabel && translations.newsletter?.name) newsletterNameLabel.textContent = translations.newsletter.name;

    const newsletterEmailLabel = document.querySelector('label[for="newsletter-email"]');
    if (newsletterEmailLabel && translations.newsletter?.email) newsletterEmailLabel.textContent = translations.newsletter.email;

    const newsletterPrivacyLabel = document.querySelector('[data-translate="newsletter.privacy"]');
    if (newsletterPrivacyLabel && translations.newsletter?.privacy) newsletterPrivacyLabel.textContent = translations.newsletter.privacy;

    const newsletterSubscribeBtn = document.querySelector('#newsletter-form .btn');
    if (newsletterSubscribeBtn && translations.newsletter?.subscribe) {
        newsletterSubscribeBtn.innerHTML = `<i class="fas fa-paper-plane" aria-hidden="true"></i> ${translations.newsletter.subscribe}`;
    }

    // Update placeholders
    const newsletterNameInput = document.getElementById('newsletter-name');
    if (newsletterNameInput && translations.newsletter?.name) newsletterNameInput.placeholder = translations.newsletter.name;

    const newsletterEmailInput = document.getElementById('newsletter-email');
    if (newsletterEmailInput && translations.newsletter?.email) newsletterEmailInput.placeholder = translations.newsletter.email;
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        // Initialize form validation
        initFormValidation(contactForm);

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validateForm(this)) {
                // Get form data
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);

                // Track form submission
                console.log('Form submitted:', data);
                // You can send this to your analytics service
                // gtag('event', 'form_submit', { form_name: 'contact' });

                // Show success message
                const currentLang = localStorage.getItem('language') || 'hr';
                const successMessage = currentLang === 'hr'
                    ? 'Hvala vam na poruci! Javit ćemo vam se uskoro.'
                    : 'Thank you for your message! We will get back to you soon.';

                // You can replace this with a more user-friendly notification system
                showNotification(successMessage, 'success');

                // In a real implementation, you would send this data to a server
                // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });

                // Reset form
                this.reset();
                clearFormErrors(this);
            } else {
                // Track form validation errors
                console.log('Form validation failed');
            }
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style based on type
    const styles = {
        success: {
            background: 'var(--success-color)',
            color: 'white'
        },
        error: {
            background: 'var(--error-color)',
            color: 'white'
        },
        warning: {
            background: 'var(--warning-color)',
            color: 'white'
        },
        info: {
            background: 'var(--primary-color)',
            color: 'white'
        }
    };

    const style = styles[type] || styles.info;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        background: ${style.background};
        color: ${style.color};
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Form validation
function initFormValidation(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
        input.addEventListener('invalid', function (e) {
            e.preventDefault();
            this.setAttribute('aria-invalid', 'true');
            showFieldError(this);
        });

        input.addEventListener('input', function () {
            if (this.getAttribute('aria-invalid') === 'true') {
                this.setAttribute('aria-invalid', 'false');
                clearFieldError(this);
            }
        });

        input.addEventListener('blur', function () {
            if (this.value.trim() === '' && this.hasAttribute('required')) {
                this.setAttribute('aria-invalid', 'true');
                showFieldError(this);
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
        if (input.value.trim() === '') {
            input.setAttribute('aria-invalid', 'true');
            showFieldError(input);
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            input.setAttribute('aria-invalid', 'true');
            showFieldError(input, 'Please enter a valid email address');
            isValid = false;
        }
    });

    return isValid;
}

function showFieldError(field, customMessage = null) {
    const errorId = field.id + '-error';
    let errorElement = document.getElementById(errorId);

    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = errorId;
        errorElement.className = 'error-message';
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');
        field.parentNode.appendChild(errorElement);
    }

    const fieldName = field.previousElementSibling?.textContent?.replace('*', '').trim() || 'This field';
    errorElement.textContent = customMessage || `${fieldName} is required.`;
}

function clearFieldError(field) {
    const errorId = field.id + '-error';
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function clearFormErrors(form) {
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.textContent = '');

    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => input.setAttribute('aria-invalid', 'false'));
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Accessibility features
function initAccessibility() {
    // Improved keyboard navigation
    initKeyboardNavigation();

    // Reduced motion support
    initReducedMotion();

    // Focus management
    initFocusManagement();
}

function initKeyboardNavigation() {
    // Enhanced keyboard navigation for all interactive elements
    document.addEventListener('keydown', function (e) {
        // Close mobile menu on Escape
        if (e.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');

            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }

            // Close language dropdown
            const languageSwitcher = document.querySelector('.language-switcher');
            if (languageSwitcher && languageSwitcher.classList.contains('open')) {
                languageSwitcher.classList.remove('open');
                document.querySelector('.language-btn').focus();
            }
        }
    });
}

function initReducedMotion() {
    // Check if user prefers reduced motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reducedMotion.matches) {
        document.documentElement.classList.add('reduced-motion');
    }

    // Listen for changes
    reducedMotion.addEventListener('change', () => {
        if (reducedMotion.matches) {
            document.documentElement.classList.add('reduced-motion');
        } else {
            document.documentElement.classList.remove('reduced-motion');
        }
    });
}

function initFocusManagement() {
    // Manage focus for modal-like elements
    const languageSwitcher = document.querySelector('.language-switcher');
    const languageDropdown = document.querySelector('.language-dropdown');

    if (languageDropdown) {
        languageDropdown.addEventListener('keydown', function (e) {
            const items = Array.from(this.querySelectorAll('button'));
            const currentIndex = items.indexOf(document.activeElement);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % items.length;
                items[nextIndex].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + items.length) % items.length;
                items[prevIndex].focus();
            } else if (e.key === 'Home') {
                e.preventDefault();
                items[0].focus();
            } else if (e.key === 'End') {
                e.preventDefault();
                items[items.length - 1].focus();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.closest('.language-switcher').classList.remove('open');
                document.querySelector('.language-btn').focus();
            }
        });
    }
}

// Utility function for screen reader announcements
function announceToScreenReader(message, politeness = 'polite') {
    // Remove existing announcement
    const existingAnnouncement = document.getElementById('a11y-announcement');
    if (existingAnnouncement) {
        existingAnnouncement.remove();
    }

    // Create new announcement
    const announcement = document.createElement('div');
    announcement.id = 'a11y-announcement';
    announcement.setAttribute('aria-live', politeness);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement is read
    setTimeout(() => {
        if (announcement.parentNode) {
            announcement.parentNode.removeChild(announcement);
        }
    }, 1000);
}

// Error boundary for the entire application
window.addEventListener('error', function (e) {
    console.error('Global error:', e.error);
    // You can send this to your error tracking service
    // Sentry.captureException(e.error);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initWebsite,
        applyTranslations,
        validateForm
    };
}