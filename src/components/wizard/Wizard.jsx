import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { X } from 'lucide-react';
import { WizardContext } from './WizardContext';
import { WizardHeader } from './WizardHeader';
import { WizardFooter } from './WizardFooter';
import { useWizard } from '../../hooks/useWizard';
import {
  startWizardSession,
  trackWizardStep,
  trackWizardCompletion,
  trackWizardCancellation
} from '../../utils/wizardAnalytics';

/**
 * Wizard - Main wizard container component that orchestrates multi-step form flows
 * 
 * Provides modal overlay, step navigation, validation, keyboard shortcuts, and accessibility features.
 * Manages form state across steps and handles transitions with animations.
 * 
 * @component
 * @example
 * ```jsx
 * <Wizard
 *   steps={[
 *     { id: 'select', title: 'Select Food', component: FoodSelectionStep, validate: validateSelection },
 *     { id: 'quantity', title: 'Quantity', component: QuantityStep, validate: validateQuantity },
 *     { id: 'tags', title: 'Tags', component: TagsStep, optional: true }
 *   ]}
 *   initialData={{ quantity: 1, unit: 'pieces' }}
 *   onComplete={(data) => saveFoodEntry(data)}
 *   onCancel={() => closeWizard()}
 *   onPartialSave={(modifiedData, fullData) => updateFood(modifiedData)}
 *   title="Add Food to Meal"
 * />
 * ```
 * 
 * @param {Object} props
 * @param {StepConfig[]} props.steps - Array of step configurations
 * @param {Object} [props.initialData={}] - Initial form data to pre-populate fields
 * @param {Function} props.onComplete - Called when wizard completes with all form data
 * @param {Function} props.onCancel - Called when wizard is cancelled
 * @param {Function} [props.onPartialSave] - Called for partial save with (modifiedData, fullData)
 * @param {string} [props.title] - Overall wizard title displayed at top
 * @param {boolean} [props.showStepIndicator=true] - Show step progress indicator
 * @param {number} [props.startStep=0] - Initial step index (useful for edit mode)
 * 
 * @typedef {Object} StepConfig
 * @property {string} id - Unique step identifier
 * @property {string} title - Step display title
 * @property {React.Component} component - Step component to render
 * @property {Function} [validate] - Validation function (data) => boolean | {valid: boolean, errors: Object}
 * @property {boolean} [optional] - Whether step can be skipped
 * 
 * Features:
 * - Modal overlay with backdrop blur
 * - Step indicator with progress visualization
 * - Keyboard navigation (Escape to cancel, Enter to proceed)
 * - Screen reader announcements for step changes
 * - Focus management (first input on step load, first error on validation fail)
 * - Smooth slide transitions between steps
 * - Dirty state tracking with cancel confirmation
 * - Preloading of next step component for performance
 * - Partial save support for edit mode (save at any step)
 * 
 * Related: WizardHeader, WizardFooter, WizardContext, useWizard hook
 */
