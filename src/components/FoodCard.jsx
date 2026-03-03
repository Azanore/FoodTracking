// File purpose: Display food item in library with details and usage stats
// Related: FoodsView.jsx renders this component
// Should not include: Form components

import { Pencil, Trash2, Plus } from 'lucide-react';

/**
 * FoodCard component - displays food details in library
 * @param {Object} props
 * @param {import('../types').UserFood} props.food - Food data
 * @param {() => void} props.onEdit - Edit callback (wizard)
 * @param {() => void} props.onDelete - Delete callback
 * @param {() => void} props.onQuickLog - One-tap log callback
 */
export function FoodCard({ food, onEdit, onDelete, onQuickLog }) {
  // Format last used date
  const formatLastUsed = (dateString) => {
    if (!dateString) return 'Never used';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Format portion display
  const formatPortion = (portion) => {
    if (!portion) return '';
    return portion.charAt(0).toUpperCase() + portion.slice(1);
  };

  // Format cooking method display
  const formatCookingMethod = (method) => {
    if (!method) return '';
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  return (
    <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] p-[var(--spacing-card-padding)] hover:border-[var(--color-accent)] transition-colors duration-[var(--transition-fast)] group">
      {/* Header with name and actions */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
          {food.name}
        </h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--transition-fast)]">
          {onQuickLog && (
            <button
              onClick={onQuickLog}
              className="p-1 mr-1 text-[var(--color-bg-primary)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] transition-colors duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] rounded-[var(--radius-sm)] cursor-pointer"
              title="Quick Log to Today"
            >
              <Plus size={14} />
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] rounded-[var(--radius-sm)] cursor-pointer"
              title="Edit food"
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--color-danger)] rounded-[var(--radius-sm)] cursor-pointer"
              title="Delete food"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Defaults */}
      <div className="space-y-1 mb-3">
        <div className="text-sm text-[var(--color-text-secondary)]">
          <span className="font-medium">Default: </span>
          {food.defaultQuantity} {food.defaultUnit}
          {food.defaultPortion && ` • ${formatPortion(food.defaultPortion)}`}
          {food.defaultCookingMethod && ` • ${formatCookingMethod(food.defaultCookingMethod)}`}
        </div>
      </div>

      {/* Ingredients */}
      {food.ingredients && food.ingredients.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
            Ingredients:
          </p>
          <div className="flex flex-wrap gap-2">
            {food.ingredients.map((ing, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] rounded"
              >
                {ing.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {food.tags && food.tags.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {food.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-[var(--color-hover-bg)] text-[var(--color-accent)] rounded-[var(--radius-sm)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Usage stats */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-primary)]">
        <span className="text-xs text-[var(--color-text-secondary)]">
          Used {food.usageCount || 0} time{food.usageCount !== 1 ? 's' : ''}
        </span>
        <span className="text-xs text-[var(--color-text-secondary)]">
          {formatLastUsed(food.lastUsed)}
        </span>
      </div>
    </div>
  );
}
