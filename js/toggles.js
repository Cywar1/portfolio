/* ==========================================================
   toggles.js — Language (EN/AR) and Theme (Day/Night) toggles
   Dispatches custom events so other modules can react.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const html    = document.documentElement;
  const langBtn = document.getElementById('lang-toggle');
  const themeBtn = document.getElementById('theme-toggle');

  /* ----- Language toggle (EN ↔ AR with RTL flip) ----- */
  langBtn.addEventListener('click', () => {
    const next = html.getAttribute('lang') === 'en' ? 'ar' : 'en';
    html.setAttribute('lang', next);
    html.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr');
    langBtn.textContent = next === 'ar' ? 'English' : 'عربي';
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: next } }));
  });

  /* ----- Theme toggle (Day ↔ Night) ----- */
  themeBtn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'day' ? 'night' : 'day';
    html.setAttribute('data-theme', next);
    themeBtn.textContent = next === 'night' ? '☀️' : '🪔';
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
  });
});
