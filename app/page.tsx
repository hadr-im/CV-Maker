import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  Check,
  Columns2,
  Download,
  FileText,
  Lock,
  PenLine,
  Sparkles,
  Wand2,
} from "lucide-react";

import { GroupLogos } from "@/components/brand";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { TemplateThumb } from "@/components/site/template-thumb";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { buttonVariants } from "@/components/ui/button";
import { HeroAurora } from "@/components/ui/hero-aurora";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: PenLine,
    title: "Fill the form",
    body: "Six short sections — details, experience, education, skills, certifications and anything else you want to add.",
    tint: "var(--brand-coral)",
  },
  {
    icon: Wand2,
    title: "Let AI sharpen it",
    body: "Write your notes however they come out. AI rewrites them into tight, professional bullet points — no invented facts.",
    tint: "var(--brand-amber)",
  },
  {
    icon: Download,
    title: "Preview and download",
    body: "Watch your CV build itself beside the form, switch templates freely, then export a print-ready PDF.",
    tint: "var(--brand-teal)",
  },
];

const FEATURES = [
  {
    icon: Columns2,
    title: "Live side-by-side preview",
    body: "Every keystroke lands on the page instantly. Drag the divider to give the form or the preview more room.",
  },
  {
    icon: Sparkles,
    title: "Honest AI rewriting",
    body: "The model only works with what you gave it. It never fabricates metrics, tools or job titles you did not mention.",
  },
  {
    icon: FileText,
    title: "Three real templates",
    body: "Modern, Classic and Minimal — switch at any time. Your content never has to be retyped.",
  },
  {
    icon: Lock,
    title: "Stays on your machine",
    body: "Your CV is saved in your own browser. No account, no upload, nothing to delete later.",
  },
];

