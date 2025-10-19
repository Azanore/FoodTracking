// File purpose: Collapsible meal card displaying meal details with edit/delete actions
// Related: TodayView.jsx renders this component, FoodItem.jsx and DrinkItem.jsx for entries
// Wizard Integration: Includes AddFoodToMealWizard for guided food entry (accessible via "Add Food (Wizard)" button)
// Should not include: Meal form logic, database operations

import { useState } from 'react';
import { Coffee, Sun, Moon, Cookie, ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react';
import { FoodItem } from './FoodItem';
import { DrinkItem } from './DrinkItem';
import { InlineAddFood } from './InlineAddFood';
import { AddFoodToMealWizard } from './food-wizards/AddFoodToMealWizard';
import { Button } from './ui/Button';

// Map meal types to icons
const MEAL_ICONS = {
  Breakfast: Sun,
  Lunch: Coffee,
  Dinner: Moon,
  Snack: Cookie
};

/**
 * MealCard component - displays a meal with collapsible details
 * 
 * Provides two ways to add food:
 * 1. InlineAddFood - Quick add with minimal fields
 * 2. AddFoodToMealWizard - Guided 4-step wizard for comprehensive food entry
 * 
 * @param {Object} props
 * @param {import('../types').Meal} props.meal - Meal data
 * @param {Function} props.onEdit - Edit meal callback
 * @param {Function} props.onDelete - Delete meal callback
 * @param {Function} props.onMealUpdate - Update meal callback (for inline add)
 */
export function MealCard({ meal, onEdit, onDelete, onMealUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  // Handle adding food inline
  const handleAddFood = (foodEntry) => {
    const updatedMeal = {
      ...meal,
      foods: [...meal.foods, foodEntry]
    };
    onMealUpdate(updatedMeal);
  };

  // Handle wizard completion
  const handleWizardComplete = (foodEntry) => {
    handleAddFood(foodEntry);
    setShowWizard(false);
  };
  
  const MealIcon = MEAL_ICONS[meal.type] || Cookie;
  
  // Generate food/drink summary for collapsed view
  const foodSummary = meal.foods.length > 0 
    ? meal.foods.map(f => f.name).join(', ')
    : '';
  const drinkSummary = meal.drinks.length > 0
    ? meal.drinks.map(d => d.name).join(', ')
    : '';
  
  const summary = [foodSummary, drinkSummary].filter(Boolean).join(' • ');
  const itemCount = meal.foods.length + meal.drinks.length;

  return (
    <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)]">
      {/* Header - clickable to expand/collapse */}
      <div 
        className="p-[var(--spacing-md)] cursor-pointer hover:bg-[var(--color-hover-bg)] transition-colors duration-[var(--transition-fast)] ease-[var(--ease-in-out)] focus-within:ring-2 focus-within:ring-[var(--color-border-focus)] focus-within:ring-inset"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="text-[var(--color-accent)] mt-0.5">
              <MealIcon size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-[var(--font-size-sm)] font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]">
                  {meal.type}
                </h3>
                <span className="text-[var(--font-size-xs)] text-[var(--color-text-secondary)]">
                  {meal.time}
                </span>
              </div>
              
              {!isExpanded && (
                <p className="text-[var(--font-size-xs)] text-[var(--color-text-secondary)] truncate">
                  {summary || 'No items'}
                  {itemCount > 0 && ` (${itemCount})`}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(meal);
              }}
              className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-hover-bg)] rounded-[var(--radius-sm)] transition-colors duration-[var(--transition-fast)] ease-[var(--ease-in-out)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] cursor-pointer"
              title="Edit meal"
            >
              <Edit2 size={14} />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(meal.id);
              }}
              className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-hover-bg)] rounded-[var(--radius-sm)] transition-colors duration-[var(--transition-fast)] ease-[var(--ease-in-out)] focus:outline-none focus:ring-2 focus:ring-[var(--color-danger)] cursor-pointer"
              title="Delete meal"
            >
              <Trash2 size={14} />
            </button>
            
            <div className="text-[var(--color-text-secondary)]">
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
        </div>
        
        {/* Tags */}
        {meal.tags.length > 0 && !isExpanded && (
          <div className="flex flex-wrap gap-1 mt-1.5 ml-[var(--spacing-xl)]">
            {meal.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-1.5 py-0.5 text-[var(--font-size-xs)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] rounded-[var(--radius-sm)]"
              >
                {tag}
              </span>
            ))}
            {meal.tags.length > 3 && (
              <span className="px-1.5 py-0.5 text-[var(--font-size-xs)] text-[var(--color-text-secondary)]">
                +{meal.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-[var(--spacing-md)] pb-[var(--spacing-md)] border-t border-[var(--color-border-primary)]">
          {/* Foods */}
          {meal.foods.length > 0 && (
            <div className="mt-[var(--spacing-md)]">
              <h4 className="text-[var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">
                Foods
              </h4>
              <div className="space-y-2">
                {meal.foods.map((food, index) => (
                  <div 
                    key={index}
                    className="p-2 bg-[var(--color-bg-secondary)] rounded-[var(--radius-md)] border border-[var(--color-border-primary)]"
                  >
                    <FoodItem 
                      food={food}
                      onEdit={(updatedFood) => {
                        const updatedFoods = [...meal.foods];
                        updatedFoods[index] = updatedFood;
                        onMealUpdate({ ...meal, foods: updatedFoods });
                      }}
                      onDelete={() => {
                        const updatedFoods = meal.foods.filter((_, i) => i !== index);
                        onMealUpdate({ ...meal, foods: updatedFoods });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drinks */}
          {meal.drinks.length > 0 && (
            <div className="mt-[var(--spacing-md)]">
              <h4 className="text-[var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">
                Drinks
              </h4>
              <div className="space-y-2">
                {meal.drinks.map((drink, index) => (
                  <div 
                    key={index}
                    className="p-2 bg-[var(--color-bg-secondary)] rounded-[var(--radius-md)] border border-[var(--color-border-primary)]"
                  >
                    <DrinkItem 
                      drink={drink}
                      onEdit={(updatedDrink) => {
                        const updatedDrinks = [...meal.drinks];
                        updatedDrinks[index] = updatedDrink;
                        onMealUpdate({ ...meal, drinks: updatedDrinks });
                      }}
                      onDelete={() => {
                        const updatedDrinks = meal.drinks.filter((_, i) => i !== index);
                        onMealUpdate({ ...meal, drinks: updatedDrinks });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meal notes */}
          {meal.notes && (
            <div className="mt-[var(--spacing-md)] p-[var(--spacing-sm)] bg-[var(--color-bg-secondary)] rounded-[var(--radius-md)]">
              <p className="text-[var(--font-size-xs)] text-[var(--color-text-secondary)] italic">
                {meal.notes}
              </p>
            </div>
          )}

          {/* Empty state */}
          {meal.foods.length === 0 && meal.drinks.length === 0 && (
            <p className="text-[var(--font-size-xs)] text-[var(--color-text-secondary)] text-center py-[var(--spacing-md)]">
              No items in this meal yet
            </p>
          )}

          {/* Inline Add Food */}
          <InlineAddFood onAddFood={handleAddFood} />

          {/* Add Food Actions */}
          <div className="mt-[var(--spacing-md)] pt-[var(--spacing-md)] border-t border-[var(--color-border-primary)]">
            <p className="text-[var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-[var(--spacing-sm)]">
              Or use a guided wizard:
            </p>
            <Button
              onClick={() => setShowWizard(true)}
              variant="primary"
              className="w-full"
            >
              Add Food (Wizard)
            </Button>
          </div>
        </div>
      )}

      {/* Wizard Modal */}
      {showWizard && (
        <AddFoodToMealWizard
          onComplete={handleWizardComplete}
          onCancel={() => setShowWizard(false)}
        />
      )}
    </div>
  );
}
