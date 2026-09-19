import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SITE } from '../data/constants';
import { FEATURED_PRODUCT_IDS } from '../data/products';
import { useCatalog } from '../context/CatalogContext';
import FloatingSpices from '../components/ui/FloatingSpices';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import SectionTitle from '../components/ui/SectionTitle';
import StatsSection from '../components/ui/StatsSection';

const FEATURES = [
  { icon: 'fa-leaf', title: '100% Natural', text: 'No artificial colors, preservatives, or additives — just pure spice.' },
  { icon: 'fa-award', title: 'Premium Quality', text: 'Carefully sourced and packed to lock in aroma, color, and freshness.' },
  { icon: 'fa-tags', title: 'Reasonable Price', text: 'Authentic Nepali spices at prices that respect every kitchen.' },
  { icon: 'fa-gift', title: 'Special Occasions', text: 'Perfect for weddings, festivals, and everyday family meals.' },
];

const CONTACT_CARDS = [
  { icon: 'fa-phone', title: 'Call', value: SITE.phone, href: `tel:${SITE.phoneTel}`, note: 'Available Now' },
  { icon: 'fa-whatsapp', brand: true, title: 'WhatsApp', value: SITE.phone, href: SITE.whatsapp, note: 'Chat Instantly' },
  { icon: 'fa-envelope', title: 'Email', value: SITE.email, href: `mailto:${SITE.email}`, note: 'Reply in 24h' },
  { icon: 'fa-map-marker-alt', title: 'Visit', value: SITE.location, href: null, note: SITE.hours },
];

export default function Home() {
  const { getProductById } = useCatalog();
  const featured = FEATURED_PRODUCT_IDS.map(getProductById).filter(Boolean);
  const [formSent, setFormSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    window.setTimeout(() => setFormSent(false), 5000);
  };

  return (
    <>
      <section className="hero">
        <img className="hero-banner" src="/images/banner.jpg" alt="" aria-hidden="true" />
        <div className="hero-bg" />
        <FloatingSpices />
        <div className="hero-content">
          <p className="hero-brand">Golden Roots</p>
          <h1>Pure Nepali Spices</h1>
          <p className="hero-sub">From the Farmers of Nepal to your kitchen — authentic spices, pure and premium.</p>
          <div className="hero-ctas">
            <a href="#feature-product" className="btn">
              Explore Our Range
            </a>
            <Link to="/products" className="btn btn-outline">
              Order Now
            </Link>
          </div>
        </div>
      </section>

      <section className="about-preview">
        <div className="container about-preview-grid">
          <Reveal>
            <img src="/images/about.jpg" alt="Golden Roots spice packets" />
          </Reveal>
          <Reveal delay={1}>
            <h2>About Golden Roots</h2>
            <p>
              We are a Nepali brand dedicated to bringing pure, aromatic spices from local farmers to your table.
              Every pack carries tradition, care, and the promise of natural taste.
            </p>
            <p className="nepali-tagline">शुद्ध स्वाद • प्राकृतिक विश्वास</p>
            <Link to="/about" className="btn">
              Read Full Story
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="feature-product" className="products-section">
        <div className="container">
          <SectionTitle
            title="Our Premium Collection"
            subtitle="100% Natural, No Added Preservatives, Rich Aroma"
          />
          <div className="products-grid">
            {featured.map((product, i) => (
              <Reveal key={product.id} delay={(i % 4) + 1}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/products" className="btn btn-dark">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <SectionTitle title="Why Choose Golden Roots?" />
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} className="feature-card" delay={(i % 4) + 1}>
                <i className={`fas ${f.icon}`} />
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <StatsSection />

      <section id="contact-us" className="contact-section">
        <div className="container">
          <div className="contact-shell">
          <aside className="contact-aside">
            <p className="contact-eyebrow">Reach us</p>
            <h2>Let&apos;s talk spices</h2>
            <p className="contact-lead">
              Questions, bulk orders, or just a hello — we usually reply within a day.
            </p>
            <ul className="contact-list">
              {CONTACT_CARDS.map((c) => {
                const content = (
                  <>
                    <span className="contact-icon">
                      <i className={`${c.brand ? 'fab' : 'fas'} ${c.icon}`} />
                    </span>
                    <span className="contact-meta">
                      <strong>{c.title}</strong>
                      <span className="contact-value">{c.value}</span>
                      <em>{c.note}</em>
                    </span>
                  </>
                );
                return (
                  <li key={c.title}>
                    {c.href ? (
                      <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                        {content}
                      </a>
                    ) : (
                      <div className="contact-static">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="contact-panel">
            {formSent ? (
              <div className="form-success">
                <i className="fas fa-check-circle" />
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={onSubmit}>
                <h3>Send a message</h3>
                <div className="form-row">
                  <label>
                    Full Name *
                    <input name="name" value={form.name} onChange={onChange} required />
                  </label>
                  <label>
                    Phone *
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      placeholder="+977-98XXXXXXXX"
                      required
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Email
                    <input type="email" name="email" value={form.email} onChange={onChange} />
                  </label>
                  <label>
                    Subject *
                    <select name="subject" value={form.subject} onChange={onChange} required>
                      <option value="">Select a subject</option>
                      <option>General Inquiry</option>
                      <option>Place an Order</option>
                      <option>Bulk / Wedding Order</option>
                      <option>Feedback</option>
                    </select>
                  </label>
                </div>
                <label>
                  Your Message *
                  <textarea name="message" rows={4} value={form.message} onChange={onChange} required />
                </label>
                <Button type="submit" className="full-width">
                  Send Message <i className="fas fa-paper-plane" />
                </Button>
              </form>
            )}
          </div>
          </div>
        </div>
      </section>
    </>
  );
}
