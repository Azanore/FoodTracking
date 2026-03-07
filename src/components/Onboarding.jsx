// File purpose: First-launch onboarding flow explaining app value.
// Related: App.jsx shows this on first launch, localStorage tracks completion.
// Should not include: Feature tutorials, settings.

import { useState } from 'react';
import { ArrowRight, Calendar, Heart, TrendingUp } from 'lucide-react';

/**
 * Onboarding - 3-step intro shown on first launch
 */
export function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: Calendar,
      title: 'Track What You Eat',
      description: 'Log your meals and drinks throughout the day. Quick and simple.',
      example: '🌅 Breakfast: Eggs, Toast, Coffee\n☕ Lunch: Chicken Salad\n🌙 Dinner: Pasta, Wine',
    },
    {
      icon: Heart,
      title: 'Log How You Feel',
      description: 'Record symptoms and feelings with flexible timing. No exact times needed.',
      example: '💨 Felt bloated after lunch\n😴 Slept well\n🤕 Headache in the afternoon',
    },
    {
      icon: TrendingUp,
      title: 'Find Your Triggers',
      description: 'We analyze patterns and show which foods correlate with your symptoms.',
      example: '🩺 Analysis:\n"Bloated" → Dairy (87%)\n"Headache" → Caffeine (80%)',
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;
  const isLastStep = step === steps.length - 1;
  const isFirstStep = step === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-bg-secondary)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${i === step
                ? 'w-8 bg-[var(--color-accent)]'
                : 'w-2 bg-[var(--color-border-primary)]'
                }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border-primary)] p-8 text-center">

          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-accent)]/10 mb-6">
            <Icon size={32} className="text-[var(--color-accent)]" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-3">
            {currentStep.title}
          </h2>

          {/* Description */}
          <p className="text-[var(--color-text-secondary)] mb-6">
            {currentStep.description}
          </p>

          {/* Example */}
          <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-[var(--color-text-primary)] whitespace-pre-line font-mono">
              {currentStep.example}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {/* Primary action */}
            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-all"
            >
              {isLastStep ? 'Get Started' : 'Next'}
              <ArrowRight size={16} />
            </button>

            {/* Secondary actions */}
            <div className="flex gap-2">
              {!isFirstStep && (
                <button
                  onClick={handleBack}
                  className="flex-1 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-hover-bg)] rounded-lg transition-colors"
                >
                  ← Back
                </button>
              )}
              {isFirstStep && (
                <button
                  onClick={handleSkip}
                  className="flex-1 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-hover-bg)] rounded-lg transition-colors"
                >
                  Skip
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--color-text-secondary)] mt-6">
          Privacy-first • All data stays on your device • Free forever
        </p>
      </div>
    </div>
  );
}
