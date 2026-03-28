export default function Header({ onHome, onSurpriseMe, onAddRecipe, recipesLoaded }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="header-logo" onClick={onHome} aria-label="Home">
          <span className="header-flower" aria-hidden="true">🌺</span>
          <div className="header-titles">
            <span className="header-title">Jr Diego ʻOhana Cookbook</span>
            <span className="header-subtitle">Hāna, Maui · Est. 1998</span>
          </div>
        </button>

        <div className="header-actions">
          <button className="btn btn-add-recipe" onClick={onAddRecipe} title="Add a new recipe">
            <span aria-hidden="true">+</span> Add Recipe
          </button>
          {recipesLoaded && (
            <button className="btn btn-surprise" onClick={onSurpriseMe} title="Show a random recipe">
              <span aria-hidden="true">🎲</span> Surprise Me
            </button>
          )}
        </div>
      </div>
      <div className="header-wave" aria-hidden="true" />
    </header>
  );
}
