import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Download,
  MapPin,
  Pencil,
  RefreshCw,
  Sparkles,
  Ticket,
  Wallet,
  Wind,
} from 'lucide-react';
import type { TripPlannerResult } from '../services/gemini';
import type { PlanningFormValues } from './PlanningModal';

interface PlannerResultPanelProps {
  loading: boolean;
  error: string | null;
  result: TripPlannerResult | null;
  plannerForm: PlanningFormValues;
  onRetry: () => void;
  onOpenPlanner: () => void;
  onExportPdf: () => void;
}

export default function PlannerResultPanel({
  loading,
  error,
  result,
  plannerForm,
  onRetry,
  onOpenPlanner,
  onExportPdf,
}: PlannerResultPanelProps) {
  if (loading) {
    return (
      <div className="rounded-[30px] border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.2)] backdrop-blur-2xl sm:p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Building your itinerary</p>
            <p className="text-sm text-slate-500">The planner is generating a tailored travel experience.</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-16 animate-pulse rounded-[22px] bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[30px] border border-rose-200/70 bg-rose-50/80 p-6 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.18)] backdrop-blur-2xl sm:p-8">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-rose-100 p-3 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-rose-900">We hit a snag while planning</p>
            <p className="mt-2 text-sm leading-7 text-rose-700">{error}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onRetry} className="button-primary px-4 py-2.5 text-sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Try again
          </button>
          <button type="button" onClick={onOpenPlanner} className="button-secondary px-4 py-2.5 text-sm">
            <Pencil className="mr-2 h-4 w-4" /> Edit plan
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-[30px] border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.2)] backdrop-blur-2xl sm:p-8">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-ink">Your planner workspace is ready</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Generate a trip plan to see a polished itinerary, budget breakdown, packing checklist, and travel tips here.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
          <p className="text-sm font-semibold text-slate-800">Current brief</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              plannerForm.destination || 'Destination',
              plannerForm.month || 'Month',
              `${plannerForm.travelers || 1} travelers`,
            ].map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onOpenPlanner} className="button-primary px-4 py-2.5 text-sm">
            <Sparkles className="mr-2 h-4 w-4" /> Start planning
          </button>
          <button type="button" onClick={onRetry} className="button-secondary px-4 py-2.5 text-sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.2)] backdrop-blur-2xl sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
            <Ticket className="h-3.5 w-3.5" /> Trip overview
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink">{result.tripTitle}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{result.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onOpenPlanner} className="button-secondary px-3.5 py-2 text-sm">
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </button>
          <button type="button" onClick={onExportPdf} className="button-secondary px-3.5 py-2 text-sm">
            <Download className="mr-2 h-4 w-4" /> Export
          </button>
          <button type="button" onClick={onRetry} className="button-primary px-3.5 py-2 text-sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <MapPin className="h-4 w-4 text-primary" /> Destination
          </div>
          <p className="mt-2 text-sm text-slate-600">{result.destination}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Wallet className="h-4 w-4 text-primary" /> Budget
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {result.budgetBreakdown.reduce((total, item) => total + item.estimate, 0).toLocaleString()} total estimate
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Wind className="h-4 w-4 text-primary" /> Transport
          </div>
          <p className="mt-2 text-sm text-slate-600">{result.recommendedTransport}</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-slate-200/70 bg-white/80 p-5">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h4 className="text-lg font-semibold text-ink">Day-by-day itinerary</h4>
          </div>
          <div className="mt-4 space-y-3">
            {result.dailyItinerary.map((day) => (
              <div key={day.day} className="rounded-[22px] border border-slate-200/70 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">Day {day.day} · {day.title}</p>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                    {day.day === 1 ? 'Kickoff' : 'Explore'}
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                  <p><span className="font-semibold text-slate-800">Morning:</span> {day.morning}</p>
                  <p><span className="font-semibold text-slate-800">Afternoon:</span> {day.afternoon}</p>
                  <p><span className="font-semibold text-slate-800">Evening:</span> {day.evening}</p>
                  <p><span className="font-semibold text-slate-800">Dinner:</span> {day.dinner}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-5">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <h4 className="text-lg font-semibold text-ink">Budget breakdown</h4>
            </div>
            <div className="mt-4 space-y-3">
              {result.budgetBreakdown.map((item) => (
                <div key={item.category} className="rounded-[20px] border border-slate-200/70 bg-slate-50/80 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-800">{item.category}</p>
                    <p className="text-sm font-semibold text-primary">${item.estimate.toLocaleString()}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h4 className="text-lg font-semibold text-ink">Packing checklist</h4>
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-600">
              {result.packingChecklist.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-primary/8 to-accent/8 p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h4 className="text-lg font-semibold text-ink">Smart tips</h4>
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-600">
              {result.smartTips.map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
