/**
 * ============================================================
 *  PROMO CODES — edit this file to add / change / disable codes
 * ============================================================
 *
 * How to add a promo:
 *  1. Copy one object below
 *  2. Change `code`, `discount`, and `label`
 *  3. Set `active: true` to enable it
 *
 * discount: 0.1 = 10% off, 0.15 = 15% off, 0.2 = 20% off
 * ============================================================
 */

export const PROMO_STORAGE_KEY = 'gr_promo';

export const PROMO_CODES = [
  {
    code: 'GOLDEN10',
    discount: 0.1, // 10% off
    label: '10% off',
    active: true,
  },
  // Example — uncomment or copy to add more:
  // {
  //   code: 'SPICE15',
  //   discount: 0.15,
  //   label: '15% off',
  //   active: true,
  // },
  // {
  //   code: 'WELCOME20',
  //   discount: 0.2,
  //   label: '20% off',
  //   active: false, // inactive codes cannot be applied
  // },
];

/** Find an active promo by code (case-insensitive). */
export function findPromo(code) {
  const trimmed = String(code || '')
    .trim()
    .toUpperCase();
  if (!trimmed) return null;
  return (
    PROMO_CODES.find((p) => p.active && p.code.toUpperCase() === trimmed) || null
  );
}

/** Percent number for display, e.g. 0.1 → 10 */
export function promoPercent(promo) {
  if (!promo) return 0;
  return Math.round(promo.discount * 100);
}

/** Validate saved promo from localStorage against current list. */
export function getValidSavedPromo(savedCode) {
  return findPromo(savedCode);
}
