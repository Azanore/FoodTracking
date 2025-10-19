// File purpose: Step 3 for food wizards - select ingredients and extras
// Related: MultiSelectStep.jsx (reusable component), db.js (getAllIngredients, saveIngredient)
// Should not include: Quantity/measurement logic, tags/notes logic

import { useState, useEffect, memo, useCallback } from 'react';
import { getAllIngredients, saveIngredient } from '../../../services/db';
import { useWizardContext } from '../../wizard/WizardContext';
import { WizardStepArt } from '../../wizard/WizardStepArt';
import { MultiSelectStep } from '../../wizard-steps/MultiSelectStep';

/**
 * CompositionStep - select ingredients and extras with inline creation
 */
export const CompositionStep = memo(function CompositionStep() {
  const { formData, updateData } = useWizardContext();
  const [availableIngredients, setAvailableIngredients] = useState([]);

  // Load all ingredients
  useEffect(() => {
    const loadIngredients = async () => {
      const ingredients = await getAllIngredients();
      // Sort by usage count
      const sorted = ingredients.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
      setAvailableIngredients(sorted);
    };
    loadIngredients();
  }, []);

  // Handle add new ingredient
  const handleAddIngredient = useCallback(async (name) => {
    const ingredient = await saveIngredient({
      name: name.trim(),
      category: 'Other',
      tags: [],
      aliases: []
    });
    setAvailableIngredients(prev => [...prev, ingredient]);
    
    const ingredients = formData.ingredients || [];
    updateData({
      ingredients: [...ingredients, { id: ingredient.id, name: ingredient.name, category: ingredient.category }]
    });
  }, [formData.ingredients, updateData]);

  // Handle add new extra
  const handleAddExtra = useCallback(async (name) => {
    const ingredient = await saveIngredient({
      name: name.trim(),
      category: 'Other',
      tags: [],
      aliases: []
    });
    setAvailableIngredients(prev => [...prev, ingredient]);
    
    const extras = formData.extras || [];
    updateData({
      extras: [...extras, { id: ingredient.id, name: ingredient.name, category: ingredient.category }]
    });
  }, [formData.extras, updateData]);

  // Handle ingredients change
  const handleIngredientsChange = useCallback((ids) => {
    const ingredients = ids
      .map(id => availableIngredients.find(ing => ing.id === id))
      .filter(Boolean)
      .map(ing => ({ id: ing.id, name: ing.name, category: ing.category }));
    updateData({ ingredients });
  }, [availableIngredients, updateData]);

  // Handle extras change
  const handleExtrasChange = useCallback((ids) => {
    const extras = ids
      .map(id => availableIngredients.find(ing => ing.id === id))
      .filter(Boolean)
      .map(ing => ({ id: ing.id, name: ing.name, category: ing.category }));
    updateData({ extras });
  }, [availableIngredients, updateData]);

  return (
    <div className="space-y-6">
      <WizardStepArt step="composition" />
      
      {/* Ingredients */}
      <MultiSelectStep
        label="Ingredients"
        items={availableIngredients}
        selectedIds={(formData.ingredients || []).map(i => i.id)}
        onChange={handleIngredientsChange}
        renderBadge={(item) => item.name}
        allowCreate={true}
        onCreateNew={handleAddIngredient}
        topCount={8}
        groupBy={(item) => item.category}
      />

      {/* Extras */}
      <MultiSelectStep
        label="Extras"
        items={availableIngredients}
        selectedIds={(formData.extras || []).map(i => i.id)}
        onChange={handleExtrasChange}
        renderBadge={(item) => item.name}
        allowCreate={true}
        onCreateNew={handleAddExtra}
        topCount={8}
        groupBy={(item) => item.category}
      />
    </div>
  );
});
