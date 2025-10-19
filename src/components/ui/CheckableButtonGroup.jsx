// File purpose: Reusable single-select button group for enums (radio-style)
// Related: Used in FoodForm, DrinkForm, MealForm for enum selections
// Should not include: Multi-select logic or complex state management

/**
 * CheckableButtonGroup - single-select button group with grid layout
 * @param {Object} props
 * @param {Array<{value: string, label: string}>} props.options - Options array
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Change handler (receives value)
 * @param {number} [props.columns=5] - Number of grid columns
 * @param {string} [props.label] - Optional label text
 * @param {string} [props.className] - Additional classes
 * @param {string} [props.error] - Error message to display
 */
export function CheckableButtonGroup({ 
  options, 
  value, 
  onChange, 
  columns = 5,
  label,
  className = '',
  error
}) {
  const groupId = `button-group-${label?.replace(/\s+/g, '-').toLowerCase() || 'group'}`;
  const errorId = `${groupId}-error`;
  
  return (
    <div className={className}>
      {label && (
        <label
          id={`${groupId}-label`}
          className="block text-xs font-semibold text-[var(--color-text-primary)] mb-2 uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <div
        role="radiogroup"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {options.map(option => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option.value)}
              className={`
                px-2 py-1.5 rounded text-xs font-medium transition-colors truncate cursor-pointer
                ${isSelected 
                  ? 'bg-[var(--color-accent)] text-white border-2 border-[var(--color-accent)]' 
                  : error
                    ? 'bg-white text-[var(--color-text-primary)] border-2 border-[var(--color-danger)] hover:border-[var(--color-danger-hover)]'
                    : 'bg-white text-[var(--color-text-primary)] border-2 border-[var(--color-border-primary)] hover:border-[var(--color-accent)] hover:bg-[var(--color-hover-bg)]'
                }
              `}
              title={option.label}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {error && (
        <p id={errorId} className="text-xs text-[var(--color-danger)] mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
