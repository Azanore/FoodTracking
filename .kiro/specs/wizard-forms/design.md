# Design Document

## Overview

This design implements a reusable wizard form system for the food tracking app. The architecture prioritizes component reusability, clean state management, and progressive disclosure of complex forms. The wizard framework will be generic enough to support multiple use cases while maintaining consistency with the existing app's design language.

## Architecture

### High-Level Structure

Project structure:
- src/components/wizard/: Core wizard components (Wizard, WizardStep, WizardHeader, WizardFooter, WizardContext)
- src/components/wizard-steps/: Reusable step components (SearchSelectStep, FormFieldsStep, MultiSelectStep)
- src/components/food-wizards/: Food-specific wizards (AddFoodToMealWizard, EditFoodInMealWizard, FoodLibraryWizard)
- src/components/food-wizards/steps/: Food-specific step implementations (FoodSelectionStep, QuantityMeasurementStep, CompositionStep, TagsNotesStep)
- src/hooks/: Wizard state management hook (useWizard)

### Design Principles

1. **Separation of Concerns**: Wizard framework is generic, food logic is isolated
2. **Composition over Configuration**: Build wizards by composing step components
3. **Controlled Components**: Parent manages state, steps are presentational
4. **Progressive Enhancement**: Start simple, add complexity only when needed
5. **Backward Compatible**: New wizards coexist with existing forms

## Components and Interfaces

### 1. Core Wizard Components

#### Wizard.jsx
Main wizard container that orchestrates the multi-step flow.

```jsx
/**
 * @typedef {Object} WizardStep
 * @property {string} id - Unique step identifier
 * @property {string} title - Step display title
 * @property {React.Component} component - Step component to render
 * @property {(data: Object) => boolean | Promise<boolean>} validate - Validation function
 * @property {boolean} [optional] - Whether step can be skipped
 */

/**
 * @typedef {Object} WizardProps
 * @property {WizardStep[]} steps - Array of step configurations
 * @property {Object} initialData - Initial form data
 * @property {(data: Object) => void} onComplete - Called when wizard completes
 * @property {() => void} onCancel - Called when wizard is cancelled
 * @property {string} [title] - Overall wizard title
 * @property {boolean} [showStepIndicator=true] - Show step progress indicator
 */

<Wizard
  steps={[
    { id: 'select', title: 'Select Food', component: FoodSelectionStep, validate: validateSelection },
    { id: 'quantity', title: 'Quantity', component: QuantityStep, validate: validateQuantity },
    { id: 'composition', title: 'Ingredients', component: CompositionStep, optional: true },
    { id: 'tags', title: 'Tags & Notes', component: TagsStep, optional: true }
  ]}
  initialData={existingData}
  onComplete={handleSave}
  onCancel={handleCancel}
  title="Add Food to Meal"
/>
```

**State Management:**
- Current step index
- Form data (accumulated across steps)
- Validation errors
- Dirty flag (has user made changes)
- Completed steps tracking

**Key Methods:**
- `goToNextStep()` - Validate current step, then advance
- `goToPreviousStep()` - Go back without validation
- `goToStep(index)` - Jump to specific step (if already completed)
- `updateData(stepData)` - Merge step data into form state
- `complete()` - Validate all, call onComplete
- `cancel()` - Confirm if dirty, call onCancel

#### WizardContext.jsx
React Context for sharing wizard state with step components.

```jsx
const WizardContext = createContext({
  currentStep: 0,
  totalSteps: 0,
  formData: {},
  errors: {},
  isFirstStep: false,
  isLastStep: false,
  updateData: (data) => {},
  goNext: () => {},
  goBack: () => {},
  cancel: () => {}
});

export const useWizardContext = () => useContext(WizardContext);
```

#### WizardHeader.jsx
Displays step indicator and current step title.

```jsx
<WizardHeader
  currentStep={2}
  totalSteps={4}
  steps={[
    { id: 'select', title: 'Select Food', completed: true },
    { id: 'quantity', title: 'Quantity', completed: true },
    { id: 'composition', title: 'Ingredients', completed: false },
    { id: 'tags', title: 'Tags', completed: false }
  ]}
  onStepClick={(index) => {}} // Jump to completed step
/>
```

