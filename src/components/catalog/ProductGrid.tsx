"use client";

import Image from "next/image";
import { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="space-y-2">
          {/* Placeholder image */}
          <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
            {product.images?.[0]?.url ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt?.uk || product.images[0].alt?.en || ""}
                fill
                className="object-cover"
              />
            ) : null}
          </div>
          <h3 className="font-medium">
            {product.title?.uk || product.title?.en || Object.values(product.title)[0]}
          </h3>
          <p className="text-sm text-muted-foreground">
            {product.basePrice} {product.currency}
          </p>
        </div>
      ))}
    </div>
  );
}
