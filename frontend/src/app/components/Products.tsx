"use client";

import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from './ProductCard';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${API_URL}/products/`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // Show only first 6 products on home page
        setProducts(data.slice(0, 6));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (productId: number) => {
    // Implement add to cart logic here
    console.log('Add to cart:', productId);
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка товаров...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Ошибка: {error}</div>;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Наши товары</h2>
        {products.length === 0 ? (
          <p className="text-center text-gray-600">Товары не найдены.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}