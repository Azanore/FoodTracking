// File purpose: Form for creating and editing meals
// Related: TodayView.jsx uses this, db.js for persistence
// Should not include: Food/drink entry forms (separate components)

import { useState, useEffect } from 'react';
import { getAllMealTags } from '../services/tagService';
import { Modal, FormSection, Button, Input, CheckableButtonGroup, CheckableBadgeGroup } from './ui';

const MEAL_TYPES = [
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Lunch', label: 'Lunch' },
  { value: 'Dinner', label: 'Dinner' },
  { value: 'Snack', label: 'Snack' }
];

// Get current time in HH:MM format
const getCurrentTime = () => {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
};

// Auto-suggest meal type based on current time
const suggestMealType = (time) => {
  const [hours] = time.split(':').map(Number);

  if (hours >= 5 && hours < 11) return 'Breakfast';
  if (hours >= 11 && hours < 16) return 'Lunch';
  if (hours >= 16 && hours < 22) return 'Dinner';
  return 'Snack';
};

/**
 * MealForm component - form for adding/editing meals
 * @param {Object} props
 * @param {import('../types').Meal | null} props.meal - Meal to edit (null for new)
 * @param {Function} props.onSave - Save callback
 * @param {Function} props.onCancel - Cancel callback
 */
export function MealForm({ meal, onSave, onCancel }) {
  const isEditing = !!meal;

  const [mealType, setMealType] = useState(meal?.type || '');
  const [time, setTime] = useState(meal?.time || getCurrentTime());
  const [selectedTagIds, setSelectedTagIds] = useState(meal?.tags || []);
  const [notes, setNotes] = useState(meal?.notes || '');

  const [availableTags, setAvailableTags] = useState([]);

  // Load tags and auto-suggest meal type
  useEffect(() => {
    const loadData = async () => {
      const tags = await getAllMealTags();
      setAvailableTags(tags);
    };
    loadData();

    if (!isEditing && !mealType) {
      setMealType(suggestMealType(time));
    }
  }, [isEditing, mealType, time]);

  // Update meal type suggestion when time changes
  const handleTimeChange = (newTime) => {
    setTime(newTime);
    if (!isEditing) {
      setMealType(suggestMealType(newTime));
    }
  };

  // Handle add new tag
  const handleAddNewTag = async (name) => {
    const newTag = { id: name.trim(), name: name.trim(), usageCount: 0 };
    setAvailableTags([...availableTags, newTag]);
    setSelectedTagIds([...selectedTagIds, newTag.id]);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!mealType || !time) {
      alert('Please select meal type and time');
      return;
    }

    const mealData = {
      id: meal?.id || `meal_${crypto.randomUUID().slice(0, 8)}`,
      type: mealType,
      time,
      tags: selectedTagIds,
      notes: notes.trim() || null,
      foods: meal?.foods || [],
      drinks: meal?.drinks || []
    };

    onSave(mealData);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={isEditing ? 'Edit Meal' : 'Add Custom Meal'}
      footer={
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Create Meal'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Section 1: Basic Information */}
        <FormSection title="Basic Information">
          <CheckableButtonGroup
            label="Meal Type"
            options={MEAL_TYPES}
            value={mealType}
            onChange={setMealType}
            columns={2}
            required
          />

          <Input
            label="Time"
            type="time"
            value={time}
            onChange={handleTimeChange}
            required
          />
        </FormSection>

        {/* Section 2: Tags */}
        <details className="group mb-[var(--spacing-md)] pl-[var(--spacing-md)]">
          <summary className="text-sm font-semibold text-[var(--color-text-primary)] cursor-pointer select-none mb-2 uppercase tracking-wide opacity-80 hover:opacity-100 transition-opacity flex items-center gap-1">
            <span className="group-open:rotate-90 transition-transform">▶</span> Advanced (Tags)
          </summary>
          <div className="pt-2 pl-2 border-l-2 border-[var(--color-accent)]/20">
            <CheckableBadgeGroup
              label="Meal Tags"
              items={availableTags}
              selectedIds={selectedTagIds}
              onChange={setSelectedTagIds}
              onAddNew={handleAddNewTag}
              topCount={8}
            />
          </div>
        </details>

        {/* Section 3: Notes */}
        <FormSection title="Notes">
          <Input
            label="Additional Notes"
            type="textarea"
            value={notes}
            onChange={setNotes}
            placeholder="Add notes about this meal..."
            rows={3}
          />
        </FormSection>
      </form>
    </Modal>
  );
}
