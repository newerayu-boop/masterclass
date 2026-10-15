import os
ROOT='/home/user/masterclass/dist'
TG_SVG='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3 18.8 19c-.2 1-.8 1.3-1.7.8l-4.6-3.4-2.2 2.1c-.2.2-.5.4-1 .4l.3-4.7 8.6-7.8c.4-.3-.1-.5-.6-.2L6.9 12.9 2.4 11.5c-1-.3-1-1 .2-1.5L20.6 3c.8-.3 1.6.2 1.3 1.3z"/></svg>'

def form(fid, title, sub, btn):
    return f'''<div class="form-card" id="{fid}" data-lead-form>
<h3>{title}</h3>
<p class="fc-sub">{sub}</p>
<form class="lf" novalidate>
<label>Ismingiz<input name="name" autocomplete="given-name" placeholder="Masalan, Aziz" required></label>
<label>Telefon raqamingiz<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+998 90 123 45 67" required></label>
<div class="times" role="radiogroup" aria-label="Qachon qo‘ng‘iroq qilish qulay"><span>Qachon qo‘ng‘iroq qilish qulay?</span>
<label><input type="radio" name="when" value="Hozir" checked><b>Hozir</b></label>
<label><input type="radio" name="when" value="Bugun kechqurun"><b>Bugun kechqurun</b></label>
<label><input type="radio" name="when" value="Ertaga"><b>Ertaga</b></label></div>
<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
<p class="err" role="alert" aria-live="polite"></p>
<button class="btn" type="submit">{btn}</button>
<p class="fine">Bepul. Spam yo‘q, faqat bitta qo‘ng‘iroq.</p>
</form>
<div class="done" aria-live="polite"><div class="ok">✓</div><h3>Rahmat, <span class="done-name"></span>!</h3><p class="done-msg"></p><a class="btn btn-ghost done-tg" href="#" target="_blank" rel="noopener"></a></div>
</div>'''

CASES=[('feruz','Sanoat filtratsiyasi','$10 000','dasturiga taklif qilishdi','CRM ishonasizmi — men ikki kun uxlamasdan yozdim. Telefon ishladi.','Feruz Ximmatov','Phoenix Prime · zavod rahbari'),
('aliyor','Maishiy texnika · 28 do‘kon','$30 000+','yiliga tejaladi','Hisobotni operatordan 2 soat kutardik. Endi telefonda 30 soniyada ochaman.','Texno Grand','Aliyor Djurabayev va jamoasi'),
('mirodil','Logistika · 700+ truck','$23 900+','yiliga qo‘shimcha daromad','700 truck chatini o‘qib bo‘lmasdi. Endi kimga qo‘ng‘iroq qilishni panel aytadi.','Loyalty ELD','Mirodil Mirsadikov va jamoasi'),
('abdurahmon','Mebel · 150 usta','$19 000+','yiliga tejaladi','AI’ni faqat savol-javobga ishlatardim — bunchalik ko‘p funksiyasi borligini bilmasdim.','Abdurahmon','Honor Furniture · zavod egasi'),
('sanat','Kiyim va mebel · 31 xodim','$7 000+','yiliga tejaladi','Endi qog‘oz yo‘q: HR kuniga 8 soat emas, 1 soat ishlaydi.','AZALY','Sanat Ismailov va jamoasi'),
('jamshid','Yevropaga ishga joylash','+$4 000','oylik aylanmaga','Endi mijoz hammasini botda o‘zi ko‘radi, javob 10 soniyada.','VisaPro','Jamshid Norqulov · asoschi')]
def cases():
    out=[]
    for img,f,m,ml,q,n,r in CASES:
        out.append(f'<article class="case"><picture><source srcset="../cases/{img}.webp" type="image/webp"><img src="../cases/{img}.jpg" alt="{n}" width="640" height="512" loading="lazy" decoding="async"></picture><div class="cb"><small>{f}</small><div class="m">{m}<em>{ml}</em></div><q>{q}</q><div class="nm">{n}<span>{r}</span></div></div></article>')
    return '<div class="cases" tabindex="0" aria-label="O‘quvchilar natijalari">'+''.join(out)+'</div><p class="swipe">← surib ko‘ring →</p>'

CASES_SEC=f"""<section class="sec" id="cases"><div class="wrap">
<div class="sh"><div class="eb">Natijalar</div>
<h2>Ular ham <span class="g">«AI bizga to‘g‘ri kelmaydi»</span> deb o‘ylagan edi</h2>
<p class="lead">Oddiy tadbirkorlar, dasturchi emas. 6 hafta ichida o‘z bizneslarida AI-tizim qurishdi.</p></div>
{cases()}
<div class="cta-row"><a class="btn btn-inline" href="#final" data-to-form>Men ham shunday natija xohlayman</a></div>
</div></section>"""

