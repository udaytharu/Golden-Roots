### Promo codes


Edit **`src/data/promoCodes.js`**:

- Change `code`, `discount` (e.g. `0.1` = 10%), and `label`
- Set `active: true` to enable, `false` to disable
- Copy an object in `PROMO_CODES` to add more codes

====steps====
* How to add a promo:
 *  1. Copy one object below
 *  2. Change `code`, `discount`, and `label`
 *  3. Set `active: true` to enable it
 *
 * discount: 0.1 = 10% off, 0.15 = 15% off, 0.2 = 20% off


 // Example — uncomment or copy to add more:
     {
       code: 'SPICE15',
       discount: 0.15,
       label: '15% off',
       active: true,
     },
     {
       code: 'WELCOME20',
       discount: 0.2,
       label: '20% off',
       active: false, // inactive codes cannot be applied
     },