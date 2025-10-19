// File purpose: Persistent Quick Add bar for fast food logging at bottom of TodayView
// Related: TodayView.jsx renders this component, db.js for food library and meal operations
// Should not include: Meal form logic, food library management
// NOTE: This component intentionally uses select dropdowns instead of CheckableButtonGroup
// for speed optimization - quick logging requires minimal clicks and compact UI

import { useState, useEffect, useRef } from 'react';
import { Plus, Search } from 'lucide-react';
import { getAllFoods, incrementFoodUsage, getPreferences } from '../services/db';

// Generate unique meal ID
const generateMealId = () => `meal_${crypto.randomUUID().slice(0, 8)}`;

// Get current time in HH:MM format
const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

// Determine meal type based on time
const getMealTypeForTime = (time) => {
  const [hours] = time.split(':').map(Number);
  
  if (hours >= 5 && hours < 11) return 'Breakfast';
  if (hours >= 11 && hours < 16) return 'Lunch';
  if (hours >= 16 && hours < 22) return 'Dinner';
  return 'Snack';
};

/**
 * QuickAddBar component - persistent bottom bar for fast food logging
 * @param {Object} props
 * @param {import('../types').Meal[]} props.meals - Today's meals
 * @param {Function} props.onAddFood - Callback when food is added (receives updated meals array)
 */
