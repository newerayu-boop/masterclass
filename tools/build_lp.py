import os
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dist')
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
<p class="fine">Bepul va majburiyatsiz. Ma’lumotlaringiz faqat bog‘lanish uchun.</p>
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


AV='<img class="av" src="../lp/img/author-smile.webp" alt="" width="40" height="40" loading="lazy">'

HK='https://honor-keys.vercel.app/'
ST=[('tx-aliyor','Texno Grand','Maishiy texnika · 28 do‘kon','Jamoa · 4 kishi','$30 000+ / yil','20+ AI tizim, dasturchisiz','texnogrand.html'),
('mirodil','Loyalty ELD','AQSh yuk mashinalari uchun ELD','Jamoa · 3 kishi','500 → 700+','truck · 18 kunda','loyalty.html'),
('jamshid','VisaPro · Jamshid','Yevropaga ishchi viza','Yakka','1 soat → 10 s','arizaga birinchi javob','jamshid.html'),
('abdurahmon','Honor Furniture · Abdurahmon','Mebel savdosi va o‘z zavodi','Yakka','$19 000 / yil','tejaldi: 7 Excel → 1 baza','honor.html'),
('sevara','Finway · Sevara','Buxgalteriya autsorsingi · 200 firma','Yakka','$4–5k / oy','tejaldi · 2 haftada ofis AI nazoratida','sevara.html'),
('bobir','Trinity Construction · Bobir','Turar-joy majmuasi · 6 blok','Yakka','4 → 1 soat','kunlik ish · butun biznes bitta pultda','bobir.html'),
('abdulaziz','ALSAGE PHARM','BAD va vitamin ishlab chiqarish','Jamoa · 3 kishi','15 → 4 soat','haftalik qo‘lda boshqaruv','alsage.html'),
('bilol','METIKS × MetallStal','Metall savdosi va lazer sexi','Jamoa · 2 kishi','6× taklif','bitta sotuvchi ulguradi · chek +25%','metall.html'),
('munira','Carbonado · Munira','Kelinlik saloni · 10 yil','Yakka','$3 500 / oy','tejaldi · 334k ko‘rish bir sutkada','munira.html'),
('asilbek','Grand Mumtoz · Asilbek','Oilaviy mehmonxona · 48 xona','Yakka · 15 yosh','6 → 1 soat','direktorning kunlik qo‘l ishi','asilbek.html'),
('fayzullaxon','Kamol Digital · Fayzullaxon','Onlayn kurslar va zapusklar','Yakka','10% → 20%','sifatli liddan sotuv','fayzullaxon.html'),
('ulugbek','Vaqt AI · Ulug‘bek','Rejalashtiruvchi ilova','Yakka','2 oy → 2 hafta','ilovani o‘zi chiqardi','vaqt.html')]
def st_cards():
    out=[]
    for img,n,ind,tag,m,ml,href in ST:
        out.append(f'<a class="sc" href="{HK}{href}" target="_blank" rel="noopener"><div class="sc-top"><img src="../lp/st/{img}.webp" alt="" width="56" height="56" loading="lazy"><div><b>{n}</b><small>{ind}</small></div></div><div class="sc-m">{m}</div><div class="sc-ml">{ml}</div><div class="sc-f"><span>{tag}</span><em>Keysni ochish ↗</em></div></a>')
    return '<div class="scs">'+''.join(out)+'</div><p class="swipe sw-m">← surib ko‘ring: 12 ta keys →</p>'

CASES_SEC=f"""<section class="sec" id="cases"><div class="wrap">
<div class="sh"><div class="eb">2 oqim · 120+ o‘quvchi</div>
<h2>Ular ham shubha qilgan edi. <span class="g">Mana natijalar</span></h2></div>
<div class="bigstat"><b>$170 000+</b><p>shuncha turardi o‘quvchilar AI bilan o‘zlari qurgan tizimlar, agar dasturchiga buyurtma qilinsa</p></div>
{st_cards()}
<div class="cases-more"><a class="btn btn-ghost btn-inline" href="{HK}" target="_blank" rel="noopener">Barcha 25+ keysni batafsil ko‘rish ↗</a><p>Har bir keysda: nima qurildi, qancha vaqt ketdi, qanday natija. Summalar o‘quvchilar iltimosiga ko‘ra maxfiylik uchun o‘zgartirilgan.</p></div>
</div></section>"""

