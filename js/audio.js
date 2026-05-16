/* ==========================================================
   audio.js — Web Audio synthesis (click) + real cat meow MP3s
   ========================================================== */

/* Lazy-init AudioContext (must happen inside a user gesture) */
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { return null; }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

/* ----- Soft warm "bloop" for non-cat clicks ----- */
function playClick() {
  const ctx = ensureAudio();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(360, now + 0.18);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.085, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.22);
}

/* ==========================================================
   Cat meows — 5 real CC0 recordings from BigSoundBank
   ========================================================== */
const MEOW_AUDIO_URLS = [
  'assets/audio/meow-1.mp3',
  'assets/audio/meow-2.mp3',
  'assets/audio/meow-3.mp3',
  'assets/audio/meow-4.mp3',
  'assets/audio/meow-5.mp3',
];

let lastMeowIdx = -1;
let meowAudioPool = null;

function initMeowPool() {
  if (meowAudioPool) return;
  meowAudioPool = MEOW_AUDIO_URLS.map(src => {
    const a = new Audio(src);
    a.preload = 'auto';
    a.volume = 0.75;
    return a;
  });
}

/* Plays a random real cat meow — never the same one twice in a row */
function playMeow() {
  initMeowPool();
  let idx;
  do { idx = Math.floor(Math.random() * meowAudioPool.length); }
  while (idx === lastMeowIdx && meowAudioPool.length > 1);
  lastMeowIdx = idx;
  /* Clone so rapid clicks can overlap naturally */
  const audio = meowAudioPool[idx].cloneNode();
  audio.volume = 0.75;
  audio.play().catch(() => {});
}
