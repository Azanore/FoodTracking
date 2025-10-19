# Implementation Plan

- [x] 1. Set up wizard framework structure




  - Create directory structure for wizard components
  - Set up index files for clean exports
  - _Requirements: 1.1, 1.2_


- [x] 2. Implement core wizard state management





  - [x] 2.1 Create WizardContext with state and methods

    - Implement context with currentStep, formData, errors, isDirty state
    - Add updateData, goNext, goBack, cancel methods
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10_
  

  - [x] 2.2 Create useWizard custom hook

    - Implement step navigation logic
    - Add validation orchestration
    - Handle dirty state tracking
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

- [x] 3. Build core wizard UI components




  - [x] 3.1 Create Wizard.jsx container component


    - Implement main wizard orchestration
    - Add modal overlay and container
    - Integrate WizardContext provider
    - Handle keyboard events (Escape to cancel)
    - _Requirements: 1.1, 1.2, 1.9, 1.10, 8.7_
  
  - [x] 3.2 Create WizardHeader.jsx component


    - Build step indicator with progress visualization
    - Add step titles and completion states
    - Implement click-to-jump for completed steps
    - _Requirements: 5.1, 5.2, 5.5_
  
  - [x] 3.3 Create WizardFooter.jsx component


    - Add Back, Next/Save, Cancel buttons
    - Implement smart button labeling (Next vs Save)
    - Handle loading and disabled states
    - _Requirements: 1.5, 1.6, 1.7_
  
  - [x] 3.4 Add wizard transitions and animations


    - Implement slide transitions between steps
    - Add fade-in for validation errors
    - Smooth height adjustments
    - _Requirements: 5.3_
-

- [x] 4. Create reusable step components



  - [x] 4.1 Build SearchSelectStep.jsx


    - Implement search input with debouncing
    - Add filtered list rendering
    - Support custom item renderer
    - Add "Create new" option
    - _Requirements: 10.2_
  
  - [x] 4.2 Build FormFieldsStep.jsx


    - Support text, number, select input types
    - Add validation error display
    - Implement field-level error highlighting
    - _Requirements: 10.4_
  
  - [x] 4.3 Build MultiSelectStep.jsx


    - Implement badge-based multi-select UI
    - Add "Create new" functionality
    - Support grouping by category
    - Show top N items first, rest in "Show more"
    - _Requirements: 10.3_

- [x] 5. Implement food-specific step components



  - [x] 5.1 Create FoodSelectionStep.jsx


    - Integrate SearchSelectStep with food library
    - Add food search and filtering
    - Implement "Create new food" flow
    - Auto-populate defaults when food selected
    - _Requirements: 2.2, 2.3, 2.10_
  
  - [x] 5.2 Create QuantityMeasurementStep.jsx


    - Add quantity number input
    - Integrate CheckableButtonGroup for unit selection
    - Add portion selector (optional)
    - Add cooking method selector (optional)
    - _Requirements: 2.4_
  
  - [x] 5.3 Create CompositionStep.jsx


    - Integrate MultiSelectStep for ingredients
    - Add extras multi-select
    - Support creating new ingredients inline
    - _Requirements: 2.5_
  
  - [x] 5.4 Create TagsNotesStep.jsx


    - Integrate MultiSelectStep for tags
    - Add notes textarea
    - Support creating new tags inline
    - _Requirements: 2.6_

- [x] 6. Build AddFoodToMealWizard



  - [x] 6.1 Create AddFoodToMealWizard.jsx component


    - Configure 4-step wizard flow
    - Define step validation functions
    - Implement data transformation (wizard data → FoodEntry)
    - Add onComplete and onCancel handlers
    - _Requirements: 2.1, 2.7, 2.8, 2.9_
  
  - [x] 6.2 Integrate wizard into MealCard


    - Add "Add Food (Wizard)" button to expanded meal card
    - Handle wizard completion (add food to meal)
    - Update meal state after food added
    - _Requirements: 2.1_

- [x] 7. Build EditFoodInMealWizard




  - [x] 7.1 Create EditFoodInMealWizard.jsx component


    - Configure 4-step wizard with pre-populated data
    - Start on Step 2 by default (skip food selection)
    - Allow going back to Step 1 to change food
    - Implement data transformation for updates
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  
  - [x] 7.2 Integrate wizard into FoodItem


    - Add "Edit (Wizard)" option to food item actions
    - Handle wizard completion (update food entry)
    - Update meal state after food edited
    - _Requirements: 3.1_
-

- [x] 8. Build FoodLibraryWizard



  - [x] 8.1 Create FoodLibraryWizard.jsx component


    - Configure 4-step wizard for library food creation/editing
    - Define validation for required fields (name, quantity, unit)
    - Implement data transformation (wizard data → UserFood)
    - Handle both create and edit modes
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_
  
  - [x] 8.2 Integrate wizard into FoodsView


    - Add "Add Food (Wizard)" button option
    - Handle wizard completion (save to library)
    - Refresh food list after save
    - _Requirements: 4.1_
-

