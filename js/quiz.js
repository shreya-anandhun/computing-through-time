/* =====================================================================
   quiz.js — five-question multiple-choice quiz.
   - shows the result (and a fact) straight after each answer
   - keeps score, reviews every answer at the end, restart button
   - hand-written confetti on a <canvas> when you get one right
   ===================================================================== */
(function () {
  const stage = document.getElementById('quiz-stage');
  const progress = document.getElementById('quiz-progress');
  if (!stage) return;

  let index = 0;
  let score = 0;
  let answers = []; // true/false per question, for the end review

  /* ---------- confetti ---------------------------------------------- */
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  let pieces = [];
  let raf = null;

  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
  addEventListener('resize', resize);
  resize();

  function burst() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    const colours = [accent, '#1a7f37', '#2d6cdf', '#ffb020', '#ffffff', '#000000'];
    for (let i = 0; i < 160; i++) {
      pieces.push({
        x: innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: innerHeight * 0.35,
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 14 - 4,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        colour: colours[Math.floor(Math.random() * colours.length)],
        life: 120 + Math.random() * 60,
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.vy += 0.35;            // gravity
      p.vx *= 0.99;            // air drag
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 40));
      ctx.fillStyle = p.colour;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    pieces = pieces.filter((p) => p.life > 0 && p.y < canvas.height + 40);
    raf = pieces.length ? requestAnimationFrame(tick) : null;
    if (!raf) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /* ---------- rendering --------------------------------------------- */
  const keys = ['A', 'B', 'C', 'D'];

  function renderProgress() {
    progress.innerHTML = QUIZ.map((_, i) => `<span class="${i < index ? 'done' : ''}"></span>`).join('');
  }

  function renderQuestion() {
    renderProgress();
    const q = QUIZ[index];
    stage.innerHTML = `
      <div class="q-card">
        <p class="count">Question ${index + 1} of ${QUIZ.length}</p>
        <h3>${q.q}</h3>
        <div class="options" role="group" aria-label="Answers">
          ${q.options.map((opt, i) => `
            <button class="option" data-i="${i}">
              <span class="key" aria-hidden="true">${keys[i]}</span>
              <span>${opt}</span>
            </button>`).join('')}
        </div>
        <div class="feedback" hidden aria-live="polite">
          <p class="verdict"></p>
          <div class="fact"><strong>Did you know?</strong><p>${q.fact}</p></div>
          <div><button class="btn btn-primary next">${index === QUIZ.length - 1 ? 'See my score' : 'Next question'}</button></div>
        </div>
      </div>`;
    stage.querySelector('.option').focus({ preventScroll: true });
  }

  function answer(choice) {
    const q = QUIZ[index];
    const correct = choice === q.answer;
    answers.push(correct);
    if (correct) { score++; burst(); }

    stage.querySelectorAll('.option').forEach((btn) => {
      const i = Number(btn.dataset.i);
      btn.disabled = true;
      if (i === q.answer) btn.classList.add('correct');
      else if (i === choice) btn.classList.add('wrong');
    });

    const fb = stage.querySelector('.feedback');
    const verdict = fb.querySelector('.verdict');
    verdict.textContent = correct
      ? ['Correct!', 'Nailed it.', 'Yes! Spot on.', 'Exactly right.'][Math.floor(Math.random() * 4)]
      : `Not quite. The answer is ${keys[q.answer]}: ${q.options[q.answer]}.`;
    verdict.className = 'verdict ' + (correct ? 'ok' : 'no');
    fb.hidden = false;
    fb.querySelector('.next').focus({ preventScroll: true });
  }

  function renderScore() {
    index = QUIZ.length;
    renderProgress();
    const msg = score === 5 ? 'Perfect score. You could run this museum.'
      : score >= 3 ? 'Nice work. A quick lap of the timeline will get you the rest.'
      : 'The timeline has every answer. Have another go after a look.';
    stage.innerHTML = `
      <div class="q-card score-card">
        <p class="count">Your score</p>
        <div class="big">${score}<span class="muted" style="font-size:.4em"> / ${QUIZ.length}</span></div>
        <p style="margin-inline:auto">${msg}</p>
        <ul class="review">
          ${QUIZ.map((q, i) => `
            <li>
              <span class="mark ${answers[i] ? 'ok' : 'no'}" aria-label="${answers[i] ? 'Correct' : 'Wrong'}">${answers[i] ? '✓' : '✗'}</span>
              <span>${q.q}<br><span class="small muted">Answer: ${q.options[q.answer]}</span></span>
            </li>`).join('')}
        </ul>
        <div class="hero-actions" style="justify-content:center">
          <button class="btn btn-primary restart">Restart quiz</button>
          <a class="btn btn-ghost" href="timeline.html">Back to the timeline</a>
        </div>
      </div>`;
    stage.querySelector('.restart').focus({ preventScroll: true });
  }

  /* ---------- events (one listener for the whole quiz) ------------- */
  stage.addEventListener('click', (e) => {
    const opt = e.target.closest('.option');
    if (opt && !opt.disabled) return answer(Number(opt.dataset.i));
    if (e.target.closest('.next')) {
      index++;
      return index < QUIZ.length ? renderQuestion() : renderScore();
    }
    if (e.target.closest('.restart')) {
      index = 0; score = 0; answers = [];
      renderQuestion();
    }
  });

  // keyboard shortcut: press A–D to answer
  document.addEventListener('keydown', (e) => {
    const i = keys.indexOf(e.key.toUpperCase());
    if (i === -1 || index >= QUIZ.length) return;
    const btn = stage.querySelector(`.option[data-i="${i}"]`);
    if (btn && !btn.disabled) btn.click();
  });

  renderQuestion();
})();
