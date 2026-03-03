// File purpose: Display a single drink entry with all properties
// Related: MealCard.jsx uses this component, types.js defines DrinkEntry
// Should not include: Complex form logic (use DrinkEntryForm for editing)

import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
export function DrinkItem({ drink, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editQuantity, setEditQuantity] = useState(drink.quantity);

  const handleSave = () => {
    onEdit?.({ ...drink, quantity: Number(editQuantity) });
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
        <span className="text-xs">{drink.unit}</span>
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
              {drink.name}
            </span>
            <span className="text-[var(--color-text-secondary)] whitespace-nowrap">
              {drink.quantity} {drink.unit}
              {drink.category && ` • ${drink.category}`}
            </span>
          </div>
          
          {/* Tags badges */}
          {drink.tags && drink.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1.5">
              {drink.tags.map((tag, index) => (
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
          {drink.notes && (
            <div className="text-[10px] text-[var(--color-text-secondary)] italic mt-1">
              {drink.notes}
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
                title="Edit drink"
              >
                <Edit2 size={12} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] rounded-[var(--radius-sm)] transition-colors duration-[var(--transition-fast)] cursor-pointer"
                title="Remove drink"
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
