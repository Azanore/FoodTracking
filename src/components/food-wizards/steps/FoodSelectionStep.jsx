// File purpose: Step 1 for food wizards - search and select food from library or create new
// Related: SearchSelectStep.jsx (reusable component), db.js (getAllFoods)
// Should not include: Quantity/measurement logic, multi-step orchestration

import { useState, useEffect, memo, useCallback } from 'react';
import { getAllFoods } from '../../../services/db';
import { useWizardContext } from '../../wizard/WizardContext';
import { WizardStepArt } from '../../wizard/WizardStepArt';
import { SearchSelectStep } from '../../wizard-steps/SearchSelectStep';

/**
 * FoodSelectionStep - search and select food from library or create new
 * Auto-populates defaults when food is selected
 */
export const FoodSelectionStep = memo(function FoodSelectionStep() {
  const { formData, updateData } = useWizardContext();
  const [foods, setFoods] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Load all foods from library
  useEffect(() => {
    const loadFoods = async () => {
      const allFoods = await getAllFoods();
      // Sort by usage count (most used first)
      const sorted = allFoods.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
      setFoods(sorted);
    };
    loadFoods();
  }, []);

  // Handle food selection - auto-populate defaults
  const handleSelectFood = useCallback((food) => {
    updateData({
      foodId: food.id,
      name: food.name,
      quantity: food.defaultQuantity,
      unit: food.defaultUnit,
      portion: food.defaultPortion,
      cookingMethod: food.defaultCookingMethod,
      ingredients: food.ingredients || [],
      extras: food.defaultExtras || [],
      tags: food.tags || []
    });
  }, [updateData]);

  // Handle create new food
  const handleCreateNew = useCallback((name) => {
    setShowCreateForm(true);
    updateData({ 
      name: name.trim(), 
      foodId: null,
      quantity: 1,
      unit: 'pieces',
      portion: null,
      cookingMethod: null,
      ingredients: [],
      extras: [],
      tags: []
    });
  }, [updateData]);

  // If creating new food, show confirmation message
  if (showCreateForm) {
    return (
      <div className="space-y-4">
        <WizardStepArt step="select-food" />
        <div className="p-5 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <p className="text-sm text-gray-900 font-semibold">
            Creating new food: <strong className="text-blue-700">{formData.name}</strong>
          </p>
          <p className="text-xs text-gray-600 mt-2 leading-relaxed">
            Continue to set up this food. It will be saved to your library.
          </p>
        </div>
      </div>
    );
  }

  // Custom filter function - search by name and tags
  const filterFn = (food, query) => {
    const searchStr = query.toLowerCase();
    return food.name.toLowerCase().includes(searchStr) ||
           (food.tags || []).some(tag => tag.toLowerCase().includes(searchStr));
  };

  // Custom item renderer
  const renderItem = (food) => (
    <div>
      <div className="font-semibold text-sm text-gray-900">{food.name}</div>
      <div className="text-xs text-gray-600 mt-1">
        {food.defaultQuantity} {food.defaultUnit}
        {food.defaultPortion && ` • ${food.defaultPortion}`}
        {food.defaultCookingMethod && ` • ${food.defaultCookingMethod}`}
      </div>
      {food.tags && food.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {food.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <WizardStepArt step="select-food" />
      <SearchSelectStep
        items={foods}
        selectedId={formData.foodId}
        onSelect={handleSelectFood}
        searchPlaceholder="Search your foods..."
        renderItem={renderItem}
        filterFn={filterFn}
        allowCreate={true}
        onCreateNew={handleCreateNew}
        emptyMessage="No foods found. Create a new one?"
      />
    </>
  );
});