- [x] 9. Implement validation and error handling




  - [x] 9.1 Add per-step validation


    - Validate Step 1: Food selection or name required
    - Validate Step 2: Quantity > 0 and unit required
    - Mark Steps 3 & 4 as optional
    - _Requirements: 1.4, 1.8_
  
  - [x] 9.2 Add field-level error display


    - Show errors next to invalid fields
    - Highlight invalid fields with red border
    - Clear errors when field is corrected
    - _Requirements: 1.8, 5.4_
  
  - [x] 9.3 Add step-level error summary


    - Show error summary at top of step if multiple errors
    - List all validation errors
    - _Requirements: 1.8_
  
  - [x] 9.4 Implement cancel confirmation


    - Detect if form data has changed (isDirty)
    - Show confirmation dialog if dirty
    - Allow cancel without confirmation if pristine
    - _Requirements: 1.9, 2.9, 3.6, 4.9_
-

- [x] 10. Add accessibility features



  - [x] 10.1 Implement keyboard navigation


    - Tab through focusable elements
    - Enter to proceed to next step
    - Escape to cancel wizard
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [x] 10.2 Add screen reader support


    - Add ARIA labels to all interactive elements
    - Announce step changes
    - Announce validation errors
    - Use aria-invalid for error fields
    - _Requirements: 8.4_
  
  - [x] 10.3 Implement focus management


    - Focus first input when step loads
    - Focus first error when validation fails
    - Return focus to trigger when wizard closes
    - _Requirements: 8.1, 8.6, 8.7_

- [x] 11. Optimize performance




  - [x] 11.1 Add search debouncing


    - Debounce search input (300ms)
    - Cancel pending searches on unmount
    - _Requirements: 9.3_
  
  - [x] 11.2 Optimize component re-renders


    - Memoize step components with React.memo
    - Memoize validation functions
    - Use useCallback for event handlers
    - _Requirements: 9.5_
  
  - [x] 11.3 Lazy load step components


    - Only render current step component
    - Preload next step component
    - _Requirements: 9.1, 9.2_


- [x] 12. Style wizard components




  - [x] 12.1 Style Wizard modal and overlay


    - Add modal backdrop with blur
    - Style modal container with rounded corners
    - Make content area scrollable
    - Fix header and footer position
    - _Requirements: 5.6, 5.8_
  
  - [x] 12.2 Style WizardHeader step indicator


    - Style completed, current, upcoming step states
    - Add connecting lines between steps
    - Add hover effects for clickable steps
    - _Requirements: 5.1, 5.2, 5.5_
  
  - [x] 12.3 Style WizardFooter buttons


    - Style Back, Next, Cancel buttons consistently
    - Add disabled and loading states
    - Ensure proper spacing and alignment
    - _Requirements: 5.3_
  
  - [x] 12.4 Style step components


    - Apply consistent spacing and typography
    - Style form inputs to match existing design
    - Style validation errors
    - _Requirements: 5.4, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 13. Add backward compatibility layer




  - [x] 13.1 Keep existing form components


    - Preserve FoodEntryForm.jsx
    - Preserve FoodForm.jsx
    - Ensure both work independently
    - _Requirements: 6.1, 6.4_
  
  - [x] 13.2 Add wizard toggle in UI


    - Add "Add Food (Wizard)" alongside existing "Add Food"
    - Add "Edit (Wizard)" alongside existing "Edit"
    - Allow users to choose which to use
    - _Requirements: 6.2_

- [x] 14. Testing and validation




  - [ ]* 14.1 Write unit tests for wizard state management
    - Test useWizard hook navigation logic
    - Test validation orchestration
    - Test dirty state tracking
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_
  
  - [ ]* 14.2 Write integration tests for wizard flows
    - Test complete AddFoodToMealWizard flow
    - Test EditFoodInMealWizard with pre-populated data
    - Test FoodLibraryWizard create and edit modes
    - Test cancel with unsaved changes
    - _Requirements: 2.1-2.10, 3.1-3.7, 4.1-4.9_
  
  - [ ]* 14.3 Test accessibility
    - Test keyboard navigation
    - Test screen reader announcements
    - Test focus management
    - _Requirements: 8.1-8.7_
  
  - [ ]* 14.4 Test performance
    - Measure wizard open time (<100ms)
    - Measure step transition time (<50ms)
    - Test with large ingredient/tag lists
    - _Requirements: 9.1-9.5_

- [x] 15. Documentation and cleanup




  - [x] 15.1 Add JSDoc comments to all wizard components


    - Document Wizard component props and usage
    - Document step component interfaces
    - Add usage examples
    - _Requirements: 10.1-10.7_
  

  - [x] 15.2 Update existing component comments

    - Update MealCard to reference wizard integration
    - Update FoodItem to reference wizard option
    - Update FoodsView to reference wizard option
    - _Requirements: 6.1, 6.2_
  

  - [x] 15.3 Create wizard usage guide

    - Document how to create new wizards
    - Provide step component examples
    - Explain validation patterns
    - _Requirements: 10.1-10.7_

- [x] 16. Stabilization and migration





  - [x] 16.1 Make wizards the default


    - Switch default "Add Food" to wizard version
    - Switch default "Edit" to wizard version
    - Keep old forms accessible via settings/flag
    - _Requirements: 6.2, 6.3_
  

  - [x] 16.2 Collect user feedback

    - Monitor wizard usage
    - Track completion rates
    - Identify pain points
    - _Requirements: 5.1-5.10_
  

  - [x] 16.3 Remove old form components

    - Delete FoodEntryForm.jsx
    - Delete FoodForm.jsx (keep DrinkForm for now)
    - Update imports and references
    - _Requirements: 6.5_
