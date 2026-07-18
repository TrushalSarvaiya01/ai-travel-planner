import {
  Camera,
  Cloud,
  Compass,
  Globe2,
  Hotel,
  MapPinned,
  Plane,
  Sparkles,
  Stamp,
  Luggage,
  Bot,
  LocateFixed,
} from 'lucide-react';

export default function TravelIllustration() {
  return (
    <div className="relative mx-auto flex aspect-[4/4.6] w-full max-w-[620px] items-center justify-center overflow-hidden rounded-[34px] border border-white/70 bg-white/55 p-4 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.35)] backdrop-blur-2xl sm:p-6">
      <div className="absolute inset-0 grid-overlay opacity-35" />
      <div className="absolute -left-12 top-8 h-40 w-40 rounded-full bg-primary/20 blur-3xl animate-glow" />
      <div className="absolute right-4 top-16 h-28 w-28 rounded-full bg-accent/20 blur-3xl animate-glow" />
      <div className="absolute inset-0 noise opacity-15" />

      <div className="absolute left-8 top-8 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-md">
        Live AI route generation
      </div>

      <div className="absolute bottom-8 left-8 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-lg backdrop-blur-md animate-float">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">AI Assistant</p>
            <p className="text-xs text-slate-500">Curating a smarter itinerary</p>
          </div>
        </div>
      </div>

      <div className="absolute right-8 top-10 z-20 rounded-2xl border border-white/70 bg-white/85 p-3 shadow-lg backdrop-blur-md animate-float" style={{ animationDelay: '1.4s' }}>
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-accent/10 p-2 text-accent">
            <MapPinned className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-600">Hotel match</p>
            <p className="text-sm font-semibold text-slate-900">87% relevance</p>
          </div>
        </div>
      </div>

      <div className="relative flex h-[86%] w-[86%] items-center justify-center rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.72))] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
        <div className="absolute inset-6 rounded-full border border-dashed border-slate-200/70" />
        <div className="absolute inset-14 rounded-full border border-dashed border-primary/15" />

        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 560" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="flightGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="55%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <path
            d="M108 358C130 270 198 184 302 156C383 135 420 162 434 223"
            stroke="url(#flightGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="14 14"
            className="animate-dash"
          />
        </svg>

        <div className="absolute left-10 top-20 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur-md animate-drift">
          <Globe2 className="h-10 w-10 text-primary" />
        </div>
        <div className="absolute right-12 top-32 rounded-full border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur-md animate-float">
          <Plane className="h-9 w-9 -rotate-12 text-secondary" />
        </div>
        <div className="absolute left-12 bottom-24 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur-md animate-float" style={{ animationDelay: '0.8s' }}>
          <Luggage className="h-10 w-10 text-accent" />
        </div>
        <div className="absolute right-16 bottom-28 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur-md animate-drift" style={{ animationDelay: '1.1s' }}>
          <Stamp className="h-8 w-8 text-slate-700" />
        </div>
        <div className="absolute right-14 top-[54%] rounded-full border border-white/70 bg-white/80 p-3 shadow-xl backdrop-blur-md animate-float" style={{ animationDelay: '1.7s' }}>
          <Cloud className="h-7 w-7 text-sky-400" />
        </div>
        <div className="absolute left-[43%] top-16 rounded-full border border-white/70 bg-white/80 p-3 shadow-xl backdrop-blur-md animate-float" style={{ animationDelay: '0.4s' }}>
          <Camera className="h-7 w-7 text-amber-500" />
        </div>
        <div className="absolute right-[38%] bottom-14 rounded-full border border-white/70 bg-white/80 p-3 shadow-xl backdrop-blur-md animate-float" style={{ animationDelay: '1.2s' }}>
          <Compass className="h-7 w-7 text-primary" />
        </div>
        <div className="absolute left-[18%] bottom-[48%] rounded-full border border-white/70 bg-white/80 p-3 shadow-xl backdrop-blur-md animate-float" style={{ animationDelay: '2s' }}>
          <LocateFixed className="h-6 w-6 text-rose-500" />
        </div>
        <div className="absolute right-[18%] top-[38%] rounded-full border border-white/70 bg-white/80 p-3 shadow-xl backdrop-blur-md animate-float" style={{ animationDelay: '2.3s' }}>
          <Hotel className="h-6 w-6 text-violet-500" />
        </div>
        <div className="absolute left-[23%] top-[36%] rounded-full border border-white/70 bg-white/80 p-3 shadow-xl backdrop-blur-md animate-float" style={{ animationDelay: '1.3s' }}>
          <Sparkles className="h-6 w-6 text-cyan-500" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.98),rgba(79,70,229,0.1)_45%,rgba(6,182,212,0.08)_72%,rgba(15,23,42,0.02)_100%)] shadow-[0_0_0_24px_rgba(79,70,229,0.04),0_0_0_48px_rgba(6,182,212,0.03)]">
            <div className="absolute inset-6 rounded-full border border-white/85 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(255,255,255,0.45))] shadow-inner" />
            <div className="absolute inset-12 rounded-full bg-[linear-gradient(180deg,rgba(79,70,229,0.18),rgba(6,182,212,0.12))] blur-xl" />
            <Globe2 className="relative z-10 h-28 w-28 text-primary drop-shadow-sm" />
            <div className="absolute -right-3 top-4 rounded-full border border-white/70 bg-white/90 p-2 shadow-lg animate-float">
              <Bot className="h-5 w-5 text-secondary" />
            </div>
            <div className="absolute -left-5 bottom-10 rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-[11px] font-semibold text-slate-600 shadow-lg animate-float" style={{ animationDelay: '1.2s' }}>
              Smart pack
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
