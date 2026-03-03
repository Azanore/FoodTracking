// File purpose: Collapsible meal card with header + button, 2-step delete confirm.
// Related: TodayView.jsx renders this, LogItemModal.jsx for item logging.
// Should not include: Meal creation, database operations.

import { useState } from 'react';
import { Coffee, Sun, Moon, Cookie, ChevronDown, ChevronUp, Edit2, Trash2, Plus, AlertCircle } from 'lucide-react';
import { FoodItem } from './FoodItem';
import { DrinkItem } from './DrinkItem';
import { LogItemModal } from './LogItemModal';

const MEAL_ICONS = {
  Breakfast: Sun,
  Lunch: Coffee,
  Dinner: Moon,
  Snack: Cookie,
};

/**
 * MealCard
 *
 * Key UX decisions:
 * - Summary line always visible (collapsed or expanded) — no layout shift.
 * - + Add button on header row — no need to expand first.
 * - Delete requires 2 clicks (click trash → confirm appears inline; click again → deletes).
 * - Food/DrinkItem no longer have an edit button — delete + re-add is faster.
 *
 * @param {Object}   props.meal         Meal data
 * @param {Function} props.onEdit       Open MealForm to edit metadata
 * @param {Function} props.onDelete     Delete this meal
 * @param {Function} props.onMealUpdate Update meal items
 */
export function MealCard({ meal, onEdit, onDelete, onMealUpdate }) {
  const [isExpanded, setIsExpanded]   = useState(false);
  const [showModal, setShowModal]     = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const MealIcon  = MEAL_ICONS[meal.type] || Cookie;
  const itemCount = meal.foods.length + meal.drinks.length;
  const summaryItems = [
    ...meal.foods.map(f => f.name),
    ...meal.drinks.map(d => d.name),
  ];
  const summaryText = summaryItems.length > 0
    ? summaryItems.slice(0, 4).join(', ') + (summaryItems.length > 4 ? `…` : '')
    : 'Nothing logged yet';

  const mealLabel = `${meal.type} · ${meal.time}`;

  const handleLogSave = (entry) => {
    const updatedMeal = entry.type === 'drink'
      ? { ...meal, drinks: [...meal.drinks, entry] }
      : { ...meal, foods:  [...meal.foods,  entry] };
    onMealUpdate(updatedMeal);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete(meal.id);
    } else {
      setConfirmDelete(true);
      // Auto-cancel confirmation after 3 s
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] overflow-hidden">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 px-3 py-2.5">

        {/* Icon + type + time — clicking expands */}
        <button
          className="flex items-center gap-2 flex-1 min-w-0 text-left"
          onClick={() => setIsExpanded(v => !v)}
        >
          <span className="text-[var(--color-accent)] shrink-0">
            <MealIcon size={14} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 leading-none mb-0.5">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">{meal.type}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{meal.time}</span>
            </div>
            {/* Summary — always visible regardless of expand state */}
            <p className="text-xs text-[var(--color-text-secondary)] truncate leading-snug">
              {summaryText}
              {itemCount > 0 && <span className="ml-1 text-[var(--color-text-secondary)] opacity-60">({itemCount})</span>}
            </p>
          </div>
          <span className="text-[var(--color-text-secondary)] shrink-0 ml-1">
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </span>
        </button>

        {/* + Add button */}
        <button
          onClick={e => { e.stopPropagation(); setShowModal(true); }}
          className="shrink-0 flex items-center gap-0.5 px-2 py-1 text-xs font-semibold text-[var(--color-accent)] bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 rounded-md transition-colors"
          title="Log item to this meal"
        >
          <Plus size={11} />
          Add
        </button>

        {/* Edit meal metadata */}
        <button
          onClick={e => { e.stopPropagation(); onEdit(meal); }}
          className="shrink-0 p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-hover-bg)] rounded transition-colors"
          title="Edit meal"
        >
          <Edit2 size={12} />
        </button>

        {/* Delete — 2-step */}
        <button
          onClick={handleDeleteClick}
          onBlur={() => setConfirmDelete(false)}
          className={`shrink-0 flex items-center gap-1 px-1.5 py-1 rounded transition-colors text-xs font-medium ${
            confirmDelete
              ? 'bg-[var(--color-danger)] text-white'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-hover-bg)]'
          }`}
          title={confirmDelete ? 'Click again to confirm delete' : 'Delete meal'}
        >
          {confirmDelete ? (
            <><AlertCircle size={12} /> Delete?</>
          ) : (
            <Trash2 size={12} />
          )}
        </button>
      </div>

      {/* ── Expanded content ──────────────────────────────────────────── */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 border-t border-[var(--color-border-primary)]">

          {/* Meal tags */}
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
            <div className="space-y-1.5 mb-1.5">
              {meal.foods.map((food, i) => (
                <div key={i} className="p-2 bg-[var(--color-bg-secondary)] rounded-md border border-[var(--color-border-primary)]">
                  <FoodItem
                    food={food}
                    onDelete={() => onMealUpdate({ ...meal, foods: meal.foods.filter((_, idx) => idx !== i) })}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Drinks */}
          {meal.drinks.length > 0 && (
            <div className="space-y-1.5 mb-1.5">
              {meal.drinks.map((drink, i) => (
                <div key={i} className="p-2 bg-[var(--color-bg-secondary)] rounded-md border border-[var(--color-border-primary)]">
                  <DrinkItem
                    drink={drink}
                    onDelete={() => onMealUpdate({ ...meal, drinks: meal.drinks.filter((_, idx) => idx !== i) })}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Meal notes */}
          {meal.notes && (
            <p className="text-xs text-[var(--color-text-secondary)] italic px-1 mt-1">{meal.notes}</p>
          )}

          {/* Empty nudge */}
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
          mealLabel={mealLabel}
        />
      )}
    </div>
  );
}
