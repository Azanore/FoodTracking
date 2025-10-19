# Design Document

## Overview

This design document outlines a comprehensive UI/UX redesign of the food tracking application, focusing on creating a cohesive, minimalistic, and modern design system. The redesign establishes reusable components, consistent styling patterns, and prepares the foundation for dark mode support. The design emphasizes clean aesthetics with sufficient contrast, generous spacing, clear typography, and subtle interactive states while avoiding heavy shadows and unnecessary visual complexity.

## Architecture

### Design System Structure

Project structure:
- src/index.css: Global styles, CSS variables, design tokens
- src/components/ui/: Reusable UI components (Button, Input, Select, CheckableButtonGroup, CheckableBadgeGroup, Modal, FormSection)
- src/components/wizard/: Wizard components (Wizard, WizardHeader, WizardFooter, WizardStepArt)
- src/components/forms/: Form components (MealForm, DrinkForm)

### Design Token System

All design tokens will be centralized in CSS variables, organized by category:

1. **Colors**: Background, text, borders, accents, states (normal/hover/active)
2. **Spacing**: Consistent spacing scale for margins, padding, gaps
3. **Typography**: Font sizes, weights, line heights, letter spacing
4. **Borders**: Border widths, radius values
5. **Transitions**: Animation durations and easing functions

## Components and Interfaces

### 1. Design Token System (index.css)

#### Color Palette

```css
:root {
  /* Background Colors */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-bg-tertiary: #f3f4f6;
  
  /* Text Colors */
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #9ca3af;
  
  /* Border Colors */
  --color-border-primary: #e5e7eb;
  --color-border-secondary: #d1d5db;
  --color-border-focus: #3b82f6;
  
  /* Accent Colors */
  --color-accent: #3b82f6;
  --color-accent-hover: #2563eb;
  --color-accent-active: #1d4ed8;
  
  /* Semantic Colors */
  --color-success: #10b981;
  --color-success-hover: #059669;
  --color-danger: #ef4444;
  --color-danger-hover: #dc2626;
  --color-warning: #f59e0b;
  --color-warning-hover: #d97706;
  
  /* Interactive States */
  --color-hover-bg: #f3f4f6;
  --color-active-bg: #e5e7eb;
  --color-disabled-bg: #f9fafb;
  --color-disabled-text: #d1d5db;
}
```

#### Spacing Scale

```css
:root {
  /* Spacing Scale */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 20px;
  --spacing-2xl: 24px;
  --spacing-3xl: 32px;
  --spacing-4xl: 40px;
  
  /* Component-specific spacing */
  --spacing-card-padding: var(--spacing-lg);
  --spacing-section-gap: var(--spacing-2xl);
  --spacing-form-field-gap: var(--spacing-lg);
  --spacing-button-padding-x: var(--spacing-lg);
  --spacing-button-padding-y: var(--spacing-md);
}
```

#### Typography

```css
:root {
  /* Font Families */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  
  /* Font Sizes */
  --font-size-xs: 11px;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-md: 15px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
  --font-size-2xl: 20px;
  --font-size-3xl: 24px;
  
  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* Letter Spacing */
  --letter-spacing-tight: -0.01em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
}
```

#### Borders and Radius

```css
:root {
  /* Border Widths */
  --border-width-thin: 1px;
  --border-width-medium: 2px;
  --border-width-thick: 3px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;
}
```

#### Transitions

```css
:root {
  /* Transition Durations */
  --transition-fast: 150ms;
  --transition-normal: 200ms;
  --transition-slow: 300ms;
  
  /* Transition Easings */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
}
```

### 2. Button Component

Enhanced button component with clear states and variants.

#### Variants
- **Primary**: Main actions (accent color background)
- **Secondary**: Alternative actions (white background with border)
- **Danger**: Destructive actions (red background)
- **Ghost**: Subtle actions (transparent background)

#### States
- **Normal**: Default appearance
- **Hover**: Subtle color darkening, no shadow
- **Active**: Further color darkening
- **Disabled**: Reduced opacity, no interaction
- **Focus**: Clear focus ring for accessibility

#### Implementation Pattern

```jsx
// Simplified structure
<button className="btn btn-primary">
  {children}
</button>

// CSS using design tokens
.btn {
  padding: var(--spacing-button-padding-y) var(--spacing-button-padding-x);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-fast) var(--ease-in-out);
}

.btn-primary {
  background-color: var(--color-accent);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-accent-hover);
}

.btn-primary:active {
  background-color: var(--color-accent-active);
}
```

### 3. Form Components

#### Input Component

Enhanced with consistent styling and clear focus states.

**Features:**
- Consistent border styling using design tokens
- Clear focus ring (no shadow)
- Error state with red border
- Disabled state with reduced opacity
- Label with consistent typography

#### Select Component