export function QuickAddBar({ meals, onAddFood }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [cookingMethod, setCookingMethod] = useState('');
  const [targetMealId, setTargetMealId] = useState('');
  
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load foods on mount
  useEffect(() => {
    const loadFoods = async () => {
      try {
        const allFoods = await getAllFoods();
        setFoods(allFoods);
      } catch (error) {
        console.error('Failed to load foods:', error);
      }
    };
    loadFoods();
  }, []);

  // Set default target meal when meals change
  useEffect(() => {
    if (meals.length > 0 && !targetMealId) {
      // Default to the last meal
      setTargetMealId(meals[meals.length - 1].id);
    }
  }, [meals, targetMealId]);

  // Filter foods based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = foods.filter(food =>
        food.name.toLowerCase().includes(query)
      );
      setFilteredFoods(filtered);
      setShowDropdown(true);
    } else {
      setFilteredFoods([]);
      setShowDropdown(false);
    }
  }, [searchQuery, foods]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle food selection from dropdown
  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setSearchQuery(food.name);
    setQuantity(food.defaultQuantity.toString());
    setUnit(food.defaultUnit);
    setCookingMethod(food.defaultCookingMethod || '');
    setShowDropdown(false);
  };

  // Handle add button click
  const handleAdd = async () => {
    if (!selectedFood || !quantity || !unit) {
      return;
    }

    // Create food entry
    const foodEntry = {
      foodId: selectedFood.id,
      name: selectedFood.name,
      quantity: parseFloat(quantity),
      unit,
      portion: selectedFood.defaultPortion || null,
      cookingMethod: cookingMethod || null,
      ingredients: selectedFood.ingredients || [],
      extras: selectedFood.defaultExtras || [],
      tags: selectedFood.tags || [],
      notes: null
    };

    // Increment usage count
    try {
      await incrementFoodUsage(selectedFood.id);
    } catch (error) {
      console.error('Failed to increment food usage:', error);
    }

    let updatedMeals;

    // If target meal exists, add to it
    if (targetMealId && meals.find(m => m.id === targetMealId)) {
      updatedMeals = meals.map(meal => {
        if (meal.id === targetMealId) {
          return {
            ...meal,
            foods: [...meal.foods, foodEntry]
          };
        }
        return meal;
      });
    } else {
      // Auto-create meal if none exists
      const currentTime = getCurrentTime();
      const mealType = getMealTypeForTime(currentTime);
      
      const newMeal = {
        id: generateMealId(),
        type: mealType,
        time: currentTime,
        tags: [],
        foods: [foodEntry],
        drinks: [],
        notes: null
      };

      updatedMeals = [...meals, newMeal];
      // Sort meals by time
      updatedMeals.sort((a, b) => a.time.localeCompare(b.time));
      
      // Set the new meal as target
      setTargetMealId(newMeal.id);
    }

    // Call parent callback
    onAddFood(updatedMeals);

    // Reset form
    setSearchQuery('');
    setSelectedFood(null);
    setQuantity('');
    setUnit('');
    setCookingMethod('');
  };

  return (
    <div className="fixed bottom-0 left-16 right-0 bg-[var(--color-bg-primary)] border-t border-[var(--color-border-primary)] shadow-lg">
      <div className="max-w-5xl mx-auto px-[var(--spacing-2xl)] py-[var(--spacing-md)]">
        <div className="flex items-center gap-[var(--spacing-md)]">
          {/* Search input */}
          <div className="relative flex-1">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-[var(--spacing-md)] top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quick add food..."
                className="w-full pl-9 pr-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-sm)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] transition-colors duration-[var(--transition-fast)]"
              />
            </div>

            {/* Dropdown */}
            {showDropdown && filteredFoods.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-20 w-full bottom-full mb-1 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] shadow-lg max-h-64 overflow-y-auto"
              >
                {filteredFoods.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => handleFoodSelect(food)}
                    className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left text-[var(--font-size-sm)] hover:bg-[var(--color-hover-bg)] transition-colors duration-[var(--transition-fast)] cursor-pointer"
                  >
                    <div className="font-[var(--font-weight-medium)] text-[var(--color-text-primary)]">
                      {food.name}
                    </div>
                    <div className="text-[var(--font-size-xs)] text-[var(--color-text-secondary)]">
                      {food.defaultQuantity} {food.defaultUnit}
                      {food.defaultPortion && ` • ${food.defaultPortion}`}
                      {food.defaultCookingMethod && ` • ${food.defaultCookingMethod}`}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Food details (shown when food is selected) */}
          {selectedFood && (
            <>
              <div className="w-24">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Qty"
                  className="w-full px-[var(--spacing-sm)] py-[var(--spacing-sm)] text-[var(--font-size-sm)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] transition-colors duration-[var(--transition-fast)]"
                  min="0"
                  step="0.5"
                />
              </div>

              <div className="w-28">
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-[var(--spacing-sm)] py-[var(--spacing-sm)] text-[var(--font-size-sm)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] transition-colors duration-[var(--transition-fast)]"
                >
                  <option value="pieces">pieces</option>
                  <option value="slices">slices</option>
                  <option value="plate">plate</option>
                  <option value="bowl">bowl</option>
                  <option value="cup">cup</option>
                  <option value="glass">glass</option>
                  <option value="spoon">spoon</option>
                  <option value="tablespoon">tablespoon</option>
                  <option value="teaspoon">teaspoon</option>
                </select>
              </div>

              <div className="w-32">
                <select
                  value={cookingMethod}
                  onChange={(e) => setCookingMethod(e.target.value)}
                  className="w-full px-[var(--spacing-sm)] py-[var(--spacing-sm)] text-[var(--font-size-sm)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] transition-colors duration-[var(--transition-fast)]"
                >
                  <option value="">Cooking</option>
                  <option value="raw">raw</option>
                  <option value="fried">fried</option>
                  <option value="baked">baked</option>
                  <option value="boiled">boiled</option>
                  <option value="steamed">steamed</option>
                  <option value="grilled">grilled</option>
                  <option value="roasted">roasted</option>
                  <option value="stewed">stewed</option>
                  <option value="sauteed">sauteed</option>
                  <option value="blanched">blanched</option>
                </select>
              </div>

              <div className="w-40">
                <select
                  value={targetMealId}
                  onChange={(e) => setTargetMealId(e.target.value)}
                  className="w-full px-[var(--spacing-sm)] py-[var(--spacing-sm)] text-[var(--font-size-sm)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] transition-colors duration-[var(--transition-fast)]"
                >
                  {meals.length === 0 ? (
                    <option value="">New Meal</option>
                  ) : (
                    meals.map((meal) => (
                      <option key={meal.id} value={meal.id}>
                        {meal.type} ({meal.time})
                      </option>
                    ))
                  )}
                  <option value="">+ New Meal</option>
                </select>
              </div>

              <button
                onClick={handleAdd}
                disabled={!quantity || !unit}
                className="px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-bg-primary)] bg-[var(--color-accent)] rounded-[var(--radius-md)] hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-active)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-[var(--transition-fast)] flex items-center gap-[var(--spacing-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 cursor-pointer"
              >
                <Plus size={16} />
                Add
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
