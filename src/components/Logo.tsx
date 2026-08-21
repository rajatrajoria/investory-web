import Link from "next/link";

/**
 * The Investory wordmark — "Investo₹y", with the Rupee sign standing in for
 * the letter R. This is the site's one preserved brand element from before
 * the rebrand; everything else was redesigned.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`font-display text-2xl font-semibold tracking-tight text-ink no-underline ${className}`}
      aria-label="Investory — home"
    >
      Investo<span className="text-accent">₹</span>y
    </Link>
  );
}
