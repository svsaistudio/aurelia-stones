/* =========================================================
   AURELIA STONES — MAIN JAVASCRIPT
   PART 1
   LOADER, HEADER, MOBILE MENU, DROPDOWNS AND HERO SLIDER
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const body = document.body;

  /* =======================================================
     HELPER FUNCTIONS
     ======================================================= */

  const select = (selector, parent = document) =>
    parent.querySelector(selector);

  const selectAll = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  const addClass = (element, className) => {
    if (element) {
      element.classList.add(className);
    }
  };

  const removeClass = (element, className) => {
    if (element) {
      element.classList.remove(className);
    }
  };

  const toggleClass = (element, className) => {
    if (element) {
      element.classList.toggle(className);
    }
  };


  /* =======================================================
     CURRENT YEAR
     ======================================================= */

  const currentYearElements = selectAll(".current-year");

  currentYearElements.forEach((element) => {
    element.textContent = new Date().getFullYear();
  });


  /* =======================================================
     PAGE LOADER
     ======================================================= */

  const pageLoader = select(".page-loader");

  function hidePageLoader() {
    if (!pageLoader) return;

    pageLoader.classList.add("hidden");

    window.setTimeout(() => {
      pageLoader.style.display = "none";
    }, 700);
  }

  window.addEventListener("load", hidePageLoader);

  window.setTimeout(() => {
    hidePageLoader();
  }, 3500);


  /* =======================================================
     STICKY HEADER
     ======================================================= */

  const mainHeader = select(".main-header");

  function updateHeaderOnScroll() {
    if (!mainHeader) return;

    if (window.scrollY > 60) {
      mainHeader.classList.add("scrolled");
    } else {
      mainHeader.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateHeaderOnScroll, {
    passive: true
  });

  updateHeaderOnScroll();


  /* =======================================================
     MOBILE MENU
     ======================================================= */

  const mobileMenuButton = select(".mobile-menu-button");
  const mobileNavigation = select(".mobile-navigation");
  const mobileNavigationLinks = selectAll(
    ".mobile-navigation a"
  );

  function openMobileMenu() {
    if (!mobileMenuButton || !mobileNavigation) return;

    mobileMenuButton.classList.add("active");
    mobileNavigation.classList.add("open");
    mobileMenuButton.setAttribute("aria-expanded", "true");

    body.classList.add("menu-open");
  }

  function closeMobileMenu() {
    if (!mobileMenuButton || !mobileNavigation) return;

    mobileMenuButton.classList.remove("active");
    mobileNavigation.classList.remove("open");
    mobileMenuButton.setAttribute("aria-expanded", "false");

    body.classList.remove("menu-open");
  }

  function toggleMobileMenu() {
    if (!mobileMenuButton || !mobileNavigation) return;

    const menuIsOpen =
      mobileNavigation.classList.contains("open");

    if (menuIsOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (mobileMenuButton) {
    mobileMenuButton.setAttribute("aria-expanded", "false");

    mobileMenuButton.addEventListener(
      "click",
      toggleMobileMenu
    );
  }

  mobileNavigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const linkParent = link.closest(".mobile-dropdown");

      if (!linkParent) {
        closeMobileMenu();
      }
    });
  });


  /* =======================================================
     MOBILE DROPDOWNS
     ======================================================= */

  const mobileDropdownButtons = selectAll(
    ".mobile-dropdown-button"
  );

  mobileDropdownButtons.forEach((button) => {
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
      const submenu = button.nextElementSibling;

      if (
        !submenu ||
        !submenu.classList.contains("mobile-submenu")
      ) {
        return;
      }

      const submenuIsOpen =
        submenu.classList.contains("open");

      mobileDropdownButtons.forEach((otherButton) => {
        const otherSubmenu =
          otherButton.nextElementSibling;

        if (
          otherButton !== button &&
          otherSubmenu &&
          otherSubmenu.classList.contains("mobile-submenu")
        ) {
          otherButton.classList.remove("active");
          otherButton.setAttribute(
            "aria-expanded",
            "false"
          );

          otherSubmenu.classList.remove("open");
        }
      });

      button.classList.toggle("active");
      submenu.classList.toggle("open");

      button.setAttribute(
        "aria-expanded",
        submenuIsOpen ? "false" : "true"
      );
    });
  });


  /* =======================================================
     CLOSE MOBILE MENU ON WINDOW RESIZE
     ======================================================= */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1180) {
      closeMobileMenu();

      mobileDropdownButtons.forEach((button) => {
        const submenu = button.nextElementSibling;

        button.classList.remove("active");
        button.setAttribute("aria-expanded", "false");

        if (
          submenu &&
          submenu.classList.contains("mobile-submenu")
        ) {
          submenu.classList.remove("open");
        }
      });
    }
  });


  /* =======================================================
     CLOSE MOBILE MENU WITH ESCAPE KEY
     ======================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });


  /* =======================================================
     SMOOTH SCROLL
     ======================================================= */

  const internalLinks = selectAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetSection = select(targetId);

      if (!targetSection) return;

      event.preventDefault();

      const headerHeight = mainHeader
        ? mainHeader.offsetHeight
        : 0;

      const targetPosition =
        targetSection.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

      closeMobileMenu();
    });
  });


  /* =======================================================
     ACTIVE NAVIGATION LINK
     ======================================================= */

  const pageSections = selectAll("main section[id]");
  const desktopNavigationLinks = selectAll(
    ".nav-menu a[href^='#']"
  );

  function updateActiveNavigationLink() {
    if (!pageSections.length) return;

    const scrollPosition = window.scrollY + 180;
    let currentSectionId = "";

    pageSections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSectionId = section.getAttribute("id");
      }
    });

    desktopNavigationLinks.forEach((link) => {
      const linkTarget = link.getAttribute("href");

      link.classList.toggle(
        "active",
        linkTarget === `#${currentSectionId}`
      );
    });

    mobileNavigationLinks.forEach((link) => {
      const linkTarget = link.getAttribute("href");

      link.classList.toggle(
        "active",
        linkTarget === `#${currentSectionId}`
      );
    });
  }

  window.addEventListener(
    "scroll",
    updateActiveNavigationLink,
    {
      passive: true
    }
  );

  updateActiveNavigationLink();


  /* =======================================================
     HERO SLIDER
     ======================================================= */

  const heroSlides = selectAll(".hero-slide");
  const heroDots = selectAll(".hero-dot");
  const heroPreviousButton = select(
    ".hero-arrow.previous"
  );
  const heroNextButton = select(".hero-arrow.next");

  let activeHeroSlide = 0;
  let heroSliderInterval = null;

  const heroSlideDuration = 5500;

  function showHeroSlide(index) {
    if (!heroSlides.length) return;

    if (index >= heroSlides.length) {
      activeHeroSlide = 0;
    } else if (index < 0) {
      activeHeroSlide = heroSlides.length - 1;
    } else {
      activeHeroSlide = index;
    }

    heroSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle(
        "active",
        slideIndex === activeHeroSlide
      );

      slide.setAttribute(
        "aria-hidden",
        slideIndex === activeHeroSlide
          ? "false"
          : "true"
      );
    });

    heroDots.forEach((dot, dotIndex) => {
      dot.classList.toggle(
        "active",
        dotIndex === activeHeroSlide
      );

      dot.setAttribute(
        "aria-current",
        dotIndex === activeHeroSlide
          ? "true"
          : "false"
      );
    });
  }

  function showNextHeroSlide() {
    showHeroSlide(activeHeroSlide + 1);
  }

  function showPreviousHeroSlide() {
    showHeroSlide(activeHeroSlide - 1);
  }

  function startHeroSlider() {
    if (heroSlides.length <= 1) return;

    stopHeroSlider();

    heroSliderInterval = window.setInterval(
      showNextHeroSlide,
      heroSlideDuration
    );
  }

  function stopHeroSlider() {
    if (heroSliderInterval) {
      window.clearInterval(heroSliderInterval);
      heroSliderInterval = null;
    }
  }

  function restartHeroSlider() {
    stopHeroSlider();
    startHeroSlider();
  }

  if (heroPreviousButton) {
    heroPreviousButton.addEventListener("click", () => {
      showPreviousHeroSlide();
      restartHeroSlider();
    });
  }

  if (heroNextButton) {
    heroNextButton.addEventListener("click", () => {
      showNextHeroSlide();
      restartHeroSlider();
    });
  }

  heroDots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      showHeroSlide(dotIndex);
      restartHeroSlider();
    });
  });


  /* =======================================================
     PAUSE HERO SLIDER ON HOVER
     ======================================================= */

  const heroSection = select(".hero-section");

  if (heroSection) {
    heroSection.addEventListener(
      "mouseenter",
      stopHeroSlider
    );

    heroSection.addEventListener(
      "mouseleave",
      startHeroSlider
    );
  }


  /* =======================================================
     HERO SWIPE SUPPORT
     ======================================================= */

  let heroTouchStartX = 0;
  let heroTouchEndX = 0;

  function handleHeroSwipe() {
    const swipeDistance =
      heroTouchEndX - heroTouchStartX;

    if (Math.abs(swipeDistance) < 50) return;

    if (swipeDistance < 0) {
      showNextHeroSlide();
    } else {
      showPreviousHeroSlide();
    }

    restartHeroSlider();
  }

  if (heroSection) {
    heroSection.addEventListener(
      "touchstart",
      (event) => {
        heroTouchStartX =
          event.changedTouches[0].screenX;
      },
      {
        passive: true
      }
    );

    heroSection.addEventListener(
      "touchend",
      (event) => {
        heroTouchEndX =
          event.changedTouches[0].screenX;

        handleHeroSwipe();
      },
      {
        passive: true
      }
    );
  }


  /* =======================================================
     HERO KEYBOARD CONTROLS
     ======================================================= */

  document.addEventListener("keydown", (event) => {
    if (!heroSlides.length) return;

    if (event.key === "ArrowRight") {
      showNextHeroSlide();
      restartHeroSlider();
    }

    if (event.key === "ArrowLeft") {
      showPreviousHeroSlide();
      restartHeroSlider();
    }
  });


  /* =======================================================
     INITIALIZE HERO SLIDER
     ======================================================= */

  if (heroSlides.length) {
    showHeroSlide(0);
    startHeroSlider();
}
    /* =======================================================
     COUNTER ANIMATION
     ======================================================= */

  const counterElements = selectAll("[data-count]");

  function animateCounter(element) {
    const targetValue = Number(element.dataset.count);

    if (!Number.isFinite(targetValue)) return;

    const duration = 1700;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(
        targetValue * easedProgress
      );

      element.textContent = currentValue;

      if (progress < 1) {
        window.requestAnimationFrame(updateCounter);
      } else {
        element.textContent = targetValue;
      }
    }

    window.requestAnimationFrame(updateCounter);
  }

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const counter = entry.target;

          if (counter.dataset.animated === "true") {
            return;
          }

          counter.dataset.animated = "true";
          animateCounter(counter);
          observer.unobserve(counter);
        });
      },
      {
        threshold: 0.45
      }
    );

    counterElements.forEach((counter) => {
      counterObserver.observe(counter);
    });
  } else {
    counterElements.forEach((counter) => {
      animateCounter(counter);
    });
  }


  /* =======================================================
     SCROLL REVEAL ANIMATIONS
     ======================================================= */

  const revealElements = selectAll(
    ".reveal-up, .reveal-left, .reveal-right"
  );

  function revealAllElements() {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.13,
        rootMargin: "0px 0px -45px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealAllElements();
  }


  /* =======================================================
     TESTIMONIAL SLIDER
     ======================================================= */

  const testimonialCards = selectAll(".testimonial-card");
  const testimonialDots = selectAll(".testimonial-dot");

  const testimonialPreviousButton = select(
    ".testimonial-arrow.previous"
  );

  const testimonialNextButton = select(
    ".testimonial-arrow.next"
  );

  const testimonialSection = select(
    ".testimonials-section"
  );

  let activeTestimonial = 0;
  let testimonialInterval = null;

  const testimonialDuration = 6000;

  function showTestimonial(index) {
    if (!testimonialCards.length) return;

    if (index >= testimonialCards.length) {
      activeTestimonial = 0;
    } else if (index < 0) {
      activeTestimonial =
        testimonialCards.length - 1;
    } else {
      activeTestimonial = index;
    }

    testimonialCards.forEach(
      (card, cardIndex) => {
        const isActive =
          cardIndex === activeTestimonial;

        card.classList.toggle(
          "active",
          isActive
        );

        card.setAttribute(
          "aria-hidden",
          isActive ? "false" : "true"
        );
      }
    );

    testimonialDots.forEach((dot, dotIndex) => {
      const isActive =
        dotIndex === activeTestimonial;

      dot.classList.toggle(
        "active",
        isActive
      );

      dot.setAttribute(
        "aria-current",
        isActive ? "true" : "false"
      );
    });
  }

  function showNextTestimonial() {
    showTestimonial(activeTestimonial + 1);
  }

  function showPreviousTestimonial() {
    showTestimonial(activeTestimonial - 1);
  }

  function startTestimonialSlider() {
    if (testimonialCards.length <= 1) return;

    stopTestimonialSlider();

    testimonialInterval = window.setInterval(
      showNextTestimonial,
      testimonialDuration
    );
  }

  function stopTestimonialSlider() {
    if (!testimonialInterval) return;

    window.clearInterval(testimonialInterval);
    testimonialInterval = null;
  }

  function restartTestimonialSlider() {
    stopTestimonialSlider();
    startTestimonialSlider();
  }

  if (testimonialPreviousButton) {
    testimonialPreviousButton.addEventListener(
      "click",
      () => {
        showPreviousTestimonial();
        restartTestimonialSlider();
      }
    );
  }

  if (testimonialNextButton) {
    testimonialNextButton.addEventListener(
      "click",
      () => {
        showNextTestimonial();
        restartTestimonialSlider();
      }
    );
  }

  testimonialDots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      showTestimonial(dotIndex);
      restartTestimonialSlider();
    });
  });

  if (testimonialSection) {
    testimonialSection.addEventListener(
      "mouseenter",
      stopTestimonialSlider
    );

    testimonialSection.addEventListener(
      "mouseleave",
      startTestimonialSlider
    );
  }


  /* =======================================================
     TESTIMONIAL SWIPE SUPPORT
     ======================================================= */

  let testimonialTouchStartX = 0;
  let testimonialTouchEndX = 0;

  function handleTestimonialSwipe() {
    const swipeDistance =
      testimonialTouchEndX -
      testimonialTouchStartX;

    if (Math.abs(swipeDistance) < 50) return;

    if (swipeDistance < 0) {
      showNextTestimonial();
    } else {
      showPreviousTestimonial();
    }

    restartTestimonialSlider();
  }

  if (testimonialSection) {
    testimonialSection.addEventListener(
      "touchstart",
      (event) => {
        testimonialTouchStartX =
          event.changedTouches[0].screenX;
      },
      {
        passive: true
      }
    );

    testimonialSection.addEventListener(
      "touchend",
      (event) => {
        testimonialTouchEndX =
          event.changedTouches[0].screenX;

        handleTestimonialSwipe();
      },
      {
        passive: true
      }
    );
  }


  /* =======================================================
     INITIALIZE TESTIMONIAL SLIDER
     ======================================================= */

  if (testimonialCards.length) {
    showTestimonial(0);
    startTestimonialSlider();
  }


  /* =======================================================
     FAQ ACCORDION
     ======================================================= */

  const faqItems = selectAll(".faq-item");

  function closeFaqItem(item) {
    const question = select(".faq-question", item);
    const answer = select(".faq-answer", item);

    item.classList.remove("active");

    if (question) {
      question.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    if (answer) {
      answer.setAttribute(
        "aria-hidden",
        "true"
      );
    }
  }

  function openFaqItem(item) {
    const question = select(".faq-question", item);
    const answer = select(".faq-answer", item);

    item.classList.add("active");

    if (question) {
      question.setAttribute(
        "aria-expanded",
        "true"
      );
    }

    if (answer) {
      answer.setAttribute(
        "aria-hidden",
        "false"
      );
    }
  }

  faqItems.forEach((item, itemIndex) => {
    const question = select(".faq-question", item);
    const answer = select(".faq-answer", item);

    if (!question || !answer) return;

    const answerId =
      answer.id || `faq-answer-${itemIndex + 1}`;

    answer.id = answerId;

    question.setAttribute(
      "aria-controls",
      answerId
    );

    question.setAttribute(
      "aria-expanded",
      item.classList.contains("active")
        ? "true"
        : "false"
    );

    answer.setAttribute(
      "aria-hidden",
      item.classList.contains("active")
        ? "false"
        : "true"
    );

    question.addEventListener("click", () => {
      const itemIsOpen =
        item.classList.contains("active");

      faqItems.forEach((otherItem) => {
        closeFaqItem(otherItem);
      });

      if (!itemIsOpen) {
        openFaqItem(item);
      }
    });
  });


  /* =======================================================
     OPEN FIRST FAQ BY DEFAULT
     ======================================================= */

  if (
    faqItems.length &&
    !faqItems.some((item) =>
      item.classList.contains("active")
    )
  ) {
    openFaqItem(faqItems[0]);
      }
    /* =======================================================
     VIDEO MODAL
     ======================================================= */

  const videoModal = select(".video-modal");
  const videoModalOpenButtons = selectAll(
    ".play-button, [data-video-open]"
  );
  const videoModalCloseButton = select(
    ".video-modal-close"
  );
  const videoModalOverlay = select(
    ".video-modal-overlay"
  );

  function openVideoModal() {
    if (!videoModal) return;

    videoModal.classList.add("open");
    videoModal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");

    if (videoModalCloseButton) {
      window.setTimeout(() => {
        videoModalCloseButton.focus();
      }, 100);
    }
  }

  function closeVideoModal() {
    if (!videoModal) return;

    videoModal.classList.remove("open");
    videoModal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
  }

  videoModalOpenButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openVideoModal();
    });
  });

  if (videoModalCloseButton) {
    videoModalCloseButton.addEventListener(
      "click",
      closeVideoModal
    );
  }

  if (videoModalOverlay) {
    videoModalOverlay.addEventListener(
      "click",
      closeVideoModal
    );
  }

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      videoModal &&
      videoModal.classList.contains("open")
    ) {
      closeVideoModal();
    }
  });


  /* =======================================================
     BACK TO TOP BUTTON
     ======================================================= */

  const backToTopButton = select(".back-to-top");

  function updateBackToTopButton() {
    if (!backToTopButton) return;

    if (window.scrollY > 550) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  }

  if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  window.addEventListener(
    "scroll",
    updateBackToTopButton,
    {
      passive: true
    }
  );

  updateBackToTopButton();


  /* =======================================================
     NEWSLETTER FORM
     ======================================================= */

  const newsletterForm = select(".newsletter-form");

  if (newsletterForm) {
    newsletterForm.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        const emailInput = select(
          'input[type="email"]',
          newsletterForm
        );

        const submitButton = select(
          'button[type="submit"]',
          newsletterForm
        );

        if (!emailInput) return;

        const emailValue = emailInput.value.trim();

        if (!emailValue) {
          emailInput.focus();
          return;
        }

        const emailPattern =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(emailValue)) {
          emailInput.focus();
          emailInput.classList.add("input-error");

          window.setTimeout(() => {
            emailInput.classList.remove("input-error");
          }, 1800);

          return;
        }

        const originalButtonContent =
          submitButton
            ? submitButton.innerHTML
            : "";

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.innerHTML =
            '<i class="fa-solid fa-check"></i> Subscribed';
        }

        emailInput.value = "";

        window.setTimeout(() => {
          if (!submitButton) return;

          submitButton.disabled = false;
          submitButton.innerHTML =
            originalButtonContent;
        }, 3000);
      }
    );
  }


  /* =======================================================
     IMAGE FALLBACK
     ======================================================= */

  const websiteImages = selectAll("img");

  websiteImages.forEach((image) => {
    image.addEventListener("error", () => {
      if (image.dataset.fallbackApplied === "true") {
        return;
      }

      image.dataset.fallbackApplied = "true";

      image.style.background =
        "linear-gradient(135deg, #ded8cd, #b9ad99)";

      image.style.objectFit = "cover";
      image.alt =
        image.alt || "Aurelia Stones placeholder image";
    });
  });


  /* =======================================================
     BUTTON RIPPLE EFFECT
     ======================================================= */

  const rippleButtons = selectAll(
    ".button, .hero-arrow, .testimonial-arrow"
  );

  rippleButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const existingRipple = select(
        ".button-ripple",
        button
      );

      if (existingRipple) {
        existingRipple.remove();
      }

      const buttonRectangle =
        button.getBoundingClientRect();

      const rippleSize = Math.max(
        buttonRectangle.width,
        buttonRectangle.height
      );

      const ripple = document.createElement("span");

      ripple.className = "button-ripple";

      ripple.style.width = `${rippleSize}px`;
      ripple.style.height = `${rippleSize}px`;

      ripple.style.left = `${
        event.clientX -
        buttonRectangle.left -
        rippleSize / 2
      }px`;

      ripple.style.top = `${
        event.clientY -
        buttonRectangle.top -
        rippleSize / 2
      }px`;

      button.appendChild(ripple);

      window.setTimeout(() => {
        ripple.remove();
      }, 650);
    });
  });


  /* =======================================================
     PREVENT EMPTY LINKS
     ======================================================= */

  const emptyLinks = selectAll(
    'a[href="#"], a[href=""]'
  );

  emptyLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });


  /* =======================================================
     PAUSE SLIDERS WHEN TAB IS HIDDEN
     ======================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        stopHeroSlider();
        stopTestimonialSlider();
      } else {
        startHeroSlider();
        startTestimonialSlider();
      }
    }
  );


  /* =======================================================
     FINAL INITIALIZATION
     ======================================================= */

  body.classList.add("javascript-loaded");

  updateHeaderOnScroll();
  updateBackToTopButton();
  updateActiveNavigationLink();
});