**Visual Design:**
Step indicator shows progress with numbered circles and connecting lines, displaying current step title below.

#### WizardFooter.jsx
Navigation buttons with smart labeling.

```jsx
<WizardFooter
  onBack={handleBack}
  onNext={handleNext}
  onCancel={handleCancel}
  isFirstStep={false}
  isLastStep={false}
  nextLabel="Next"      // or "Save" on last step
  isNextDisabled={false}
  isLoading={false}
/>
```

### 2. Reusable Step Components

#### SearchSelectStep.jsx
Generic search and select from a list.

```jsx
<SearchSelectStep
  items={foods}                    // Array of items to search
  selectedId={formData.foodId}     // Currently selected item ID
  onSelect={(item) => updateData({ foodId: item.id, ...item })}
  searchPlaceholder="Search foods..."
  renderItem={(item) => (         // Custom item renderer
    <div>
      <div className="font-medium">{item.name}</div>
      <div className="text-xs text-gray-500">
        {item.defaultQuantity} {item.defaultUnit}
      </div>
    </div>
  )}
  filterFn={(item, query) =>      // Custom filter logic
    item.name.toLowerCase().includes(query.toLowerCase())
  }
  emptyMessage="No foods found"
  allowCreate={true}               // Show "Create new" option
  onCreateNew={(name) => handleCreateFood(name)}
/>
```

#### FormFieldsStep.jsx
Generic form fields with validation.

```jsx
<FormFieldsStep
  fields={[
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      required: true,
      min: 0.1,
      step: 0.1,
      value: formData.quantity,
      error: errors.quantity
    },
    {
      name: 'unit',
      label: 'Unit',
      type: 'select',
      required: true,
      options: UNITS,
      value: formData.unit,
      error: errors.unit
    }
  ]}
  onChange={(name, value) => updateData({ [name]: value })}
/>
```

#### MultiSelectStep.jsx
Multi-select with badge UI (for ingredients, tags, etc).

```jsx
<MultiSelectStep
  label="Ingredients"
  items={availableIngredients}
  selectedIds={formData.ingredientIds}
  onChange={(ids) => updateData({ ingredientIds: ids })}
  renderBadge={(item) => (
    <span className="badge">{item.name}</span>
  )}
  allowCreate={true}
  onCreateNew={(name) => handleCreateIngredient(name)}
  topCount={8}                     // Show top N items first
  groupBy={(item) => item.category} // Optional grouping
/>
```

### 3. Food-Specific Wizards

#### AddFoodToMealWizard.jsx
Wizard for adding food to a meal.

```jsx
export function AddFoodToMealWizard({ onComplete, onCancel }) {
  const steps = [
    {
      id: 'select-food',
      title: 'Select Food',
      component: FoodSelectionStep,
      validate: (data) => !!data.foodId || !!data.name
    },
    {
      id: 'quantity',
      title: 'Quantity & Measurement',
      component: QuantityMeasurementStep,
      validate: (data) => data.quantity > 0 && !!data.unit
    },
    {
      id: 'composition',
      title: 'Ingredients & Extras',
      component: CompositionStep,
      optional: true
    },
    {
      id: 'tags-notes',
      title: 'Tags & Notes',
      component: TagsNotesStep,
      optional: true
    }
  ];

  const handleComplete = async (data) => {
    // Transform wizard data to FoodEntry format
    const foodEntry = {
      foodId: data.foodId,
      name: data.name,
      quantity: parseFloat(data.quantity),
      unit: data.unit,
      portion: data.portion || null,
      cookingMethod: data.cookingMethod || null,
      ingredients: data.ingredients || [],
      extras: data.extras || [],
      tags: data.tags || [],
      notes: data.notes || null
    };
    
    onComplete(foodEntry);
  };

  return (
    <Wizard
      steps={steps}
      initialData={{}}
      onComplete={handleComplete}
      onCancel={onCancel}
      title="Add Food to Meal"
    />
  );
}
```