def obj(n, q, title, body, extra=''):
    return f"""<article class="obj">
<div class="obj-q"><span class="qn">{n}</span><p>{q}</p></div>
<div class="obj-a"><div class="who-s">{AV}<span>Yusufbay Kodirov</span></div><h3>{title}</h3>{body}{extra}</div>
</article>"""

ROI="""<div class="roi"><div class="roi-h">O‘quvchilar amaliyotidan · potensial hisob</div>
<div class="roi-r"><span>Dizayner va vizual kontent</span><b>~$500/oy</b></div>
<div class="roi-r"><span>Direct va yo‘qolgan tungi lidlar</span><b>~$500/oy</b></div>
<div class="roi-r"><span>Kopirayting va hisobotlar (frilanser)</span><b>~$300–500/oy</b></div>
<div class="roi-r"><span>Har yangi g‘oya yoki MVP, podryadchiksiz</span><b>$1 000+</b></div>
<div class="roi-r"><span>Sizning vaqtingiz (rutina)</span><b>40+ soat/hafta</b></div>
<div class="roi-t"><span>Jami tejash potensiali</span><b>$2 000+/oy</b></div></div>"""

TOOLS='<div class="chips"><span>ChatGPT</span><span>Claude</span><span>Gemini</span><span>NotebookLM</span><span>Claude Code</span><span>HeyGen</span></div>'
INDUSTRIES='<div class="chips"><span>BAD ishlab chiqarish</span><span>Qurilish</span><span>28 do‘konli savdo</span><span>Metall savdosi</span><span>Distribyutsiya</span><span>Logistika</span><span>Mehmonxona</span><span>Kelinlik saloni</span><span>Buxgalteriya</span><span>Onlayn kurslar</span></div>'

OBJ_SEC=f"""<section class="sec sec-alt" id="objections"><div class="wrap">
<div class="sh"><div class="eb">Shubhalar va javoblar</div>
<h2>Sizni nima to‘xtatyapti? <span class="g">Halol javob beraman</span></h2>
<p class="lead">Kurs arzon emas. Shuning uchun qaror qilishdan oldin har bir shubhangizga aniq javob olishingiz kerak.</p></div>
<div class="objs">
{obj('01','«Men dasturchi emasman. Texnik narsalarni tushunmayman.»','Bunga hojat yo‘q.','<p>120+ o‘quvchimizning aksariyati zavod, do‘kon va xizmat biznesi egalari. Texno Grand jamoasi dasturchisiz 20+ AI tizim qurdi. Eng yosh o‘quvchimiz 15 yoshda oilaviy mehmonxonani AI bilan boshqaryapti. Kod yozmaysiz: har qadam ekranda ko‘rsatiladi, tushunmagan joyni payshanba kuni kurator bilan Zoom’da hal qilasiz.</p>',TOOLS)}
{obj('02','«Vaqtim yo‘q. Biznesni tashlab o‘qiy olmayman.»','Kurs vaqtni olish uchun emas, qaytarish uchun.','<p>Haftasiga 2 ta jonli dars va amaliy vazifa. Darslar yozib olinadi va sizda abadiy qoladi: o‘tkazib yuborsangiz, keyin ko‘rasiz. Kurs oxirida rutina AI-agentlarga o‘tadi: o‘quvchilar haftasiga 40 soatgacha vaqt bo‘shatadi.</p>')}
{obj('03','«Qimmat. Shuncha pulga arziydimi?»','Keling, hisoblaymiz.','<p>O‘quvchilar qurgan tizimlar dasturchiga buyurtma qilinsa $170 000+ turardi. Texno Grand yiliga $30 000+ tejaydi, Honor Furniture $19 000. AI-agentlar ish haqi so‘ramaydi va 24/7 ishlaydi. Oddiy hisob: kurs shu tejash bilan 1–2 oyda o‘zini qoplaydi. Aniq narx formatga bog‘liq. Diagnostikada avval sizning raqamlaringiz bilan foydani hisoblaymiz, keyin narx haqida gaplashamiz.</p>',ROI)}
{obj('04','«YouTube’da hammasi bepul bor-ku.»','Ma’lumot bor. Tizim yo‘q.','<p>YouTube «qanday qilish»ni ko‘rsatadi. Bu yerda esa 6 hafta ichida o‘z biznesingiz ma’lumotlari ustida tayyor tizim qurasiz: bilim bazasi, 5 agent, dashboard, Jarvis, ilova va strategiya. Mentor strategiyangizni tekshiradi, siz uni himoya qilasiz.</p><p class="quote">«Qanday qilishni» emas, «nima qilishni» bilish muhimroq. Vositalar o‘zgaradi, to‘g‘ri qaror esa qoladi.</p>')}
{obj('05','«Mening biznesim boshqacha. Bizda bu ishlamaydi.»','Natijalar turli sohalardan.','<p>Birinchi haftada aynan o‘z biznesingiz uchun AI bilim bazasini yaratasiz: narxlar, mijozlar, jarayonlar. Keyingi hamma narsa shu asosda quriladi, shuning uchun tizim sizning biznesingizga moslashadi, aksincha emas.</p>',INDUSTRIES)}
{obj('06','«Boshlayman-u, o‘rtada tashlab qo‘yaman.»','Buning uchun tizim bor.','<ul class="ticks"><li>Har hafta qo‘lingizda qoladigan aniq natija bilan yopiladi</li><li>Bootcamp: kurator bilan qolib ketgan vazifalarni yakunlaysiz</li><li>Yopiq chat va har payshanba kurator-zoom</li><li>6-haftada strategiyangizni himoya qilasiz: bu sizni oxirigacha olib boradi</li></ul>')}
{obj('07','«Buni xodimlarimga topshirsam bo‘lmaydimi?»','Avval siz tushunishingiz kerak.','<p>Qaysi jarayon AI’ga o‘tadi, qaysi biri yo‘q: buni rahbar hal qiladi. Shuning uchun AI — Team formati bor: siz va 2 ta boshqaruvchingiz birga o‘qiysiz. Tizim bitta odamda emas, jamoada qoladi.</p><p class="quote">«Yaxshiyamki, jamoa bilan kelganmiz!» O‘quvchilardan eng ko‘p eshitgan gapimiz.</p>')}
{obj('08','«AI bu moda. Bir yildan keyin unutiladi.»','AI sizni ishsiz qoldirmaydi.','<p><b class="w">Bugun AI’ni joriy qilgan raqobatchi qoldiradi.</b> Loyalty ELD 18 kunda 500 dan 700+ truckka o‘sdi. VisaPro arizaga javobni 1 soatdan 10 soniyaga tushirdi. Bu moda emas, bu raqamlar.</p>')}
</div>
<div class="cta-band"><p>Javob topmagan savolingiz bormi? Diagnostikada shaxsan javob beramiz.</p><a class="btn btn-inline" href="#final" data-to-form>Bepul diagnostikaga yozilish</a></div>
</div></section>"""

