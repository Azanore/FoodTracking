# Reusable UI Components

This directory contains reusable UI components that follow the app's design system.

## Components

### Button
Styled button with three variants: primary, secondary, and danger.

```jsx
import { Button } from './components/ui';

<Button variant="primary" onClick={handleClick}>Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
```

### Input
Styled input for text, number, time, and textarea types.

```jsx
import { Input } from './components/ui';

<Input 
  label="Name" 
  type="text" 
  value={name} 
  onChange={setName} 
  required 
/>

<Input 
  label="Quantity" 
  type="number" 
  value={quantity} 
  onChange={setQuantity} 
  min={0} 
  step={0.1} 
/>

<Input 
  label="Notes" 
  type="textarea" 
  value={notes} 
  onChange={setNotes} 
  rows={4} 
/>
```

### Select
Styled dropdown for enums and options.

```jsx
import { Select } from './components/ui';

const options = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' }
];

<Select 
  label="Meal Type" 
  value={mealType} 
  onChange={setMealType} 
  options={options} 
  required 
/>
```

### TagInput
Input with badge display for managing tags.

```jsx
import { TagInput } from './components/ui';

<TagInput 
  label="Tags" 
  tags={tags} 
  onChange={setTags} 
  placeholder="Type and press Enter" 
/>
```

## Design System

All components follow these principles:
- Consistent spacing (8px grid)
- CSS variables for colors
- Focus states with accent color ring
- Disabled states with reduced opacity
- Clean, minimal styling with subtle borders
