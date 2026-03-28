import { useState } from 'react';
import { useRecipes } from './hooks/useRecipes';
import { SHEET_ID } from './config';
import Header from './components/Header';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import AddRecipeModal from './components/AddRecipeModal';

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
  const [activePage, setActivePage]     = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [prevPage, setPrevPage]         = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch]   = useState('');
  const [filters, setFilters] = useState({
    mealType: '', cuisine: '', cookMethod: '',
    primaryProtein: '', contributor: '', occasion: '',
  });

  function handleSelectRecipe(recipe) {
    setPrevPage(activePage);
    setSelectedRecipe(recipe);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBack() {
    setSelectedRecipe(null);
    setActivePage(prevPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleHome() {
    setSelectedRecipe(null);
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSurpriseMe() {
    if (recipes.length === 0) return;
    const r = recipes[Math.floor(Math.random() * recipes.length)];
    handleSelectRecipe(r);
  }

  // Browse to recipes tab, optionally pre-setting a filter
  function handleBrowse(filterOverride = {}) {
    setFilters({ mealType: '', cuisine: '', cookMethod: '', primaryProtein: '', contributor: '', occasion: '', ...filterOverride });
    setSearch('');
    setActivePage('recipes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleNavChange(page) {
    setSelectedRecipe(null);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app">
      <Header
        onHome={handleHome}
        onSurpriseMe={handleSurpriseMe}
        onAddRecipe={() => setShowAddModal(true)}
        recipesLoaded={recipes.length > 0}
      />

      {!selectedRecipe && (
        <NavBar activePage={activePage} setActivePage={handleNavChange} />
      )}

      {showAddModal && (
        <AddRecipeModal
          onClose={() => setShowAddModal(false)}
          onSuccess={(name) => {
            setShowAddModal(false);
            setSearch(name);
            setActivePage('recipes');
          }}
        />
      )}

      {error === 'setup' && <SetupBanner />}
      {error && error !== 'setup' && <ErrorScreen message={error} />}
      {loading && <LoadingScreen />}

      {!loading && !error && (
        selectedRecipe ? (
          <RecipeDetail
            recipe={selectedRecipe}
            ingredients={ingredientsByRecipe[selectedRecipe['Name']] ?? []}
            onBack={handleBack}
          />
        ) : activePage === 'home' ? (
          <HomePage
            recipes={recipes}
            ingredientsByRecipe={ingredientsByRecipe}
            onSelectRecipe={handleSelectRecipe}
            onBrowse={handleBrowse}
          />
        ) : (
          <RecipeList
            recipes={recipes}
            ingredientsByRecipe={ingredientsByRecipe}
            onSelectRecipe={handleSelectRecipe}
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
