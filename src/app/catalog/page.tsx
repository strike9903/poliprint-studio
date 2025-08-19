import { Metadata } from "next";
import { ProductCatalog } from "@/components/catalog/ProductCatalog";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export const metadata: Metadata = {
  title: "Каталог продукції - Poliprint Studio",
  description: "Повний каталог послуг друку: холсти, акрил, візитки, поліграфія, мерч. Оберіть продукт та налаштуйте параметри онлайн.",
  openGraph: {
    title: "Каталог продукції - Poliprint Studio",
    description: "Повний каталог послуг друку: холсти, акрил, візитки, поліграфія, мерч.",
  }
};

export default function CatalogPage() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <Breadcrumbs className="mb-6" />
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Каталог продукції
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Оберіть категорію продукції для друку. Ми пропонуємо широкий асортимент: 
              від холстів та акрилу до візиток та мерчу.
            </p>
          </div>
          
          <ProductCatalog />
        </main>
        
        <Footer />
      </div>
    </>
  );
}