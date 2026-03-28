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
  // Stats
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

  // 3 random featured recipes (stable per session)
  const featured = useMemo(() => {
    if (recipes.length === 0) return [];
    const shuffled = [...recipes].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [recipes]);

  // Meal type counts
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

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to the<br />
            <span className="hero-title-accent">Jr Diego ʻOhana Cookbook</span>
          </h1>
          <p className="hero-subtitle">
            Generations of family recipes from Hāna, Maui — lovingly gathered
            from Winona Diego's Cookbook (1998) and passed down through the ʻohana.
          </p>
          <button className="btn btn-hero" onClick={() => onBrowse()}>
            Browse All Recipes →
          </button>
        </div>
        <div className="hero-flowers" aria-hidden="true">
          <span>🌺</span><span>🌸</span><span>🌺</span>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────── */}
      {recipes.length > 0 && (
        <section className="home-stats">
          <div className="stat-card">
            <span className="stat-card-number">{stats.total}</span>
            <span className="stat-card-label">Recipes</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-number">{stats.contributors}</span>
            <span className="stat-card-label">Contributors</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-number">{stats.cuisines}</span>
            <span className="stat-card-label">Cuisines</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-number">{stats.originals}</span>
            <span className="stat-card-label">Original Recipes</span>
          </div>
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
          <p className="home-section-sub">A few picks from the cookbook — refresh for different ones.</p>
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

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="home-footer">
        <p>🌺 In memory of all the hands that cooked these meals with love.</p>
      </footer>

    </div>
  );
}