Enhanced dropdown with consistent styling.

**Features:**
- Matches input styling
- Custom arrow indicator
- Clear focus states
- Consistent with other form elements

#### CheckableButtonGroup Component

Enhanced single-select button group.

**Features:**
- Grid layout with configurable columns
- Selected state with accent color
- Hover state with subtle background change
- Clear visual distinction between states

#### CheckableBadgeGroup Component

Enhanced multi-select badge group.

**Features:**
- Badge-style buttons with rounded corners
- Modal for full list with search
- Selected badges with accent color
- Hover states for unselected badges

### 4. Modal Component (New)

Reusable modal component for forms and dialogs.

#### Structure

Modal layout:
- Header with title and close button
- Scrollable content area with generous padding
- Footer with action buttons (Cancel, Primary Action)

**Features:**
- Subtle backdrop (no heavy blur)
- Clean border instead of shadow
- ASCII art header for visual identity
- Clear close button
- Footer with action buttons
- Scrollable content area

### 5. FormSection Component (New)

Reusable component for form sections with consistent styling.

#### Structure

```jsx
<FormSection title="Basic Information">
  {/* Form fields */}
</FormSection>
```

**Features:**
- Uppercase title with tracking
- Border separator
- Consistent spacing
- Optional description text

### 6. Wizard Components

#### Wizard Container

Enhanced with save-at-any-step functionality.

**New Features:**
- Save button available at any step (for edit mode)
- Partial save functionality
- Enhanced backdrop styling
- Clean modal appearance

#### WizardHeader

Redesigned step indicators with clearer visual hierarchy.

**Features:**
- Larger step circles
- Clear completed/current/upcoming states
- Clickable completed steps
- Progress line between steps
- Current step title display

**Visual Design:**
Step indicators show progress with circles and lines:
- Upcoming: Empty circle (gray border)
- Current: Filled circle (blue, larger)
- Completed: Filled circle (green, checkmark)
- Progress line connects steps (gray/green)

#### WizardFooter

Enhanced with save button for partial updates.

**Features:**
- Cancel button (left)
- Back button (when not first step)
- Save button (for edit mode, any step)
- Next/Complete button (right)
- Clear button hierarchy

#### WizardStepArt Component (New)

Displays professional ASCII art for each wizard step.

**Purpose:**
- Visual identity for each step
- Professional appearance
- Helps users understand step purpose
- Adds personality to the interface

### 7. Form Redesigns

#### MealForm

Redesigned with clear sections.

**Sections:**
1. Basic Information (Type, Time)
2. Tags
3. Notes

**Features:**
- Clear section headers
- Consistent spacing
- Enhanced button styling
- Better visual hierarchy

#### DrinkForm

Redesigned with clear sections.

**Sections:**
1. Basic Information (Name, Category)
2. Measurement (Quantity, Unit)
3. Tags

**Features:**
- Clear section dividers
- Consistent form field styling
- Enhanced button hierarchy
- Better spacing

### 8. Wizard Step Headers

Each wizard step has a clear header with icon and description:
- Food Selection Step: Search library or create new
- Quantity & Measurement Step: Set amount and measurement
- Ingredients & Extras Step: Add ingredients and extras
- Tags & Notes Step: Add tags and notes

### 9. Page Enhancements

#### TodayView

**Enhancements:**
- Consistent card styling
- Enhanced button states
- Better spacing between sections
- Consistent typography

#### FoodsView

**Enhancements:**
- Enhanced tab styling
- Better search bar appearance
- Consistent card grid
- Enhanced add button

#### Sidebar

**Enhancements:**
- Clearer active state
- Better hover feedback
- Consistent icon sizing
- Improved focus states

## Data Models

### Design Token Structure

```typescript
interface DesignTokens {
  colors: {
    background: ColorScale;
    text: ColorScale;
    border: ColorScale;
    accent: ColorScale;
    semantic: SemanticColors;
    interactive: InteractiveStates;
  };
  spacing: SpacingScale;
  typography: Typography;
  borders: Borders;
  transitions: Transitions;
}

interface ColorScale {
  primary: string;
  secondary: string;
  tertiary?: string;
}

interface SemanticColors {
  success: string;
  successHover: string;
  danger: string;
  dangerHover: string;
  warning: string;
  warningHover: string;
}

interface InteractiveStates {
  hover: string;
  active: string;
  disabled: string;
  disabledText: string;
}
```

### Wizard Save State

```typescript
interface WizardSaveState {
  mode: 'create' | 'edit';
  canSavePartial: boolean;
  currentStep: number;
  modifiedFields: Set<string>;
}
```

## Error Handling

### Form Validation

- Display errors inline below fields
- Use red border for invalid fields
- Show error summary at top of form
- Clear error messages
- Accessible error announcements

### Wizard Validation

