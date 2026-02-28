(() => {
  const doc = document;
  const body = doc.body;
  const header = doc.querySelector('.site-header');
  const navLinks = doc.querySelector('.nav-links');
  const mobileToggle = doc.querySelector('.mobile-toggle');
  const progressBar = doc.querySelector('.scroll-progress');
  const backTop = doc.querySelector('.back-top');
  const cursorDot = doc.querySelector('.cursor-dot');
  const cursorGlow = doc.querySelector('.cursor-glow');

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  doc.querySelectorAll('.split-words').forEach((el) => {
    const text = el.textContent.trim();
    el.innerHTML = text
      .split(' ')
      .map((w) => `<span class="word" style="display:inline-block;margin-right:.28em">${w}</span>`)
      .join('');
  });

  function updateHeaderAndProgress() {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 30);
    if (backTop) backTop.classList.toggle('show', y > 500);
    if (progressBar) {
      const h = doc.documentElement;
      const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      progressBar.style.width = `${Math.max(0, Math.min(100, scrolled))}%`;
    }
  }

  window.addEventListener('scroll', updateHeaderAndProgress, { passive: true });
  updateHeaderAndProgress();

  if (mobileToggle && navLinks) {
    function closeMobileNav() {
      navLinks.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('nav-open');
    }

    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const expanded = navLinks.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', String(expanded));
      body.classList.toggle('nav-open', expanded);
    });

    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', closeMobileNav);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMobileNav();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileNav();
    });
  }

  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  doc.querySelectorAll('.faq-item .faq-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const active = item.classList.contains('active');
      item.parentElement.querySelectorAll('.faq-item').forEach((el) => el.classList.remove('active'));
      item.classList.toggle('active', !active);
      btn.setAttribute('aria-expanded', String(!active));
    });
  });

  if (cursorDot && cursorGlow && !isMobile) {
    window.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e;
      cursorDot.style.left = `${x}px`;
      cursorDot.style.top = `${y}px`;
      cursorGlow.style.left = `${x}px`;
      cursorGlow.style.top = `${y}px`;
    });

    doc.querySelectorAll('a, button, .card, .tilt-card').forEach((el) => {
      el.addEventListener('mouseenter', () => cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.45)');
      el.addEventListener('mouseleave', () => cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)');
    });
  }

  doc.querySelectorAll('.btn, .tab-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const ripple = doc.createElement('span');
      const rect = btn.getBoundingClientRect();
      ripple.className = 'ripple';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 900);
    });
  });

  doc.querySelectorAll('.tilt-card').forEach((card) => {
    if (isMobile) return;
    let frame = null;
    let nextX = 0;
    let nextY = 0;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      nextX = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      nextY = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        card.style.transform = `perspective(1200px) rotateX(${nextY}deg) rotateY(${nextX}deg) translateY(-4px)`;
        frame = null;
      });
    });
    card.addEventListener('mouseleave', () => {
      if (frame) cancelAnimationFrame(frame);
      frame = null;
      card.style.transform = '';
    });
  });

  const featuredPreview = doc.querySelector('#featuredPreview');
  if (featuredPreview) {
    const previewImage = featuredPreview.querySelector('.featured-preview-image');
    const previewTitle = featuredPreview.querySelector('.featured-preview-title');
    const previewDesc = featuredPreview.querySelector('.featured-preview-desc');
    const previewClose = featuredPreview.querySelector('.featured-preview-close');
    const featuredTiles = doc.querySelectorAll('.featured-tile');

    function openFeaturedPreview(tile) {
      if (!tile || !previewImage || !previewTitle || !previewDesc) return;
      previewImage.src = tile.dataset.image || tile.querySelector('img')?.src || '';
      previewImage.alt = tile.querySelector('img')?.alt || tile.dataset.title || 'Destination preview';
      previewTitle.textContent = tile.dataset.title || tile.querySelector('h3')?.textContent || '';
      previewDesc.textContent = tile.dataset.desc || tile.querySelector('p')?.textContent || '';
      featuredPreview.classList.add('show');
      featuredPreview.setAttribute('aria-hidden', 'false');
    }

    function closeFeaturedPreview() {
      featuredPreview.classList.remove('show');
      featuredPreview.setAttribute('aria-hidden', 'true');
    }

    featuredTiles.forEach((tile) => {
      tile.addEventListener('click', () => openFeaturedPreview(tile));
      tile.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openFeaturedPreview(tile);
        }
      });
    });

    if (previewClose) previewClose.addEventListener('click', closeFeaturedPreview);
    featuredPreview.addEventListener('click', (e) => {
      if (e.target === featuredPreview) closeFeaturedPreview();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && featuredPreview.classList.contains('show')) closeFeaturedPreview();
    });
  }

  doc.querySelectorAll('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.filter-tabs');
      const value = btn.dataset.filter;
      group.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      doc.querySelectorAll('.filter-item').forEach((item) => {
        const show = value === 'all' || item.dataset.category === value;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  const counters = doc.querySelectorAll('[data-count]');
  if (counters.length && window.gsap && window.ScrollTrigger) {
    counters.forEach((el) => {
      const target = Number(el.dataset.count || '0');
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: target,
        duration: isMobile ? 1.3 : 2,
        snap: { innerText: 1 },
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    });
  }

  const stories = doc.querySelector('.stories-slider');
  if (stories && window.gsap && !isReduced) {
    gsap.to(stories, {
      x: -16,
      repeat: -1,
      yoyo: true,
      duration: 8,
      ease: 'sine.inOut',
    });
  }

  const heroVideo = doc.querySelector('.hero-video');
  if (heroVideo && window.gsap && window.ScrollTrigger && !isReduced) {
    gsap.to(heroVideo, {
      scale: 1,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const revealTargets = gsap.utils.toArray('.reveal');
    revealTargets.forEach((el) => {
      const intensity = isMobile ? 40 : 70;
      gsap.fromTo(
        el,
        { opacity: 0, y: intensity, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: isMobile ? 0.7 : 1,
          ease: 'back.out(1.25)',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            end: 'bottom 12%',
            once: true,
          },
        }
      );
    });

    gsap.utils.toArray('.parallax-layer').forEach((layer) => {
      const speed = Number(layer.dataset.speed || 0.15);
      gsap.to(layer, {
        yPercent: speed * -70,
        ease: 'none',
        scrollTrigger: {
          trigger: layer.closest('section') || layer,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    const heroParts = gsap.utils.toArray('.hero-title .word, .hero-subtitle, .hero-actions .btn');
    if (heroParts.length && !isReduced) {
      gsap.from(heroParts, {
        y: 70,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: 'power3.out',
        delay: 0.15,
      });
    }

    const testimonialCards = gsap.utils.toArray('.testimonial-card');
    if (testimonialCards.length && !isReduced) {
      gsap.to(testimonialCards, {
        rotationY: (i) => (i % 2 ? -6 : 6),
        z: 30,
        repeat: -1,
        yoyo: true,
        duration: 3,
        stagger: 0.2,
        ease: 'sine.inOut',
      });
    }
  }

  const ambient = doc.querySelector('.ambient-bg');
  const ambientHidden = !ambient || window.getComputedStyle(ambient).display === 'none';
  const canvas = doc.querySelector('.particle-canvas');
  if (!ambientHidden && ambient) {
    ambient.addEventListener('pointermove', (e) => {
      if (isReduced || isMobile) return;
      const ripple = doc.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      ambient.appendChild(ripple);
      setTimeout(() => ripple.remove(), 900);
    });
  }

  if (!ambientHidden && canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const density = isMobile ? 28 : 52;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.4 + 0.8,
        dx: (Math.random() - 0.5) * 0.36,
        dy: (Math.random() - 0.5) * 0.36,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(13,59,102,0.20)';
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resizeCanvas();
    draw();
    window.addEventListener('resize', resizeCanvas);
  }

  body.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = doc.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
