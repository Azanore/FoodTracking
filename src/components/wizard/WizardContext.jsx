import { createContext, useContext } from 'react';

/**
 * WizardContext - React Context for sharing wizard state with step components
 * 
 * Provides access to wizard navigation, form data, validation errors, and state management.
 * Step components access this context via useWizardContext hook.
 * 
 * @typedef {Object} WizardContextValue
 * @property {number} currentStep - Current step index (0-based)
 * @property {number} totalSteps - Total number of steps
 * @property {Object} formData - Accumulated form data from all steps
 * @property {Object} errors - Validation errors keyed by field name
 * @property {boolean} isDirty - Whether user has made any changes
 * @property {boolean} isFirstStep - Whether on first step
 * @property {boolean} isLastStep - Whether on last step
 * @property {boolean} canSavePartial - Whether partial save is available (edit mode)
 * @property {Function} updateData - Update form data (data: Object) => void
 * @property {Function} goNext - Navigate to next step with validation
 * @property {Function} goBack - Navigate to previous step without validation
 * @property {Function} cancel - Cancel wizard with confirmation if dirty
 * @property {Function} savePartial - Save only modified fields (edit mode)
 * 
 * Related: Wizard.jsx, useWizardContext hook
 */
const WizardContext = createContext({
  currentStep: 0,
  totalSteps: 0,
  formData: {},
  errors: {},
  isDirty: false,
  isFirstStep: false,
  isLastStep: false,
  canSavePartial: false,
  updateData: () => {},
  goNext: () => {},
  goBack: () => {},
  cancel: () => {},
  savePartial: () => {},
});

/**
 * useWizardContext - Hook to access wizard context from step components
 * 
 * Must be used within a Wizard component. Provides access to wizard state and navigation.
 * 
 * @returns {WizardContextValue} Wizard context value
 * @throws {Error} If used outside of Wizard component
 * 
 * @example
 * ```jsx
 * function MyStep() {
 *   const { formData, updateData, errors } = useWizardContext();
 *   
 *   return (
 *     <input
 *       value={formData.name || ''}
 *       onChange={(e) => updateData({ name: e.target.value })}
 *       aria-invalid={!!errors.name}
 *     />
 *   );
 * }
 * ```
 */
export const useWizardContext = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizardContext must be used within a Wizard component');
  }
  return context;
};

export { WizardContext };
