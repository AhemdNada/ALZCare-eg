// Main UI JS: AOS init, mobile menu, smooth-scroll, contact form validation.
// Keep simple and accessible.

// Init AOS
document.addEventListener('DOMContentLoaded', function () {
    if (window.AOS) {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: false
      });
    }
  
    // Year in footer
    const yearSpan = document.getElementById('yearSpan');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  
    // Mobile menu toggles - Fixed for proper functionality
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileCloseBtn');
    const mobileBackdrop = document.getElementById('mobileMenuBackdrop');
    const hamburgerIcon = document.getElementById('hamburgerIcon');
  
    function openMobile() {
      if (!mobileMenu || !mobileBtn) return;
      
      // Remove hidden class to show menu
      mobileMenu.classList.remove('hidden');
      mobileBtn.setAttribute('aria-expanded', 'true');
      
      // Prevent body scroll when menu is open
      document.body.classList.add('menu-open');
      
      // Change hamburger icon to X
      if (hamburgerIcon) {
        hamburgerIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
      }
      
      // Force reflow to ensure animation triggers
      void mobileMenu.offsetWidth;
    }
    
    function closeMobile() {
      if (!mobileMenu || !mobileBtn) return;
      
      // Add hidden class to hide menu
      mobileMenu.classList.add('hidden');
      mobileBtn.setAttribute('aria-expanded', 'false');
      
      // Restore body scroll
      document.body.classList.remove('menu-open');
      
      // Change X icon back to hamburger
      if (hamburgerIcon) {
        hamburgerIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>';
      }
    }
  
    // Event listeners with proper event handling
    if (mobileBtn) {
      mobileBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (mobileMenu.classList.contains('hidden')) {
          openMobile();
        } else {
          closeMobile();
        }
      });
    }
    
    if (mobileClose) {
      mobileClose.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeMobile();
      });
    }
    
    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeMobile();
      });
    }
  
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // close mobile if open
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
              closeMobile();
            }
          }
        }
      });
    });
  
    // Contact form validation (client-side only)
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        let ok = true;
  
        // Reset
        nameError.classList.add('hidden');
        emailError.classList.add('hidden');
  
        if (!name.value.trim()) {
          nameError.classList.remove('hidden');
          ok = false;
          name.focus();
        }
  
        // simple email regex (client-side only)
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(email.value.trim())) {
          emailError.classList.remove('hidden');
          if (ok) email.focus();
          ok = false;
        }
  
        if (!ok) return;
  
        // show success message (no backend)
        const success = document.getElementById('formSuccess');
        success.classList.remove('hidden');
        // clear form fields
        form.reset();
        // announce to screen readers
        success.setAttribute('aria-hidden', 'false');
  
        // small confetti-like micro-interaction could be added here
      });
    }
  
    // Keyboard accessibility: close mobile menu with Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
        closeMobile();
      }
    });
    
    // Close mobile menu when clicking on navigation links
    if (mobileMenu) {
      const mobileNavLinks = mobileMenu.querySelectorAll('a[data-nav]');
      mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
          setTimeout(() => closeMobile(), 100);
        });
      });
    }

    // ========================================
    // DONATION WIDGET
    // Production-ready, accessible floating donation widget
    // ========================================
    const donationBtn = document.getElementById('donationBtn');
    const donationModal = document.getElementById('donationModal');
    const donationCloseBtn = document.getElementById('donationCloseBtn');
    const donationBackdrop = document.getElementById('donationBackdrop');
    const donationForm = document.getElementById('donationForm');
    const donationCustomAmount = document.getElementById('donationCustomAmount');
    const donationPaymentMethod = document.getElementById('donationPaymentMethod');
    const donationAmountError = document.getElementById('donationAmountError');
    const donationPaymentError = document.getElementById('donationPaymentError');
    const donationAmountButtons = document.querySelectorAll('.donation-amount-btn');
    
    // Focus trap: get all focusable elements within modal
    function getFocusableElements(container) {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ].join(', ');
      return Array.from(container.querySelectorAll(focusableSelectors));
    }
    
    // Focus trap implementation
    let focusableElements = [];
    let firstFocusableElement = null;
    let lastFocusableElement = null;
    
    function trapFocus(e) {
      if (!donationModal.classList.contains('show')) return;
      
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab (backwards)
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          // Tab (forwards)
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
    }
    
    // Open donation modal
    function openDonationModal() {
      if (!donationModal) return;
      
      // Show modal
      donationModal.classList.remove('hidden');
      // Trigger animation (add 'show' class after a brief delay for smooth transition)
      setTimeout(() => {
        donationModal.classList.add('show');
      }, 10);
      
      // Update ARIA attributes
      donationBtn.setAttribute('aria-expanded', 'true');
      
      // Get focusable elements and set up focus trap
      focusableElements = getFocusableElements(donationModal);
      if (focusableElements.length > 0) {
        firstFocusableElement = focusableElements[0];
        lastFocusableElement = focusableElements[focusableElements.length - 1];
      }
      
      // Move focus to first focusable element (close button)
      if (donationCloseBtn) {
        donationCloseBtn.focus();
      }
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Add focus trap listener
      donationModal.addEventListener('keydown', trapFocus);
    }
    
    // Close donation modal
    function closeDonationModal() {
      if (!donationModal) return;
      
      // Remove 'show' class first (triggers exit animation)
      donationModal.classList.remove('show');
      
      // Wait for animation, then hide
      setTimeout(() => {
        donationModal.classList.add('hidden');
        
        // Update ARIA attributes
        donationBtn.setAttribute('aria-expanded', 'false');
        
        // Remove focus trap listener
        donationModal.removeEventListener('keydown', trapFocus);
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to donation button
        if (donationBtn) {
          donationBtn.focus();
        }
        
        // Reset form
        if (donationForm) {
          donationForm.reset();
          // Clear selected amount buttons
          donationAmountButtons.forEach(btn => btn.classList.remove('selected'));
          // Hide errors
          if (donationAmountError) donationAmountError.classList.add('hidden');
          if (donationPaymentError) donationPaymentError.classList.add('hidden');
        }
      }, 300); // Match CSS transition duration
    }
    
    // Event listeners for modal controls
    if (donationBtn) {
      donationBtn.addEventListener('click', openDonationModal);
    }
    
    if (donationCloseBtn) {
      donationCloseBtn.addEventListener('click', closeDonationModal);
    }
    
    if (donationBackdrop) {
      donationBackdrop.addEventListener('click', closeDonationModal);
    }
    
    // Keyboard: Escape key closes modal
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && donationModal && donationModal.classList.contains('show')) {
        closeDonationModal();
      }
    });
    
    // Preset amount button selection
    if (donationAmountButtons.length > 0) {
      donationAmountButtons.forEach(button => {
        button.addEventListener('click', function () {
          // Remove selected class from all buttons
          donationAmountButtons.forEach(btn => btn.classList.remove('selected'));
          
          // Add selected class to clicked button
          this.classList.add('selected');
          
          // Set custom amount input to selected amount
          const amount = this.getAttribute('data-amount');
          if (donationCustomAmount) {
            donationCustomAmount.value = amount;
            // Trigger input event to validate
            donationCustomAmount.dispatchEvent(new Event('input'));
          }
          
          // Clear any errors
          if (donationAmountError) donationAmountError.classList.add('hidden');
        });
      });
    }
    
    // Custom amount input validation
    if (donationCustomAmount) {
      // Format currency as user types (optional enhancement)
      donationCustomAmount.addEventListener('input', function () {
        // Clear selected preset buttons when custom amount is entered
        const inputValue = this.value.trim();
        if (inputValue) {
          donationAmountButtons.forEach(btn => {
            const btnAmount = btn.getAttribute('data-amount');
            if (btnAmount === inputValue) {
              btn.classList.add('selected');
            } else {
              btn.classList.remove('selected');
            }
          });
        }
        
        // Hide error when user starts typing
        if (donationAmountError) donationAmountError.classList.add('hidden');
      });
      
      // Validate on blur
      donationCustomAmount.addEventListener('blur', function () {
        validateDonationAmount();
      });
    }
    
    // Amount validation function
    function validateDonationAmount() {
      if (!donationCustomAmount || !donationAmountError) return true;
      
      const value = donationCustomAmount.value.trim();
      const amountRegex = /^\d+(\.\d{1,2})?$/;
      
      // Check if empty
      if (!value) {
        donationAmountError.textContent = 'Please enter an amount.';
        donationAmountError.classList.remove('hidden');
        donationCustomAmount.focus();
        return false;
      }
      
      // Check if valid currency format
      if (!amountRegex.test(value)) {
        donationAmountError.textContent = 'Please enter a valid amount (e.g., 25.00).';
        donationAmountError.classList.remove('hidden');
        donationCustomAmount.focus();
        return false;
      }
      
      // Check if amount is positive and >= 1.00
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 1.0) {
        donationAmountError.textContent = 'Please enter an amount of at least $1.00.';
        donationAmountError.classList.remove('hidden');
        donationCustomAmount.focus();
        return false;
      }
      
      // Valid
      donationAmountError.classList.add('hidden');
      return true;
    }
    
    // Payment method validation
    function validatePaymentMethod() {
      if (!donationPaymentMethod || !donationPaymentError) return true;
      
      const value = donationPaymentMethod.value.trim();
      
      if (!value) {
        donationPaymentError.classList.remove('hidden');
        donationPaymentMethod.focus();
        return false;
      }
      
      donationPaymentError.classList.add('hidden');
      return true;
    }
    
    // Donation form submission
    if (donationForm) {
      donationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Validate form
        const isAmountValid = validateDonationAmount();
        const isPaymentValid = validatePaymentMethod();
        
        if (!isAmountValid || !isPaymentValid) {
          // Focus first invalid field
          if (!isAmountValid && donationCustomAmount) {
            donationCustomAmount.focus();
          } else if (!isPaymentValid && donationPaymentMethod) {
            donationPaymentMethod.focus();
          }
          return;
        }
        
        // Get form data
        const amount = donationCustomAmount.value.trim();
        const paymentMethod = donationPaymentMethod.value;
        
        // ========================================
        // TODO: PAYMENT INTEGRATION HOOK
        // ========================================
        // Here you would integrate with your payment processor:
        // - Stripe: Create payment intent and redirect to checkout
        // - PayPal: Initialize PayPal SDK and process payment
        // - Apple Pay: Initialize Apple Pay session
        // Example:
        // processPayment({
        //   amount: parseFloat(amount),
        //   currency: 'USD',
        //   paymentMethod: paymentMethod,
        //   successUrl: '/donation-success',
        //   cancelUrl: '/donation-cancel'
        // });
        
        // ========================================
        // TODO: ANALYTICS HOOK
        // ========================================
        // Track donation attempt (analytics event)
        // Example:
        // if (window.gtag) {
        //   gtag('event', 'donation_attempt', {
        //     amount: amount,
        //     payment_method: paymentMethod
        //   });
        // }
        
        // For demo purposes: show success message
        console.log('Donation form submitted:', {
          amount: amount,
          paymentMethod: paymentMethod,
          timestamp: new Date().toISOString()
        });
        
        // Show success feedback (replace with actual payment redirect/confirmation)
        alert(`Thank you! Your donation of $${amount} via ${paymentMethod} would be processed here.\n\n[This is a demo - no payment was processed]`);
        
        // Close modal after brief delay
        setTimeout(() => {
          closeDonationModal();
        }, 500);
        
        // ========================================
        // TODO: SUCCESS HANDLING
        // ========================================
        // After successful payment:
        // - Redirect to success page
        // - Show confirmation message
        // - Send confirmation email
        // - Update donor database
      });
    }
  
  }); // DOMContentLoaded
  