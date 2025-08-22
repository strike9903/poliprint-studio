# Полный аудит интерфейса и работоспособности — Poliprint Studio

_Отчёт сгенерирован 2025-08-20 16:07 (Europe/Kyiv)._
## Итоговая оценка

- Архитектура маршрутов и i18n: **6/10**
- Навигация и информационная архитектура: **5/10**
- Визуальный дизайн и единый стиль: **7/10**
- Доступность (a11y) и SEO: **5/10**
- Производительность и загрузка ассетов: **7/10**

**Общий балл:** **6.0/10** — крепкая база, но есть критичные несоответствия в i18n-маршрутизации и навигации, которые приводят к 404 и «ломают» UX.

---

## Критичные проблемы (блокеры)

1) **Локализация и маршрутизация:** ссылки внутри UI построены без префикса локали (`/catalog/...`, `/configurator` и т.д.), при этом дерево страниц разнесено по `src/app/uk/**` и `src/app/ru/**`. В результате многие переходы ведут на 404.

   - **Что делать быстро:** заменить `next/link` на `next-intl/link` и передавать `locale`, либо вычислять префикс из `useParams()` / `useLocale()` и проставлять его в `href`.

   - **Промежуточно:** добавить редирект `/ → /uk` (см. ниже) и везде формировать ссылки как `/${locale}/...`.

   - **Стратегически:** перейти на структуру `src/app/[locale]/**` (рекомендуемый паттерн для next-intl), чтобы избавиться от дублирования `uk/` и `ru/`.

2) **Компоненты без `"use client"`:** несколько UI‑компонентов и формы используют хуки, но не помечены как клиентские. Это даст ошибки рендеринга при первом использовании:

   - `src/components/ui/chart.tsx`
   - `src/components/ui/sidebar.tsx`
   - `src/components/ui/form.tsx`
   - `src/components/ui/carousel.tsx`
   **Фикс:** добавить в начало файлов строку `"use client"`.

3) **Несуществующие маршруты в меню/футере:** часть пунктов навигации ведёт на страницы, которых нет в `app/` (например: `/templates`, `/blog`, `/help/*`, `/contacts`, `/track`, `/apparel/tshirts`). Это прямые источники 404.
   - **Фикс:** либо скрыть пункты до готовности, либо завести заглушки `page.tsx` с текстом «Скоро» (и `noindex`).

4) **Шрифты для кириллицы:** в `src/app/layout.tsx` шрифты из `next/font/google` подключены только с `subsets: ["latin"]`. Для украинского/русского требуется `"cyrillic"` (и лучше `"latin-ext"`). Параллельно в `globals.css` дублируется `@import` Google Fonts → двойная загрузка и риск FOUT/CLS.
   - **Фикс:** добавить кириллицу в `next/font`, удалить `@import` из CSS.

5) **Тема оформления:** в корневом `layout.tsx` у `<html>` принудительно стоит класс `"dark"`, а провайдер `next-themes` уже управляет темой. Это ломает переключение темы и ведёт к несогласованности стилей.
   - **Фикс:** убрать `className="dark"` у `<html>`, оставить управление теме через `ThemeProvider`.

6) **`lang` у `<html>` всегда `uk`:** из-за статичного корневого `layout.tsx` атрибут языка не меняется под `ru` → минус к SEO и доступности.
   - **Фикс быстро:** получить текущую локаль в корневом layout через `getLocale()` из `next-intl/server` и подставлять её в `<html lang>`.
   - **Фикс правильно:** объединить `uk/` и `ru/` в сегмент `app/[locale]` и задавать `lang` из `params.locale`.


---

## Список ссылок, требующих префикса локали

