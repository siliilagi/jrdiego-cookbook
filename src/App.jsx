import { useState } from 'react';
import { useRecipes } from './hooks/useRecipes';
import { SHEET_ID } from './config';
import Header from './components/Header';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';

function SetupBanner() {
  return (
    <div className="setup-banner">
      <div className="setup-inner">
        <h2>🌺 Almost ready!</h2>
        <p>Open <code>src/config.js</code> and replace <code>YOUR_SHEET_ID_HERE</code> with your Google Sheet ID.</p>
        <p className="setup-hint">
          Your Sheet ID is the long string in your Google Sheets URL:<br />
          <code>https://docs.google.com/spreadsheets/d/<strong>← ID HERE →</strong>/edit</code>
        </p>
        <p>Also make sure your sheet is <strong>File → Share → Publish to web</strong>.</p>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-flower">🌺</div>
      <p>Loading recipes…</p>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div className="error-screen">
      <p className="error-emoji">🌊</p>
      <h2>Something went wrong</h2>
      <p>{message}</p>
      <p className="error-hint">
        Make sure your Google Sheet is published publicly:<br />
        <em>File → Share → Publish to web → Publish</em>
      </p>
    </div>
  );
}

export default function App() {
  const { recipes, ingredientsByRecipe, filterOptions, loading, error } = useRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [search, setSearch]   = useState('');
  const [filters, setFilters] = useState({
    mealType: '', cuisine: '', cookMethod: '',
    primaryProtein: '', contributor: '', occasion: '',
  });

  function handleSurpriseMe() {
    if (recipes.length === 0) return;
    const r = recipes[Math.floor(Math.random() * recipes.length)];
    setSelectedRecipe(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleHome() {
    setSelectedRecipe(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app">
      <Header
        onHome={handleHome}
        onSurpriseMe={handleSurpriseMe}
        recipesLoaded={recipes.length > 0}
      />

      {error === 'setup' && <SetupBanner />}
      {error && error !== 'setup' && <ErrorScreen message={error} />}
      {loading && <LoadingScreen />}

      {!loading && !error && (
        selectedRecipe ? (
          <RecipeDetail
            recipe={selectedRecipe}
            ingredients={ingredientsByRecipe[selectedRecipe['Name']] ?? []}
            onBack={handleHome}
          />
        ) : (
          <RecipeList
            recipes={recipes}
            ingredientsByRecipe={ingredientsByRecipe}
            onSelectRecipe={(r) => {
              setSelectedRecipe(r);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            search={search}
            setSearch={setSearch}
            filters={filters}
            setFilters={setFilters}
            filterOptions={filterOptions}
          />
        )
      )}
    </div>
  );
}
