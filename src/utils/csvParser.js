import Papa from 'papaparse';

/**
 * Fetches a Google Sheets CSV URL and returns parsed rows as an array of objects.
 * Headers become object keys, trimmed of whitespace.
 */
export async function fetchCSV(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch data (${res.status}). Check that your Google Sheet is published publicly.`);
  const text = await res.text();

  const { data, errors } = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
    transform: (v) => v.trim(),
  });

  if (errors.length) {
    console.warn('CSV parse warnings:', errors);
  }

  return data;
}
