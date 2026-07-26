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
    <div className="space-y-10">
      <section className="text-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
          What do you want to <span className="gradient-text">understand</span> today?
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Any food, invention, person, country, word or idea — we'll trace it back to its origin.
        </p>
        <SearchBar className="mx-auto mt-6 max-w-2xl" autoFocus />
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {POPULAR_SEARCHES.map((topic) => (
            <Link
              key={topic}
              to="/discover/$topic"
              params={{ topic }}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {topic}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-bold">Browse by category</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((category) => {
            const Icon = (Icons[category.icon as keyof typeof Icons] ??
              Icons.Sparkle) as typeof Icons.Sparkle;
            return (
              <button
                key={category.name}
                onClick={() =>
                  navigate({ to: "/discover/$topic", params: { topic: category.sample } })
                }
                className="glass-card hover-lift rounded-2xl p-4 text-left"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <p className="mt-3 text-sm font-semibold">{category.name}</p>
                <p className="text-xs text-muted-foreground">e.g. {category.sample}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gold">Daily discovery</p>
          {daily.isLoading ? (
            <>
              <Skeleton className="mt-3 h-7 w-48" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </>
          ) : daily.data ? (
            <>
              <h3 className="font-display mt-2 text-2xl font-bold">{daily.data.topic}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {daily.data.teaser}
              </p>
              <Button variant="hero" className="mt-5" asChild>
                <Link to="/discover/$topic" params={{ topic: daily.data.topic }}>
                  Explore this origin
                </Link>
              </Button>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Daily discovery is unavailable right now — try a search instead.
            </p>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display text-base font-bold">Recent searches</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(library.data?.history ?? []).slice(0, 7).map((item) => (
              <li key={item.id}>
                <Link
                  to="/discover/$topic"
                  params={{ topic: item.query }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {item.query}
                </Link>
              </li>
            ))}
            {!library.isLoading && !library.data?.history.length && (
              <li className="text-muted-foreground">Your searches will appear here.</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
