// File purpose: Display wizard usage analytics for feedback collection
// Related: wizardAnalytics.js provides the data
// Should not include: External analytics services

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import { getWizardStatistics, exportMetrics, clearMetrics } from '../utils/wizardAnalytics';

/**
 * WizardAnalyticsDashboard - Display wizard usage metrics
 * 
 * Shows completion rates, average times, and pain points to help identify
 * areas for improvement in the wizard UX.
 */
export function WizardAnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const refreshStats = () => {
    setStats(getWizardStatistics());
  };

  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    const data = exportMetrics();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wizard-metrics-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('Clear all wizard metrics? This cannot be undone.')) {
      clearMetrics();
      refreshStats();
    }
  };

  if (!stats) return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        title="Toggle wizard analytics"
      >
        <BarChart3 size={20} />
      </button>

      {/* Dashboard panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 w-96 max-h-[600px] bg-white border-2 border-purple-600 rounded-lg shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="bg-purple-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} />
              <h3 className="font-semibold">Wizard Analytics</h3>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-purple-200 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[500px]">
            {/* Overall stats */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <TrendingUp size={14} />
                Overall Performance
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-xs text-gray-600">Total Sessions</div>
                  <div className="text-xl font-bold text-blue-700">{stats.totalSessions}</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs text-gray-600">Completions</div>
                  <div className="text-xl font-bold text-green-700">{stats.totalCompletions}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-xs text-gray-600">Completion Rate</div>
                  <div className="text-xl font-bold text-purple-700">{stats.completionRate}</div>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <div className="text-xs text-gray-600">Avg Time</div>
                  <div className="text-xl font-bold text-orange-700">{stats.avgCompletionTime}</div>
                </div>
              </div>
            </div>

            {/* By wizard type */}
            {Object.keys(stats.byType).length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">By Wizard Type</h4>
                <div className="space-y-2">
                  {Object.entries(stats.byType).map(([type, data]) => (
                    <div key={type} className="bg-gray-50 p-3 rounded">
                      <div className="text-sm font-medium text-gray-800 mb-1">{type}</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Sessions:</span>
                          <span className="ml-1 font-semibold">{data.sessions}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Completed:</span>
                          <span className="ml-1 font-semibold text-green-600">{data.completions}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Rate:</span>
                          <span className="ml-1 font-semibold text-purple-600">{data.completionRate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pain points */}
            {Object.keys(stats.painPoints).length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  Pain Points (Cancellation Hotspots)
                </h4>
                <div className="space-y-1">
                  {Object.entries(stats.painPoints)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([location, count]) => (
                      <div key={location} className="bg-red-50 p-2 rounded flex justify-between items-center">
                        <span className="text-xs text-gray-700">{location}</span>
                        <span className="text-xs font-bold text-red-600">{count} cancellations</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={refreshStats}
                className="flex-1 px-3 py-2 text-xs font-medium text-purple-600 border border-purple-600 rounded hover:bg-purple-50 transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="flex-1 px-3 py-2 text-xs font-medium text-white bg-purple-600 rounded hover:bg-purple-700 transition-colors"
              >
                Export JSON
              </button>
              <button
                onClick={handleClear}
                className="flex-1 px-3 py-2 text-xs font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
              >
                Clear Data
              </button>
            </div>

            {/* Info */}
            <div className="mt-3 p-2 bg-blue-50 rounded">
              <p className="text-xs text-blue-700">
                💡 Metrics are stored in memory and reset on page reload. Export data regularly for analysis.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
