import type { ProductCategory } from "@/content/products";

interface Props {
  product: ProductCategory;
}

export default function ProductCategoryCard({ product }: Props) {
  return (
    <article
      data-testid="product-card"
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4"
    >
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p
          data-testid="product-origin"
          className="text-sm text-brand-green font-medium"
        >
          Origin: {product.originRegion}
        </p>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

      <div data-testid="product-characteristics">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Key Characteristics
        </p>
        <ul className="space-y-1">
          {product.keyCharacteristics.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-brand-green mt-0.5 flex-shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Target Markets
        </p>
        <div className="flex flex-wrap gap-2">
          {product.targetMarkets.map((market) => (
            <span
              key={market}
              className="bg-brand-cream text-brand-earth text-xs font-medium px-2 py-1 rounded-full"
            >
              {market}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
