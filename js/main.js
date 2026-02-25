/* ================================================================
   Hilltech – main.js
   ================================================================ */

(function () {
  'use strict';

  /* ── Nav: scroll behaviour ──────────────────────────────────── */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── Nav: mobile toggle ─────────────────────────────────────── */
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ── Smooth scroll for anchor links ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = header.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Scroll-reveal ───────────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.service-card, .project-card, .stat, .value, .about__content, .contact-form, .contact__info'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

  /* ── Animated counters ───────────────────────────────────────── */
  const counters = document.querySelectorAll('.stat__number[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const step   = 16;
      const steps  = Math.round(duration / step);
      let current  = 0;
      let frame    = 0;

      const timer = setInterval(() => {
        frame++;
        // Ease-out cubic
        const progress = 1 - Math.pow(1 - frame / steps, 3);
        current = Math.round(progress * target);
        el.textContent = current.toLocaleString();
        if (frame >= steps) {
          el.textContent = target.toLocaleString();
          clearInterval(timer);
        }
      }, step);

      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* ── Contact form ────────────────────────────────────────────── */
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const fields = ['name', 'email', 'message'];
    let valid = true;

    fields.forEach(name => {
      const el = form.querySelector(`[name="${name}"]`);
      if (!el) return;
      if (!el.value.trim()) {
        el.style.borderColor = '#f87171';
        valid = false;
      } else {
        el.style.borderColor = '';
      }
    });

    if (!valid) return;

    // Simulate submission
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      success.hidden = false;
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Send Message';
      setTimeout(() => { success.hidden = true; }, 5000);
    }, 900);
  });

  // Clear error styling on input
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });

})();
