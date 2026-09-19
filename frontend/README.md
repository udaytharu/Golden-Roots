# Golden Roots

React storefront and admin dashboard for Golden Roots Pvt. Ltd., backed by an Express API.

## Run locally

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend, in a second terminal:

```bash
cd backend
npm install
npm start
```

The frontend runs at `http://localhost:5173`; the backend runs at `http://localhost:4000`. Vite proxies `/api` requests to the backend.

## Production API connection

Set this environment variable in Vercel for the frontend project, then redeploy:

```text
VITE_API_URL=https://your-render-service.onrender.com
```

Do not add `/api` to the value. The frontend adds that path to requests automatically. In Render, set `FRONTEND_ORIGIN` to the exact Vercel deployment URL, for example `https://your-store.vercel.app`, then redeploy the backend.

## Frontend scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview the production build |

## Storefront routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/about` | About |
| `/products` | Products |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/admin` | Admin dashboard |

## Admin dashboard

Open `http://localhost:5173/admin` and sign in with the backend token.

- **Overview**: revenue, seven-day sales line chart, and order pipeline
- **Products**: add, edit, search, and delete products
- **Promo Codes**: add, edit, enable/disable, and delete promo codes
- **Orders**: update status and expand rows for full customer, address, items, payment, and pricing details
- **Settings**: change the admin token

The development fallback token is `golden-roots-admin`. The active token is persisted in `backend/data/admin-token.json`.

## Backend API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/products` | Public catalog |
| `POST` | `/api/promos/validate` | Validate an active promo |
| `POST` | `/api/orders` | Create an order |
| `GET` | `/api/admin/summary` | Sales and status summary |
| `GET` | `/api/admin/products` | List products |
| `POST/PUT/DELETE` | `/api/admin/products` | Manage products |
| `GET` | `/api/admin/orders` | List orders |
| `PATCH` | `/api/admin/orders/:id` | Update order status |
| `GET/POST/PUT/DELETE` | `/api/admin/promos` | Manage promo codes |
| `PATCH` | `/api/admin/token` | Change admin token |

Admin endpoints require the `x-admin-token` header.

## Data files

- `backend/data/products.json`: active backend catalog and stock
- `backend/data/promos.json`: active promo catalog
- `backend/data/orders.json`: persisted orders
- `backend/data/admin-token.json`: persisted admin token
- `frontend/public/images/`: storefront images

The browser cart uses localStorage key `gr_cart`. For production, replace JSON storage and the development token with a database and proper authentication.
