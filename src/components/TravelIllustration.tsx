import {
  Cloud,
  Compass,
  Globe2,
  Hotel,
  MapPinned,
  Plane,
  Sparkles,
  Luggage,
  Bot,
  LocateFixed,
  Sun,
  Map,
} from "lucide-react";

export default function TravelIllustration() {
  return (
    <div
      className="
        relative mx-auto
        flex
        aspect-[1/1.25]
        xs:aspect-[1/1.15]
        sm:aspect-[4/4.5]
        w-full
        max-w-[650px]
        items-center
        justify-center
        overflow-hidden
        rounded-[28px] xs:rounded-[36px] sm:rounded-[40px]
        border
        border-white/70
        bg-white/50
        p-3 xs:p-4 sm:p-6 lg:p-8
        shadow-[0_25px_70px_-25px_rgba(15,23,42,.35)]
        sm:shadow-[0_50px_140px_-50px_rgba(15,23,42,.45)]
        backdrop-blur-3xl
      "
    >
      {/* Background Radial Aurora */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top,rgba(99,102,241,.25),transparent_45%)]
        "
      />

      {/* Decorative Blur Spheres */}
      <div
        className="
          absolute
          -left-10 sm:-left-20
          top-10 sm:top-20
          h-36 w-36 sm:h-60 sm:w-60
          rounded-full
          bg-indigo-500/20
          blur-[60px] sm:blur-[90px]
          animate-glow
        "
      />

      <div
        className="
          absolute
          right-0
          bottom-5 sm:bottom-10
          h-32 w-32 sm:h-52 sm:w-52
          rounded-full
          bg-cyan-400/20
          blur-[50px] sm:blur-[80px]
          animate-glow
        "
      />

      {/* Map Grid Pattern */}
      <div
        className="
          absolute
          inset-0
          opacity-25 sm:opacity-30
          bg-[linear-gradient(rgba(99,102,241,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,.08)_1px,transparent_1px)]
          bg-[size:24px_24px] sm:bg-[size:40px_40px]
        "
      />

      {/* Noise Texture */}
      <div className="absolute inset-0 noise opacity-10" />

      {/* Top Left - AI Live Badge */}
      <div
        className="
          absolute
          left-3 top-3
          xs:left-4 xs:top-4
          sm:left-7 sm:top-7
          z-20
          flex
          items-center
          gap-1.5 sm:gap-2
          rounded-full
          border
          border-white/80
          bg-white/90
          px-2.5 py-1.5
          xs:px-3 xs:py-2
          sm:px-4 sm:py-2
          text-[10px] xs:text-xs
          font-semibold
          text-slate-600
          shadow-md sm:shadow-lg
          backdrop-blur-xl
        "
      >
        <Sparkles className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 text-indigo-500 shrink-0" />
        <span className="truncate max-w-[110px] xs:max-w-none">
          AI Trip Optimization
        </span>
      </div>

      {/* Top Right - Hotel Recommendation Card */}
      <div
        className="
          absolute
          right-3 top-3
          xs:right-4 xs:top-4
          sm:right-7 sm:top-7
          z-20
          rounded-2xl sm:rounded-3xl
          border
          border-white/80
          bg-white/90
          p-2 sm:p-3
          shadow-lg sm:shadow-xl
          backdrop-blur-xl
          animate-float
        "
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-xl sm:rounded-2xl bg-indigo-500/10 p-1.5 sm:p-2">
            <Hotel className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-[8px] xs:text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 font-medium">
              Hotel AI Match
            </p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
              94% Perfect
            </p>
          </div>
        </div>
      </div>

      {/* Center Main Map Container Card */}
      <div
        className="
          relative
          flex
          h-[68%] xs:h-[72%] sm:h-[76%] lg:h-[78%]
          w-[92%] sm:w-[92%] lg:w-[94%]
          items-center
          justify-center
          rounded-[28px] xs:rounded-[36px] sm:rounded-[42px]
          border
          border-white/80
          bg-white/70
          shadow-[inset_0_2px_10px_rgba(255,255,255,.8)]
          backdrop-blur-2xl
          transform-gpu
          rotate-x-3
        "
      >
        {/* Inner Map Radial Glow */}
        <div
          className="
            absolute
            inset-0
            rounded-[28px] xs:rounded-[36px] sm:rounded-[42px]
            bg-[radial-gradient(circle_at_center,rgba(99,102,241,.15),transparent_60%)]
          "
        />

        {/* Map Dashed Concentric Circles */}
        <div className="absolute inset-4 xs:inset-6 sm:inset-8 rounded-full border border-dashed border-indigo-200/50" />
        <div className="absolute inset-10 xs:inset-12 sm:inset-16 rounded-full border border-dashed border-cyan-200/50" />

        {/* Flight Route SVG Path */}
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          viewBox="0 0 500 560"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient
              id="travelRoute"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          <path
            d="M120 390 C150 280 230 180 330 160 C390 150 430 190 440 250"
            stroke="url(#travelRoute)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="12 14"
            className="animate-dash"
          />

          <g>
            <circle cx="330" cy="160" r="10" fill="#6366F1" opacity=".15" />
          </g>
        </svg>

        {/* Central Floating Globe */}
        <div
          className="
            relative
            flex
            h-24 w-24
            xs:h-32 xs:w-32
            sm:h-44 sm:w-44
            lg:h-52 lg:w-52
            items-center
            justify-center
            rounded-full
            bg-gradient-to-br
            from-indigo-400/20
            via-cyan-300/20
            to-purple-500/20
            shadow-[0_0_40px_rgba(99,102,241,.25)]
            sm:shadow-[0_0_80px_rgba(99,102,241,.35)]
            animate-spin-slow
          "
        >
          <div className="absolute inset-2 sm:inset-4 rounded-full border border-white/80 bg-white/40" />

          <Globe2
            className="
              relative z-10
              h-10 w-10
              xs:h-14 xs:w-14
              sm:h-20 sm:w-20
              lg:h-24 lg:w-24
              text-indigo-600
            "
          />

          {/* Globe Bot Badge */}
          <div
            className="
              absolute
              -right-1 xs:-right-2
              top-4 sm:top-8
              rounded-full
              border border-white
              bg-white
              p-1.5 xs:p-2 sm:p-3
              shadow-lg sm:shadow-xl
            "
          >
            <Bot className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-slate-700" />
          </div>
        </div>

        {/* Floating Travel Icons - Relative Screen Offsets */}
        {/* Top-Left: Compass */}
        <div
          className="
            absolute
            top-[15%] left-[4%] xs:left-[6%] sm:left-[8%]
            rounded-2xl sm:rounded-3xl
            border border-white/80
            bg-white/90
            p-2 sm:p-3
            shadow-md sm:shadow-lg
            animate-drift
          "
        >
          <Compass className="h-4 w-4 xs:h-5 xs:w-5 sm:h-7 sm:w-7 text-indigo-600" />
        </div>

        {/* Top-Right: Plane */}
        <div
          className="
            absolute
            top-[32%] right-[4%] xs:right-[6%] sm:right-[8%]
            rounded-full
            border border-white/80
            bg-white/90
            p-2 sm:p-3
            shadow-md sm:shadow-lg
            animate-float
          "
        >
          <Plane className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 -rotate-12 text-slate-700" />
        </div>

        {/* Bottom-Left: Luggage */}
        <div
          className="
            absolute
            bottom-[14%] left-[5%] xs:left-[7%] sm:left-[10%]
            rounded-2xl sm:rounded-3xl
            border border-white/80
            bg-white/90
            p-2 sm:p-3
            shadow-md sm:shadow-lg
          "
        >
          <Luggage className="h-4 w-4 xs:h-5 xs:w-5 sm:h-7 sm:w-7 text-cyan-500" />
        </div>

        {/* Bottom-Right: Map */}
        <div
          className="
            absolute
            bottom-[14%] right-[5%] xs:right-[7%] sm:right-[10%]
            rounded-2xl sm:rounded-3xl
            border border-white/80
            bg-white/90
            p-2 sm:p-3
            shadow-md sm:shadow-lg
            animate-drift
          "
        >
          <Map className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-indigo-600" />
        </div>

        {/* Decorative Mini Floating Accents */}
        <Cloud className="absolute right-[32%] top-[45%] h-4 w-4 sm:h-6 sm:w-6 text-slate-400/50" />
        <Sparkles className="absolute left-[30%] top-[25%] h-3.5 w-3.5 sm:h-5 sm:w-5 text-yellow-400 animate-pulse" />
        <Hotel className="absolute right-[28%] bottom-[32%] h-3.5 w-3.5 sm:h-5 sm:w-5 text-slate-400/50" />
      </div>
    </div>
  );
}