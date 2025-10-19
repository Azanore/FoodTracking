// File purpose: Load seed data into database on first launch
// Related: src/data/seedData.json, src/services/db.js
// Should not include: Business logic, UI components

import seedData from '../data/seedData.json';

const SEED_FLAG_KEY = 'app_seeded';

// Check if database has been seeded
export const isSeeded = () => {
  return localStorage.getItem(SEED_FLAG_KEY) === 'true';
};

// Load all seed data into localStorage
export const seedDatabase = () => {
  if (isSeeded()) {
    return;
  }

  try {
    // Seed ingredients
    seedData.ingredients.forEach(ingredient => {
      localStorage.setItem(ingredient.id, JSON.stringify(ingredient));
    });

    // Seed user foods
    seedData.userFoods.forEach(food => {
      localStorage.setItem(food.id, JSON.stringify(food));
    });

    // Seed user drinks
    seedData.userDrinks.forEach(drink => {
      localStorage.setItem(drink.id, JSON.stringify(drink));
    });

    // Seed daily logs
    seedData.dailyLogs.forEach(log => {
      localStorage.setItem(`day_${log.date}`, JSON.stringify(log));
    });

    // Seed user preferences
    localStorage.setItem('user_preferences', JSON.stringify(seedData.userPreferences));

    // Mark as seeded
    localStorage.setItem(SEED_FLAG_KEY, 'true');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
};

// Clear all data and reseed (for testing)
export const resetDatabase = () => {
  localStorage.clear();
  seedDatabase();
};