WEEKS=[('0','Tayyorgarlik','Ish muhiti va 500+ tayyor prompt'),
('1','Bilim bazasi','Biznesingiz ma’lumotlari AI uchun tartiblangan'),
('2','5 ta AI-agent','Sotuv, kontent, hisobot: takroriy ishni bajaradi'),
('3','Jonli dashboard','Muhim raqamlar bitta panelda'),
('B','Bootcamp','Kurator bilan barcha vazifalarni yakunlaysiz'),
('4','Shaxsiy Jarvis','Kompyuteringizda vazifalarni o‘zi bajaradi'),
('5','O‘z ilovangiz','Ilova va AI joriy etish rejasi'),
('6','Strategiya himoyasi','Mentor bilan himoya qilingan AI strategiya')]
def weeks():
    out=[]
    for n,t,r in WEEKS:
        lbl='Bootcamp' if n=='B' else f'{n}-hafta'
        out.append(f'<li><b>{"★" if n=="B" else n}</b><div><small>{lbl}</small><h3>{t}</h3><p>{r}</p></div></li>')
    return '<ol class="tl">'+''.join(out)+'</ol>'

PROGRAM_SEC=f"""<section class="sec" id="program"><div class="wrap prog">
<div><div class="sh"><div class="eb">Dastur · 6 hafta</div>
<h2>Har hafta: <span class="g">biznesingiz uchun tayyor vosita</span></h2>
<p class="lead">12 jonli dars, tayyorlov kursi va bootcamp. Nazariya emas: har bosqich oxirida qo‘lingizda ishlab turgan natija qoladi.</p></div>
{weeks()}
<div class="cta-row"><a class="btn btn-inline" href="#final" data-to-form>Dasturga mosligimni bilish</a></div></div>
<div class="prog-vis">
<figure><img src="../lp/img/week-3.webp" alt="Jonli boshqaruv paneli" width="800" height="484" loading="lazy"><figcaption>3-hafta: jonli dashboard</figcaption></figure>
<figure><img src="../lp/img/week-2.webp" alt="AI sotuv agenti" width="800" height="603" loading="lazy"><figcaption>2-hafta: AI sotuv agenti</figcaption></figure>
</div>
</div></section>"""

