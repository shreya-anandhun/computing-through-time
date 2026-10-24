/* =====================================================================
   timeline.js — builds the interactive timeline from MILESTONES.
   - renders one card per milestone
   - click to expand / collapse (keyboard friendly: it is a <button>)
   - filter by era, search by keyword, "surprise me" random fact
   ===================================================================== */
(function () {
  const list = document.getElementById('timeline');
  const empty = document.getElementById('empty');
  const count = document.getElementById('result-count');
  const search = document.getElementById('search');
  const segmented = document.querySelector('.segmented');
  if (!list) return;

  let era = 'all';
  let query = '';

  /* ---------- render ------------------------------------------------ */
  const chevron = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  MILESTONES.forEach((m) => {
    const li = document.createElement('li');
    li.className = 'milestone reveal';
    li.id = m.id;
    li.dataset.year = m.year;
    li.dataset.era = m.era;
    li.innerHTML = `
      <div class="m-year" aria-hidden="true">${m.year}</div>
      <article class="m-card">
        <button class="m-summary" aria-expanded="false" aria-controls="${m.id}-body">
          <span class="m-icon">${m.icon}</span>
          <span>
            <h3><span class="visually-hidden">${m.year}: </span>${m.title}</h3>
            <p class="teaser">${m.teaser}</p>
          </span>
          <span class="m-chevron">${chevron}</span>
        </button>
        <div class="m-body" id="${m.id}-body">
          <div>
            <div class="m-content">
              <p>${m.why}</p>
              <div class="fact">
                <strong>Did you know?</strong>
                <p>${m.fact}</p>
              </div>
            </div>
          </div>
        </div>
      </article>`;
    list.appendChild(li);
  });

  // the shared helpers from main.js now need to see the new cards
  if (window.wireGlossary) window.wireGlossary(list);
  if (typeof watchReveals === 'function') watchReveals(list);

  /* ---------- expand / collapse ----------------------------------- */
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.m-summary');
    if (!btn) return;
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
  });

  function openMilestone(id) {
    const li = document.getElementById(id);
    if (!li) return;
    li.querySelector('.m-summary').setAttribute('aria-expanded', 'true');
    li.classList.add('in');
    li.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // #eniac in the URL opens that milestone (used by the quiz and home page)
  if (location.hash) setTimeout(() => openMilestone(location.hash.slice(1)), 300);

  /* ---------- filter + search ------------------------------------- */
  function applyFilters() {
    let shown = 0;
    const q = query.trim().toLowerCase();
    MILESTONES.forEach((m) => {
      const li = document.getElementById(m.id);
      const inEra = era === 'all' || ERAS[era].test(m.year);
      const hay = (m.title + ' ' + m.teaser + ' ' + m.why + ' ' + m.fact + ' ' + m.year).toLowerCase();
      const inQuery = !q || hay.includes(q);
      const visible = inEra && inQuery;
      li.hidden = !visible;
      if (visible) { shown++; li.classList.add('in'); }
    });
    count.textContent = `Showing ${shown} of ${MILESTONES.length} milestones`;
    empty.hidden = shown !== 0;
  }

  segmented.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    segmented.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    era = btn.dataset.era;
    applyFilters();
  });

  search.addEventListener('input', () => { query = search.value; applyFilters(); });
  applyFilters();

  /* ---------- random fact ----------------------------------------- */
  const dialog = document.getElementById('fact-dialog');
  const randomBtn = document.getElementById('random-fact');
  let lastIndex = -1;

  randomBtn.addEventListener('click', () => {
    let i;
    do { i = Math.floor(Math.random() * MILESTONES.length); } while (i === lastIndex);
    lastIndex = i;
    const m = MILESTONES[i];
    dialog.querySelector('.year').textContent = `${m.year} · ${m.title}`;
    dialog.querySelector('.text').textContent = m.fact;
    dialog.querySelector('.jump').onclick = () => {
      dialog.close();
      // make sure the card is not hidden by a filter
      search.value = ''; query = '';
      segmented.querySelector('[data-era="all"]').click();
      openMilestone(m.id);
    };
    dialog.showModal();
  });

  dialog.querySelector('.another').addEventListener('click', () => randomBtn.click());
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
})();
