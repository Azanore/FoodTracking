import { memo } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * WizardFooter - Wizard footer with navigation buttons
 * 
 * Provides Back, Next/Save, and Cancel buttons with smart labeling and state management.
 * Handles loading states and button visibility based on current step.
 * Supports partial save functionality for edit mode.
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onBack - Handler for Back button click
 * @param {Function} props.onNext - Handler for Next/Save button click
 * @param {Function} props.onCancel - Handler for Cancel button click
 * @param {Function} [props.onSave] - Handler for partial save (edit mode only)
 * @param {boolean} props.isFirstStep - Whether on first step (hides Back button)
 * @param {boolean} props.isLastStep - Whether on last step (shows "Save" instead of "Next")
 * @param {boolean} [props.canSavePartial=false] - Whether partial save is available (edit mode)
 * @param {string} [props.nextLabel='Next'] - Label for Next/Save button
 * @param {boolean} [props.isNextDisabled=false] - Whether Next/Save button is disabled
 * @param {boolean} [props.isLoading=false] - Whether showing loading state
 * @param {boolean} [props.isSaving=false] - Whether showing saving state for partial save
 * 
 * Button Hierarchy (left to right):
 * - Cancel: Secondary action, left side
 * - Back: Secondary navigation, right side group
 * - Save: Primary action for partial updates (edit mode)
 * - Next/Complete: Primary action for progression
 * 
 * Related: Wizard.jsx
 */
export const WizardFooter = memo(function WizardFooter({
  onBack,
  onNext,
  onCancel,
  onSave,
  isFirstStep,
  isLastStep,
  canSavePartial = false,
  nextLabel = 'Next',
  isNextDisabled = false,
  isLoading = false,
  isSaving = false,
}) {
  return (
    <div 
      className="flex items-center justify-between"
      style={{
        padding: `${16}px ${24}px`,
        borderTop: `${1}px solid var(--color-border-primary)`,
        backgroundColor: 'var(--color-bg-secondary)',
      }}
    >
      {/* Cancel button */}
      <button
        onClick={onCancel}
        disabled={isLoading || isSaving}
        aria-label="Cancel wizard"
        className="rounded-md transition-all disabled:cursor-not-allowed"
        style={{
          padding: `${10}px ${16}px`,
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--color-text-secondary)',
          backgroundColor: 'transparent',
          opacity: (isLoading || isSaving) ? 0.5 : 1,
          transitionDuration: 'var(--transition-fast)',
          transitionTimingFunction: 'var(--ease-in-out)',
        }}
        onMouseEnter={(e) => {
          if (!isLoading && !isSaving) {
            e.currentTarget.style.color = 'var(--color-text-primary)';
            e.currentTarget.style.backgroundColor = 'var(--color-hover-bg)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-text-secondary)';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        Cancel
      </button>

      {/* Navigation buttons */}
      <div className="flex items-center" style={{ gap: '12px' }}>
        {/* Back button */}
        {!isFirstStep && (
          <button
            onClick={onBack}
            disabled={isLoading || isSaving}
            aria-label="Go to previous step"
            className="rounded-lg transition-all disabled:cursor-not-allowed"
            style={{
              padding: `${10}px ${20}px`,
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-bg-primary)',
              border: `${2}px solid var(--color-border-secondary)`,
              opacity: (isLoading || isSaving) ? 0.5 : 1,
              transitionDuration: 'var(--transition-fast)',
              transitionTimingFunction: 'var(--ease-in-out)',
            }}
            onMouseEnter={(e) => {
              if (!isLoading && !isSaving) {
                e.currentTarget.style.backgroundColor = 'var(--color-hover-bg)';
                e.currentTarget.style.borderColor = 'var(--color-text-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-primary)';
              e.currentTarget.style.borderColor = 'var(--color-border-secondary)';
            }}
          >
            Back
          </button>
        )}

        {/* Save button (edit mode only) */}
        {canSavePartial && onSave && (
          <button
            onClick={onSave}
            disabled={isLoading || isSaving}
            aria-label="Save changes"
            aria-disabled={isLoading || isSaving}
            className="rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center"
            style={{
              padding: `${10}px ${24}px`,
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-white)',
              backgroundColor: isSaving ? 'var(--color-success)' : 'var(--color-success)',
              border: 'none',
              opacity: (isLoading || isSaving) ? 0.7 : 1,
              minWidth: '110px',
              gap: '8px',
              transitionDuration: 'var(--transition-fast)',
              transitionTimingFunction: 'var(--ease-in-out)',
            }}
            onMouseEnter={(e) => {
              if (!isLoading && !isSaving) {
                e.currentTarget.style.backgroundColor = 'var(--color-success-hover)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-success)';
            }}
            onMouseDown={(e) => {
              if (!isLoading && !isSaving) {
                e.currentTarget.style.backgroundColor = 'var(--color-success-hover)';
              }
            }}
            onMouseUp={(e) => {
              if (!isLoading && !isSaving) {
                e.currentTarget.style.backgroundColor = 'var(--color-success-hover)';
              }
            }}
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save</span>
            )}
          </button>
        )}

        {/* Next/Complete button */}
        <button
          onClick={onNext}
          disabled={isNextDisabled || isLoading || isSaving}
          aria-label={isLastStep ? 'Save and complete wizard' : 'Go to next step'}
          aria-disabled={isNextDisabled || isLoading || isSaving}
          className="rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center"
          style={{
            padding: `${10}px ${24}px`,
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-white)',
            backgroundColor: (isNextDisabled || isSaving) ? 'var(--color-disabled-bg)' : 'var(--color-accent)',
            border: 'none',
            opacity: (isNextDisabled || isSaving) ? 0.5 : (isLoading ? 0.7 : 1),
            minWidth: '110px',
            gap: '8px',
            transitionDuration: 'var(--transition-fast)',
            transitionTimingFunction: 'var(--ease-in-out)',
          }}
          onMouseEnter={(e) => {
            if (!isNextDisabled && !isLoading && !isSaving) {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isNextDisabled && !isSaving) {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)';
            }
          }}
          onMouseDown={(e) => {
            if (!isNextDisabled && !isLoading && !isSaving) {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-active)';
            }
          }}
          onMouseUp={(e) => {
            if (!isNextDisabled && !isLoading && !isSaving) {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
            }
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{nextLabel}</span>
          )}
        </button>
      </div>
    </div>
  );
});
