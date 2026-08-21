import Image from "next/image";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AdvisorPhoto({
  photoUrl,
  name,
  size = 96,
  className = "",
}: {
  photoUrl?: string | null;
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border-2 border-surface bg-brand-soft shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={name}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <div
          className="grid h-full w-full place-items-center font-mono font-semibold text-brand"
          style={{ fontSize: size * 0.32 }}
        >
          {initials(name)}
        </div>
      )}
    </div>
  );
}