#### EditFoodInMealWizard.jsx
Wizard for editing existing food entry.

```jsx
export function EditFoodInMealWizard({ foodEntry, onComplete, onCancel }) {
  const steps = [
    {
      id: 'select-food',
      title: 'Change Food',
      component: FoodSelectionStep,
      validate: (data) => !!data.foodId || !!data.name
    },
    {
      id: 'quantity',
      title: 'Quantity & Measurement',
      component: QuantityMeasurementStep,
      validate: (data) => data.quantity > 0 && !!data.unit
    },
    {
      id: 'composition',
      title: 'Ingredients & Extras',
      component: CompositionStep,
      optional: true
    },
    {
      id: 'tags-notes',
      title: 'Tags & Notes',
      component: TagsNotesStep,
      optional: true
    }
  ];

  // Pre-populate with existing data
  const initialData = {
    foodId: foodEntry.foodId,
    name: foodEntry.name,
    quantity: foodEntry.quantity,
    unit: foodEntry.unit,
    portion: foodEntry.portion,
    cookingMethod: foodEntry.cookingMethod,
    ingredients: foodEntry.ingredients,
    extras: foodEntry.extras,
    tags: foodEntry.tags,
    notes: foodEntry.notes
  };

  return (
    <Wizard
      steps={steps}
      initialData={initialData}
      onComplete={onComplete}
      onCancel={onCancel}
      title="Edit Food"
      startStep={1}  // Skip food selection, start at quantity
    />
  );
}
```

#### FoodLibraryWizard.jsx
Wizard for creating/editing foods in library.

```jsx
export function FoodLibraryWizard({ food, onComplete, onCancel }) {
  const steps = [
    {
      id: 'basic',
      title: 'Basic Information',
      component: BasicInfoStep,
      validate: (data) => !!data.name && data.defaultQuantity > 0
    },
    {
      id: 'measurement',
      title: 'Measurement Defaults',
      component: MeasurementDefaultsStep,
      validate: (data) => !!data.defaultUnit
    },
    {
      id: 'composition',
      title: 'Composition',
      component: CompositionStep,
      optional: true
    },
    {
      id: 'tags',
      title: 'Tags',
      component: TagsStep,
      optional: true
    }
  ];

  const initialData = food ? {
    name: food.name,
    defaultQuantity: food.defaultQuantity,
    defaultUnit: food.defaultUnit,
    defaultPortion: food.defaultPortion,
    defaultCookingMethod: food.defaultCookingMethod,
    ingredients: food.ingredients,
    defaultExtras: food.defaultExtras,
    tags: food.tags
  } : {
    defaultQuantity: 1,
    defaultUnit: 'pieces'
  };

  const handleComplete = async (data) => {
    const foodData = {
      ...(food || {}),
      name: data.name,
      defaultQuantity: data.defaultQuantity,
      defaultUnit: data.defaultUnit,
      defaultPortion: data.defaultPortion || null,
      defaultCookingMethod: data.defaultCookingMethod || null,
      ingredients: data.ingredients || [],
      defaultExtras: data.defaultExtras || [],
      tags: data.tags || []
    };
    
    await saveFood(foodData);
    onComplete();
  };

  return (
    <Wizard
      steps={steps}
      initialData={initialData}
      onComplete={handleComplete}
      onCancel={onCancel}
      title={food ? 'Edit Food' : 'Add New Food'}
    />
  );
}
```

### 4. Food-Specific Step Implementations

#### FoodSelectionStep.jsx
Step 1: Search and select food from library or create new.

