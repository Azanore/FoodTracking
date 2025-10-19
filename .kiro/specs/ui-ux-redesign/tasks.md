# Implementation Plan

- [x] 1. Establish design token system in index.css





  - Create comprehensive CSS variables for all colors (background, text, border, accent, semantic, interactive states)
  - Create CSS variables for spacing scale and component-specific spacing
  - Create CSS variables for typography (font sizes, weights, line heights, letter spacing)
  - Create CSS variables for borders (widths, radius values)
  - Create CSS variables for transitions (durations, easing functions)
  - Remove any existing hardcoded color values from index.css
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 11.1, 11.4, 11.5, 11.6_

-

- [x] 2. Create reusable FormSection component



  - Create new FormSection.jsx component in src/components/ui/
  - Implement section title with uppercase styling and tracking
  - Add border separator below title
  - Implement consistent spacing using design tokens
  - Add optional description text support
  - Export from src/components/ui/index.js
  - _Requirements: 2.8, 4.8, 11.1_
-

- [x] 3. Create reusable Modal component




  - Create new Modal.jsx component in src/components/ui/
  - Implement modal backdrop with subtle styling (no heavy blur)
  - Create modal container with clean border (no shadow)
  - Add header section with close button
  - Add scrollable content area with generous padding
  - Add footer section for action buttons
  - Support for ASCII art header prop
  - Export from src/components/ui/index.js
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 11.1_


- [x] 4. Create WizardStepArt component




  - Create new WizardStepArt.jsx component in src/components/wizard/
  - Implement ASCII art display with proper formatting
  - Create ASCII art for "Select Food" step
  - Create ASCII art for "Quantity & Measurement" step
  - Create ASCII art for "Ingredients & Extras" step
  - Create ASCII art for "Tags & Notes" step
  - Export from src/components/wizard/index.js
  - _Requirements: 5.1, 8.1_
-

- [x] 5. Enhance Button component with design tokens




  - Update Button.jsx to use CSS variables for all colors
  - Implement clear hover state using --color-accent-hover
  - Implement clear active state using --color-accent-active
  - Add ghost variant for subtle actions
  - Ensure disabled state uses CSS variables
  - Ensure focus ring uses CSS variables
  - Remove any hardcoded color values
  - Test all variants (primary, secondary, danger, ghost)
  - _Requirements: 2.1, 2.2, 2.6, 2.7, 2.8, 2.9, 8.1, 8.2, 9.1, 9.2, 11.4_

- [x] 6. Enhance Input component with design tokens





  - Update Input.jsx to use CSS variables for all colors
  - Implement consistent border styling using design tokens
  - Implement clear focus state with --color-border-focus
  - Add error state with red border using semantic color variables
  - Ensure disabled state uses CSS variables
  - Update label styling to use typography variables
  - Remove any hardcoded color values
  - _Requirements: 2.3, 2.5, 2.8, 9.1, 9.4, 11.4_
-

- [x] 7. Enhance Select component with design tokens



  - Update Select.jsx to use CSS variables for all colors
  - Ensure styling matches Input component
  - Implement clear focus state
  - Update label styling to use typography variables
  - Remove any hardcoded color values
  - _Requirements: 2.4, 2.5, 2.8, 9.1, 9.4, 11.4_

- [x] 8. Enhance CheckableButtonGroup component with design tokens





  - Update CheckableButtonGroup.jsx to use CSS variables for all colors
  - Implement clear hover state for unselected buttons
  - Implement clear selected state using accent color variables
  - Ensure error state uses semantic color variables
  - Remove any hardcoded color values
  - _Requirements: 2.6, 2.8, 2.9, 9.1, 11.4_
-

- [x] 9. Enhance CheckableBadgeGroup component with design tokens




  - Update CheckableBadgeGroup.jsx to use CSS variables for all colors
  - Implement clear hover state for unselected badges
  - Implement clear selected state using accent color variables
  - Update modal styling to use design tokens
  - Remove any hardcoded color values
  - _Requirements: 2.6, 2.8, 2.9, 9.1, 11.4_
-

- [x] 10. Redesign MealForm with ASCII art and sections




  - Update MealForm.jsx to use Modal component
  - Add professional ASCII art header for meal configuration
  - Refactor form into clear sections using FormSection component
  - Section 1: Basic Information (Type, Time)
  - Section 2: Tags
  - Section 3: Notes
  - Update all styling to use CSS variables
  - Ensure consistent spacing using design tokens
  - Update button styling to use enhanced Button component
  - Remove any hardcoded color values
  - _Requirements: 4.1, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 9.1, 11.4_
-

- [x] 11. Redesign DrinkForm with ASCII art and sections




  - Update DrinkForm.jsx to use Modal component
  - Add professional ASCII art header for drink library
  - Refactor form into clear sections using FormSection component
  - Section 1: Basic Information (Name, Category)
  - Section 2: Measurement (Quantity, Unit)
  - Section 3: Tags
  - Update all styling to use CSS variables
  - Ensure consistent spacing using design tokens
  - Update button styling to use enhanced Button component
  - Remove any hardcoded color values
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 9.1, 11.4_
-

