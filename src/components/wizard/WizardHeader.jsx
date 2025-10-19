import { memo } from 'react';
import { Check } from 'lucide-react';

/**
 * WizardHeader - Wizard header with step indicator and progress visualization
 * 
 * Displays step progress with visual indicators for completed, current, and upcoming steps.
 * Allows clicking on completed steps to jump back. Shows current step title.
 * Uses CSS variables for all colors to support theming and dark mode.
 * 
 * @component
 * @param {Object} props
 * @param {number} props.currentStep - Current step index (0-based)
 * @param {number} props.totalSteps - Total number of steps
 * @param {StepInfo[]} props.steps - Array of step information
 * @param {Function} props.onStepClick - Handler for clicking on completed steps (index) => void
 * 
 * @typedef {Object} StepInfo
 * @property {string} id - Step identifier
 * @property {string} title - Step title
 * @property {boolean} completed - Whether step is completed
 * @property {boolean} [optional] - Whether step is optional (shown with dashed border)
 * 
 * Visual States:
 * - Completed: Green circle with checkmark, clickable with hover effect
 * - Current: Blue circle with number, larger with ring
 * - Upcoming: Gray border circle with number
 * - Optional: Dashed border when upcoming
 * 
 * Related: Wizard.jsx
 */
export const WizardHeader = memo(function WizardHeader({ currentStep, totalSteps, steps, onStepClick }) {
  return (
    <div
      className="px-5 py-3"
      style={{
        borderBottom: `var(--border-width-thin) solid var(--color-border-primary)`,
        backgroundColor: 'var(--color-bg-secondary)'
      }}
    >
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-3">
        {steps.map((step, index) => {
          const isCompleted = step.completed;
          const isCurrent = index === currentStep;
          const isClickable = isCompleted && index !== currentStep;
          const isUpcoming = !isCompleted && !isCurrent;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step circle */}
              <button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className="relative flex items-center justify-center rounded-full font-semibold text-sm"
                style={{
                  width: isCurrent ? '36px' : '32px',
                  height: isCurrent ? '36px' : '32px',
                  backgroundColor: isCurrent
                    ? 'var(--color-accent)'
                    : isCompleted
                      ? 'var(--color-success)'
                      : 'var(--color-bg-primary)',
                  color: isCurrent || isCompleted ? 'white' : 'var(--color-text-tertiary)',
                  border: isUpcoming
                    ? `var(--border-width-medium) ${step.optional ? 'dashed' : 'solid'} var(--color-border-secondary)`
                    : 'none',
                  boxShadow: isCurrent ? `0 0 0 4px var(--color-accent)20` : 'none',
                  cursor: isClickable ? 'pointer' : 'default',
                  transition: `all var(--transition-normal) var(--ease-in-out)`,
                  transform: isCurrent ? 'scale(1.1)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  if (isClickable) {
                    e.currentTarget.style.backgroundColor = 'var(--color-success-hover)';
                    e.currentTarget.style.boxShadow = `0 0 0 4px var(--color-success)20`;
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isClickable) {
                    e.currentTarget.style.backgroundColor = 'var(--color-success)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
                aria-label={`${step.title} - Step ${index + 1} of ${totalSteps}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted && !isCurrent ? (
                  <Check size={18} strokeWidth={2.5} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>

              {/* Connecting line */}
              {!isLast && (
                <div
                  className="flex-1 mx-2 rounded-full overflow-hidden"
                  style={{
                    height: '2px',
                    backgroundColor: 'var(--color-border-primary)'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: isCompleted ? '100%' : '0',
                      backgroundColor: 'var(--color-success)',
                      transition: `all var(--transition-slow) var(--ease-out)`
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current step title */}
      <div className="text-center">
        <h3
          id="wizard-step-title"
          className="font-semibold"
          style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text-primary)'
          }}
        >
          {steps[currentStep].title}
        </h3>
        {steps[currentStep].optional && (
          <p
            className="mt-0.5 font-medium"
            style={{
              fontSize: '10px',
              color: 'var(--color-text-secondary)'
            }}
          >
            Optional
          </p>
        )}
      </div>
    </div>
  );
});