- `Header.tsx` → `/configurator` → должно быть `/${locale}/configurator` или `<Link locale={locale} href="/configurator">`
- `Header.tsx` → `/catalog` → должно быть `/${locale}/catalog` или `<Link locale={locale} href="/catalog">`
- `Header.tsx` → `/catalog/canvas` → должно быть `/${locale}/catalog/canvas` или `<Link locale={locale} href="/catalog/canvas">`
- `Header.tsx` → `/catalog/acrylic` → должно быть `/${locale}/catalog/acrylic` или `<Link locale={locale} href="/catalog/acrylic">`
- `Header.tsx` → `/catalog/business-cards` → должно быть `/${locale}/catalog/business-cards` или `<Link locale={locale} href="/catalog/business-cards">`
- `Header.tsx` → `/templates` → должно быть `/${locale}/templates` или `<Link locale={locale} href="/templates">`
- `Header.tsx` → `/blog` → должно быть `/${locale}/blog` или `<Link locale={locale} href="/blog">`
- `Footer.tsx` → `/catalog/canvas` → должно быть `/${locale}/catalog/canvas` или `<Link locale={locale} href="/catalog/canvas">`
- `Footer.tsx` → `/catalog/acrylic` → должно быть `/${locale}/catalog/acrylic` или `<Link locale={locale} href="/catalog/acrylic">`
- `Footer.tsx` → `/catalog/business-cards` → должно быть `/${locale}/catalog/business-cards` или `<Link locale={locale} href="/catalog/business-cards">`
- `Footer.tsx` → `/catalog/flyers` → должно быть `/${locale}/catalog/flyers` или `<Link locale={locale} href="/catalog/flyers">`
- `Footer.tsx` → `/catalog/stickers` → должно быть `/${locale}/catalog/stickers` или `<Link locale={locale} href="/catalog/stickers">`
- `Footer.tsx` → `/apparel/tshirts` → должно быть `/${locale}/apparel/tshirts` или `<Link locale={locale} href="/apparel/tshirts">`
- `Footer.tsx` → `/help/tech-requirements` → должно быть `/${locale}/help/tech-requirements` или `<Link locale={locale} href="/help/tech-requirements">`
- `Footer.tsx` → `/help/delivery` → должно быть `/${locale}/help/delivery` или `<Link locale={locale} href="/help/delivery">`
- `Footer.tsx` → `/help/payment` → должно быть `/${locale}/help/payment` или `<Link locale={locale} href="/help/payment">`
- `Footer.tsx` → `/track` → должно быть `/${locale}/track` или `<Link locale={locale} href="/track">`
- `Footer.tsx` → `/help/faq` → должно быть `/${locale}/help/faq` или `<Link locale={locale} href="/help/faq">`
- `Footer.tsx` → `/contacts` → должно быть `/${locale}/contacts` или `<Link locale={locale} href="/contacts">`
- `PopularCategories.tsx` → `/catalog/canvas` → должно быть `/${locale}/catalog/canvas` или `<Link locale={locale} href="/catalog/canvas">`
- `PopularCategories.tsx` → `/catalog/acrylic` → должно быть `/${locale}/catalog/acrylic` или `<Link locale={locale} href="/catalog/acrylic">`
- `PopularCategories.tsx` → `/catalog/business-cards` → должно быть `/${locale}/catalog/business-cards` или `<Link locale={locale} href="/catalog/business-cards">`
- `PopularCategories.tsx` → `/apparel/tshirts` → должно быть `/${locale}/apparel/tshirts` или `<Link locale={locale} href="/apparel/tshirts">`
- `PopularCategories.tsx` → `/catalog/flyers` → должно быть `/${locale}/catalog/flyers` или `<Link locale={locale} href="/catalog/flyers">`
- `PopularCategories.tsx` → `/catalog/packaging` → должно быть `/${locale}/catalog/packaging` или `<Link locale={locale} href="/catalog/packaging">`

---

## Неработающие/отсутствующие разделы