```jsx
export function FoodSelectionStep() {
  const { formData, updateData } = useWizardContext();
  const [foods, setFoods] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    getAllFoods().then(setFoods);
  }, []);

  const handleSelectFood = (food) => {
    // Auto-populate defaults from selected food
    updateData({
      foodId: food.id,
      name: food.name,
      quantity: food.defaultQuantity,
      unit: food.defaultUnit,
      portion: food.defaultPortion,
      cookingMethod: food.defaultCookingMethod,
      ingredients: food.ingredients,
      extras: food.defaultExtras,
      tags: food.tags
    });
  };

  const handleCreateNew = (name) => {
    setShowCreateForm(true);
    updateData({ name, foodId: null });
  };

  if (showCreateForm) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Creating new food: <strong>{formData.name}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Continue to set up this food. It will be saved to your library.
        </p>
      </div>
    );
  }

  return (
    <SearchSelectStep
      items={foods}
      selectedId={formData.foodId}
      onSelect={handleSelectFood}
      searchPlaceholder="Search your foods..."
      renderItem={(food) => (
        <div>
          <div className="font-medium">{food.name}</div>
          <div className="text-xs text-gray-500">
            {food.defaultQuantity} {food.defaultUnit}
            {food.defaultPortion && ` • ${food.defaultPortion}`}
            {food.defaultCookingMethod && ` • ${food.defaultCookingMethod}`}
          </div>
        </div>
      )}
      filterFn={(food, query) =>
        food.name.toLowerCase().includes(query.toLowerCase()) ||
        food.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      }
      allowCreate={true}
      onCreateNew={handleCreateNew}
      emptyMessage="No foods found. Create a new one?"
    />
  );
}
```

#### QuantityMeasurementStep.jsx
Step 2: Set quantity, unit, portion, cooking method.

```jsx
export function QuantityMeasurementStep() {
  const { formData, updateData, errors } = useWizardContext();

  return (
    <div className="space-y-6">
      {/* Quantity */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          Quantity *
        </label>
        <input
          type="number"
          value={formData.quantity || ''}
          onChange={(e) => updateData({ quantity: e.target.value })}
          min="0.1"
          step="0.1"
          className="w-full px-3 py-2 border-2 border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
        />
        {errors.quantity && (
          <p className="text-xs text-red-600 mt-1">{errors.quantity}</p>
        )}
      </div>

      {/* Unit */}
      <CheckableButtonGroup
        label="Unit *"
        options={UNITS}
        value={formData.unit}
        onChange={(value) => updateData({ unit: value })}
        columns={5}
      />

      {/* Portion */}
      <CheckableButtonGroup
        label="Portion"
        options={PORTIONS}
        value={formData.portion || ''}
        onChange={(value) => updateData({ portion: value })}
        columns={4}
      />

      {/* Cooking Method */}
      <CheckableButtonGroup
        label="Cooking Method"
        options={COOKING_METHODS}
        value={formData.cookingMethod || ''}
        onChange={(value) => updateData({ cookingMethod: value })}
        columns={5}
      />
    </div>
  );
}
```

#### CompositionStep.jsx
Step 3: Select ingredients and extras.

```jsx
export function CompositionStep() {
  const { formData, updateData } = useWizardContext();
  const [availableIngredients, setAvailableIngredients] = useState([]);

  useEffect(() => {
    getAllIngredients().then(setAvailableIngredients);
  }, []);

  const handleAddIngredient = async (name) => {
    const ingredient = await saveIngredient({
      name: name.trim(),
      category: 'Other',
      tags: [],
      aliases: []
    });
    setAvailableIngredients([...availableIngredients, ingredient]);
    
    const ingredients = formData.ingredients || [];
    updateData({
      ingredients: [...ingredients, { id: ingredient.id, name: ingredient.name, category: ingredient.category }]
    });
  };

  return (
    <div className="space-y-6">
      {/* Ingredients */}
      <MultiSelectStep
        label="Ingredients"
        items={availableIngredients}
        selectedIds={(formData.ingredients || []).map(i => i.id)}
        onChange={(ids) => {
          const ingredients = ids
            .map(id => availableIngredients.find(ing => ing.id === id))
            .filter(Boolean)
            .map(ing => ({ id: ing.id, name: ing.name, category: ing.category }));
          updateData({ ingredients });
        }}
        renderBadge={(item) => item.name}
        allowCreate={true}
        onCreateNew={handleAddIngredient}
        topCount={8}
      />

      {/* Extras */}
      <MultiSelectStep
        label="Extras"
        items={availableIngredients}
        selectedIds={(formData.extras || []).map(i => i.id)}
        onChange={(ids) => {
          const extras = ids
            .map(id => availableIngredients.find(ing => ing.id === id))
            .filter(Boolean)
            .map(ing => ({ id: ing.id, name: ing.name, category: ing.category }));
          updateData({ extras });
        }}
        renderBadge={(item) => item.name}
        allowCreate={true}
        onCreateNew={handleAddIngredient}
        topCount={8}
      />
    </div>
  );
}
```

