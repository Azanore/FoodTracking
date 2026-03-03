// File purpose: Load seed data into database on first launch or reset
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
  try {
    // Seed user foods
    seedData.userFoods.forEach(food => {
      localStorage.setItem(food.id, JSON.stringify(food));
    });

    // Seed user drinks
    seedData.userDrinks.forEach(drink => {
      localStorage.setItem(drink.id, JSON.stringify(drink));
    });

    // Mark as seeded
    localStorage.setItem(SEED_FLAG_KEY, 'true');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
};

// Clear all data and reseed
export const resetDatabase = () => {
  localStorage.clear();
  seedDatabase();
};
