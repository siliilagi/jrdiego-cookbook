export default function ServingScaler({ baseServings, servings, setServings, unitSystem, setUnitSystem }) {
  const base = parseFloat(baseServings) || 1;

  function decrement() { setServings(v => Math.max(1, v - 1)); }
  function increment() { setServings(v => v + 1); }

  return (
    <div className="serving-scaler">
      <div className="scaler-row">
        <div className="scaler-group">
          <label className="scaler-label">Servings</label>
          <div className="scaler-stepper">
            <button className="stepper-btn" onClick={decrement} aria-label="Fewer servings">−</button>
            <input
              type="number"
              className="stepper-input"
              min={1}
              value={servings}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v) && v > 0) setServings(v);
              }}
              aria-label="Number of servings"
            />
            <button className="stepper-btn" onClick={increment} aria-label="More servings">+</button>
          </div>
          {base !== servings && (
            <button className="scaler-reset" onClick={() => setServings(base)}>
              Reset to {base}
            </button>
          )}
        </div>

        <div className="scaler-group">
          <label className="scaler-label">Units</label>
          <div className="unit-tabs">
            {['original', 'imperial', 'metric'].map(sys => (
              <button
                key={sys}
                className={`unit-tab ${unitSystem === sys ? 'unit-tab--active' : ''}`}
                onClick={() => setUnitSystem(sys)}
              >
                {sys.charAt(0).toUpperCase() + sys.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {base !== servings && (
        <p className="scaler-note">
          Scaled ×{(servings / base).toFixed(2)} from original {base} serving{base !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
