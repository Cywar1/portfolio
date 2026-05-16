/* ==========================================================
   scroll.js — Scroll-reveal observer + top progress bar
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ----- Tag elements for the reveal observer ----- */
  document.querySelectorAll('section:not(.hero)').forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.plates, .teacups, .desserts').forEach(el => el.classList.add('stagger'));
  document.querySelectorAll('.edu-card, .note-card').forEach(el => el.classList.add('reveal'));

  /* ----- Observer: add `.visible` once when element enters viewport ----- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });
  document.querySelectorAll('.reveal, .stagger').forEach(el => io.observe(el));

  /* ----- Scroll progress bar (rAF-throttled) ----- */
  const progressBar = document.getElementById('scrollProgress');
  let ticking = false;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress  = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
  updateProgress();
});
