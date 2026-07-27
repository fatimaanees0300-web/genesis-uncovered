import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookMarked,
  GitCompareArrows,
  Languages,
  MessageCircle,
  Search,
  Sparkle,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { POPULAR_SEARCHES } from "@/lib/report";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OriginVerse AI — Learn the origin of anything" },
      {
        name: "description",
        content:
          "Search any food, invention, person, country or idea and get a structured AI report on its origin, timeline, evolution and cultural significance.",
      },
      { property: "og:title", content: "OriginVerse AI — Learn the origin of anything" },
      {
        property: "og:description",
        content: "Structured AI origin reports with timelines, etymology and cultural impact.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Search,
    title: "Deep origin reports",
    body: "Overview, etymology, historical background, evolution, cultural impact and modern relevance — organised, never a wall of text.",
  },
  {
    icon: Sparkle,
    title: "Visual timelines",
    body: "Every discovery includes a chronological timeline of the moments that shaped it.",
  },
  {
    icon: GitCompareArrows,
    title: "Compare mode",
    body: "Put two topics side by side and see how their histories diverge and connect.",
  },
  {
    icon: MessageCircle,
    title: "Threaded assistant",
    body: "Keep asking follow-ups in saved conversations that remember the whole thread.",
  },
  {
    icon: BookMarked,
    title: "Personal library",
    body: "Save discoveries into collections, favourite the best ones and revisit your history.",
  },
  {
    icon: Languages,
    title: "Made for learning",
    body: "Explain-like-I'm-five retellings, quick quizzes and a daily discovery to keep curiosity going.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Ask anything",
    body: "Croissants, penicillin, the metric system, your favourite word — anything with a past.",
  },
  {
    step: "02",
    title: "Get a structured report",
    body: "Sourced, sectioned and skimmable, with a timeline of the turning points.",
  },
  {
    step: "03",
    title: "Go deeper",
    body: "Compare topics, quiz yourself and keep the thread going with the assistant.",
  },
];

const STATS = [
  { value: "6", label: "Report sections" },
  { value: "2×", label: "Side-by-side compare" },
  { value: "∞", label: "Topics to explore" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-6xl items-center px-5 py-3">
          <Logo />
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button variant="hero" className="pressable" asChild>
              <Link to="/auth" search={{ mode: "signup" }}>
                Get started
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative isolate overflow-hidden px-5 pb-24 pt-14 text-center md:pt-24">
        <div className="halo pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]" />
        <div className="dot-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_50%_at_50%_0%,#000,transparent)] opacity-40" />
        <div
          className="blob -z-10 left-[-8%] top-10 size-[380px] bg-primary/35"
          aria-hidden="true"
        />
        <div
          className="blob -z-10 right-[-10%] top-32 size-[420px] bg-cyan/35 [animation-delay:-6s]"
          aria-hidden="true"
        />
        <div
          className="blob -z-10 left-1/2 top-[420px] size-[300px] bg-gold/25 [animation-delay:-11s]"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-3xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur">
            <Sparkle className="size-3.5 text-gold" />
            Curiosity engine for history &amp; culture
          </span>
          <h1 className="font-display mt-7 text-[2.6rem] font-extrabold leading-[1.05] tracking-tight md:text-7xl">
            Discover the <span className="gradient-text">origin of anything</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Type a food, an invention, a person, a country or an idea. OriginVerse AI researches
            where it came from, how it evolved and why it still matters.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="xl" className="pressable" asChild>
              <Link to="/auth" search={{ mode: "signup" }}>
                Start discovering — free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="pressable" asChild>
              <Link to="/auth">I already have an account</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {POPULAR_SEARCHES.slice(0, 6).map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Product preview mock */}
        <div className="mx-auto mt-16 max-w-4xl animate-fade-up [animation-delay:120ms]">
          <div className="glass-card gradient-ring rounded-3xl p-3 text-left shadow-[var(--shadow-lift)]">
            <div className="rounded-2xl border border-border/70 bg-surface/80 p-5 md:p-7">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-background/70 px-4 py-3">
                <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="truncate text-sm text-muted-foreground">
                  Where did the croissant actually come from?
                </span>
                <span className="ml-auto hidden rounded-lg bg-[image:var(--gradient-brand)] px-3 py-1.5 text-xs font-semibold text-primary-foreground sm:block">
                  Discover
                </span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Overview", "Timeline", "Cultural impact"].map((label, index) => (
                  <div key={label} className="rounded-2xl border border-border/70 bg-card/70 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                      {label}
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="h-2.5 w-full rounded-full bg-muted" />
                      <div className="h-2.5 w-[85%] rounded-full bg-muted" />
                      {index !== 2 && <div className="h-2.5 w-[60%] rounded-full bg-muted" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-surface/40">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 px-5 py-10 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-extrabold md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground md:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Features</p>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            Everything you need to go deep
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="glass-card hover-lift group rounded-3xl p-7 transition-colors"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-[image:var(--gradient-brand)] text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="size-5" />
              </span>
              <h3 className="font-display mt-5 text-base font-bold">{feature.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan">How it works</p>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            From question to understanding
          </h2>
        </div>
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((item) => (
            <li key={item.step} className="glass-card hover-lift rounded-3xl p-7">
              <span className="font-display text-4xl font-extrabold text-muted-foreground/30">
                {item.step}
              </span>
              <h3 className="font-display mt-3 text-base font-bold">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-28">
        <div className="glass-card gradient-ring relative isolate overflow-hidden rounded-[2rem] px-6 py-16 text-center">
          <div
            className="blob -z-10 left-1/4 top-0 size-[280px] bg-primary/30"
            aria-hidden="true"
          />
          <div
            className="blob -z-10 right-1/4 bottom-0 size-[240px] bg-cyan/30 [animation-delay:-8s]"
            aria-hidden="true"
          />
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            One question is all it takes
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
            Join OriginVerse AI and turn every "where did that come from?" into a proper answer.
          </p>
          <Button variant="hero" size="xl" className="pressable mt-8" asChild>
            <Link to="/auth" search={{ mode: "signup" }}>
              Create your free account
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-sm text-muted-foreground md:flex-row">
          <Logo showText size={28} />
          <p className="md:ml-auto">© {new Date().getFullYear()} OriginVerse AI</p>
        </div>
      </footer>
    </div>
  );
}
