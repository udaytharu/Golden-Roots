
export const PROMO_STORAGE_KEY = 'gr_promo';

export const PROMO_CODES = [
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