INSIDE_SEC="""<section class="sec sec-alt"><div class="wrap">
<div class="sh"><div class="eb">Kurs ichida</div>
<h2>Siz nimaga <span class="g">ega bo‘lasiz</span></h2></div>
<div class="inside">
<div><b>12</b><h3>Jonli dars + yozuvi</h3><p>Yozuvlar sizda abadiy qoladi</p></div>
<div><b>500+</b><h3>Prompt kutubxonasi</h3><p>Biznes vazifalari uchun tayyor promptlar</p></div>
<div><b>5</b><h3>Agent va dashboard shablonlari</h3><p>Noldan emas, tayyor asosdan quriladi</p></div>
<div><b>24/7</b><h3>Yopiq chat va kurator</h3><p>Har payshanba kurator-zoom</p></div>
<div><b>6 oy</b><h3>Vositalar yangilanishi</h3><p>AI o‘zgarsa, materiallar ham yangilanadi</p></div>
<div><b>20</b><h3>Ishtirokchi oqimda</h3><p>3-oqim 2-noyabrda boshlanadi</p></div>
</div>
<div class="formats">
<div><small>Format 01</small><h3>AI — Strateg</h3><p>O‘zi kirib, biznesiga AI joriy qilmoqchi bo‘lgan rahbar uchun. 1 kishi.</p></div>
<div class="rec"><small>Format 02 · tavsiya</small><h3>AI — Team</h3><p>Siz + 2 boshqaruvchingiz. Strategik sessiya, tizimni birgalikda qurish, alohida kurator va 2 ta guruhiy razbor.</p></div>
</div>
<p class="note">Narx formatga bog‘liq va diagnostikada aytiladi.</p>
</div></section>"""

AUTHOR_SEC="""<section class="sec"><div class="wrap author">
<div class="aph"><picture><source srcset="../lp/img/author.webp" type="image/webp"><img src="../lp/img/author.jpg" alt="Yusufbay Kodirov" width="900" height="1350" loading="lazy"></picture></div>
<div><div class="eb">Muallif</div>
<h2>Yusufbay Kodirov</h2>
<p class="lead">AI Strateg mentorligi muallifi. Tadbirkorlarga AI’ni «qiziq texnologiya» emas, pul tejaydigan va pul olib keladigan ish quroliga aylantirishni o‘rgataman.</p>
<p class="lead">Mening vazifam sizni dasturchi qilish emas. Vazifam: 6 haftadan keyin siz biznesingizni ijrochi sifatida emas, strateg sifatida boshqarishingiz.</p>
<a class="ig" href="https://instagram.com/kodiyusufbay" target="_blank" rel="noopener">@kodiyusufbay</a>
</div></div></section>"""

