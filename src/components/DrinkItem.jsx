// File purpose: Display a single drink entry. Delete-only — re-add via LogItemModal for changes.
// Related: MealCard.jsx renders this.

import { Trash2 } from 'lucide-react';

export function DrinkItem({ drink, onDelete }) {
  return (
    <div className="flex items-start gap-2 text-xs group">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="font-semibold text-[var(--color-text-primary)]">{drink.name}</span>
          <span className="text-[var(--color-text-secondary)] whitespace-nowrap">
            {drink.quantity} {drink.unit}
            {drink.category && ` · ${drink.category}`}
          </span>
        </div>
      </div>

      {onDelete && (
        <button
          onClick={onDelete}
          className="shrink-0 p-0.5 opacity-0 group-hover:opacity-100 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] rounded transition-all"
          title="Remove"
        >
          <Trash2 size={11} />
        </button>
      )}
    </div>
  );
}
