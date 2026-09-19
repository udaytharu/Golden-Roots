import PageHero from '../components/ui/PageHero';
import '../styles/pages/legal.css';

export default function PrivacyPolicy() {
  return (
    <>
      <PageHero title="Privacy Policy" subtitle="How Golden Roots collects, uses, and protects your information." />
      <main className="legal-page">
        <p className="legal-updated">Last updated: September 14, 2026</p>
        <section className="legal-section">
          <h2>Our commitment</h2>
          <p>Golden Roots respects your privacy. This policy explains what information we collect when you browse our website, place an order, contact us, or use our checkout.</p>
        </section>
        <section className="legal-section">
          <h2>Information we collect</h2>
          <p>When you place an order, we collect your name, email address, phone number, delivery address, province, city, and any delivery notes you provide. We also collect order items, payment method, and payment confirmation screenshots when you choose eSewa or Khalti.</p>
          <p>We may receive basic technical information, such as your browser and device details, to keep the website secure and working properly.</p>
        </section>
        <section className="legal-section">
          <h2>How we use your information</h2>
          <ul>
            <li>Process, confirm, and deliver your orders.</li>
            <li>Verify digital payment confirmations and prevent fraud.</li>
            <li>Respond to questions, delivery requests, and support messages.</li>
            <li>Improve our products, website, and customer experience.</li>
            <li>Meet legal, accounting, and security obligations.</li>
          </ul>
        </section>
        <section className="legal-section">
          <h2>Payment information</h2>
          <p>Golden Roots does not ask for or store your eSewa or Khalti password, PIN, or one-time password. Payment screenshots are used only to verify the related order and are stored with the order record for operational and accounting purposes.</p>
        </section>
        <section className="legal-section">
          <h2>Sharing and retention</h2>
          <p>We do not sell your personal information. We share only the information needed with delivery or service partners to complete your order, or when required by law. We retain order information for business, tax, dispute-resolution, and security needs.</p>
        </section>
        <section className="legal-section">
          <h2>Your choices</h2>
          <p>You may contact us to ask about the personal information connected to your order or request a correction. Some information must be retained where required for legal, accounting, or fraud-prevention purposes.</p>
        </section>
        <section className="legal-section">
          <h2>Contact us</h2>
          <p>For privacy questions, contact Golden Roots at <a href="mailto:hello@goldenroots.com">hello@goldenroots.com</a> or visit us in Kathmandu, Nepal.</p>
        </section>
      </main>
    </>
  );
}
