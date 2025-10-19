// File purpose: Form for adding/editing drinks in library
// Related: FoodsView.jsx, db.js for save operations
// Should not include: Meal logging, food forms

import { useState, useEffect } from 'react';
import { saveDrink } from '../services/db';
import { getAllDrinkTags } from '../services/tagService';
import { CheckableButtonGroup, CheckableBadgeGroup, Modal, FormSection, Button } from './ui';

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
 * DrinkForm component - modal form for adding/editing drinks
 * @param {Object} props
 * @param {import('../types').UserDrink | null} props.drink - Drink to edit (null for new)
 * @param {() => void} props.onClose - Close modal callback
 * @param {() => void} props.onSave - Save success callback
 */
export function DrinkForm({ drink, onClose, onSave }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Other');
  const [defaultQuantity, setDefaultQuantity] = useState(1);
  const [defaultUnit, setDefaultUnit] = useState('glass');
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  
  const [availableTags, setAvailableTags] = useState([]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load existing drink data
  useEffect(() => {
    const loadData = async () => {
      const tags = await getAllDrinkTags();
      setAvailableTags(tags);
      
      if (drink) {
        setName(drink.name);
        setCategory(drink.category);
        setDefaultQuantity(drink.defaultQuantity);
        setDefaultUnit(drink.defaultUnit);
        setSelectedTagIds(drink.tags || []);
      }
    };
    loadData();
  }, [drink]);

  // Handle save
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      setError('Drink name is required');
      return;
    }
    
    setSaving(true);
    try {
      const drinkData = {
        ...(drink || {}),
        name: name.trim(),
        category,
        defaultQuantity: Number(defaultQuantity),
        defaultUnit,
        tags: selectedTagIds
      };
      
      await saveDrink(drinkData);
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle add new tag
  const handleAddNewTag = async (name) => {
    const newTag = { id: name.trim(), name: name.trim(), usageCount: 0 };
    setAvailableTags([...availableTags, newTag]);
    setSelectedTagIds([...selectedTagIds, newTag.id]);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={drink ? 'Edit Drink' : 'Add Drink'}
      footer={
        <div className="flex justify-end gap-[var(--spacing-md)]">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Drink'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="p-[var(--spacing-md)] bg-red-50 border border-[var(--color-danger)] rounded-[var(--radius-md)] text-[var(--font-size-sm)] text-[var(--color-danger)] font-[var(--font-weight-medium)] mb-[var(--spacing-lg)]">
            {error}
          </div>
        )}

        {/* Section 1: Basic Information */}
        <FormSection title="Basic Information">
          {/* Name */}
          <div>
            <label className="block text-[var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-primary)] mb-[var(--spacing-sm)] uppercase tracking-[var(--letter-spacing-wide)]">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[var(--font-size-sm)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-border-focus)]/20 transition-colors duration-[var(--transition-fast)]"
              placeholder="e.g., Mint Tea"
              required
            />
          </div>

          {/* Category */}
          <CheckableButtonGroup
            label="Category *"
            options={DRINK_CATEGORIES}
            value={category}
            onChange={setCategory}
            columns={4}
          />
        </FormSection>

        {/* Section 2: Measurement */}
        <FormSection title="Measurement">
          {/* Quantity */}
          <div>
            <label className="block text-[var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-primary)] mb-[var(--spacing-sm)] uppercase tracking-[var(--letter-spacing-wide)]">
              Quantity *
            </label>
            <input
              type="number"
              value={defaultQuantity}
              onChange={(e) => setDefaultQuantity(e.target.value)}
              min="0.1"
              step="0.1"
              className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[var(--font-size-sm)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-border-focus)]/20 transition-colors duration-[var(--transition-fast)]"
              required
            />
          </div>

          {/* Unit */}
          <CheckableButtonGroup
            label="Unit *"
            options={UNITS}
            value={defaultUnit}
            onChange={setDefaultUnit}
            columns={5}
          />
        </FormSection>

        {/* Section 3: Tags */}
        <FormSection title="Tags">
          <CheckableBadgeGroup
            label="Drink Tags"
            items={availableTags}
            selectedIds={selectedTagIds}
            onChange={setSelectedTagIds}
            onAddNew={handleAddNewTag}
            topCount={8}
          />
        </FormSection>
      </form>
    </Modal>
  );
}
