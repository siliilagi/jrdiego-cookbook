// ─────────────────────────────────────────────
//  STEP 1: Paste your Google Sheet ID here.
//  Find it in your sheet URL:
//  https://docs.google.com/spreadsheets/d/  ← YOUR_SHEET_ID →  /edit
// ─────────────────────────────────────────────
export const SHEET_ID = '1HGdDijNS-1VZR8BAj2GhHEkMrP9eTVqRL9wqopyPgN0';

// ─────────────────────────────────────────────
//  STEP 2: After deploying the Apps Script,
//  paste the web app URL here.
// ─────────────────────────────────────────────
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwTY02mKFnY7mStx4j5dDXMrhgNzdv69Rmu1w2N44WsIgBa7qtkSWH5f5rYSn3X9hc0aw/exec';

export const RECIPES_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Recipes`;

export const INGREDIENTS_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Ingredients`;
