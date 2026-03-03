// File purpose: Display a drink item in the library with usage stats and actions.
// Related: FoodsView.jsx renders this. 2-step delete; no browser confirm().

import { useState } from 'react';
import { Pencil, Trash2, Plus, AlertCircle } from 'lucide-react';

const formatLastUsed = (dateString) => {
  if (!dateString) return 'Never used';
  const date = new Date(dateString);
  const diffDays = Math.floor((new Date() - date) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString();
};

export function DrinkCard({ drink, onEdit, onDelete, onQuickLog, onTagClick }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = () => {
    if (confirmDelete) { onDelete(); setConfirmDelete(false); }
    else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] p-[var(--spacing-card-padding)] hover:border-[var(--color-accent)] transition-colors group">

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{drink.name}</h3>
        </div>
        <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-2 shrink-0">
          {/* Edit */}
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 md:p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] rounded transition-colors touch-manipulation"
              title="Edit"
            >
              <Pencil size={15} className="md:w-[13px] md:h-[13px]" />
            </button>
          )}
          {/* Delete — 2-step */}
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              onBlur={() => setConfirmDelete(false)}
              className={`flex items-center gap-0.5 px-2 md:px-1.5 py-1.5 md:py-1 rounded text-xs font-medium transition-colors touch-manipulation ${confirmDelete
                ? 'bg-[var(--color-danger)] text-white'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-danger)]'
                }`}
              title={confirmDelete ? 'Click again to confirm' : 'Delete'}
            >
              {confirmDelete ? <><AlertCircle size={15} className="md:w-[13px] md:h-[13px]" /> <span className="hidden md:inline">Del?</span></> : <Trash2 size={15} className="md:w-[13px] md:h-[13px]" />}
            </button>
          )}
          {/* Quick log */}
          {onQuickLog && (
            <button
              onClick={onQuickLog}
              className="p-1.5 md:p-1 text-white bg-[var(--color-accent)] hover:opacity-80 rounded transition-all touch-manipulation"
              title="Log to today"
            >
              <Plus size={15} className="md:w-[13px] md:h-[13px]" />
            </button>
          )}
        </div>
      </div>

      {/* Category + defaults */}
      <p className="text-xs text-[var(--color-text-secondary)] mb-2">
        {drink.category && <span className="capitalize">{drink.category} · </span>}
        {drink.defaultQuantity} {drink.defaultUnit}
      </p>

      {/* Tags */}
      {drink.tags && drink.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {drink.tags.map((tag, i) => (
            <button
              key={i}
              onClick={() => onTagClick?.(tag)}
              className="px-1.5 py-0.5 text-[10px] bg-[var(--color-hover-bg)] text-[var(--color-accent)] rounded-sm hover:bg-[var(--color-accent)]/10 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Usage stats */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-primary)]">
        <span className="text-xs text-[var(--color-text-secondary)]">Used {drink.usageCount || 0}×</span>
        <span className="text-xs text-[var(--color-text-secondary)]">{formatLastUsed(drink.lastUsed)}</span>
      </div>
    </div>
  );
}
