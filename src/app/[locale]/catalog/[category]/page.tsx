import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ProductCatalog } from "@/components/catalog/ProductCatalog";
import { products } from "@/data/products";
import type { ProductCategory } from "@/types";

export function generateStaticParams() {
  const categories = Array.from(new Set(products.map(p => p.category)));
  const locales = ["ua", "ru"];
  return locales.flatMap(locale =>
    categories.map(category => ({ locale, category }))
  );
}

export default function CategoryPage({ params }: { params: { locale: string; category: ProductCategory } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs className="mb-6" />
        <ProductCatalog category={params.category} />
      </main>
      <Footer />
    </div>
  );
}
