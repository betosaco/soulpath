'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { BaseButton } from '@/components/ui/BaseButton';

interface CatalogSheetProps {
  isOpen: boolean;
  onInsert: (content: string) => void;
}

interface ProductItem {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  comparePrice?: number | string | null;
  currency?: string | null;
  images: string[];
  slug?: string | null;
}

export function CatalogSheet({ isOpen, onInsert }: CatalogSheetProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      if (!isOpen) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/products?limit=100');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list: ProductItem[] = (json?.data ?? []).map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description ?? null,
          price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
          comparePrice: typeof p.comparePrice === 'string' ? parseFloat(p.comparePrice) : p.comparePrice,
          currency: p.currency ?? 'S/.',
          images: Array.isArray(p.images) ? p.images : [],
          slug: p.slug ?? null,
        }));
        if (!cancelled) setProducts(list);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load products');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p =>
      p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
    );
  }, [products, query]);

  const buildUrl = (p: ProductItem) => (p.slug ? `/product/${p.slug}` : `/product/${p.id}`);

  const handleInsert = (p: ProductItem) => {
    const url = buildUrl(p);
    const price = typeof p.price === 'number' ? p.price.toFixed(2) : p.price;
    const currency = p.currency || 'S/.';
    const snippet = `[${p.name}](${url}) — ${currency}${price}`;
    onInsert(snippet);
  };

  const handleDragStart = (e: React.DragEvent, p: ProductItem) => {
    const url = buildUrl(p);
    const payload = {
      type: 'product',
      id: p.id,
      name: p.name,
      url,
      price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price) || '0'),
      currency: p.currency || 'S/.',
      image: p.images?.[0] || '',
    };
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.setData('text/plain', `${p.name} - ${url}`);
    // Optional: drag image
    const img = new Image();
    img.src = payload.image || '/images/products/placeholder-product.jpg';
    try {
      e.dataTransfer.setDragImage(img, 16, 16);
    } catch {}
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader>
        <SheetTitle>Product Catalog</SheetTitle>
      </SheetHeader>
      <div className="p-4 pt-0">
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="text-sm text-gray-500">Loading products...</div>
        )}
        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-sm text-gray-500">No products found.</div>
        )}
        <ul className="space-y-3">
          {filtered.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2"
              draggable
              onDragStart={(e) => handleDragStart(e, p)}
              title="Drag to message input to insert"
            >
              {/* Image */}
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.images?.[0] || '/images/products/placeholder-product.jpg'}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-gray-900">{p.name}</div>
                <div className="truncate text-xs text-gray-500">{typeof p.price === 'number' ? p.price.toFixed(2) : p.price} {p.currency || 'S/.'}</div>
              </div>
              <div className="flex items-center gap-2">
                <BaseButton size="sm" variant="outline" onClick={() => handleInsert(p)}>
                  Insert
                </BaseButton>
                <a
                  href={buildUrl(p)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CatalogSheet;


