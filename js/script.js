/* =========================================================
   [COMPANY NAME] — script.js
   Vanilla JavaScript only. No dependencies.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Mobile navigation (dropdown) ---------- */
  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!toggle || !panel) return;

    function closeMenu() {
      toggle.setAttribute("aria-expanded", "false");
      panel.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    function openMenu() {
      toggle.setAttribute("aria-expanded", "true");
      panel.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) closeMenu(); else openMenu();
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    });

    // Close when clicking outside the dropdown / toggle button.
    document.addEventListener("click", function (e) {
      if (!panel.classList.contains("is-open")) return;
      if (panel.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });

    // Close automatically if the viewport grows past the mobile breakpoint.
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1180 && panel.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

  /* ---------- Active navigation state ---------- */
  function setActiveNav() {
    var current = (window.location.pathname.split("/").pop() || "index.html");
    if (current === "") current = "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === current) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- Header background on scroll ---------- */
  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    function onScroll() {
      btn.classList.toggle("is-visible", window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    onScroll();
  }

  /* ---------- Scroll reveal ---------- */
  function initScrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Counters ---------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;
    function animate(el) {
      var target = parseFloat(el.getAttribute("data-counter"));
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1200;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var value = Math.floor(progress * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    }
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Smooth scroll for in-page anchors ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ---------- Project filtering ---------- */
  function initProjectFilter() {
    var bar = document.querySelector("[data-filter-bar]");
    var cards = document.querySelectorAll("[data-category]");
    if (!bar || !cards.length) return;
    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      bar.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      var filter = btn.getAttribute("data-filter");
      cards.forEach(function (card) {
        var cat = card.getAttribute("data-category");
        var show = filter === "all" || cat === filter;
        card.classList.toggle("is-hidden", !show);
      });
    });
  }

  /* ---------- Equipment search/filter ---------- */
  function initEquipmentSearch() {
    var input = document.querySelector("[data-equip-search]");
    var rows = document.querySelectorAll("[data-equip-row]");
    var emptyState = document.querySelector("[data-equip-empty]");
    if (!input || !rows.length) return;

    function filterRows() {
      var term = input.value.trim().toLowerCase();
      var visibleCount = 0;
      rows.forEach(function (row) {
        var text = row.textContent.toLowerCase();
        var match = text.indexOf(term) !== -1;
        row.classList.toggle("is-hidden", !match);
        if (match) visibleCount++;
      });
      if (emptyState) emptyState.classList.toggle("is-hidden", visibleCount !== 0);
    }
    input.addEventListener("input", filterRows);

    var catBar = document.querySelector("[data-equip-filter-bar]");
    if (catBar) {
      catBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".filter-btn");
        if (!btn) return;
        catBar.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var filter = btn.getAttribute("data-filter");
        var visibleCount = 0;
        rows.forEach(function (row) {
          var cat = row.getAttribute("data-category");
          var show = filter === "all" || cat === filter;
          row.classList.toggle("is-hidden", !show);
          if (show) visibleCount++;
        });
        if (emptyState) emptyState.classList.toggle("is-hidden", visibleCount !== 0);
      });
    }
  }

  /* ---------- Accordion ---------- */
  function initAccordion() {
    document.querySelectorAll(".accordion-trigger").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        var panel = document.getElementById(trigger.getAttribute("aria-controls"));
        trigger.setAttribute("aria-expanded", String(!expanded));
        if (panel) {
          panel.style.maxHeight = !expanded ? panel.scrollHeight + "px" : "0px";
        }
      });
    });
  }

  /* ---------- Contact form validation ---------- */
  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;
    var status = form.querySelector(".form-status");

    var validators = {
      name: function (v) { return v.trim().length >= 2 ? "" : "Enter your full name."; },
      email: function (v) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(v.trim()) ? "" : "Enter a valid email address.";
      },
      phone: function (v) {
        if (!v.trim()) return "";
        var re = /^[0-9+()\-\s]{7,20}$/;
        return re.test(v.trim()) ? "" : "Enter a valid phone number.";
      },
      subject: function (v) { return v.trim().length >= 3 ? "" : "Enter a subject."; },
      message: function (v) { return v.trim().length >= 10 ? "" : "Message should be at least 10 characters."; }
    };

    function showError(field, message) {
      var group = field.closest(".form-group");
      var errorEl = group ? group.querySelector(".field-error") : null;
      if (errorEl) errorEl.textContent = message;
      if (group) group.classList.toggle("has-error", !!message);
      field.setAttribute("aria-invalid", message ? "true" : "false");
    }

    Object.keys(validators).forEach(function (name) {
      var field = form.querySelector('[name="' + name + '"]');
      if (!field) return;
      field.addEventListener("blur", function () {
        showError(field, validators[name](field.value));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      Object.keys(validators).forEach(function (name) {
        var field = form.querySelector('[name="' + name + '"]');
        if (!field) return;
        var message = validators[name](field.value);
        showError(field, message);
        if (message) valid = false;
      });

      if (!valid) {
        if (status) {
          status.textContent = "Please correct the highlighted fields before submitting.";
          status.className = "form-status is-error";
        }
        return;
      }

      var formData = new FormData(form);

fetch("https://api.web3forms.com/submit", {
  method: "POST",
  body: formData
})
  .then(function (response) { return response.json(); })
  .then(function (result) {
    if (result.success) {
      if (status) {
        status.textContent = "Message sent — thank you! We’ll be in touch soon.";
        status.className = "form-status is-success";
      }
      form.reset();
    } else {
      if (status) {
        status.textContent = "Something went wrong. Please try again.";
        status.className = "form-status is-error";
      }
    }
  })
  .catch(function () {
    if (status) {
      status.textContent = "Network error. Please check your connection and try again.";
      status.className = "form-status is-error";
    }
  });
    });
  }

  /* ---------- Hero carousel ---------- */
  function initHeroCarousel() {
    var carousel = document.querySelector("[data-hero-carousel]");
    if (!carousel) return;
    var slides = Array.from(carousel.querySelectorAll(".hero-slide"));
    var captions = Array.from(carousel.querySelectorAll(".hero-caption"));
    var dots = Array.from(carousel.querySelectorAll(".hero-dots .dot"));
    var prevBtn = carousel.querySelector('[data-dir="-1"]');
    var nextBtn = carousel.querySelector('[data-dir="1"]');
    if (!slides.length) return;

    var current = 0;
    var intervalId = null;
    var intervalMs = 6000;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function setActive(list, index) {
      if (list[current]) {
        list[current].classList.remove("is-active");
        if (list[current].hasAttribute("aria-selected")) list[current].setAttribute("aria-selected", "false");
      }
      if (list[index]) {
        list[index].classList.add("is-active");
        if (list[index].hasAttribute("aria-selected")) list[index].setAttribute("aria-selected", "true");
      }
    }

    function goTo(index) {
      var next = (index + slides.length) % slides.length;
      setActive(slides, next);
      setActive(captions, next);
      setActive(dots, next);
      current = next;
    }

    function start() {
      if (reduceMotion) return;
      stop();
      intervalId = setInterval(function () { goTo(current + 1); }, intervalMs);
    }
    function stop() {
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { goTo(i); start(); });
    });
    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); start(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); start(); });

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);

    start();
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    setActiveNav();
    initHeaderScroll();
    initBackToTop();
    initScrollReveal();
    initCounters();
    initSmoothScroll();
    initProjectFilter();
    initEquipmentSearch();
    initAccordion();
    initContactForm();
    initHeroCarousel();
  });
})();
