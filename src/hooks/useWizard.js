import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * useWizard - Custom hook for managing wizard state and navigation
 * 
 * Handles step progression, validation, dirty state tracking, and form data management.
 * Provides all necessary state and methods for wizard components.
 * 
 * @param {Object} config
 * @param {StepConfig[]} config.steps - Array of step configurations
 * @param {Object} [config.initialData={}] - Initial form data
 * @param {Function} config.onComplete - Called when wizard completes with form data
 * @param {Function} config.onCancel - Called when wizard is cancelled
 * @param {Function} [config.onPartialSave] - Called for partial save with modified fields only
 * @param {number} [config.startStep=0] - Initial step index
 * 
 * @returns {Object} Wizard state and methods
 * @returns {number} currentStepIndex - Current step index (0-based)
 * @returns {StepConfig} currentStep - Current step configuration
 * @returns {number} totalSteps - Total number of steps
 * @returns {Object} formData - Accumulated form data
 * @returns {Object} errors - Validation errors keyed by field name
 * @returns {boolean} isDirty - Whether form data has changed from initial
 * @returns {boolean} isFirstStep - Whether on first step
 * @returns {boolean} isLastStep - Whether on last step
 * @returns {Set<number>} completedSteps - Set of completed step indices
 * @returns {boolean} isValidating - Whether validation is in progress
 * @returns {boolean} isSubmitting - Whether wizard is submitting
 * @returns {boolean} isSaving - Whether partial save is in progress
 * @returns {Set<string>} modifiedFields - Set of field names that have been modified
 * @returns {Function} updateData - Update form data (newData: Object) => void
 * @returns {Function} goNext - Navigate to next step with validation () => Promise<boolean>
 * @returns {Function} goBack - Navigate to previous step without validation () => void
 * @returns {Function} goToStep - Jump to specific completed step (stepIndex: number) => void
 * @returns {Function} cancel - Cancel wizard with confirmation if dirty () => void
 * @returns {Function} savePartial - Save only modified fields () => Promise<boolean>
 * 
 * Features:
 * - Automatic dirty state tracking
 * - Modified fields tracking for partial saves
 * - Validation before proceeding to next step
 * - Completed steps tracking for jump navigation
 * - Error clearing when fields are updated
 * - Confirmation dialog on cancel if dirty
 * - Partial save support for edit mode
 * 
 * Related: Wizard.jsx, WizardContext.jsx
 */
export function useWizard({ steps, initialData = {}, onComplete, onCancel, onPartialSave, startStep = 0 }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(startStep);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modifiedFields, setModifiedFields] = useState(new Set());
  
  const initialDataRef = useRef(initialData);

  // Track if form data has changed from initial state and which fields were modified
  useEffect(() => {
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(initialDataRef.current);
    setIsDirty(hasChanged);
    
    // Track which fields have been modified
    if (hasChanged) {
      const modified = new Set();
      Object.keys(formData).forEach(key => {
        if (JSON.stringify(formData[key]) !== JSON.stringify(initialDataRef.current[key])) {
          modified.add(key);
        }
      });
      setModifiedFields(modified);
    } else {
      setModifiedFields(new Set());
    }
  }, [formData]);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const totalSteps = steps.length;

  // Update form data and clear related errors
  const updateData = useCallback((newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
    
    // Clear errors for updated fields
    const updatedFields = Object.keys(newData);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => delete newErrors[field]);
      return newErrors;
    });
  }, []);

  // Validate current step (memoized to prevent unnecessary re-runs)
  const validateCurrentStep = useCallback(async () => {
    if (!currentStep.validate) {
      return { valid: true, errors: {} };
    }

    setIsValidating(true);
    try {
      const result = await currentStep.validate(formData);
      
      // Handle different validation return types
      if (typeof result === 'boolean') {
        return { valid: result, errors: {} };
      }
      
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      return { valid: false, errors: { _general: 'Validation failed' } };
    } finally {
      setIsValidating(false);
    }
  }, [currentStep, formData]);

  // Navigate to next step with validation
  const goNext = useCallback(async () => {
    const validation = await validateCurrentStep();
    
    if (!validation.valid) {
      setErrors(validation.errors || {});
      return false;
    }

    setErrors({});
    setCompletedSteps(prev => new Set([...prev, currentStepIndex]));

    if (isLastStep) {
      // Complete wizard
      setIsSubmitting(true);
      try {
        await onComplete(formData);
        return true;
      } catch (error) {
        console.error('Wizard completion error:', error);
        setErrors({ _general: 'Failed to save. Please try again.' });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Move to next step
      setCurrentStepIndex(prev => prev + 1);
      return true;
    }
  }, [validateCurrentStep, isLastStep, currentStepIndex, formData, onComplete]);

  // Navigate to previous step without validation
  const goBack = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
      setErrors({});
    }
  }, [isFirstStep]);

  // Jump to specific step (only if already completed)
  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length && completedSteps.has(stepIndex)) {
      setCurrentStepIndex(stepIndex);
      setErrors({});
    }
  }, [steps.length, completedSteps]);

  // Cancel wizard with confirmation if dirty
  const cancel = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmed) return;
    }
    
    onCancel();
  }, [isDirty, onCancel]);

  // Save only modified fields (partial save for edit mode)
  const savePartial = useCallback(async () => {
    if (!onPartialSave) {
      console.warn('onPartialSave handler not provided');
      return false;
    }

    if (modifiedFields.size === 0) {
      // No changes to save, just close
      onCancel();
      return true;
    }

    setIsSaving(true);
    try {
      // Build object with only modified fields
      const partialData = {};
      modifiedFields.forEach(field => {
        partialData[field] = formData[field];
      });

      await onPartialSave(partialData, formData);
      return true;
    } catch (error) {
      console.error('Partial save error:', error);
      setErrors({ _general: 'Failed to save changes. Please try again.' });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [onPartialSave, modifiedFields, formData, onCancel]);

  return {
    currentStepIndex,
    currentStep,
    totalSteps,
    formData,
    errors,
    isDirty,
    isFirstStep,
    isLastStep,
    completedSteps,
    isValidating,
    isSubmitting,
    isSaving,
    modifiedFields,
    updateData,
    goNext,
    goBack,
    goToStep,
    cancel,
    savePartial,
  };
}
