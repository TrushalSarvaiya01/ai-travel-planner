import { Sparkles, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/40 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[28px] border border-white/70 bg-white/90 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.45)] backdrop-blur-2xl sm:max-h-[92vh] sm:rounded-[32px]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary sm:text-xs">
              Trip planning brief
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl">Start Planning</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-ink"
            aria-label="Close planning form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>

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

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <Field label="Days" error={fieldErrors.durationDays}>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    inputMode="numeric"
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
                    inputMode="numeric"
                    value={values.travelers}
                    onChange={(event) => onChange('travelers', event.target.value)}
                    className={inputClass(fieldErrors.travelers)}
                  />
                </Field>

                <Field label="Budget $" error={fieldErrors.budget}>
                  <input
                    type="number"
                    min="1"
                    inputMode="numeric"
                    value={values.budget}
                    onChange={(event) => onChange('budget', event.target.value)}
                    className={inputClass(fieldErrors.budget)}
                  />
                </Field>
              </div>

              <Field
                label="Interests"
                error={fieldErrors.interests}
                hint="Comma-separated keywords help Gemini personalize the plan."
              >
                <textarea
                  rows={3}
                  value={values.interests}
                  onChange={(event) => onChange('interests', event.target.value)}
                  placeholder="e.g. food, skyline views, local culture"
                  className={inputClass(fieldErrors.interests)}
                />
              </Field>

              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible">
                {interestSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => onChange('interests', suggestion)}
                    className="shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:border-primary/30 hover:text-primary sm:text-sm"
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

              <div className="sticky bottom-0 -mx-4 mt-1 border-t border-slate-200/70 bg-white/95 px-4 py-3 backdrop-blur-xl sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:pt-2">
                  <button type="submit" disabled={loading} className="button-primary w-full sm:w-auto">
                    {loading ? 'Planning...' : 'Generate itinerary'}
                  </button>
                  <button type="button" onClick={onClose} className="button-secondary w-full sm:w-auto">
                    Cancel
                  </button>
                </div>
              </div>
            </form>

            <aside className="hidden rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,rgba(79,70,229,0.08),rgba(255,255,255,0.84))] p-5 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.18)] lg:block">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-primary">How it works</p>
              <h4 className="mt-2 text-xl font-semibold tracking-tight text-ink">A precise prompt for Gemini</h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Your trip brief is validated locally, then sent to Gemini to generate a structured itinerary, budget
                split, packing checklist, and practical travel tips.
              </p>

              <div className="mt-6 grid gap-3">
                {[
                  'Input validation happens before any request is sent.',
                  'Automatic retries handle temporary API or network issues.',
                  'The result appears in the Planner section on this page.',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[18px] border border-slate-200/80 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-sm"
                  >
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
    'w-full rounded-[16px] border bg-white/90 px-3.5 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 sm:rounded-[18px] sm:px-4',
    hasError ? 'border-rose-300' : 'border-slate-200',
  ].join(' ');
}
