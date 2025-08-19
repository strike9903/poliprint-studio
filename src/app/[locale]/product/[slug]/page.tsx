import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { fetchProduct } from "@/lib/api";
import { products } from "@/data/products";

interface ProductPageProps {
  params: { locale: string; slug: string };
}

export function generateStaticParams() {
  const locales = ["ua", "ru"];
  return locales.flatMap(locale =>
    products.map(p => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await fetchProduct(params.slug);
  return {
    title: `${product.title.ua} - Poliprint Studio`,
    description: product.description.ua,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProduct(params.slug);
  const locale = params.locale || 'ua';

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title.ua,
    description: product.description.ua,
    sku: product.id,
    image: product.images[0]?.url,
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency,
      price: product.basePrice,
      availability: 'https://schema.org/InStock',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Головна', item: `/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: `/${locale}/catalog` },
      { '@type': 'ListItem', position: 3, name: product.title.ua, item: `/${locale}/product/${product.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs className="mb-6" />
        <h1 className="text-3xl font-bold mb-4">{product.title.ua}</h1>
        <p className="mb-4">{product.description.ua}</p>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
