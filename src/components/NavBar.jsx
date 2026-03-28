export default function NavBar({ activePage, setActivePage }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {[
          { id: 'home',    label: '🏠 Home' },
          { id: 'recipes', label: '📖 Recipes' },
        ].map(({ id, label }) => (
          <button
            key={id}
            className={`nav-tab ${activePage === id ? 'nav-tab--active' : ''}`}
            onClick={() => setActivePage(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
