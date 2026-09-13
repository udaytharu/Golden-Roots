import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../../data/constants';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const { itemCount } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const linkClass = ({ isActive }) => (isActive ? 'active' : undefined);

  const renderCartBadge = (id) =>
    itemCount > 0 ? (
      <span className="cart-badge" id={id}>
        {itemCount}
      </span>
    ) : null;

  return (
    <>
      <header className={scrolled ? 'scrolled' : ''}>
        <div className="nav-container">
          <Link to="/" className="logo" aria-label="Golden Roots Home" />

          <nav className="nav-links" aria-label="Main">
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  {link.isCart ? (
                    <NavLink to={link.to} className={({ isActive }) => `cart-icon-link ${isActive ? 'active' : ''}`}>
                      <i className="fas fa-shopping-cart" />
                      Cart
                      {renderCartBadge('cartBadgeNav')}
                    </NavLink>
                  ) : link.to.includes('#') ? (
                    <Link to={link.to}>{link.label}</Link>
                  ) : (
                    <NavLink to={link.to} className={linkClass} end={link.to === '/'}>
                      {link.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className={`hamburger ${menuOpen ? 'active' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </header>

      <div
        className={`mobile-menu-overlay ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(false)}
        style={{ display: menuOpen ? 'block' : undefined }}
      />

      <nav className={`nav-links-mobile ${menuOpen ? 'active' : ''}`} aria-label="Mobile">
        <span className="mobile-menu-header">Golden Roots</span>
        <button type="button" className="mobile-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
          &times;
        </button>
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              {link.isCart ? (
                <NavLink to={link.to} className={linkClass}>
                  <i className={`fas ${link.icon}`} />
                  Cart
                  {renderCartBadge('cartBadgeMobile')}
                </NavLink>
              ) : link.to.includes('#') ? (
                <Link to={link.to} onClick={() => setMenuOpen(false)}>
                  <i className={`fas ${link.icon}`} />
                  {link.label}
                </Link>
              ) : (
                <NavLink to={link.to} className={linkClass} end={link.to === '/'} onClick={() => setMenuOpen(false)}>
                  <i className={`fas ${link.icon}`} />
                  {link.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