export function Wizard({
  steps,
  initialData = {},
  onComplete,
  onCancel,
  onPartialSave,
  title,
  showStepIndicator = true,
  startStep = 0,
}) {
  // Analytics tracking
  const sessionIdRef = useRef(null);

  // Start analytics session on mount
  useEffect(() => {
    const wizardType = title || 'Unknown';
    sessionIdRef.current = startWizardSession(wizardType);
  }, [title]);

  // Wrap handlers with analytics tracking
  const handleCompleteWithAnalytics = useCallback((data) => {
    if (sessionIdRef.current) {
      trackWizardCompletion(sessionIdRef.current);
    }
    return onComplete(data);
  }, [onComplete]);

  const handleCancelWithAnalytics = useCallback(() => {
    if (sessionIdRef.current) {
      trackWizardCancellation(sessionIdRef.current, currentStepIndexRef.current, isDirtyRef.current);
    }
    onCancel();
  }, [onCancel]);

  // Detect edit mode: if initialData has meaningful content, we're editing
  const isEditMode = useMemo(() => {
    return Object.keys(initialData).length > 0 &&
      Object.values(initialData).some(val =>
        val !== null && val !== undefined && val !== '' &&
        (Array.isArray(val) ? val.length > 0 : true)
      );
  }, [initialData]);

  // Wrap partial save handler with analytics and close logic
  const handlePartialSaveWithAnalytics = useCallback(async (modifiedData, fullData) => {
    if (!onPartialSave) return false;

    try {
      await onPartialSave(modifiedData, fullData);
      if (sessionIdRef.current) {
        trackWizardCompletion(sessionIdRef.current);
      }
      onCancel(); // Close wizard after successful save
      return true;
    } catch (error) {
      console.error('Partial save error:', error);
      return false;
    }
  }, [onPartialSave, onCancel]);

  const wizard = useWizard({
    steps,
    initialData,
    onComplete: handleCompleteWithAnalytics,
    onCancel: handleCancelWithAnalytics,
    onPartialSave: handlePartialSaveWithAnalytics,
    startStep,
  });

  const {
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
  } = wizard;

  // Track current state in refs for analytics
  const currentStepIndexRef = useRef(currentStepIndex);
  const isDirtyRef = useRef(isDirty);

  useEffect(() => {
    currentStepIndexRef.current = currentStepIndex;
    isDirtyRef.current = isDirty;
  }, [currentStepIndex, isDirty]);

  // Animation state
  const [slideDirection, setSlideDirection] = useState('none');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevStepIndex = useRef(currentStepIndex);
  const contentRef = useRef(null);

  // Screen reader announcements
  const [announcement, setAnnouncement] = useState('');

  // Focus management
  const triggerElementRef = useRef(null);
  const modalRef = useRef(null);

  // Store trigger element on mount
  useEffect(() => {
    triggerElementRef.current = document.activeElement;
  }, []);

  // Handle step transitions with slide animation, screen reader announcements, and focus management
  useEffect(() => {
    if (prevStepIndex.current !== currentStepIndex) {
      const direction = currentStepIndex > prevStepIndex.current ? 'left' : 'right';
      setSlideDirection(direction);
      setIsTransitioning(true);

      // Track step navigation
      if (sessionIdRef.current) {
        trackWizardStep(sessionIdRef.current, currentStepIndex, currentStep.id);
      }

      // Announce step change to screen readers
      const stepNumber = currentStepIndex + 1;
      const stepTitle = currentStep.title;
      setAnnouncement(`Step ${stepNumber} of ${totalSteps}: ${stepTitle}`);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setSlideDirection('none');

        // Focus first input in the new step
        if (contentRef.current) {
          const firstInput = contentRef.current.querySelector(
            'input:not([type="hidden"]), textarea, select, button[type="button"]'
          );
          if (firstInput) {
            firstInput.focus();
          }
        }
      }, 200);

      prevStepIndex.current = currentStepIndex;
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, currentStep.title, totalSteps]);

  // Focus first error when validation fails
  useEffect(() => {
    if (Object.keys(errors).length > 0 && contentRef.current) {
      // Wait for error messages to render
      setTimeout(() => {
        const firstErrorField = contentRef.current.querySelector('[aria-invalid="true"]');
        if (firstErrorField) {
          firstErrorField.focus();
        }
      }, 100);
    }
  }, [errors]);

  // Return focus to trigger element when wizard closes
  useEffect(() => {
    return () => {
      if (triggerElementRef.current && typeof triggerElementRef.current.focus === 'function') {
        // Small delay to ensure modal is fully closed
        setTimeout(() => {
          triggerElementRef.current?.focus();
        }, 100);
      }
    };
  }, []);

  // Handle keyboard navigation (Escape to cancel, Enter to proceed)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        // Allow Enter in textareas with Shift+Enter for new lines
        const target = e.target;
        if (target.tagName === 'TEXTAREA') {
          return;
        }

        // Prevent form submission on Enter in inputs
        if (target.tagName === 'INPUT' || target.tagName === 'BUTTON') {
          e.preventDefault();

          // Only proceed if not on a button (let buttons handle their own clicks)
          if (target.tagName !== 'BUTTON') {
            goNext();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cancel, goNext]);

  const StepComponent = currentStep.component;
  const NextStepComponent = !isLastStep ? steps[currentStepIndex + 1]?.component : null;

  // Preload next step component (render off-screen)
  useEffect(() => {
    // This effect ensures the next step component is loaded but not visible
    // Improves perceived performance when navigating forward
  }, [currentStepIndex, isLastStep]);

  // Slide animation classes
  const getSlideClass = () => {
    if (!isTransitioning) return 'translate-x-0 opacity-100';
    if (slideDirection === 'left') return '-translate-x-4 opacity-0';
    if (slideDirection === 'right') return 'translate-x-4 opacity-0';
    return 'translate-x-0 opacity-100';
  };

  // Determine if partial save is available (edit mode with changes)
  const canSavePartial = isEditMode && isDirty && !!onPartialSave;

  // Memoize context value to prevent unnecessary re-renders of step components
  const contextValue = useMemo(() => ({
    currentStep: currentStepIndex,
    totalSteps,
    formData,
    errors,
    isDirty,
    isFirstStep,
    isLastStep,
    canSavePartial,
    updateData,
    goNext,
    goBack,
    cancel,
    savePartial,
  }), [
    currentStepIndex,
    totalSteps,
    formData,
    errors,
    isDirty,
    isFirstStep,
    isLastStep,
    canSavePartial,
    updateData,
    goNext,
    goBack,
    cancel,
    savePartial,
  ]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Modal backdrop - subtle */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{ backgroundColor: 'var(--color-overlay-backdrop)' }}
        onClick={cancel}
        aria-hidden="true"
      />

      {/* Modal container with clean border */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wizard-title"
        aria-describedby="wizard-step-title"
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderRadius: 'var(--radius-xl)',
          border: `${`var(--border-width-thin)`} solid var(--color-border-primary)`
        }}
      >
        {/* Close button */}
        <button
          onClick={cancel}
          className="absolute top-3 right-3 z-10 rounded-[var(--radius-sm)] p-1 transition-colors cursor-pointer"
          style={{
            color: 'var(--color-text-tertiary)',
            transition: `all var(--transition-fast) var(--ease-in-out)`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
            e.currentTarget.style.backgroundColor = 'var(--color-hover-bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-tertiary)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Close wizard"
        >
          <X size={16} />
        </button>

        {/* Title */}
        {title && (
          <div
            className="px-5 pt-4 pb-3 pr-12"
            style={{ borderBottom: `${`var(--border-width-thin)`} solid var(--color-border-primary)` }}
          >
            <h2
              id="wizard-title"
              style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)'
              }}
            >
              {title}
            </h2>
          </div>
        )}

        {/* Step indicator */}
        {showStepIndicator && (
          <WizardHeader
            currentStep={currentStepIndex}
            totalSteps={totalSteps}
            steps={steps.map((step, index) => ({
              id: step.id,
              title: step.title,
              completed: completedSteps.has(index),
              optional: step.optional,
            }))}
            onStepClick={goToStep}
          />
        )}

        {/* Content area (scrollable with custom scrollbar) */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-5 py-4 transition-all duration-200 ease-in-out"
        >
          <div className={`transition-all duration-200 ease-in-out ${getSlideClass()}`}>
            {/* Step-level error summary */}
            {Object.keys(errors).length > 0 && (
              <div
                role="alert"
                aria-live="assertive"
                className="mb-4 p-3 animate-fade-in"
                style={{
                  backgroundColor: 'var(--color-danger-bg)',
                  border: `${`var(--border-width-thin)`} solid var(--color-danger)`,
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <p
                  className="flex items-center gap-2"
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-danger-text)',
                    fontWeight: 'var(--font-weight-semibold)'
                  }}
                >
                  <span style={{ fontSize: 'var(--font-size-base)' }}>⚠</span>
                  {errors._general || 'Please fix the following errors:'}
                </p>
                {!errors._general && Object.keys(errors).length > 1 && (
                  <ul
                    className="list-disc list-inside mt-2 space-y-1"
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-danger-text-secondary)'
                    }}
                  >
                    {Object.entries(errors)
                      .filter(([key]) => key !== '_general')
                      .map(([key, message]) => (
                        <li key={key}>{message}</li>
                      ))}
                  </ul>
                )}
              </div>
            )}

            <WizardContext.Provider value={contextValue}>
              <StepComponent />
            </WizardContext.Provider>
          </div>

          {/* Preload next step component (hidden, for performance) */}
          {NextStepComponent && (
            <div className="hidden" aria-hidden="true">
              <WizardContext.Provider value={contextValue}>
                <NextStepComponent />
              </WizardContext.Provider>
            </div>
          )}
        </div>

        {/* Footer with navigation buttons */}
        <WizardFooter
          onBack={goBack}
          onNext={goNext}
          onCancel={cancel}
          onSave={canSavePartial ? savePartial : undefined}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          canSavePartial={canSavePartial}
          nextLabel={isLastStep ? 'Complete' : 'Next'}
          isNextDisabled={isValidating}
          isLoading={isSubmitting}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
