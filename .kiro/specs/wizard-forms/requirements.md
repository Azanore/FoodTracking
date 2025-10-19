# Requirements Document

## Introduction

Implement a multi-step wizard form system to simplify complex food entry and editing operations in the food tracking app. The current single-page forms with 10+ fields are overwhelming. Wizards will break these into logical, progressive steps while maintaining all existing functionality.

**Scope:** Add wizard components for food entry/editing flows. Preserve existing forms initially for gradual migration. Focus on reusability - create a generic wizard framework that can be used across different form types.

**Out of Scope:** Meal forms (already simple), drink forms (less complex), analytics, new features beyond wizard implementation.

## Requirements

### Requirement 1: Generic Wizard Framework

**User Story:** As a developer, I want a reusable wizard component framework, so that I can easily create multi-step forms without duplicating code.

#### Acceptance Criteria

1. WHEN I create a wizard THEN the system SHALL provide a `<Wizard>` component that manages step navigation, state, and validation
2. WHEN I define wizard steps THEN the system SHALL accept an array of step configurations with title, component, and validation function
3. WHEN a user navigates between steps THEN the system SHALL preserve form data across all steps
4. WHEN a user clicks "Next" THEN the system SHALL validate the current step before proceeding
5. WHEN a user clicks "Back" THEN the system SHALL return to the previous step without validation
6. WHEN a user is on the first step THEN the system SHALL hide the "Back" button
7. WHEN a user is on the last step THEN the system SHALL show "Save" instead of "Next"
8. WHEN validation fails THEN the system SHALL display error messages and prevent navigation
9. WHEN a user clicks "Cancel" THEN the system SHALL show a confirmation dialog if data has been entered
10. WHEN the wizard completes THEN the system SHALL call an onComplete callback with all collected data

### Requirement 2: Food Entry Wizard (Add to Meal)

**User Story:** As a user, I want to add food to a meal using a step-by-step wizard, so that I'm not overwhelmed by all the options at once.

#### Acceptance Criteria

1. WHEN I click "Add Food" in a meal card THEN the system SHALL open a wizard modal with step indicator
2. WHEN I'm on Step 1 (Food Selection) THEN the system SHALL show a searchable list of foods from my library with option to create new
3. WHEN I select a food THEN the system SHALL auto-populate defaults and proceed to Step 2
4. WHEN I'm on Step 2 (Quantity & Measurement) THEN the system SHALL show quantity input, unit selector, portion selector, and cooking method selector
5. WHEN I'm on Step 3 (Composition) THEN the system SHALL show ingredient and extras selectors with ability to add new
6. WHEN I'm on Step 4 (Tags & Notes) THEN the system SHALL show tag selector and notes textarea
7. WHEN I complete the wizard THEN the system SHALL add the food entry to the meal and close the wizard
8. WHEN I click "Back" on any step THEN the system SHALL preserve my selections and return to the previous step
9. WHEN I click "Cancel" THEN the system SHALL confirm and discard changes
10. IF I create a new food during the wizard THEN the system SHALL save it to the library and select it automatically

### Requirement 3: Food Entry Wizard (Edit in Meal)

**User Story:** As a user, I want to edit a food entry in a meal using a wizard, so that I can easily modify specific aspects without seeing all fields.

#### Acceptance Criteria

1. WHEN I click "Edit" on a food item in a meal THEN the system SHALL open the wizard pre-populated with existing values
2. WHEN the wizard opens THEN the system SHALL start on Step 2 (Quantity & Measurement) since food is already selected
3. WHEN I navigate through steps THEN the system SHALL show current values for all fields
4. WHEN I modify any field THEN the system SHALL mark the form as dirty
5. WHEN I complete the wizard THEN the system SHALL update the food entry in the meal
6. WHEN I click "Cancel" with unsaved changes THEN the system SHALL confirm before discarding
7. WHEN I click "Back" to Step 1 THEN the system SHALL allow changing the selected food

### Requirement 4: Food Library Wizard (Create/Edit)

**User Story:** As a user, I want to create or edit foods in my library using a wizard, so that I can set up defaults without being overwhelmed.

#### Acceptance Criteria

1. WHEN I click "Add Food" in Foods Library THEN the system SHALL open a wizard modal
2. WHEN I'm on Step 1 (Basic Info) THEN the system SHALL show name and default quantity inputs
3. WHEN I'm on Step 2 (Measurement Defaults) THEN the system SHALL show unit, portion, and cooking method selectors
4. WHEN I'm on Step 3 (Composition) THEN the system SHALL show ingredient and default extras selectors
5. WHEN I'm on Step 4 (Tags) THEN the system SHALL show tag selector
6. WHEN I complete the wizard THEN the system SHALL save the food to the library
7. WHEN I edit an existing food THEN the system SHALL pre-populate all steps with current values
8. WHEN I save changes THEN the system SHALL update the food in the library
9. WHEN I click "Cancel" THEN the system SHALL confirm if changes were made