- `/apparel/tshirts` — страницы нет. Создать заглушку в `app/uk/apparel/tshirts` и `app/ru/apparel/tshirts` либо скрыть пункт.
- `/blog` — страницы нет. Создать заглушку в `app/uk/blog` и `app/ru/blog` либо скрыть пункт.
- `/catalog/flyers` — страницы нет. Создать заглушку в `app/uk/catalog/flyers` и `app/ru/catalog/flyers` либо скрыть пункт.
- `/catalog/packaging` — страницы нет. Создать заглушку в `app/uk/catalog/packaging` и `app/ru/catalog/packaging` либо скрыть пункт.
- `/catalog/stickers` — страницы нет. Создать заглушку в `app/uk/catalog/stickers` и `app/ru/catalog/stickers` либо скрыть пункт.
- `/contacts` — страницы нет. Создать заглушку в `app/uk/contacts` и `app/ru/contacts` либо скрыть пункт.
- `/help/delivery` — страницы нет. Создать заглушку в `app/uk/help/delivery` и `app/ru/help/delivery` либо скрыть пункт.
- `/help/faq` — страницы нет. Создать заглушку в `app/uk/help/faq` и `app/ru/help/faq` либо скрыть пункт.
- `/help/payment` — страницы нет. Создать заглушку в `app/uk/help/payment` и `app/ru/help/payment` либо скрыть пункт.
- `/help/tech-requirements` — страницы нет. Создать заглушку в `app/uk/help/tech-requirements` и `app/ru/help/tech-requirements` либо скрыть пункт.
- `/templates` — страницы нет. Создать заглушку в `app/uk/templates` и `app/ru/templates` либо скрыть пункт.
- `/track` — страницы нет. Создать заглушку в `app/uk/track` и `app/ru/track` либо скрыть пункт.

---

## Улучшения дизайна (UI/UX)

1) **Шапка и навигация**
   - Проставить активное состояние текущего пункта (по `usePathname()`), добавить состояние `hover/active/focus` с видимым **focus-ring**.
   - Для бургер-меню и иконок без текста добавить `aria-label`.
   - Сгруппировать каталог в выпадающее меню (мегаменю) c визуальными категориями (иконка + подсказка).

2) **Главная (Hero)**
   - Проверить контраст текста на градиентах. Для тёмной темы поднять контраст secondary-текста (сейчас `--muted-foreground` может быть бледным на `--surface`).
   - Добавить вторичную CTA («Загрузить макет») рядом с основной («Рассчитать цену»), оба — с чёткими клавиатурными состояниями.

3) **Карточки каталога**
   - Увести к `Card` с чёткой иерархией: миниатюра → заголовок → цена «от» → 2–3 бэйджа (доставка, префлайт, срок). Добавить состояния `loading/skeleton` при запросах `/api/products`.
   - Для изображений использовать `next/image` c `sizes` и `priority` для Above-The-Fold.

4) **Футер**
   - Пересобрать быстрые ссылки: только реально существующие разделы. Блоки «Оплата/Доставка» — кликабельные и ведущие на разделы помощи.

5) **Детальная товара**
   - Сетка 2 колонки: галерея (в том числе mockup) + панель конфигурации/цены. Закрепить панель при скролле (sticky) на десктопе.
   - Показать расчёт цены в реальном времени (у вас уже есть `RealTimePriceCalculator`) и breakdown.

6) **Доступность**
   - Везде у иконок без текста — `aria-hidden` и/или `aria-label` у контейнера.
   - Поддержать `prefers-reduced-motion` (отключить сложные анимации).
   - Корректные заголовки H1/H2/H3 на страницах.

7) **Единый визуальный язык**
   - Токены шрифтов/цветов уже заведены — добавить токены отступов (`--space-1..8`) для консистентности.
   - Пересмотреть тени: использовать одну «мягкую» тень по умолчанию, «glow» – только для CTA.


---

## Улучшения i18n

- В секциях (`HeroSection`, `PopularCategories`, `Benefits`, `HowItWorks`, `Portfolio`, `Testimonials`, `BlogPreview`) сейчас жёстко прошиты украинские строки. На `ru` всё равно будет UA‑контент.
- **Фикс:** заменить литералы на `useTranslations()` из `next-intl` и вынести тексты в `src/i18n/messages/{uk,ru}.json`.
- Добавить `alternate` для SEO: `alternates.languages = { 'uk-UA': '/uk', 'ru-RU': '/ru' }` и `openGraph.locale/alternateLocales`.


