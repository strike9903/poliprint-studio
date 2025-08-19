# Poliprint Studio

Poliprint Studio is a Next.js 14 application using the App Router with locale-aware routing and mock APIs for products.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` – start Next.js in development
- `npm run lint` – run ESLint
- `npm run build` – create an optimized production build
- `npm run start` – run the production build

## Features

- Routes for Ukrainian and Russian locales under `/[locale]`
- Catalog pages and product details backed by mock `/api/products` endpoints
- Basic JSON-LD Product and Breadcrumb metadata for SEO
- Tailwind CSS and shadcn/ui components

## Project Structure

```
src/
  app/               # App Router pages and API routes
  components/        # UI components
  data/              # Mock product dataset
```

## License

MIT
