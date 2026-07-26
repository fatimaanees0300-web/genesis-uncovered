import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Star, Trash2 } from "lucide-react";
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
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Your library</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Saved discoveries, organised by collection.
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "favourites" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("favourites")}
          >
            Favourites
          </Button>
        </div>
      </div>

      {library.isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : saved.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          description="Open any discovery and hit Save to keep it here for later."
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {saved.map((item) => (
            <article key={item.id} className="glass-card hover-lift rounded-2xl p-5">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {item.collection ?? "General"}
                  </p>
                  <h2 className="font-display mt-1 text-lg font-bold">{item.topic}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Toggle favourite"
                  onClick={() => favourite.mutate({ id: item.id, value: !item.is_favourite })}
                >
                  <Star className={item.is_favourite ? "size-4 fill-gold text-gold" : "size-4"} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Delete"
                  onClick={() => remove.mutate(item.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.summary}</p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
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
          <h2 className="font-display text-lg font-bold">Search history</h2>
          {!!library.data?.history.length && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => clear.mutate()}
              disabled={clear.isPending}
            >
              Clear history
            </Button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(library.data?.history ?? []).map((item) => (
            <Link
              key={item.id}
              to="/discover/$topic"
              params={{ topic: item.query }}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {item.query}
            </Link>
          ))}
          {!library.isLoading && !library.data?.history.length && (
            <p className="text-sm text-muted-foreground">No searches yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
