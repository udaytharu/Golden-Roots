# Product management

## Recommended: admin panel

Open `http://localhost:5173/admin`, sign in, and select **Products**. Admins can add, edit, search, and delete products without changing code.

Admin changes are saved to `backend/data/products.json` and affect the public backend catalog and future checkout pricing.

## Product images

Put product images in:

```text
frontend/public/images/products/
```

Use a path such as `/images/products/cardamom.jpeg` in the product editor.

## Manual storefront data

The frontend display fallback is in `src/data/products.js`. Add an object to the `PRODUCTS` array when maintaining the source catalog manually:

```js
{
  id: 'cardamom',
  name: 'Cardamom',
  desc: 'Short product description.',
  longDesc: 'Long product description for the details modal.',
  price: 450,
  img: '/images/products/cardamom.jpeg',
  tag: 'New',
  category: 'new',
  rating: 4.7,
  reviews: 40,
  features: ['Aromatic', 'Premium', 'Fresh'],
}
```

Product IDs must be unique. Backend admin IDs use lowercase letters, numbers, and hyphens.

## Featured products

Change `FEATURED_PRODUCT_IDS` in `src/data/products.js` to control the home page collection. The Products page displays the full catalog.

## Product fields

| Field | Type | Purpose |
| --- | --- | --- |
| `id` | string | Unique cart and API identifier |
| `name` | string | Display name |
| `desc` | string | Short card description |
| `longDesc` | string | Details modal description |
| `price` | number | Price in NPR |
| `img` | string | Public image path |
| `tag` | string | Badge such as `New` or `Best Seller` |
| `category` | string | `best`, `new`, or `normal` |
| `rating` | number | Star rating |
| `reviews` | number | Review count |
| `features` | string[] | Product feature labels |
| `stock` | number | Backend quantity available |
