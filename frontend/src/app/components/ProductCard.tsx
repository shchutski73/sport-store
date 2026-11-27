import Image from 'next/image';

export interface Product {
  id: number;
  name: string;
  slug?: string;
  description: string;
  price: string | number;
  image_url?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
    description?: string;
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className="group h-full min-h-[390px] bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
      <div className="relative h-44 sm:h-48 bg-gray-100 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            loading="lazy"
            decoding="async"
            quality={80}
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex h-[202px] flex-col p-4">
        <h3 className="text-base font-semibold mb-2 text-gray-900 line-clamp-2 min-h-12">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-10">{product.description}</p>
        {product.category && (
          <span className="self-start inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mb-3">
            {product.category.name}
          </span>
        )}
        <div className="mt-auto flex justify-between items-center gap-2">
          <span className="text-lg font-bold text-orange-600 whitespace-nowrap">
            {typeof product.price === 'string' ? product.price : product.price.toFixed(2)} ₽
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product.id);
            }}
            className="shrink-0 bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 active:scale-[0.98] transition-[background-color,transform] duration-150 font-medium"
          >
            В корзину
          </button>
        </div>
      </div>
    </article>
  );
}