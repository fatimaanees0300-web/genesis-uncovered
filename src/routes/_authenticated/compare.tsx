import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Compare mode</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Two topics, one table — see how their histories differ and where they meet.
        </p>
      </div>

      <form onSubmit={onSubmit} className="glass-card grid gap-3 rounded-2xl p-5 sm:grid-cols-[1fr_auto_1fr_auto]">
        <Input value={a} onChange={(e) => setA(e.target.value)} placeholder="Tea" />
        <span className="hidden place-items-center text-muted-foreground sm:grid">
          <GitCompareArrows className="size-4" />
        </span>
        <Input value={b} onChange={(e) => setB(e.target.value)} placeholder="Coffee" />
        <Button type="submit" variant="hero" disabled={compare.isPending}>
          {compare.isPending ? "Comparing…" : "Compare"}
        </Button>
      </form>

      {compare.isPending && (
        <div className="glass-card space-y-3 rounded-2xl p-6">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}

      {compare.data && (
        <div className="glass-card overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="p-4 font-semibold">Aspect</th>
                <th className="p-4 font-semibold text-primary">{compare.data.topicA}</th>
                <th className="p-4 font-semibold text-cyan">{compare.data.topicB}</th>
              </tr>
            </thead>
            <tbody>
              {compare.data.rows.map((row) => (
                <tr key={row.label} className="border-b border-border/70 align-top last:border-0">
                  <td className="p-4 font-medium">{row.label}</td>
                  <td className="p-4 text-muted-foreground">{row.a}</td>
                  <td className="p-4 text-muted-foreground">{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-border bg-muted/40 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-gold">Verdict</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {compare.data.verdict}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
