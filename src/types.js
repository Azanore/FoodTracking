// Type definitions for Food Tracker MVP
// Provides JSDoc type definitions for all data models used throughout the application

/**
 * @typedef {'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'} MealType
 */

/**
 * @typedef {'pieces' | 'slices' | 'plate' | 'bowl' | 'cup' | 'glass' | 'spoon' | 'tablespoon' | 'teaspoon'} Unit
 */

/**
 * @typedef {'tiny' | 'small' | 'medium' | 'large' | 'full' | 'half' | 'quarter' | null} Portion
 */

/**
 * @typedef {'raw' | 'fried' | 'baked' | 'boiled' | 'steamed' | 'grilled' | 'roasted' | 'stewed' | 'sauteed' | 'blanched' | null} CookingMethod
 */

/**
 * @typedef {'Protein' | 'Grain' | 'Vegetable' | 'Fruit' | 'Legume' | 'Dairy' | 'Fat' | 'Spice' | 'Herb' | 'Other'} IngredientCategory
 */

/**
 * @typedef {'Dairy' | 'Juice' | 'Tea' | 'Coffee' | 'Water' | 'Soda' | 'Other'} DrinkCategory
 */

/**
 * @typedef {Object} Ingredient
 * @property {string} id
 * @property {string} name
 * @property {IngredientCategory} category
 * @property {string[]} tags
 * @property {string[]} aliases
 * @property {number} usageCount
 * @property {string} createdAt
 */

/**
 * @typedef {Object} UserFood
 * @property {string} id
 * @property {string} name
 * @property {number} defaultQuantity
 * @property {Unit} defaultUnit
 * @property {Portion} defaultPortion
 * @property {CookingMethod} defaultCookingMethod
 * @property {{ id: string; name: string; category: IngredientCategory }[]} ingredients
 * @property {{ id: string; name: string; category: IngredientCategory }[]} defaultExtras
 * @property {string[]} tags
 * @property {string} lastUsed
 * @property {number} usageCount
 * @property {string} createdAt
 */

/**
 * @typedef {Object} UserDrink
 * @property {string} id
 * @property {string} name
 * @property {DrinkCategory} category
 * @property {number} defaultQuantity
 * @property {Unit} defaultUnit
 * @property {string[]} tags
 * @property {string} lastUsed
 * @property {number} usageCount
 * @property {string} createdAt
 */

/**
 * @typedef {Object} FoodEntry
 * @property {string | null} foodId
 * @property {string} name
 * @property {number} quantity
 * @property {Unit} unit
 * @property {Portion} portion
 * @property {CookingMethod} cookingMethod
 * @property {{ id: string; name: string; category: IngredientCategory }[]} ingredients
 * @property {{ id: string; name: string; category: IngredientCategory }[]} extras
 * @property {string[]} tags
 * @property {string | null} notes
 */

/**
 * @typedef {Object} DrinkEntry
 * @property {string | null} drinkId
 * @property {string} name
 * @property {DrinkCategory} category
 * @property {number} quantity
 * @property {Unit} unit
 * @property {string[]} tags
 * @property {string | null} notes
 */

/**
 * @typedef {Object} Meal
 * @property {string} id
 * @property {MealType} type
 * @property {string} time - HH:MM format
 * @property {string[]} tags
 * @property {FoodEntry[]} foods
 * @property {DrinkEntry[]} drinks
 * @property {string | null} notes
 */

/**
 * @typedef {Object} Notice
 * @property {string} text
 * @property {string | null} time
 * @property {1 | 2 | 3 | 4 | 5} severity
 * @property {string[]} tags
 */

/**
 * @typedef {Object} DailyLog
 * @property {string} id
 * @property {string} date - YYYY-MM-DD format
 * @property {string[]} tags
 * @property {string | null} dayNotes
 * @property {Meal[]} meals
 * @property {Notice[]} notices
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} UserPreferences
 * @property {string} userId
 * @property {{ Breakfast: string; Lunch: string; Dinner: string; Snack: string | null }} defaultMealTimes
 * @property {{ Breakfast: string[]; Lunch: string[]; Dinner: string[]; Snack: string[] }} favoritesByMeal
 * @property {string[]} recentFoods
 * @property {string[]} recentDrinks
 * @property {{ day: string[]; meal: string[]; food: string[]; drink: string[]; notice: string[] }} customTags
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export {};