def final(fid):
    return f"""<section class="sec final" id="final"><div class="wrap final-grid">
<div><div class="eb">Birinchi qadam</div>
<h2>Hali ikkilanyapsizmi? <span class="g">Bu normal.</span></h2>
<p class="lead">Katta qaror shunaqa bo‘ladi. Shuning uchun birinchi qadam sotib olish emas. Birinchi qadam: bepul diagnostika.</p>
<ol class="steps">
<li><b>1</b><div><h3>30 daqiqa faqat sizning biznesingiz haqida</h3></div></li>
<li><b>2</b><div><h3>AI qayerda birinchi pulni berishini aniq ko‘rsatamiz</h3></div></li>
<li><b>3</b><div><h3>Sizga qaysi format mos, yoki umuman mos emasligini halol aytamiz</h3></div></li>
</ol>
<div class="start"><div class="seats">3-oqim 2-noyabrda boshlanadi · faqat 20 o‘rin</div><div class="cd" data-countdown="2026-11-02T00:00:00+05:00"><span><b data-d>--</b>kun</span><span><b data-h>--</b>soat</span><span><b data-m>--</b>daqiqa</span><span><b data-s>--</b>soniya</span></div></div></div>
{form(fid,'Bepul diagnostikaga yoziling','Menejer 15 daqiqa ichida qo‘ng‘iroq qiladi.','Diagnostikaga yozilish')}
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
<link rel="stylesheet" href="../lp/lp.css?v=5">
<script>window.LP_CONFIG = {{ site: '{site}' }};</script>
</head>
<body>
<header class="top"><div class="wrap"><a class="logo" href="#">AI Strateg <span>3.0</span></a><nav class="tnav"><a class="tg-link" href="https://t.me/Yusufbaymanager" target="_blank" rel="noopener" aria-label="Telegram">{TG_SVG}<span>Telegram</span></a><a class="top-cta" href="#final" data-to-form>Bepul diagnostika</a></nav></div></header>
'''
TAIL='''<footer class="foot">© AI Strateg · Yusufbay Kodirov · <a href="https://t.me/Yusufbaymanager" target="_blank" rel="noopener">@Yusufbaymanager</a></footer>
<div class="sticky"><a class="btn" href="#final" data-to-form>Bepul diagnostikaga yozilish</a></div>
<script src="../lp/lp.js?v=5" defer></script>
</body>
</html>
'''

HERO_VIS="""<div class="hero-vis" aria-hidden="true">
<picture><source srcset="../lp/img/author-smile.webp" type="image/webp"><img src="../lp/img/author-smile.jpg" alt="" width="900" height="1350" fetchpriority="high"></picture>
<div class="chip c1"><i class="dot"></i><div><b>Jarvis</b><small>Kunlik hisobot tayyor</small></div></div>
<div class="chip c2"><div><b>5 ta AI-agent</b><small>ishlayapti · 24/7</small></div></div>
<div class="chip c3"><div><b class="g">$30 000+</b><small>yiliga tejaladi · Texno Grand</small></div></div>
</div>"""
TRUST="""<div class="trust"><div><b>120+</b><small>o‘quvchi, 2 oqim</small></div><div><b>$170k+</b><small>qurilgan tizimlar qiymati</small></div><div><b>2-noyabr</b><small>3-oqim starti</small></div></div>"""

def opts(name, items, default):
    return ''.join(f'<label><input type="radio" name="{name}" value="{v}"{" checked" if v==default else ""}><b>{t}</b></label>' for v,t in items)
CALC_SEC=f"""<section class="sec sec-alt" id="calc"><div class="wrap calc-grid">
<div><div class="sh"><div class="eb">Hisoblab ko‘ring</div>
<h2>AI’siz biznesingiz <span class="g">har oy qancha yo‘qotyapti?</span></h2>
<p class="lead">3 ta savol, 20 soniya. Bu taxminiy hisob: aniq raqamni diagnostikada sizning ma’lumotlaringiz bilan chiqaramiz.</p></div>
<div class="vs">
<div class="vs-old"><small>Eski usul</small><ul><li>Rutinaga botgan, har bir qadam uchun kadr kutadi</li><li>Oylik to‘laydi, hisobotlarni haftalab kutadi</li></ul></div>
<div class="vs-new"><small>Strateg</small><ul><li>AI-xodimlarni boshqaradi, ularning operatsion xarajati deyarli nol</li><li>Hamma raqamlar jonli boshqaruv panelida</li></ul></div>
</div></div>
<div class="calc" data-calc>
<fieldset><legend>Rutina bilan band xodimlar soni</legend><div class="opts">{opts('emp',[('2','1–3'),('7','4–10'),('20','11–30'),('40','30+')],'7')}</div></fieldset>
<fieldset><legend>Bir xodimning o‘rtacha oyligi</legend><div class="opts">{opts('sal',[('300','$300'),('500','$500'),('800','$800'),('1200','$1 200+')],'500')}</div></fieldset>
<fieldset><legend>Ish vaqtining qancha qismi rutinaga ketadi?</legend><p class="hint">Hisobot, bir xil savollarga javob, jadval, qo‘lda hisob</p><div class="opts">{opts('share',[('20','20%'),('30','30%'),('45','40%+')],'30')}</div></fieldset>
<div class="calc-res"><small>AI’ga o‘tkazsa bo‘ladigan xarajat</small><div class="cr-y">≈ <b data-cy>$6 300</b> / yil</div><p>Oyiga ≈ <b data-cm>$525</b> · haftasiga ≈ <b data-ch>42</b> soat bo‘shaydi</p></div>
<a class="btn" href="#final" data-to-form>Shu hisobni diagnostikada aniqlashtirish</a>
<p class="fine">Formula: xodimlar × oylik × rutina ulushi × 50% (AI’ga o‘tadigan qism) × 12 oy. Taxminiy.</p>
</div>
</div></section>"""

PROOF="""<div class="proof"><div class="avs"><img src="../lp/st/tx-aliyor.webp" alt="" width="36" height="36"><img src="../lp/st/sevara.webp" alt="" width="36" height="36"><img src="../lp/st/mirodil.webp" alt="" width="36" height="36"><img src="../lp/st/munira.webp" alt="" width="36" height="36"><img src="../lp/st/bobir.webp" alt="" width="36" height="36"></div><p><b>120+ tadbirkor</b> 2 oqimda o‘qidi va o‘z biznesida AI-tizim qurdi</p></div>"""
BODY=f"""{CALC_SEC}
{CASES_SEC}
{OBJ_SEC}
{PROGRAM_SEC}
{INSIDE_SEC}
{AUTHOR_SEC}
{final('form-final')}"""

# ---------- Site A: /lead ----------
lead=head('AI Strateg 3.0: bepul diagnostika','6 haftada biznesingizda ishlaydigan AI-tizim. Bepul diagnostikada AI qayerda pul berishini hisoblaymiz.','lead')+f"""<main>
<section class="hero"><div class="wrap hero-grid">
<div class="hero-copy">
<span class="badge"><i></i> 3-oqim · 2-noyabr start · 20 o‘rin</span>
<h1>6 haftada biznesingizda <span class="g">AI-otdel ishlaydi</span></h1>
<p class="sub">Bitta xodim oyligidan kam xarajat bilan: 5 ta AI-agent, jonli dashboard va shaxsiy Jarvis. Dasturchisiz: rutinani AI’ga berasiz, o‘zingiz strateg bo‘lasiz.</p>
<div class="who"><img src="../lp/img/author-smile.webp" alt="" width="48" height="48"><div><b>Yusufbay Kodirov</b><small>AI Strateg mentorligi muallifi</small></div></div>
</div>
<div class="hero-form">
{form('form-hero','Bepul diagnostika, 30 daqiqa','AI biznesingizda qayerda pul berishini hisoblaymiz.','Diagnostikaga yozilish')}
{PROOF}
<a class="more" href="#objections">Avval savollarimga javob olaman ↓</a>
</div>
<div class="hero-side">{HERO_VIS}</div>
<div class="hero-trust">{TRUST}</div>
</div></section>
{BODY}
</main>
"""+TAIL
open(f'{ROOT}/lead/index.html','w').write(lead)

# ---------- Site B: /vsl ----------
VIDEO_SRC=''      # mp4 path (e.g. ../lp/vsl.mp4) or a YouTube link; set when the video is ready
REVEAL_AT=240     # seconds: when the offer is named in the video, the button appears
vsl=head('AI Strateg 3.0: videoni ko‘ring','Qisqa video: AI biznesingizda qanday ishlaydi. Keyin bepul diagnostika.','vsl')+f"""<main>
<section class="hero hero-vsl"><div class="wrap">
<div class="vsl-head">
<span class="badge"><i></i> Videoni oxirigacha ko‘ring</span>
<h1>Qanday qilib tadbirkorlar AI bilan <span class="g">yiliga $7 000–30 000</span> tejayapti</h1>
<p class="sub">Dasturchisiz, 6 haftada. Videoda aniq tizim va real o‘quvchilar natijalari.</p>
</div>
<div class="player" data-vsl data-src="{VIDEO_SRC}" data-reveal-at="{REVEAL_AT}">
<picture><source srcset="../lp/img/author-2.webp" type="image/webp"><img class="poster" src="../lp/img/author-2.jpg" alt="" width="900" height="1350"></picture>
<div class="soon"><i>▶</i><b>Video tez orada</b><small>Hozircha diagnostikaga yozilishingiz mumkin</small></div>
</div>
<div class="vsl-cta wait"><a class="btn" href="#form-hero" data-to-form>Bepul diagnostikaga yozilish</a><p class="fine">Menejer 15 daqiqada qo‘ng‘iroq qiladi</p></div>
<div class="vsl-form">
<div class="vsl-form-copy"><h2>Videodan keyin: <span class="g">bepul diagnostika</span></h2><p class="lead">30 daqiqada biznesingizda AI qayerda birinchi pulni berishini hisoblaymiz. Mos kelmasa, halol aytamiz.</p>{TRUST}</div>
<div>{form('form-hero','Bepul diagnostika, 30 daqiqa','2 ta maydon, 20 soniya.','Diagnostikaga yozilish')}{PROOF}</div>
</div>
</div></section>
{BODY}
</main>
"""+TAIL
open(f'{ROOT}/vsl/index.html','w').write(vsl)
print('ok')
