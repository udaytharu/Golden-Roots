---

## How to add a product

### 1. Add the product image

Put the image file in:

```
public/images/products/
```

Example: `public/images/products/cardamom.jpeg`

Use a clear photo (square works best). Supported types: `.jpeg`, `.jpg`, `.png`, `.webp`.

### 2. Add the product data

Open **`src/data/products.js`** and add a new object to the `PRODUCTS` array.

```js
{
  id: 'cardamom',                    // unique id (lowercase, no spaces)
  name: 'Cardamom',
  desc: 'Short description for the product card.',
  longDesc: 'Longer description shown in the Details / Quick View modal.',
  price: 450,                        // number in NPR (no currency symbol)
  img: '/images/products/cardamom.jpeg',
  tag: 'New',                        // 'Best Seller' | 'New' | '' (empty = no badge)
  category: 'new',                   // 'best' | 'new' | 'normal' (used by filters)
  rating: 4.7,                       // e.g. 4.5 – 5.0
  reviews: 40,                       // number of reviews
  features: ['Aromatic', 'Premium', 'Fresh'],
},
```

### 3. (Optional) Show it on the home page

The home “Premium Collection” only shows featured products. Edit this line in the same file:

```js
export const FEATURED_PRODUCT_IDS = ['turmeric', 'chili', 'cumin', 'coriander'];
```

Add your new `id` if you want it on the home grid, for example:

```js
export const FEATURED_PRODUCT_IDS = ['turmeric', 'chili', 'cumin', 'coriander', 'cardamom'];
```

The **Products** page always shows every item in `PRODUCTS`.

### 4. Save and refresh

The dev server hot-reloads. Refresh the browser if needed. The new product appears in the shop, cart, and checkout automatically.

---

## How to edit a product

1. Open **`src/data/products.js`**.
2. Find the product by `id` or `name`.
3. Change any field:
   - **Price** → update `price`
   - **Name / description** → update `name`, `desc`, `longDesc`
   - **Image** → replace the file in `public/images/products/` (same filename), **or** change the `img` path
   - **Badge** → set `tag` to `'Best Seller'`, `'New'`, or `''`
   - **Filter group** → set `category` to `'best'`, `'new'`, or `'normal'`
4. Save the file.

### Change product order

Products appear in the order they are listed in the `PRODUCTS` array. Move an object higher or lower in the array to reorder it.  
*(“Featured” sort on the Products page uses this same order.)*

### Remove a product

Delete its object from the `PRODUCTS` array, and remove its `id` from `FEATURED_PRODUCT_IDS` if it is listed there.

---

## Product field reference

| Field       | Type     | Description                                      |
| ----------- | -------- | ------------------------------------------------ |
| `id`        | string   | Unique key used by cart (`gr_cart` in localStorage) |
| `name`      | string   | Display name                                     |
| `desc`      | string   | Short text on product cards                      |
| `longDesc`  | string   | Full text in the details modal                   |
| `price`     | number   | Price in Rs. (NPR)                               |
| `img`       | string   | Path starting with `/images/products/...`        |
| `tag`       | string   | Badge label (`Best Seller`, `New`, or empty)     |
| `category`  | string   | Filter: `best` / `new` / `normal`                |
| `rating`    | number   | Star rating value                                |
| `reviews`   | number   | Review count                                     |
| `features`  | string[] | Small feature chips on the card                  |

---