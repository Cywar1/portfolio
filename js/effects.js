/* ==========================================================
   effects.js — Click paw burst + mouse trail
   Depends on: audio.js (uses playClick)
   ========================================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Inline SVG paw used for the click stamp */
const PAW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <ellipse cx="16" cy="22" rx="8.5" ry="7" fill="#F4A4AA" stroke="#6B4423" stroke-width="1.4"/>
  <ellipse cx="7"  cy="12" rx="3"   ry="4" fill="#F4A4AA" stroke="#6B4423" stroke-width="1.2"/>
  <ellipse cx="13" cy="7"  rx="3"   ry="4" fill="#F4A4AA" stroke="#6B4423" stroke-width="1.2"/>
  <ellipse cx="19" cy="7"  rx="3"   ry="4" fill="#F4A4AA" stroke="#6B4423" stroke-width="1.2"/>
  <ellipse cx="25" cy="12" rx="3"   ry="4" fill="#F4A4AA" stroke="#6B4423" stroke-width="1.2"/>
</svg>`;

/* ----- Spawn paw stamp + honey hearts at (x, y) ----- */
function pawBurst(x, y, quick = false) {
  if (prefersReducedMotion) return;

  /* Paw stamp at the click point */
  const stamp = document.createElement('div');
  stamp.className = 'paw-stamp' + (quick ? ' quick' : '');
  stamp.style.left = x + 'px';
  stamp.style.top  = y + 'px';
  stamp.style.setProperty('--rot', (Math.random() * 60 - 30) + 'deg');
  stamp.innerHTML = PAW_SVG;
  document.body.appendChild(stamp);
  setTimeout(() => stamp.remove(), quick ? 750 : 2400);

  /* Honey hearts bursting outward */
  const count = 4 + Math.floor(Math.random() * 2);
  for (let i = 0; i < count; i++) {
    const h = document.createElement('span');
    h.className = 'click-heart';
    h.textContent = '💛';
    h.style.left = x + 'px';
    h.style.top  = y + 'px';
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const dist  = 36 + Math.random() * 28;
    h.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    h.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    h.style.setProperty('--delay', (i * 0.03) + 's');
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1000);
  }
}

/* ----- Document-wide click: sound + paw burst ----- */
document.addEventListener('click', (e) => {
  const isCat = !!e.target.closest('.cat-companion');
  const isInteractive = !!e.target.closest(
    'button, a, [role="button"], .plate, .teacup, .dessert-card, .note-email, .controls'
  );
  /* Cat plays its own meow via cat.js — skip the bloop for cat clicks */
  if (!isCat && typeof playClick === 'function') playClick();
  /* Short stamp on interactive things, long lingering stamp on empty page */
  pawBurst(e.clientX, e.clientY, isCat || isInteractive);
});

/* ==========================================================
   Mouse trail — tiny sparkles drift behind the paw cursor
   ========================================================== */
let lastTrailX = -999, lastTrailY = -999;
let trailCounter = 0;
const TRAIL_SYMBOLS = ['✨', '✨', '✨', '·', '✦', '✨'];

window.addEventListener('mousemove', (e) => {
  if (prefersReducedMotion) return;
  const dx = e.clientX - lastTrailX;
  const dy = e.clientY - lastTrailY;
  if (dx * dx + dy * dy < 26 * 26) return; /* ~26px throttle */
  lastTrailX = e.clientX;
  lastTrailY = e.clientY;

  const s = document.createElement('span');
  s.className = 'mouse-trail';
  trailCounter++;

  /* every ~10th particle is a heart, every ~14th is a honey bean */
  if (trailCounter % 10 === 0) {
    s.textContent = '💛';
    s.classList.add('heart');
  } else if (trailCounter % 14 === 0) {
    s.textContent = '•';
    s.classList.add('bean');
  } else {
    s.textContent = TRAIL_SYMBOLS[Math.floor(Math.random() * TRAIL_SYMBOLS.length)];
  }

  s.style.left = (e.clientX + (Math.random() * 12 - 6)) + 'px';
  s.style.top  = (e.clientY + (Math.random() * 12 - 6)) + 'px';
  s.style.setProperty('--drift-x', (Math.random() * 24 - 12) + 'px');
  s.style.setProperty('--drift-y', (8 + Math.random() * 18) + 'px');

  document.body.appendChild(s);
  setTimeout(() => s.remove(), 800);
}, { passive: true });
