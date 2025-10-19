// File purpose: Display a single food entry with all properties
// Related: MealCard.jsx uses this component, types.js defines FoodEntry
// Wizard Integration: Uses EditFoodInMealWizard for guided editing
// Should not include: Complex form logic

import { useState } from 'react';
import { Edit2, Trash2, Wand2 } from 'lucide-react';
import { EditFoodInMealWizard } from './food-wizards/EditFoodInMealWizard';

/**
 * FoodItem component - displays a food entry with all details
 * 
 * Uses EditFoodInMealWizard for editing (guided 4-step wizard starting on step 2)
 * 
 * @param {Object} props
 * @param {import('../types').FoodEntry} props.food - Food entry data
 * @param {Function} [props.onEdit] - Edit callback (receives updated FoodEntry)
 * @param {Function} [props.onDelete] - Delete callback
 */
export function FoodItem({ food, onEdit, onDelete }) {
  const [isEditingWizard, setIsEditingWizard] = useState(false);

  const handleWizardComplete = (updatedEntry) => {
    onEdit?.(updatedEntry);
    setIsEditingWizard(false);
  };

  if (isEditingWizard) {
    return (
      <EditFoodInMealWizard
        foodEntry={food}
        onComplete={handleWizardComplete}
        onCancel={() => setIsEditingWizard(false)}
      />
    );
  }
  return (
    <div className="text-[var(--font-size-xs)] group">
      {/* Name and basic info */}
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]">
              {food.name}
            </span>
            <span className="text-[var(--color-text-secondary)] whitespace-nowrap">
              {food.quantity} {food.unit}
              {food.portion && ` • ${food.portion}`}
              {food.cookingMethod && ` • ${food.cookingMethod}`}
            </span>
          </div>
          
          {/* Ingredients badges */}
          {food.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1.5">
              {food.ingredients.map((ing, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-[var(--font-weight-medium)] bg-[var(--color-badge-ingredient-bg)] text-[var(--color-badge-ingredient-text)] border border-[var(--color-badge-ingredient-border)] rounded-[var(--radius-sm)]"
                >
                  {ing.name}
                </span>
              ))}
            </div>
          )}
          
          {/* Extras badges */}
          {food.extras.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1.5">
              {food.extras.map((extra, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-[var(--font-weight-medium)] bg-[var(--color-badge-extra-bg)] text-[var(--color-badge-extra-text)] border border-[var(--color-badge-extra-border)] rounded-[var(--radius-sm)]"
                >
                  +{extra.name}
                </span>
              ))}
            </div>
          )}
          
          {/* Tags badges */}
          {food.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1.5">
              {food.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-[var(--font-weight-medium)] bg-[var(--color-badge-tag-bg)] text-[var(--color-badge-tag-text)] border border-[var(--color-badge-tag-border)] rounded-[var(--radius-sm)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Notes */}
          {food.notes && (
            <div className="text-[10px] text-[var(--color-text-secondary)] italic mt-1">
              {food.notes}
            </div>
          )}
        </div>
        
        {/* Edit/Delete buttons */}
        {(onEdit || onDelete) && (
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--transition-fast)]">
            {onEdit && (
              <button
                onClick={() => setIsEditingWizard(true)}
                className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] rounded-[var(--radius-sm)] transition-colors duration-[var(--transition-fast)] cursor-pointer"
                title="Edit food"
              >
                <Edit2 size={12} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] rounded-[var(--radius-sm)] transition-colors duration-[var(--transition-fast)] cursor-pointer"
                title="Remove food"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
