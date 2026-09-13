import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import PageHero from '../components/ui/PageHero';
import Button from '../components/ui/Button';

const INITIAL = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  province: '',
  postal: '',
  landmark: '',
  orderNotes: '',
  payment: 'cod',
  agreeTerms: false,
};

export default function Checkout() {
  const { cartItems, pricing, itemCount, clearCart, promoCode, promoDiscountLabel } = useCart();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);

  if (itemCount === 0 && !orderId) {
    return <Navigate to="/cart" replace />;
  }

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = 'Required';
    if (!form.lastName.trim()) next.lastName = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!/^[\d\s+\-()]{7,}$/.test(form.phone)) next.phone = 'Enter a valid phone';
    if (!form.address.trim()) next.address = 'Required';
    if (!form.city.trim()) next.city = 'Required';
    if (!form.province) next.province = 'Required';
    if (!form.agreeTerms) next.agreeTerms = 'Please agree to the terms';

    setErrors(next);
    if (Object.keys(next).length) {
      const first = document.querySelector(`[name="${Object.keys(next)[0]}"]`);
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setOrderId(`GR-${String(Date.now()).slice(-6)}`);
      clearCart();
      setSubmitting(false);
    }, 1600);
  };

  if (orderId) {
    return (
      <section className="checkout-section">
        <div className="order-success">
          <i className="fas fa-check-circle" />
          <h2>Order Placed!</h2>
          <p>
            Your order <strong>{orderId}</strong> has been received.
          </p>
          <p>Estimated delivery: 2–4 business days.</p>
          <Link to="/" className="btn">
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero
        title="Checkout"
        subtitle="Complete your order in just a few steps"
      />

      <section className="checkout-section">
        <div className="checkout-steps">
          <div className="step active">
            <span className="step-num">1</span> Information
          </div>
          <span className="step-line" />
          <div className="step active">
            <span className="step-num">2</span> Payment
          </div>
          <span className="step-line" />
          <div className="step">
            <span className="step-num">3</span> Confirm
          </div>
        </div>

        <form className="checkout-layout" onSubmit={onSubmit} noValidate>
          <div className="checkout-form">
            <fieldset>
              <legend>Contact Information</legend>
              <div className="form-row">
                <label>
                  First Name *
                  <input name="firstName" value={form.firstName} onChange={onChange} placeholder="Ram" />
                  {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                </label>
                <label>
                  Last Name *
                  <input name="lastName" value={form.lastName} onChange={onChange} placeholder="Sharma" />
                  {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                </label>
              </div>
              <div className="form-row">
                <label>
                  Email *
                  <input type="email" name="email" value={form.email} onChange={onChange} placeholder="you@example.com" />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </label>
                <label>
                  Phone *
                  <input name="phone" value={form.phone} onChange={onChange} placeholder="+977-98XXXXXXXX" />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend>Shipping Address</legend>
              <label>
                Street Address *
                <input name="address" value={form.address} onChange={onChange} placeholder="House no., street, area" />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </label>
              <div className="form-row">
                <label>
                  City *
                  <input name="city" value={form.city} onChange={onChange} placeholder="Kathmandu" />
                  {errors.city && <span className="field-error">{errors.city}</span>}
                </label>
                <label>
                  Province *
                  <select name="province" value={form.province} onChange={onChange}>
                    <option value="">Select province</option>
                    {['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'].map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                  {errors.province && <span className="field-error">{errors.province}</span>}
                </label>
              </div>
              <div className="form-row">
                <label>
                  Postal Code
                  <input name="postal" value={form.postal} onChange={onChange} placeholder="44600" />
                </label>
                <label>
                  Landmark
                  <input name="landmark" value={form.landmark} onChange={onChange} placeholder="Near..." />
                </label>
              </div>
              <label>
                Order Notes
                <textarea
                  name="orderNotes"
                  rows={3}
                  value={form.orderNotes}
                  onChange={onChange}
                  placeholder="Any special instructions for delivery..."
                />
              </label>
            </fieldset>

            <fieldset>
              <legend>Payment Method</legend>
              <div className="payment-options">
                {[
                  { value: 'cod', label: 'Cash on Delivery', icon: 'fa-money-bill-wave' },
                  { value: 'esewa', label: 'eSewa', icon: 'fa-wallet' },
                  { value: 'khalti', label: 'Khalti', icon: 'fa-mobile-alt' },
                ].map((opt) => (
                  <label key={opt.value} className={`payment-option ${form.payment === opt.value ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={form.payment === opt.value}
                      onChange={onChange}
                    />
                    <i className={`fas ${opt.icon}`} />
                    {opt.label}
                  </label>
                ))}
              </div>

              <p className="payment-note payment-note-shared">
                Extra standard cost will be charged based on your location. Thanks for understanding.
              </p>

              {form.payment === 'cod' && (
                <p className="payment-note">Pay in cash when your order arrives at your doorstep.</p>
              )}
              {form.payment === 'esewa' && (
                <div className="payment-qr">
                  <p className="payment-note">
                    Scan this eSewa QR to pay <strong>{formatPrice(pricing.total)}</strong>, then place your order.
                  </p>
                  <img src="/images/paymentQR/eSewa.png" alt="eSewa payment QR code" />
                </div>
              )}
              {form.payment === 'khalti' && (
                <div className="payment-qr">
                  <p className="payment-note">
                    Scan this Khalti QR to pay <strong>{formatPrice(pricing.total)}</strong>, then place your order.
                  </p>
                  <img src="/images/paymentQR/khalti.png" alt="Khalti payment QR code" />
                </div>
              )}
            </fieldset>

            <label className="terms-check">
              <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={onChange} />
              I agree to the Terms of Service and Privacy Policy
              {errors.agreeTerms && <span className="field-error">{errors.agreeTerms}</span>}
            </label>
          </div>

          <aside className="checkout-summary">
            <h2>Order Summary</h2>
            <ul className="checkout-items">
              {cartItems.map(({ id, qty, product, lineTotal }) => (
                <li key={id}>
                  <div className="checkout-item-img">
                    <img src={product.img} alt="" />
                    <span className="qty-badge">{qty}</span>
                  </div>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{formatPrice(lineTotal)}</span>
                  </div>
                </li>
              ))}
            </ul>
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
            <div className="summary-row">
              <span>Shipping</span>
              <span>{pricing.shipping === 0 ? 'Free' : formatPrice(pricing.shipping)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (VAT 13%)</span>
              <span>{formatPrice(pricing.tax)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(pricing.total)}</span>
            </div>
            <Button type="submit" className="full-width" disabled={submitting}>
              {submitting ? 'Processing...' : 'Place Order'}
            </Button>
            <p className="secure-note">
              <i className="fas fa-lock" /> Secure checkout · 100% safe &amp; encrypted
            </p>
          </aside>
        </form>
      </section>
    </>
  );
}
