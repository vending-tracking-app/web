import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchProducts } from '@/api/products';

export const productsQueryKey = ['products'] as const;

export function useProducts() {
  const { data: products = [], refetch: refetchProducts } = useQuery({
    queryKey: productsQueryKey,
    queryFn: fetchProducts,
  });

  const productsMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  return { products, productsMap, refetchProducts };
}
