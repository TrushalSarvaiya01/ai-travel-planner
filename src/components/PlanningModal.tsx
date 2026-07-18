import { X } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { TripPlannerInput } from '../services/gemini';

export type PlanningFormValues = {
  origin: string;
  destination: string;
  travelStyle: TripPlannerInput['travelStyle'];
  travelers: string;
  durationDays: string;
  budget: string;
  month: string;
  interests: string;
};

interface PlanningModalProps {
  open: boolean;
  loading: boolean;
  error: string | null;
  values: PlanningFormValues;
  fieldErrors: Partial<Record<keyof TripPlannerInput, string>>;
  onChange: (field: keyof TripPlannerInput, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const monthOptions = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const travelStyles = ['Relaxed', 'Balanced', 'Fast-paced'] as const;

export default function PlanningModal({
  open,
  loading,
  error,
  values,
  fieldErrors,
  onChange,
  onClose,
  onSubmit,
}: PlanningModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const interestSuggestions = useMemo(
    () => ['culture, museums, food', 'beach, relaxation, sunsets', 'adventure, hiking, photography'],
    [],
  );

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/70 bg-white/75 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Trip planning brief</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Start Planning</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-ink"
            aria-label="Close planning form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-86px)] overflow-y-auto px-6 py-6">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
              }}
            >
              <Field label="Departure city" error={fieldErrors.origin}>
                <input
                  value={values.origin}
                  onChange={(event) => onChange('origin', event.target.value)}
                  placeholder="e.g. Ahmedabad"
                  className={inputClass(fieldErrors.origin)}
                />
              </Field>

              <Field label="Destination" error={fieldErrors.destination}>
                <input
                  value={values.destination}
                  onChange={(event) => onChange('destination', event.target.value)}
                  placeholder="e.g. Tokyo"
                  className={inputClass(fieldErrors.destination)}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Travel month" error={fieldErrors.month}>
                  <select
                    value={values.month}
                    onChange={(event) => onChange('month', event.target.value)}
                    className={inputClass(fieldErrors.month)}
                  >
                    <option value="">Select month</option>
                    {monthOptions.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Travel style" error={fieldErrors.travelStyle}>
                  <select
                    value={values.travelStyle}
                    onChange={(event) => onChange('travelStyle', event.target.value)}
                    className={inputClass(fieldErrors.travelStyle)}
                  >
                    {travelStyles.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Days" error={fieldErrors.durationDays}>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={values.durationDays}
                    onChange={(event) => onChange('durationDays', event.target.value)}
                    className={inputClass(fieldErrors.durationDays)}
                  />
                </Field>

                <Field label="Travelers" error={fieldErrors.travelers}>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={values.travelers}
                    onChange={(event) => onChange('travelers', event.target.value)}
                    className={inputClass(fieldErrors.travelers)}
                  />
                </Field>

                <Field label="Budget (USD)" error={fieldErrors.budget}>
                  <input
                    type="number"
                    min="1"
                    value={values.budget}
                    onChange={(event) => onChange('budget', event.target.value)}
                    className={inputClass(fieldErrors.budget)}
                  />
                </Field>
              </div>

              <Field label="Interests" error={fieldErrors.interests} hint="Comma-separated keywords help Gemini personalize the plan.">
                <textarea
                  rows={4}
                  value={values.interests}
                  onChange={(event) => onChange('interests', event.target.value)}
                  placeholder="e.g. food, skyline views, local culture"
                  className={inputClass(fieldErrors.interests)}
                />
              </Field>

              <div className="flex flex-wrap gap-3 pt-2">
                {interestSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => onChange('interests', suggestion)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-primary/30 hover:text-primary"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {error ? (
                <div className="rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                <button type="submit" disabled={loading} className="button-primary w-full sm:w-auto">
                  {loading ? 'Planning...' : 'Generate itinerary'}
                </button>
                <button type="button" onClick={onClose} className="button-secondary w-full sm:w-auto">
                  Cancel
                </button>
              </div>
            </form>

            <aside className="rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,rgba(79,70,229,0.08),rgba(255,255,255,0.84))] p-5 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">How it works</p>
              <h4 className="mt-2 text-xl font-semibold tracking-tight text-ink">A precise prompt for Gemini</h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Your trip brief is validated locally, then sent to Gemini 2.5 Flash to generate a structured itinerary,
                budget split, packing checklist, and practical travel tips.
              </p>

              <div className="mt-6 grid gap-3">
                {[
                  'Input validation happens before any request is sent.',
                  'Automatic retries handle temporary API or network issues.',
                  'The result is rendered in the existing result section.',
                ].map((item) => (
                  <div key={item} className="rounded-[18px] border border-slate-200/80 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {hint ? <span className="text-xs leading-5 text-slate-500">{hint}</span> : null}
      {error ? <span className="text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

function inputClass(hasError?: string) {
  return [
    'w-full rounded-[18px] border bg-white/90 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10',
    hasError ? 'border-rose-300' : 'border-slate-200',
  ].join(' ');
}