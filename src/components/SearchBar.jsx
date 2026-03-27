export default function SearchBar({ value, onChange, resultCount, total }) {
  return (
    <div className="search-bar">
      <div className="search-input-wrap">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="search"
          className="search-input"
          placeholder="Search recipes or ingredients…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search recipes"
        />
        {value && (
          <button className="search-clear" onClick={() => onChange('')} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>
      {value && (
        <p className="search-results-count">
          {resultCount === 0
            ? 'No recipes found'
            : `${resultCount} of ${total} recipe${total !== 1 ? 's' : ''}`}
        </p>
      )}
    </div>
  );
}
