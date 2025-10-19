// File purpose: Step 4 for food wizards - add tags and notes
// Related: MultiSelectStep.jsx (reusable component), tagService.js (getAllFoodTags)
// Should not include: Quantity/measurement logic, composition logic

import { useState, useEffect, memo, useCallback } from 'react';
import { getAllFoodTags } from '../../../services/tagService';
import { useWizardContext } from '../../wizard/WizardContext';
import { WizardStepArt } from '../../wizard/WizardStepArt';
import { MultiSelectStep } from '../../wizard-steps/MultiSelectStep';

/**
 * TagsNotesStep - add tags and notes with inline tag creation
 */
export const TagsNotesStep = memo(function TagsNotesStep() {
  const { formData, updateData } = useWizardContext();
  const [availableTags, setAvailableTags] = useState([]);

  // Load all food tags
  useEffect(() => {
    const loadTags = async () => {
      const tags = await getAllFoodTags();
      // Sort by usage count
      const sorted = tags.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
      setAvailableTags(sorted);
    };
    loadTags();
  }, []);

  // Handle add new tag
  const handleAddTag = useCallback((name) => {
    const newTag = { id: name.trim(), name: name.trim(), usageCount: 0 };
    setAvailableTags(prev => [...prev, newTag]);
    
    const tags = formData.tags || [];
    updateData({ tags: [...tags, name.trim()] });
  }, [formData.tags, updateData]);

  // Handle tags change
  const handleTagsChange = useCallback((ids) => {
    updateData({ tags: ids });
  }, [updateData]);

  // Handle notes change
  const handleNotesChange = useCallback((e) => {
    updateData({ notes: e.target.value });
  }, [updateData]);

  return (
    <div className="space-y-6">
      <WizardStepArt step="details" />
      
      {/* Tags */}
      <MultiSelectStep
        label="Tags"
        items={availableTags}
        selectedIds={formData.tags || []}
        onChange={handleTagsChange}
        renderBadge={(item) => item.name}
        allowCreate={true}
        onCreateNew={handleAddTag}
        topCount={8}
      />

      {/* Notes */}
      <div>
        <label
          htmlFor="notes-textarea"
          className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide"
        >
          Notes
        </label>
        <textarea
          id="notes-textarea"
          value={formData.notes || ''}
          onChange={handleNotesChange}
          placeholder="Add any notes about this food..."
          aria-label="Notes"
          rows={4}
          className="w-full px-3.5 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none bg-white transition-all"
        />
      </div>
    </div>
  );
});
