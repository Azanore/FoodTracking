// File purpose: Inline form for editing drink entries within meals
// Related: DrinkItem.jsx displays read-only, MealCard.jsx uses this for editing
// Should not include: Drink library management, meal-level operations

import { useState, useEffect } from 'react';
import { getAllDrinkTags } from '../services/tagService';
import { CheckableButtonGroup, CheckableBadgeGroup } from './ui';

const UNITS = [
  { value: 'pieces', label: 'pieces' },
  { value: 'slices', label: 'slices' },
  { value: 'plate', label: 'plate' },
  { value: 'bowl', label: 'bowl' },
  { value: 'cup', label: 'cup' },
  { value: 'glass', label: 'glass' },
  { value: 'spoon', label: 'spoon' },
  { value: 'tablespoon', label: 'tablespoon' },
  { value: 'teaspoon', label: 'teaspoon' }
];

const DRINK_CATEGORIES = [
  { value: 'Dairy', label: 'Dairy' },
  { value: 'Juice', label: 'Juice' },
  { value: 'Tea', label: 'Tea' },
  { value: 'Coffee', label: 'Coffee' },
  { value: 'Water', label: 'Water' },
  { value: 'Soda', label: 'Soda' },
  { value: 'Other', label: 'Other' }
];

/**
 * DrinkEntryForm - inline form for editing drink entries
 * @param {Object} props
 * @param {import('../types').DrinkEntry} props.drinkEntry - Drink entry to edit
 * @param {Function} props.onSave - Save callback (receives updated DrinkEntry)
 * @param {Function} props.onCancel - Cancel callback
 */
export function DrinkEntryForm({ drinkEntry, onSave, onCancel }) {
  const [quantity, setQuantity] = useState(drinkEntry.quantity);
  const [unit, setUnit] = useState(drinkEntry.unit);
  const [category, setCategory] = useState(drinkEntry.category || 'Other');
  const [selectedTagIds, setSelectedTagIds] = useState(drinkEntry.tags || []);
  const [notes, setNotes] = useState(drinkEntry.notes || '');
  
  const [availableTags, setAvailableTags] = useState([]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const tags = await getAllDrinkTags();
      setAvailableTags(tags);
    };
    loadData();
  }, []);

  // Handle save
  const handleSave = () => {
    const updatedEntry = {
      ...drinkEntry,
      quantity: parseFloat(quantity),
      unit,
      category,
      tags: selectedTagIds,
      notes: notes.trim() || null
    };
    
    onSave(updatedEntry);
  };

  // Handle add new tag
  const handleAddNewTag = async (name) => {
    const newTag = { id: name.trim(), name: name.trim(), usageCount: 0 };
    setAvailableTags([...availableTags, newTag]);
    setSelectedTagIds([...selectedTagIds, newTag.id]);
  };

  return (
    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b-2 border-blue-200">
        <h4 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wide">
          Edit: {drinkEntry.name}
        </h4>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-primary)] mb-2 uppercase tracking-wide">
          Quantity *
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0.1"
          step="0.1"
          className="w-full px-3 py-2 border-2 border-[var(--color-border)] rounded text-sm focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-blue-100 bg-white"
          required
        />
      </div>

      {/* Unit */}
      <CheckableButtonGroup
        label="Unit *"
        options={UNITS}
        value={unit}
        onChange={setUnit}
        columns={5}
      />

      {/* Category */}
      <CheckableButtonGroup
        label="Category"
        options={DRINK_CATEGORIES}
        value={category}
        onChange={setCategory}
        columns={4}
      />

      {/* Tags */}
      <CheckableBadgeGroup
        label="Tags"
        items={availableTags}
        selectedIds={selectedTagIds}
        onChange={setSelectedTagIds}
        onAddNew={handleAddNewTag}
        topCount={6}
      />

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-primary)] mb-2 uppercase tracking-wide">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
          rows={2}
          className="w-full px-3 py-2 border-2 border-[var(--color-border)] rounded text-sm focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-blue-100 resize-none bg-white"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t-2 border-blue-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white rounded transition-colors border-2 border-transparent hover:border-[var(--color-border)]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm font-semibold bg-[var(--color-accent)] text-white rounded hover:bg-blue-600 transition-colors shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
