// File purpose: Wizard for editing food entry in a meal with 4-step flow, starting at step 2
// Related: Wizard.jsx (core framework), food step components, AddFoodToMealWizard.jsx (similar pattern)
// Should not include: Meal management logic, drink logic, food library management

import { Wizard } from '../wizard/Wizard';
import { FoodSelectionStep } from './steps/FoodSelectionStep';
import { QuantityMeasurementStep } from './steps/QuantityMeasurementStep';
import { CompositionStep } from './steps/CompositionStep';
import { TagsNotesStep } from './steps/TagsNotesStep';
import { incrementFoodUsage, saveFood } from '../../services/db';

/**
 * EditFoodInMealWizard - 4-step wizard for editing food entry in a meal
 * 
 * Pre-populates all fields with existing food entry data. Starts on Step 2 (Quantity & Measurement)
 * by default since food is already selected, but allows going back to Step 1 to change the food.
 * 
 * Steps:
 * 1. Change Food - Search library or create new food
 * 2. Quantity & Measurement - Set quantity, unit, portion, cooking method (required) [DEFAULT START]
 * 3. Ingredients & Extras - Select ingredients and extras (optional)
 * 4. Tags & Notes - Add tags and notes (optional)
 * 
 * @component
 * @param {Object} props
 * @param {FoodEntry} props.foodEntry - Existing food entry to edit
 * @param {Function} props.onComplete - Called with updated FoodEntry object when wizard completes
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
 * - Starts on Step 2 (Quantity & Measurement) by default
 * - All fields pre-populated with existing values
 * - If user changes to new food, saves it to library automatically
 * - Increments usage count if food was changed
 * - Validates required fields (food selection, quantity > 0, unit)
 * 
 * Related: Wizard.jsx, AddFoodToMealWizard, FoodSelectionStep, QuantityMeasurementStep
 */
export function EditFoodInMealWizard({ foodEntry, onComplete, onCancel }) {
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
      title: 'Change Food',
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

  // Pre-populate with existing food entry data
  const initialData = {
    foodId: foodEntry.foodId,
    name: foodEntry.name,
    quantity: foodEntry.quantity,
    unit: foodEntry.unit,
    portion: foodEntry.portion,
    cookingMethod: foodEntry.cookingMethod,
    ingredients: foodEntry.ingredients || [],
    extras: foodEntry.extras || [],
    tags: foodEntry.tags || [],
    notes: foodEntry.notes
  };

  // Handle wizard completion
  const handleComplete = async (data) => {
    // If food was changed to a new food, save it to library
    if (!data.foodId && data.name && data.name !== foodEntry.name) {
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

    // Increment usage count if food was changed
    if (data.foodId && data.foodId !== foodEntry.foodId) {
      await incrementFoodUsage(data.foodId);
    }

    // Transform wizard data to FoodEntry format
    const updatedFoodEntry = {
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

    onComplete(updatedFoodEntry);
  };

  // Handle partial save (only modified fields)
  const handlePartialSave = async (modifiedData, fullData) => {
    // Build updated entry with only modified fields
    const updatedFoodEntry = { ...foodEntry };

    // Handle food change if modified
    if (modifiedData.foodId !== undefined || modifiedData.name !== undefined) {
      if (!fullData.foodId && fullData.name && fullData.name !== foodEntry.name) {
        const newFood = await saveFood({
          name: fullData.name,
          defaultQuantity: parseFloat(fullData.quantity),
          defaultUnit: fullData.unit,
          defaultPortion: fullData.portion || null,
          defaultCookingMethod: fullData.cookingMethod || null,
          ingredients: fullData.ingredients || [],
          defaultExtras: fullData.extras || [],
          tags: fullData.tags || []
        });
        updatedFoodEntry.foodId = newFood.id;
        updatedFoodEntry.name = newFood.name;
      } else {
        if (modifiedData.foodId !== undefined) updatedFoodEntry.foodId = fullData.foodId;
        if (modifiedData.name !== undefined) updatedFoodEntry.name = fullData.name;
      }

      // Increment usage count if food was changed
      if (fullData.foodId && fullData.foodId !== foodEntry.foodId) {
        await incrementFoodUsage(fullData.foodId);
      }
    }

    // Update other modified fields
    if (modifiedData.quantity !== undefined) {
      updatedFoodEntry.quantity = parseFloat(fullData.quantity);
    }
    if (modifiedData.unit !== undefined) {
      updatedFoodEntry.unit = fullData.unit;
    }
    if (modifiedData.portion !== undefined) {
      updatedFoodEntry.portion = fullData.portion || null;
    }
    if (modifiedData.cookingMethod !== undefined) {
      updatedFoodEntry.cookingMethod = fullData.cookingMethod || null;
    }
    if (modifiedData.ingredients !== undefined) {
      updatedFoodEntry.ingredients = fullData.ingredients || [];
    }
    if (modifiedData.extras !== undefined) {
      updatedFoodEntry.extras = fullData.extras || [];
    }
    if (modifiedData.tags !== undefined) {
      updatedFoodEntry.tags = fullData.tags || [];
    }
    if (modifiedData.notes !== undefined) {
      updatedFoodEntry.notes = fullData.notes || null;
    }

    onComplete(updatedFoodEntry);
  };

  return (
    <Wizard
      steps={steps}
      initialData={initialData}
      onComplete={handleComplete}
      onPartialSave={handlePartialSave}
      onCancel={onCancel}
      title="Edit Food"
      startStep={1}
    />
  );
}
