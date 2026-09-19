import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [product, onClose]);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product.id, qty);
    showToast('Added to cart!');
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="modal-grid">
          <div className="modal-img">
            <img src={product.img} alt={product.name} />
          </div>
          <div className="modal-info">
            {product.tag && <span className="product-tag">{product.tag}</span>}
            <h2>{product.name}</h2>
            <div className="product-rating">
              <i className="fas fa-star" />
              <span>
                {product.rating} · {product.reviews} reviews
              </span>
            </div>
            <p>{product.longDesc}</p>
            <div className="product-features">
              {product.features.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>
            <p className="modal-price">
              {formatPrice(product.price)} <small>per pack</small>
            </p>
            <div className="qty-control modal-qty">
              <button type="button" className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <input className="qty-input" value={qty} readOnly aria-label="Quantity" />
              <button type="button" className="qty-btn" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>
            <div className="modal-actions">
              <Button onClick={handleAdd}>
                <i className="fas fa-cart-plus" /> Add to Cart
              </Button>
              <Link to="/cart" className="btn btn-outline" onClick={onClose}>
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
