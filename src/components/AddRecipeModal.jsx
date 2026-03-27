import { useState, useEffect } from 'react';
import { submitRecipe } from '../utils/submitRecipe';
import { APPS_SCRIPT_URL } from '../config';

const MEAL_TYPES   = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer', 'Side Dish', 'Drink', 'Sauce', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const UNITS        = ['tsp', 'tbsp', 'cup', 'oz', 'lb', 'g', 'kg', 'ml', 'l', 'piece', 'pinch', 'clove', 'slice', 'can', 'package', 'bunch', 'quart', 'gallon', 'to taste'];

const EMPTY_INGREDIENT = { name: '', quantity: '', unit: 'cup' };

const EMPTY_FORM = {
  name: '', contributor: '', originStory: '', familyBranch: '',
  mealType: '', cuisine: '', occasion: '', cookMethod: '',
  difficulty: '', cookTime: '', servings: '', primaryProtein: '',
  dietaryFlags: '', keyIngredients: '', instructions: '', notes: '',
  isOriginalRecipe: 'No',
};

export default function AddRecipeModal({ onClose, onSuccess }) {
  const [form, setForm]           = useState(EMPTY_FORM);
  const [ingredients, setIngredients] = useState([{ ...EMPTY_INGREDIENT }]);
  const [status, setStatus]       = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg]   = useState('');

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function setIngredientField(index, key, value) {
    setIngredients(prev => prev.map((ing, i) => i === index ? { ...ing, [key]: value } : ing));
  }

  function addIngredient() {
    setIngredients(prev => [...prev, { ...EMPTY_INGREDIENT }]);
  }

  function removeIngredient(index) {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    setStatus('submitting');
    setErrorMsg('');

    try {
      await submitRecipe({
        ...form,
        ingredients: ingredients.filter(i => i.name.trim()),
      });
      setStatus('success');
      setTimeout(() => {
        onSuccess(form.name);
        onClose();
      }, 1800);
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  }

  const notConfigured = !APPS_SCRIPT_URL || APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE';

  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">

        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">🌺 Add a Recipe</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {notConfigured && (
          <div className="form-banner form-banner--warn">
            ⚠️ Apps Script URL not set up yet. Submissions won't save until you complete Step 2 in <code>src/config.js</code>.
          </div>
        )}

        {status === 'success' && (
          <div className="form-banner form-banner--success">
            ✅ Recipe added! It'll appear in the app once the sheet refreshes.
          </div>
        )}

        {status === 'error' && (
          <div className="form-banner form-banner--error">
            ❌ {errorMsg}
          </div>
        )}

        <form className="add-recipe-form" onSubmit={handleSubmit} noValidate>
          <div className="modal-body">

            {/* ── Basic Info ─────────────────────────────── */}
            <section className="form-section">
              <h3 className="form-section-title">Basic Info</h3>
              <div className="form-grid">
                <div className="form-field form-field--full">
                  <label className="form-label" htmlFor="f-name">Recipe Name <span className="required">*</span></label>
                  <input id="f-name" className="form-input" type="text" required
                    value={form.name} onChange={e => setField('name', e.target.value)}
                    placeholder="e.g. Auntie Rose's Chicken Long Rice" />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="f-contributor">Contributor</label>
                  <input id="f-contributor" className="form-input" type="text"
                    value={form.contributor} onChange={e => setField('contributor', e.target.value)}
                    placeholder="e.g. Maile Diego" />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="f-branch">Family Branch</label>
                  <input id="f-branch" className="form-input" type="text"
                    value={form.familyBranch} onChange={e => setField('familyBranch', e.target.value)}
                    placeholder="e.g. Diego side" />
                </div>
                <div className="form-field form-field--full">
                  <label className="form-label" htmlFor="f-origin">Origin Story</label>
                  <textarea id="f-origin" className="form-input form-textarea" rows={2}
                    value={form.originStory} onChange={e => setField('originStory', e.target.value)}
                    placeholder="Where did this recipe come from? Any family memories?" />
                </div>
                <div className="form-field">
                  <label className="form-label">Original Family Recipe?</label>
                  <div className="radio-group">
                    {['Yes', 'No'].map(v => (
                      <label key={v} className="radio-label">
                        <input type="radio" name="isOriginal" value={v}
                          checked={form.isOriginalRecipe === v}
                          onChange={() => setField('isOriginalRecipe', v)} />
                        {v}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── Classification ─────────────────────────── */}
            <section className="form-section">
              <h3 className="form-section-title">Classification</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label" htmlFor="f-mealtype">Meal Type</label>
                  <select id="f-mealtype" className="form-select"
                    value={form.mealType} onChange={e => setField('mealType', e.target.value)}>
                    <option value="">Select…</option>
                    {MEAL_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="f-cuisine">Cuisine</label>
                  <input id="f-cuisine" className="form-input" type="text"
                    value={form.cuisine} onChange={e => setField('cuisine', e.target.value)}
                    placeholder="e.g. Hawaiian, Japanese" />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="f-cookmethod">Cook Method</label>
                  <input id="f-cookmethod" className="form-input" type="text"
                    value={form.cookMethod} onChange={e => setField('cookMethod', e.target.value)}
                    placeholder="e.g. Bake, Stovetop, Grill" />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="f-occasion">Occasion</label>
                  <input id="f-occasion" className="form-input" type="text"
                    value={form.occasion} onChange={e => setField('occasion', e.target.value)}
                    placeholder="e.g. Holidays, Potluck, Everyday" />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="f-difficulty">Difficulty</label>
                  <select id="f-difficulty" className="form-select"
                    value={form.difficulty} onChange={e => setField('difficulty', e.target.value)}>
                    <option value="">Select…</option>
                    {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="f-protein">Primary Protein</label>
                  <input id="f-protein" className="form-input" type="text"
                    value={form.primaryProtein} onChange={e => setField('primaryProtein', e.target.value)}
                    placeholder="e.g. Chicken, Pork, Seafood" />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="f-cooktime">Cook Time (mins)</label>
                  <input id="f-cooktime" className="form-input" type="number" min={0}
                    value={form.cookTime} onChange={e => setField('cookTime', e.target.value)}
                    placeholder="e.g. 45" />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="f-servings">Servings</label>
                  <input id="f-servings" className="form-input" type="number" min={1}
                    value={form.servings} onChange={e => setField('servings', e.target.value)}
                    placeholder="e.g. 6" />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="f-dietary">Dietary Flags</label>
                  <input id="f-dietary" className="form-input" type="text"
                    value={form.dietaryFlags} onChange={e => setField('dietaryFlags', e.target.value)}
                    placeholder="e.g. Gluten-free, Dairy-free" />
                </div>
              </div>
            </section>

            {/* ── Ingredients ────────────────────────────── */}
            <section className="form-section">
              <h3 className="form-section-title">Ingredients</h3>
              <div className="ingredient-form-list">
                {ingredients.map((ing, i) => (
                  <div key={i} className="ingredient-form-row">
                    <input className="form-input ing-name" type="text"
                      placeholder="Ingredient name"
                      value={ing.name} onChange={e => setIngredientField(i, 'name', e.target.value)} />
                    <input className="form-input ing-qty" type="number" min={0} step="any"
                      placeholder="Qty"
                      value={ing.quantity} onChange={e => setIngredientField(i, 'quantity', e.target.value)} />
                    <select className="form-select ing-unit"
                      value={ing.unit} onChange={e => setIngredientField(i, 'unit', e.target.value)}>
                      {UNITS.map(u => <option key={u}>{u}</option>)}
                    </select>
                    {ingredients.length > 1 && (
                      <button type="button" className="ing-remove" onClick={() => removeIngredient(i)} aria-label="Remove">✕</button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" className="btn-add-ingredient" onClick={addIngredient}>
                + Add ingredient
              </button>
            </section>

            {/* ── Instructions & Notes ───────────────────── */}
            <section className="form-section">
              <h3 className="form-section-title">Instructions & Notes</h3>
              <div className="form-grid">
                <div className="form-field form-field--full">
                  <label className="form-label" htmlFor="f-instructions">Instructions</label>
                  <textarea id="f-instructions" className="form-input form-textarea" rows={6}
                    value={form.instructions} onChange={e => setField('instructions', e.target.value)}
                    placeholder="Write each step on a new line, or number them (1. 2. 3.)" />
                </div>
                <div className="form-field form-field--full">
                  <label className="form-label" htmlFor="f-notes">Notes & Variations</label>
                  <textarea id="f-notes" className="form-input form-textarea" rows={3}
                    value={form.notes} onChange={e => setField('notes', e.target.value)}
                    placeholder="Tips, substitutions, family variations…" />
                </div>
                <div className="form-field form-field--full">
                  <label className="form-label" htmlFor="f-keyings">Key Ingredients (short list)</label>
                  <input id="f-keyings" className="form-input" type="text"
                    value={form.keyIngredients} onChange={e => setField('keyIngredients', e.target.value)}
                    placeholder="e.g. chicken, ginger, coconut milk" />
                </div>
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!form.name.trim() || status === 'submitting'}
            >
              {status === 'submitting' ? 'Saving…' : '🌺 Save Recipe'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
