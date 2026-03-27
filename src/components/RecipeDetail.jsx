import { useState } from 'react';
import ServingScaler from './ServingScaler';
import { convertUnit, formatQty } from '../utils/unitConversion';

function StatBadge({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="stat-badge">
      <span className="stat-icon" aria-hidden="true">{icon}</span>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}

function IngredientRow({ ingredient, scale, unitSystem }) {
  const name = ingredient['Ingredient Name'] ?? '';
  const rawQty  = parseFloat(ingredient['Quantity']);
  const rawUnit = ingredient['Unit'] ?? '';

  const scaledQty = isNaN(rawQty) ? null : rawQty * scale;
  const { qty: displayQty, unit: displayUnit } = scaledQty != null
    ? convertUnit(scaledQty, rawUnit, unitSystem)
    : { qty: scaledQty, unit: rawUnit };

  return (
    <li className="ingredient-row">
      <span className="ingredient-name">{name}</span>
      {displayQty != null && (
        <span className="ingredient-qty">
          {formatQty(displayQty)}{displayUnit ? ' ' + displayUnit : ''}
        </span>
      )}
    </li>
  );
}

function InstructionSteps({ text }) {
  if (!text) return <p className="no-content">No instructions provided.</p>;

  // Split on numbered steps, blank lines, or sentence breaks
  const lines = text
    .split(/\n+/)
    .map(l => l.trim())
    .filter(Boolean);

  // Check if lines already have numbers like "1." or "1)"
  const isNumbered = lines.some(l => /^\d+[\.\)]/.test(l));

  if (isNumbered) {
    return (
      <ol className="instruction-list">
        {lines.map((line, i) => (
          <li key={i}>{line.replace(/^\d+[\.\)]\s*/, '')}</li>
        ))}
      </ol>
    );
  }

  if (lines.length > 1) {
    return (
      <ol className="instruction-list">
        {lines.map((line, i) => <li key={i}>{line}</li>)}
      </ol>
    );
  }

  return <p className="instruction-prose">{text}</p>;
}

export default function RecipeDetail({ recipe, ingredients, onBack }) {
  const baseServings = parseFloat(recipe['Servings (Base)']) || 1;
  const [servings, setServings]       = useState(baseServings);
  const [unitSystem, setUnitSystem]   = useState('original');

  const scale = servings / baseServings;

  return (
    <article className="recipe-detail">
      {/* Back button */}
      <button className="back-btn" onClick={onBack}>
        ← Back to recipes
      </button>

      {/* Hero */}
      <header className="detail-header">
        <h1 className="detail-title">{recipe['Name']}</h1>
        {recipe['Contributor'] && (
          <p className="detail-contributor">
            Recipe by <strong>{recipe['Contributor']}</strong>
          </p>
        )}
        {recipe['Origin Story'] && (
          <blockquote className="detail-origin">
            "{recipe['Origin Story']}"
          </blockquote>
        )}
      </header>

      {/* Quick stats */}
      <div className="detail-stats">
        <StatBadge icon="⏱" label="Cook Time" value={recipe['Cook Time (mins)'] ? `${recipe['Cook Time (mins)']} min` : null} />
        <StatBadge icon="👥" label="Base Servings" value={recipe['Servings (Base)']} />
        <StatBadge icon="📊" label="Difficulty"  value={recipe['Difficulty']} />
        <StatBadge icon="🍽️" label="Meal Type"   value={recipe['Meal Type']} />
        <StatBadge icon="🌏" label="Cuisine"     value={recipe['Cuisine']} />
        <StatBadge icon="🔥" label="Cook Method" value={recipe['Cook Method']} />
        <StatBadge icon="🥩" label="Protein"     value={recipe['Primary Protein']} />
        <StatBadge icon="🎉" label="Occasion"    value={recipe['Occasion']} />
        {recipe['Dietary Flags'] && (
          <StatBadge icon="🌿" label="Dietary"   value={recipe['Dietary Flags']} />
        )}
        {recipe['Family Branch'] && (
          <StatBadge icon="👨‍👩‍👧" label="Family Branch" value={recipe['Family Branch']} />
        )}
      </div>

      {/* Serving scaler */}
      <ServingScaler
        baseServings={baseServings}
        servings={servings}
        setServings={setServings}
        unitSystem={unitSystem}
        setUnitSystem={setUnitSystem}
      />

      <div className="detail-body">
        {/* Ingredients */}
        <section className="detail-section">
          <h2 className="detail-section-title">Ingredients</h2>
          {ingredients.length === 0 ? (
            <p className="no-content">No ingredients listed.</p>
          ) : (
            <ul className="ingredient-list">
              {ingredients.map((ing, i) => (
                <IngredientRow
                  key={i}
                  ingredient={ing}
                  scale={scale}
                  unitSystem={unitSystem}
                />
              ))}
            </ul>
          )}
        </section>

        {/* Instructions */}
        <section className="detail-section">
          <h2 className="detail-section-title">Instructions</h2>
          <InstructionSteps text={recipe['Instructions']} />
        </section>

        {/* Notes */}
        {recipe['Notes/Variations'] && (
          <section className="detail-section detail-section--notes">
            <h2 className="detail-section-title">Notes & Variations</h2>
            <p>{recipe['Notes/Variations']}</p>
          </section>
        )}

        {/* Key Ingredients */}
        {recipe['Key Ingredients'] && (
          <section className="detail-section">
            <h2 className="detail-section-title">Key Ingredients</h2>
            <p className="key-ingredients">{recipe['Key Ingredients']}</p>
          </section>
        )}
      </div>

      {recipe['Is Original Recipe'] && recipe['Is Original Recipe'].toLowerCase() === 'yes' && (
        <div className="original-badge">
          ⭐ Original Family Recipe
        </div>
      )}
    </article>
  );
}
