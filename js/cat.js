/* ==========================================================
   cat.js — Mocha the cat companion 🐈
   Idle blinks, ear twitches, hover tilt, click hop + meow,
   reacts to lang/theme toggles, sleeps after 25 s idle.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const cat       = document.getElementById('cat');
  const catBubble = document.getElementById('catBubble');
  const html      = document.documentElement;

  const meowsEN = ['meow~', 'mrr ♡', 'purr...', 'hi! 💛', 'pet me?', 'hot cocoa?', 'snack?', '*tiny meow*', 'nya~', 'cheesecake!'];
  const meowsAR = ['مياو~', 'مياو ♡', 'خرخرة...', 'مرحبًا! 💛', 'دلِّلْني؟', 'كاكاو؟', 'وجبة؟', 'نياو~', 'تشيز كيك!'];

  const isAR = () => html.getAttribute('lang') === 'ar';

  const pickMeowText = () => {
    const list = isAR() ? meowsAR : meowsEN;
    return list[Math.floor(Math.random() * list.length)];
  };

  /* ----- Speech bubble ----- */
  let bubbleTimer;
  function showBubble(text, ms = 1800) {
    catBubble.textContent = text;
    catBubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => catBubble.classList.remove('show'), ms);
  }

  /* ----- Sleep / wake state machine ----- */
  let idleTimer;
  const goSleep = () => cat.classList.add('asleep');
  const wakeUp  = () => cat.classList.remove('asleep');
  function armIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(goSleep, 25000);
  }

  /* ----- Pet action: hop + bubble + real meow sound ----- */
  function onPet() {
    wakeUp();
    cat.classList.add('happy');
    setTimeout(() => cat.classList.remove('happy'), 600);
    showBubble(pickMeowText());
    if (typeof playMeow === 'function') playMeow();
    armIdle();
  }
  cat.addEventListener('click', onPet);
  cat.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPet(); }
  });

  /* ----- Any user activity wakes her up ----- */
  ['scroll', 'mousemove', 'keydown', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, () => { wakeUp(); armIdle(); }, { passive: true });
  });

  /* ----- Celebrate when language or theme changes ----- */
  function celebrate(en, ar) {
    wakeUp();
    cat.classList.add('spin');
    setTimeout(() => cat.classList.remove('spin'), 700);
    showBubble(isAR() ? ar : en, 1500);
    armIdle();
  }

  document.addEventListener('langchange', () => {
    celebrate('language!', 'لغة!');
  });

  document.addEventListener('themechange', (e) => {
    const night = e.detail.theme === 'night';
    celebrate(night ? 'cozy~ 🪔' : 'morning! ☀️',
              night ? 'دفء~ 🪔' : 'صباح! ☀️');
  });

  armIdle();
});