- Step-level validation before proceeding
- Error summary at top of step content
- Focus first error field
- Clear error messages
- Prevent navigation with errors

### User Feedback

- Success messages for saves
- Confirmation dialogs for destructive actions
- Loading states for async operations
- Disabled states during processing

## Testing Strategy

### Visual Regression Testing

1. **Component States**: Test all button variants and states
2. **Form Layouts**: Test all forms with various content lengths
3. **Wizard Flows**: Test all wizard steps and transitions
4. **Responsive Behavior**: Test at different viewport sizes
5. **Interactive States**: Test hover, active, focus states

### Accessibility Testing

1. **Keyboard Navigation**: All interactive elements accessible via keyboard
2. **Screen Reader**: Proper ARIA labels and announcements
3. **Focus Management**: Clear focus indicators
4. **Color Contrast**: WCAG AA compliance for all text
5. **Form Labels**: All inputs properly labeled

### Integration Testing

1. **Wizard Save**: Test partial save at each step
2. **Form Submission**: Test all forms with valid/invalid data
3. **Modal Interactions**: Test open/close/escape behaviors
4. **State Management**: Test form state persistence

### Manual Testing Checklist

- [ ] All colors use CSS variables
- [ ] All spacing uses design tokens
- [ ] All interactive elements have hover states
- [ ] All buttons have active states
- [ ] All forms have clear sections
- [ ] All wizards have ASCII art
- [ ] All modals have ASCII art
- [ ] Wizard save works at any step
- [ ] No hardcoded colors in components
- [ ] Consistent typography throughout
- [ ] Sufficient contrast everywhere
- [ ] No heavy shadows used
- [ ] Clean, minimalistic appearance

## Design Decisions and Rationales

### 1. CSS Variables Over Tailwind Config

**Decision**: Use CSS variables in index.css instead of extending Tailwind config.

**Rationale**:
- Easier to toggle for dark mode (just swap variable values)
- More explicit and searchable in codebase
- Works with any CSS approach
- Better for runtime theming
- Simpler mental model

### 2. No Shadows

**Decision**: Avoid box-shadows, use borders for separation.

**Rationale**:
- Cleaner, more modern appearance
- Better performance
- Easier to maintain consistency
- Aligns with minimalistic design goal
- Reduces visual noise

### 3. Subtle Interactive States

**Decision**: Use subtle color changes for hover/active states.

**Rationale**:
- Professional appearance
- Not distracting
- Clear enough to indicate interactivity
- Consistent with modern design trends
- Accessible with sufficient contrast

### 4. ASCII Art in Forms/Wizards

**Decision**: Add ASCII art headers to forms and wizard steps.

**Rationale**:
- Adds visual interest without complexity
- Helps users understand context
- Professional yet friendly
- Unique identity for each form/step
- Lightweight (no images needed)

### 5. Wizard Save at Any Step

**Decision**: Allow saving wizard changes at any step in edit mode.

**Rationale**:
- Better user experience for quick edits
- Reduces friction
- Respects user's time
- Maintains data integrity (only saves changed fields)
- Common pattern in modern applications

### 6. FormSection Component

**Decision**: Create reusable FormSection component for consistent sections.

**Rationale**:
- Enforces consistency
- Reduces code duplication
- Easy to maintain
- Clear visual hierarchy
- Reusable across all forms

### 7. Generous Spacing

**Decision**: Use generous spacing throughout the interface.

**Rationale**:
- Improves readability
- Reduces visual clutter
- Modern aesthetic
- Better touch targets
- Easier to scan

### 8. Typography Hierarchy

**Decision**: Establish clear typography hierarchy with design tokens.

**Rationale**:
- Improves readability
- Guides user attention
- Professional appearance
- Consistent across application
- Easy to maintain

## Implementation Notes

### Phase 1: Foundation
1. Update index.css with all design tokens
2. Create utility classes for common patterns
3. Update global styles

### Phase 2: Core Components
1. Enhance Button component
2. Enhance Input, Select components
3. Enhance CheckableButtonGroup, CheckableBadgeGroup
4. Create Modal component
5. Create FormSection component

### Phase 3: Wizard System
1. Create WizardStepArt component
2. Enhance WizardHeader
3. Enhance WizardFooter with save button
4. Implement save-at-any-step logic
5. Add ASCII art to all wizard steps

### Phase 4: Forms
1. Redesign MealForm with ASCII art and sections
2. Redesign DrinkForm with ASCII art and sections
3. Update all form styling to use design tokens

### Phase 5: Pages
1. Update TodayView styling
2. Update FoodsView styling
3. Update Sidebar styling
4. Ensure consistency across all pages

### Phase 6: Polish
1. Review all interactive states
2. Test keyboard navigation
3. Verify color contrast
4. Remove any remaining hardcoded values
5. Final visual consistency pass
