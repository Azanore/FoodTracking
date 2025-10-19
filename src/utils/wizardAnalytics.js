// File purpose: Track wizard usage metrics for feedback collection
// Related: Wizard components use this to log events
// Should not include: External analytics services, PII

// In-memory storage for wizard metrics
const metrics = {
  sessions: [],
  completions: [],
  cancellations: [],
  stepDurations: []
};

/**
 * Start tracking a wizard session
 * @param {string} wizardType - Type of wizard (e.g., 'AddFoodToMeal', 'EditFoodInMeal', 'FoodLibrary')
 * @returns {string} sessionId - Unique session identifier
 */
export function startWizardSession(wizardType) {
  const sessionId = `${wizardType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  metrics.sessions.push({
    sessionId,
    wizardType,
    startTime: Date.now(),
    steps: []
  });
  
  return sessionId;
}

/**
 * Track step navigation in wizard
 * @param {string} sessionId - Session identifier
 * @param {number} stepIndex - Current step index
 * @param {string} stepId - Step identifier
 */
export function trackWizardStep(sessionId, stepIndex, stepId) {
  const session = metrics.sessions.find(s => s.sessionId === sessionId);
  if (!session) return;
  
  session.steps.push({
    stepIndex,
    stepId,
    timestamp: Date.now()
  });
}

/**
 * Track wizard completion
 * @param {string} sessionId - Session identifier
 */
export function trackWizardCompletion(sessionId) {
  const session = metrics.sessions.find(s => s.sessionId === sessionId);
  if (!session) return;
  
  const duration = Date.now() - session.startTime;
  
  metrics.completions.push({
    sessionId,
    wizardType: session.wizardType,
    duration,
    stepCount: session.steps.length,
    completedAt: Date.now()
  });
}

/**
 * Track wizard cancellation
 * @param {string} sessionId - Session identifier
 * @param {number} currentStep - Step where user cancelled
 * @param {boolean} hadChanges - Whether form had unsaved changes
 */
export function trackWizardCancellation(sessionId, currentStep, hadChanges) {
  const session = metrics.sessions.find(s => s.sessionId === sessionId);
  if (!session) return;
  
  const duration = Date.now() - session.startTime;
  
  metrics.cancellations.push({
    sessionId,
    wizardType: session.wizardType,
    currentStep,
    hadChanges,
    duration,
    cancelledAt: Date.now()
  });
}

/**
 * Get wizard usage statistics
 * @returns {Object} Statistics object
 */
export function getWizardStatistics() {
  const totalSessions = metrics.sessions.length;
  const totalCompletions = metrics.completions.length;
  const totalCancellations = metrics.cancellations.length;
  
  const completionRate = totalSessions > 0 
    ? (totalCompletions / totalSessions * 100).toFixed(1)
    : 0;
  
  const avgCompletionTime = metrics.completions.length > 0
    ? Math.round(metrics.completions.reduce((sum, c) => sum + c.duration, 0) / metrics.completions.length / 1000)
    : 0;
  
  // Group by wizard type
  const byType = {};
  metrics.sessions.forEach(session => {
    if (!byType[session.wizardType]) {
      byType[session.wizardType] = {
        sessions: 0,
        completions: 0,
        cancellations: 0
      };
    }
    byType[session.wizardType].sessions++;
  });
  
  metrics.completions.forEach(completion => {
    if (byType[completion.wizardType]) {
      byType[completion.wizardType].completions++;
    }
  });
  
  metrics.cancellations.forEach(cancellation => {
    if (byType[cancellation.wizardType]) {
      byType[cancellation.wizardType].cancellations++;
    }
  });
  
  // Calculate completion rates by type
  Object.keys(byType).forEach(type => {
    const stats = byType[type];
    stats.completionRate = stats.sessions > 0
      ? (stats.completions / stats.sessions * 100).toFixed(1)
      : 0;
  });
  
  // Find pain points (steps where users cancel most)
  const cancellationsByStep = {};
  metrics.cancellations.forEach(cancellation => {
    const key = `${cancellation.wizardType}-step${cancellation.currentStep}`;
    cancellationsByStep[key] = (cancellationsByStep[key] || 0) + 1;
  });
  
  return {
    totalSessions,
    totalCompletions,
    totalCancellations,
    completionRate: `${completionRate}%`,
    avgCompletionTime: `${avgCompletionTime}s`,
    byType,
    painPoints: cancellationsByStep
  };
}

/**
 * Export metrics data for analysis
 * @returns {Object} Raw metrics data
 */
export function exportMetrics() {
  return {
    ...metrics,
    exportedAt: new Date().toISOString()
  };
}

/**
 * Clear all metrics (useful for testing)
 */
export function clearMetrics() {
  metrics.sessions = [];
  metrics.completions = [];
  metrics.cancellations = [];
  metrics.stepDurations = [];
}

/**
 * Log metrics to console (for development)
 */
export function logMetrics() {
  console.log('=== Wizard Usage Metrics ===');
  console.log(getWizardStatistics());
  console.log('\nRaw data available via exportMetrics()');
}
