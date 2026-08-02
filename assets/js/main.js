// ── Sticky nav ────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger menu ────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Scroll reveal ─────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Email obfuscation (keeps address out of page source) ──
const emailLink = document.getElementById('emailLink');
if (emailLink) {
  const address = `${emailLink.dataset.user}@${emailLink.dataset.domain}`;
  emailLink.href = `mailto:${address}`;
  document.getElementById('emailText').textContent = address;
}

// ── Testimonials Carousel ─────────────────────────────────
(function () {
  const track   = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsEl  = document.getElementById('carouselDots');

  if (!track) return;

  const cards = Array.from(track.children);
  let current = 0;
  let perView = getPerView();
  let total   = Math.ceil(cards.length / perView);
  let autoTimer;

  // Build dots
  function buildDots() {
    dotsEl.innerHTML = '';
    total = Math.ceil(cards.length / perView);
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }
  }

  function getPerView() {
    if (window.innerWidth >= 1100) return 3;
    if (window.innerWidth >= 768)  return 2;
    return 1;
  }

  function goTo(index) {
    total   = Math.ceil(cards.length / perView);
    current = Math.max(0, Math.min(index, total - 1));
    const offset = current * perView * (100 / perView);
    track.style.transform = `translateX(-${current * 100 / perView * perView}%)`;
    // Simpler: move by card widths
    track.style.transform = `translateX(-${current * (100 / perView) * perView}%)`;
    updateDots();
  }

  function updateDots() {
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function slide(dir) {
    total = Math.ceil(cards.length / perView);
    current = (current + dir + total) % total;
    goTo(current);
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => slide(1), 5000);
  }

  // Set card widths via JS so CSS media queries and JS stay in sync
  function setCardWidths() {
    perView = getPerView();
    const w = 100 / perView;
    cards.forEach(c => { c.style.minWidth = w + '%'; });
    total   = Math.ceil(cards.length / perView);
    current = Math.min(current, total - 1);
    buildDots();
    goTo(current);
  }

  prevBtn.addEventListener('click', () => slide(-1));
  nextBtn.addEventListener('click', () => slide(1));

  // Touch / swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) slide(diff > 0 ? 1 : -1);
  });

  // Keyboard support
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  slide(-1);
    if (e.key === 'ArrowRight') slide(1);
  });

  // Pause auto on hover
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', resetAuto);

  // Init
  setCardWidths();
  resetAuto();

  // Recalculate on resize
  window.addEventListener('resize', setCardWidths);
})();
