// File purpose: Verification utility for ingredients library functionality
// Related: db.js, seedDatabase.js, FoodForm.jsx
// Should not include: UI components

import { getAllIngredients, saveIngredient } from '../services/db';

/**
 * Verify seeded ingredients are accessible
 * @returns {Promise<{success: boolean, count: number, ingredients: Array, error?: string}>}
 */
export const verifySeededIngredients = async () => {
  try {
    const ingredients = await getAllIngredients();
    
    // Check if we have seeded ingredients
    const hasSeededIngredients = ingredients.some(ing => ing.id.startsWith('ing_'));
    
    return {
      success: hasSeededIngredients && ingredients.length > 0,
      count: ingredients.length,
      ingredients: ingredients.slice(0, 5), // Return first 5 as sample
      error: hasSeededIngredients ? null : 'No seeded ingredients found'
    };
  } catch (error) {
    return {
      success: false,
      count: 0,
      ingredients: [],
      error: error.message
    };
  }
};

/**
 * Test auto-create ingredient functionality
 * @param {string} ingredientName - Name of ingredient to create
 * @param {string} category - Category of ingredient
 * @returns {Promise<{success: boolean, ingredient?: Object, error?: string}>}
 */
export const testAutoCreateIngredient = async (ingredientName, category = 'Other') => {
  try {
    // Check if ingredient already exists
    const existingIngredients = await getAllIngredients();
    const exists = existingIngredients.find(
      ing => ing.name.toLowerCase() === ingredientName.toLowerCase()
    );
    
    if (exists) {
      return {
        success: true,
        ingredient: exists,
        wasCreated: false,
        message: 'Ingredient already exists'
      };
    }
    
    // Create new ingredient
    const newIngredient = await saveIngredient({
      name: ingredientName,
      category,
      tags: [],
      aliases: []
    });
    
    // Verify it was saved
    const allIngredients = await getAllIngredients();
    const saved = allIngredients.find(ing => ing.id === newIngredient.id);
    
    return {
      success: !!saved,
      ingredient: saved,
      wasCreated: true,
      error: saved ? null : 'Ingredient was not found after save'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verify ingredients persist correctly in database
 * @returns {Promise<{success: boolean, details: Object, error?: string}>}
 */
export const verifyIngredientPersistence = async () => {
  try {
    const testIngredientName = `Test_Ingredient_${Date.now()}`;
    
    // Create a test ingredient
    const created = await saveIngredient({
      name: testIngredientName,
      category: 'Other',
      tags: ['test'],
      aliases: ['test-alias']
    });
    
    // Retrieve all ingredients
    const allIngredients = await getAllIngredients();
    const retrieved = allIngredients.find(ing => ing.id === created.id);
    
    // Verify data integrity
    const dataMatches = retrieved &&
      retrieved.name === testIngredientName &&
      retrieved.category === 'Other' &&
      retrieved.tags.includes('test') &&
      retrieved.aliases.includes('test-alias');
    
    // Check localStorage directly
    const fromStorage = localStorage.getItem(created.id);
    const parsedFromStorage = fromStorage ? JSON.parse(fromStorage) : null;
    
    return {
      success: dataMatches && !!parsedFromStorage,
      details: {
        created: !!created,
        retrieved: !!retrieved,
        dataMatches,
        inLocalStorage: !!parsedFromStorage,
        ingredient: retrieved
      },
      error: dataMatches ? null : 'Data integrity check failed'
    };
  } catch (error) {
    return {
      success: false,
      details: {},
      error: error.message
    };
  }
};

/**
 * Run all verification tests
 * @returns {Promise<Object>}
 */
export const runAllVerifications = async () => {
  console.log('🔍 Running ingredient library verification tests...\n');
  
  // Test 1: Verify seeded ingredients
  console.log('Test 1: Verifying seeded ingredients are accessible...');
  const seededTest = await verifySeededIngredients();
  console.log(seededTest.success ? '✅ PASS' : '❌ FAIL', '-', 
    `Found ${seededTest.count} ingredients`);
  if (seededTest.ingredients.length > 0) {
    console.log('Sample ingredients:', seededTest.ingredients.map(i => i.name).join(', '));
  }
  if (seededTest.error) console.log('Error:', seededTest.error);
  console.log('');
  
  // Test 2: Test auto-create functionality
  console.log('Test 2: Testing auto-create ingredient functionality...');
  const autoCreateTest = await testAutoCreateIngredient('Test Ingredient Auto', 'Vegetable');
  console.log(autoCreateTest.success ? '✅ PASS' : '❌ FAIL', '-',
    autoCreateTest.wasCreated ? 'Created new ingredient' : autoCreateTest.message);
  if (autoCreateTest.ingredient) {
    console.log('Ingredient:', autoCreateTest.ingredient.name, '-', autoCreateTest.ingredient.category);
  }
  if (autoCreateTest.error) console.log('Error:', autoCreateTest.error);
  console.log('');
  
  // Test 3: Verify persistence
  console.log('Test 3: Verifying ingredients persist correctly...');
  const persistenceTest = await verifyIngredientPersistence();
  console.log(persistenceTest.success ? '✅ PASS' : '❌ FAIL');
  console.log('Details:', {
    created: persistenceTest.details.created,
    retrieved: persistenceTest.details.retrieved,
    dataMatches: persistenceTest.details.dataMatches,
    inLocalStorage: persistenceTest.details.inLocalStorage
  });
  if (persistenceTest.error) console.log('Error:', persistenceTest.error);
  console.log('');
  
  // Summary
  const allPassed = seededTest.success && autoCreateTest.success && persistenceTest.success;
  console.log('═══════════════════════════════════════');
  console.log(allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  console.log('═══════════════════════════════════════');
  
  return {
    allPassed,
    tests: {
      seededIngredients: seededTest,
      autoCreate: autoCreateTest,
      persistence: persistenceTest
    }
  };
};
