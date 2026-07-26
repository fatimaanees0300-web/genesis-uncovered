import { createFileRoute, Link } from "@tanstack/react-router";
import {
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

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex h-20 max-w-6xl items-center px-4">
        <Logo />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button variant="hero" asChild>
            <Link to="/auth" search={{ mode: "signup" }}>
              Get started
            </Link>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-20 pt-10 text-center md:pt-20">
        <div className="halo pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]" />
        <div className="mx-auto max-w-3xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Sparkle className="size-3.5 text-gold" />
            Curiosity engine for history & culture
          </span>
          <h1 className="font-display mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Discover the <span className="gradient-text">origin of anything</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Type a food, an invention, a person, a country or an idea. OriginVerse AI researches
            where it came from, how it evolved and why it still matters.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="xl" asChild>
              <Link to="/auth" search={{ mode: "signup" }}>
                Start discovering — free
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/auth">I already have an account</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {POPULAR_SEARCHES.slice(0, 6).map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <h2 className="font-display text-center text-2xl font-bold md:text-3xl">
          Everything you need to go deep
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="glass-card hover-lift rounded-2xl p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </span>
              <h3 className="font-display mt-4 text-base font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24">
        <div className="glass-card rounded-3xl p-10 text-center">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            One question is all it takes
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Join OriginVerse AI and turn every "where did that come from?" into a proper answer.
          </p>
          <Button variant="hero" size="xl" className="mt-7" asChild>
            <Link to="/auth" search={{ mode: "signup" }}>
              Create your free account
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-sm text-muted-foreground md:flex-row">
          <Logo showText size={28} />
          <p className="md:ml-auto">© {new Date().getFullYear()} OriginVerse AI</p>
        </div>
      </footer>
    </div>
  );
}
