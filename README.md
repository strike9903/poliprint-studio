# PrintStudio - Онлайн друк сервіс

## Про проект

PrintStudio - це сучасний веб-додаток для онлайн друку, розроблений з використанням Next.js 14, TypeScript, Tailwind CSS та shadcn/ui. Додаток підтримує багатомовність (uk/ru) через next-intl та працює з валютою UAH.

## Технології

- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui компоненти
- next-intl (i18n: uk/ru)
- Валюта: UAH

## Локальний запуск

### Вимоги

- Node.js >= 20
- pnpm 9

Якщо у вас не встановлені необхідні версії, встановіть їх через nvm:

```bash
# Встановлення nvm (якщо ще не встановлено)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Встановлення Node.js 20
nvm install 20
nvm use 20

# Активація pnpm 9
corepack enable
corepack prepare pnpm@9.12.1 --activate
```

### Запуск проекту

```bash
# Встановлення залежностей
pnpm install

# Запуск в режимі розробки (порт 3000)
pnpm dev

# Перегляд додатку:
# http://localhost:3000/uk
# http://localhost:3000/ru
```

### Production збірка

```bash
# Збірка проекту
pnpm build

# Запуск production сервера (порт 3000)
pnpm start
```

### Важливо

Проект слухає **порт 3000** на всіх інтерфейсах (`0.0.0.0`), а не 8080. Якщо порт 3000 зайнятий, ви можете змінити його в `package.json`:

```json
"scripts": {
  "dev": "next dev --hostname 0.0.0.0 --port 3001",
  "start": "next start --hostname 0.0.0.0 --port 3001"
}
```

## Структура проекту

- `src/app/[locale]/layout.tsx` - Основний layout з навігацією та переключенням мов
- `src/app/[locale]/(public)/page.tsx` - Головна сторінка
- `src/app/[locale]/catalog/page.tsx` - Сторінка каталогу
- `src/app/[locale]/catalog/[category]/page.tsx` - Сторінка категорії
- `src/app/[locale]/product/[slug]/page.tsx` - Сторінка продукту
- `src/app/api/` - Mock API endpoints
- `src/i18n/messages/` - Файли перекладів (uk.json, ru.json)

## Доступні команди

```bash
# Запуск типізації
pnpm typecheck

# Лінтинг коду
pnpm lint

# Збірка проекту
pnpm build

# Запуск в режимі розробки
pnpm dev

# Запуск production сервера
pnpm start
```