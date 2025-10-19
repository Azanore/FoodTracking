// File purpose: Wizard for creating/editing foods in library with 4-step flow
// Related: Wizard.jsx (core framework), food step components, db.js (saveFood)
// Should not include: Meal management logic, drink logic

import { Wizard } from '../wizard/Wizard';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { QuantityMeasurementStep } from './steps/QuantityMeasurementStep';
import { CompositionStep } from './steps/CompositionStep';
import { TagsNotesStep } from './steps/TagsNotesStep';
import { saveFood } from '../../services/db';

/**
 * FoodLibraryWizard - 4-step wizard for creating/editing foods in library
 * 
 * Allows users to create new foods or edit existing foods in their library.
 * Sets up default values that will be used when adding the food to meals.
 * 
 * Steps:
 * 1. Basic Information - Food name (required)
 * 2. Measurement Defaults - Default quantity, unit, portion, cooking method (required)
 * 3. Composition - Default ingredients and extras (optional)
 * 4. Tags - Food tags (optional)
 * 
 * @component
 * @param {Object} props
 * @param {UserFood} [props.food] - Existing food to edit (null for create mode)
 * @param {Function} props.onComplete - Called when wizard completes successfully
 * @param {Function} props.onCancel - Called when wizard is cancelled
 * 
 * @typedef {Object} UserFood
 * @property {string} id - Food ID
 * @property {string} name - Food name
 * @property {number} defaultQuantity - Default quantity
 * @property {string} defaultUnit - Default unit
 * @property {string|null} defaultPortion - Default portion size
 * @property {string|null} defaultCookingMethod - Default cooking method
 * @property {Array<Object>} ingredients - Ingredient list
 * @property {Array<Object>} defaultExtras - Default extras
 * @property {Array<string>} tags - Food tags
 * 
 * Behavior:
 * - Create mode: All fields start empty (except quantity=1, unit='pieces')
 * - Edit mode: All fields pre-populated with existing values
 * - Validates required fields (name, quantity > 0, unit)
 * - Steps 3 and 4 are optional
 * - Saves to library on completion
 * 
 * Related: Wizard.jsx, BasicInfoStep, QuantityMeasurementStep, CompositionStep, TagsNotesStep
 */
export function FoodLibraryWizard({ food, onComplete, onCancel }) {
  // Step validation functions
  const validateBasicInfo = (data) => {
    const errors = {};
    
    if (!data.name || !data.name.trim()) {
      errors.name = 'Food name is required';
    }
    
    if (Object.keys(errors).length > 0) {
      return { valid: false, errors };
    }
    
    return { valid: true, errors: {} };
  };

  const validateMeasurementDefaults = (data) => {
    const errors = {};
    
    if (!data.quantity || parseFloat(data.quantity) <= 0) {
      errors.quantity = 'Default quantity must be greater than 0';
    }
    
    if (!data.unit) {
      errors.unit = 'Please select a default unit';
    }
    
    if (Object.keys(errors).length > 0) {
      return { valid: false, errors };
    }
    
    return { valid: true, errors: {} };
  };

  // Define wizard steps
  const steps = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      component: BasicInfoStep,
      validate: validateBasicInfo
    },
    {
      id: 'measurement-defaults',
      title: 'Measurement Defaults',
      component: QuantityMeasurementStep,
      validate: validateMeasurementDefaults
    },
    {
      id: 'composition',
      title: 'Composition',
      component: CompositionStep,
      optional: true
    },
    {
      id: 'tags',
      title: 'Tags',
      component: TagsNotesStep,
      optional: true
    }
  ];

  // Pre-populate with existing food data if editing
  const initialData = food ? {
    foodId: food.id,
    name: food.name,
    quantity: food.defaultQuantity,
    unit: food.defaultUnit,
    portion: food.defaultPortion,
    cookingMethod: food.defaultCookingMethod,
    ingredients: food.ingredients || [],
    extras: food.defaultExtras || [],
    tags: food.tags || [],
    notes: null
  } : {
    foodId: null,
    name: '',
    quantity: 1,
    unit: 'pieces',
    portion: null,
    cookingMethod: null,
    ingredients: [],
    extras: [],
    tags: [],
    notes: null
  };

  // Handle wizard completion
  const handleComplete = async (data) => {
    // Transform wizard data to UserFood format
    const foodData = {
      ...(food || {}),
      name: data.name.trim(),
      defaultQuantity: parseFloat(data.quantity),
      defaultUnit: data.unit,
      defaultPortion: data.portion || null,
      defaultCookingMethod: data.cookingMethod || null,
      ingredients: data.ingredients || [],
      defaultExtras: data.extras || [],
      tags: data.tags || []
    };

    await saveFood(foodData);
    onComplete();
  };

  // Handle partial save (edit mode only)
  const handlePartialSave = async (modifiedData, fullData) => {
    if (!food) {
      console.warn('Partial save called in create mode');
      return;
    }

    // Transform modified fields to UserFood format
    const partialUpdate = { ...food };
    
    if (modifiedData.name !== undefined) {
      partialUpdate.name = modifiedData.name.trim();
    }
    if (modifiedData.quantity !== undefined) {
      partialUpdate.defaultQuantity = parseFloat(modifiedData.quantity);
    }
    if (modifiedData.unit !== undefined) {
      partialUpdate.defaultUnit = modifiedData.unit;
    }
    if (modifiedData.portion !== undefined) {
      partialUpdate.defaultPortion = modifiedData.portion || null;
    }
    if (modifiedData.cookingMethod !== undefined) {
      partialUpdate.defaultCookingMethod = modifiedData.cookingMethod || null;
    }
    if (modifiedData.ingredients !== undefined) {
      partialUpdate.ingredients = modifiedData.ingredients;
    }
    if (modifiedData.extras !== undefined) {
      partialUpdate.defaultExtras = modifiedData.extras;
    }
    if (modifiedData.tags !== undefined) {
      partialUpdate.tags = modifiedData.tags;
    }

    await saveFood(partialUpdate);
    onComplete();
  };

  return (
    <Wizard
      steps={steps}
      initialData={initialData}
      onComplete={handleComplete}
      onPartialSave={food ? handlePartialSave : undefined}
      onCancel={onCancel}
      title={food ? 'Edit Food' : 'Add New Food'}
    />
  );
}
