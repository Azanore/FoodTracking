// File purpose: Reusable input component for text, number, time inputs
// Related: Used across all forms for data entry
// Should not include: Complex validation or masked inputs

/**
 * Input component - styled input for text, number, time
 * @param {Object} props
 * @param {string} props.label - Label text
 * @param {'text' | 'number' | 'time' | 'textarea'} [props.type] - Input type
 * @param {string | number} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} [props.placeholder] - Placeholder text
 * @param {boolean} [props.required] - Required field
 * @param {boolean} [props.error] - Error state
 * @param {boolean} [props.disabled] - Disabled state
 * @param {number} [props.min] - Min value (for number)
 * @param {number} [props.max] - Max value (for number)
 * @param {number} [props.step] - Step value (for number)
 * @param {number} [props.rows] - Rows (for textarea)
 * @param {string} [props.className] - Additional classes
 */
export function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '',
  required = false,
  error = false,
  disabled = false,
  min,
  max,
  step,
  rows = 3,
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
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={baseClasses}
        />
      )}
    </div>
  );
}
