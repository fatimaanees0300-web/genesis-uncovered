import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { BookMarked, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/states";
import { clearHistory, deleteSaved, listLibrary, toggleFavourite } from "@/lib/library.functions";

export const Route = createFileRoute("/_authenticated/library")({
  head: () => ({
    meta: [
      { title: "Library — OriginVerse AI" },
      {
        name: "description",
        content: "Your saved origin reports, favourites, collections and search history.",
      },
      { property: "og:title", content: "Library — OriginVerse AI" },
      { property: "og:description", content: "Everything you saved on OriginVerse AI." },
    ],
  }),
  component: Library,
});

function Library() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "favourites">("all");
  const library = useQuery({ queryKey: ["library"], queryFn: () => listLibrary() });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["library"] });

  const favourite = useMutation({
    mutationFn: (input: { id: string; value: boolean }) => toggleFavourite({ data: input }),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteSaved({ data: { id } }),
    onSuccess: () => {
      invalidate();
      toast.success("Removed from library.");
    },
  });
  const clear = useMutation({
    mutationFn: () => clearHistory(),
    onSuccess: () => {
      invalidate();
      toast.success("History cleared.");
    },
  });

  const saved = (library.data?.saved ?? []).filter(
    (item) => filter === "all" || item.is_favourite,
  );

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            Your library
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Saved discoveries, organised by collection.
          </p>
        </div>
        <div className="flex shrink-0 gap-1 rounded-2xl border border-border/60 bg-card/60 p-1 backdrop-blur">
          {(["all", "favourites"] as const).map((key) => (
            <Button
              key={key}
              variant={filter === key ? "hero" : "ghost"}
              size="sm"
              className="pressable capitalize"
              onClick={() => setFilter(key)}
            >
              {key}
            </Button>
          ))}
        </div>
      </div>

      {library.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="skeleton-sweep h-32 rounded-3xl" />
          ))}
        </div>
      ) : saved.length === 0 ? (
        <EmptyState
          icon={<BookMarked className="size-6" />}
          title={filter === "favourites" ? "No favourites yet" : "Nothing saved yet"}
          description="Open any discovery and hit Save to keep it here for later."
          action={
            <Button variant="hero" className="pressable" asChild>
              <Link to="/dashboard">Start discovering</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {saved.map((item, index) => (
            <article
              key={item.id}
              className="glass-card hover-lift animate-fade-up rounded-3xl p-6"
              style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
            >
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                    {item.collection ?? "General"}
                  </p>
                  <h2 className="font-display mt-1.5 truncate text-lg font-bold">{item.topic}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="pressable shrink-0"
                  aria-label={item.is_favourite ? "Remove favourite" : "Add favourite"}
                  onClick={() => favourite.mutate({ id: item.id, value: !item.is_favourite })}
                >
                  <Star className={item.is_favourite ? "size-4 fill-gold text-gold" : "size-4"} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="pressable shrink-0 hover:text-destructive"
                  aria-label={`Delete ${item.topic}`}
                  onClick={() => remove.mutate(item.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
              <Button variant="outline" size="sm" className="pressable mt-5" asChild>
                <Link to="/discover/$topic" params={{ topic: item.topic }}>
                  Open report
                </Link>
              </Button>
            </article>
          ))}
        </div>
      )}

      <section>
        <div className="flex items-center gap-3">
          <h2 className="font-display text-lg font-bold tracking-tight">Search history</h2>
          {!!library.data?.history.length && (
            <Button
              variant="ghost"
              size="sm"
              className="pressable ml-auto"
              onClick={() => clear.mutate()}
              disabled={clear.isPending}
            >
              Clear history
            </Button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(library.data?.history ?? []).map((item) => (
            <Link
              key={item.id}
              to="/discover/$topic"
              params={{ topic: item.query }}
              className="pressable rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground"
            >
              {item.query}
            </Link>
          ))}
          {!library.isLoading && !library.data?.history.length && (
            <p className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
              No searches yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

