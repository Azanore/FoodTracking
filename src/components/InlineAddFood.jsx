// File purpose: Inline food search and add within meal card
// Related: MealCard.jsx uses this component, db.js for food library access
// Should not include: Meal management logic, drink adding
// NOTE: This component intentionally uses select dropdowns instead of CheckableButtonGroup
// for compactness - inline forms need to fit within meal cards without taking too much space

import { useState, useEffect, useRef } from 'react';
import { Plus, Search } from 'lucide-react';
import { getAllFoods, incrementFoodUsage } from '../services/db';

/**
 * InlineAddFood component - search and add food to meal inline
 * @param {Object} props
 * @param {Function} props.onAddFood - Callback when food is added (receives FoodEntry)
 */
export function InlineAddFood({ onAddFood }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [portion, setPortion] = useState('');
  const [cookingMethod, setCookingMethod] = useState('');
  
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
    setPortion(food.defaultPortion || '');
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
      portion: portion || null,
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

    // Call parent callback
    onAddFood(foodEntry);

    // Reset form
    setSearchQuery('');
    setSelectedFood(null);
    setQuantity('');
    setUnit('');
    setPortion('');
    setCookingMethod('');
  };

  return (
    <div className="mt-[var(--spacing-lg)] p-[var(--spacing-md)] bg-[var(--color-bg-secondary)] rounded-[var(--radius-md)] border border-[var(--color-border-primary)]">
      <div className="flex items-center gap-[var(--spacing-sm)] mb-[var(--spacing-sm)]">
        <Plus size={16} className="text-[var(--color-text-secondary)]" />
        <span className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)]">
          Add Food
        </span>
      </div>

      <div className="space-y-[var(--spacing-sm)]">
        {/* Search input */}
        <div className="relative">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-[var(--spacing-sm)] top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search foods..."
              className="w-full pl-8 pr-[var(--spacing-md)] py-1.5 text-[var(--font-size-sm)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] transition-colors duration-[var(--transition-fast)]"
            />
          </div>

          {/* Dropdown */}
          {showDropdown && filteredFoods.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-10 w-full mt-1 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] shadow-lg max-h-48 overflow-y-auto"
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
          <div className="grid grid-cols-4 gap-[var(--spacing-sm)]">
            <div>
              <label className="block text-[var(--font-size-xs)] text-[var(--color-text-secondary)] mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-[var(--spacing-sm)] py-1.5 text-[var(--font-size-sm)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] transition-colors duration-[var(--transition-fast)]"
                min="0"
                step="0.5"
              />
            </div>

            <div>
              <label className="block text-[var(--font-size-xs)] text-[var(--color-text-secondary)] mb-1">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-[var(--spacing-sm)] py-1.5 text-[var(--font-size-sm)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] transition-colors duration-[var(--transition-fast)]"
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

            <div>
              <label className="block text-[var(--font-size-xs)] text-[var(--color-text-secondary)] mb-1">
                Portion
              </label>
              <select
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                className="w-full px-[var(--spacing-sm)] py-1.5 text-[var(--font-size-sm)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] transition-colors duration-[var(--transition-fast)]"
              >
                <option value="">None</option>
                <option value="tiny">tiny</option>
                <option value="small">small</option>
                <option value="medium">medium</option>
                <option value="large">large</option>
                <option value="full">full</option>
                <option value="half">half</option>
                <option value="quarter">quarter</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--font-size-xs)] text-[var(--color-text-secondary)] mb-1">
                Cooking
              </label>
              <select
                value={cookingMethod}
                onChange={(e) => setCookingMethod(e.target.value)}
                className="w-full px-[var(--spacing-sm)] py-1.5 text-[var(--font-size-sm)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] transition-colors duration-[var(--transition-fast)]"
              >
                <option value="">None</option>
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
          </div>
        )}

        {/* Add button */}
        {selectedFood && (
          <button
            onClick={handleAdd}
            disabled={!quantity || !unit}
            className="w-full px-[var(--spacing-md)] py-1.5 text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-bg-primary)] bg-[var(--color-accent)] rounded-[var(--radius-md)] hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-active)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 cursor-pointer"
          >
            Add to Meal
          </button>
        )}
      </div>
    </div>
  );
}
