/* AI Strateg — lead landings. Every form: name + phone (+ optional call time).
   The lead is saved to the Google Sheet and the page waits for {"ok":true}; on failure it
   retries, and if it still fails the visitor gets a Telegram button with their details
   prefilled, so the manager receives the contact either way. */
(() => {
  const CFG = Object.assign({
    endpoint: 'https://script.google.com/macros/s/AKfycbxPmGOHnP32fnCiHENX9vDcaTGcKu9K50dODthhJPxlulsTdpTYUWM99K53SLs3tr6QDg/exec',
    manager: 'Yusufbaymanager',   // Telegram username, without @
    site: 'lead',                  // which landing sent the lead
    metaPixelId: '',               // fill in to enable Meta Pixel (PageView + Lead)
    ga4Id: ''                      // fill in to enable Google Analytics 4 (page_view + generate_lead)
  }, window.LP_CONFIG || {});

  /* ---------- analytics (only when IDs are set) ---------- */
  if (CFG.metaPixelId) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', CFG.metaPixelId); window.fbq('track', 'PageView');
  }
  if (CFG.ga4Id) {
    const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CFG.ga4Id; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', CFG.ga4Id);
  }
  const trackLead = () => {
    try { if (window.fbq) window.fbq('track', 'Lead'); } catch (e) {}
    try { if (window.gtag) window.gtag('event', 'generate_lead', {site: CFG.site}); } catch (e) {}
  };

  /* ---------- helpers ---------- */
  const params = new URLSearchParams(location.search);
  const utm = [...params].filter(([k]) => k.startsWith('utm_')).map(([k, v]) => `${k}=${v}`).join(', ');
  const digits = (s) => String(s || '').replace(/\D/g, '');
  const normPhone = (raw) => {
    let d = digits(raw);
    if (d.length === 9) d = '998' + d;           // 90 123 45 67 → 998901234567
    while (d.startsWith('998998')) d = d.slice(3); // "+998 " prefill + typed "+998 …"
    return d.length >= 11 ? '+' + d : raw.trim();
  };
  const tgLink = (text) => `https://t.me/${CFG.manager}?text=${encodeURIComponent(text)}`;

  const saveLead = async (data) => {
    const body = JSON.stringify(data);
    for (let attempt = 0; attempt < 2; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12000);
      try {
        const res = await fetch(CFG.endpoint, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, body, signal: ctrl.signal});
        const out = await res.json();
        if (out && out.ok) return true;
      } catch (e) { /* retry */ } finally { clearTimeout(timer); }
    }
    try { if (navigator.sendBeacon) navigator.sendBeacon(CFG.endpoint, new Blob([body], {type: 'text/plain;charset=utf-8'})); } catch (e) {}
    return false;
  };

  /* ---------- forms ---------- */
  document.querySelectorAll('[data-lead-form]').forEach((card) => {
    const form = card.querySelector('form');
    const err = card.querySelector('.err');
    const btn = form.querySelector('button[type=submit]');
    const btnText = btn.textContent;
    const phone = form.querySelector('input[name=phone]');
    phone.addEventListener('focus', () => { if (!phone.value) phone.value = '+998 '; });
    phone.addEventListener('blur', () => { if (phone.value.trim() === '+998') phone.value = ''; });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      err.textContent = '';
      const fd = Object.fromEntries(new FormData(form));
      if (fd.website) return;                                    // bot
      const name = (fd.name || '').trim();
      const ph = normPhone(fd.phone || '');
      phone.removeAttribute('aria-invalid');
      if (!name) { err.textContent = 'Ismingizni yozing.'; form.querySelector('input[name=name]').focus(); return; }
      if (digits(ph).length < 11) { err.textContent = 'Telefon raqamini to‘liq kiriting: +998 90 123 45 67'; phone.setAttribute('aria-invalid', 'true'); phone.focus(); return; }

      btn.disabled = true; btn.textContent = 'Yuborilmoqda…';
      const when = fd.when || 'Hozir';
      const data = {
        name, phone: ph, business: '', plan: '', website: '',
        page: location.href.split('#')[0],
        utm: [`Sayt: ${CFG.site}`, `Qulay vaqt: ${when}`, utm].filter(Boolean).join(' · ')
      };
      const saved = await saveLead(data);
      btn.disabled = false; btn.textContent = btnText;

      card.querySelector('.done-name').textContent = name.split(' ')[0];
      const tg = card.querySelector('.done-tg');
      if (saved) {
        trackLead();
        card.querySelector('.done-msg').textContent = when === 'Hozir'
          ? 'Menejer 15 daqiqa ichida qo‘ng‘iroq qiladi (ish vaqtida 9:00–21:00).'
          : `Menejer siz tanlagan vaqtda qo‘ng‘iroq qiladi: ${when.toLowerCase()}.`;
        tg.href = tgLink('Assalomu alaykum! Saytda raqamimni qoldirdim, AI Strateg bo‘yicha maslahat olmoqchiman.');
        tg.textContent = 'Kutmasdan Telegram’da yozish';
      } else {
        // the sheet did not confirm — make sure the manager still gets the contact
        card.querySelector('.done-msg').textContent = 'Arizani yakunlash uchun pastdagi tugmani bosing va Telegram’da xabarni yuboring.';
        tg.href = tgLink(`Assalomu alaykum! AI Strateg bo‘yicha maslahat olmoqchiman.\nIsm: ${name}\nTelefon: ${ph}\nQulay vaqt: ${when}`);
        tg.textContent = 'Telegram’da yuborish';
        tg.classList.remove('btn-ghost');
      }
      card.classList.add('is-done');
      card.scrollIntoView({behavior: 'smooth', block: 'center'});
    });
  });

  /* ---------- scroll-to-form links + sticky CTA ---------- */
  const firstForm = document.querySelector('[data-lead-form]');
  document.querySelectorAll('[data-to-form]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href')) || firstForm;
    target.scrollIntoView({behavior: 'smooth', block: 'center'});
    setTimeout(() => { const i = target.querySelector('input[name=name]'); if (i) i.focus({preventScroll: true}); }, 500);
  }));
  const sticky = document.querySelector('.sticky');
  if (sticky && 'IntersectionObserver' in window) {
    const forms = [...document.querySelectorAll('[data-lead-form]')];
    const seen = new Set();
    let pastHero = false;
    const io = new IntersectionObserver((es) => {
      es.forEach((x) => { if (x.isIntersecting) seen.add(x.target); else seen.delete(x.target); });
      sticky.classList.toggle('show', pastHero && seen.size === 0);
    });
    forms.forEach((f) => io.observe(f));
    addEventListener('scroll', () => { pastHero = scrollY > innerHeight * 0.6; sticky.classList.toggle('show', pastHero && seen.size === 0); }, {passive: true});
  }

  /* ---------- VSL player: CTA appears at the offer minute ---------- */
  const player = document.querySelector('[data-vsl]');
  if (player) {
    const cta = document.querySelector('.vsl-cta');
    const src = player.dataset.src || '';
    const revealAt = +player.dataset.revealAt || 0;
    const reveal = () => cta && cta.classList.remove('wait');
    if (!src) return;                                            // video not uploaded yet: the form right below is the CTA
    const yt = src.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    player.querySelector('.soon')?.remove(); player.querySelector('.poster')?.remove();
    if (yt) {
      const f = document.createElement('iframe');
      f.src = `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
      f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true; f.title = 'AI Strateg';
      player.appendChild(f);
      setTimeout(reveal, revealAt * 1000);                        // YouTube: approximate by time on page
    } else {
      const v = document.createElement('video');
      Object.assign(v, {src, muted: true, autoplay: true, playsInline: true, controls: true, preload: 'metadata'});
      v.setAttribute('playsinline', '');
      player.appendChild(v);
      const um = document.createElement('button'); um.className = 'unmute'; um.type = 'button'; um.textContent = '🔊 Ovozni yoqish';
      um.onclick = () => { v.muted = false; v.currentTime = 0; v.play(); um.remove(); };
      player.appendChild(um);
      v.addEventListener('timeupdate', () => { if (v.currentTime >= revealAt) reveal(); });
      v.addEventListener('ended', reveal);
    }
    setTimeout(reveal, (revealAt + 120) * 1000);                // safety net
  }
})();
