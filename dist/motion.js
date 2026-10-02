(() => {
  const root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Rotating, lit planet ---------- */
  const canvas = document.getElementById('planet');
  const flare = document.querySelector('.planet-flare');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const GOLD = [227, 192, 112];
    const PALE = [255, 244, 214];
    let w = 0, h = 0, dpr = 1, R = 0, cx = 0, cy = 0;
    let visible = true;
    let mouseX = 0;
    let lightTarget = 0;

    // Surface: fibonacci sphere, keep points that fall on procedural "continents".
    const land = (lat, lon) =>
      Math.sin(lon * 3 + Math.sin(lat * 2) * 1.4) * Math.cos(lat * 2.6) +
      Math.sin(lon * 5.3 + 1.7) * Math.sin(lat * 4.1 + 0.6) * 0.6 +
      Math.cos(lon * 1.7 - lat * 3.3) * 0.45;
    const points = [];
    const small = window.matchMedia('(max-width: 700px)').matches;
    const N = small ? 3200 : 6500; // fewer surface dots on phones
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      const x = Math.cos(t) * r, z = Math.sin(t) * r;
      const lat = Math.asin(y), lon = Math.atan2(z, x);
      const v = land(lat, lon);
      if (v > 0.2) points.push([x, y, z, 1]);
      else if (i % 3 === 0) points.push([x, y, z, 0]);
    }

    // Stars
    const stars = Array.from({length: 120}, () => [Math.random(), Math.random() * 0.75, Math.random() * 1.2 + 0.2, Math.random() * Math.PI * 2]);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(Math.max(w * 0.4, 290), 560);
      cx = w / 2;
      cy = (w < 700 ? 34 : 120) + R;
    }

    const tilt = -0.42; // lean the north pole toward the viewer
    const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
    const mix = (a, b, k) => `${Math.round(a[0] + (b[0] - a[0]) * k)},${Math.round(a[1] + (b[1] - a[1]) * k)},${Math.round(a[2] + (b[2] - a[2]) * k)}`;

    function project(x, y, z, rot) {
      const cr = Math.cos(rot), sr = Math.sin(rot);
      const x1 = x * cr + z * sr, z1 = -x * sr + z * cr;
      const y2 = y * cosT - z1 * sinT, z2 = y * sinT + z1 * cosT;
      return [x1, y2, z2];
    }

    function ring(t, front) {
      // Tilted orbit ring with a travelling spark.
      const steps = 160, rr = 1.32, incl = 0.28;
      ctx.lineWidth = 1;
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        let x = Math.cos(a) * rr, z = Math.sin(a) * rr, y = 0;
        const yy = y * Math.cos(incl) - z * Math.sin(incl), zz = y * Math.sin(incl) + z * Math.cos(incl);
        const p = project(x, yy, zz, 0.6);
        if ((p[2] > 0) !== front) continue;
        const sx = cx + p[0] * R, sy = cy - p[1] * R;
        const head = ((t * 0.18) % (Math.PI * 2));
        let d = Math.abs(a - head); d = Math.min(d, Math.PI * 2 - d);
        const glow = Math.max(0, 1 - d / 0.9);
        ctx.fillStyle = `rgba(${mix(GOLD, PALE, glow)},${0.12 + glow * 0.85})`;
        const s = 1 + glow * 2.2;
        ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
      }
    }

    function draw(time) {
      const t = time / 1000;
      ctx.clearRect(0, 0, w, h);

      // Twinkling stars
      for (const s of stars) {
        const a = 0.15 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.3 + s[3]));
        ctx.fillStyle = `rgba(239,227,191,${a})`;
        ctx.fillRect(s[0] * w, s[1] * h * 0.5, s[2], s[2]);
      }

      // Light swings left/right over time and leans toward the cursor.
      lightTarget += ((Math.sin(t * 0.35) * 0.75 + mouseX * 0.5) - lightTarget) * 0.04;
      const L = [lightTarget, 0.55, 0.62];
      const ll = Math.hypot(L[0], L[1], L[2]);
      L[0] /= ll; L[1] /= ll; L[2] /= ll;
      if (flare) flare.style.setProperty('--fx', `${50 + L[0] * 34}%`);

      ring(t, false);

      // Atmosphere halo
      const lx = cx + L[0] * R * 0.7, ly = cy - L[1] * R * 0.9;
      const halo = ctx.createRadialGradient(lx, ly, R * 0.2, cx, cy, R * 1.25);
      halo.addColorStop(0, 'rgba(227,192,112,0.22)');
      halo.addColorStop(0.75, 'rgba(201,168,76,0.06)');
      halo.addColorStop(1, 'rgba(201,168,76,0)');
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2); ctx.fill();

      // Planet body
      const body = ctx.createRadialGradient(lx, ly, 0, cx, cy, R);
      body.addColorStop(0, '#2a2416');
      body.addColorStop(0.45, '#14120d');
      body.addColorStop(1, '#0b0b0a');
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

      // Rotating dotted surface
      const rot = reduced ? 0.8 : t * 0.09;
      for (const p of points) {
        const q = project(p[0], p[1], p[2], rot);
        if (q[2] <= 0) continue;
        const sx = cx + q[0] * R, sy = cy - q[1] * R;
        if (sy > h + 4) continue;
        const lit = Math.max(0, q[0] * L[0] + q[1] * L[1] + q[2] * L[2]);
        const edge = q[2];
        if (p[3]) {
          const k = Math.pow(lit, 1.6);
          ctx.fillStyle = `rgba(${mix(GOLD, PALE, k * 0.8)},${0.07 + k * 0.85 * (0.4 + edge * 0.6)})`;
          const s = 0.8 + edge * 1.3;
          ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
        } else {
          ctx.fillStyle = `rgba(201,168,76,${0.03 + lit * 0.12})`;
          ctx.fillRect(sx - 0.5, sy - 0.5, 1, 1);
        }
      }

      // Rim light: strongest on the lit side
      const rimAng = Math.atan2(-L[1], L[0]);
      ctx.save();
      ctx.lineCap = 'round';
      for (const [width, alpha, blur] of [[10, 0.18, 24], [3, 0.55, 10], [1.4, 0.95, 0]]) {
        ctx.beginPath();
        ctx.arc(cx, cy, R, rimAng - 1.25, rimAng + 1.25);
        const g = ctx.createLinearGradient(cx + Math.cos(rimAng - 1.25) * R, cy + Math.sin(rimAng - 1.25) * R, cx + Math.cos(rimAng + 1.25) * R, cy + Math.sin(rimAng + 1.25) * R);
        g.addColorStop(0, 'rgba(227,192,112,0)');
        g.addColorStop(0.5, `rgba(255,240,200,${alpha})`);
        g.addColorStop(1, 'rgba(227,192,112,0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = width;
        ctx.shadowColor = 'rgba(227,192,112,0.9)';
        ctx.shadowBlur = blur;
        ctx.stroke();
      }
      ctx.restore();
      // Faint full outline
      ctx.strokeStyle = 'rgba(201,168,76,0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

      ring(t, true);
    }

    // ~30fps on phones; the loop stops entirely while the planet is off screen.
    const frameGap = small ? 32 : 0;
    let last = 0, running = false;
    function loop(time) {
      if (!visible || reduced) { running = false; return; }
      if (time - last >= frameGap) { last = time; draw(time); }
      requestAnimationFrame(loop);
    }
    const start = () => { if (!running && !reduced) { running = true; requestAnimationFrame(loop); } };
    resize();
    window.addEventListener('resize', () => { resize(); if (reduced) draw(0); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(canvas);
    }
    if (finePointer) {
      window.addEventListener('pointermove', (e) => { mouseX = (e.clientX / window.innerWidth) * 2 - 1; }, {passive: true});
    }
    if (reduced) draw(0); else start();
  }

  /* ---------- Live dashboard ---------- */
  const panel = document.getElementById('preview-panel');
  if (panel) {
    // Count-up numbers
    const fmt = (n, el) => {
      let s = String(Math.round(n));
      if (el.dataset.sep) s = Number(s).toLocaleString('en-US');
      if (el.dataset.pad) s = s.padStart(+el.dataset.pad, '0');
      return s;
    };
    panel.querySelectorAll('[data-count]').forEach((el) => {
      const target = +el.dataset.count;
      if (reduced) return;
      const start = performance.now() + 300, dur = 1800;
      el.textContent = fmt(0, el);
      const tick = (now) => {
        const k = Math.min(1, Math.max(0, (now - start) / dur));
        el.textContent = fmt(target * (1 - Math.pow(1 - k, 3)), el);
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

    // Bars, agent progress, highlighted metric, tabs and ticker refresh in a loop
    const bars = [...panel.querySelectorAll('.chart-bars i')];
    const agents = [...panel.querySelectorAll('.ag-bar u')];
    const metrics = [...panel.querySelectorAll('.preview-metrics > div')];
    const tabs = [...panel.querySelectorAll('.preview-tabs em')];
    const ticker = document.getElementById('ticker');
    const events = [
      'Jarvis: kunlik hisobot tayyor',
      'Sotuv agenti: 3 ta yangi lid → CRM',
      'Kontent agenti: 5 ta Reels ssenariysi',
      'Dashboard: savdo +18% bu hafta',
      'Hisobot agenti: qarzdorlik yangilandi'
    ];
    let step = 0;
    const shuffleBars = () => {
      let max = 0, peak = null;
      bars.forEach((b, i) => {
        const v = 22 + Math.round(Math.random() * 70);
        b.style.setProperty('--h', `${v}%`);
        b.classList.remove('is-peak');
        if (i % 2 === 0 && v > max) { max = v; peak = b; }
      });
      if (peak) { peak.classList.add('is-peak'); peak.dataset.v = `${Math.round(max / 2)} soat`; }
    };
    shuffleBars();
    metrics[0] && metrics[0].classList.add('is-hot');
    let panelVisible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { panelVisible = e.isIntersecting; }).observe(panel);
    }
    if (!reduced) {
      setInterval(() => {
        if (!panelVisible || document.hidden) return;
        step++;
        shuffleBars();
        agents.forEach((a) => a.style.setProperty('--w', `${35 + Math.round(Math.random() * 62)}%`));
        metrics.forEach((m, i) => m.classList.toggle('is-hot', i === step % metrics.length));
        tabs.forEach((t, i) => t.classList.toggle('is-active', i === step % tabs.length));
        if (ticker) {
          ticker.classList.add('is-out');
          setTimeout(() => { ticker.textContent = events[step % events.length]; ticker.classList.remove('is-out'); }, 350);
        }
      }, 2600);
    }

    // 3D tilt + shine following the cursor
    if (finePointer && !reduced) {
      window.addEventListener('pointermove', (e) => {
        const r = panel.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        if (Math.abs(ny) > 1.6) return;
        panel.style.setProperty('--ry', `${(nx * 8).toFixed(2)}deg`);
        panel.style.setProperty('--rx', `${(-ny * 5).toFixed(2)}deg`);
        panel.style.setProperty('--sx', `${(nx + 0.5) * 100}%`);
        panel.style.setProperty('--sy', `${(ny + 0.5) * 100}%`);
      }, {passive: true});
    }
  }

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.sec .wrap > div, .sec .wrap > p, .sec .wrap > h2, .card, .case-card, .row, .brand-caption'
  );
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, {rootMargin: '0px 0px -8% 0px', threshold: 0.08});
    revealTargets.forEach((el) => {
      if (el.closest('.reveal') || el.matches('.rm')) return; // parent already animates; roadmap has its own motion
      if (el.querySelector(':scope > .card, :scope > .case-card, :scope > .row')) return; // children animate instead
      el.classList.add('reveal');
      const sibs = [...el.parentElement.children].filter((c) => c.matches('.card, .case-card, .row'));
      const idx = sibs.indexOf(el);
      if (idx > 0) el.style.setProperty('--d', `${Math.min(idx, 6) * 0.08}s`);
      io.observe(el);
    });
  }

  /* ---------- Cursor spotlight on cards ---------- */
  if (finePointer) {
    document.addEventListener('pointermove', (e) => {
      const el = e.target.closest && e.target.closest('.card, .case-card, .rm-card');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, {passive: true});
  }

  /* ---------- Roadmap: rail fills, comet travels, steps light up ---------- */
  const rm = document.getElementById('roadmap');
  if (rm) {
    const steps = [...rm.querySelectorAll('.rm-step')];
    const nodes = steps.map((st) => st.querySelector('.rm-node'));
    let queued = false;
    const centerY = (el) => { const r = el.getBoundingClientRect(); return r.top + r.height / 2; };
    const update = () => {
      queued = false;
      const top = rm.getBoundingClientRect().top;
      const first = centerY(nodes[0]) - top;
      const last = centerY(nodes[nodes.length - 1]) - top;
      rm.style.setProperty('--lt', `${first}px`);
      rm.style.setProperty('--lh', `${last - first}px`);
      const mark = window.innerHeight * 0.55;
      const fill = Math.min(last - first, Math.max(0, mark - top - first));
      rm.style.setProperty('--fill', `${fill}px`);
      rm.classList.toggle('has-fill', fill > 2);
      let current = -1;
      steps.forEach((st, i) => {
        const lit = centerY(nodes[i]) <= mark + 1;
        st.classList.toggle('is-lit', lit);
        if (lit) current = i;
        if (st.getBoundingClientRect().top < window.innerHeight * 0.9) st.classList.add('is-in');
      });
      steps.forEach((st, i) => st.classList.toggle('is-current', i === current));
    };
    const request = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', request, {passive: true});
    window.addEventListener('resize', request);
    update();
  }

  /* ---------- Pricing carousel (phones) ---------- */
  const priceGrid = document.getElementById('price-grid');
  const priceTabs = document.getElementById('price-tabs');
  if (priceGrid && priceTabs) {
    const cards = [...priceGrid.children];
    const tabs = [...priceTabs.querySelectorAll('button')];
    const isCarousel = () => getComputedStyle(priceGrid).overflowX === 'auto';
    const offsetFor = (card) => card.offsetLeft - (priceGrid.clientWidth - card.offsetWidth) / 2;
    const setActive = () => {
      const mid = priceGrid.scrollLeft + priceGrid.clientWidth / 2;
      let best = 0, dist = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (d < dist) { dist = d; best = i; }
      });
      tabs.forEach((t, i) => { t.classList.toggle('is-active', i === best); t.setAttribute('aria-pressed', String(i === best)); });
    };
    tabs.forEach((t, i) => t.addEventListener('click', () => {
      priceGrid.scrollTo({left: offsetFor(cards[i]), behavior: reduced ? 'auto' : 'smooth'});
    }));
    priceGrid.addEventListener('scroll', () => requestAnimationFrame(setActive), {passive: true});
    // Open on the recommended plan.
    const center = () => { if (isCarousel()) { priceGrid.scrollLeft = offsetFor(cards[1]); setActive(); } };
    window.addEventListener('resize', setActive);
    if (document.readyState === 'complete') center(); else window.addEventListener('load', center);
  }

  /* ---------- Floating CTA ---------- */
  const floatCta = document.getElementById('float-cta');
  const hero = document.querySelector('.site-hero');
  const contact = document.getElementById('diagnostika');
  if (floatCta && hero && 'IntersectionObserver' in window) {
    let pastHero = false, atContact = false;
    const sync = () => floatCta.classList.toggle('is-visible', pastHero && !atContact);
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; sync(); }, {threshold: 0}).observe(hero);
    if (contact) new IntersectionObserver(([e]) => { atContact = e.isIntersecting; sync(); }, {threshold: 0.25}).observe(contact);
  } else if (floatCta) {
    floatCta.classList.add('is-visible');
  }

  /* ---------- Pause paint-heavy CSS loops while off screen ---------- */
  if ('IntersectionObserver' in window) {
    const loops = document.querySelectorAll('.preview-panel, .section-pricing .card:nth-child(2), .section-contact .card, .rm-step--key .rm-card, .final-horizon, .float-chip, .hero-kicker');
    const pauser = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle('anim-off', !e.isIntersecting));
    }, {rootMargin: '100px 0px'});
    loops.forEach((el) => { el.classList.add('anim-off'); pauser.observe(el); });
  }
})();
