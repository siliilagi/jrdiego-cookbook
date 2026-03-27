// ─── Volume: base unit is ml ───────────────────────────────────────────────
const VOLUME_TO_ML = {
  tsp: 4.92892, teaspoon: 4.92892, teaspoons: 4.92892,
  tbsp: 14.7868, tablespoon: 14.7868, tablespoons: 14.7868,
  cup: 236.588, cups: 236.588,
  'fl oz': 29.5735, 'fluid oz': 29.5735,
  quart: 946.353, quarts: 946.353,
  gallon: 3785.41, gallons: 3785.41,
  ml: 1, milliliter: 1, milliliters: 1,
  l: 1000, liter: 1000, liters: 1000,
};

// ─── Weight: base unit is g ────────────────────────────────────────────────
const WEIGHT_TO_G = {
  oz: 28.3495, ounce: 28.3495, ounces: 28.3495,
  lb: 453.592, lbs: 453.592, pound: 453.592, pounds: 453.592,
  g: 1, gram: 1, grams: 1,
  kg: 1000, kilogram: 1000, kilograms: 1000,
};

function unitType(unit) {
  const u = unit.toLowerCase().trim();
  if (VOLUME_TO_ML[u] !== undefined) return 'volume';
  if (WEIGHT_TO_G[u] !== undefined) return 'weight';
  return null; // piece, pinch, clove, slice, can, etc. — not convertible
}

function smartVolume(ml, system) {
  if (system === 'metric') {
    if (ml >= 950) return { qty: round(ml / 1000, 2), unit: 'l' };
    return { qty: Math.round(ml), unit: 'ml' };
  }
  // imperial
  if (ml >= 236.588 * 0.75) return { qty: round(ml / 236.588, 2), unit: 'cup' };
  if (ml >= 14.7868)        return { qty: round(ml / 14.7868, 1), unit: 'tbsp' };
  return                           { qty: round(ml / 4.92892,  1), unit: 'tsp' };
}

function smartWeight(g, system) {
  if (system === 'metric') {
    if (g >= 950) return { qty: round(g / 1000, 2), unit: 'kg' };
    return { qty: Math.round(g), unit: 'g' };
  }
  // imperial
  if (g >= 453.592 * 0.75) return { qty: round(g / 453.592, 2), unit: 'lb' };
  return                          { qty: round(g / 28.3495,  1), unit: 'oz' };
}

function round(n, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}

/**
 * Converts a quantity+unit pair to the requested system.
 * @param {number} qty - original quantity
 * @param {string} unit - original unit string
 * @param {string} toSystem - 'original' | 'metric' | 'imperial'
 * @returns {{ qty: number, unit: string }}
 */
export function convertUnit(qty, unit, toSystem) {
  if (!qty || !unit || toSystem === 'original') return { qty, unit };
  const u = unit.toLowerCase().trim();
  const type = unitType(u);
  if (!type) return { qty, unit };

  if (type === 'volume') {
    const ml = qty * (VOLUME_TO_ML[u] ?? 1);
    return smartVolume(ml, toSystem);
  }
  if (type === 'weight') {
    const g = qty * (WEIGHT_TO_G[u] ?? 1);
    return smartWeight(g, toSystem);
  }
  return { qty, unit };
}

/** Format a quantity nicely: strip trailing zeros, handle fractions for small amounts */
export function formatQty(qty) {
  if (!qty && qty !== 0) return '';
  if (Number.isInteger(qty)) return String(qty);
  // Show up to 2 decimal places, no trailing zeros
  return parseFloat(qty.toFixed(2)).toString();
}
