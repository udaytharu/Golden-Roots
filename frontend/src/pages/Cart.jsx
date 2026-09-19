import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import PageHero from '../components/ui/PageHero';
import Button from '../components/ui/Button';

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    pricing,
    changeQty,
    removeItem,
    applyPromo,
    removePromo,
    promoApplied,
    promoCode,
    promoDiscountLabel,
    itemCount,
  } = useCart();
  const { showToast } = useToast();
  const [promo, setPromo] = useState('');

  const onPromo = async () => {
    const result = await applyPromo(promo);
    showToast(result.message, result.ok ? 'success' : 'error');
    if (result.ok) setPromo('');
  };

  const onRemovePromo = () => {
    const result = removePromo();
    showToast(result.message, 'success');
  };

  if (itemCount === 0) {
    return (
      <>
        <PageHero
          title="Your Cart"
          subtitle="Review your items and proceed to checkout"
        />
        <section className="cart-section">
          <div className="empty-state">
            <i className="fas fa-shopping-basket" />
            <h3>Your Cart is Empty</h3>
            <p>Looks like you haven&apos;t added any spices yet. Explore our collection and fill your kitchen with aroma.</p>
            <Link to="/products" className="btn">
              Start Shopping
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        title="Your Cart"
        subtitle="Review your items and proceed to checkout"
      />

      <section className="cart-section">
        <div className="cart-layout">
          <div className="cart-items">
            <h2>Items in Cart ({itemCount})</h2>
            {cartItems.map(({ id, qty, product, lineTotal }) => (
              <div className="cart-item" key={id}>
                <div className="cart-item-img">
                  <img src={product.img} alt={product.name} />
                </div>
                <div className="cart-item-info">
                  <h3>{product.name}</h3>
                  <p className="price-each">{formatPrice(product.price)} each</p>
                  <div className="qty-control">
                    <button type="button" className="qty-btn" onClick={() => changeQty(id, -1)}>
                      −
                    </button>
                    <input className="qty-input" value={qty} readOnly aria-label="Quantity" />
                    <button type="button" className="qty-btn" onClick={() => changeQty(id, 1)}>
                      +
                    </button>
                  </div>
                  <p className="item-price">{formatPrice(lineTotal)}</p>
                </div>
                <div className="cart-item-actions">
                  <button
                    type="button"
                    className="remove-btn"
                    aria-label={`Remove ${product.name}`}
                    onClick={() => {
                      removeItem(id);
                      showToast('Item removed from cart');
                    }}
                  >
                    <i className="fas fa-trash-alt" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(pricing.subtotal)}</span>
            </div>
            {pricing.discount > 0 && (
              <div className="summary-row discount-row">
                <span>
                  Discount ({promoCode} · {promoDiscountLabel})
                </span>
                <span>-{formatPrice(pricing.discount)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(pricing.total)}</span>
            </div>

            {promoApplied ? (
              <div className="promo-applied">
                <span>
                  <i className="fas fa-tag" /> {promoCode} applied
                </span>
                <button type="button" onClick={onRemovePromo}>
                  Remove
                </button>
              </div>
            ) : (
              <div className="promo-row">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onPromo()}
                />
                <Button size="sm" variant="outline" onClick={onPromo}>
                  Apply
                </Button>
              </div>
            )}

            <Button className="full-width" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
            <Link to="/products" className="btn btn-outline full-width">
              Continue Shopping
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
