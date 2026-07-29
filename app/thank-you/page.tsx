import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Phone,
  Search,
} from "lucide-react";

import { SiteFooter } from "@/components/site/site-footer";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Your CV is ready",
  description: "Your CV has been exported. Here is what to do next.",
};

/**
 * Written as a recruiter would brief a candidate: each one is a decision the
 * reader can act on in the next ten minutes, not a platitude about confidence.
 */
const TIPS = [
  {
    icon: Search,
    title: "Use the advert’s own words",
    body: "If the posting says “React” and your CV says “modern frameworks”, a keyword filter will not join those up. Mirror their exact wording wherever it is honestly true of you.",
    tint: "var(--brand-teal)",
  },
  {
    icon: Clock,
    title: "Apply in the first 48 hours",
    body: "Most shortlists are half-built within two days of a role going live. A good CV sent early beats a perfect one sent next week.",
    tint: "var(--brand-coral)",
  },
  {
    icon: Phone,
    title: "Re-read your contact details",
    body: "One wrong digit and the process ends silently — nobody emails to say your number bounced. Check them character by character, then send yourself the PDF and open it on your phone.",
    tint: "var(--brand-amber)",
  },
];

export default function ThankYouPage() {
  return (
    <>
      <main className="flex min-h-svh flex-col">
        {/* One backdrop behind both sections. Clipping it at the end of the hero
            cut the glow off mid-gradient, and that hard line was the seam
            showing under the buttons. */}
        <div className="relative isolate overflow-hidden">
          <BackgroundRippleEffect className="hero-mask z-0" />
          {/* Static gradients rather than the shader — this page is a full stop,
              and nothing on it should still be moving. */}
          <div className="deco-glow z-1" />
          <div className="hero-fade z-2" />

          <section className="relative z-10 mx-auto max-w-3xl px-5 pb-16 pt-24 text-center sm:px-8 sm:pt-28">
            <div className="pointer-events-none flex flex-col items-center">
              <span className="grid size-16 place-items-center rounded-2xl border border-brand-teal/30 bg-brand-teal/10 animate-rise">
                <Check className="size-7 text-brand-teal" strokeWidth={2.5} />
              </span>

              <h1
                className="mt-7 text-[clamp(2rem,5.5vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.03em] text-foreground animate-rise"
                style={{ animationDelay: "80ms" }}
              >
                That&apos;s your CV,{" "}
                <span className="text-gradient-brand">done.</span>
              </h1>

              <p
                className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground animate-rise"
                style={{ animationDelay: "150ms" }}
              >
                If the print dialog is still open, choose{" "}
                <strong className="font-medium text-foreground">
                  Save as PDF
                </strong>{" "}
                as the destination. Your details have been cleared from this
                browser, so nothing of yours is left behind on a shared machine.
              </p>

              <div
                className="pointer-events-auto mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row animate-rise"
                style={{ animationDelay: "220ms" }}
              >
                <Link
                  href="/builder"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "w-full sm:w-auto",
                  )}
                >
                  <ArrowLeft className="size-4" />
                  Start a new CV
                </Link>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "w-full sm:w-auto",
                  )}
                >
                  Go to home
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </section>

          <section className="relative z-10 px-5 pb-20 sm:px-8">
            <div className="mx-auto max-w-6xl">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                Before you send it
              </p>

              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {TIPS.map((tip) => (
                  <li
                    key={tip.title}
                    className="rounded-2xl border border-border bg-card p-6 shadow-soft-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-md"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-xl"
                        style={{
                          backgroundColor: `color-mix(in oklab, ${tip.tint} 14%, transparent)`,
                        }}
                      >
                        <tip.icon
                          className="size-4.5"
                          style={{ color: tip.tint }}
                        />
                      </span>
                      <h3
                        className="text-base font-semibold tracking-tight"
                        style={{ color: tip.tint }}
                      >
                        {tip.title}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {tip.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