const TEMPLATES = [
  {
    id: "modern" as const,
    name: "Modern",
    body: "A rule under your name and a clear hierarchy. Reads well on screen and in ATS parsers.",
    tint: "var(--brand-teal)",
  },
  {
    id: "classic" as const,
    name: "Classic",
    body: "Centred header, ruled section titles, balanced spacing. The safe answer for formal applications.",
    tint: "var(--brand-coral)",
  },
  {
    id: "minimal" as const,
    name: "Minimal",
    body: "No rules, no ornament — just generous whitespace and your words carrying the weight.",
    tint: "var(--brand-amber)",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main">
        {/* -------------------------------------------------------- Hero + group
            Both sit on one backdrop, so the grid and the auroras carry past the
            separator instead of stopping dead at a section edge. */}
        <div className="relative isolate overflow-hidden">
          <BackgroundRippleEffect className="hero-mask z-0" />
          <HeroAurora className="z-1" />
          <div className="hero-fade z-2" />

          <section className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-32 text-center sm:px-8 sm:pb-24 sm:pt-40">
            <div className="pointer-events-none flex flex-col items-center">
              {/* text-wrap on small screens: the global h1 rule is `balance`,
                  which evens the lines out and leaves the headline narrower than
                  the space it has. Balance only kicks in from sm up. */}
              <h1 className="mt-7 max-w-4xl text-wrap text-[clamp(2.7rem,8vw,5.5rem)] font-bold leading-[1.20] text-foreground sm:text-balance animate-rise">
                Build a CV
                <br />
                <span className="text-gradient-brand">worth Reading</span>
              </h1>

              <p
                className="mt-8 max-w-3xl text-pretty text-base mb-2 sm:mb-0  font-light md:font-normal leading-relaxed text-muted-foreground sm:text-[1.1rem] animate-rise"
                style={{ animationDelay: "90ms" }}
              >
                Fill in a simple form, let AI turn your rough notes into sharp
                bullet points, and watch a polished CV take shape live beside
                you. Download it in minutes.
              </p>

              <div
                className="pointer-events-auto mt-12 sm:mt-14 flex flex-col items-center gap-3 sm:flex-row animate-rise"
                style={{ animationDelay: "180ms" }}
              >
                <Link
                  href="/builder"
                  className={cn(
                    buttonVariants({ size: "xl" }),
                    " h-11 sm:h-12.5 px-10 text-[0.9rem] sm:text-[1.05rem] tracking-wider",
                  )}
                >
                  Create Your Own CV
                </Link>
              </div>
            </div>
          </section>

          {/* -------------------------------------------------------- Group bar */}
          <section id="group" className="relative z-10 scroll-mt-14">
            <div className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
              <GroupLogos className="mt-4" size={66} smSize={46} />
            </div>
          </section>
        </div>

        {/* ------------------------------------------------------- How it works */}
        <section id="how-it-works" className="scroll-mt-20 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <header className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-coral">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Three steps, one sitting.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                No blank page, no formatting fights. You bring the facts — the
                tool handles the wording and the layout.
              </p>
            </header>

            <ol className="mt-12 grid gap-5 md:grid-cols-3 md:gap-x-8">
              {STEPS.map((step, index) => {
                const next = STEPS[index + 1];

                return (
                  // Wrapper, not the card: the card clips its own overflow, so a
                  // connector reaching into the column gap has to be anchored out
                  // here instead.
                  <li
                    key={step.title}
                    className="step-item relative"
                    style={
                      {
                        "--tint": step.tint,
                        ...(next && { "--next-tint": next.tint }),
                      } as CSSProperties
                    }
                  >
                    {/* Hands the step off to the next one. Spans exactly the
                        column gap, and only exists in the 3-up layout; stacked
                        cards have no gap to cross. Colour is driven by
                        .step-connector in globals.css. */}
                    {next && (
                      <span
                        aria-hidden="true"
                        className="step-connector pointer-events-none absolute inset-y-0 left-full hidden h-px w-8 my-auto md:block"
                      />
                    )}

                    <div className="h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft-xs transition-all duration-300 hover:border-(--tint) hover:shadow-soft-md">
                      <div className="flex items-center gap-3">
                        <span
                          className="grid size-11 shrink-0 place-items-center rounded-xl"
                          style={{
                            backgroundColor: `color-mix(in oklab, ${step.tint} 14%, transparent)`,
                          }}
                        >
                          <step.icon
                            className="size-5"
                            style={{ color: step.tint }}
                          />
                        </span>
                        <h3
                          className="text-lg font-semibold tracking-tight"
                          style={{ color: step.tint }}
                        >
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ---------------------------------------------------------- Templates */}
        <section
          id="templates"
          className="relative isolate scroll-mt-20 overflow-hidden border-y border-border bg-surface/60 py-20 sm:py-28"
        >
          {/* Same grid and palette as the hero, held well back — enough to lift
              the section off the page without asking for attention. */}
          <div className="deco-grid z-0" />
          <div className="deco-glow z-0" />

          <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
            <header className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-teal">
                Templates
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Pick a look. Change your mind later.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Your content is stored separately from the design, so switching
                template is one click — and it never costs you a word.
              </p>
            </header>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TEMPLATES.map((template) => (
                <article
                  key={template.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
                >
                  <div className="overflow-hidden rounded-xl border border-border bg-muted/40 p-3">
                    <div className="overflow-hidden rounded-lg shadow-soft-sm transition-transform duration-500 group-hover:scale-[1.02]">
                      <TemplateThumb template={template.id} />
                    </div>
                  </div>
                  <div className="px-2 pb-1 pt-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: template.tint }}
                      />
                      <h3 className="text-base font-semibold tracking-tight text-foreground">
                        {template.name}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {template.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- Features */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <header className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-amber">
                Why it&apos;s different
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Built for the part everyone hates.
              </h2>
            </header>

            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-card p-7 transition-colors hover:bg-elevated"
                >
                  <feature.icon className="size-5 text-brand-coral" />
                  <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
