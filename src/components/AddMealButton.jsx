// File purpose: Button to trigger adding a new meal
// Related: TodayView.jsx uses this, MealForm.jsx for the form
// Should not include: Form logic, database operations

import { Plus } from 'lucide-react';
import { Button } from './ui/Button';

/**
 * AddMealButton component - triggers meal creation
 * @param {Object} props
 * @param {Function} props.onClick - Click handler
 */
export function AddMealButton({ onClick }) {
  return (
    <Button onClick={onClick} variant="primary">
      <div className="flex items-center gap-[var(--spacing-sm)]">
        <Plus size={18} />
        <span>Add Meal</span>
      </div>
    </Button>
  );
}
