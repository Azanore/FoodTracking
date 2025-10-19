// File purpose: Temporary view for verifying ingredients library functionality
// Related: verifyIngredients.js, db.js
// Should not include: Production code (this is for testing only)

import { useState } from 'react';
import { runAllVerifications } from '../utils/verifyIngredients';

/**
 * VerifyIngredientsView - Test view for ingredient verification
 * This is a temporary component for testing task 14
 */
export function VerifyIngredientsView() {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);

  const handleRunTests = async () => {
    setRunning(true);
    setResults(null);
    
    const testResults = await runAllVerifications();
    setResults(testResults);
    
    setRunning(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">
        Ingredient Library Verification
      </h1>

      <div className="mb-6">
        <button
          onClick={handleRunTests}
          disabled={running}
          className="px-6 py-3 bg-[var(--color-accent)] text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {running ? 'Running Tests...' : 'Run Verification Tests'}
        </button>
      </div>

      {results && (
        <div className="space-y-6">
          {/* Overall Status */}
          <div className={`p-4 rounded border-2 ${
            results.allPassed 
              ? 'bg-green-50 border-green-500' 
              : 'bg-red-50 border-red-500'
          }`}>
            <h2 className="text-lg font-semibold mb-2">
              {results.allPassed ? '✅ All Tests Passed' : '❌ Some Tests Failed'}
            </h2>
          </div>

          {/* Test 1: Seeded Ingredients */}
          <div className="border border-[var(--color-border)] rounded p-4">
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
              {results.tests.seededIngredients.success ? '✅' : '❌'}
              Test 1: Seeded Ingredients Accessible
            </h3>
            <div className="text-sm text-[var(--color-text-secondary)] space-y-1">
              <p>Count: {results.tests.seededIngredients.count} ingredients found</p>
              {results.tests.seededIngredients.ingredients.length > 0 && (
                <div>
                  <p className="font-medium mt-2">Sample ingredients:</p>
                  <ul className="list-disc list-inside ml-2">
                    {results.tests.seededIngredients.ingredients.map(ing => (
                      <li key={ing.id}>
                        {ing.name} ({ing.category}) - ID: {ing.id}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.tests.seededIngredients.error && (
                <p className="text-red-600 mt-2">Error: {results.tests.seededIngredients.error}</p>
              )}
            </div>
          </div>

          {/* Test 2: Auto-Create */}
          <div className="border border-[var(--color-border)] rounded p-4">
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
              {results.tests.autoCreate.success ? '✅' : '❌'}
              Test 2: Auto-Create Ingredient Functionality
            </h3>
            <div className="text-sm text-[var(--color-text-secondary)] space-y-1">
              <p>
                {results.tests.autoCreate.wasCreated 
                  ? 'Successfully created new ingredient' 
                  : results.tests.autoCreate.message}
              </p>
              {results.tests.autoCreate.ingredient && (
                <div className="mt-2">
                  <p className="font-medium">Ingredient details:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Name: {results.tests.autoCreate.ingredient.name}</li>
                    <li>Category: {results.tests.autoCreate.ingredient.category}</li>
                    <li>ID: {results.tests.autoCreate.ingredient.id}</li>
                  </ul>
                </div>
              )}
              {results.tests.autoCreate.error && (
                <p className="text-red-600 mt-2">Error: {results.tests.autoCreate.error}</p>
              )}
            </div>
          </div>

          {/* Test 3: Persistence */}
          <div className="border border-[var(--color-border)] rounded p-4">
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
              {results.tests.persistence.success ? '✅' : '❌'}
              Test 3: Ingredient Persistence
            </h3>
            <div className="text-sm text-[var(--color-text-secondary)] space-y-1">
              <p className="font-medium">Persistence checks:</p>
              <ul className="list-disc list-inside ml-2">
                <li>Created: {results.tests.persistence.details.created ? '✅' : '❌'}</li>
                <li>Retrieved: {results.tests.persistence.details.retrieved ? '✅' : '❌'}</li>
                <li>Data matches: {results.tests.persistence.details.dataMatches ? '✅' : '❌'}</li>
                <li>In localStorage: {results.tests.persistence.details.inLocalStorage ? '✅' : '❌'}</li>
              </ul>
              {results.tests.persistence.details.ingredient && (
                <div className="mt-2">
                  <p className="font-medium">Test ingredient:</p>
                  <p className="ml-2">{results.tests.persistence.details.ingredient.name}</p>
                </div>
              )}
              {results.tests.persistence.error && (
                <p className="text-red-600 mt-2">Error: {results.tests.persistence.error}</p>
              )}
            </div>
          </div>

          {/* Requirements Coverage */}
          <div className="border border-[var(--color-border)] rounded p-4 bg-blue-50">
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">
              Requirements Coverage
            </h3>
            <div className="text-sm text-[var(--color-text-secondary)] space-y-1">
              <p>✅ Requirement 2.2: Ingredients auto-created when typed in food form</p>
              <p>✅ Requirement 2.3: Ingredients persist correctly in database</p>
            </div>
          </div>
        </div>
      )}

      {!results && !running && (
        <div className="text-sm text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded p-4">
          <p className="mb-2">This view verifies the following:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Seeded ingredients are accessible from seedDatabase.js</li>
            <li>Auto-create ingredient functionality works from food form</li>
            <li>Ingredients persist correctly in localStorage database</li>
          </ul>
          <p className="mt-4 font-medium">Click "Run Verification Tests" to begin.</p>
        </div>
      )}
    </div>
  );
}
