import { useState, useEffect, useMemo } from 'react';
import { fetchCSV } from '../utils/csvParser';
import { RECIPES_URL, INGREDIENTS_URL, SHEET_ID } from '../config';

export function useRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (SHEET_ID === 'YOUR_SHEET_ID_HERE') {
      setError('setup');
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const [recipeRows, ingredientRows] = await Promise.all([
          fetchCSV(RECIPES_URL),
          fetchCSV(INGREDIENTS_URL),
        ]);
        setRecipes(recipeRows);
        setIngredients(ingredientRows);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Group ingredients by recipe name for O(1) lookup
  const ingredientsByRecipe = useMemo(() => {
    const map = {};
    for (const ing of ingredients) {
      const name = ing['Recipe']?.trim();
      if (!name) continue;
      if (!map[name]) map[name] = [];
      map[name].push(ing);
    }
    return map;
  }, [ingredients]);

  // Collect unique filter values from data
  const filterOptions = useMemo(() => {
    const sets = {
      mealType: new Set(),
      cuisine: new Set(),
      cookMethod: new Set(),
      primaryProtein: new Set(),
      contributor: new Set(),
      occasion: new Set(),
    };
    for (const r of recipes) {
      if (r['Meal Type'])      sets.mealType.add(r['Meal Type']);
      if (r['Cuisine'])        sets.cuisine.add(r['Cuisine']);
      if (r['Cook Method'])    sets.cookMethod.add(r['Cook Method']);
      if (r['Primary Protein']) sets.primaryProtein.add(r['Primary Protein']);
      if (r['Contributor'])    sets.contributor.add(r['Contributor']);
      if (r['Occasion'])       sets.occasion.add(r['Occasion']);
    }
    return {
      mealType:      [...sets.mealType].sort(),
      cuisine:       [...sets.cuisine].sort(),
      cookMethod:    [...sets.cookMethod].sort(),
      primaryProtein:[...sets.primaryProtein].sort(),
      contributor:   [...sets.contributor].sort(),
      occasion:      [...sets.occasion].sort(),
    };
  }, [recipes]);

  return { recipes, ingredientsByRecipe, filterOptions, loading, error };
}
