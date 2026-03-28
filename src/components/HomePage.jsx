import { useMemo } from 'react';
import RecipeCard from './RecipeCard';

const MEAL_TYPES = [
  { label: 'Breakfast', icon: '🍳' },
  { label: 'Lunch',     icon: '🥗' },
  { label: 'Dinner',    icon: '🍽️' },
  { label: 'Dessert',   icon: '🍰' },
  { label: 'Snack',     icon: '🥨' },
  { label: 'Side Dish', icon: '🥙' },
  { label: 'Drink',     icon: '🥤' },
  { label: 'Sauce',     icon: '🫙' },
];

export default function HomePage({ recipes, ingredientsByRecipe, onSelectRecipe, onBrowse }) {
  const stats = useMemo(() => {
    const contributors = new Set(recipes.map(r => r['Contributor']).filter(Boolean));
    const cuisines     = new Set(recipes.map(r => r['Cuisine']).filter(Boolean));
    const originals    = recipes.filter(r => r['Is Original Recipe']?.toLowerCase() === 'yes');
    return {
      total: recipes.length,
      contributors: contributors.size,
      cuisines: cuisines.size,
      originals: originals.length,
    };
  }, [recipes]);

  const featured = useMemo(() => {
    if (recipes.length === 0) return [];
    return [...recipes].sort(() => Math.random() - 0.5).slice(0, 3);
  }, [recipes]);

  const mealTypeCounts = useMemo(() => {
    const counts = {};
    for (const r of recipes) {
      const t = r['Meal Type'];
      if (t) counts[t] = (counts[t] || 0) + 1;
    }
    return counts;
  }, [recipes]);

  return (
    <div className="home-page">

      {/* ── Book Cover Hero ─────────────────────────────── */}
      <section className="home-hero">
        <div className="hero-cover-wrap">
          <div className="hero-cover-lei" aria-hidden="true">
            {'🌸'.repeat(18)}
          </div>
          <div className="hero-cover-inner">
            <img
              src="cookbook-cover.jpg"
              alt="Winona Diego's Cook Book — Issue 1, December 25, 1998"
              className="hero-cover-img"
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="hero-cover-text">
              <p className="hero-cover-label">The Original</p>
              <h1 className="hero-cover-title">Winona Diego's<br />Cook Book</h1>
              <p className="hero-cover-issue">Issue 1 · December 25, 1998</p>
            </div>
          </div>
        </div>

        <div className="hero-content">
          <h2 className="hero-subtitle-heading">Jr Diego ʻOhana Cookbook</h2>
          <p className="hero-subtitle">
            Generations of family recipes from Hāna, Maui — lovingly gathered
            and kept alive for the whole ʻohana.
          </p>
          <button className="btn btn-hero" onClick={() => onBrowse()}>
            Browse All Recipes →
          </button>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────── */}
      {recipes.length > 0 && (
        <section className="home-stats">
          {[
            { number: stats.total,        label: 'Recipes' },
            { number: stats.contributors, label: 'Contributors' },
            { number: stats.cuisines,     label: 'Cuisines' },
            { number: stats.originals,    label: 'Original Recipes' },
          ].map(({ number, label }) => (
            <div className="stat-card" key={label}>
              <span className="stat-card-number">{number}</span>
              <span className="stat-card-label">{label}</span>
            </div>
          ))}
        </section>
      )}

      {/* ── Browse by Meal Type ─────────────────────────── */}
      {recipes.length > 0 && (
        <section className="home-section">
          <h2 className="home-section-title">Browse by Meal Type</h2>
          <div className="meal-type-grid">
            {MEAL_TYPES.filter(m => mealTypeCounts[m.label]).map(({ label, icon }) => (
              <button
                key={label}
                className="meal-type-card"
                onClick={() => onBrowse({ mealType: label })}
              >
                <span className="meal-type-icon">{icon}</span>
                <span className="meal-type-label">{label}</span>
                <span className="meal-type-count">{mealTypeCounts[label]}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Featured Recipes ───────────────────────────── */}
      {featured.length > 0 && (
        <section className="home-section">
          <h2 className="home-section-title">Featured Recipes</h2>
          <p className="home-section-sub">A few picks — refresh for different ones.</p>
          <div className="featured-grid">
            {featured.map(recipe => (
              <RecipeCard
                key={recipe['Name']}
                recipe={recipe}
                onClick={() => onSelectRecipe(recipe)}
              />
            ))}
          </div>
        </section>
      )}

      <footer className="home-footer">
        <p>🌺 In memory of all the hands that cooked these meals with love.</p>
      </footer>

    </div>
  );
}
