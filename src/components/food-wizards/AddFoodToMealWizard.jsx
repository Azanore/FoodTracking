// File purpose: Wizard for adding food to a meal with 4-step flow
// Related: Wizard.jsx (core framework), food step components, db.js (incrementFoodUsage, saveFood)
// Should not include: Meal management logic, drink logic

import { Wizard } from '../wizard/Wizard';
import { FoodSelectionStep } from './steps/FoodSelectionStep';
import { QuantityMeasurementStep } from './steps/QuantityMeasurementStep';
import { CompositionStep } from './steps/CompositionStep';
import { TagsNotesStep } from './steps/TagsNotesStep';
import { incrementFoodUsage, saveFood } from '../../services/db';

/**
 * AddFoodToMealWizard - 4-step wizard for adding food to a meal
 * 
 * Guides user through selecting/creating a food, setting quantity and measurement,
 * optionally adding ingredients/extras, and optionally adding tags/notes.
 * 
 * Steps:
 * 1. Select Food - Search library or create new food
 * 2. Quantity & Measurement - Set quantity, unit, portion, cooking method (required)
 * 3. Ingredients & Extras - Select ingredients and extras (optional)
 * 4. Tags & Notes - Add tags and notes (optional)
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onComplete - Called with FoodEntry object when wizard completes
 * @param {Function} props.onCancel - Called when wizard is cancelled
 * 
 * @typedef {Object} FoodEntry
 * @property {string} foodId - ID of food from library
 * @property {string} name - Food name
 * @property {number} quantity - Quantity amount
 * @property {string} unit - Unit of measurement
 * @property {string|null} portion - Portion size
 * @property {string|null} cookingMethod - Cooking method
 * @property {Array<Object>} ingredients - Selected ingredients
 * @property {Array<Object>} extras - Selected extras
 * @property {Array<string>} tags - Selected tags
 * @property {string|null} notes - User notes
 * 
 * Behavior:
 * - If user creates new food, saves it to library automatically
 * - Increments usage count for selected food
 * - Validates required fields (food selection, quantity > 0, unit)
 * - Steps 3 and 4 are optional and can be skipped
 * 
 * Related: Wizard.jsx, FoodSelectionStep, QuantityMeasurementStep, CompositionStep, TagsNotesStep
 */
export function AddFoodToMealWizard({ onComplete, onCancel }) {
  // Step validation functions
  const validateFoodSelection = (data) => {
    if (!data.foodId && !data.name) {
      return { valid: false, errors: { _general: 'Please select a food or enter a name' } };
    }
    return { valid: true, errors: {} };
  };

  const validateQuantityMeasurement = (data) => {
    const errors = {};
    
    if (!data.quantity || parseFloat(data.quantity) <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }
    
    if (!data.unit) {
      errors.unit = 'Please select a unit';
    }
    
    if (Object.keys(errors).length > 0) {
      return { valid: false, errors };
    }
    
    return { valid: true, errors: {} };
  };

  // Define wizard steps
  const steps = [
    {
      id: 'select-food',
      title: 'Select Food',
      component: FoodSelectionStep,
      validate: validateFoodSelection
    },
    {
      id: 'quantity',
      title: 'Quantity & Measurement',
      component: QuantityMeasurementStep,
      validate: validateQuantityMeasurement
    },
    {
      id: 'composition',
      title: 'Ingredients & Extras',
      component: CompositionStep,
      optional: true
    },
    {
      id: 'tags-notes',
      title: 'Tags & Notes',
      component: TagsNotesStep,
      optional: true
    }
  ];

  // Handle wizard completion
  const handleComplete = async (data) => {
    // If creating new food, save it to library
    if (!data.foodId && data.name) {
      const newFood = await saveFood({
        name: data.name,
        defaultQuantity: parseFloat(data.quantity),
        defaultUnit: data.unit,
        defaultPortion: data.portion || null,
        defaultCookingMethod: data.cookingMethod || null,
        ingredients: data.ingredients || [],
        defaultExtras: data.extras || [],
        tags: data.tags || []
      });
      data.foodId = newFood.id;
    }

    // Increment usage count for existing food
    if (data.foodId) {
      await incrementFoodUsage(data.foodId);
    }

    // Transform wizard data to FoodEntry format
    const foodEntry = {
      foodId: data.foodId,
      name: data.name,
      quantity: parseFloat(data.quantity),
      unit: data.unit,
      portion: data.portion || null,
      cookingMethod: data.cookingMethod || null,
      ingredients: data.ingredients || [],
      extras: data.extras || [],
      tags: data.tags || [],
      notes: data.notes || null
    };

    onComplete(foodEntry);
  };

  return (
    <Wizard
      steps={steps}
      initialData={{}}
      onComplete={handleComplete}
      onCancel={onCancel}
      title="Add Food to Meal"
    />
  );
}
