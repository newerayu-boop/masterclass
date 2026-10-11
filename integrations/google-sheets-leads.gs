/**
 * AI Strateg — заявки с сайта → Google Таблица (+ уведомление менеджеру в Telegram).
 *
 * Установка (один раз):
 * 1. Откройте таблицу «AI Strateg — лиды и заявки» → Расширения → Apps Script.
 * 2. Удалите всё в редакторе, вставьте этот файл целиком, нажмите «Сохранить».
 * 3. Настройки проекта (шестерёнка слева) → Часовой пояс: (GMT+05:00) Tashkent.
 * 4. «Начать развертывание» → «Новое развертывание» → тип «Веб-приложение»:
 *      Запуск от имени: «Я»,  Кто имеет доступ: «Все».
 *    Разрешите доступ к таблице, когда Google спросит.
 * 5. Скопируйте «URL веб-приложения» (заканчивается на /exec) и пришлите его.
 *
 * Необязательно — мгновенное уведомление менеджеру в Telegram о каждой заявке:
 * впишите токен бота (от @BotFather) и chat id менеджера ниже, затем
 * «Управление развертываниями» → карандаш → Версия: «Новая версия» → «Развернуть».
 */

const SPREADSHEET_ID = '1QQlx94NvJDw1PsFNOkvSlrVzW5ZiWDI4lNR5q5eqxXY'; // «AI Strateg — лиды и заявки»
const SHEET_NAME = 'Лиды';
const TG_BOT_TOKEN = '';   // например '123456:ABC…' — можно оставить пустым
const TG_CHAT_ID = '';     // chat id менеджера (бот должен получить от него /start)

// Значения формы сайта → значения выпадающего списка «Интерес к тарифу»
const PLAN_MAP = {
  'AI — Strateg': 'AI — Strateg',
  'AI — Team': 'AI — Team',
  'Hali bilmayman': 'Пока не знает'
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.website) return json_({ok: true});          // защита от ботов
    if (!d.name || !d.phone) return json_({ok: false, error: 'name and phone are required'});

    const tz = Session.getScriptTimeZone();
    const now = new Date();
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // только дата — для подсчёта «сегодня»
    const comment = ['Заявка с сайта в ' + Utilities.formatDate(now, tz, 'HH:mm'),
                     d.utm ? 'UTM: ' + d.utm : '',
                     d.page ? 'Страница: ' + d.page : ''].filter(String).join(' · ');

    const row = [
      day,                                   // Дата
      'Заявка',                              // Тип
      safe_(d.name),                         // Имя
      "'" + String(d.phone).slice(0, 40),    // Телефон (как текст)
      '',                                    // Telegram
      safe_(d.business),                     // Сфера бизнеса
      'Сайт',                                // Источник
      PLAN_MAP[d.plan] || 'Пока не знает',   // Интерес к тарифу
      'Новый',                               // Статус
      '',                                    // Менеджер
      '',                                    // Дата диагностики
      '',                                    // Оплачено, $
      comment                                // Комментарий
    ];

    const sheet = leadsSheet_();
    // first empty row by the «Имя» column (the sheet has pre-formatted empty rows)
    const names = sheet.getRange('C2:C').getValues();
    let r = names.findIndex(function (v) { return v[0] === ''; });
    r = r === -1 ? sheet.getLastRow() + 1 : r + 2;
    sheet.getRange(r, 1, 1, row.length).setValues([row]);
    sheet.getRange(r, 1).setNumberFormat('dd.mm.yyyy');

    notify_(d);
    return json_({ok: true});
  } catch (err) {
    return json_({ok: false, error: String(err)});
  } finally {
    lock.releaseLock();
  }
}

// The leads sheet: the «AI Strateg — лиды и заявки» file by its ID (works even if the script
// was created outside the spreadsheet), the tab «Лиды», or else the first tab whose A1 is «Дата».
function leadsSheet_() {
  const book = SpreadsheetApp.openById(SPREADSHEET_ID);
  const byName = book.getSheetByName(SHEET_NAME);
  if (byName) return byName;
  const sheets = book.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (String(sheets[i].getRange('A1').getValue()).trim() === 'Дата') return sheets[i];
  }
  throw new Error('Не найден лист «' + SHEET_NAME + '» в таблице ' + SPREADSHEET_ID);
}

// Открыв URL /exec в браузере, можно проверить, что скрипт работает и видит таблицу.
function doGet() {
  try {
    const sheet = leadsSheet_();
    return json_({ok: true, message: 'AI Strateg leads endpoint is running', sheet: sheet.getName()});
  } catch (err) {
    return json_({ok: false, error: String(err)});
  }
}

function notify_(d) {
  if (!TG_BOT_TOKEN || !TG_CHAT_ID) return;
  const text = '🆕 Новая заявка с сайта\n' +
    'Имя: ' + d.name + '\nТелефон: ' + d.phone +
    '\nСфера: ' + (d.business || '—') + '\nТариф: ' + (d.plan || '—');
  try {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage', {
      method: 'post',
      payload: {chat_id: TG_CHAT_ID, text: text},
      muteHttpExceptions: true
    });
  } catch (e) { /* уведомление не обязательно — заявка уже сохранена */ }
}

// Text from the form must never be read as a formula by Sheets.
function safe_(v) {
  const s = String(v || '').slice(0, 300).trim();
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
