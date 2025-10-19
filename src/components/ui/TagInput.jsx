// File purpose: Reusable tag input component with badges
// Related: Used in meal forms, food forms, drink forms for tag management
// Should not include: Complex tag suggestions or autocomplete

import { useState } from 'react';
import { X } from 'lucide-react';

/**
 * TagInput component - add/remove tags with badge display
 * @param {Object} props
 * @param {string} props.label - Label text
 * @param {string[]} props.tags - Current tags array
 * @param {Function} props.onChange - Change handler (receives new tags array)
 * @param {string} [props.placeholder] - Input placeholder
 * @param {string} [props.className] - Additional classes
 */
export function TagInput({ 
  label, 
  tags, 
  onChange, 
  placeholder = 'Type and press Enter to add tags',
  className = ''
}) {
  const [input, setInput] = useState('');

  // Add tag on Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed]);
        setInput('');
      }
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
          {label}
        </label>
      )}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 border border-[var(--color-border)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        placeholder={placeholder}
      />
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] rounded text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
