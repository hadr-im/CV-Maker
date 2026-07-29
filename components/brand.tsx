import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * The three sibling brands this tool ships under. Each owns one colour of the
 * palette, which is where the app's coral / amber / teal accents come from.
 */
export const GROUP_BRANDS = [
  { id: "gv", name: "GV", src: "/logos/gv.png", tint: "var(--brand-coral)" },
  { id: "gte", name: "GTE", src: "/logos/gte.png", tint: "var(--brand-amber)" },
  { id: "gta", name: "GTA", src: "/logos/gta.png", tint: "var(--brand-teal)" },
] as const;

export function BrandWordmark({
  className,
  href = "/",
}: {
  className?: string;
  href?: string | null;
}) {
  // "CV" carries the brand ramp; "Maker" follows the theme's foreground, so the
  // wordmark reads on either background without a second variant.
  const content = (
    <span className="text-[1.05rem] font-semibold tracking-tight text-foreground">
      <span className="text-gradient-brand">CV</span> Maker
    </span>
  );

  if (href === null) {
    return (
      <div className={cn("flex items-center gap-2.5", className)}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 transition-opacity hover:opacity-80",
        className,
      )}
    >
      {content}
    </Link>
  );
}

/** Horizontal strip of the group's marks, used on the home and thank-you pages. */
export function GroupLogos({
  className,
  size = 40,
  smSize,
}: {
  className?: string;
  /** Rendered size from the `sm` breakpoint up. */
  size?: number;
  /** Rendered size below `sm`; defaults to a little under `size`. */
  smSize?: number;
}) {
  const small = smSize ?? Math.round(size * 0.75);

  return (
    <ul
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-14 gap-y-4 sm:gap-y-6 sm:gap-x-18",
        className,
      )}
    >
      {GROUP_BRANDS.map((brand) => (
        <li key={brand.id} className="flex items-center gap-3">
          {/* Held back to ~70% so the marks read as a quiet trust strip rather
              than three logos competing with the hero above them. The two sizes
              go through custom properties because only CSS can switch on the
              breakpoint — the width/height attributes stay at the larger size so
              Next still emits the right intrinsic dimensions. */}
          <Image
            src={brand.src}
            alt=""
            width={size}
            height={size}
            className="size-(--logo-sm)  sm:size-(--logo)"
            style={
              {
                "--logo": `${size}px`,
                "--logo-sm": `${small}px`,
              } as CSSProperties
            }
          />
        </li>
      ))}
    </ul>
  );
}
