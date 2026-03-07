// File purpose: Generate realistic test data for 60 days with planted correlations
// Related: seedDatabase.js, db.js
// Should not include: UI components, actual seeding logic

import seedData from '../data/seedData.json';

// ============================================================================
// Configuration
// ============================================================================

const DAYS_TO_GENERATE = 60;
const LOGGING_COVERAGE = 0.8; // 80% of days have logs
const FEELINGS_PER_WEEK = 2.5; // Average feelings logged per week

// Meal time ranges
const MEAL_TIMES = {
  Breakfast: ['07:00', '07:30', '08:00', '08:30', '09:00'],
  Lunch: ['12:30', '13:00', '13:30', '14:00'],
  Snack: ['16:00', '16:30', '17:00'],
  Dinner: ['19:30', '20:00', '20:30', '21:00']
};

// Food groups for correlation patterns
const FOOD_GROUPS = {
  dairy: ['food_milk', 'food_cheese', 'food_butter', 'food_yogurt_bowl', 'drink_milk', 'drink_lben'],
  fried: ['food_msemen', 'food_eggs_fried', 'food_briouats', 'food_french_fries', 'food_omelette'],
  gluten: ['food_khobz', 'food_pasta', 'food_pizza', 'food_croissant', 'food_msemen'],
  spicy: ['food_spicy_harissa'],
  caffeine: ['drink_coffee', 'drink_black_tea'],
  sweet: ['food_chocolate', 'food_dates', 'food_baghrir', 'drink_hot_chocolate', 'drink_soda']
};

// Correlation patterns: [feeling, foodGroup, probability]
const CORRELATIONS = [
  { feeling: 'bloated', trigger: 'dairy', probability: 0.85 },
  { feeling: 'nauseous', trigger: 'fried', probability: 0.80 },
  { feeling: 'headache', trigger: 'caffeine', probability: 0.70 },
  { feeling: 'heartburn', trigger: 'spicy', probability: 0.75 },
  { feeling: 'tired', trigger: 'gluten', probability: 0.40 },
  { feeling: 'anxious', trigger: 'sweet', probability: 0.35 }
];

// Common meal patterns (realistic routines)
const BREAKFAST_COMMON = [
  { foods: ['food_msemen', 'food_butter'], drinks: ['drink_mint_tea'] },
  { foods: ['food_khobz', 'food_cheese'], drinks: ['drink_coffee'] },
  { foods: ['food_eggs_fried', 'food_khobz'], drinks: ['drink_orange_juice'] },
  { foods: ['food_baghrir'], drinks: ['drink_mint_tea'] },
  { foods: ['food_yogurt_bowl', 'food_dates'], drinks: ['drink_water'] },
  { foods: ['food_croissant'], drinks: ['drink_coffee'] },
  { foods: ['food_omelette', 'food_khobz'], drinks: ['drink_milk'] }
];

const LUNCH_COMMON = [
  { foods: ['food_tagine_chicken', 'food_khobz', 'food_moroccan_salad'], drinks: ['drink_water'] },
  { foods: ['food_couscous', 'food_moroccan_salad'], drinks: ['drink_lben'] },
  { foods: ['food_sardines_grilled', 'food_khobz'], drinks: ['drink_water'] },
  { foods: ['food_kefta', 'food_french_fries'], drinks: ['drink_soda'] },
  { foods: ['food_pasta', 'food_moroccan_salad'], drinks: ['drink_water'] },
  { foods: ['food_pizza'], drinks: ['drink_soda'] },
  { foods: ['food_tuna_sandwich'], drinks: ['drink_orange_juice'] },
  { foods: ['food_rfissa'], drinks: ['drink_lben'] }
];

const DINNER_COMMON = [
  { foods: ['food_harira', 'food_khobz', 'food_dates'], drinks: ['drink_mint_tea'] },
  { foods: ['food_tagine_lamb', 'food_khobz'], drinks: ['drink_water'] },
  { foods: ['food_tangia', 'food_khobz'], drinks: ['drink_water'] },
  { foods: ['food_shrimp_tagine', 'food_rice_plain'], drinks: ['drink_water'] },
  { foods: ['food_couscous'], drinks: ['drink_lben'] },
  { foods: ['food_eggs_boiled', 'food_zaalouk', 'food_khobz'], drinks: ['drink_mint_tea'] }
];

const SNACK_COMMON = [
  { foods: ['food_dates'], drinks: ['drink_mint_tea'] },
  { foods: ['food_briouats'], drinks: ['drink_mint_tea'] },
  { foods: ['food_banana'], drinks: ['drink_water'] },
  { foods: ['food_almonds'], drinks: ['drink_water'] },
  { foods: ['food_chocolate'], drinks: ['drink_milk'] },
  { foods: ['food_apple'], drinks: ['drink_water'] }
];

// ============================================================================
// Helpers
// ============================================================================

const generateId = (prefix) => `${prefix}_${crypto.randomUUID().slice(0, 8)}`;

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomBool = (probability = 0.5) => Math.random() < probability;

// Get date string for N days ago
const getDaysAgo = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Get random time from meal time range
const getRandomMealTime = (mealType) => randomChoice(MEAL_TIMES[mealType]);

// Check if food/drink is in a group
const isInGroup = (itemId, groupName) => {
  return FOOD_GROUPS[groupName]?.includes(itemId) || false;
};

// ============================================================================
// Meal Generation
// ============================================================================

