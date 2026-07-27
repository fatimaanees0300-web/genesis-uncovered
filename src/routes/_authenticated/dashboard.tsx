import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import * as Icons from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORIES, POPULAR_SEARCHES } from "@/lib/report";
import { getDailyDiscovery } from "@/lib/discover.functions";
import { listLibrary } from "@/lib/library.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Discover — OriginVerse AI" },
      {
        name: "description",
        content: "Search any topic and explore categories, trending origins and your daily discovery.",
      },
      { property: "og:title", content: "Discover — OriginVerse AI" },
      { property: "og:description", content: "Your OriginVerse AI discovery hub." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();

  const daily = useQuery({
    queryKey: ["daily-discovery"],
    queryFn: () => getDailyDiscovery(),
    staleTime: 1000 * 60 * 60,
  });

  const library = useQuery({ queryKey: ["library"], queryFn: () => listLibrary() });

  return (
    <div className="space-y-14">
      <section className="relative isolate text-center">
        <div className="halo pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[340px]" />
        <div
          className="blob -z-10 left-[5%] -top-10 size-[240px] bg-primary/25"
          aria-hidden="true"
        />
        <div
          className="blob -z-10 right-[5%] -top-6 size-[260px] bg-cyan/25 [animation-delay:-9s]"
          aria-hidden="true"
        />
        <h1 className="font-display animate-fade-up text-3xl font-extrabold tracking-tight md:text-5xl">
          What do you want to <span className="gradient-text">understand</span> today?
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
          Any food, invention, person, country, word or idea — we'll trace it back to its origin.
        </p>
        <SearchBar className="mx-auto mt-8 max-w-2xl" autoFocus />
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {POPULAR_SEARCHES.map((topic) => (
            <Link
              key={topic}
              to="/discover/$topic"
              params={{ topic }}
              className="pressable rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground"
            >
              {topic}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-bold tracking-tight">Browse by category</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((category) => {
            const Icon = (Icons[category.icon as keyof typeof Icons] ??
              Icons.Sparkle) as typeof Icons.Sparkle;
            return (
              <button
                key={category.name}
                onClick={() =>
                  navigate({ to: "/discover/$topic", params: { topic: category.sample } })
                }
                className="glass-card hover-lift group rounded-3xl p-5 text-left"
              >
                <span className="grid size-10 place-items-center rounded-2xl bg-[image:var(--gradient-brand)] text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-4" />
                </span>
                <p className="mt-4 text-sm font-semibold">{category.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">e.g. {category.sample}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card gradient-ring relative isolate overflow-hidden rounded-3xl p-7 lg:col-span-2">
          <div
            className="blob -z-10 right-0 top-0 size-[220px] bg-gold/25"
            aria-hidden="true"
          />
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold">
            <Icons.Sparkle className="size-3.5" />
            Daily discovery
          </p>
          {daily.isLoading ? (
            <div className="skeleton-sweep">
              <Skeleton className="mt-4 h-8 w-48 rounded-xl" />
              <Skeleton className="mt-4 h-4 w-full rounded-lg" />
              <Skeleton className="mt-2 h-4 w-3/4 rounded-lg" />
            </div>
          ) : daily.data ? (
            <>
              <h3 className="font-display mt-3 text-2xl font-extrabold tracking-tight md:text-3xl">
                {daily.data.topic}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {daily.data.teaser}
              </p>
              <Button variant="hero" className="pressable mt-6" asChild>
                <Link to="/discover/$topic" params={{ topic: daily.data.topic }}>
                  Explore this origin
                  <Icons.ArrowRight className="size-4" />
                </Link>
              </Button>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Daily discovery is unavailable right now — try a search instead.
            </p>
          )}
        </div>

        <div className="glass-card rounded-3xl p-7">
          <h3 className="font-display flex items-center gap-2 text-base font-bold">
            <Icons.History className="size-4 text-primary" />
            Recent searches
          </h3>
          <ul className="mt-4 space-y-1 text-sm">
            {(library.data?.history ?? []).slice(0, 7).map((item) => (
              <li key={item.id}>
                <Link
                  to="/discover/$topic"
                  params={{ topic: item.query }}
                  className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Icons.Search className="size-3.5 shrink-0 opacity-60" />
                  <span className="truncate">{item.query}</span>
                </Link>
              </li>
            ))}
            {library.isLoading &&
              [0, 1, 2].map((i) => (
                <li key={i} className="skeleton-sweep px-2.5 py-2">
                  <Skeleton className="h-4 w-full rounded-lg" />
                </li>
              ))}
            {!library.isLoading && !library.data?.history.length && (
              <li className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                Your searches will appear here.
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}

