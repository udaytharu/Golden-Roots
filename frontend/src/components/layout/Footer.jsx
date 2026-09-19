import { Link } from 'react-router-dom';
import { FOOTER_PRODUCT_LINKS, NAV_LINKS, SITE } from '../../data/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-grid container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label="Golden Roots">
            Golden <span>Roots</span>
          </Link>
          <p>{SITE.description}</p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
            <a href={SITE.whatsapp} aria-label="WhatsApp" target="_blank" rel="noreferrer">
              <i className="fab fa-whatsapp" />
            </a>
            <a href="#" aria-label="TikTok"><i className="fab fa-tiktok" /></a>
          </div>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Our Products</h4>
          <ul>
            {FOOTER_PRODUCT_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Get In Touch</h4>
          <ul className="footer-contact">
            <li><i className="fas fa-phone" /> {SITE.phone}</li>
            <li><i className="fas fa-envelope" /> {SITE.email}</li>
            <li><i className="fas fa-map-marker-alt" /> {SITE.location}</li>
            <li><i className="fas fa-clock" /> {SITE.hours}</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {year} {SITE.legalName}. All rights reserved. |{' '}
          <Link to="/privacy-policy">Privacy Policy</Link> |{' '}
          <Link to="/terms-of-service">Terms of Service</Link>
        </p>
      </div>
    </footer>
  );
}
