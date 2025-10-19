# Wizard Usage Guide

This guide explains how to create and use wizards in the food tracking app.

## Table of Contents

1. [Overview](#overview)
2. [Creating a New Wizard](#creating-a-new-wizard)
3. [Step Components](#step-components)
4. [Validation Patterns](#validation-patterns)
5. [Examples](#examples)
6. [Best Practices](#best-practices)

## Overview

The wizard framework provides a reusable way to create multi-step forms with:
- Step navigation with progress indicator
- Per-step validation
- Form state management across steps
- Keyboard shortcuts (Escape to cancel, Enter to proceed)
- Accessibility features (screen reader support, focus management)
- Smooth transitions between steps

### Core Components

- **Wizard** - Main container that orchestrates the wizard flow
- **WizardContext** - Provides wizard state to step components
- **WizardHeader** - Step indicator and progress visualization
- **WizardFooter** - Navigation buttons (Back, Next/Save, Cancel)
- **useWizard** - Hook for managing wizard state

## Creating a New Wizard

### Basic Structure

```jsx
import { Wizard } from '../wizard/Wizard';
import { MyStep1 } from './steps/MyStep1';
import { MyStep2 } from './steps/MyStep2';

export function MyWizard({ onComplete, onCancel }) {
  // Define validation functions
  const validateStep1 = (data) => {
    if (!data.requiredField) {
      return { valid: false, errors: { requiredField: 'This field is required' } };
    }
    return { valid: true, errors: {} };
  };

  // Define wizard steps
  const steps = [
    {
      id: 'step-1',
      title: 'Step 1 Title',
      component: MyStep1,
      validate: validateStep1
    },
    {
      id: 'step-2',
      title: 'Step 2 Title',
      component: MyStep2,
      optional: true  // Optional steps can be skipped
    }
  ];

  // Handle wizard completion
  const handleComplete = async (data) => {
    // Transform wizard data to your data model
    const result = {
      field1: data.field1,
      field2: data.field2
    };
    
    onComplete(result);
  };

  return (
    <Wizard
      steps={steps}
      initialData={{}}
      onComplete={handleComplete}
      onCancel={onCancel}
      title="My Wizard"
    />
  );
}
```

### Wizard Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `steps` | `StepConfig[]` | Yes | Array of step configurations |
| `initialData` | `Object` | No | Initial form data (for edit mode) |
| `onComplete` | `Function` | Yes | Called when wizard completes with all form data |
| `onCancel` | `Function` | Yes | Called when wizard is cancelled |
| `title` | `string` | No | Overall wizard title |
| `showStepIndicator` | `boolean` | No | Show step progress indicator (default: true) |
| `startStep` | `number` | No | Initial step index (default: 0) |

### Step Configuration

```typescript
interface StepConfig {
  id: string;                    // Unique step identifier
  title: string;                 // Step display title
  component: React.Component;    // Step component to render
  validate?: Function;           // Validation function
  optional?: boolean;            // Whether step can be skipped
}
```

## Step Components

Step components receive wizard state via `useWizardContext` hook.

### Creating a Step Component

```jsx
import { useWizardContext } from '../wizard/WizardContext';

export function MyStep() {
  const { formData, updateData, errors } = useWizardContext();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Field Name
        </label>
        <input
          type="text"
          value={formData.fieldName || ''}
          onChange={(e) => updateData({ fieldName: e.target.value })}
          aria-invalid={!!errors.fieldName}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded"
        />
        {errors.fieldName && (
          <p className="text-xs text-red-600 mt-1">{errors.fieldName}</p>
        )}
      </div>
    </div>
  );
}
```

### useWizardContext API

```typescript
interface WizardContextValue {
  currentStep: number;           // Current step index (0-based)
  totalSteps: number;            // Total number of steps
  formData: Object;              // Accumulated form data
  errors: Object;                // Validation errors
  isDirty: boolean;              // Whether user has made changes
  isFirstStep: boolean;          // Whether on first step
  isLastStep: boolean;           // Whether on last step
  updateData: (data: Object) => void;  // Update form data
  goNext: () => void;            // Navigate to next step
  goBack: () => void;            // Navigate to previous step
  cancel: () => void;            // Cancel wizard
}
```

### Reusable Step Components

The framework provides pre-built step components for common patterns:

#### SearchSelectStep

Search and select from a list with optional "Create new" functionality.

```jsx
import { SearchSelectStep } from '../wizard-steps/SearchSelectStep';

<SearchSelectStep
  items={foods}
  selectedId={formData.foodId}
  onSelect={(item) => updateData({ foodId: item.id, name: item.name })}
  searchPlaceholder="Search foods..."
  renderItem={(item) => (
    <div>
      <div className="font-medium">{item.name}</div>
      <div className="text-xs text-gray-500">{item.description}</div>
    </div>
  )}
  filterFn={(item, query) => 
    item.name.toLowerCase().includes(query.toLowerCase())
  }
  allowCreate={true}
  onCreateNew={(name) => handleCreateNew(name)}
/>
```

#### MultiSelectStep

Multi-select with badge UI and "Show more" modal.

```jsx
import { MultiSelectStep } from '../wizard-steps/MultiSelectStep';

<MultiSelectStep
  label="Ingredients"
  items={availableIngredients}
  selectedIds={formData.ingredientIds || []}
  onChange={(ids) => updateData({ ingredientIds: ids })}
  renderBadge={(item) => item.name}
  allowCreate={true}
  onCreateNew={(name) => handleCreateIngredient(name)}
  topCount={8}
  groupBy={(item) => item.category}
/>
```

#### FormFieldsStep

Generic form fields with validation display.

```jsx
import { FormFieldsStep } from '../wizard-steps/FormFieldsStep';

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
      options: [
        { value: 'pieces', label: 'Pieces' },
        { value: 'grams', label: 'Grams' }
      ],
      value: formData.unit,
      error: errors.unit
    }
  ]}
  onChange={(name, value) => updateData({ [name]: value })}
/>
```

## Validation Patterns

### Basic Validation

```jsx
const validateStep = (data) => {
  if (!data.requiredField) {
    return { 
      valid: false, 
      errors: { requiredField: 'This field is required' } 
    };
  }
  return { valid: true, errors: {} };
};
```

### Multiple Field Validation

```jsx
const validateStep = (data) => {
  const errors = {};
  
  if (!data.name || !data.name.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!data.quantity || parseFloat(data.quantity) <= 0) {
    errors.quantity = 'Quantity must be greater than 0';
  }
  
  if (!data.unit) {
    errors.unit = 'Please select a unit';
  }
  
  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }
  
  return { valid: true, errors: {} };
};
```

### Async Validation

```jsx
const validateStep = async (data) => {
  // Check if name already exists
  const exists = await checkIfNameExists(data.name);
  
  if (exists) {
    return { 
      valid: false, 
      errors: { name: 'This name already exists' } 
    };
  }
  
  return { valid: true, errors: {} };
};
```

### General Error Messages

Use `_general` key for step-level errors:

```jsx
const validateStep = (data) => {
  if (!data.foodId && !data.name) {
    return { 
      valid: false, 
      errors: { _general: 'Please select a food or enter a name' } 
    };
  }
  return { valid: true, errors: {} };
};
```

## Examples

### Example 1: Simple 2-Step Wizard

```jsx
export function SimpleWizard({ onComplete, onCancel }) {
  const steps = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      component: BasicInfoStep,
      validate: (data) => {
        if (!data.name) {
          return { valid: false, errors: { name: 'Name is required' } };
        }
        return { valid: true, errors: {} };
      }
    },
    {
      id: 'details',
      title: 'Details',
      component: DetailsStep,
      optional: true
    }
  ];

  const handleComplete = (data) => {
    onComplete({
      name: data.name,
      details: data.details || null
    });
  };

  return (
    <Wizard
      steps={steps}
      initialData={{}}
      onComplete={handleComplete}
      onCancel={onCancel}
      title="Simple Wizard"
    />
  );
}
```

### Example 2: Edit Mode Wizard

```jsx
export function EditWizard({ item, onComplete, onCancel }) {
  const steps = [
    {
      id: 'edit-basic',
      title: 'Edit Information',
      component: EditStep,
      validate: (data) => {
        if (!data.name) {
          return { valid: false, errors: { name: 'Name is required' } };
        }
        return { valid: true, errors: {} };
      }
    }
  ];

  // Pre-populate with existing data
  const initialData = {
    name: item.name,
    description: item.description
  };

  const handleComplete = async (data) => {
    const updated = {
      ...item,
      name: data.name,
      description: data.description
    };
    
    await saveItem(updated);
    onComplete();
  };

  return (
    <Wizard
      steps={steps}
      initialData={initialData}
      onComplete={handleComplete}
      onCancel={onCancel}
      title="Edit Item"
    />
  );
}
```

### Example 3: Wizard with Dynamic Steps

```jsx
export function DynamicWizard({ onComplete, onCancel }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const baseSteps = [
    {
      id: 'basic',
      title: 'Basic',
      component: BasicStep,
      validate: (data) => ({ valid: true, errors: {} })
    }
  ];

  const advancedStep = {
    id: 'advanced',
    title: 'Advanced',
    component: AdvancedStep,
    optional: true
  };

  const steps = showAdvanced 
    ? [...baseSteps, advancedStep] 
    : baseSteps;

  return (
    <Wizard
      steps={steps}
      initialData={{}}
      onComplete={onComplete}
      onCancel={onCancel}
      title="Dynamic Wizard"
    />
  );
}
```

## Best Practices

### 1. Keep Steps Focused

Each step should focus on a single logical group of related fields.

✅ Good:
```jsx
// Step 1: Basic Info (name, description)
// Step 2: Measurements (quantity, unit)
// Step 3: Tags (optional)
```

❌ Bad:
```jsx
// Step 1: Everything (name, quantity, unit, tags, notes, etc.)
```

### 2. Make Optional Steps Clear

Mark optional steps explicitly and consider putting them at the end.

```jsx
{
  id: 'tags',
  title: 'Tags & Notes',
  component: TagsStep,
  optional: true  // Clearly marked as optional
}
```

### 3. Validate Only Required Fields

Don't validate optional fields unless they have a value.

```jsx
const validateStep = (data) => {
  const errors = {};
  
  // Required field
  if (!data.name) {
    errors.name = 'Name is required';
  }
  
  // Optional field - only validate if provided
  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  return Object.keys(errors).length > 0
    ? { valid: false, errors }
    : { valid: true, errors: {} };
};
```

### 4. Clear Errors on Field Update

The wizard automatically clears errors for fields that are updated. Ensure your field names match the error keys.

```jsx
// Error key
errors.quantity = 'Quantity is required';

// Field name must match
updateData({ quantity: newValue });  // Clears errors.quantity
```

### 5. Provide Helpful Error Messages

Be specific about what's wrong and how to fix it.

✅ Good:
```jsx
errors.quantity = 'Quantity must be greater than 0';
errors.email = 'Please enter a valid email address';
```

❌ Bad:
```jsx
errors.quantity = 'Invalid';
errors.email = 'Error';
```

### 6. Use Appropriate Input Types

Use semantic HTML input types for better UX and validation.

```jsx
<input type="number" min="0" step="0.1" />  // For quantities
<input type="email" />                       // For emails
<input type="tel" />                         // For phone numbers
```

### 7. Handle Async Operations

Show loading states during async operations.

```jsx
const handleComplete = async (data) => {
  setIsLoading(true);
  try {
    await saveData(data);
    onComplete();
  } catch (error) {
    setErrors({ _general: 'Failed to save. Please try again.' });
  } finally {
    setIsLoading(false);
  }
};
```

### 8. Preserve Data on Navigation

The wizard automatically preserves form data when navigating between steps. Don't reset data unless intentional.

### 9. Use Memoization for Performance

Memoize expensive computations in step components.

```jsx
const filteredItems = useMemo(() => 
  items.filter(item => item.name.includes(searchQuery)),
  [items, searchQuery]
);
```

### 10. Test Keyboard Navigation

Ensure your wizard works with keyboard only:
- Tab through all focusable elements
- Enter to proceed to next step
- Escape to cancel
- Focus management on step changes

---

## Additional Resources

- See `AddFoodToMealWizard.jsx` for a complete 4-step wizard example
- See `EditFoodInMealWizard.jsx` for edit mode with pre-populated data
- See `FoodLibraryWizard.jsx` for create/edit mode handling
- Check `wizard-steps/` folder for reusable step component examples
