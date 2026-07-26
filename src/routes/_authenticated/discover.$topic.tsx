import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Baby, BookMarked, MessageCircle, Printer, ScrollText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportSkeleton, ErrorState } from "@/components/states";
import { ReportView } from "@/components/report-view";
import { SearchBar } from "@/components/search-bar";
import { getOriginReport, getQuiz, getRetelling } from "@/lib/discover.functions";
import { saveReport } from "@/lib/library.functions";

export const Route = createFileRoute("/_authenticated/discover/$topic")({
  head: ({ params }) => ({
    meta: [
      { title: `The origin of ${params.topic} — OriginVerse AI` },
      {
        name: "description",
        content: `An AI-researched report on the origin, history, evolution and cultural significance of ${params.topic}.`,
      },
      { property: "og:title", content: `The origin of ${params.topic} — OriginVerse AI` },
      {
        property: "og:description",
        content: `Timeline, etymology and cultural impact of ${params.topic}.`,
      },
    ],
  }),
  component: Discover,
});

function Discover() {
  const { topic } = Route.useParams();
  const [retelling, setRetelling] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<
    { question: string; options: string[]; answerIndex: number; explanation: string }[] | null
  >(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const report = useQuery({
    queryKey: ["report", topic],
    queryFn: () => getOriginReport({ data: { topic } }),
    retry: false,
  });

  const save = useMutation({
    mutationFn: () => saveReport({ data: { report: report.data! } }),
    onSuccess: () => toast.success("Saved to your library."),
    onError: (error: Error) => toast.error(error.message),
  });

  const retell = useMutation({
    mutationFn: (mode: "eli5" | "story") => getRetelling({ data: { topic, mode } }),
    onSuccess: (data) => setRetelling(data.text),
    onError: (error: Error) => toast.error(error.message),
  });

  const quizMutation = useMutation({
    mutationFn: () => getQuiz({ data: { topic } }),
    onSuccess: (data) => {
      setQuiz(data.questions);
      setAnswers({});
    },
    onError: (error: Error) => toast.error(error.message),
  });

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: `Origin of ${topic}`, url }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied.");
  }

  return (
    <div className="space-y-6">
      <SearchBar initial={topic} />

      {report.isLoading && <ReportSkeleton topic={topic} />}
      {report.isError && (
        <ErrorState
          message={(report.error as Error).message}
          onRetry={() => report.refetch()}
        />
      )}

      {report.data && (
        <>
          <div className="flex flex-wrap gap-2">
            <Button variant="hero" onClick={() => save.mutate()} disabled={save.isPending}>
              <BookMarked className="size-4" />
              {save.isPending ? "Saving…" : "Save"}
            </Button>
            <Button variant="outline" onClick={() => retell.mutate("eli5")}>
              <Baby className="size-4" />
              Explain like I'm 5
            </Button>
            <Button variant="outline" onClick={() => retell.mutate("story")}>
              <ScrollText className="size-4" />
              Story mode
            </Button>
            <Button variant="outline" onClick={() => quizMutation.mutate()}>
              Quiz me
            </Button>
            <Button variant="outline" onClick={share}>
              <Share2 className="size-4" />
              Share
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" />
              Print
            </Button>
            <Button variant="glass" asChild>
              <Link to="/chat">
                <MessageCircle className="size-4" />
                Ask follow-ups
              </Link>
            </Button>
          </div>

          {(retell.isPending || retelling) && (
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-base font-bold">Simplified retelling</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {retell.isPending ? "Rewriting…" : retelling}
              </p>
            </div>
          )}

          {quiz && (
            <div className="glass-card space-y-5 rounded-2xl p-6">
              <h2 className="font-display text-base font-bold">Quick quiz</h2>
              {quiz.map((question, qi) => (
                <div key={qi}>
                  <p className="text-sm font-semibold">{question.question}</p>
                  <div className="mt-2 grid gap-2">
                    {question.options.map((option, oi) => {
                      const chosen = answers[qi];
                      const isChosen = chosen === oi;
                      const correct = question.answerIndex === oi;
                      return (
                        <button
                          key={oi}
                          onClick={() => setAnswers((prev) => ({ ...prev, [qi]: oi }))}
                          className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                            chosen === undefined
                              ? "border-border hover:bg-accent"
                              : correct
                                ? "border-cyan/50 bg-cyan/10"
                                : isChosen
                                  ? "border-destructive/50 bg-destructive/10"
                                  : "border-border opacity-70"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {answers[qi] !== undefined && (
                    <p className="mt-2 text-xs text-muted-foreground">{question.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <ReportView report={report.data} />
        </>
      )}
    </div>
  );
}