#### TagsNotesStep.jsx
Step 4: Add tags and notes.

```jsx
export function TagsNotesStep() {
  const { formData, updateData } = useWizardContext();
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    getAllFoodTags().then(setAvailableTags);
  }, []);

  const handleAddTag = (name) => {
    const newTag = { id: name.trim(), name: name.trim(), usageCount: 0 };
    setAvailableTags([...availableTags, newTag]);
    
    const tags = formData.tags || [];
    updateData({ tags: [...tags, name.trim()] });
  };

  return (
    <div className="space-y-6">
      {/* Tags */}
      <MultiSelectStep
        label="Tags"
        items={availableTags}
        selectedIds={formData.tags || []}
        onChange={(ids) => updateData({ tags: ids })}
        renderBadge={(item) => item.name}
        allowCreate={true}
        onCreateNew={handleAddTag}
        topCount={8}
      />

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          Notes
        </label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => updateData({ notes: e.target.value })}
          placeholder="Add any notes about this food..."
          rows={4}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 resize-none"
        />
      </div>
    </div>
  );
}
```

## Data Models

### Wizard State
```typescript
interface WizardState {
  currentStepIndex: number;
  completedSteps: Set<number>;
  formData: Record<string, any>;
  errors: Record<string, string>;
  isDirty: boolean;
  isValidating: boolean;
  isSubmitting: boolean;
}
```

### Step Configuration
```typescript
interface StepConfig {
  id: string;
  title: string;
  component: React.ComponentType;
  validate?: (data: any) => boolean | Promise<boolean> | { valid: boolean; errors: Record<string, string> };
  optional?: boolean;
  onEnter?: (data: any) => void;
  onExit?: (data: any) => void;
}
```

### Food Entry Data (Wizard Format)
```typescript
interface FoodEntryWizardData {
  // Step 1: Food Selection
  foodId: string | null;
  name: string;
  
  // Step 2: Quantity & Measurement
  quantity: number;
  unit: Unit;
  portion: Portion | null;
  cookingMethod: CookingMethod | null;
  
  // Step 3: Composition
  ingredients: { id: string; name: string; category: IngredientCategory }[];
  extras: { id: string; name: string; category: IngredientCategory }[];
  
  // Step 4: Tags & Notes
  tags: string[];
  notes: string | null;
}
```

## Error Handling

### Validation Strategy
1. **Per-Step Validation**: Each step validates only its fields
2. **Async Validation**: Support async validation (e.g., checking if food name exists)
3. **Field-Level Errors**: Display errors next to specific fields
4. **Step-Level Errors**: Show summary at top if multiple errors
5. **Prevent Navigation**: Block "Next" if validation fails

### Error Display
```jsx
// Field-level error
<input className={errors.quantity ? 'border-red-500' : ''} />
{errors.quantity && <p className="text-red-600 text-xs">{errors.quantity}</p>}

// Step-level error summary
{Object.keys(errors).length > 0 && (
  <div className="bg-red-50 border border-red-300 rounded p-3 mb-4">
    <p className="text-sm text-red-700 font-medium">Please fix the following errors:</p>
    <ul className="list-disc list-inside text-sm text-red-600 mt-1">
      {Object.values(errors).map((error, i) => <li key={i}>{error}</li>)}
    </ul>
  </div>
)}
```

## Testing Strategy

### Unit Tests
- Wizard state management (useWizard hook)
- Step validation functions
- Data transformation (wizard data → FoodEntry)
- Navigation logic (next, back, jump to step)

### Integration Tests
- Complete wizard flow (all steps)
- Edit mode (pre-populated data)
- Cancel with unsaved changes
- Create new items during wizard (ingredients, tags)

