// File purpose: Step 2 for food wizards - set quantity, unit, portion, cooking method
// Related: CheckableButtonGroup.jsx (UI component), WizardContext (state management)
// Should not include: Food selection logic, composition/tags logic

import { memo, useCallback } from 'react';
import { useWizardContext } from '../../wizard/WizardContext';
import { WizardStepArt } from '../../wizard/WizardStepArt';
import { CheckableButtonGroup } from '../../ui/CheckableButtonGroup';

// Unit options
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

// Portion options
const PORTIONS = [
  { value: 'tiny', label: 'tiny' },
  { value: 'small', label: 'small' },
  { value: 'medium', label: 'medium' },
  { value: 'large', label: 'large' },
  { value: 'full', label: 'full' },
  { value: 'half', label: 'half' },
  { value: 'quarter', label: 'quarter' }
];

// Cooking method options
const COOKING_METHODS = [
  { value: 'raw', label: 'raw' },
  { value: 'fried', label: 'fried' },
  { value: 'baked', label: 'baked' },
  { value: 'boiled', label: 'boiled' },
  { value: 'steamed', label: 'steamed' },
  { value: 'grilled', label: 'grilled' },
  { value: 'roasted', label: 'roasted' },
  { value: 'stewed', label: 'stewed' },
  { value: 'sauteed', label: 'sauteed' },
  { value: 'blanched', label: 'blanched' }
];

/**
 * QuantityMeasurementStep - set quantity, unit, portion, and cooking method
 */
export const QuantityMeasurementStep = memo(function QuantityMeasurementStep() {
  const { formData, updateData, errors } = useWizardContext();

  const handleQuantityChange = useCallback((e) => {
    updateData({ quantity: e.target.value });
  }, [updateData]);

  const handleUnitChange = useCallback((value) => {
    updateData({ unit: value });
  }, [updateData]);

  const handlePortionChange = useCallback((value) => {
    updateData({ portion: value });
  }, [updateData]);

  const handleCookingMethodChange = useCallback((value) => {
    updateData({ cookingMethod: value });
  }, [updateData]);

  return (
    <div className="space-y-6">
      <WizardStepArt step="quantity" />
      
      {/* Quantity */}
      <div>
        <label
          htmlFor="quantity-input"
          className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide"
        >
          Quantity *
        </label>
        <input
          id="quantity-input"
          type="number"
          value={formData.quantity || ''}
          onChange={handleQuantityChange}
          min="0.1"
          step="0.1"
          aria-invalid={!!errors?.quantity}
          aria-describedby={errors?.quantity ? 'quantity-error' : undefined}
          className={`
            w-full px-3.5 py-2.5 border-2 rounded-lg text-sm focus:outline-none transition-all bg-white
            ${errors?.quantity 
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            }
          `}
          autoFocus
        />
        {errors?.quantity && (
          <p id="quantity-error" className="text-xs text-red-600 mt-1.5 font-medium flex items-start gap-1" role="alert">
            <span className="inline-block mt-0.5">⚠</span>
            <span>{errors.quantity}</span>
          </p>
        )}
      </div>

      {/* Unit */}
      <CheckableButtonGroup
        label="Unit *"
        options={UNITS}
        value={formData.unit || ''}
        onChange={handleUnitChange}
        columns={5}
        error={errors?.unit}
      />

      {/* Advanced Measurement Options (Portion, Cooking Method) */}
      <details className="group mt-4">
        <summary className="text-xs font-semibold text-gray-700 cursor-pointer select-none mb-2 uppercase tracking-wide opacity-80 hover:opacity-100 transition-opacity flex items-center gap-1">
          <span className="group-open:rotate-90 transition-transform">▶</span> Advanced Options (Portion, Cooking)
        </summary>
        <div className="pt-2 pl-2 space-y-6 border-l-2 border-blue-500/20">
          <CheckableButtonGroup
            label="Portion"
            options={PORTIONS}
            value={formData.portion || ''}
            onChange={handlePortionChange}
            columns={4}
          />

          <CheckableButtonGroup
            label="Cooking Method"
            options={COOKING_METHODS}
            value={formData.cookingMethod || ''}
            onChange={handleCookingMethodChange}
            columns={5}
          />
        </div>
      </details>
    </div>
  );
});
