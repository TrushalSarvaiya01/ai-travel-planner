import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Coins,
  Compass,
  Cpu,
  Files,
  Globe2,
  Hotel,
  Layers3,
  PlaneTakeoff,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrainFront,
  Store,
  Wallet,
  Wind,
  Zap,
  Luggage,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import type { LucideIcon } from 'lucide-react';
import Reveal from './components/Reveal';
import PlanningModal, { type PlanningFormValues } from './components/PlanningModal';
import TravelIllustration from './components/TravelIllustration';
import {
  generateTripItinerary,
  type TripPlannerInput,
  type TripPlannerResult,
} from './services/gemini';

type PlannerFormState = PlanningFormValues;

const initialPlannerForm: PlannerFormState = {
  origin: 'Ahmedabad',
  destination: 'Tokyo',
  travelStyle: 'Balanced',
  travelers: '2',
  durationDays: '5',
  budget: '2500',
  month: 'October',
  interests: 'food, culture, skyline views',
};

const stats = [
  { value: 50, suffix: 'K+', label: 'Trips Planned' },
  { value: 190, suffix: '+', label: 'Countries' },
  { value: 95, suffix: '%', label: 'Planning Accuracy' },
  { value: 3, suffix: ' min', label: 'Average Planning Time' },
];

const features = [
  {
    title: 'Destination Suggestions',
    icon: Globe2,
    description:
      'Generate personalized travel destinations based on interests, season, travel duration, and budget.',
    gradient: 'from-primary/20 via-white to-accent/20',
  },
  {
    title: 'Day-wise Itinerary',
    icon: CalendarDays,
    description:
      'Automatically generate optimized daily travel schedules with attractions, restaurants, activities, and timings.',
    gradient: 'from-secondary/20 via-white to-primary/20',
  },
  {
    title: 'Budget Estimate',
    icon: Wallet,
    description:
      'Estimate transportation, accommodation, food, activities, shopping, and miscellaneous expenses.',
    gradient: 'from-accent/20 via-white to-secondary/20',
  },
  {
    title: 'Packing Checklist',
    icon: Luggage,
    description:
      'Generate destination-specific packing recommendations based on weather, activities, and trip duration.',
    gradient: 'from-emerald-200/40 via-white to-cyan-200/40',
  },
];

const deliverables = [
  { step: '01', title: 'User Preference Input Form', icon: Sparkles, accent: 'text-primary bg-primary/10' },
  { step: '02', title: 'AI Recommendation Engine', icon: Cpu, accent: 'text-secondary bg-secondary/10' },
  { step: '03', title: 'Personalized Day-wise Itinerary', icon: Compass, accent: 'text-accent bg-accent/10' },
  { step: '04', title: 'Budget Estimation Table', icon: Coins, accent: 'text-primary bg-primary/10' },
  { step: '05', title: 'Smart Packing Checklist', icon: ShieldCheck, accent: 'text-secondary bg-secondary/10' },
  { step: '06', title: 'Export to PDF & Share', icon: Files, accent: 'text-accent bg-accent/10' },
];

const links = [
  { label: 'Overview', id: 'overview' },
  { label: 'Features', id: 'features' },
  { label: 'Planner', id: 'deliverables' },
  { label: 'Contact', id: 'contact' },
];

const loadingMessages = [
  'Analyzing preferences...',
  'Finding destinations...',
  'Creating itinerary...',
  'Calculating budget...',
  'Preparing packing list...',
  'Finalizing your trip...',
];

const travelTips = [
  'Premium trips feel effortless when the route balances iconic highlights with enough breathing room.',
  'A good itinerary usually pairs one anchor experience with two flexible moments for discovery.',
  'Booking a little earlier can unlock better hotels, transport flow, and a calmer pace.',
];