### E2E Tests
- Add food to meal via wizard
- Edit food in meal via wizard
- Create food in library via wizard
- Keyboard navigation
- Screen reader compatibility

## Migration Strategy

### Phase 1: Build Wizard Framework (Week 1)
1. Create core wizard components (Wizard, WizardHeader, WizardFooter, WizardContext)
2. Implement useWizard hook
3. Build reusable step components (SearchSelectStep, FormFieldsStep, MultiSelectStep)
4. Add unit tests

### Phase 2: Implement Food Entry Wizard (Week 2)
1. Create AddFoodToMealWizard
2. Implement all 4 step components
3. Integrate with MealCard (add "Add Food (Wizard)" button)
4. Test alongside existing InlineAddFood
5. Collect user feedback

### Phase 3: Implement Edit Wizard (Week 3)
1. Create EditFoodInMealWizard
2. Integrate with FoodItem (add "Edit (Wizard)" option)
3. Test alongside existing FoodEntryForm
4. Collect user feedback

### Phase 4: Implement Library Wizard (Week 4)
1. Create FoodLibraryWizard
2. Integrate with FoodsView (add "Add Food (Wizard)" button)
3. Test alongside existing FoodForm
4. Collect user feedback

### Phase 5: Stabilize & Remove Old Forms (Week 5)
1. Make wizards the default
2. Fix bugs based on feedback
3. Remove old form components (FoodEntryForm, FoodForm)
4. Update documentation

## Performance Considerations

### Optimization Techniques
1. **Lazy Load Steps**: Only render current step component
2. **Debounce Search**: Debounce search input (300ms)
3. **Virtualize Lists**: Use virtual scrolling for large ingredient/tag lists
4. **Memoize Validation**: Cache validation results per step
5. **Optimize Re-renders**: Use React.memo for step components

### Bundle Size
- Core wizard framework: ~5KB gzipped
- Reusable step components: ~3KB gzipped
- Food-specific wizards: ~4KB gzipped
- Total addition: ~12KB gzipped

## Accessibility

### Keyboard Navigation
- Tab: Navigate through focusable elements
- Enter: Activate buttons, proceed to next step
- Escape: Cancel wizard
- Arrow keys: Navigate step indicator (if clickable)

### Screen Reader Support
- Announce step changes: "Step 2 of 4: Quantity and Measurement"
- Announce validation errors: "Error: Quantity is required"
- Label all form fields properly
- Use ARIA attributes (aria-label, aria-describedby, aria-invalid)

### Focus Management
- Focus first input when step loads
- Focus first error when validation fails
- Return focus to trigger element when wizard closes

## Visual Design

### Modal Layout
Wizard modal contains:
- Close button (top right)
- Wizard title
- Step indicator with progress
- Current step title
- Scrollable content area
- Footer with navigation buttons (Cancel, Back, Next)

### Step Indicator States
- **Completed**: Filled circle (●) with checkmark
- **Current**: Filled circle (●) with pulse animation
- **Upcoming**: Empty circle (○)
- **Optional**: Dashed circle (◌)

### Transitions
- Slide animation between steps (200ms ease-in-out)
- Fade in validation errors (150ms)
- Smooth height adjustment when content changes

## Dependencies

### New Dependencies
None - use existing dependencies (React, lucide-react, Tailwind)

### Existing Dependencies to Leverage
- CheckableButtonGroup (for unit, portion, cooking method selection)
- CheckableBadgeGroup (for ingredients, extras, tags)
- Existing db.js functions (getAllFoods, saveFood, etc.)
- Existing tagService.js functions

## Backward Compatibility

### Coexistence Strategy
1. Keep existing form components unchanged
2. Add wizard components in parallel
3. Provide both options in UI initially (e.g., "Add Food" vs "Add Food (Wizard)")
4. Use feature flag to control default behavior
5. Remove old forms once wizards are stable

### Data Compatibility
- Wizards produce same data structures as existing forms
- No database schema changes required
- Existing FoodEntry, UserFood types remain unchanged
