import { useMemo } from 'react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import RecipeCard from './RecipeCard';

export default function RecipeList({
  recipes,
  ingredientsByRecipe,
  onSelectRecipe,
  search, setSearch,
  filters, setFilters,
  filterOptions,
}) {
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return recipes.filter(recipe => {
      // ── Search ───────────────────────────────────────────────────────
      if (q) {
        const nameMatch = recipe['Name']?.toLowerCase().includes(q);
        const ingMatch  = (ingredientsByRecipe[recipe['Name']] ?? [])
          .some(i => i['Ingredient Name']?.toLowerCase().includes(q));
        if (!nameMatch && !ingMatch) return false;
      }

      // ── Filters ──────────────────────────────────────────────────────
      if (filters.mealType      && recipe['Meal Type']       !== filters.mealType)       return false;
      if (filters.cuisine       && recipe['Cuisine']         !== filters.cuisine)         return false;
      if (filters.cookMethod    && recipe['Cook Method']     !== filters.cookMethod)      return false;
      if (filters.primaryProtein && recipe['Primary Protein'] !== filters.primaryProtein) return false;
      if (filters.contributor   && recipe['Contributor']     !== filters.contributor)     return false;
      if (filters.occasion      && recipe['Occasion']        !== filters.occasion)        return false;

      return true;
    });
  }, [recipes, ingredientsByRecipe, search, filters]);

  return (
    <main className="recipe-list-page">
      <div className="recipe-list-sidebar">
        <SearchBar
          value={search}
          onChange={setSearch}
          resultCount={filtered.length}
          total={recipes.length}
        />
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          options={filterOptions}
          activeCount={activeFilterCount}
        />
      </div>

      <div className="recipe-list-main">
        <div className="recipe-list-header">
          <h2 className="recipe-list-heading">
            {search || activeFilterCount > 0
              ? `${filtered.length} Recipe${filtered.length !== 1 ? 's' : ''} Found`
              : `All Recipes (${recipes.length})`}
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-emoji">🌊</p>
            <p>No recipes match your search.</p>
            <button className="btn btn-secondary" onClick={() => { setSearch(''); setFilters({ mealType: '', cuisine: '', cookMethod: '', primaryProtein: '', contributor: '', occasion: '' }); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="recipe-grid">
            {filtered.map(recipe => (
              <RecipeCard
                key={recipe['Name']}
                recipe={recipe}
                onClick={() => onSelectRecipe(recipe)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
