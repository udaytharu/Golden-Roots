import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import Reveal from '../components/ui/Reveal';
import SectionTitle from '../components/ui/SectionTitle';

const VALUES = [
  { icon: 'fa-seedling', title: 'Purity First', text: 'No shortcuts — only natural spices free from fillers and artificial additives.' },
  { icon: 'fa-handshake', title: 'Fair Sourcing', text: 'We partner with local farmers and pay fairly for quality harvests.' },
  { icon: 'fa-gem', title: 'Uncompromised Quality', text: 'Every batch is checked for aroma, color, and freshness before packing.' },
  { icon: 'fa-heart', title: 'Made with Love', text: 'From our family kitchen to yours — tradition in every spoonful.' },
];

const TIMELINE = [
  { year: '2009', title: 'The Beginning', text: 'Started as a small family kitchen sharing pure spices with neighbors.' },
  { year: '2014', title: 'Going Commercial', text: 'Expanded sourcing and began serving local shops across Kathmandu.' },
  { year: '2018', title: 'Nationwide Reach', text: 'Golden Roots packs reached kitchens across Nepal.' },
  { year: '2022', title: 'Going Digital', text: 'Launched online ordering so families can shop from home.' },
  { year: '2024', title: 'Today & Beyond', text: 'Continuing our mission of pure taste and trusted quality.' },
];

export default function About() {
  return (
    <>
      <PageHero
        title="Our Story"
        subtitle="Rooted in tradition, crafted with love — the journey of Golden Roots from a small family kitchen to homes across Nepal."
      />

      <section className="story">
        <div className="story-grid">
          <Reveal className="story-img">
            <img src="/images/about.jpg" alt="Golden Roots story" />
          </Reveal>
          <Reveal delay={1} className="story-text">
            <h2>
              A Legacy of <span>Pure Flavor</span>
            </h2>
            <p>
              Golden Roots began in a Kathmandu kitchen, where family recipes and carefully chosen spices were shared
              with loved ones. What started as a passion for authentic taste grew into a brand trusted across Nepal.
            </p>
            <p>
              We work closely with local farmers, selecting spices for their aroma, color, and purity — then packing
              them with care so every meal carries the warmth of home.
            </p>
            <p>
              From daily cooking to weddings and festivals, our spices are made for the moments that matter.
            </p>
            <p className="signature">— The Golden Roots Family</p>
          </Reveal>
        </div>
      </section>

      <section className="values">
        <div className="container">
          <SectionTitle title="What We Stand For" subtitle="Principles that guide every pack we make" />
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} className="value-card" delay={(i % 4) + 1}>
                <i className={`fas ${v.icon}`} />
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="timeline-section">
        <div className="container">
          <SectionTitle title="Our Journey" />
          <div className="timeline">
            {TIMELINE.map((item, i) => (
              <Reveal key={item.year} className="timeline-item" delay={(i % 4) + 1}>
                <span className="timeline-year">{item.year}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="local-store">
        <div className="container">
          <div className="local-store-inner">
            <div className="store-copy">
              <p className="eyebrow">Local availability</p>
              <h2>We are also available in local store</h2>
              <p>Visit Golden Roots in Kathmandu to experience our spices fresh from the shelf and speak with our team.</p>
            </div>
            <div className="store-details">
              <div className="store-badge">
                <i className="fas fa-store" />
              </div>
              <div>
                <h3>Golden Roots Store</h3>
                <p>Kathmandu, Nepal</p>
                <p>Open daily · 9:00 AM - 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container">
          <h2>Ready to Taste the Difference?</h2>
          <p>Explore our collection or get in touch — we&apos;d love to welcome you to the Golden Roots family.</p>
          <div className="hero-ctas">
            <Link to="/products" className="btn">
              Shop Now
            </Link>
            <Link to="/#contact-us" className="btn btn-outline">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
