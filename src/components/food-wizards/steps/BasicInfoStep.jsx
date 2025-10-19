// File purpose: Step 1 for FoodLibraryWizard - basic food information (name)
// Related: WizardContext.jsx, FoodLibraryWizard.jsx
// Should not include: Measurement logic, multi-step orchestration

import { memo, useCallback } from 'react';
import { useWizardContext } from '../../wizard/WizardContext';

/**
 * BasicInfoStep - capture basic food information (name)
 * Used in FoodLibraryWizard for creating/editing library foods
 */
export const BasicInfoStep = memo(function BasicInfoStep() {
  const { formData, updateData, errors } = useWizardContext();

  const handleNameChange = useCallback((e) => {
    updateData({ name: e.target.value });
  }, [updateData]);

  return (
    <div className="space-y-6">
      {/* Food Name */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          Food Name *
        </label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={handleNameChange}
          placeholder="e.g., Chicken Breast, Brown Rice, Apple"
          className={`w-full px-3 py-2 border-2 rounded text-sm focus:outline-none focus:border-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          autoFocus
        />
        {errors.name && (
          <p className="text-xs text-red-600 mt-1">{errors.name}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Enter a descriptive name for this food item
        </p>
      </div>
    </div>
  );
});
