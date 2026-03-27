import { APPS_SCRIPT_URL } from '../config';

/**
 * Submits a new recipe to Google Sheets via Apps Script web app.
 * Uses text/plain content type to avoid CORS preflight.
 */
export async function submitRecipe(recipeData) {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
    throw new Error('Apps Script URL not configured. See src/config.js.');
  }

  // Google Apps Script requires no-cors to avoid CORS preflight failure.
  // We can't read the response in no-cors mode, so we assume success if fetch doesn't throw.
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(recipeData),
  });
}