// Generate a meal event
const generateMeal = (mealType, date) => {
  const patterns = {
    Breakfast: BREAKFAST_COMMON,
    Lunch: LUNCH_COMMON,
    Dinner: DINNER_COMMON,
    Snack: SNACK_COMMON
  };

  const pattern = randomChoice(patterns[mealType]);

  return {
    id: generateId('meal'),
    type: 'meal',
    time: getRandomMealTime(mealType),
    mealType,
    foods: pattern.foods.map(getFoodById).filter(Boolean),
    drinks: pattern.drinks.map(getDrinkById).filter(Boolean),
    tags: []
  };
};

// Get food object by ID from seed data
const getFoodById = (foodId) => {
  const food = seedData.userFoods.find(f => f.id === foodId);
  if (!food) return null;
  return {
    id: food.id,
    name: food.name,
    quantity: food.defaultQuantity,
    unit: food.defaultUnit,
    cookingMethod: food.defaultCookingMethod,
    tags: food.tags || []
  };
};

// Get drink object by ID from seed data
const getDrinkById = (drinkId) => {
  const drink = seedData.userDrinks.find(d => d.id === drinkId);
  if (!drink) return null;
  return {
    id: drink.id,
    name: drink.name,
    quantity: drink.defaultQuantity,
    unit: drink.defaultUnit,
    category: drink.category,
    tags: drink.tags || []
  };
};

// ============================================================================
// Feeling Generation (with correlations)
// ============================================================================

// Check if any meal contains trigger foods
const hasTriggerFoods = (meals, triggerGroup) => {
  const triggerIds = FOOD_GROUPS[triggerGroup] || [];
  return meals.some(meal => {
    const allItems = [
      ...meal.foods.map(f => f.id),
      ...meal.drinks.map(d => d.id)
    ];
    return allItems.some(id => triggerIds.includes(id));
  });
};

// Generate feeling based on correlations
const generateFeeling = (meals, date) => {
  // Find applicable correlations
  const applicableCorrelations = CORRELATIONS.filter(corr =>
    hasTriggerFoods(meals, corr.trigger)
  );

  if (applicableCorrelations.length === 0) return null;

  // Pick one correlation and check probability
  const correlation = randomChoice(applicableCorrelations);
  if (!randomBool(correlation.probability)) return null;

  // Find the meal with trigger food
  const triggerMeal = meals.find(meal => {
    const allItems = [
      ...meal.foods.map(f => f.id),
      ...meal.drinks.map(d => d.id)
    ];
    return allItems.some(id => FOOD_GROUPS[correlation.trigger].includes(id));
  });

  // Calculate feeling time (1-4 hours after meal)
  const mealHour = parseInt(triggerMeal.time.split(':')[0]);
  const mealMinute = parseInt(triggerMeal.time.split(':')[1]);
  const hoursAfter = 1 + Math.floor(Math.random() * 3); // 1-4 hours
  const feelingHour = (mealHour + hoursAfter) % 24;
  const feelingTime = `${String(feelingHour).padStart(2, '0')}:${String(mealMinute).padStart(2, '0')}`;

  return {
    id: generateId('feeling'),
    type: 'feeling',
    timeGranularity: 'specific',
    time: feelingTime,
    feeling: correlation.feeling,
    severity: 2 + Math.floor(Math.random() * 3), // 2-4
    duration: randomChoice(['1-3 hours', '3-6 hours']),
    notes: null,
    relatedMealId: triggerMeal.id
  };
};

// ============================================================================
// Day Generation
// ============================================================================

// Generate a full day log
const generateDayLog = (date) => {
  // Skip some days (realistic gaps)
  if (!randomBool(LOGGING_COVERAGE)) return null;

  const timeline = [];

  // Always log breakfast and lunch
  timeline.push(generateMeal('Breakfast', date));
  timeline.push(generateMeal('Lunch', date));

  // 70% chance of dinner
  if (randomBool(0.7)) {
    timeline.push(generateMeal('Dinner', date));
  }

  // 40% chance of snack
  if (randomBool(0.4)) {
    timeline.push(generateMeal('Snack', date));
  }

  // Sort by time
  timeline.sort((a, b) => a.time.localeCompare(b.time));

  // Generate feeling based on correlations (probabilistic)
  const feelingsPerDay = FEELINGS_PER_WEEK / 7;
  if (randomBool(feelingsPerDay)) {
    const feeling = generateFeeling(timeline, date);
    if (feeling) {
      timeline.push(feeling);
      timeline.sort((a, b) => a.time.localeCompare(b.time));
    }
  }

  return {
    id: generateId('day'),
    date,
    tags: [],
    timeline,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// ============================================================================
// Main Generation
// ============================================================================

export const generateTestData = () => {
  const logs = [];

  for (let i = DAYS_TO_GENERATE - 1; i >= 0; i--) {
    const date = getDaysAgo(i);
    const log = generateDayLog(date);
    if (log) {
      logs.push(log);
    }
  }

  return logs;
};

// Save to localStorage
export const saveTestDataToStorage = () => {
  const logs = generateTestData();

  logs.forEach(log => {
    const key = `day_${log.date}`;
    localStorage.setItem(key, JSON.stringify(log));
  });

  console.log(`✅ Generated ${logs.length}/${DAYS_TO_GENERATE} days with logs (${Math.round(LOGGING_COVERAGE * 100)}% coverage)`);
  console.log('📊 Planted correlations:');
  CORRELATIONS.forEach(c => {
    console.log(`   - ${c.feeling} ← ${c.trigger} (${Math.round(c.probability * 100)}%)`);
  });

  return logs;
};
