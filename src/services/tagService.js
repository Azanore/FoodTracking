// File purpose: Tag service for collecting and managing tags across the app
// Related: db.js for data access, forms use this for tag suggestions
// Should not include: UI components, form logic

import { getAllFoods, getAllDrinks, getDailyLog } from './db';

/**
 * Get all unique tags from foods with usage count
 * @returns {Promise<Array<{id: string, name: string, usageCount: number}>>}
 */
export const getAllFoodTags = async () => {
  const foods = await getAllFoods();
  const tagCounts = {};
  
  foods.forEach(food => {
    (food.tags || []).forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + (food.usageCount || 0);
    });
  });
  
  return Object.entries(tagCounts).map(([name, count]) => ({
    id: name,
    name,
    usageCount: count
  }));
};

/**
 * Get all unique tags from drinks with usage count
 * @returns {Promise<Array<{id: string, name: string, usageCount: number}>>}
 */
export const getAllDrinkTags = async () => {
  const drinks = await getAllDrinks();
  const tagCounts = {};
  
  drinks.forEach(drink => {
    (drink.tags || []).forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + (drink.usageCount || 0);
    });
  });
  
  return Object.entries(tagCounts).map(([name, count]) => ({
    id: name,
    name,
    usageCount: count
  }));
};

/**
 * Get all unique tags from meals with usage count
 * @returns {Promise<Array<{id: string, name: string, usageCount: number}>>}
 */
export const getAllMealTags = async () => {
  const tagCounts = {};
  
  // Scan through recent daily logs to collect meal tags
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const log = await getDailyLog(dateStr);
    if (log && log.meals) {
      log.meals.forEach(meal => {
        (meal.tags || []).forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
    }
  }
  
  return Object.entries(tagCounts).map(([name, count]) => ({
    id: name,
    name,
    usageCount: count
  }));
};