- [x] 12. Enhance WizardHeader with redesigned step indicators




  - Update WizardHeader.jsx to use CSS variables for all colors
  - Enhance step circle styling with clearer visual distinction
  - Implement clear completed state (green with checkmark)
  - Implement clear current state (blue, larger, with ring)
  - Implement clear upcoming state (gray border)
  - Update progress line styling
  - Ensure hover states for clickable completed steps
  - Remove any hardcoded color values
  - _Requirements: 5.2, 5.3, 5.4, 9.1, 11.4_
-

- [x] 13. Enhance WizardFooter with save button




  - Update WizardFooter.jsx to use CSS variables for all colors
  - Add save button for partial updates (edit mode)
  - Implement clear button hierarchy
  - Update button hover and active states
  - Ensure consistent spacing using design tokens
  - Remove any hardcoded color values
  - _Requirements: 5.5, 8.1, 8.2, 9.1, 11.4_

- [x] 14. Implement wizard save-at-any-step functionality





  - Update Wizard.jsx to support partial save mode
  - Add logic to detect edit mode vs create mode
  - Implement save button visibility logic (show in edit mode at any step)
  - Implement partial save handler that saves only modified fields
  - Update wizard context to include save functionality
  - Pass save handler to WizardFooter
  - Ensure wizard closes after partial save
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

-

- [x] 15. Add ASCII art to all wizard steps



  - Update FoodSelectionStep to include WizardStepArt with "Select Food" art
  - Update QuantityMeasurementStep to include WizardStepArt with "Quantity" art
  - Update CompositionStep to include WizardStepArt with "Composition" art
  - Update TagsNotesStep to include WizardStepArt with "Details" art
  - Ensure consistent placement and spacing
  - _Requirements: 5.1, 8.1_

- [x] 16. Update Wizard.jsx styling with design tokens




  - Update Wizard.jsx to use CSS variables for all colors
  - Update backdrop styling to be more subtle
  - Update modal container to use clean border instead of shadow
  - Update close button styling
  - Remove any hardcoded color values
  - _Requirements: 5.6, 5.7, 9.1, 11.4_
-

- [x] 17. Update TodayView for consistency




  - Update TodayView.jsx to use CSS variables where applicable
  - Ensure consistent spacing using design tokens
  - Verify button components use enhanced Button
  - Ensure typography follows design system
  - Remove any hardcoded color values
  - _Requirements: 7.1, 7.3, 7.4, 7.5, 7.6, 9.1, 11.4_
-

- [x] 18. Update FoodsView for consistency




  - Update FoodsView.jsx to use CSS variables where applicable
  - Enhance tab styling with clear hover and active states
  - Update search bar styling
  - Ensure consistent spacing using design tokens
  - Verify button components use enhanced Button
  - Remove any hardcoded color values
  - _Requirements: 7.2, 7.3, 7.4, 7.5, 7.6, 9.1, 11.4_
-

- [x] 19. Update Sidebar for consistency




  - Update Sidebar.jsx to use CSS variables for all colors
  - Enhance active state styling
  - Implement clear hover state
  - Ensure consistent icon sizing
  - Improve focus states
  - Remove any hardcoded color values
  - _Requirements: 7.3, 7.4, 7.5, 7.6, 8.1, 8.3, 8.4, 9.1, 9.6, 11.4_

-

- [x] 20. Update MealCard for consistency



  - Update MealCard.jsx to use CSS variables for all colors
  - Ensure hover states use design tokens
  - Update button styling to use enhanced Button
  - Ensure consistent spacing
  - Remove any hardcoded color values
  - _Requirements: 7.3, 7.4, 7.5, 7.6, 8.1, 8.5, 9.1, 11.4_
-

- [x] 21. Update FoodCard and DrinkCard for consistency




  - Update FoodCard.jsx to use CSS variables for all colors
  - Update DrinkCard.jsx to use CSS variables for all colors
  - Ensure hover states use design tokens
  - Update button styling
  - Ensure consistent spacing
  - Remove any hardcoded color values
  - _Requirements: 7.3, 7.4, 7.5, 7.6, 8.1, 8.5, 9.1, 11.4_


- [x] 22. Update remaining components for consistency



  - Update DateNavigation.jsx to use CSS variables
  - Update DayMeta.jsx to use CSS variables
  - Update SearchBar.jsx to use CSS variables
  - Update AddMealButton.jsx to use CSS variables
  - Update QuickAddBar.jsx to use CSS variables
  - Update FoodItem.jsx and DrinkItem.jsx to use CSS variables
  - Update InlineAddFood.jsx to use CSS variables
  - Remove any hardcoded color values from all components
  - _Requirements: 7.3, 7.4, 7.5, 7.6, 9.1, 11.4_

- [x] 23. Final consistency and polish pass





  - Review all components for hardcoded colors
  - Verify all interactive elements have hover states
  - Verify all buttons have active states
  - Check typography consistency across all pages
  - Check spacing consistency across all pages
  - Verify color contrast meets accessibility standards
  - Ensure no shadows are used (or minimal if necessary)
  - Test keyboard navigation throughout application
  - Verify focus states are clear and consistent
  - Test all forms and wizards end-to-end
  - _Requirements: 1.8, 2.6, 2.7, 2.9, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 9.1, 11.2, 11.3_
