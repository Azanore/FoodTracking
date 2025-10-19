// File purpose: Reusable select dropdown component for enums
// Related: Used across forms for meal types, units, portions, cooking methods
// Should not include: Complex multi-select or autocomplete logic

/**
 * Select component - styled dropdown for enums and options
 * @param {Object} props
 * @param {string} props.label - Label text
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Change handler
 * @param {Array<{value: string, label: string}>} props.options - Options array
 * @param {string} [props.placeholder] - Placeholder text
 * @param {boolean} [props.required] - Required field
 * @param {boolean} [props.error] - Error state
 * @param {boolean} [props.disabled] - Disabled state
 * @param {string} [props.className] - Additional classes
 */
export function Select({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = 'Select...', 
  required = false,
  error = false,
  disabled = false,
  className = ''
}) {
  const baseClasses = `
    w-full 
    px-3 py-2 
    border 
    rounded
    text-sm
    transition-colors
    focus:outline-none 
    focus:ring-2
    ${error 
      ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]' 
      : 'border-[var(--color-border-primary)] focus:border-[var(--color-border-focus)] focus:ring-[var(--color-border-focus)]'
    }
    ${disabled 
      ? 'bg-[var(--color-disabled-bg)] text-[var(--color-disabled-text)] cursor-not-allowed' 
      : 'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]'
    }
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <div className={className}>
      {label && (
        <label className="block mb-1" style={{
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: disabled ? 'var(--color-disabled-text)' : 'var(--color-text-primary)'
        }}>
          {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={baseClasses}
        required={required}
        disabled={disabled}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
