import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CART_STORAGE_KEY, SHIPPING_COST, TAX_RATE } from '../data/constants';
import {
  PROMO_STORAGE_KEY,
  getValidSavedPromo,
  promoPercent,
} from '../data/promoCodes';
import { apiRequest } from '../api';
import { useCatalog } from './CatalogContext';

const CartContext = createContext(null);

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function readPromo() {
  try {
    const saved = localStorage.getItem(PROMO_STORAGE_KEY);
    return getValidSavedPromo(saved);
  } catch {
    return null;
  }
}

export function CartProvider({ children }) {
  const { getProductById } = useCatalog();
  const [cart, setCart] = useState(readCart);
  const [appliedPromo, setAppliedPromo] = useState(readPromo);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedPromo) localStorage.setItem(PROMO_STORAGE_KEY, appliedPromo.code);
    else localStorage.removeItem(PROMO_STORAGE_KEY);
  }, [appliedPromo]);

  useEffect(() => {
    const sync = () => {
      setCart(readCart());
      setAppliedPromo(readPromo());
    };
    window.addEventListener('storage', sync);
    window.addEventListener('focus', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('focus', sync);
    };
  }, []);

  const addToCart = useCallback((productId, qty = 1) => {
    setCart((prev) => {
      const next = [...prev];
      const existing = next.find((item) => item.id === productId);
      if (existing) {
        existing.qty = (existing.qty || 1) + qty;
      } else {
        next.push({ id: productId, qty });
      }
      return next;
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const changeQty = useCallback((productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, qty: (item.qty || 1) + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  }, []);

  const setQty = useCallback((productId, qty) => {
    const value = Math.max(1, Number(qty) || 1);
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, qty: value } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedPromo(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(PROMO_STORAGE_KEY);
  }, []);

  const applyPromo = useCallback(
    async (code) => {
      const trimmed = String(code || '').trim();
      if (!trimmed) return { ok: false, message: 'Please enter a promo code' };

      try {
        const promo = await apiRequest('/promos/validate', {
          method: 'POST',
          body: JSON.stringify({ code: trimmed }),
        });

        if (appliedPromo?.code === promo.code) return { ok: true, message: `Promo already applied (${promo.label})` };

        setAppliedPromo(promo);
        return { ok: true, message: `Promo applied! ${promo.label}` };
      } catch {
        return { ok: false, message: 'Unable to validate promo code' };
      }
    },
    [appliedPromo]
  );

  const removePromo = useCallback(() => {
    setAppliedPromo(null);
    return { ok: true, message: 'Promo removed' };
  }, []);

  const cartItems = useMemo(
    () =>
      cart
        .map((item) => {
          const product = getProductById(item.id);
          if (!product) return null;
          return { ...item, product, lineTotal: product.price * item.qty };
        })
        .filter(Boolean),
    [cart, getProductById]
  );

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + (item.qty || 1), 0),
    [cart]
  );

  const promoApplied = Boolean(appliedPromo);
  const promoCode = appliedPromo?.code || null;
  const promoDiscountLabel = appliedPromo
    ? `${promoPercent(appliedPromo)}%`
    : null;

  const pricing = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const discount = appliedPromo
      ? Math.round(subtotal * appliedPromo.discount)
      : 0;
    const total = Math.max(0, subtotal - discount);
    return { subtotal, discount, shipping: 0, tax: 0, total };
  }, [cartItems, appliedPromo]);

  const value = useMemo(
    () => ({
      cart,
      cartItems,
      itemCount,
      pricing,
      promoApplied,
      promoCode,
      promoDiscountLabel,
      appliedPromo,
      addToCart,
      removeItem,
      changeQty,
      setQty,
      clearCart,
      applyPromo,
      removePromo,
    }),
    [
      cart,
      cartItems,
      itemCount,
      pricing,
      promoApplied,
      promoCode,
      promoDiscountLabel,
      appliedPromo,
      addToCart,
      removeItem,
      changeQty,
      setQty,
      clearCart,
      applyPromo,
      removePromo,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
