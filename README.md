# 🌺 Diego Family Cookbook

A family recipe web app for the Diego ohana — recipes from Hāna, Maui, sourced from Winona Diego's Cookbook (1998).

**Live features:**
- Browse all 142 recipes with search + filters
- Filter by meal type, cuisine, cook method, protein, contributor, occasion
- Search by recipe name or ingredient
- Full recipe detail with origin stories and family notes
- Serving size scaler — scale any recipe up or down
- Unit conversion: Original / Imperial / Metric
- "Surprise Me" — random recipe button
- Fully mobile-friendly

---

## Step 1 — Connect your Google Sheet

### 1a. Publish your Google Sheet

Open your **Diego Cookbook** Google Sheet, then:

```
File → Share → Publish to web
  → Entire document
  → Web page
  → Publish
```

This makes it publicly readable (required for the app to fetch the data).

### 1b. Get your Sheet ID

Your Sheet ID is the long string in the URL:

```
https://docs.google.com/spreadsheets/d/  1ABCxyz123...  /edit
                                          ↑ this part ↑
```

### 1c. Paste it into the app

Open `src/config.js` and replace the placeholder:

```js
export const SHEET_ID = 'YOUR_SHEET_ID_HERE';
//                       ↑ paste your Sheet ID here
```

Make sure your two sheet tabs are named exactly:
- `Recipes`
- `Ingredients`

---

## Step 2 — Run locally

```bash
# Install dependencies (one time)
npm install

# Start dev server
npm run dev
```

Open http://localhost:5173 — the app loads your live Google Sheet data.

---

## Step 3 — Deploy to GitHub Pages

### 3a. Create a GitHub repository

1. Go to github.com → New repository
2. Name it (e.g. `diego-cookbook`)
3. Leave it public

### 3b. Update the base path

Open `vite.config.js` and set `base` to match your repo name:

```js
base: '/diego-cookbook/',   // ← must match your GitHub repo name exactly
```

### 3c. Push your code

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/diego-cookbook.git
git push -u origin main
```

### 3d. Deploy

```bash
npm run deploy
```

This builds the app and pushes it to the `gh-pages` branch automatically.

### 3e. Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** → **/ (root)**
4. Save

Your app will be live at:
```
https://YOUR_USERNAME.github.io/diego-cookbook/
```

It may take 1–2 minutes for GitHub to publish it.

### Re-deploying after changes

Any time you edit `src/config.js` or other files:

```bash
npm run deploy
```

---

## Adding new recipes

1. Open the **Diego Cookbook** Google Sheet
2. Add a new row to the **Recipes** tab
3. Add the ingredients to the **Ingredients** tab (set the `Recipe` column to the exact recipe name)
4. That's it — the app auto-updates on every page load. No re-deploy needed.

---

## Sheet column reference

### Recipes tab
| Column | Description |
|--------|-------------|
| Name | Recipe name (must be unique — used to link ingredients) |
| Contributor | Family member who contributed the recipe |
| Origin Story | Short story or context about the recipe |
| Family Branch | Which branch of the family |
| Meal Type | Breakfast / Lunch / Dinner / Dessert / Snack / etc. |
| Cuisine | Hawaiian / Japanese / Korean / Filipino / etc. |
| Occasion | Holidays, parties, everyday, etc. |
| Cook Method | Bake / Grill / Steam / Fry / etc. |
| Difficulty | Easy / Medium / Hard |
| Cook Time (mins) | Number of minutes |
| Servings (Base) | Original serving count (used for scaling) |
| Primary Protein | Chicken / Beef / Pork / Seafood / Vegetarian / etc. |
| Dietary Flags | Gluten-free / Dairy-free / etc. |
| Key Ingredients | Comma-separated list of key ingredients |
| Instructions | Step-by-step instructions (one step per line works best) |
| Notes/Variations | Optional notes, substitutions, tips |
| Is Original Recipe | Yes / No |

### Ingredients tab
| Column | Description |
|--------|-------------|
| Ingredient Name | Name of the ingredient |
| Quantity | Number (e.g. `2`, `0.5`) |
| Unit | tsp / tbsp / cup / oz / lb / g / kg / ml / l / piece / pinch / clove / slice / can / package / bunch / quart / gallon / to taste |
| Recipe | Must match the recipe `Name` exactly |

---

## Future phases

- **PDF generator** — export any recipe (or the full cookbook) as a PDF
- **iOS app** — React Native using the same data source
- **Recipe submission form** — Google Form → Google Sheet → auto-appears in app

---

## Tech stack

| | |
|--|--|
| Frontend | React 18 + Vite |
| Data | Google Sheets (CSV via gviz API) |
| Hosting | GitHub Pages |
| CSS | Plain CSS (no framework) |
| Fonts | Lora (serif headings) + Inter (body) |
