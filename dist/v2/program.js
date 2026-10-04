/* Design v2 — course program.
   Each week's real course visual is rebuilt from particles: they stream in from the side,
   take the illustration's own colours, lock into place, then the frame lights up and the
   actual image appears. Leaving the screen resets it, so it replays on the way back. */
(() => {
  const vizzes = [...document.querySelectorAll('.pg-viz')];
  if (!vizzes.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 820px)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const TARGET = small ? 1300 : 2600;   // particles per visual
  const FLY = 900;                      // ms for the bulk of the flight
  const LIGHT_AT = 1600;                // ms when the real image fades in
  const END = 2350;                     // ms when the particle layer is cleared

  const fields = vizzes.map((viz) => {
    const img = viz.querySelector('.pg-img');
    const canvas = viz.querySelector('.pg-canvas');
    const row = viz.closest('.pg-row');
    const fromRight = row.classList.contains('pg-row--rev');
    return {viz, img, canvas, row, fromRight, ctx: canvas.getContext('2d'), parts: [], w: 0, h: 0, start: 0, state: 'idle'};
  });

  function prepare(f) {
    const {canvas, img, viz} = f;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
    f.w = canvas.clientWidth; f.h = canvas.clientHeight;
    canvas.width = Math.round(f.w * dpr); canvas.height = Math.round(f.h * dpr);
    f.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // where the image sits inside the frame (object-fit: contain)
    const ir = img.naturalWidth / img.naturalHeight, fr = f.w / f.h;
    const dw = ir > fr ? f.w : f.h * ir, dh = ir > fr ? f.w / ir : f.h;
    const dx = (f.w - dw) / 2, dy = (f.h - dh) / 2;
    const off = document.createElement('canvas');
    off.width = Math.max(1, Math.round(f.w)); off.height = Math.max(1, Math.round(f.h));
    const g = off.getContext('2d', {willReadFrequently: true});
    g.drawImage(img, dx, dy, dw, dh);
    const data = g.getImageData(0, 0, off.width, off.height).data;
    // the slide background colour (left edge) fills the letterbox and is skipped for particles
    const ci = (Math.round(dy + dh / 2) * off.width + Math.round(dx + 2)) * 4; // left edge, middle
    const bg = [data[ci], data[ci + 1], data[ci + 2]];
    viz.style.setProperty('--bg', `rgb(${bg[0]},${bg[1]},${bg[2]})`);
    const cand = [];
    const step = 2;
    for (let y = Math.ceil(dy); y < dy + dh; y += step) {
      for (let x = Math.ceil(dx); x < dx + dw; x += step) {
        const i = (y * off.width + x) * 4;
        const r = data[i], gg = data[i + 1], b = data[i + 2];
        const diff = Math.abs(r - bg[0]) + Math.abs(gg - bg[1]) + Math.abs(b - bg[2]);
        if (diff > 42) cand.push([x, y, r, gg, b, diff]);
      }
    }
    // keep the most "inked" pixels first so edges and colour survive the cut
    for (let i = cand.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [cand[i], cand[j]] = [cand[j], cand[i]]; }
    const pick = cand.slice(0, TARGET);
    const W = f.w, H = f.h;
    f.parts = pick.map(([tx, ty, r, g2, b]) => {
      // start beyond the edge on the side the visual sits on, sweep inwards
      const sx = f.fromRight ? W + 40 + Math.random() * W * 0.6 : -40 - Math.random() * W * 0.6;
      const sy = H * 0.5 + (Math.random() - 0.5) * H * 1.6;
      // bend each path through a random control point for a swirling stream
      const cx = (sx + tx) / 2 + (Math.random() - 0.5) * W * 0.5;
      const cy = (sy + ty) / 2 + (Math.random() - 0.5) * H * 0.9;
      const along = f.fromRight ? (W - tx) / W : tx / W; // nearer side arrives first
      const boost = 1.25; // lift colours so light slide art glows on the dark frame
      return {
        tx, ty, sx, sy, cx, cy, px: sx, py: sy,
        d: along * 320 + Math.random() * 200,
        r: Math.min(255, r * boost), g: Math.min(255, g2 * boost), b: Math.min(255, b * boost),
        s: 1.2 + Math.random() * 1.4,
      };
    });
  }

  const ease = (t) => 1 - Math.pow(1 - t, 3);

  function frame(f, now) {
    const {ctx, w, h} = f;
    const el = now - f.start;
    ctx.clearRect(0, 0, w, h);
    if (el > LIGHT_AT && f.state === 'flying') { f.state = 'lit'; f.viz.classList.add('is-lit'); }
    if (el > END) { f.state = 'done'; return false; }
    const fade = el > LIGHT_AT ? Math.max(0, 1 - (el - LIGHT_AT) / (END - LIGHT_AT)) : 1;
    ctx.lineCap = 'round';
    for (const p of f.parts) {
      const k = Math.min(1, Math.max(0, (el - p.d) / FLY));
      if (k <= 0) continue;
      const e = ease(k), u = 1 - e;
      const x = u * u * p.sx + 2 * u * e * p.cx + e * e * p.tx;
      const y = u * u * p.sy + 2 * u * e * p.cy + e * e * p.ty;
      const a = Math.min(1, 0.35 + k) * fade;
      ctx.strokeStyle = `rgba(${p.r | 0},${p.g | 0},${p.b | 0},${a})`;
      ctx.lineWidth = p.s;
      // short motion streak while flying (capped so dropped frames don't draw long lines)
      let mx = x, my = y;
      if (k < 1) { const vx = x - p.px, vy = y - p.py, L = Math.hypot(vx, vy), m = Math.min(L, 16) / (L || 1); mx = x - vx * m; my = y - vy * m; }
      ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(x + 0.01, y); ctx.stroke();
      p.px = x; p.py = y;
    }
    // gold spark ring while the picture locks in
    if (el > FLY * 0.55 && el < LIGHT_AT + 300) {
      const t = (el - FLY * 0.55) / (LIGHT_AT + 300 - FLY * 0.55);
      ctx.strokeStyle = `rgba(227,192,112,${0.5 * (1 - t)})`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(w / 2, h / 2, Math.max(w, h) * (0.15 + t * 0.6), 0, Math.PI * 2); ctx.stroke();
    }
    return true;
  }

  let running = false;
  function loop(now) {
    let busy = false;
    fields.forEach((f) => { if (f.state === 'flying' || f.state === 'lit') busy = frame(f, now) || busy; });
    if (busy) requestAnimationFrame(loop); else running = false;
  }

  function play(f) {
    if (!f.img.complete || !f.img.naturalWidth) { f.img.addEventListener('load', () => play(f), {once: true}); return; }
    f.row.classList.add('is-in');
    if (reduced) { f.viz.classList.add('is-lit'); f.state = 'done'; return; }
    prepare(f);
    f.parts.forEach((p) => { p.px = p.sx; p.py = p.sy; });
    f.viz.classList.remove('is-lit');
    f.state = 'flying';
    f.start = performance.now();
    if (!running) { running = true; requestAnimationFrame(loop); }
  }

  function reset(f) {
    f.state = 'idle';
    f.viz.classList.remove('is-lit');
    f.row.classList.remove('is-in');
    f.ctx.clearRect(0, 0, f.w, f.h);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const f = fields.find((x) => x.viz === e.target);
      if (e.intersectionRatio >= 0.35 && f.state === 'idle') play(f);
      else if (!e.isIntersecting && f.state !== 'idle') reset(f);
    });
  }, {threshold: [0, 0.35]});

  // Load the images eagerly once the section is near, so the first replay is instant
  fields.forEach((f) => { f.img.loading = 'eager'; io.observe(f.viz); });

  // gentle 3D tilt following the cursor
  if (fine && !reduced) {
    fields.forEach(({viz}) => {
      viz.addEventListener('pointermove', (e) => {
        const r = viz.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        viz.style.setProperty('--ry', `${(nx * 9).toFixed(2)}deg`);
        viz.style.setProperty('--rx', `${(-ny * 7).toFixed(2)}deg`);
      });
      viz.addEventListener('pointerleave', () => { viz.style.setProperty('--ry', '0deg'); viz.style.setProperty('--rx', '0deg'); });
    });
  }
})();
