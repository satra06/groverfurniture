/**
 * Grover Furnishers & Decorators - Interactive Website Logic
 * Includes: Loader, Sticky Nav, Scroll Reveal, Testimonial Carousel, Lightbox, Form Validator
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initStickyHeader();
  initMobileNav();
  initActiveNavLink();
  initScrollReveal();
  initScrollToTop();
  initTestimonialCarousel();
  initLightbox();
  initContactForm();
  initFAQAccordion();
  initWhatsAppHelpers();
  initProductFilter();
});

/* ==========================================================================
   1. Page Loader Fade Out
   ========================================================================== */
function initLoader() {
  const loader = document.querySelector('.loader-overlay');
  if (loader) {
    window.addEventListener('load', () => {
      // Small buffer for smoother entry
      setTimeout(() => {
        loader.classList.add('fade-out');
      }, 500);
    });

    // Fallback if load event doesn't fire
    setTimeout(() => {
      if (!loader.classList.contains('fade-out')) {
        loader.classList.add('fade-out');
      }
    }, 2500);
  }
}

/* ==========================================================================
   2. Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('header');
  if (header) {
    const checkScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check on load
  }
}

/* ==========================================================================
   3. Mobile Drawer Navigation
   ========================================================================== */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    // Create navigation overlay dynamically if not already in HTML
    let navOverlay = document.querySelector('.nav-overlay');
    if (!navOverlay) {
      navOverlay = document.createElement('div');
      navOverlay.className = 'nav-overlay';
      document.body.appendChild(navOverlay);
    }

    const toggleMenu = () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      navOverlay.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);

    // Close menu when links are clicked
    const navLinks = navMenu.querySelectorAll('a:not(.nav-cta)');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          toggleMenu();
        }
      });
    });
  }
}

/* ==========================================================================
   4. Highlight Active Navigation Link
   ========================================================================== */
function initActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;
  const currentFilename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFilename || (currentFilename === 'index.html' && href === './') || (href === 'index.html' && currentFilename === '')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   5. Scroll Reveal Animations (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if ('IntersectionObserver' in window && reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    reveals.forEach(el => el.classList.add('active'));
  }
}

/* ==========================================================================
   6. Scroll to Top Button
   ========================================================================== */
function initScrollToTop() {
  // Create button dynamically if not present
  let scrollTopBtn = document.querySelector('.scroll-top');
  if (!scrollTopBtn) {
    scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   7. Testimonial Slider Carousel
   ========================================================================== */
function initTestimonialCarousel() {
  const slider = document.querySelector('.testimonials-slider');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.testimonial-dots');
  
  if (slider && slides.length > 0 && dotsContainer) {
    let currentIndex = 0;
    let autoPlayTimer;

    // Create Navigation Dots dynamically based on slides
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('data-index', index);
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.testimonial-dot');

    const goToSlide = (index) => {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      
      currentIndex = index;
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      dots.forEach(dot => dot.classList.remove('active'));
      dots[currentIndex].classList.add('active');
    };

    const nextSlide = () => {
      goToSlide(currentIndex + 1);
    };

    const startAutoPlay = () => {
      autoPlayTimer = setInterval(nextSlide, 5000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    };

    // Swipe support for touch screens
    let startX = 0;
    let endX = 0;
    
    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', () => {
      const diffX = startX - endX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          goToSlide(currentIndex + 1); // Swipe left -> next
        } else {
          goToSlide(currentIndex - 1); // Swipe right -> prev
        }
        resetAutoPlay();
      }
    });

    startAutoPlay();
  }
}

