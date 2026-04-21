// ---------- Mobile nav ----------
const toggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
if (toggle && mobileNav) {
  toggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------- Reveal on scroll ----------
const revealTargets = document.querySelectorAll(
  '.intro, .work, .wip, .photo, .about-text, .cv-summary, .letter, .reference-card, .the-end, .section-head'
);

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => io.observe(el));

  // Fallback
  setTimeout(() => {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }, 2500);
}

// ---------- Lightbox Vimeo ----------
const lightbox = document.getElementById('lightbox');
const lightboxFrame = lightbox ? lightbox.querySelector('.lightbox-frame') : null;
const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

function openLightbox(embedUrl) {
  if (!lightbox || !lightboxFrame) return;
  const src = embedUrl + (embedUrl.includes('?') ? '&' : '?') + 'autoplay=1&title=0&byline=0&portrait=0';
  lightboxFrame.innerHTML = `<iframe src="${src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
}
function closeLightbox() {
  if (!lightbox || !lightboxFrame) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxFrame.innerHTML = '';
  document.body.classList.remove('lightbox-open');
}

if (lightbox) {
  // Any element with data-vimeo attribute opens lightbox
  document.querySelectorAll('[data-vimeo]').forEach(el => {
    el.addEventListener('click', (e) => {
      const embed = el.getAttribute('data-vimeo');
      if (!embed) return; // no url yet, let default (if any) or ignore
      e.preventDefault();
      openLightbox(embed);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ---------- Showreel autoplay seguro ----------
// Algunos navegadores móviles pausan el autoplay: forzamos play() tras la carga.
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  const tryPlay = () => {
    const p = heroVideo.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };
  heroVideo.addEventListener('loadeddata', tryPlay);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryPlay();
  });
}
