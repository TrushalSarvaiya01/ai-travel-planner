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
    <div className="relative mx-auto flex aspect-[4/4.6] w-full max-w-[620px] items-center justify-center overflow-hidden rounded-[34px] border border-white/70 bg-white/55 p-6 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.35)] backdrop-blur-2xl sm:p-8">
      {/* Background Ambient Layers */}
      <div className="absolute inset-0 grid-overlay opacity-25" />
      <div className="absolute -left-12 top-8 h-40 w-40 rounded-full bg-primary/15 blur-3xl animate-glow" />
      <div className="absolute right-4 top-16 h-28 w-28 rounded-full bg-accent/15 blur-3xl animate-glow" />
      <div className="absolute inset-0 noise opacity-10" />

      {/* Primary Context Badges (High Contrast, Clean Layout) */}
      <div className="absolute left-6 top-6 z-20 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-md">
        Live AI route generation
      </div>

      <div className="absolute right-6 top-6 z-20 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-lg backdrop-blur-md animate-float" style={{ animationDelay: '1.4s' }}>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-accent/10 p-2.5 text-accent">
            <MapPinned className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hotel match</p>
            <p className="text-sm font-bold text-slate-800">87% relevance</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-20 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur-md animate-float">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">AI Assistant</p>
            <p className="text-xs font-medium text-slate-500">Curating a smarter itinerary</p>
          </div>
        </div>
      </div>

      {/* Main Inner Interactive Ring Canvas Container */}
      <div className="relative flex h-[76%] w-[88%] items-center justify-center rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.85))] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
        
        {/* Concentric Guide Ring Patterns */}
        <div className="absolute inset-6 rounded-full border border-dashed border-slate-200/50" />
        <div className="absolute inset-14 rounded-full border border-dashed border-primary/10" />

        {/* Route Tracking Path */}
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
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="12 12"
            className="animate-dash"
          />
        </svg>

        {/* Tier 1: Mid-Ground Floating Core Elements */}
        <div className="absolute left-6 top-16 rounded-3xl border border-white/80 bg-white/90 p-4 shadow-md backdrop-blur-md animate-drift">
          <Globe2 className="h-8 w-8 text-primary" />
        </div>
        <div className="absolute right-12 top-24 rounded-full border border-white/80 bg-white/90 p-4 shadow-md backdrop-blur-md animate-float">
          <Plane className="h-7 w-7 -rotate-12 text-slate-700" />
        </div>
        <div className="absolute left-8 bottom-16 rounded-3xl border border-white/80 bg-white/90 p-4 shadow-md backdrop-blur-md animate-float" style={{ animationDelay: '0.8s' }}>
          <Luggage className="h-8 w-8 text-accent" />
        </div>
        <div className="absolute right-12 bottom-20 rounded-3xl border border-white/80 bg-white/90 p-4 shadow-md backdrop-blur-md animate-drift" style={{ animationDelay: '1.1s' }}>
          <Stamp className="h-7 w-7 text-slate-600" />
        </div>
        
        {/* Tier 2: Soft Background Environmental Elements (Reduced Opacity for Visual Hierarchy) */}
        <div className="absolute right-12 top-[48%] opacity-40 transition-opacity hover:opacity-100 rounded-full border border-white/60 bg-white/40 p-2 shadow-sm animate-float" style={{ animationDelay: '1.7s' }}>
          <Cloud className="h-5 w-5 text-slate-500" />
        </div>
        <div className="absolute left-[46%] top-9 opacity-40 transition-opacity hover:opacity-100 rounded-full border border-white/60 bg-white/40 p-2 shadow-sm animate-float" style={{ animationDelay: '0.4s' }}>
          <Camera className="h-5 w-5 text-slate-500" />
        </div>
        <div className="absolute right-[42%] bottom-8 opacity-40 transition-opacity hover:opacity-100 rounded-full border border-white/60 bg-white/40 p-2 shadow-sm animate-float" style={{ animationDelay: '1.2s' }}>
          <Compass className="h-5 w-5 text-primary" />
        </div>
        <div className="absolute left-[22%] bottom-[36%] opacity-40 transition-opacity hover:opacity-100 rounded-full border border-white/60 bg-white/40 p-2 shadow-sm animate-float" style={{ animationDelay: '2s' }}>
          <LocateFixed className="h-5 w-5 text-slate-500" />
        </div>
        <div className="absolute right-[24%] top-[38%] opacity-40 transition-opacity hover:opacity-100 rounded-full border border-white/60 bg-white/40 p-2 shadow-sm animate-float" style={{ animationDelay: '2.3s' }}>
          <Hotel className="h-5 w-5 text-slate-500" />
        </div>
        <div className="absolute left-[26%] top-[28%] opacity-40 transition-opacity hover:opacity-100 rounded-full border border-white/60 bg-white/40 p-2 shadow-sm animate-float" style={{ animationDelay: '1.3s' }}>
          <Sparkles className="h-5 w-5 text-accent" />
        </div>

        {/* Focal Centerpiece */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex h-52 w-52 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,1),rgba(79,70,229,0.06)_45%,rgba(6,182,212,0.04)_72%,rgba(15,23,42,0.01)_100%)] shadow-[0_0_0_16px_rgba(79,70,229,0.03),0_0_0_36px_rgba(6,182,212,0.02)]">
            <div className="absolute inset-4 rounded-full border border-white/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(255,255,255,0.5))] shadow-inner" />
            <div className="absolute inset-9 rounded-full bg-[linear-gradient(180deg,rgba(79,70,229,0.12),rgba(6,182,212,0.08))] blur-lg" />
            <Globe2 className="relative z-10 h-20 w-24 text-primary opacity-95 drop-shadow-sm" />
            
            <div className="absolute -right-2 top-2 rounded-full border border-white/80 bg-white/95 p-2 shadow-md animate-float">
              <Bot className="h-4 w-4 text-slate-700" />
            </div>
            <div className="absolute -left-6 bottom-12 rounded-2xl border border-white/80 bg-white/95 px-3 py-1.5 text-[10px] font-bold text-slate-600 shadow-md animate-float" style={{ animationDelay: '1.2s' }}>
              Smart pack
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}