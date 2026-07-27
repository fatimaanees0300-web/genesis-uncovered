import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/states";
import { getComparison } from "@/lib/discover.functions";


export const Route = createFileRoute("/_authenticated/compare")({
  head: () => ({
    meta: [
      { title: "Compare origins — OriginVerse AI" },
      {
        name: "description",
        content: "Put two topics side by side and compare their origins, timelines and cultural impact.",
      },
      { property: "og:title", content: "Compare origins — OriginVerse AI" },
      { property: "og:description", content: "Side-by-side origin comparison powered by AI." },
    ],
  }),
  component: Compare,
});

function Compare() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const compare = useMutation({
    mutationFn: () => getComparison({ data: { a, b } }),
    onError: (error: Error) => toast.error(error.message),
  });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    compare.mutate();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
          Compare mode
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Two topics, one table — see how their histories differ and where they meet.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="glass-card gradient-ring grid gap-3 rounded-3xl p-5 sm:grid-cols-[1fr_auto_1fr_auto]"
      >
        <Input
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="Tea"
          aria-label="First topic"
          className="h-11 rounded-2xl"
        />
        <span className="hidden place-items-center text-muted-foreground sm:grid">
          <GitCompareArrows className="size-4" />
        </span>
        <Input
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="Coffee"
          aria-label="Second topic"
          className="h-11 rounded-2xl"
        />
        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="pressable"
          disabled={compare.isPending}
        >
          {compare.isPending ? "Comparing…" : "Compare"}
        </Button>
      </form>

      {compare.isPending && (
        <div className="glass-card skeleton-sweep space-y-3 rounded-3xl p-6">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!compare.isPending && !compare.data && (
        <EmptyState
          icon={<GitCompareArrows className="size-6" />}
          title="Nothing to compare yet"
          description="Enter two topics above — try “Tea” and “Coffee” — and we'll line up their origins side by side."
        />
      )}

      {compare.data && (
        <div className="glass-card animate-fade-up overflow-hidden rounded-3xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Origin comparison between {compare.data.topicA} and {compare.data.topicB}
              </caption>
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left">
                  <th scope="col" className="p-4 font-semibold">
                    Aspect
                  </th>
                  <th scope="col" className="p-4 font-semibold text-primary">
                    {compare.data.topicA}
                  </th>
                  <th scope="col" className="p-4 font-semibold text-cyan">
                    {compare.data.topicB}
                  </th>
                </tr>
              </thead>
              <tbody>
                {compare.data.rows.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-border/70 align-top transition-colors last:border-0 hover:bg-accent/40"
                  >
                    <td className="p-4 font-medium">{row.label}</td>
                    <td className="p-4 leading-relaxed text-muted-foreground">{row.a}</td>
                    <td className="p-4 leading-relaxed text-muted-foreground">{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border bg-muted/40 p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">Verdict</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {compare.data.verdict}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

