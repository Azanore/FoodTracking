// File purpose: Reusable form section component with title and separator
// Related: Used in forms to create clear visual sections
// Should not include: Form field logic or validation

/**
 * FormSection component - creates a form section with title and optional description
 * @param {Object} props
 * @param {string} props.title - Section title (displayed in uppercase)
 * @param {string} [props.description] - Optional description text below title
 * @param {React.ReactNode} props.children - Section content
 * @param {string} [props.className] - Additional classes for the container
 */
export function FormSection({ title, description, children, className = '' }) {
  return (
    <div className={`mb-[var(--spacing-section-gap)] ${className}`}>
      <div className="mb-[var(--spacing-lg)]">
        <h3 
          className="text-[var(--font-size-sm)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)] uppercase tracking-[var(--letter-spacing-wider)] mb-[var(--spacing-sm)]"
        >
          {title}
        </h3>
        <div className="border-b border-[var(--color-border-primary)]" />
        {description && (
          <p className="text-[var(--font-size-sm)] text-[var(--color-text-secondary)] mt-[var(--spacing-sm)]">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-[var(--spacing-form-field-gap)]">
        {children}
      </div>
    </div>
  );
}