PAIN_SEC="""<section class="sec"><div class="wrap">
<div class="sh"><div class="eb">Tanish holatmi?</div>
<h2>Biznes o‘sadi, lekin <span class="g">hammasi sizning ustingizda</span></h2></div>
<div class="pains">
<div class="pain"><b>01</b><h3>Hisobotni kunlab kutasiz</h3><p>Raqamlar xodimlardan kelguncha qaror kechikadi, pul esa ketib bo‘ladi.</p></div>
<div class="pain"><b>02</b><h3>Xodimlar rutina bilan band</h3><p>Bir xil savollarga javob, jadval to‘ldirish, qo‘lda hisob. Oylik esa to‘lanaveradi.</p></div>
<div class="pain"><b>03</b><h3>Mijozlar javobsiz qoladi</h3><p>Kechasi va dam olish kunlari yozganlar raqobatchiga ketadi.</p></div>
<div class="pain"><b>04</b><h3>AI bor, tizim yo‘q</h3><p>ChatGPT’dan savol-javob uchun foydalanasiz, lekin biznesda natija sezilmaydi.</p></div>
</div>
</div></section>"""

OUTS_SEC="""<section class="sec sec-alt"><div class="wrap">
<div class="sh"><div class="eb">Yechim · AI Strateg 3.0</div>
<h2>6 haftada biznesingizda <span class="g">4 ta ishlaydigan natija</span></h2>
<p class="lead">Nazariya emas. Har bosqich oxirida qo‘lingizda ishlab turgan tizim qoladi.</p></div>
<div class="outs">
<div class="out"><div class="ph"><img src="../lp/img/week-2.webp" alt="AI sotuv agenti mijoz bilan yozishmoqda" loading="lazy" width="800" height="603"></div><div class="ot"><small>2-hafta</small><h3>5 ta AI-xodim</h3><p>Sotuv, kontent, hisobot va mijozlar bilan ishlaydigan agentlar. Oyliksiz, 24/7.</p></div></div>
<div class="out"><div class="ph"><img src="../lp/img/week-3.webp" alt="Jonli boshqaruv paneli" loading="lazy" width="800" height="484"></div><div class="ot"><small>3-hafta</small><h3>Jonli boshqaruv paneli</h3><p>Biznes raqamlari bitta ekranda. Hisobot kutish shart emas.</p></div></div>
<div class="out"><div class="ph"><img src="../lp/img/week-4.webp" alt="Shaxsiy Jarvis" loading="lazy" width="800" height="677"></div><div class="ot"><small>4-hafta</small><h3>Shaxsiy «Jarvis»</h3><p>Kompyuteringizda o‘zi ishlaydigan yordamchi, siz uxlaganda ham.</p></div></div>
<div class="out"><div class="ph"><img src="../lp/img/week-6.webp" alt="AI strategiya hujjati" loading="lazy" width="800" height="600"></div><div class="ot"><small>6-hafta</small><h3>Kompaniya uchun AI strategiya</h3><p>Ijrochidan strateggacha: biznesni boshqacha boshqarasiz.</p></div></div>
</div>
</div></section>"""

FIT_SEC="""<section class="sec"><div class="wrap">
<div class="sh"><div class="eb">Kimga mos</div>
<h2>Bu dastur <span class="g">sizga mosmi?</span></h2></div>
<div class="fit">
<div class="yes"><h3>Mos keladi, agar siz:</h3><ul><li>biznes egasi yoki rahbarsiz</li><li>rutina va hisobotlarga vaqtingiz ketayapti</li><li>xodimlarga ko‘p to‘laysiz, natija esa sekin</li><li>dasturchi emassiz, bunga hojat ham yo‘q</li></ul></div>
<div class="no"><h3>Mos kelmaydi, agar siz:</h3><ul><li>«tugmani bossam, pul tushsin» deb kutsangiz</li><li>haftasiga 3–4 soat ham ajrata olmasangiz</li><li>AI’ni faqat qiziqish uchun o‘rganmoqchi bo‘lsangiz</li></ul></div>
</div>
</div></section>"""

