// File purpose: Display a single food entry with inline quantity editing.
// Related: MealCard.jsx uses this component.

import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
export function FoodItem({ food, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editQuantity, setEditQuantity] = useState(food.quantity);

  const handleSave = () => {
    onEdit?.({ ...food, quantity: Number(editQuantity) });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-1 bg-white border border-blue-200 rounded">
        <input 
          type="number" 
          value={editQuantity} 
          onChange={e => setEditQuantity(e.target.value)} 
          className="w-16 px-2 py-1 border rounded text-xs" 
          min="0.1" step="0.1" autoFocus 
        />
        <span className="text-xs">{food.unit}</span>
        <button onClick={handleSave} className="px-2 py-1 text-xs bg-[var(--color-accent)] text-white rounded">Save</button>
        <button onClick={() => setIsEditing(false)} className="px-2 py-1 text-xs bg-gray-200 rounded">Cancel</button>
      </div>
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
          {food.ingredients && food.ingredients.length > 0 && (
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
          {food.extras && food.extras.length > 0 && (
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
          {food.tags && food.tags.length > 0 && (
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
                onClick={() => setIsEditing(true)}
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
