import PageHero from '../components/ui/PageHero';
import '../styles/pages/legal.css';

export default function TermsOfService() {
  return (
    <>
      <PageHero title="Terms of Service" subtitle="The terms that apply when you shop with Golden Roots online." />
      <main className="legal-page">
        <p className="legal-updated">Last updated: September 14, 2026</p>
        <section className="legal-section">
          <h2>Using our store</h2>
          <p>By using the Golden Roots website or placing an order, you agree to these terms. Please provide accurate contact and delivery information and use the website only for lawful purposes.</p>
        </section>
        <section className="legal-section">
          <h2>Products and availability</h2>
          <p>We make every effort to keep product descriptions, images, prices, and stock information accurate. Product availability may change without notice. Minor differences in color, packaging, or appearance may occur between the website and delivered product.</p>
        </section>
        <section className="legal-section">
          <h2>Orders and confirmation</h2>
          <p>An order request is not final until Golden Roots accepts and confirms it. We may contact you to verify an order, correct an obvious pricing or listing error, or cancel an order when a product is unavailable or information cannot be verified.</p>
        </section>
        <section className="legal-section">
          <h2>Payments</h2>
          <p>We currently support Cash on Delivery, eSewa, and Khalti where shown at checkout. For eSewa or Khalti orders, you must upload a clear payment screenshot after completing payment. An order may remain pending until the payment is verified.</p>
          <p>Never share your payment PIN, password, or one-time password with Golden Roots or anyone claiming to represent us.</p>
        </section>
        <section className="legal-section">
          <h2>Delivery</h2>
          <p>Delivery estimates shown at checkout are estimates, not guarantees. Delivery may be affected by location, weather, holidays, carrier delays, or incorrect contact information. You are responsible for providing an address where someone can receive the order.</p>
        </section>
        <section className="legal-section">
          <h2>Returns and issues</h2>
          <p>Please contact us promptly if your order is damaged, incorrect, or missing an item. Keep the packaging and order details available so we can investigate and offer an appropriate replacement, correction, or refund where applicable.</p>
        </section>
        <section className="legal-section">
          <h2>Intellectual property</h2>
          <p>Golden Roots branding, product content, photographs, text, and website design belong to Golden Roots or its content partners. Do not copy, republish, or commercially use them without permission.</p>
        </section>
        <section className="legal-section">
          <h2>Changes and contact</h2>
          <p>We may update these terms as our store and services change. The current version will be posted on this page. Questions can be sent to <a href="mailto:hello@goldenroots.com">hello@goldenroots.com</a>.</p>
        </section>
      </main>
    </>
  );
}
