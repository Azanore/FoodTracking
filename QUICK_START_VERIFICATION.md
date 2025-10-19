# Quick Start: Ingredient Verification

## Run Verification in 3 Steps

### 1. Start the app
```bash
npm run dev
```

### 2. Open verification view
- Click the **flask icon (🧪)** in the sidebar

### 3. Run tests
- Click **"Run Verification Tests"** button
- Wait for results (should take < 1 second)

## Expected Results

```
✅ ALL TESTS PASSED

✅ Test 1: Seeded Ingredients Accessible
   Found X ingredients
   Sample: Egg, Chicken, Lamb, Beef, Sardines

✅ Test 2: Auto-Create Ingredient Functionality  
   Created new ingredient

✅ Test 3: Ingredient Persistence
   All checks passed
```

## What's Being Tested

1. **Seeded ingredients** - Verifies ingredients from `seedData.json` are accessible
2. **Auto-create** - Tests creating new ingredients from food form
3. **Persistence** - Confirms ingredients save correctly to localStorage

## Requirements Verified

- ✅ Requirement 2.2: Auto-create ingredient functionality
- ✅ Requirement 2.3: Ingredients persist correctly

## Files Created

- `src/utils/verifyIngredients.js` - Core verification logic
- `src/views/VerifyIngredientsView.jsx` - UI for running tests
- `test-ingredients.html` - Standalone test page
- Documentation files (this file, TASK_14_SUMMARY.md, etc.)

## Troubleshooting

**No ingredients found?**
- Database may not be seeded
- Check browser console for errors
- Try clearing localStorage and refreshing

**Tests fail?**
- Check browser console for detailed errors
- Verify localStorage is enabled
- Ensure app is running on dev server

## Next Steps

After verification passes:
1. Review TASK_14_SUMMARY.md for detailed results
2. Optionally remove temporary verification components
3. Keep `src/utils/verifyIngredients.js` for future testing
4. Move to next task in implementation plan
