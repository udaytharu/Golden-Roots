# Promo code management

## Use the admin panel

Open `http://localhost:5173/admin` and select **Promo Codes**.

Admins can:

- Add a code
- Set the discount percentage and label
- Enable or disable a code
- Edit a code
- Delete a code

Changes are saved to `backend/data/promos.json`. Customer cart validation and checkout use this backend catalog, so new codes work without a frontend rebuild.

## Promo fields

| Field | Example | Description |
| --- | --- | --- |
| `code` | `SPICE15` | Uppercase letters and numbers only |
| `discount` | `0.15` | Decimal rate; `0.15` means 15% off |
| `label` | `15% off` | Text shown in the cart |
| `active` | `true` | Only active codes can be applied |

## Manual editing

For maintenance or scripted deployments, edit `backend/data/promos.json` directly and keep the JSON valid:

```json
[
  {
    "code": "SPICE15",
    "discount": 0.15,
    "label": "15% off",
    "active": true
  }
]
```

Restart the backend after manual changes. `src/data/promoCodes.js` is retained for local saved-promo compatibility; the backend promo catalog is authoritative.