---

## Конкретные правки (патчи)

### 1. Редирект `/ → /uk` (если оставляем текущую структуру)
```ts
// src/app/page.tsx
import { redirect } from 'next/navigation';
export default function Index() { redirect('/uk'); }
```

### 2. Локализованные ссылки через `next-intl/link`
```tsx
// src/components/ui/LocaleLink.tsx
'use client'
import Link, { LinkProps } from 'next-intl/link'
import { useLocale } from 'next-intl'
export function LocaleLink({ href, ...props }: LinkProps & { children: React.ReactNode }) {
  const locale = useLocale()
  return <Link href={href} locale={locale} {...props} />
}
```
Заменить в `Header`/`Footer`/секциях:
```tsx
// before
import Link from 'next/link'
<Link href="/catalog/canvas" />
// after
import { LocaleLink as Link } from '@/components/ui/LocaleLink'
<Link href="/catalog/canvas" />
```

### 3. Добавить `"use client"` в проблемные UI-файлы
В начало файлов:
```ts
"use client";
```
Список: `src/components/ui/chart.tsx`, `sidebar.tsx`, `form.tsx`, `carousel.tsx`.

### 4. Исправить шрифты и убрать дубли
```ts
// src/app/layout.tsx
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
const inter = Inter({ subsets: ['latin', 'latin-ext', 'cyrillic'], variable: '--font-inter', display: 'swap' })
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin', 'latin-ext', 'cyrillic'], variable: '--font-heading', display: 'swap' })
```
И удалить `@import` шрифтов из `globals.css`.

### 5. Управление темой
В `src/app/layout.tsx` удалить `className="dark"` у `<html>` и оставить провайдер `ThemeProvider` с `defaultTheme="dark"`.

### 6. Динамический `<html lang>`
В корневом `layout.tsx`:
```tsx
import { getLocale } from 'next-intl/server'
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>...</body>
    </html>
  )
}
```

### 7. Заглушки для отсутствующих страниц
Создать `page.tsx` с лаконичным текстом и `export const metadata = { robots: { index: false } }` для разделов из списка ниже (или временно скрыть ссылки):
`/templates`, `/blog`, `/help/tech-requirements`, `/help/delivery`, `/help/payment`, `/help/faq`, `/contacts`, `/track`, `/apparel/tshirts`, `/catalog/flyers`, `/catalog/stickers`, `/catalog/packaging`.

### 8. Sitemap и Robots (App Router)
```ts
// src/app/robots.ts
export default function robots() { return { rules: { userAgent: '*', allow: '/' }, sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml` } }

// src/app/sitemap.ts
import { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: `${process.env.NEXT_PUBLIC_BASE_URL}/uk`, changeFrequency: 'weekly', priority: 1 }, { url: `${process.env.NEXT_PUBLIC_BASE_URL}/ru`, changeFrequency: 'weekly', priority: 0.8 }] }
```


---

## Проверки после правок (чек-лист)
- [ ] `pnpm build && pnpm start` без предупреждений о Client/Server mismatch
- [ ] Переходы из Header/Footer/секций не дают 404 и сохраняют текущую локаль
- [ ] На `/ru/**` атрибут `<html lang="ru">`
- [ ] Тексты на `ru` берутся из `ru.json`, нет жёстко прошитого UA
- [ ] Lighthouse ≥ 90 по A11y/Best Practices/SEO
- [ ] Отсутствующие разделы скрыты или имеют аккуратные заглушки (`noindex`)


---

## Стратегическое улучшение структуры (этап 2)
- Объединить `uk/` и `ru/` в `app/[locale]/**`; `middleware` оставить с `localePrefix: 'as-needed'`.
- Перенести общий `<Header/>` обратно в клиентский компонент без `ssr:false` динамического импорта (он уже `"use client"`).
- Вынести все копирайты/блоки интерфейса в i18n‑сообщения.
