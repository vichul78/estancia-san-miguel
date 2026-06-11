/* ==========================================
   ESTANCIA SAN MIGUEL — JavaScript
   GSAP + ScrollTrigger — Versión robusta
   Funciona con file://, CDN y servidor local
   ========================================== */

(function () {
  'use strict';

  /* ------------------------------------------
     UTILIDAD: esperar a que GSAP esté listo
  ------------------------------------------ */
  function whenGSAPReady(cb) {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      cb();
    } else {
      // fallback: mostrar todo visible si GSAP no carga
      document.querySelectorAll(
        '.hero-badge, #hero-title, #hero-subtitle, .hero-divider, #hero-cta, .hero-scroll-indicator'
      ).forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    }
  }

  /* ------------------------------------------
     PRE-CARGA IMÁGENES hero para evitar flash
  ------------------------------------------ */
  const heroImages = [
    'images/jardin-noche-elegante.jpg',
    'images/evento-salon.jpg',
    'images/jardin-graduacion.jpg',
    'images/evento-noche.jpg',
    'images/jardin-carpa-blanca.jpg'
  ];

  // Precargar todas las imágenes del hero
  heroImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  /* ------------------------------------------
     HERO SLIDESHOW
  ------------------------------------------ */
  let currentSlide = 0;
  const heroBg = document.getElementById('hero-bg');
  const slideDots = document.querySelectorAll('.slide-dot');

  // Cargar la primera imagen inmediatamente
  if (heroBg) {
    heroBg.style.backgroundImage = `url('${heroImages[0]}')`;
    heroBg.style.opacity = '1';
  }

  function goToSlide(index) {
    if (!heroBg) return;
    currentSlide = index;
    if (typeof gsap !== 'undefined') {
      gsap.to(heroBg, {
        opacity: 0, duration: 0.7, ease: 'power2.inOut',
        onComplete: () => {
          heroBg.style.backgroundImage = `url('${heroImages[index]}')`;
          gsap.to(heroBg, { opacity: 1, duration: 1.2, ease: 'power2.inOut' });
        }
      });
    } else {
      heroBg.style.backgroundImage = `url('${heroImages[index]}')`;
    }
    slideDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  slideDots.forEach(dot => {
    dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.slide)));
  });

  // Auto slideshow cada 7s
  setInterval(() => {
    currentSlide = (currentSlide + 1) % heroImages.length;
    goToSlide(currentSlide);
  }, 7000);

  /* ------------------------------------------
     CUANDO EL DOM ESTÉ LISTO
  ------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {

    /* ---- GSAP REGISTRO ---- */
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Configuración global ScrollTrigger
    ScrollTrigger.config({ limitCallbacks: true });

    /* ==========================================
       HERO — ANIMACIONES DE ENTRADA
    ========================================== */
    // Establecer estado inicial
    gsap.set('.hero-badge', { opacity: 0, y: -20 });
    gsap.set('#hero-title', { opacity: 0, y: 50, scale: 0.95 });
    gsap.set('#hero-subtitle', { opacity: 0, y: 30 });
    gsap.set('.hero-divider', { opacity: 0, scaleX: 0 });
    gsap.set('#hero-cta', { opacity: 0, y: 30 });
    gsap.set('.hero-scroll-indicator', { opacity: 0, y: 10 });

    const heroTL = gsap.timeline({ delay: 0.4 });
    heroTL
      .to('.hero-badge', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .to('#hero-title', { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out' }, '-=0.3')
      .to('#hero-subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .to('.hero-divider', { opacity: 1, scaleX: 1, duration: 0.7, ease: 'power2.out', transformOrigin: 'center' }, '-=0.5')
      .to('#hero-cta', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .to('.hero-scroll-indicator', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2');

    /* ==========================================
       HERO — PARALLAX
    ========================================== */
    gsap.to('#hero-bg', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        invalidateOnRefresh: true
      }
    });

    /* ==========================================
       NAVBAR — SCROLL
    ========================================== */
    const navbar = document.getElementById('navbar');
    ScrollTrigger.create({
      start: 'top -60px',
      onEnter: () => navbar && navbar.classList.add('scrolled'),
      onLeaveBack: () => navbar && navbar.classList.remove('scrolled')
    });

    /* ==========================================
       SMOOTH SCROLL — ANCLAS
    ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, offsetY: 80 },
          ease: 'power3.inOut'
        });
        const navLinks = document.getElementById('nav-links');
        const navBurger = document.getElementById('nav-burger');
        if (navLinks) navLinks.classList.remove('open');
        if (navBurger) navBurger.setAttribute('aria-expanded', 'false');
      });
    });

    /* ==========================================
       MOBILE NAV
    ========================================== */
    const navBurger = document.getElementById('nav-burger');
    const navLinks = document.getElementById('nav-links');

    if (navBurger && navLinks) {
      navBurger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navBurger.setAttribute('aria-expanded', String(isOpen));
        const lines = navBurger.querySelectorAll('.burger-line');
        if (isOpen) {
          gsap.to(lines[0], { rotation: 45, y: 7, duration: 0.3, ease: 'power2.inOut' });
          gsap.to(lines[1], { opacity: 0, x: -12, duration: 0.2 });
          gsap.to(lines[2], { rotation: -45, y: -7, duration: 0.3, ease: 'power2.inOut' });
        } else {
          gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: 'power2.inOut' });
          gsap.to(lines[1], { opacity: 1, x: 0, duration: 0.3 });
          gsap.to(lines[2], { rotation: 0, y: 0, duration: 0.3, ease: 'power2.inOut' });
        }
      });

      document.addEventListener('click', (e) => {
        if (!navBurger.contains(e.target) && !navLinks.contains(e.target)) {
          navLinks.classList.remove('open');
          navBurger.setAttribute('aria-expanded', 'false');
          const lines = navBurger.querySelectorAll('.burger-line');
          gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3 });
          gsap.to(lines[1], { opacity: 1, x: 0, duration: 0.3 });
          gsap.to(lines[2], { rotation: 0, y: 0, duration: 0.3 });
        }
      });
    }

    /* ==========================================
       SECCIÓN NOSOTROS
    ========================================== */
    // Parallax lateral en imagen about
    gsap.to('#about-parallax .about-img', {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: '#nosotros',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
        invalidateOnRefresh: true
      }
    });

    gsap.fromTo('.about-image-wrapper',
      { opacity: 0, x: -70, scale: 0.96 },
      {
        opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '#nosotros', start: 'top 78%', toggleActions: 'play none none none' }
      }
    );

    gsap.fromTo('.about-content > *',
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '#nosotros', start: 'top 72%', toggleActions: 'play none none none' }
      }
    );

    /* ==========================================
       SECCIÓN EVENTOS — STAGGER CARDS
    ========================================== */
    gsap.fromTo('.events .section-header > *',
      { opacity: 0, y: 25 },
      {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '#eventos', start: 'top 78%' }
      }
    );

    gsap.fromTo('.event-card',
      { opacity: 0, y: 70, scale: 0.92 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'back.out(1.4)',
        stagger: { amount: 0.9, from: 'start' },
        scrollTrigger: { trigger: '#events-grid', start: 'top 82%', toggleActions: 'play none none none' }
      }
    );

    /* ==========================================
       SECCIÓN BENEFICIOS — REVEAL SECUENCIAL
    ========================================== */
    gsap.fromTo('.benefit-item',
      { opacity: 0, y: 55, scale: 0.94 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '#benefits-grid', start: 'top 82%', toggleActions: 'play none none none' }
      }
    );

    /* ==========================================
       GALERÍA — EXPANSIÓN AL ENTRAR EN VIEWPORT
    ========================================== */
    gsap.fromTo('.gallery-item',
      { opacity: 0, scale: 0.85, y: 40 },
      {
        opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power3.out',
        stagger: { amount: 1, from: 'start' },
        scrollTrigger: { trigger: '#gallery-grid', start: 'top 82%', toggleActions: 'play none none none' }
      }
    );

    // Zoom parallax en cada imagen de galería al hacer scroll
    document.querySelectorAll('.gallery-img').forEach(img => {
      gsap.fromTo(img,
        { scale: 1 },
        {
          scale: 1.08, ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.gallery-item'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.8,
            invalidateOnRefresh: true
          }
        }
      );
    });

    /* ==========================================
       SECCIÓN EXPERIENCIA — FONDO PARALLAX
    ========================================== */
    gsap.to('#exp-parallax-bg', {
      yPercent: 22,
      ease: 'none',
      scrollTrigger: {
        trigger: '#experiencia',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
        invalidateOnRefresh: true
      }
    });

    gsap.fromTo('#experiencia .section-tag, #experiencia .experience-title, #experiencia .gold-divider',
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '#experiencia', start: 'top 70%' }
      }
    );

    gsap.fromTo('.stat-item',
      { opacity: 0, y: 50, scale: 0.88 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'back.out(1.5)',
        stagger: 0.18,
        scrollTrigger: { trigger: '#stats-grid', start: 'top 82%' }
      }
    );

    /* ==========================================
       COUNTUP — ANIMACIÓN DE NÚMEROS
    ========================================== */
    function animateCount(el, target, duration) {
      const start = performance.now();
      const isFloat = target % 1 !== 0;
      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
    }

    ScrollTrigger.create({
      trigger: '#stats-grid',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        document.querySelectorAll('.count-num').forEach(el => {
          const target = parseInt(el.dataset.target);
          const dur = target <= 10 ? 1200 : target <= 100 ? 1800 : 2400;
          animateCount(el, target, dur);
        });
      }
    });

    /* ==========================================
       TESTIMONIOS — CARRUSEL
    ========================================== */
    const track = document.getElementById('testimonials-track');
    const dotsContainer = document.getElementById('carousel-dots');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (track) {
      const cards = track.querySelectorAll('.testimonial-card');
      let tCurrent = 0;
      let autoplayTimer = null;

      cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Testimonio ${i + 1}`);
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => { goToTestimonial(i); resetAutoplay(); });
        dotsContainer.appendChild(dot);
      });

      function goToTestimonial(index) {
        tCurrent = ((index % cards.length) + cards.length) % cards.length;
        gsap.to(track, { x: `-${tCurrent * 100}%`, duration: 0.65, ease: 'power3.inOut' });
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === tCurrent);
          dot.setAttribute('aria-selected', String(i === tCurrent));
        });
      }

      if (prevBtn) prevBtn.addEventListener('click', () => { goToTestimonial(tCurrent - 1); resetAutoplay(); });
      if (nextBtn) nextBtn.addEventListener('click', () => { goToTestimonial(tCurrent + 1); resetAutoplay(); });

      function startAutoplay() { autoplayTimer = setInterval(() => goToTestimonial(tCurrent + 1), 5500); }
      function resetAutoplay() { clearInterval(autoplayTimer); startAutoplay(); }
      startAutoplay();

      // Swipe táctil
      let touchStartX = 0;
      track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { goToTestimonial(diff > 0 ? tCurrent + 1 : tCurrent - 1); resetAutoplay(); }
      }, { passive: true });
    }

    gsap.fromTo('.testimonials-carousel-wrapper',
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#testimonios', start: 'top 78%' }
      }
    );

    /* ==========================================
       CTA FINAL — PARALLAX CINEMÁTICO
    ========================================== */
    gsap.to('#cta-parallax-bg', {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: '#contacto',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
        invalidateOnRefresh: true
      }
    });

    gsap.fromTo('.cta-content > *',
      { opacity: 0, y: 55 },
      {
        opacity: 1, y: 0, duration: 0.85, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '#contacto', start: 'top 72%' }
      }
    );

    // Efecto de profundidad al entrar en CTA
    ScrollTrigger.create({
      trigger: '#contacto',
      start: 'top bottom',
      end: 'center center',
      scrub: 1,
      onUpdate: self => {
        const b = 0.15 + self.progress * 0.2;
        const s = 0.3 + self.progress * 0.3;
        gsap.set('#cta-parallax-bg', { filter: `brightness(${b}) saturate(${s})` });
      }
    });

    /* ==========================================
       HEADERS DE SECCIÓN — FADE UP GLOBAL
    ========================================== */
    gsap.utils.toArray('.section-header > *').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    /* ==========================================
       FOOTER
    ========================================== */
    gsap.fromTo('.footer-brand, .footer-links-col, .footer-contact',
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer', start: 'top 88%' }
      }
    );

    /* ==========================================
       BOTÓN FLOTANTE WHATSAPP — ENTRADA
    ========================================== */
    gsap.fromTo('#whatsapp-float',
      { opacity: 0, scale: 0, x: 20, y: 20 },
      { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.7, delay: 1.8, ease: 'back.out(1.7)' }
    );

    /* ==========================================
       SCROLL TO TOP
    ========================================== */
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
      ScrollTrigger.create({
        start: 'top -400px',
        onEnter: () => scrollTopBtn.classList.add('visible'),
        onLeaveBack: () => scrollTopBtn.classList.remove('visible')
      });
      scrollTopBtn.addEventListener('click', () => {
        gsap.to(window, { duration: 1.3, scrollTo: { y: 0 }, ease: 'power4.inOut' });
      });
    }

    /* ==========================================
       LIGHTBOX
    ========================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    document.querySelectorAll('.gallery-zoom-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        lightboxImg.src = btn.dataset.src;
        lightboxImg.alt = btn.dataset.alt || '';
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

    /* ==========================================
       CURSOR PERSONALIZADO (solo desktop)
    ========================================== */
    if (window.matchMedia('(pointer: fine)').matches && window.innerWidth > 1024) {
      const cursor = document.createElement('div');
      cursor.id = 'custom-cursor';
      Object.assign(cursor.style, {
        position: 'fixed', width: '10px', height: '10px',
        background: '#C8A86B', borderRadius: '50%',
        pointerEvents: 'none', zIndex: '99999',
        transform: 'translate(-50%,-50%)',
        transition: 'width .2s, height .2s',
        mixBlendMode: 'difference'
      });

      const cursorRing = document.createElement('div');
      cursorRing.id = 'cursor-ring';
      Object.assign(cursorRing.style, {
        position: 'fixed', width: '38px', height: '38px',
        border: '1.5px solid rgba(200,168,107,0.55)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: '99998',
        transform: 'translate(-50%,-50%)'
      });

      document.body.appendChild(cursor);
      document.body.appendChild(cursorRing);

      document.addEventListener('mousemove', e => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.08, overwrite: true });
        gsap.to(cursorRing, { x: e.clientX, y: e.clientY, duration: 0.38, overwrite: true });
      });

      document.querySelectorAll('a, button, [tabindex="0"]').forEach(el => {
        el.addEventListener('mouseenter', () => {
          gsap.to(cursor, { scale: 2.8, duration: 0.25 });
          gsap.to(cursorRing, { scale: 1.5, borderColor: 'rgba(200,168,107,0.9)', duration: 0.25 });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(cursor, { scale: 1, duration: 0.25 });
          gsap.to(cursorRing, { scale: 1, borderColor: 'rgba(200,168,107,0.55)', duration: 0.25 });
        });
      });
    }

    /* ==========================================
       REFRESH EN RESIZE
    ========================================== */
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });

    // Refresh inicial después de que todo cargue
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });

  }); // DOMContentLoaded

})();
