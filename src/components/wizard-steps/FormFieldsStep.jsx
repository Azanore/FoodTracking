// File purpose: Generic form fields step for wizards
// Related: Used in wizards for rendering various input types with validation
// Should not include: Complex custom components or business logic

import { memo, useCallback } from 'react';

/**
 * FormFieldsStep - generic form fields with validation display
 * @param {Object} props
 * @param {Array<FieldConfig>} props.fields - Array of field configurations
 * @param {Function} props.onChange - Change handler (name, value)
 * 
 * FieldConfig:
 * @typedef {Object} FieldConfig
 * @property {string} name - Field name
 * @property {string} label - Field label
 * @property {string} type - Input type (text, number, select, textarea)
 * @property {boolean} [required] - Whether field is required
 * @property {any} value - Current field value
 * @property {string} [error] - Validation error message
 * @property {string} [placeholder] - Input placeholder
 * @property {number} [min] - Min value for number inputs
 * @property {number} [max] - Max value for number inputs
 * @property {number} [step] - Step value for number inputs
 * @property {Array<{value: string, label: string}>} [options] - Options for select
 * @property {number} [rows] - Rows for textarea
 */
export const FormFieldsStep = memo(function FormFieldsStep({ fields, onChange }) {
  const renderField = useCallback((field) => {
    const {
      name,
      label,
      type,
      required,
      value,
      error,
      placeholder,
      min,
      max,
      step,
      options,
      rows = 4,
    } = field;

    const hasError = !!error;
    const inputClasses = `
      w-full px-3.5 py-2.5 border-2 rounded-lg text-sm focus:outline-none transition-all
      ${hasError 
        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50' 
        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
      }
    `;

    return (
      <div key={name} className="space-y-2">
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {type === 'select' ? (
          <select
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            aria-invalid={hasError}
            className={inputClasses}
          >
            <option value="">Select {label.toLowerCase()}...</option>
            {options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            rows={rows}
            aria-invalid={hasError}
            className={`${inputClasses} resize-none`}
          />
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            aria-invalid={hasError}
            className={inputClasses}
          />
        )}

        {hasError && (
          <p className="text-xs text-red-600 mt-1.5 font-medium flex items-start gap-1">
            <span className="inline-block mt-0.5">⚠</span>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }, [onChange]);

  return (
    <div className="space-y-6">
      {fields.map(renderField)}
    </div>
  );
});
