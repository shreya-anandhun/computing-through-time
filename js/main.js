/* =====================================================================
   main.js — behaviour shared by every page.
   1. Dark/light theme toggle (remembered in localStorage)
   2. Mobile navigation menu
   3. Reading-progress bar and back-to-top button
   4. Scroll-reveal animation using IntersectionObserver
   5. Glossary tooltips on <dfn> words (hover on desktop, tap on phones)
   ===================================================================== */

/* ---------- 0. Always open pages at the top ---------------------------
   Browsers (and the Claude preview frame) can restore an old scroll
   position when you move between pages. We only keep it for #links. */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (!location.hash) scrollTo(0, 0);
addEventListener('pageshow', () => { if (!location.hash) scrollTo(0, 0); });

/* ---------- 1. Theme --------------------------------------------------
   The <head> of each page already applied the saved theme before paint
   (see the tiny inline script there) so there is no flash. This part
   only handles the button. */
(function initTheme() {
  const root = document.documentElement;
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  const apply = (theme) => {
    root.dataset.mode = theme;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    try { localStorage.setItem('ctt-theme', theme); } catch (e) { /* storage may be blocked */ }
  };

  apply(root.dataset.mode === 'dark' ? 'dark' : 'light');
  btn.addEventListener('click', () => apply(root.dataset.mode === 'dark' ? 'light' : 'dark'));
})();

/* ---------- 2. Mobile nav ------------------------------------------- */
(function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Mark the current page in the menu
  const here = location.pathname.split('/').pop() || 'index.html';
  links.querySelectorAll('a').forEach((a) => {
    if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
  });
})();

/* ---------- 3. Progress bar + back to top --------------------------- */
(function initScrollUI() {
  const bar = document.querySelector('.progress');
  const top = document.querySelector('.to-top');

  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? (scrollY / max) * 100 : 0;
    if (bar) bar.style.width = pct + '%';
    if (top) top.classList.toggle('show', scrollY > 600);
  };

  addEventListener('scroll', update, { passive: true });
  update();
  if (top) top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ---------- 4. Scroll reveal ----------------------------------------
   Anything with class "reveal" starts invisible (see CSS) and gets
   class "in" the first time it scrolls into view. Exposed globally so
   the timeline can register cards it creates later. */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target); // animate once only
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

function watchReveals(scope = document) {
  scope.querySelectorAll('.reveal:not(.in)').forEach((el) => revealObserver.observe(el));
}
watchReveals();

/* ---------- 5. Glossary tooltips -----------------------------------
   Every <dfn data-term="..."> looks its definition up in GLOSSARY
   (from data.js). One floating tooltip element is reused for all. */
(function initGlossary() {
  if (typeof GLOSSARY === 'undefined') return;

  const tip = document.createElement('div');
  tip.className = 'tooltip';
  tip.id = 'glossary-tip';
  tip.setAttribute('role', 'tooltip');
  document.body.appendChild(tip);

  let current = null;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  function show(term) {
    const key = (term.dataset.term || term.textContent).toLowerCase();
    const text = GLOSSARY[key];
    if (!text) return;
    tip.textContent = text;
    tip.classList.add('show');
    term.setAttribute('aria-describedby', 'glossary-tip');
    current = term;
    position(term);
  }

  function hide() {
    tip.classList.remove('show');
    if (current) current.removeAttribute('aria-describedby');
    current = null;
  }

  function position(term) {
    const r = term.getBoundingClientRect();
    const tw = tip.offsetWidth;
    // keep the tooltip inside the viewport horizontally
    let left = r.left + scrollX + r.width / 2 - tw / 2;
    const minLeft = scrollX + 12, maxLeft = scrollX + innerWidth - tw - 12;
    left = Math.max(minLeft, Math.min(left, maxLeft));
    tip.style.left = left + 'px';
    tip.style.top = r.bottom + scrollY + 10 + 'px';
    // point the little arrow at the word
    tip.style.setProperty('--arrow', (r.left + scrollX + r.width / 2 - left - 6) + 'px');
  }

  function wire(scope = document) {
    scope.querySelectorAll('dfn[data-term]').forEach((term) => {
      if (term.dataset.wired) return;
      term.dataset.wired = '1';
      term.tabIndex = 0;
      term.setAttribute('role', 'button');
      term.setAttribute('aria-label', term.textContent + ', show definition');

      if (finePointer) {
        term.addEventListener('mouseenter', () => show(term));
        term.addEventListener('mouseleave', hide);
      }
      // tap on touch screens, and keyboard for everyone
      term.addEventListener('click', (e) => {
        e.preventDefault();
        current === term ? hide() : show(term);
      });
      term.addEventListener('focus', () => show(term));
      term.addEventListener('blur', hide);
    });
  }

  wire();
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
  document.addEventListener('click', (e) => { if (!e.target.closest('dfn')) hide(); });
  addEventListener('resize', () => current && position(current));

  // let other scripts wire up words they add later
  window.wireGlossary = wire;
})();

/* ---------- 6. Scrolling marquee of milestones (home page) ---------- */
(function initMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track || typeof MILESTONES === 'undefined') return;
  const items = MILESTONES.map((m) => `<span><b>${m.year}</b> ${m.title.split(',')[0]}</span>`).join('<i aria-hidden="true">✦</i>');
  track.innerHTML = items + '<i aria-hidden="true">✦</i>' + items + '<i aria-hidden="true">✦</i>'; // doubled for a seamless loop
})();