function App() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [plannerError, setPlannerError] = useState<string | null>(null);
  const [plannerResult, setPlannerResult] = useState<TripPlannerResult | null>(null);
  const [plannerForm, setPlannerForm] = useState<PlannerFormState>(initialPlannerForm);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof TripPlannerInput, string>>>({});
  const [lastRequest, setLastRequest] = useState<TripPlannerInput | null>(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingTip, setLoadingTip] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const cancellationRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!plannerLoading) {
      return;
    }

    setLoadingStage(0);
    setLoadingTip(0);
    setLoadingComplete(false);

    const stageTimer = window.setInterval(() => {
      setLoadingStage((value) => Math.min(value + 1, loadingMessages.length - 1));
    }, 1800);

    const tipTimer = window.setInterval(() => {
      setLoadingTip((value) => (value + 1) % travelTips.length);
    }, 6000);

    return () => {
      window.clearInterval(stageTimer);
      window.clearInterval(tipTimer);
    };
  }, [plannerLoading]);

  const openPlanner = () => {
    setPlannerError(null);
    setPlannerOpen(true);
  };

  useEffect(() => {
    document.body.style.overflow = plannerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [plannerOpen]);

  const smoothScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  const navigateToContact = () => {
    // Navigate to a dedicated contact page
    window.location.href = '/contact';
  };

  const updatePlannerField = (field: keyof PlannerFormState, value: string) => {
    setPlannerForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setPlannerError(null);
  };

  const cancelPlanner = () => {
    cancellationRef.current = true;
    setPlannerLoading(false);
    setLoadingComplete(false);
    setPlannerError(null);
    setPlannerOpen(true);
  };

  const submitPlanner = async () => {
    const request = convertPlannerForm(plannerForm);
    const errors = validatePlannerForm(plannerForm);
    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      setPlannerError('Please fix the highlighted fields before generating your itinerary.');
      return;
    }

    cancellationRef.current = false;
    setLastRequest(request);
    setPlannerLoading(true);
    setLoadingComplete(false);
    setPlannerError(null);
    setPlannerOpen(false);

    try {
      const result = await generateTripItinerary(request);
      if (cancellationRef.current) {
        return;
      }

      setPlannerResult(result);
      // Open itinerary in a new page/tab for a full-page view
      try {
        openItineraryInNewPage(result);
      } catch {
        // ignore any popup blockers or errors — result remains available in-app
      }
      setLoadingComplete(true);
      window.setTimeout(() => {
        setPlannerLoading(false);
        setLoadingComplete(false);
        window.setTimeout(() => smoothScroll('deliverables'), 50);
      }, 1200);
    } catch (error) {
      if (cancellationRef.current) {
        return;
      }

      const message = error instanceof Error ? error.message : 'Unable to generate itinerary right now.';
      setPlannerError(message);
      setPlannerOpen(true);
      setPlannerLoading(false);
      setLoadingComplete(false);
    }
  };

  const retryPlanner = async () => {
    if (!lastRequest) {
      setPlannerOpen(true);
      return;
    }

    cancellationRef.current = false;
    setPlannerLoading(true);
    setLoadingComplete(false);
    setPlannerError(null);

    try {
      const result = await generateTripItinerary(lastRequest);
      if (cancellationRef.current) {
        return;
      }

      setPlannerResult(result);
      // Open itinerary in a new page/tab for a full-page view
      try {
        openItineraryInNewPage(result);
      } catch {
        // ignore any popup blockers or errors — result remains available in-app
      }
      setLoadingComplete(true);
      window.setTimeout(() => {
        setPlannerLoading(false);
        setLoadingComplete(false);
        window.setTimeout(() => smoothScroll('deliverables'), 50);
      }, 1200);
    } catch (error) {
      if (cancellationRef.current) {
        return;
      }

      const message = error instanceof Error ? error.message : 'Unable to regenerate itinerary right now.';
      setPlannerError(message);
      setPlannerOpen(true);
      setPlannerLoading(false);
      setLoadingComplete(false);
    }
  };

  function createItineraryHtml(result: TripPlannerResult) {
    const escapeHtml = (s: string) =>
      String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const daysHtml = result.dailyItinerary
      .map((day) => {
        return `
          <section style="margin-bottom:18px">
            <h3 style="margin:6px 0;font-size:18px">Day ${day.day} · ${escapeHtml(day.title)}</h3>
            <div><strong>Morning</strong>: ${escapeHtml(day.morning)}</div>
            <div><strong>Afternoon</strong>: ${escapeHtml(day.afternoon)}</div>
            <div><strong>Evening</strong>: ${escapeHtml(day.evening)}</div>
            <div><strong>Dinner</strong>: ${escapeHtml(day.dinner)}</div>
          </section>
        `;
      })
      .join('\n');

    const budgetHtml = result.budgetBreakdown
      .map((b) => `<li>${escapeHtml(b.category)} — $${Number(b.estimate).toLocaleString()} · ${escapeHtml(b.note)}</li>`)
      .join('\n');

    const packingHtml = result.packingChecklist.map((p) => `<li>${escapeHtml(p)}</li>`).join('\n');

    return `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${escapeHtml(result.tripTitle)}</title>
        <style>
          body{font-family:Inter,system-ui,Segoe UI,Roboto,-apple-system,Helvetica,Arial;margin:20px;color:#0f172a}
          h1{font-size:28px;margin-bottom:4px}
          h2{font-size:16px;margin-top:18px}
          section{padding:10px 0;border-bottom:1px solid #eee}
        </style>
      </head>
      <body>
        <h1>${escapeHtml(result.tripTitle)}</h1>
        <p style="color:#475569">${escapeHtml(result.summary)}</p>
        <p><strong>Destination:</strong> ${escapeHtml(result.destination)}</p>
        <p><strong>Recommended transport:</strong> ${escapeHtml(result.recommendedTransport)}</p>

        <h2>Daily itinerary</h2>
        ${daysHtml}

        <h2>Budget breakdown</h2>
        <ul>${budgetHtml}</ul>

        <h2>Packing checklist</h2>
        <ul>${packingHtml}</ul>

        <p style="margin-top:28px;color:#64748b;font-size:13px">Generated by PromptWars</p>
      </body>
      </html>
    `;
  }

  function openItineraryInNewPage(result: TripPlannerResult) {
    const html = createItineraryHtml(result);
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      throw new Error('Unable to open new window');
    }
    newWindow.document.open();
    newWindow.document.write(html);
    newWindow.document.close();
  }

  const exportPlannerPdf = () => {
    if (!plannerResult) {
      return;
    }

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    const lineHeight = 16;
    let y = 54;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(plannerResult.tripTitle, margin, y);
    y += 26;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const summaryLines = doc.splitTextToSize(plannerResult.summary, 500);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * lineHeight + 18;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Destination', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(plannerResult.destination, margin + 90, y);
    y += 20;

    doc.setFont('helvetica', 'bold');
    doc.text('Transport', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(plannerResult.recommendedTransport, margin + 90, y);
    y += 32;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Daily itinerary', margin, y);
    y += 16;

    plannerResult.dailyItinerary.forEach((day) => {
      if (y > 760) {
        doc.addPage();
        y = 54;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`Day ${day.day} · ${day.title}`, margin, y);
      y += 16;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const morning = doc.splitTextToSize(`Morning: ${day.morning}`, 500);
      const afternoon = doc.splitTextToSize(`Afternoon: ${day.afternoon}`, 500);
      const evening = doc.splitTextToSize(`Evening: ${day.evening}`, 500);
      const dinner = doc.splitTextToSize(`Dinner: ${day.dinner}`, 500);
      doc.text(morning, margin + 10, y);
      y += morning.length * lineHeight + 6;
      doc.text(afternoon, margin + 10, y);
      y += afternoon.length * lineHeight + 6;
      doc.text(evening, margin + 10, y);
      y += evening.length * lineHeight + 6;
      doc.text(dinner, margin + 10, y);
      y += dinner.length * lineHeight + 12;
    });

    if (y > 720) {
      doc.addPage();
      y = 54;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Budget breakdown', margin, y);
    y += 16;

    plannerResult.budgetBreakdown.forEach((item) => {
      if (y > 780) {
        doc.addPage();
        y = 54;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`${item.category} — $${item.estimate.toLocaleString()}`, margin + 8, y);
      y += 12;
      doc.setFont('helvetica', 'normal');
      const noteLines = doc.splitTextToSize(item.note, 480);
      doc.text(noteLines, margin + 16, y);
      y += noteLines.length * lineHeight + 8;
    });

    if (y > 740) {
      doc.addPage();
      y = 54;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Packing checklist', margin, y);
    y += 16;

    plannerResult.packingChecklist.forEach((item) => {
      if (y > 790) {
        doc.addPage();
        y = 54;
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(`• ${item}`, 500);
      doc.text(lines, margin + 8, y);
      y += lines.length * lineHeight + 4;
    });

    doc.save(`${plannerResult.tripTitle.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-itinerary.pdf`);
  };

  const navItems = useMemo(
    () => [
      { label: 'Overview', id: 'overview' },
      { label: 'Features', id: 'features' },
      { label: 'Planner', id: 'deliverables' },
      { label: 'Contact', id: 'contact' },
    ],
    [],
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-hero-radial text-ink">
      <AnimatePresence>
        {(plannerLoading || loadingComplete) ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-xl"
          >
            <motion.div
              initial={{ y: 20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 12, scale: 0.97 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.55)] sm:p-8"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.16),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.14),transparent_45%)]" />
              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Premium planning flow</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Crafting your travel experience</h2>
                  </div>
                  <button type="button" onClick={cancelPlanner} className="button-secondary px-4 py-2.5 text-sm">
                    Cancel
                  </button>
                </div>

                <div className="mt-8 rounded-[28px] border border-slate-200/70 bg-white/80 p-5 shadow-sm">
                  <div className="flex items-center justify-between text-sm font-medium text-slate-600">
                    <span>Progress</span>
                    <span>{Math.round(((loadingStage + 1) / loadingMessages.length) * 100)}%</span>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200/80">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((loadingStage + 1) / loadingMessages.length) * 100}%` }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={loadingMessages[loadingStage]}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="mt-5 text-lg font-semibold text-ink"
                    >
                      {loadingMessages[loadingStage]}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-5 shadow-sm">
                    <p className="text-sm font-semibold text-primary">Planning checklist</p>
                    <div className="mt-4 space-y-3">
                      {loadingMessages.map((message, index) => {
                        const state = index < loadingStage ? 'complete' : index === loadingStage ? 'active' : 'upcoming';
                        return (
                          <div key={message} className={`flex items-center gap-3 rounded-[18px] border px-3 py-3 ${state === 'complete' ? 'border-emerald-200 bg-emerald-50/80' : state === 'active' ? 'border-primary/20 bg-primary/10' : 'border-slate-200 bg-slate-50/70'}`}>
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${state === 'complete' ? 'bg-emerald-500 text-white' : state === 'active' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                              {state === 'complete' ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                            </div>
                            <span className={`text-sm font-medium ${state === 'upcoming' ? 'text-slate-500' : 'text-slate-800'}`}>{message}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-slate-200/70 bg-[linear-gradient(135deg,rgba(79,70,229,0.08),rgba(255,255,255,0.9))] p-5 shadow-sm">
                    <p className="text-sm font-semibold text-primary">Travel tip</p>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={travelTips[loadingTip]}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="mt-3 text-base leading-7 text-slate-700"
                      >
                        {travelTips[loadingTip]}
                      </motion.p>
                    </AnimatePresence>

                    <div className="mt-6 space-y-3">
                      {["Personalized itinerary", "Budget-aware suggestions", "Premium pacing"].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {loadingComplete ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center justify-center rounded-[24px] bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    <Check className="mr-2 h-4 w-4" /> Success — your itinerary is ready and will appear shortly.
                  </motion.div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.12),transparent_55%)] blur-3xl" />
        <div className="absolute left-0 top-40 h-72 w-72 rounded-full bg-accent/15 blur-[120px] animate-glow" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-secondary/15 blur-[120px] animate-glow" style={{ animationDelay: '1.8s' }} />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/55 backdrop-blur-2xl">
        <div className="section-shell flex h-20 items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => smoothScroll('hero')}
            className="group inline-flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-glow">
              <PlaneTakeoff className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold tracking-tight text-ink">Travel Planner AI</p>
              <p className="text-xs text-slate-500">AI-Powered Intelligent Travel Planning</p>
            </div>
          </button>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => (item.id === 'contact' ? navigateToContact() : smoothScroll(item.id))}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/80 hover:text-ink"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button type="button" onClick={() => smoothScroll('overview')} className="button-secondary px-5 py-2.5">
              Learn More
            </button>
            <button type="button" onClick={openPlanner} disabled={plannerLoading} className={`button-primary px-5 py-2.5 ${plannerLoading ? 'cursor-not-allowed opacity-70' : ''}`}>
              {plannerLoading ? 'Planning…' : 'Start Planning'}
            </button>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm transition hover:bg-white lg:hidden"
          >
            <ChevronDown className={`h-5 w-5 transition ${menuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-white/70 bg-white/85 px-5 pb-5 pt-3 backdrop-blur-2xl lg:hidden">
            <div className="section-shell flex flex-col gap-2 px-0">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => (item.id === 'contact' ? navigateToContact() : smoothScroll(item.id))}
                  className="rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <section id="hero" className="relative overflow-hidden pt-8 sm:pt-12 lg:pt-16">
          <div className="section-shell grid items-center gap-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
            <Reveal className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary shadow-sm backdrop-blur-xl">
                  <Sparkles className="h-3.5 w-3.5" /> AI TRAVEL PLATFORM
              </div>

              <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-[-0.05em] text-ink sm:text-6xl lg:text-7xl">
                AI Travel Planner
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Create personalized travel experiences in seconds using AI. Generate smart itineraries, budget
                estimates, destination recommendations, and packing lists—all in one place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={openPlanner} disabled={plannerLoading} className={`button-primary ${plannerLoading ? 'cursor-not-allowed opacity-70' : ''}`}>
                  {plannerLoading ? 'Planning…' : 'Start Planning'} <ArrowRight className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => smoothScroll('overview')} className="button-secondary">
                  Learn More <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((stat, index) => (
                  <CounterCard key={stat.label} loaded={loaded} index={index} {...stat} />
                ))}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="glass-strong rounded-[28px] p-5 premium-shadow">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Trip intelligence in one flow</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Destination discovery, itinerary optimization, budgets, and packing — all orchestrated by AI.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => smoothScroll('overview')}
                  className="group glass-strong rounded-[28px] p-5 text-left premium-shadow transition duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Learn more about planning</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">Discover how AI turns trip planning into a simple, guided flow.</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-glow transition group-hover:scale-105">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </button>
              </div>
            </Reveal>

            <Reveal className="relative lg:pl-4" delayClassName="delay-150">
              <TravelIllustration />
            </Reveal>
          </div>
        </section>

        <section id="overview" className="section-shell mt-24 sm:mt-28 lg:mt-32">
          <Reveal>
            <div className="grid gap-10 rounded-[36px] border border-white/70 bg-white/60 p-6 shadow-[0_40px_120px_-50px_rgba(15,23,42,0.22)] backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
              <div className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,rgba(79,70,229,0.1),rgba(6,182,212,0.08),rgba(255,255,255,0.88))] p-6">
                <div className="absolute inset-0 grid-overlay opacity-35" />
                <div className="relative space-y-4 rounded-[26px] border border-white/75 bg-white/70 p-5 shadow-lg backdrop-blur-xl">
                  <div className="flex items-center gap-3 text-slate-900">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Globe2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Global trip planning</p>
                      <p className="text-xs text-slate-500">All data points synchronized by AI</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <MiniInsight icon={Wind} label="Weather" value="Trip-aware" />
                    <MiniInsight icon={TrainFront} label="Transit" value="Optimized routes" />
                    <MiniInsight icon={Hotel} label="Stay" value="Smart matches" />
                    <MiniInsight icon={Store} label="Dining" value="Local picks" />
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <GlassMetric title="Budget compression" value="-28%" description="AI trims avoidable spend" />
                  <GlassMetric title="Time saved" value="4.8 hrs" description="Per trip planning session" />
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                  Why AI Travel Planner?
                </div>
                <h2 className="section-title mt-5">Replace scattered travel research with one intelligent planning flow.</h2>
                <p className="section-copy mt-5 max-w-2xl">
                  Planning a trip usually requires searching multiple websites for destinations, hotels,
                  transportation, activities, weather, and expenses. This process is time-consuming, confusing,
                  and often results in poor planning.
                </p>
                <p className="section-copy mt-4 max-w-2xl">
                  Our AI Travel Planner simplifies everything by generating personalized travel plans in seconds
                  using Generative AI. Users receive destination suggestions, optimized day-wise itineraries, accurate
                  budget estimates, and customized packing checklists—all from a single platform.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    'Destination suggestions tuned to taste and budget',
                    'Daily routing that avoids wasted movement',
                    'Expense estimates with practical margin planning',
                    'Packing lists adapted to weather and trip style',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-4 text-sm text-slate-700 shadow-sm">
                      <div className="mt-0.5 rounded-full bg-emerald-500/10 p-1.5 text-emerald-600">
                        <Zap className="h-3.5 w-3.5" />
                      </div>
                      <span className="leading-6">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="features" className="section-shell mt-24 sm:mt-28 lg:mt-32">
          <Reveal>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-xl">
                Feature set
              </div>
              <h2 className="section-title mt-5">Four premium planning capabilities in one elegant product.</h2>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delayClassName={`delay-${index * 100}`}>
                <article className="gradient-border card-lift h-full rounded-[28px] bg-white/70 p-6 shadow-[0_20px_70px_-28px_rgba(15,23,42,0.2)] backdrop-blur-2xl">
                  <div className={`rounded-[22px] bg-gradient-to-br ${feature.gradient} p-5`}> 
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-sm">
                      <feature.icon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="deliverables" className="section-shell mt-24 sm:mt-28 lg:mt-32">
          <Reveal>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-xl">
                Project Deliverables
              </div>
              <h2 className="section-title mt-5">A six-step product flow designed like a high-end launch story.</h2>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
            <Reveal>
              <div className="relative rounded-[34px] border border-white/70 bg-white/60 p-6 shadow-[0_30px_90px_-38px_rgba(15,23,42,0.22)] backdrop-blur-2xl">
                <div className="absolute left-[39px] top-10 bottom-10 w-px bg-gradient-to-b from-primary via-secondary to-accent opacity-40" />
                <div className="space-y-5">
                  {deliverables.map((item, index) => (
                    <div key={item.step} className="relative flex gap-5 rounded-[28px] p-4 transition hover:bg-white/70">
                      <div className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.accent} shadow-sm`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold tracking-[0.28em] text-slate-400">{item.step}</span>
                          <span className="text-sm font-medium text-slate-500">Step {index + 1}</span>
                        </div>
                        <p className="mt-2 text-lg font-semibold text-ink">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delayClassName="delay-150">
              <PlannerResultPanel
                loading={plannerLoading}
                error={plannerError}
                result={plannerResult}
                onRetry={retryPlanner}
                onOpenPlanner={openPlanner}
                onExportPdf={exportPlannerPdf}
              />
            </Reveal>
          </div>
        </section>
      </main>

      <PlanningModal
        open={plannerOpen}
        loading={plannerLoading}
        error={plannerError}
        values={plannerForm}
        fieldErrors={fieldErrors}
        onChange={updatePlannerField}
        onClose={() => setPlannerOpen(false)}
        onSubmit={submitPlanner}
      />

      <footer id="contact" className="mt-24 border-t border-white/70 bg-white/55 backdrop-blur-2xl sm:mt-28 lg:mt-32">
        <div className="section-shell grid gap-8 py-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-3 rounded-[24px] border border-white/80 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-glow">
                <PlaneTakeoff className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-ink">Travel Planner AI</p>
                <p className="text-sm text-slate-500">Smart travel planning powered by artificial intelligence.</p>
              </div>
            </div>
            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-500">
              Built for people who want elegant trip planning, faster decisions, and a premium AI product experience.
            </p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Copyright © 2025 Travel Planner AI</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Quick Links</p>
              <div className="mt-4 grid gap-3">
                {links.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => (link.id === 'contact' ? navigateToContact() : smoothScroll(link.id))}
                    className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-primary"
                  >
                    <ArrowRight className="h-3.5 w-3.5" /> {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/80 bg-[linear-gradient(135deg,rgba(79,70,229,0.1),rgba(255,255,255,0.75))] p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm font-semibold text-primary">Launch-ready experience</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Premium visual hierarchy, accessible motion, and a refined SaaS composition aligned with the best modern product sites.
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

function CounterCard({ value, suffix, label, loaded, index }: { value: number; suffix: string; label: string; loaded: boolean; index: number }) {
  const animated = useAnimatedNumber(value, loaded);
  return (
    <div className="glass-strong rounded-[26px] p-4 premium-shadow" style={{ animationDelay: `${index * 120}ms` }}>
      <p className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {animated}
        {suffix}
      </p>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
    </div>
  );
}

function useAnimatedNumber(target: number, active: boolean) {
  const [value, setValue] = useState(active ? target : 0);

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    const start = performance.now();
    const duration = 1100;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [active, target]);

  return value;
}

function MiniInsight({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-slate-200/70 bg-white/75 p-4 shadow-sm backdrop-blur-xl">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function GlassMetric({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <div className="glass-strong rounded-[28px] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-ink">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function PlannerResultPanel({
  loading,
  error,
  result,
  onRetry,
  onOpenPlanner,
  onExportPdf,
}: {
  loading: boolean;
  error: string | null;
  result: TripPlannerResult | null;
  onRetry: () => void;
  onOpenPlanner: () => void;
  onExportPdf: () => void;
}) {
  if (loading) {
    return <PlannerSkeleton />;
  }

  if (result) {
    return (
      <div className="grid gap-5 rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(248,250,252,0.95))] p-6 shadow-[0_30px_90px_-38px_rgba(15,23,42,0.2)] backdrop-blur-2xl">
        <div className="rounded-[28px] bg-gradient-to-br from-primary/10 via-white to-accent/10 p-6">
          <p className="text-sm font-semibold text-primary">Generated itinerary</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{result.tripTitle}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{result.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
            <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">{result.destination}</span>
            <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">{result.recommendedTransport}</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-[26px] border border-slate-200/70 bg-white/80 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Daily itinerary</p>
            <div className="mt-3 max-h-72 space-y-3 overflow-y-auto pr-1">
              {result.dailyItinerary.map((day) => (
                <article key={day.day} className="rounded-[20px] border border-slate-100 bg-slate-50/80 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-ink">Day {day.day} · {day.title}</p>
                  </div>
                  <div className="mt-2 grid gap-2 text-sm leading-6 text-slate-600">
                    <p><span className="font-semibold text-slate-800">Morning:</span> {day.morning}</p>
                    <p><span className="font-semibold text-slate-800">Afternoon:</span> {day.afternoon}</p>
                    <p><span className="font-semibold text-slate-800">Evening:</span> {day.evening}</p>
                    <p><span className="font-semibold text-slate-800">Dinner:</span> {day.dinner}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[26px] border border-slate-200/70 bg-white/80 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Budget + packing</p>
            <div className="mt-3 space-y-3">
              {result.budgetBreakdown.map((item) => (
                <div key={item.category} className="rounded-[18px] bg-slate-50/90 px-3 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-ink">{item.category}</p>
                    <p className="text-sm font-semibold text-primary">${item.estimate.toLocaleString()}</p>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[20px] border border-slate-100 bg-slate-50/90 p-4">
              <p className="text-sm font-semibold text-ink">Packing checklist</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                {result.packingChecklist.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={onOpenPlanner} className="button-secondary flex-1 min-w-[140px]">
                Edit inputs
              </button>
              <button type="button" onClick={onRetry} className="button-primary flex-1 min-w-[140px]">
                Regenerate
              </button>
              <button type="button" onClick={onExportPdf} className="button-secondary flex-1 min-w-[140px]">
                Export PDF
              </button>
            </div>
          </section>
        </div>

        <div className="rounded-[26px] border border-slate-200/70 bg-white/80 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Smart tips</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {result.smartTips.map((tip) => (
              <div key={tip} className="rounded-[18px] bg-slate-50/90 px-3 py-3 text-sm leading-6 text-slate-600">
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,250,252,0.92))] p-6 shadow-[0_30px_90px_-38px_rgba(15,23,42,0.2)] backdrop-blur-2xl">
      <div className="rounded-[28px] bg-gradient-to-br from-primary/10 via-white to-accent/10 p-6">
        <p className="text-sm font-semibold text-primary">Launch-ready output</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">Built to feel like a polished, shippable product demo.</p>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          The timeline clarifies the value flow from preference capture to shareable output, so the product narrative feels premium and easy to understand.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { icon: ShieldCheck, title: 'Trust-first UX', copy: 'Clean states and reassuring microcopy.' },
          { icon: Layers3, title: 'Reusable system', copy: 'Composable cards and motion-aware sections.' },
        ].map((item) => (
          <div key={item.title} className="glass rounded-[26px] p-5">
            <item.icon className="h-6 w-6 text-primary" />
            <p className="mt-3 text-base font-semibold text-ink">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
          </div>
        ))}
      </div>

      {error ? (
        <div className="rounded-[22px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <p className="font-semibold">Generation failed</p>
          <p className="mt-1 leading-6">{error}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={onOpenPlanner} className="button-secondary">
              Fix inputs
            </button>
            <button type="button" onClick={onRetry} className="button-primary">
              Retry
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}


function PlannerSkeleton() {
  return (
    <div className="grid gap-5 rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,250,252,0.92))] p-6 shadow-[0_30px_90px_-38px_rgba(15,23,42,0.2)] backdrop-blur-2xl">
      <div className="rounded-[28px] bg-gradient-to-br from-primary/10 via-white to-accent/10 p-6">
        <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200/80" />
        <div className="mt-4 h-8 w-3/4 animate-pulse rounded-2xl bg-slate-200/80" />
        <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-slate-200/70" />
        <div className="mt-2 h-4 w-5/6 animate-pulse rounded-full bg-slate-200/70" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[26px] border border-slate-200/70 bg-white/80 p-4 shadow-sm">
          <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200/80" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-[20px] bg-slate-100/90 p-3">
                <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200/80" />
                <div className="mt-3 h-3 w-full animate-pulse rounded-full bg-slate-200/70" />
                <div className="mt-2 h-3 w-5/6 animate-pulse rounded-full bg-slate-200/70" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-slate-200/70 bg-white/80 p-4 shadow-sm">
          <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200/80" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-[18px] bg-slate-100/90 p-3">
                <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-200/80" />
                <div className="mt-2 h-3 w-full animate-pulse rounded-full bg-slate-200/70" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function buildPrintableTripHtml(result: TripPlannerResult): string {
  const itineraryMarkup = result.dailyItinerary
    .map(
      (day) => `
        <section style="margin-bottom: 16px; padding: 12px 14px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h3 style="margin: 0 0 8px; font-size: 16px; color: #111827;">Day ${day.day} · ${escapeHtml(day.title)}</h3>
          <p style="margin: 4px 0; font-size: 13px; color: #374151;"><strong>Morning:</strong> ${escapeHtml(day.morning)}</p>
          <p style="margin: 4px 0; font-size: 13px; color: #374151;"><strong>Afternoon:</strong> ${escapeHtml(day.afternoon)}</p>
          <p style="margin: 4px 0; font-size: 13px; color: #374151;"><strong>Evening:</strong> ${escapeHtml(day.evening)}</p>
          <p style="margin: 4px 0; font-size: 13px; color: #374151;"><strong>Dinner:</strong> ${escapeHtml(day.dinner)}</p>
        </section>
      `,
    )
    .join('');

  const budgetMarkup = result.budgetBreakdown
    .map(
      (item) => `
        <div style="margin-bottom: 10px; padding: 10px 12px; border-radius: 10px; background: #f8fafc;">
          <div style="display: flex; justify-content: space-between; gap: 8px; font-size: 13px; color: #111827;">
            <strong>${escapeHtml(item.category)}</strong>
            <span>$${item.estimate.toLocaleString()}</span>
          </div>
          <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">${escapeHtml(item.note)}</p>
        </div>
      `,
    )
    .join('');

  const packingMarkup = result.packingChecklist
    .map((item) => `<li style="margin: 4px 0; font-size: 13px; color: #374151;">${escapeHtml(item)}</li>`)
    .join('');

  const tipsMarkup = result.smartTips
    .map((tip) => `<li style="margin: 6px 0; font-size: 13px; color: #374151;">${escapeHtml(tip)}</li>`)
    .join('');

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>${escapeHtml(result.tripTitle)} PDF</title>
      <style>
        body { font-family: Arial, sans-serif; color: #111827; padding: 28px; line-height: 1.5; }
        h1 { margin: 0 0 10px; font-size: 24px; }
        p { margin: 6px 0; }
        .pill { display: inline-block; padding: 6px 10px; border-radius: 999px; background: #eef2ff; color: #4338ca; font-size: 12px; margin-right: 8px; margin-bottom: 8px; }
        .section { margin-top: 20px; }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(result.tripTitle)}</h1>
      <p>${escapeHtml(result.summary)}</p>
      <div style="margin-top: 12px;">
        <span class="pill">Destination: ${escapeHtml(result.destination)}</span>
        <span class="pill">Transport: ${escapeHtml(result.recommendedTransport)}</span>
      </div>

      <div class="section">
        <h2 style="font-size: 18px; margin-bottom: 8px;">Daily itinerary</h2>
        ${itineraryMarkup}
      </div>

      <div class="section">
        <h2 style="font-size: 18px; margin-bottom: 8px;">Budget breakdown</h2>
        ${budgetMarkup}
      </div>

      <div class="section">
        <h2 style="font-size: 18px; margin-bottom: 8px;">Packing checklist</h2>
        <ul>${packingMarkup}</ul>
      </div>

      <div class="section">
        <h2 style="font-size: 18px; margin-bottom: 8px;">Smart tips</h2>
        <ul>${tipsMarkup}</ul>
      </div>
    </body>
  </html>`;
}

function escapeHtml(value: string): string {
  return value
    .split('&').join('&amp;')
    .split('<').join('&lt;')
    .split('>').join('&gt;')
    .split('"').join('&quot;')
    .split("'").join('&#39;');
}

function convertPlannerForm(form: PlannerFormState): TripPlannerInput {
  return {
    origin: form.origin.trim(),
    destination: form.destination.trim(),
    travelStyle: form.travelStyle,
    travelers: Number(form.travelers),
    durationDays: Number(form.durationDays),
    budget: Number(form.budget),
    month: form.month.trim(),
    interests: form.interests.trim(),
  };
}

function validatePlannerForm(form: PlannerFormState): Partial<Record<keyof TripPlannerInput, string>> {
  const errors: Partial<Record<keyof TripPlannerInput, string>> = {};

  if (!form.origin.trim()) {
    errors.origin = 'Departure city is required.';
  }

  if (form.destination.trim().length < 2) {
    errors.destination = 'Enter a valid destination.';
  }

  if (!form.month.trim()) {
    errors.month = 'Select a month for better seasonal planning.';
  }

  if (!form.interests.trim()) {
    errors.interests = 'Add at least one interest.';
  }

  const duration = Number(form.durationDays);
  if (!Number.isFinite(duration) || duration < 1 || duration > 14) {
    errors.durationDays = 'Duration must be between 1 and 14 days.';
  }

  const travelers = Number(form.travelers);
  if (!Number.isFinite(travelers) || travelers < 1 || travelers > 9) {
    errors.travelers = 'Traveler count must be between 1 and 9.';
  }

  const budget = Number(form.budget);
  if (!Number.isFinite(budget) || budget <= 0) {
    errors.budget = 'Budget must be greater than zero.';
  }

  if (!form.travelStyle.trim()) {
    errors.travelStyle = 'Select a travel style.';
  }

  return errors;
}

export default App;
