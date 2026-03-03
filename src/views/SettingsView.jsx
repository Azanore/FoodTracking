// File purpose: Settings and preferences — data export/import, app configuration
// Related: App.jsx renders this, db.js for data operations
// Should not include: Statistics, daily logging

import { useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle, Trash2, X } from 'lucide-react';

export function SettingsView() {
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState('prompt'); // 'prompt' | 'confirm'
  const [confirmText, setConfirmText] = useState('');

  // Export all localStorage data as JSON
  const handleExport = () => {
    try {
      const data = {};
      const relevantPrefixes = ['day_', 'food_', 'drink_', 'ing_', 'user_preferences', 'app_seeded'];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        // Only export food diary related data
        const isRelevant = relevantPrefixes.some(prefix => key.startsWith(prefix)) || key === 'user_preferences' || key === 'app_seeded';
        if (!isRelevant) continue;

        const value = localStorage.getItem(key);
        try {
          // Parse JSON strings back to objects
          data[key] = JSON.parse(value);
        } catch {
          // If not JSON, store as-is (e.g., "app_seeded": "true")
          data[key] = value;
        }
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `food-diary-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Data exported successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: `Export failed: ${err.message}` });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  // Import JSON and restore to localStorage
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        // Validate it's an object
        if (typeof data !== 'object' || data === null) {
          throw new Error('Invalid backup file format');
        }

        // Clear existing data and restore
        localStorage.clear();
        Object.keys(data).forEach(key => {
          const value = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
          localStorage.setItem(key, value);
        });

        setMessage({ type: 'success', text: `Data imported successfully! ${Object.keys(data).length} items restored.` });
        setTimeout(() => {
          setMessage(null);
          window.location.reload(); // Refresh to load new data
        }, 2000);
      } catch (err) {
        setMessage({ type: 'error', text: `Import failed: ${err.message}` });
        setTimeout(() => setMessage(null), 5000);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // Reset all data
  const handleResetClick = () => {
    setShowResetModal(true);
    setResetStep('prompt');
    setConfirmText('');
  };

  const handleExportAndReset = () => {
    handleExport();
    setResetStep('confirm');
  };

  const handleResetWithoutExport = () => {
    setResetStep('confirm');
  };

  const handleConfirmReset = () => {
    if (confirmText !== 'DELETE') return;

    localStorage.clear();

    // Auto-seed starter pack after reset
    import('../utils/seedDatabase').then(({ seedDatabase }) => {
      seedDatabase();
      setMessage({ type: 'success', text: 'All data has been reset. Starter pack loaded.' });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    });
  };

  const closeResetModal = () => {
    setShowResetModal(false);
    setResetStep('prompt');
    setConfirmText('');
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <h1 className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] mb-6">
        Settings
      </h1>

      {/* Message banner */}
      {message && (
        <div className={`flex items-center gap-2 p-3 mb-6 rounded-lg text-sm ${message.type === 'success'
          ? 'bg-green-50 text-green-800 border border-green-200'
          : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Data Management Section */}
      <section className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] p-[var(--spacing-card-padding)] mb-6">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Data Management</h2>

        <div className="space-y-3">
          {/* Export */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-1">Export Data</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Download all your data as a JSON file. Use this to backup your food diary.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-all shrink-0"
            >
              <Download size={15} />
              Export
            </button>
          </div>

          {/* Import */}
          <div className="flex items-start justify-between gap-4 pt-3 border-t border-[var(--color-border-primary)]">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-1">Import Data</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Restore data from a backup file. This will replace all current data.
              </p>
            </div>
            <label className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] rounded-lg hover:bg-[var(--color-hover-bg)] transition-all cursor-pointer shrink-0">
              <Upload size={15} />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset All Data */}
          <div className="flex items-start justify-between gap-4 pt-3 border-t border-[var(--color-border-primary)]">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-1">Reset All Data</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Permanently delete all your data and start fresh. This cannot be undone.
              </p>
            </div>
            <button
              onClick={handleResetClick}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-[var(--color-danger)] text-white rounded-lg hover:opacity-90 transition-all shrink-0"
            >
              <Trash2 size={15} />
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeResetModal}>
          <div className="bg-[var(--color-bg-primary)] rounded-[var(--radius-md)] max-w-md w-full border border-[var(--color-border-primary)] shadow-lg" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-primary)]">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                {resetStep === 'prompt' ? 'Export Before Reset?' : 'Confirm Reset'}
              </h2>
              <button
                onClick={closeResetModal}
                className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-hover-bg)] rounded transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {resetStep === 'prompt' ? (
                <>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                    Would you like to export your data before resetting? This will download a backup file.
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleExportAndReset}
                      className="w-full px-4 py-2.5 text-sm font-semibold bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-all"
                    >
                      Export & Reset
                    </button>
                    <button
                      onClick={handleResetWithoutExport}
                      className="w-full px-4 py-2.5 text-sm font-semibold bg-[var(--color-danger)] text-white rounded-lg hover:opacity-90 transition-all"
                    >
                      Reset Without Export
                    </button>
                    <button
                      onClick={closeResetModal}
                      className="w-full px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)] rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                    This will permanently delete all your data. Type <span className="font-semibold text-[var(--color-danger)]">DELETE</span> to confirm.
                  </p>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type DELETE"
                    className="w-full px-3 py-2.5 md:py-2 text-sm border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none bg-[var(--color-bg-secondary)] mb-4"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleConfirmReset}
                      disabled={confirmText !== 'DELETE'}
                      className="flex-1 px-4 py-2.5 md:py-2 text-sm font-semibold bg-[var(--color-danger)] text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Reset
                    </button>
                    <button
                      onClick={closeResetModal}
                      className="flex-1 px-4 py-2.5 md:py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)] rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-[var(--color-text-secondary)] italic">
        More settings coming soon: preferences, default meal times, and app configuration.
      </p>
    </div>
  );
}
