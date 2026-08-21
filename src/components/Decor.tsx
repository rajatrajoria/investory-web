/** Decorative upward-growth line motif — no meaning is conveyed by it, so it's aria-hidden. */
export function GrowthLine({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 160"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M4 130 C 50 130, 60 90, 96 90 S 140 40, 176 40 S 220 70, 256 55 S 300 12, 316 8"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="316" cy="8" r="5" fill="var(--accent)" />
      <path
        d="M4 145 C 60 145, 70 115, 110 115 S 150 80, 190 80 S 230 100, 270 88 S 305 55, 316 48"
        stroke="var(--brand)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

/** Dot-grid texture panel used as a background layer behind cards/images. */
export function DotField({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`dot-grid pointer-events-none ${className}`} />;
}