### Requirement 5: Wizard UI/UX Standards

**User Story:** As a user, I want consistent wizard behavior across all forms, so that I can learn the pattern once and apply it everywhere.

#### Acceptance Criteria

1. WHEN a wizard opens THEN the system SHALL display a step indicator showing current step and total steps
2. WHEN I'm on any step THEN the system SHALL show the step title prominently
3. WHEN I navigate steps THEN the system SHALL use smooth transitions without jarring jumps
4. WHEN validation fails THEN the system SHALL highlight invalid fields with clear error messages
5. WHEN I complete a step THEN the system SHALL mark it as complete in the step indicator
6. WHEN the wizard is open THEN the system SHALL prevent interaction with content behind the modal
7. WHEN I press Escape THEN the system SHALL trigger the cancel action
8. WHEN the wizard is tall THEN the system SHALL make the content area scrollable while keeping header/footer fixed
9. WHEN I'm on mobile/small screen THEN the system SHALL adapt the wizard layout appropriately
10. WHEN the wizard completes successfully THEN the system SHALL show a brief success indicator before closing

### Requirement 6: Backward Compatibility

**User Story:** As a developer, I want to maintain existing forms during wizard rollout, so that we can migrate gradually without breaking functionality.

#### Acceptance Criteria

1. WHEN wizards are implemented THEN the system SHALL keep existing form components functional
2. WHEN a user accesses a feature THEN the system SHALL use the wizard version by default
3. WHEN needed for debugging THEN the system SHALL allow switching back to old forms via a flag
4. WHEN both forms exist THEN the system SHALL share the same data models and services
5. WHEN wizards are stable THEN the system SHALL allow removal of old form components

### Requirement 7: Wizard State Management

**User Story:** As a developer, I want proper state management in wizards, so that data flows correctly and validation works reliably.

#### Acceptance Criteria

1. WHEN a wizard initializes THEN the system SHALL create a form state object with all fields
2. WHEN a user modifies a field THEN the system SHALL update the form state immediately
3. WHEN a user navigates steps THEN the system SHALL preserve all form state
4. WHEN validation runs THEN the system SHALL check only the current step's fields
5. WHEN the wizard completes THEN the system SHALL transform form state into the required data model
6. WHEN a wizard is cancelled THEN the system SHALL clear all form state
7. WHEN a wizard reopens THEN the system SHALL start with fresh state (unless editing)

### Requirement 8: Accessibility

**User Story:** As a user with accessibility needs, I want wizards to be keyboard-navigable and screen-reader friendly, so that I can use the app effectively.

#### Acceptance Criteria

1. WHEN a wizard opens THEN the system SHALL focus the first input field
2. WHEN I press Tab THEN the system SHALL navigate through focusable elements in logical order
3. WHEN I press Enter on "Next" THEN the system SHALL proceed to the next step
4. WHEN I use a screen reader THEN the system SHALL announce step changes and validation errors
5. WHEN I navigate with keyboard THEN the system SHALL show visible focus indicators
6. WHEN validation fails THEN the system SHALL move focus to the first invalid field
7. WHEN the wizard completes THEN the system SHALL return focus to the trigger element

### Requirement 9: Performance

**User Story:** As a user, I want wizards to load and respond quickly, so that my workflow isn't interrupted.

#### Acceptance Criteria

1. WHEN a wizard opens THEN the system SHALL render within 100ms
2. WHEN I navigate between steps THEN the system SHALL transition within 50ms
3. WHEN I type in a search field THEN the system SHALL debounce and filter results efficiently
4. WHEN loading large lists (ingredients, tags) THEN the system SHALL virtualize or paginate
5. WHEN I interact with the wizard THEN the system SHALL not block the UI thread

### Requirement 10: Reusable Wizard Components

**User Story:** As a developer, I want reusable step components, so that I can compose wizards quickly without duplicating UI code.

#### Acceptance Criteria

1. WHEN creating a wizard THEN the system SHALL provide pre-built step components for common patterns
2. WHEN I need a search/select step THEN the system SHALL provide a `<SearchSelectStep>` component
3. WHEN I need a multi-select step THEN the system SHALL provide a `<MultiSelectStep>` component
4. WHEN I need a form fields step THEN the system SHALL provide a `<FormFieldsStep>` component
5. WHEN I need custom logic THEN the system SHALL allow creating custom step components
6. WHEN using step components THEN the system SHALL handle common validation patterns automatically
7. WHEN step components render THEN the system SHALL apply consistent styling automatically
