// File purpose: Collapsible meal card with inline + button to log items directly.
// Related: TodayView.jsx renders this, LogItemModal.jsx for item logging.
// Should not include: Meal creation, database operations.

import { useState } from 'react';
import { Coffee, Sun, Moon, Cookie, ChevronDown, ChevronUp, Edit2, Trash2, Plus } from 'lucide-react';
import { FoodItem } from './FoodItem';
import { DrinkItem } from './DrinkItem';
import { LogItemModal } from './LogItemModal';

const MEAL_ICONS = {
  Breakfast: Sun,
  Lunch: Coffee,
  Dinner: Moon,
  Snack: Cookie
};

/**
 * MealCard – displays a meal with collapsible items.
 * Clicking the + button on the header instantly opens LogItemModal pre-locked to this meal.
 *
 * @param {Object}   props.meal         - Meal data object
 * @param {Array}    props.allMeals     - All meals today (passed to LogItemModal for meal-switching)
 * @param {Function} props.onEdit       - Edit meal metadata callback
 * @param {Function} props.onDelete     - Delete meal callback
 * @param {Function} props.onMealUpdate - Update meal items callback
 */
export function MealCard({ meal, allMeals = [], onEdit, onDelete, onMealUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const MealIcon = MEAL_ICONS[meal.type] || Cookie;
  const itemCount = meal.foods.length + meal.drinks.length;
  const summary = [
    meal.foods.map(f => f.name).join(', '),
    meal.drinks.map(d => d.name).join(', ')
  ].filter(Boolean).join(' · ');

  // LogItemModal calls this with (entry, targetMealId).
  // Since we pass the meal's own id but the user can switch inside the modal,
  // we let TodayView handle cross-meal routing — so we just call onMealUpdate
  // for THIS meal. If user switched meal inside modal, the parent TodayView handles it.
  const handleLogSave = (entry) => {
    let updatedMeal = { ...meal };
    if (entry.type === 'drink') {
      updatedMeal.drinks = [...meal.drinks, entry];
    } else {
      updatedMeal.foods = [...meal.foods, entry];
    }
    onMealUpdate(updatedMeal);
  };

  return (
    <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-[var(--spacing-md)] py-[var(--spacing-sm)]">

        {/* Expand / collapse toggle */}
        <button
          className="flex items-center gap-2 flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
          onClick={() => setIsExpanded(v => !v)}
        >
          <span className="text-[var(--color-accent)] shrink-0">
            <MealIcon size={15} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">{meal.type}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{meal.time}</span>
            </div>
            {!isExpanded && (
              <p className="text-xs text-[var(--color-text-secondary)] truncate">
                {itemCount > 0 ? `${summary} (${itemCount})` : 'Nothing logged yet'}
              </p>
            )}
          </div>
          <span className="text-[var(--color-text-secondary)] shrink-0">
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </button>

        {/* + Log button — always visible on header */}
        <button
          onClick={e => { e.stopPropagation(); setShowModal(true); }}
          className="shrink-0 flex items-center gap-1 px-2 py-1 text-xs font-semibold text-[var(--color-accent)] bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 rounded-md transition-colors"
          title="Log item to this meal"
        >
          <Plus size={12} />
          Add
        </button>

        {/* Edit */}
        <button
          onClick={e => { e.stopPropagation(); onEdit(meal); }}
          className="shrink-0 p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-hover-bg)] rounded transition-colors"
          title="Edit meal"
        >
          <Edit2 size={13} />
        </button>

        {/* Delete */}
        <button
          onClick={e => { e.stopPropagation(); onDelete(meal.id); }}
          className="shrink-0 p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-hover-bg)] rounded transition-colors"
          title="Delete meal"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* ── Expanded items ── */}
      {isExpanded && (
        <div className="px-[var(--spacing-md)] pb-[var(--spacing-md)] border-t border-[var(--color-border-primary)] pt-[var(--spacing-sm)]">

          {/* Tags */}
          {meal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {meal.tags.map((tag, i) => (
                <span key={i} className="px-1.5 py-0.5 text-[10px] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Foods */}
          {meal.foods.length > 0 && (
            <div className="space-y-1.5 mb-2">
              {meal.foods.map((food, i) => (
                <div key={i} className="p-2 bg-[var(--color-bg-secondary)] rounded-md border border-[var(--color-border-primary)]">
                  <FoodItem
                    food={food}
                    onEdit={updated => {
                      const updated_foods = [...meal.foods];
                      updated_foods[i] = updated;
                      onMealUpdate({ ...meal, foods: updated_foods });
                    }}
                    onDelete={() => {
                      onMealUpdate({ ...meal, foods: meal.foods.filter((_, idx) => idx !== i) });
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Drinks */}
          {meal.drinks.length > 0 && (
            <div className="space-y-1.5 mb-2">
              {meal.drinks.map((drink, i) => (
                <div key={i} className="p-2 bg-[var(--color-bg-secondary)] rounded-md border border-[var(--color-border-primary)]">
                  <DrinkItem
                    drink={drink}
                    onEdit={updated => {
                      const updated_drinks = [...meal.drinks];
                      updated_drinks[i] = updated;
                      onMealUpdate({ ...meal, drinks: updated_drinks });
                    }}
                    onDelete={() => {
                      onMealUpdate({ ...meal, drinks: meal.drinks.filter((_, idx) => idx !== i) });
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          {meal.notes && (
            <p className="text-xs text-[var(--color-text-secondary)] italic mt-1 px-1">{meal.notes}</p>
          )}

          {/* Empty nudge — subtle, not disruptive */}
          {itemCount === 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="w-full mt-1 py-2 text-xs text-[var(--color-text-secondary)] border border-dashed border-[var(--color-border-primary)] rounded-md hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
            >
              + log something here
            </button>
          )}
        </div>
      )}

      {/* Log Item Modal */}
      {showModal && (
        <LogItemModal
          isOpen
          onClose={() => setShowModal(false)}
          onSave={handleLogSave}
          targetMealId={meal.id}
          meals={allMeals}
        />
      )}
    </div>
  );
}
