// File purpose: Reusable modal component for forms and dialogs
// Related: Used by MealForm, DrinkForm, and wizard components
// Should not include: Specific form logic or content

import { useEffect } from 'react';

/**
 * Modal component - reusable modal with backdrop, header, content, and footer
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Close handler
 * @param {string} [props.title] - Optional modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} [props.footer] - Optional footer with action buttons
 * @param {string} [props.className] - Additional classes for modal container
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = ''
}) {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onClick={onClose}
    >
      <div
        className={`bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with title and close button */}
        {title && (
          <div className="flex-shrink-0 border-b border-[var(--color-border-primary)] px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Close button only (no title) */}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer with action buttons */}
        {footer && (
          <div className="flex-shrink-0 border-t border-[var(--color-border-primary)] p-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
