// File purpose: Database service wrapper using localStorage for web version
// Related: src/utils/seedDatabase.js, src/data/seedData.json
// Should not include: UI components, business logic

// Generate unique IDs with prefix
const generateId = (prefix) => `${prefix}_${crypto.randomUUID().slice(0, 8)}`;

// Get current ISO timestamp
const now = () => new Date().toISOString();

import globalFoods from '../data/global_foods.json';

// ============================================================================
// Daily Logs
// ============================================================================

export const getDailyLog = async (date) => {
  try {
    const key = `day_${date}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get daily log:', error);
    throw new Error('Failed to load daily log');
  }
};

export const saveDailyLog = async (log) => {
  try {
    const key = `day_${log.date}`;
    const updatedLog = {
      ...log,
      updatedAt: now()
    };
    localStorage.setItem(key, JSON.stringify(updatedLog));
  } catch (error) {
    console.error('Failed to save daily log:', error);
    throw new Error('Failed to save daily log');
  }
};

// ============================================================================
// Foods
// ============================================================================

export const getAllFoods = async () => {
  try {
    const customFoods = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('u_food_') || key.startsWith('food_')) {
        const data = localStorage.getItem(key);
        const food = JSON.parse(data);
        if (!food.isDeleted) {
          customFoods.push(food);
        }
      }
    }
    // Return merged array of static global foods + user custom foods
    const globalFoodsSubset = globalFoods.filter(item => item.type === 'food').map(gf => {
      const statsStr = localStorage.getItem(`stats_${gf.id}`);
      if (statsStr) {
        const stats = JSON.parse(statsStr);
        return { ...gf, usageCount: stats.usageCount || 0, lastUsed: stats.lastUsed || null };
      }
      return gf;
    });

    return [...globalFoodsSubset, ...customFoods];
  } catch (error) {
    console.error('Failed to get all foods:', error);
    throw new Error('Failed to load foods');
  }
};

export const getFoodById = async (id) => {
  try {
    // Check master global dictionary first
    const globalMatch = globalFoods.find(f => f.id === id);
    if (globalMatch) return globalMatch;

    // Check custom library
    const data = localStorage.getItem(id);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get food by id:', error);
    throw new Error('Failed to load food');
  }
};

export const saveFood = async (food) => {
  try {
    // Cannot overwrite global dictionary
    if (food.id && food.id.startsWith('g_')) {
      throw new Error('Cannot modify global static foods.');
    }
    
    const savedFood = {
      ...food,
      id: food.id || generateId('u_food'),
      createdAt: food.createdAt || now(),
      lastUsed: food.lastUsed || null,
      usageCount: food.usageCount || 0,
      isDeleted: false
    };
    localStorage.setItem(savedFood.id, JSON.stringify(savedFood));
    return savedFood;
  } catch (error) {
    console.error('Failed to save food:', error);
    throw new Error('Failed to save food');
  }
};

export const deleteFood = async (id) => {
  try {
    if (id.startsWith('g_')) return; // Cannot delete globals
    const food = await getFoodById(id);
    if (food) {
      food.isDeleted = true;
      localStorage.setItem(id, JSON.stringify(food));
    }
  } catch (error) {
    console.error('Failed to delete food:', error);
    throw new Error('Failed to delete food');
  }
};

export const incrementFoodUsage = async (id) => {
  try {
    if (id.startsWith('g_')) {
      // Track global usage locally if necessary, or just skip it
      // Let's create an override local object just to track stats for sorting.
      let stats = JSON.parse(localStorage.getItem(`stats_${id}`) || '{"usageCount":0}');
      stats.usageCount += 1;
      stats.lastUsed = now();
      localStorage.setItem(`stats_${id}`, JSON.stringify(stats));
      return;
    }

    const food = await getFoodById(id);
    if (food) {
      food.usageCount = (food.usageCount || 0) + 1;
      food.lastUsed = now();
      localStorage.setItem(id, JSON.stringify(food));
    }
  } catch (error) {
    console.error('Failed to increment food usage:', error);
    throw new Error('Failed to update food usage');
  }
};

// ============================================================================
// Drinks
// ============================================================================

export const getAllDrinks = async () => {
  try {
    const customDrinks = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('u_drink_') || key.startsWith('drink_')) {
        const data = localStorage.getItem(key);
        const drink = JSON.parse(data);
        if (!drink.isDeleted) {
          customDrinks.push(drink);
        }
      }
    }

    const globalDrinks = globalFoods.filter(item => item.type === 'drink').map(gd => {
      const statsStr = localStorage.getItem(`stats_${gd.id}`);
      if (statsStr) {
        const stats = JSON.parse(statsStr);
        return { ...gd, usageCount: stats.usageCount || 0, lastUsed: stats.lastUsed || null };
      }
      return gd;
    });

    return [...globalDrinks, ...customDrinks];
  } catch (error) {
    console.error('Failed to get all drinks:', error);
    throw new Error('Failed to load drinks');
  }
};

export const getDrinkById = async (id) => {
  try {
    const globalMatch = globalFoods.find(f => f.id === id && f.type === 'drink');
    if (globalMatch) return globalMatch;

    const data = localStorage.getItem(id);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get drink by id:', error);
    throw new Error('Failed to load drink');
  }
};

export const saveDrink = async (drink) => {
  try {
    if (drink.id && drink.id.startsWith('g_')) {
      throw new Error('Cannot modify global static drinks.');
    }

    const savedDrink = {
      ...drink,
      id: drink.id || generateId('u_drink'),
      createdAt: drink.createdAt || now(),
      lastUsed: drink.lastUsed || null,
      usageCount: drink.usageCount || 0,
      isDeleted: false
    };
    localStorage.setItem(savedDrink.id, JSON.stringify(savedDrink));
    return savedDrink;
  } catch (error) {
    console.error('Failed to save drink:', error);
    throw new Error('Failed to save drink');
  }
};

export const deleteDrink = async (id) => {
  try {
    if (id.startsWith('g_')) return;
    const drink = await getDrinkById(id);
    if (drink) {
      drink.isDeleted = true;
      localStorage.setItem(id, JSON.stringify(drink));
    }
  } catch (error) {
    console.error('Failed to delete drink:', error);
    throw new Error('Failed to delete drink');
  }
};

export const incrementDrinkUsage = async (id) => {
  try {
    if (id.startsWith('g_')) {
      let stats = JSON.parse(localStorage.getItem(`stats_${id}`) || '{"usageCount":0}');
      stats.usageCount += 1;
      stats.lastUsed = now();
      localStorage.setItem(`stats_${id}`, JSON.stringify(stats));
      return;
    }

    const drink = await getDrinkById(id);
    if (drink) {
      drink.usageCount = (drink.usageCount || 0) + 1;
      drink.lastUsed = now();
      localStorage.setItem(id, JSON.stringify(drink));
    }
  } catch (error) {
    console.error('Failed to increment drink usage:', error);
    throw new Error('Failed to update drink usage');
  }
};

// ============================================================================
// Ingredients
// ============================================================================

export const getAllIngredients = async () => {
  try {
    const ingredients = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('ing_')) {
        const data = localStorage.getItem(key);
        ingredients.push(JSON.parse(data));
      }
    }
    return ingredients;
  } catch (error) {
    console.error('Failed to get all ingredients:', error);
    throw new Error('Failed to load ingredients');
  }
};

export const saveIngredient = async (ingredient) => {
  try {
    const savedIngredient = {
      ...ingredient,
      id: ingredient.id || generateId('ing'),
      createdAt: ingredient.createdAt || now(),
      usageCount: ingredient.usageCount || 0
    };
    localStorage.setItem(savedIngredient.id, JSON.stringify(savedIngredient));
    return savedIngredient;
  } catch (error) {
    console.error('Failed to save ingredient:', error);
    throw new Error('Failed to save ingredient');
  }
};

// ============================================================================
// User Preferences
// ============================================================================

const DEFAULT_PREFERENCES = {
  userId: 'user_123',
  defaultMealTimes: {
    Breakfast: '07:30',
    Lunch: '13:00',
    Dinner: '20:00',
    Snack: null
  },
  favoritesByMeal: {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snack: []
  },
  recentFoods: [],
  recentDrinks: [],
  customTags: {
    day: [],
    meal: [],
    food: [],
    drink: [],
    notice: []
  },
  createdAt: now(),
  updatedAt: now()
};

export const getPreferences = async () => {
  try {
    const data = localStorage.getItem('user_preferences');
    return data ? JSON.parse(data) : DEFAULT_PREFERENCES;
  } catch (error) {
    console.error('Failed to get preferences:', error);
    return DEFAULT_PREFERENCES;
  }
};

export const savePreferences = async (prefs) => {
  try {
    const updatedPrefs = {
      ...prefs,
      updatedAt: now()
    };
    localStorage.setItem('user_preferences', JSON.stringify(updatedPrefs));
  } catch (error) {
    console.error('Failed to save preferences:', error);
    throw new Error('Failed to save preferences');
  }
};
