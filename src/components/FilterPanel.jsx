import { useState } from 'react';

const FILTER_LABELS = {
  mealType:      'Meal Type',
  cuisine:       'Cuisine',
  cookMethod:    'Cook Method',
  primaryProtein:'Protein',
  contributor:   'Contributor',
  occasion:      'Occasion',
};

export default function FilterPanel({ filters, setFilters, options, activeCount }) {
  const [open, setOpen] = useState(false);

  function handleChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function clearAll() {
    setFilters({ mealType: '', cuisine: '', cookMethod: '', primaryProtein: '', contributor: '', occasion: '' });
  }

  return (
    <div className="filter-panel">
      {/* Mobile toggle */}
      <button
        className={`filter-toggle ${open ? 'filter-toggle--open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span>🔧 Filters</span>
        {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
        <span className="filter-toggle-arrow">{open ? '▲' : '▼'}</span>
      </button>

      <div className={`filter-body ${open ? 'filter-body--open' : ''}`}>
        {activeCount > 0 && (
          <button className="filter-clear-all" onClick={clearAll}>
            Clear all filters
          </button>
        )}

        {Object.entries(FILTER_LABELS).map(([key, label]) => {
          const opts = options[key] ?? [];
          if (opts.length === 0) return null;
          return (
            <div key={key} className="filter-group">
              <label className="filter-label" htmlFor={`filter-${key}`}>{label}</label>
              <select
                id={`filter-${key}`}
                className={`filter-select ${filters[key] ? 'filter-select--active' : ''}`}
                value={filters[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              >
                <option value="">All</option>
                {opts.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