AUTHOR_SEC="""<section class="sec sec-alt"><div class="wrap author">
<div class="aph"><picture><source srcset="../lp/img/author.webp" type="image/webp"><img src="../lp/img/author.jpg" alt="Yusufbay Kodirov" width="900" height="1350" loading="lazy"></picture></div>
<div><div class="eb">Muallif</div>
<h2>Yusufbay Kodirov</h2>
<p class="lead">AI Strateg mentorligi muallifi. Tadbirkorlarga AI’ni «qiziq texnologiya» emas, pul tejaydigan va pul olib keladigan ish quroliga aylantirishni o‘rgataman.</p>
<ul class="ticks"><li>43+ o‘quvchi keysi, real biznes raqamlari bilan</li><li>Dasturchisiz: oddiy tilda, amaliyot orqali</li><li>Har hafta qo‘lingizda qoladigan ishlaydigan natija</li></ul>
<div class="cta-row"><a class="btn btn-inline" href="#final" data-to-form>Maslahatga yozilish</a></div>
</div></div></section>"""

FAQ_SEC="""<section class="sec"><div class="wrap narrow">
<div class="sh"><div class="eb">Savollar</div>
<h2>Ko‘p so‘raladigan savollar</h2></div>
<div class="faq">
<details><summary>Men dasturchi emasman. Uddalay olamanmi?</summary><p>Ha. O‘quvchilarimizning aksariyati dasturchi emas, biznes egalari. Hammasi oddiy tilda, qadam-baqadam ko‘rsatiladi.</p></details>
<details><summary>Maslahat haqiqatan bepulmi?</summary><p>Ha, bepul. 30 daqiqada biznesingizda AI qayerda pul tejashini hisoblab beramiz. Hech qanday majburiyat yo‘q.</p></details>
<details><summary>Dastur qancha turadi?</summary><p>Narx formatga bog‘liq: yolg‘iz yoki jamoa bilan. Avval foydani hisoblaymiz, keyin qo‘ng‘iroqda sizga mos formatni aytamiz.</p></details>
<details><summary>Qancha vaqt ajratishim kerak?</summary><p>Haftasiga 3–4 soat: jonli dars va amaliyot. Darslar yozib olinadi, o‘tkazib yuborsangiz ham ko‘rasiz.</p></details>
<details><summary>Natija bo‘lmasa-chi?</summary><p>Har hafta aniq natija bilan yakunlanadi: agentlar, panel, Jarvis. Kurator va yopiq chat har qadamda yordam beradi.</p></details>
</div>
</div></section>"""

def final(fid):
    return f"""<section class="sec final" id="final"><div class="wrap final-grid">
<div><div class="eb">Bepul maslahat · 30 daqiqa</div>
<h2>Biznesingizda AI <span class="g">qancha pul tejashini</span> bilib oling</h2>
<ol class="steps">
<li><b>1</b><div><h3>AI qancha tejashini hisoblaymiz</h3><p>Sizning raqamlaringiz asosida: qaysi xarajat va rutina AI’ga o‘tadi.</p></div></li>
<li><b>2</b><div><h3>Birinchi 3 qadamni aytamiz</h3><p>Darhol natija beradigan jarayondan boshlaysiz.</p></div></li>
<li><b>3</b><div><h3>Mos formatni tanlaymiz</h3><p>Yolg‘iz, jamoa bilan yoki tayyor tizim. Mos kelmasa, halol aytamiz.</p></div></li>
</ol>
<p class="seats">Yangi oqim: faqat 20 o‘rin</p></div>
{form(fid,'Bepul maslahatga yoziling','2 ta maydon, 20 soniya.','Bepul maslahat olish')}
</div></section>"""

def head(title, desc, site):
    return f'''<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0b0b0a">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="https://newerayu-boop.github.io/masterclass/lp/img/author.jpg">
<meta property="og:type" content="website">
<link rel="preload" href="../fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230b0b0a'/%3E%3Cpath d='M14 45 30 15l7 14 5-9 9 25H14Zm12-8h11l-6-11-5 11Z' fill='%23c9a84c'/%3E%3C/svg%3E">
<link rel="stylesheet" href="../lp/lp.css?v=2">
<script>window.LP_CONFIG = {{ site: '{site}' }};</script>
</head>
<body>
<header class="top"><div class="wrap"><a class="logo" href="#">AI Strateg <span>3.0</span></a><nav class="tnav"><a class="tg-link" href="https://t.me/Yusufbaymanager" target="_blank" rel="noopener" aria-label="Telegram">{TG_SVG}<span>Telegram</span></a><a class="top-cta" href="#final" data-to-form>Bepul maslahat</a></nav></div></header>
'''
TAIL='''<footer class="foot">© AI Strateg · Yusufbay Kodirov · <a href="https://t.me/Yusufbaymanager" target="_blank" rel="noopener">@Yusufbaymanager</a></footer>
<div class="sticky"><a class="btn" href="#final" data-to-form>Bepul maslahat olish</a></div>
<script src="../lp/lp.js?v=2" defer></script>
</body>
</html>
'''

