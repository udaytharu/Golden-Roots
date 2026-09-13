# Golden Roots

React storefront for **Golden Roots Pvt. Ltd.** — Pure Nepali Spices.

Built with **Vite + React + React Router**.

---

## Getting started

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

### Scripts

| Command           | What it does              |
| ----------------- | ------------------------- |
| `npm run dev`     | Start development server  |
| `npm run build`   | Create production build   |
| `npm run preview` | Preview the production build |

---

## File structure

```
golden roots/
├── public/
│   └── images/
│       ├── about.jpg              # About page / home about preview
│       ├── banner.jpg             # Hero background
│       ├── logo.jpeg              # Site favicon / logo asset
│       ├── floating/              # Hero floating spice PNGs
│       │   ├── turmeric.png
│       │   ├── chilli.png
│       │   └── ...
│       └── products/              # Product card & modal images
│           ├── turmeric.jpeg
│           ├── chilli.jpeg
│           ├── cumin.jpeg
│           ├── coriander.jpeg
│           └── packets.jpeg
├── src/
│   ├── components/
│   │   ├── layout/                # Header, Footer, Layout, ScrollToTop
│   │   ├── products/              # ProductCard, ProductModal
│   │   └── ui/                    # Button, Toast, PageHero, FloatingSpices, StatsSection...
│   ├── context/
│   │   ├── CartContext.jsx        # Cart state + localStorage
│   │   └── ToastContext.jsx       # Toast notifications
│   ├── data/
│   │   ├── products.js            # ★ All products (add / edit here)
│   │   ├── promoCodes.js          # ★ Promo codes (add / edit here)
│   │   └── constants.js           # Site info, nav links, tax
│   ├── hooks/
│   │   └── useReveal.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Products.jsx
│   │   ├── Cart.jsx
│   │   └── Checkout.jsx
│   ├── styles/
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── products.css
│   │   └── pages/                 # home, about, products, cart-checkout
│   ├── App.jsx                    # Routes
│   └── main.jsx                   # App entry
├── index.html
├── package.json
└── vite.config.js
```

### Pages & routes

Routes are in **`src/App.jsx`**:

| Path         | Page        |
| ------------ | ----------- |
| `/`          | Home        |
| `/about`     | About       |
| `/products`  | Products    |
| `/cart`      | Cart        |
| `/checkout`  | Checkout    |


## Notes

- Cart is stored in the browser under the key `gr_cart`.
- Product images must live in `public/` so paths like `/images/products/...` work.
- After `npm run build`, output goes to the `dist/` folder for hosting.
