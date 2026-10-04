/* Design v2 — course program: gold particles fly in and assemble into a picture of each topic. */
(() => {
  const canvases = [...document.querySelectorAll('.pg-canvas')];
  if (!canvases.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 820px)').matches;
  const MAX = small ? 750 : 1400;

  /* ---- Shapes: drawn once on an offscreen canvas, then sampled into target points ---- */
  const shapes = {
    // Documents feeding a database ("brain" of the business)
    kb(g, w, h, s) {
      const cx = w * 0.62, cy = h * 0.5, rx = s * 0.2, ry = s * 0.06, top = cy - s * 0.2, bot = cy + s * 0.2;
      g.beginPath(); g.ellipse(cx, top, rx, ry, 0, 0, Math.PI * 2); g.stroke();
      [cy - s * 0.065, cy + s * 0.07].forEach((y) => { g.beginPath(); g.ellipse(cx, y, rx, ry, 0, 0, Math.PI); g.stroke(); });
      g.beginPath(); g.ellipse(cx, bot, rx, ry, 0, 0, Math.PI); g.stroke();
      g.beginPath(); g.moveTo(cx - rx, top); g.lineTo(cx - rx, bot); g.moveTo(cx + rx, top); g.lineTo(cx + rx, bot); g.stroke();
      [[0.17, 0.3], [0.13, 0.52], [0.19, 0.74]].forEach(([x, y]) => {
        const dx = w * x, dy = h * y, dw = s * 0.12, dh = s * 0.15;
        g.strokeRect(dx - dw / 2, dy - dh / 2, dw, dh);
        for (let i = 1; i <= 3; i++) { g.beginPath(); g.moveTo(dx - dw * 0.3, dy - dh / 2 + i * dh / 4.2); g.lineTo(dx + dw * 0.3, dy - dh / 2 + i * dh / 4.2); g.stroke(); }
        g.save(); g.setLineDash([s * 0.012, s * 0.02]); g.beginPath(); g.moveTo(dx + dw / 2 + 6, dy); g.lineTo(cx - rx - 10, cy + (dy - cy) * 0.35); g.stroke(); g.restore();
      });
    },
    // A core with five agents orbiting it
    agents(g, w, h, s) {
      const cx = w / 2, cy = h / 2, R = s * 0.34;
      g.beginPath(); g.ellipse(cx, cy, R, R * 0.62, -0.25, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.arc(cx, cy, s * 0.1, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(cx, cy, s * 0.15, 0, Math.PI * 2); g.stroke();
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + i * (Math.PI * 2 / 5);
        const x = cx + Math.cos(a) * R * Math.cos(-0.25) - Math.sin(a) * R * 0.62 * Math.sin(-0.25);
        const y = cy + Math.cos(a) * R * Math.sin(-0.25) + Math.sin(a) * R * 0.62 * Math.cos(-0.25);
        g.save(); g.setLineDash([s * 0.01, s * 0.018]); g.beginPath(); g.moveTo(cx, cy); g.lineTo(x, y); g.stroke(); g.restore();
        g.beginPath(); g.arc(x, y, s * 0.045, 0, Math.PI * 2); g.fill();
      }
    },
    // Bar chart with a rising trend line
    dash(g, w, h, s) {
      const x0 = w * 0.16, x1 = w * 0.84, y0 = h * 0.2, y1 = h * 0.8;
      g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0, y1); g.lineTo(x1, y1); g.stroke();
      const vals = [0.32, 0.5, 0.42, 0.66, 0.58, 0.82];
      const bw = (x1 - x0) / vals.length;
      const pts = [];
      vals.forEach((v, i) => {
        const bx = x0 + bw * i + bw * 0.22, bh = (y1 - y0) * v * 0.85;
        g.globalAlpha = 0.55; g.fillRect(bx, y1 - bh, bw * 0.56, bh); g.globalAlpha = 1;
        pts.push([bx + bw * 0.28, y1 - bh - s * 0.05]);
      });
      g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
      pts.forEach(([x, y]) => { g.beginPath(); g.arc(x, y, s * 0.022, 0, Math.PI * 2); g.fill(); });
    },
    // "Arc reactor" rings for Jarvis
    jarvis(g, w, h, s) {
      const cx = w / 2, cy = h / 2;
      [0.38, 0.27].forEach((r) => { g.beginPath(); g.arc(cx, cy, s * r, 0, Math.PI * 2); g.stroke(); });
      g.beginPath(); g.arc(cx, cy, s * 0.08, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(cx, cy, s * 0.14, 0, Math.PI * 2); g.stroke();
      for (let i = 0; i < 3; i++) {
        const a = i * (Math.PI * 2 / 3) + 0.3;
        g.beginPath(); g.arc(cx, cy, s * 0.205, a, a + 1.4); g.lineWidth *= 2.2; g.stroke(); g.lineWidth /= 2.2;
      }
      for (let i = 0; i < 36; i++) {
        const a = i * (Math.PI * 2 / 36), r1 = s * 0.42, r2 = s * (i % 3 ? 0.445 : 0.47);
        g.beginPath(); g.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); g.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); g.stroke();
      }
    },
    // A phone with a code symbol
    app(g, w, h, s) {
      const pw = s * 0.42, ph = s * 0.8, px = w * 0.5 - pw / 2, py = h * 0.5 - ph / 2, r = s * 0.06;
      g.beginPath(); g.roundRect(px, py, pw, ph, r); g.stroke();
      g.beginPath(); g.roundRect(w * 0.5 - pw * 0.18, py + s * 0.035, pw * 0.36, s * 0.03, s * 0.015); g.fill();
      g.font = `800 ${Math.round(s * 0.2)}px Inter, Arial, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('</>', w * 0.5, h * 0.47);
      g.beginPath(); g.roundRect(px + pw * 0.18, py + ph * 0.72, pw * 0.64, s * 0.07, s * 0.035); g.fill();
      [[-0.36, -0.12], [0.36, 0.1]].forEach(([dx, dy]) => {
        const bx = w * 0.5 + dx * s - s * 0.07, by = h * 0.5 + dy * s - s * 0.05;
        g.beginPath(); g.roundRect(bx, by, s * 0.14, s * 0.1, s * 0.02); g.stroke();
      });
    },
    // A target hit by an arrow
    target(g, w, h, s) {
      const cx = w * 0.46, cy = h * 0.54;
      [0.34, 0.23, 0.12].forEach((r) => { g.beginPath(); g.arc(cx, cy, s * r, 0, Math.PI * 2); g.stroke(); });
      g.beginPath(); g.arc(cx, cy, s * 0.045, 0, Math.PI * 2); g.fill();
      const ex = cx + s * 0.42, ey = cy - s * 0.36;
      g.lineWidth *= 1.6; g.beginPath(); g.moveTo(cx, cy); g.lineTo(ex, ey); g.stroke(); g.lineWidth /= 1.6;
      const a = Math.atan2(ey - cy, ex - cx);
      [-0.5, 0.5].forEach((d) => {
        for (let k = 0; k < 2; k++) {
          const bx = ex - Math.cos(a) * s * (0.02 + k * 0.05), by = ey - Math.sin(a) * s * (0.02 + k * 0.05);
          g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.cos(a + Math.PI - d * 1.4) * s * 0.07, by + Math.sin(a + Math.PI - d * 1.4) * s * 0.07); g.stroke();
        }
      });
    },
  };

  function sample(shape, w, h) {
    const off = document.createElement('canvas');
    off.width = Math.round(w); off.height = Math.round(h);
    const g = off.getContext('2d');
    const s = Math.min(w, h * 1.25);
    g.strokeStyle = g.fillStyle = '#fff';
    g.lineWidth = Math.max(2.5, s * 0.016);
    g.lineCap = 'round'; g.lineJoin = 'round';
    shapes[shape](g, w, h, s);
    const data = g.getImageData(0, 0, off.width, off.height).data;
    const step = small ? 4 : 3;
    const pts = [];
    for (let y = 0; y < off.height; y += step) {
      for (let x = 0; x < off.width; x += step) {
        if (data[(y * off.width + x) * 4 + 3] > 110) pts.push([x + (Math.random() - 0.5) * step, y + (Math.random() - 0.5) * step]);
      }
    }
    for (let i = pts.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
    return pts.slice(0, MAX);
  }

  /* ---- One particle field per canvas ---- */
  const fields = canvases.map((canvas) => {
    const ctx = canvas.getContext('2d');
    const f = {canvas, ctx, shape: canvas.dataset.shape, parts: [], dust: [], w: 0, h: 0, visible: false, start: 0};
    f.layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
      f.w = canvas.clientWidth; f.h = canvas.clientHeight;
      canvas.width = Math.round(f.w * dpr); canvas.height = Math.round(f.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const pts = sample(f.shape, f.w, f.h);
      f.parts = pts.map(([tx, ty]) => ({tx, ty, x: 0, y: 0, sx: 0, sy: 0, d: Math.random() * 0.45, r: 1.1 + Math.random() * 1.5, ph: Math.random() * Math.PI * 2, b: 0.7 + Math.random() * 0.3}));
      f.dust = Array.from({length: small ? 24 : 40}, () => ({x: Math.random() * f.w, y: Math.random() * f.h, vx: (Math.random() - 0.5) * 0.15, vy: -0.05 - Math.random() * 0.15, r: 0.4 + Math.random() * 0.9}));
      f.scatter();
    };
    f.scatter = () => {
      // particles start spread around the frame (some from beyond the edges) and fly in
      f.parts.forEach((p) => {
        const a = Math.random() * Math.PI * 2, d = Math.max(f.w, f.h) * (0.35 + Math.random() * 0.6);
        p.sx = f.w / 2 + Math.cos(a) * d; p.sy = f.h / 2 + Math.sin(a) * d;
      });
      f.start = performance.now();
    };
    return f;
  });

  const ease = (t) => 1 - Math.pow(1 - t, 4);
  const DUR = 1900;

  function draw(f, now) {
    const {ctx, w, h} = f;
    ctx.clearRect(0, 0, w, h);
    const t = now / 1000;
    // drifting dust
    ctx.fillStyle = 'rgba(239,227,191,.35)';
    f.dust.forEach((d) => {
      d.x += d.vx; d.y += d.vy;
      if (d.y < -4) { d.y = h + 4; d.x = Math.random() * w; }
      if (d.x < -4) d.x = w + 4; else if (d.x > w + 4) d.x = -4;
      ctx.fillRect(d.x, d.y, d.r, d.r);
    });
    ctx.globalCompositeOperation = 'lighter';
    const el = reduced ? 1e9 : now - f.start;
    for (const p of f.parts) {
      const k = Math.min(1, Math.max(0, (el / DUR - p.d) / (1 - 0.45)));
      const e = ease(k);
      const wob = k >= 1 ? 1 : 0;
      p.x = p.sx + (p.tx - p.sx) * e + Math.sin(t * 1.3 + p.ph) * 0.6 * wob;
      p.y = p.sy + (p.ty - p.sy) * e + Math.cos(t * 1.1 + p.ph) * 0.6 * wob;
      const tw = 0.75 + 0.25 * Math.sin(t * 2 + p.ph);
      const a = Math.min(1, (0.3 + 0.8 * e) * p.b * tw);
      ctx.fillStyle = `rgba(${Math.round(201 + 54 * e * p.b)},${Math.round(168 + 60 * e * p.b)},${Math.round(76 + 110 * e * p.b)},${a})`;
      ctx.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r);
      if (e > 0.9 && p.b > 0.92) { ctx.fillStyle = `rgba(227,192,112,${0.12 * tw})`; ctx.fillRect(p.x - p.r * 1.5, p.y - p.r * 1.5, p.r * 3, p.r * 3); }
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  let running = false;
  function loop(now) {
    let any = false;
    fields.forEach((f) => { if (f.visible) { draw(f, now); any = true; } });
    if (any && !reduced) requestAnimationFrame(loop); else running = false;
  }
  const kick = () => { if (!running) { running = true; requestAnimationFrame(loop); } };

  const ready = () => {
    fields.forEach((f) => f.layout());
    const rows = new Map(fields.map((f) => [f.canvas, f.canvas.closest('.pg-row')]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const f = fields.find((x) => x.canvas === e.target);
        const wasVisible = f.visible;
        f.visible = e.isIntersecting;
        if (e.isIntersecting) {
          rows.get(f.canvas).classList.add('is-in');
          if (!wasVisible && !f.shown) { f.scatter(); f.shown = true; }
          if (reduced) draw(f, performance.now()); else kick();
        }
      });
    }, {threshold: 0.25});
    fields.forEach((f) => io.observe(f.canvas));
    let rt;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => { fields.forEach((f) => { const keep = f.shown; f.layout(); if (keep) f.start = -1e9; }); kick(); }, 200);
    });
  };
  // Wait for Inter so the "</>" glyph is sampled from the right font
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(ready);
})();
