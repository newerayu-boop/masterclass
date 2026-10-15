/* Design v3 — vortex hero, live dashboard card, program bento, concave case arc */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- hero vortex: streaks of gold light orbiting behind the title ---------- */
  const cv = document.getElementById('vortex');
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, streaks = [], heroVisible = true;
  function sizeVortex() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const base = Math.min(Math.max(W, 700) * 0.42, 620), n = W < 700 ? 140 : 240;
    streaks = Array.from({length: n}, () => {
      const r = base * (0.35 + Math.pow(Math.random(), 0.7) * 0.85);
      return {r, a: Math.random() * Math.PI * 2, len: 0.2 + Math.random() * 1.1,
        w: 0.6 + Math.random() * 2.2, sp: (0.04 + Math.random() * 0.1) * (base / r) * 0.6,
        al: 0.08 + Math.random() * 0.5, hue: Math.random()};
    });
  }
  function drawVortex(t) {
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = Math.min(H * 0.36, 380);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.55);
    glow.addColorStop(0, 'rgba(227,192,112,.20)'); glow.addColorStop(.35, 'rgba(160,110,30,.10)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    for (const s of streaks) {
      const a = s.a + t * 0.001 * s.sp;
      // tilt the ring a little so it reads as a tunnel/vortex, not a flat circle
      ctx.strokeStyle = s.hue > 0.75 ? `rgba(255,236,190,${s.al})` : s.hue > 0.35 ? `rgba(227,170,70,${s.al})` : `rgba(201,120,40,${s.al * 0.8})`;
      ctx.lineWidth = s.w;
      ctx.beginPath(); ctx.ellipse(cx, cy, s.r, s.r * 0.92, 0, a, a + s.len); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    // dark core so the title stays readable
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, 900) * 0.32);
    core.addColorStop(0, 'rgba(5,5,5,.88)'); core.addColorStop(1, 'rgba(5,5,5,0)');
    ctx.fillStyle = core; ctx.fillRect(0, 0, W, H);
  }
  function vortexLoop(t) { if (heroVisible) drawVortex(t); requestAnimationFrame(vortexLoop); }
  sizeVortex(); addEventListener('resize', sizeVortex);
  if (reduced) drawVortex(0); else requestAnimationFrame(vortexLoop);
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(cv);

  /* ---------- hero center card: departments cycle with a morphing chart ---------- */
  const DEP = [
    {n: '$12,480', c: 'Bugungi tushum', p: [70, 62, 66, 48, 54, 40, 46, 28, 34, 18]},
    {n: '$3,920', c: 'Sof foyda · bu hafta', p: [60, 64, 52, 56, 44, 50, 38, 42, 30, 26]},
    {n: '1,284', c: 'Yangi lidlar · oy', p: [80, 70, 74, 58, 50, 56, 36, 30, 22, 14]},
    {n: '96%', c: 'Ombor to‘ldirilgan', p: [40, 42, 38, 44, 36, 40, 34, 36, 30, 32]},
  ];
  const tabs = [...document.querySelectorAll('#dc-tabs em')];
  const line = document.getElementById('dc-line'), area = document.getElementById('dc-area'), dot = document.getElementById('dc-dot');
  const num = document.getElementById('dc-num'), cap = document.getElementById('dc-cap');
  function setDep(i) {
    const d = DEP[i], pts = d.p.map((y, k) => [k * (300 / 9), y + 10]);
    let path = `M${pts[0][0]} ${pts[0][1]}`;
    for (let k = 1; k < pts.length; k++) { const [x0, y0] = pts[k - 1], [x1, y1] = pts[k], mx = (x0 + x1) / 2; path += ` C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`; }
    line.setAttribute('d', path); area.setAttribute('d', path + ' L300 110 L0 110 Z');
    const hot = pts[7]; dot.setAttribute('cx', hot[0]); dot.setAttribute('cy', hot[1]);
    tabs.forEach((t, k) => t.classList.toggle('on', k === i));
    num.textContent = d.n; cap.textContent = d.c;
  }
  let dep = 0; setDep(0);
  if (!reduced) setInterval(() => { dep = (dep + 1) % DEP.length; setDep(dep); }, 2800);
  const TICKS = ['Qarzdorlar ro‘yxati CRM’ga yozildi', 'Raqobatchi narxlari yangilandi', '3 ta Reels ssenariy tayyor', 'Haftalik hisobot rahbarga yuborildi'];
  const tick = document.getElementById('jv-tick'); let ti = 0;
  if (!reduced) setInterval(() => { tick.style.opacity = 0; setTimeout(() => { ti = (ti + 1) % TICKS.length; tick.textContent = TICKS[ti]; tick.style.opacity = 1; }, 300); }, 3200);

  /* ---------- program bento: our real course screens inside glass cards ---------- */
  const bento = document.getElementById('bento');
  const LAYOUT = ['wide', 'half', 'half', 'wide rev', 'half', 'half'];
  window.WEEKS.forEach((w, i) => {
    const img = w.img.replace('./program/', '../v2/program/');
    const el = document.createElement('article');
    el.className = 'gcard wk' + (LAYOUT[i].startsWith('wide') ? ' wk--wide' : '') + (LAYOUT[i].includes('rev') ? ' rev' : '');
    el.innerHTML = `
      <div class="wk-copy">
        <div class="wk-eb">0${w.n} · ${w.wk}${w.cp ? `<span class="wk-cp">✓ ${w.cp}</span>` : ''}</div>
        <h3>${w.title}</h3>
        <p class="wk-pr">${w.promise}</p>
        <ul class="wk-ls">${w.lessons.map(([d, t]) => `<li><b>${d}</b><span>${t}</span></li>`).join('')}</ul>
        <div class="wk-res"><i>✓</i>${w.result}</div>
      </div>
      <div class="scr"><div class="scr-in"><img class="fg" src="${img}" alt="${w.alt}" loading="lazy"></div></div>`;
    bento.appendChild(el);
  });
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold: 0.18});
  document.querySelectorAll('.wk, .tcard, .econ > *, .price, .diag').forEach((el) => { if (!el.classList.contains('wk')) el.classList.add('reveal'); io.observe(el); });
  if (fine && !reduced) document.querySelectorAll('.scr').forEach((s) => {
    s.addEventListener('pointermove', (e) => { const r = s.getBoundingClientRect(); s.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 8 + 'deg'); s.style.setProperty('--rx', -((e.clientY - r.top) / r.height - .5) * 6 + 'deg'); });
    s.addEventListener('pointerleave', () => { s.style.setProperty('--ry', '0deg'); s.style.setProperty('--rx', '0deg'); });
  });

  /* ---------- cases: concave arc, halftone on the sides, colour + light beam in the centre ---------- */
  const CASES = [
    {img: 'feruz', name: 'Feruz Ximmatov', role: 'Phoenix Prime · zavod rahbari', field: 'Sanoat filtratsiyasi', m: '$10 000', ml: 'dasturiga taklif qilishdi', q: '«CRM ishonasizmi — men ikki kun uxlamasdan yozdim. Telefon ishladi.»', url: 'phoenix'},
    {img: 'aliyor', name: 'Texno Grand', role: 'Aliyor Djurabayev va jamoasi', field: '28 do‘kon · 300+ xodim', m: '$30 000+', ml: 'yiliga tejaladi', q: '«Hisobotni operatordan 2 soat kutardik. Endi telefonda 30 soniyada ochaman.»', url: 'texnogrand'},
    {img: 'mirodil', name: 'Loyalty ELD', role: 'Mirodil Mirsadikov va jamoasi', field: 'Logistika · 700+ truck', m: '$23 900+', ml: 'yiliga qo‘shimcha daromad', q: '«700 truck chatini o‘qib bo‘lmasdi. Endi kimga qo‘ng‘iroq qilishni panel aytadi.»', url: 'loyalty'},
    {img: 'sanat', name: 'AZALY', role: 'Sanat Ismailov va jamoasi', field: 'Kiyim · mebel · 31 xodim', m: '$7 000+', ml: 'yiliga tejaladi', q: '«Endi qog‘oz yo‘q: HR kuniga 8 soat emas, 1 soat ishlaydi.»', url: 'azaly'},
    {img: 'abdurahmon', name: 'Abdurahmon', role: 'Honor Furniture · zavod egasi', field: 'Mebel · 150 usta', m: '$19 000+', ml: 'yiliga tejaladi', q: '«AI’ni faqat savol-javobga ishlatardim — bunchalik ko‘p funksiyasi borligini bilmasdim.»', url: 'honor'},
    {img: 'jamshid', name: 'Jamshid Norqulov', role: 'VisaPro · asoschi', field: 'Yevropaga ishga joylash', m: '+$4 000', ml: 'oylik aylanmaga', q: '«Endi mijoz hammasini botda o‘zi ko‘radi, javob 10 soniyada.»', url: 'jamshid'},
  ];
  const arc = document.getElementById('arc'), stage = document.getElementById('arc-stage');
  const info = document.getElementById('case-info'), pos = document.getElementById('arc-pos');
  const N = CASES.length;
  const cards = CASES.map((c, i) => {
    const el = document.createElement('div'); el.className = 'acard';
    el.innerHTML = `<img src="../v2/cases/${c.img}.jpg" alt="${c.name}" draggable="false"><div class="shade"></div><div class="ac-tag">${c.name}</div>`;
    el.addEventListener('click', () => { if (!dragged) go(i); });
    stage.appendChild(el); return el;
  });
  let cur = 0, offset = 0; // offset: fractional drag in "cards"
  function geom() {
    const w = arc.clientWidth, cw = Math.max(130, Math.min(250, w * 0.19));
    const step = w < 700 ? 34 : 24;                     // degrees between cards
    const R = cw * 0.5 / Math.tan((step / 2) * Math.PI / 180) * 1.12;
    return {cw, step, R};
  }
  function layout() {
    const {cw, step, R} = geom();
    arc.style.setProperty('--cw', cw + 'px');
    cards.forEach((el, i) => {
      let d = i - cur - offset; d = ((d % N) + N + N / 2) % N - N / 2; // wrap to [-N/2, N/2)
      // concave: camera inside the ring, so outer cards turn toward the viewer and grow
      el.style.setProperty('--a', (-d * step) + 'deg');
      el.style.setProperty('--R', R + 'px');
      el.style.setProperty('--push', (R * 0.86) + 'px');
      el.style.opacity = Math.abs(d) > 3.2 ? 0 : 1;
      el.style.zIndex = 10 - Math.round(Math.abs(d));
      el.classList.toggle('on', Math.round(d) === 0 && Math.abs(offset) < 0.3);
    });
  }
  function renderInfo() {
    const c = CASES[cur];
    pos.textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(N).padStart(2, '0');
    info.innerHTML = `<div><div class="m">${c.m}</div><p>${c.ml}</p></div>
      <div><h4>${c.name}</h4><p>${c.role}<br>${c.field}</p></div>
      <div><p><i>${c.q}</i></p><a href="https://suniyintellect.uz/masterclass/keys/${c.url}/" target="_blank" rel="noopener noreferrer">Batafsil ↗</a></div>`;
  }
  function go(i) { cur = ((i % N) + N) % N; offset = 0; layout(); renderInfo(); restart(); }
  document.getElementById('arc-prev').onclick = () => go(cur - 1);
  document.getElementById('arc-next').onclick = () => go(cur + 1);
  arc.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') go(cur - 1); if (e.key === 'ArrowRight') go(cur + 1); });
  // drag / swipe
  let sx = null, dragged = false;
  arc.addEventListener('pointerdown', (e) => { sx = e.clientX; dragged = false; stage.querySelectorAll('.acard').forEach((c) => c.style.transitionDuration = '0s'); });
  addEventListener('pointermove', (e) => { if (sx === null) return; const dx = e.clientX - sx; if (Math.abs(dx) > 6) dragged = true; offset = -dx / (geom().cw * 0.9); layout(); });
  addEventListener('pointerup', () => { if (sx === null) return; sx = null; stage.querySelectorAll('.acard').forEach((c) => c.style.transitionDuration = ''); go(cur + Math.round(offset)); });
  // autoplay while visible, paused on hover
  let timer = null, arcVisible = false, hover = false;
  function restart() { clearInterval(timer); if (!reduced && arcVisible && !hover) timer = setInterval(() => go(cur + 1), 4500); }
  arc.addEventListener('pointerenter', () => { hover = true; restart(); });
  arc.addEventListener('pointerleave', () => { hover = false; restart(); });
  new IntersectionObserver(([e]) => { arcVisible = e.isIntersecting; restart(); }, {threshold: 0.4}).observe(arc);
  addEventListener('resize', layout);
  layout(); renderInfo();

  /* ---------- nav pill follows the section in view ---------- */
  const links = [...document.querySelectorAll('#nav-pill a')];
  const secs = links.map((a) => document.querySelector(a.getAttribute('href')));
  const navIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const k = secs.indexOf(e.target); links.forEach((a, j) => a.classList.toggle('on', j === k));
  }), {rootMargin: '-45% 0px -50% 0px'});
  secs.forEach((s) => s && navIO.observe(s));
})();
