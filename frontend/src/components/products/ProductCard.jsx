import { formatPrice } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';

export default function ProductCard({ product, onQuickView, showRating = false }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAdd = () => {
    addToCart(product.id, 1);
    showToast('Added to cart!');
  };

  return (
    <article className="product-card">
      <div className="product-img-wrap">
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <img src={product.img} alt={product.name} loading="lazy" />
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        {showRating && (
          <div className="product-rating">
            <i className="fas fa-star" />
            <span>
              {product.rating} ({product.reviews})
            </span>
          </div>
        )}
        <p>{product.desc}</p>
        <div className="product-features">
          {product.features.map((f) => (
            <span key={f}>{f}</span>
          ))}
        </div>
        <div className="product-footer">
          <strong className="product-price">{formatPrice(product.price)}</strong>
          <div className="product-actions">
            {onQuickView && (
              <Button variant="outline" size="sm" onClick={() => onQuickView(product)}>
                Details
              </Button>
            )}
            <Button size="sm" onClick={handleAdd}>
              <i className="fas fa-cart-plus" /> Add
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
