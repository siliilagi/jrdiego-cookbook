import { useMemo, useState } from 'react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import RecipeCard from './RecipeCard';

const SORT_OPTIONS = [
  { value: 'default',      label: 'Default' },
  { value: 'name-az',      label: 'Name A–Z' },
  { value: 'name-za',      label: 'Name Z–A' },
  { value: 'time-asc',     label: 'Cook Time ↑' },
  { value: 'time-desc',    label: 'Cook Time ↓' },
  { value: 'difficulty-asc',  label: 'Easiest First' },
  { value: 'difficulty-desc', label: 'Hardest First' },
  { value: 'contributor',  label: 'Contributor A–Z' },
];

const DIFFICULTY_RANK = { Easy: 1, Medium: 2, Hard: 3 };

function sortRecipes(recipes, sortBy) {
  const arr = [...recipes];
  switch (sortBy) {
    case 'name-az':
      return arr.sort((a, b) => (a['Name'] ?? '').localeCompare(b['Name'] ?? ''));
    case 'name-za':
      return arr.sort((a, b) => (b['Name'] ?? '').localeCompare(a['Name'] ?? ''));
    case 'time-asc':
      return arr.sort((a, b) => (parseFloat(a['Cook Time (mins)']) || 999) - (parseFloat(b['Cook Time (mins)']) || 999));
    case 'time-desc':
      return arr.sort((a, b) => (parseFloat(b['Cook Time (mins)']) || 0) - (parseFloat(a['Cook Time (mins)']) || 0));
    case 'difficulty-asc':
      return arr.sort((a, b) => (DIFFICULTY_RANK[a['Difficulty']] ?? 2) - (DIFFICULTY_RANK[b['Difficulty']] ?? 2));
    case 'difficulty-desc':
      return arr.sort((a, b) => (DIFFICULTY_RANK[b['Difficulty']] ?? 2) - (DIFFICULTY_RANK[a['Difficulty']] ?? 2));
    case 'contributor':
      return arr.sort((a, b) => (a['Contributor'] ?? '').localeCompare(b['Contributor'] ?? ''));
    default:
      return arr;
  }
}

export default function RecipeList({
  recipes,
  ingredientsByRecipe,
  onSelectRecipe,
  search, setSearch,
  filters, setFilters,
  filterOptions,
}) {
  const [sortBy, setSortBy] = useState('default');
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const result = recipes.filter(recipe => {
      if (q) {
        const nameMatch = recipe['Name']?.toLowerCase().includes(q);
        const ingMatch  = (ingredientsByRecipe[recipe['Name']] ?? [])
          .some(i => i['Ingredient Name']?.toLowerCase().includes(q));
        if (!nameMatch && !ingMatch) return false;
      }
      if (filters.mealType       && recipe['Meal Type']       !== filters.mealType)       return false;
      if (filters.cuisine        && recipe['Cuisine']         !== filters.cuisine)         return false;
      if (filters.cookMethod     && recipe['Cook Method']     !== filters.cookMethod)      return false;
      if (filters.primaryProtein && recipe['Primary Protein'] !== filters.primaryProtein) return false;
      if (filters.contributor    && recipe['Contributor']     !== filters.contributor)     return false;
      if (filters.occasion       && recipe['Occasion']        !== filters.occasion)        return false;
      return true;
    });

    return sortRecipes(result, sortBy);
  }, [recipes, ingredientsByRecipe, search, filters, sortBy]);

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
          <div className="sort-row">
            <label className="sort-label" htmlFor="sort-select">Sort</label>
            <select
              id="sort-select"
              className={`sort-select ${sortBy !== 'default' ? 'sort-select--active' : ''}`}
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
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
