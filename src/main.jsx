import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/base.css';
import './styles/layout.css';
import './styles/products.css';
import './styles/pages/home.css';
import './styles/pages/products.css';
import './styles/pages/about.css';
import './styles/pages/cart-checkout.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