HERO_POINTS="""<ul class="hp-list">
<li>Sotuv, hisobot va mijozlar bilan ishni AI-agentlarga topshirasiz</li>
<li>Dasturchisiz: haftasiga 3–4 soat, oddiy tilda</li>
<li>43+ tadbirkor allaqachon natija olgan</li>
</ul>"""
TRUST="""<div class="trust"><div><b>43+</b><small>o‘quvchi keysi</small></div><div><b>$7–30k</b><small>yillik tejash</small></div><div><b>6 hafta</b><small>natijagacha</small></div></div>"""
WHO="""<div class="who"><img src="../lp/img/author-smile.webp" alt="" width="56" height="56"><div><b>Yusufbay Kodirov</b><small>AI Strateg mentorligi muallifi</small></div></div>"""

# ---------- Site A: /lead ----------
lead=head('AI Strateg: bepul maslahat','Biznesingizda AI qancha pul tejashini bilib oling. Raqamingizni qoldiring, menejer 15 daqiqada qo‘ng‘iroq qiladi.','lead')+f"""<main>
<section class="hero"><div class="wrap hero-grid">
<div class="hero-copy">
<span class="badge"><i></i> Bepul maslahat · 30 daqiqa</span>
<h1>6 haftada biznesingizda <span class="g">AI-xodimlar ishlaydi</span>: oyliksiz, 24/7</h1>
<p class="sub">Raqamingizni qoldiring. Menejer 15 daqiqada qo‘ng‘iroq qiladi va biznesingizda AI qancha pul tejashini hisoblab beradi.</p>
</div>
<div class="hero-extra">{HERO_POINTS}{WHO}</div>
<div class="hero-form">
{form('form-hero','Bepul maslahat oling','Biznesingiz uchun AI hisobi, 30 daqiqada.','Bepul maslahat olish')}
</div>
<div class="hero-trust">{TRUST}</div>
</div></section>
{PAIN_SEC}
{OUTS_SEC}
{CASES_SEC}
{AUTHOR_SEC}
{FIT_SEC}
{FAQ_SEC}
{final('form-final')}
</main>
"""+TAIL
open(f'{ROOT}/lead/index.html','w').write(lead)

# ---------- Site B: /vsl ----------
VIDEO_SRC=''      # mp4 path (e.g. ../lp/vsl.mp4) or a YouTube link; set when the video is ready
REVEAL_AT=240     # seconds: when the offer is named in the video, the button appears
vsl=head('AI Strateg: videoni ko‘ring','Qisqa video: AI biznesingizda qanday ishlaydi. Keyin bepul maslahat.','vsl')+f"""<main>
<section class="hero hero-vsl"><div class="wrap">
<div class="vsl-head">
<span class="badge"><i></i> Videoni oxirigacha ko‘ring</span>
<h1>Qanday qilib tadbirkorlar AI bilan <span class="g">yiliga $7 000–30 000</span> tejayapti</h1>
<p class="sub">Dasturchisiz, 6 haftada. Videoda aniq tizim va real o‘quvchilar natijalari.</p>
</div>
<div class="player" data-vsl data-src="{VIDEO_SRC}" data-reveal-at="{REVEAL_AT}">
<picture><source srcset="../lp/img/author-2.webp" type="image/webp"><img class="poster" src="../lp/img/author-2.jpg" alt="" width="900" height="1350"></picture>
<div class="soon"><i>▶</i><b>Video tez orada</b><small>Hozircha maslahatga yozilishingiz mumkin</small></div>
</div>
<div class="vsl-cta wait"><a class="btn" href="#form-hero" data-to-form>Bepul maslahatga yozilish</a><p class="fine">Menejer 15 daqiqada qo‘ng‘iroq qiladi</p></div>
<div class="vsl-form">
<div class="vsl-form-copy"><h2>Videodan keyin: <span class="g">bepul maslahat</span></h2><p class="lead">30 daqiqada biznesingizda AI qancha pul tejashini hisoblab beramiz.</p>{HERO_POINTS}</div>
{form('form-hero','Bepul maslahat oling','2 ta maydon, 20 soniya.','Bepul maslahat olish')}
</div>
{TRUST}
</div></section>
{CASES_SEC}
{OUTS_SEC}
{AUTHOR_SEC}
{FAQ_SEC}
{final('form-final')}
</main>
"""+TAIL
open(f'{ROOT}/vsl/index.html','w').write(vsl)
print('ok')
