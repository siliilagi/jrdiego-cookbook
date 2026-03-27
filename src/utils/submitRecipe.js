import { APPS_SCRIPT_URL } from '../config';

/**
 * Submits a new recipe to Google Sheets via Apps Script web app.
 * Uses text/plain content type to avoid CORS preflight.
 */
export async function submitRecipe(recipeData) {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
    throw new Error('Apps Script URL not configured. See src/config.js.');
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(recipeData),
  });

  if (!response.ok) {
    throw new Error(`Submission failed (${response.status})`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error ?? 'Unknown error from server');
  }

  return result;
}
