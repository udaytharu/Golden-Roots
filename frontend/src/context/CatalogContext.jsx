import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchProducts } from '../api';
import { PRODUCTS } from '../data/products';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(PRODUCTS);

  useEffect(() => {
    let active = true;
    fetchProducts().then(({ products: loadedProducts }) => {
      if (active) setProducts(loadedProducts);
    });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({
    products,
    getProductById: (id) => products.find((product) => product.id === id) || null,
  }), [products]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used within CatalogProvider');
  return context;
}