const MEAL_ICONS = {
  Breakfast: '🍳', Lunch: '🥗', Dinner: '🍽️', Dessert: '🍰',
  Snack: '🥨', Appetizer: '🥟', 'Side Dish': '🥙', Drink: '🥤',
  Sauce: '🫙', default: '🍴',
};

const DIFFICULTY_COLOR = {
  Easy: 'tag--green',
  Medium: 'tag--yellow',
  Hard: 'tag--red',
};

export default function RecipeCard({ recipe, onClick }) {
  const name        = recipe['Name'] ?? 'Untitled';
  const contributor = recipe['Contributor'] ?? '';
  const mealType    = recipe['Meal Type'] ?? '';
  const cuisine     = recipe['Cuisine'] ?? '';
  const cookTime    = recipe['Cook Time (mins)'];
  const difficulty  = recipe['Difficulty'] ?? '';
  const icon        = MEAL_ICONS[mealType] ?? MEAL_ICONS.default;

  return (
    <button className="recipe-card" onClick={onClick} aria-label={`View recipe: ${name}`}>
      <div className="recipe-card-icon">{icon}</div>
      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{name}</h3>
        {contributor && (
          <p className="recipe-card-contributor">by {contributor}</p>
        )}
        <div className="recipe-card-tags">
          {mealType && <span className="tag tag--teal">{mealType}</span>}
          {cuisine  && <span className="tag tag--sand">{cuisine}</span>}
          {difficulty && (
            <span className={`tag ${DIFFICULTY_COLOR[difficulty] ?? 'tag--sand'}`}>
              {difficulty}
            </span>
          )}
          {cookTime && (
            <span className="tag tag--plain">⏱ {cookTime} min</span>
          )}
        </div>
      </div>
    </button>
  );
}
