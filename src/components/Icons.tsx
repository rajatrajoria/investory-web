type IconProps = { className?: string };

const base = "stroke-current fill-none";
const strokeProps = { strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function CompassIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5 13 13l-4.5 2.5L11 11l4.5-2.5Z" />
    </svg>
  );
}

export function TrendingUpIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <path d="M4 16l5-5 4 4 7-8" />
      <path d="M15 7h5v5" />
    </svg>
  );
}

export function SunriseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <path d="M4 18h16" />
      <path d="M7 18a5 5 0 0 1 10 0" />
      <path d="M12 8v4M6 11l1.5 1.5M18 11l-1.5 1.5" />
    </svg>
  );
}

export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function CalculatorIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h4" />
    </svg>
  );
}

export function ScaleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <path d="M12 3v18M7 21h10" />
      <path d="M4 7l4-1 4 1M16 7l4-1 4 1" transform="translate(-4,0)" />
      <path d="M3 7l3.5 7a3.5 3.5 0 0 1-7 0L3 7Z" />
      <path d="M17 7l3.5 7a3.5 3.5 0 0 1-7 0L17 7Z" />
      <path d="M8 5l4-2 4 2" />
    </svg>
  );
}

export const SERVICE_ICONS: Record<string, (p: IconProps) => React.ReactElement> = {
  compass: CompassIcon,
  "trending-up": TrendingUpIcon,
  sunrise: SunriseIcon,
  "shield-check": ShieldCheckIcon,
  calculator: CalculatorIcon,
  scale: ScaleIcon,
};

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <path d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function QuoteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M9.5 6C6 6 3.5 8.7 3.5 12.3c0 3 2 5.2 4.6 5.2 2 0 3.4-1.4 3.4-3.3 0-1.7-1.2-3-2.8-3-.3 0-.6 0-.8.1.3-2 2-3.6 4.2-4l-.4-1.6c-.7.1-1.5.3-2.2.6Zm10 0C16 6 13.5 8.7 13.5 12.3c0 3 2 5.2 4.6 5.2 2 0 3.4-1.4 3.4-3.3 0-1.7-1.2-3-2.8-3-.3 0-.6 0-.8.1.3-2 2-3.6 4.2-4l-.4-1.6c-.7.1-1.5.3-2.2.6Z" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <path d="M5 12l5 5L19 7" />
    </svg>
  );
}