/* ==========================================================================
   8. Custom Lightbox Gallery
   ========================================================================== */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (galleryItems.length > 0) {
    // Create Lightbox DOM structure if not exists
    let lightbox = document.querySelector('.lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close Lightbox">&times;</button>
        <button class="lightbox-nav lightbox-prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
        <button class="lightbox-nav lightbox-next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
        <div class="lightbox-content-wrapper">
          <img src="" alt="" class="lightbox-img">
          <div class="lightbox-caption"></div>
          <div class="lightbox-category"></div>
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxCategory = lightbox.querySelector('.lightbox-category');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let currentGalleryIndex = 0;

    // Collect all image links and captions in active page
    const getGalleryData = () => {
      return Array.from(galleryItems).map(item => ({
        src: item.getAttribute('data-src') || item.querySelector('img').src,
        title: item.querySelector('h3')?.textContent || item.getAttribute('data-title') || 'Furniture Showcase',
        category: item.querySelector('p')?.textContent || item.getAttribute('data-category') || 'Grover Furnishers'
      }));
    };

    const galleryData = getGalleryData();

    const openLightbox = (index) => {
      currentGalleryIndex = index;
      const data = galleryData[currentGalleryIndex];
      
      lightboxImg.src = data.src;
      lightboxImg.alt = data.title;
      lightboxCaption.textContent = data.title;
      lightboxCategory.textContent = data.category;
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = ''; // Clear source to stop downloads
    };

    const nextImage = (e) => {
      if (e) e.stopPropagation();
      let nextIndex = currentGalleryIndex + 1;
      if (nextIndex >= galleryData.length) nextIndex = 0;
      openLightbox(nextIndex);
    };

    const prevImage = (e) => {
      if (e) e.stopPropagation();
      let prevIndex = currentGalleryIndex - 1;
      if (prevIndex < 0) prevIndex = galleryData.length - 1;
      openLightbox(prevIndex);
    };

    // Attach click triggers to all items
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        openLightbox(index);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
        closeLightbox();
      }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      }
    });
  }
}

/* ==========================================================================
   9. Premium Contact Form Validator
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    const formMessage = form.querySelector('.form-message') || document.createElement('div');
    if (!form.querySelector('.form-message')) {
      formMessage.className = 'form-message';
      form.appendChild(formMessage);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      // Basic validation
      if (!name || !email || !phone || !message) {
        showFormFeedback('Please fill out all required fields.', 'error');
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormFeedback('Please enter a valid email address.', 'error');
        return;
      }

      // Phone format validation (simple check for digits/spaces)
      const phoneRegex = /^[0-9+\s\-()]{8,15}$/;
      if (!phoneRegex.test(phone)) {
        showFormFeedback('Please enter a valid phone number.', 'error');
        return;
      }

      // Submit button state change
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Inquiry...';

      // Check if Web3Forms or similar is configuration target
      const action = form.getAttribute('action');
      
      if (action && action.startsWith('http')) {
        // Submit form via fetch to client-side collector (Web3Forms/Formspree)
        fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          if (response.ok) {
            showFormFeedback('Thank you for contacting us! We have received your inquiry and will call you shortly.', 'success');
            form.reset();
          } else {
            showFormFeedback('Oops! Something went wrong. Please call us directly at +91 92898 73435.', 'error');
          }
        })
        .catch(() => {
          showFormFeedback('Network error. Please check your internet connection or call us directly.', 'error');
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        });
      } else {
        // Mock success if action not set
        setTimeout(() => {
          showFormFeedback('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
          form.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }, 1500);
      }
    });

    function showFormFeedback(msg, type) {
      formMessage.textContent = msg;
      formMessage.className = `form-message ${type}`;
      formMessage.style.display = 'block';
      
      // Auto-scroll to message
      formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Hide error feedback after 6 seconds
      if (type === 'error') {
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 6000);
      }
    }
  }
}

/* ==========================================================================
   10. FAQ Accordion
   ========================================================================== */
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const faqAnswer = question.nextElementSibling;
      const isActive = faqItem.classList.contains('active');
      
      // Close other active answers
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          item.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle current answer
      if (isActive) {
        faqItem.classList.remove('active');
        faqAnswer.style.maxHeight = null;
      } else {
        faqItem.classList.add('active');
        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   11. Dynamic WhatsApp Helpers
   ========================================================================== */
function initWhatsAppHelpers() {
  const waFloatingBtn = document.querySelector('.floating-whatsapp');
  if (waFloatingBtn) {
    const pageTitle = document.title.split('|')[0].trim();
    // Dynamically set default WhatsApp message depending on which page they are browsing
    const baseMsg = encodeURIComponent(`Hi Grover Furnishers, I am browsing your ${pageTitle} page and would like to make an inquiry.`);
    const currentHref = waFloatingBtn.getAttribute('href');
    if (currentHref && currentHref.includes('text=')) {
      // Keep existing custom message if set
    } else {
      waFloatingBtn.setAttribute('href', `https://api.whatsapp.com/send?phone=919289873435&text=${baseMsg}`);
    }
  }
}

/* ==========================================================================
   12. Product Catalog Filter
   ========================================================================== */
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (filterBtns.length > 0 && productCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active Class on buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        productCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'flex';
            // Trigger animation fade in
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transition = 'opacity 0.4s ease';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
}
