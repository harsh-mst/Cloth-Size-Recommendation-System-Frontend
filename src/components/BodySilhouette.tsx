interface BodySilhouetteProps {
  unit: "metric" | "imperial";
}

const BodySilhouette = ({ unit }: BodySilhouetteProps) => {
  const heightLabel = unit === "metric" ? "Height (cm)" : "Height (in)";
  const chestLabel = unit === "metric" ? "Chest (cm)" : "Chest (in)";
  const waistLabel = unit === "metric" ? "Waist (cm)" : "Waist (in)";

  return (
    <div className="flex flex-col items-center justify-center h-full py-6 select-none">
      <div className="relative" style={{ width: 200, height: 380 }}>
        <svg
          viewBox="0 0 200 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-lg"
        >
          {/* Gradient defs */}
          <defs>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(275,80%,45%)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="hsl(330,85%,55%)" stopOpacity="0.18" />
            </linearGradient>
            <linearGradient id="bodyStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(275,80%,45%)" />
              <stop offset="100%" stopColor="hsl(330,85%,55%)" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(330,85%,55%)" />
              <stop offset="100%" stopColor="hsl(275,80%,45%)" />
            </linearGradient>
          </defs>

          {/* Head */}
          <ellipse cx="100" cy="32" rx="22" ry="26" fill="url(#bodyGrad)" stroke="url(#bodyStroke)" strokeWidth="2" />

          {/* Neck */}
          <rect x="90" y="55" width="20" height="14" rx="6" fill="url(#bodyGrad)" stroke="url(#bodyStroke)" strokeWidth="2" />

          {/* Shoulders */}
          <path
            d="M56 76 Q70 68 100 70 Q130 68 144 76"
            stroke="url(#bodyStroke)"
            strokeWidth="2"
            fill="none"
          />

          {/* Torso (chest to hips) */}
          <path
            d="M56 76 L44 130 L48 180 L60 210 L140 210 L152 180 L156 130 L144 76 Q130 68 100 70 Q70 68 56 76Z"
            fill="url(#bodyGrad)"
            stroke="url(#bodyStroke)"
            strokeWidth="2"
          />

          {/* Left arm */}
          <path
            d="M56 76 L38 76 Q28 80 26 100 L24 150 Q24 162 32 165 L38 165 Q46 162 46 150 L44 130 L56 100Z"
            fill="url(#bodyGrad)"
            stroke="url(#bodyStroke)"
            strokeWidth="2"
          />

          {/* Right arm */}
          <path
            d="M144 76 L162 76 Q172 80 174 100 L176 150 Q176 162 168 165 L162 165 Q154 162 154 150 L156 130 L144 100Z"
            fill="url(#bodyGrad)"
            stroke="url(#bodyStroke)"
            strokeWidth="2"
          />

          {/* Left leg */}
          <path
            d="M60 210 L52 280 L50 340 Q50 355 60 356 L78 356 Q88 355 86 340 L82 270 L90 210Z"
            fill="url(#bodyGrad)"
            stroke="url(#bodyStroke)"
            strokeWidth="2"
          />

          {/* Right leg */}
          <path
            d="M140 210 L148 280 L150 340 Q150 355 140 356 L122 356 Q112 355 114 340 L118 270 L110 210Z"
            fill="url(#bodyGrad)"
            stroke="url(#bodyStroke)"
            strokeWidth="2"
          />

          {/* === Measurement lines === */}

          {/* Height line — left side, full body */}
          <line x1="14" y1="6" x2="14" y2="360" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="10" y1="6" x2="18" y2="6" stroke="hsl(330,85%,55%)" strokeWidth="2" />
          <line x1="10" y1="360" x2="18" y2="360" stroke="hsl(330,85%,55%)" strokeWidth="2" />

          {/* Chest line — horizontal across chest */}
          <line x1="44" y1="108" x2="156" y2="108" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="44" y1="104" x2="44" y2="112" stroke="hsl(275,80%,45%)" strokeWidth="2" />
          <line x1="156" y1="104" x2="156" y2="112" stroke="hsl(330,85%,55%)" strokeWidth="2" />

          {/* Waist line — horizontal across waist */}
          <line x1="48" y1="168" x2="152" y2="168" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="48" y1="164" x2="48" y2="172" stroke="hsl(275,80%,45%)" strokeWidth="2" />
          <line x1="152" y1="164" x2="152" y2="172" stroke="hsl(330,85%,55%)" strokeWidth="2" />
        </svg>

        {/* Height label */}
        <div
          className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 -rotate-90 whitespace-nowrap"
          style={{ left: -30, top: "50%" }}
        >
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary/80 bg-background/90 px-1 rounded">
            {heightLabel}
          </span>
        </div>

        {/* Chest label */}
        <div className="absolute right-0 top-0 -translate-y-1" style={{ top: 98, right: -6 }}>
          <span className="text-[10px] font-bold tracking-wider uppercase text-primary bg-background/90 px-1 rounded border border-primary/20">
            {chestLabel}
          </span>
        </div>

        {/* Waist label */}
        <div className="absolute right-0" style={{ top: 158, right: -6 }}>
          <span className="text-[10px] font-bold tracking-wider uppercase text-secondary bg-background/90 px-1 rounded border border-secondary/20">
            {waistLabel}
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground text-center max-w-[180px] leading-relaxed">
        Enter your measurements to get a precise size recommendation
      </p>
    </div>
  );
};

export default BodySilhouette;
