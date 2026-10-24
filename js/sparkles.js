/* =====================================================================
   sparkles.js — decorative motion shared by every page.
   1. Ambient sparkles: small four-point stars that twinkle and drift
      slowly upward BEHIND the content (so text stays readable; they
      show in the white space and around the cards).
   2. A second canvas above the content, kept for small bursts.
   Both use the current accent colour, so they match light and dark
   mode, and both switch off when the user prefers reduced motion.
   ===================================================================== */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const root = document.documentElement;
  const accent = () => getComputedStyle(root).getPropertyValue('--accent').trim();
  const ink = () => getComputedStyle(root).getPropertyValue('--ink').trim();

  /* draw a four-point star centred on (0,0) with "radius" r */
  function star(ctx, r) {
    const inner = r * 0.28;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const rad = i % 2 ? inner : r;
      const a = (Math.PI / 4) * i - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill();
  }

  function makeCanvas(id, z) {
    const c = document.createElement('canvas');
    c.id = id;
    c.setAttribute('aria-hidden', 'true');
    Object.assign(c.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: String(z) });
    document.body.prepend(c);
    return c;
  }

  /* ---------- 1. ambient layer ------------------------------------ */
  const bg = makeCanvas('sparkle-bg', 0);
  const bgx = bg.getContext('2d');
  const small = innerWidth < 700;
  const COUNT = small ? 6 : 12;
  let ambient = [];

  function spawn(fresh) {
    return {
      x: Math.random() * innerWidth,
      y: fresh ? innerHeight + 20 : Math.random() * innerHeight,
      r: 2 + Math.random() * 5,
      t: Math.random() * Math.PI * 2,      // twinkle phase
      s: 0.02 + Math.random() * 0.03,      // twinkle speed
      vy: 0.08 + Math.random() * 0.22,     // drift speed
      vx: (Math.random() - 0.5) * 0.15,
      dark: Math.random() < 0.2,           // a few quiet ink-coloured ones
    };
  }
  for (let i = 0; i < COUNT; i++) ambient.push(spawn(false));

  /* ---------- 2. cursor layer ------------------------------------- */
  const fg = makeCanvas('sparkle-fg', 75);
  const fgx = fg.getContext('2d');
  let trail = [];
  let last = 0;

  function burst(x, y, n, spread) {
    for (let i = 0; i < n; i++) {
      trail.push({
        x: x + (Math.random() - 0.5) * spread,
        y: y + (Math.random() - 0.5) * spread,
        r: 2 + Math.random() * 4,
        vx: (Math.random() - 0.5) * 1.4,
        vy: -0.4 - Math.random() * 1.2,
        life: 1,
        decay: 0.02 + Math.random() * 0.02,
      });
    }
  }

  /* (cursor trail removed: it looked busy. The burst is kept only for
     correct quiz answers, where quiz.js already draws its own confetti.) */

  /* ---------- shared loop ----------------------------------------- */
  function resize() {
    bg.width = fg.width = innerWidth;
    bg.height = fg.height = innerHeight;
  }
  addEventListener('resize', resize);
  resize();

  let hidden = false;
  document.addEventListener('visibilitychange', () => { hidden = document.hidden; });

  function frame() {
    if (!hidden) {
      const a = accent(), k = ink();

      bgx.clearRect(0, 0, bg.width, bg.height);
      ambient.forEach((p, i) => {
        p.t += p.s; p.y -= p.vy; p.x += p.vx;
        if (p.y < -20) ambient[i] = spawn(true);
        const glow = (Math.sin(p.t) + 1) / 2;   // 0 → 1 → 0
        bgx.save();
        bgx.translate(p.x, p.y);
        bgx.rotate(p.t * 0.3);
        bgx.globalAlpha = p.dark ? 0.12 * glow : 0.25 + 0.5 * glow;
        bgx.fillStyle = p.dark ? k : a;
        star(bgx, p.r * (0.7 + 0.3 * glow));
        bgx.restore();
      });

      fgx.clearRect(0, 0, fg.width, fg.height);
      trail = trail.filter((p) => p.life > 0);
      trail.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        fgx.save();
        fgx.translate(p.x, p.y);
        fgx.rotate(p.life * 3);
        fgx.globalAlpha = Math.max(0, p.life);
        fgx.fillStyle = a;
        star(fgx, p.r * p.life + 1);
        fgx.restore();
      });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
