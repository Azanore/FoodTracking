// File purpose: Reusable button component with variants
// Related: Used across all forms and actions
// Should not include: Icon-only buttons or complex button groups

/**
 * Button component - styled button with variants
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} [props.onClick] - Click handler
 * @param {'primary' | 'secondary' | 'danger' | 'ghost'} [props.variant] - Button variant
 * @param {'button' | 'submit' | 'reset'} [props.type] - Button type
 * @param {boolean} [props.disabled] - Disabled state
 * @param {string} [props.className] - Additional classes
 */
export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  disabled = false,
  className = ''
}) {
  const baseClasses = 'px-[var(--spacing-button-padding-x)] py-[var(--spacing-button-padding-y)] rounded-[var(--radius-md)] text-[var(--font-size-sm)] font-[var(--font-weight-semibold)] transition-all duration-[var(--transition-fast)] ease-[var(--ease-in-out)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-disabled-bg)] disabled:text-[var(--color-disabled-text)] cursor-pointer';
  
  const variantClasses = {
    primary: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-active)]',
    secondary: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:bg-[var(--color-hover-bg)] active:bg-[var(--color-active-bg)]',
    danger: 'bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger-hover)] active:bg-[var(--color-danger-hover)]',
    ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)] hover:text-[var(--color-text-primary)] active:bg-[var(--color-active-bg)]'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
