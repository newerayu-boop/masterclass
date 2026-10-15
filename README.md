# AI Strateg 3.0

Лендинг программы AI Strateg 3.0 на узбекском языке.

Сайт: https://ai-strateg-ten.vercel.app/

## Структура

- `dist/index.html` — страница, контент и JavaScript.
- `dist/design.css` — оформление и адаптивная вёрстка.
- `dist/motion.css`, `dist/motion.js` — анимации: вращающаяся планета (canvas), живой дашборд в hero, появление блоков при скролле, подсветка карточек.
- `dist/logos/` — логотипы, источники и лицензия.
- `archive/` — снятые со страницы блоки (не публикуются, лежат для возврата).
- `dist/v2/` — второй вариант дизайна (открывается по адресу `/v2/`): вместо роудмэпа — программа курса с анимацией частиц (`program.js`, `program.css`). Первый вариант — `dist/index.html`.
- `integrations/google-sheets-leads.gs` — Apps Script для Google Таблицы: принимает заявки с формы сайта (URL веб-приложения вписывается в `SHEET_ENDPOINT` в `dist/index.html`).
- `vercel.json` — конфигурация публикации статического сайта.
- `.openai/hosting.json` — конфигурация исходного проекта Sites.

## Локальный запуск

Из корня репозитория:

```sh
python3 -m http.server 8000 --directory dist
```

Откройте http://localhost:8000. Сборка и установка зависимостей не требуются.

## Публикация на Vercel

При импорте репозитория выберите Framework Preset: Other. Каталог публикации — `dist`; команда сборки не нужна.

Для публикации через CLI после привязки к нужному проекту Vercel:

```sh
npx vercel deploy --prod
```

## Заявки

Формы основного сайта и лендингов отправляют заявки в Google Таблицу через Apps Script (`integrations/google-sheets-leads.gs`). Подробности, правила работы и открытые задачи: `CLAUDE.md`.

## Лендинги /lead и /vsl

Генерируются скриптом `tools/build_lp.py`, публикуются на GitHub Pages командой `bash tools/publish_pages.sh`: https://newerayu-boop.github.io/masterclass/lead/
