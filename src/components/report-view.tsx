import { useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  Brain,
  ChevronDown,
  Lightbulb,
  Quote,
  Sparkle,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { REPORT_SECTIONS, type OriginReport } from "@/lib/report";
import { Timeline } from "@/components/timeline";

function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: typeof BookOpen;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="glass-card overflow-hidden rounded-3xl transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-6 py-5 text-left transition-colors hover:bg-accent/40"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[image:var(--gradient-brand)] text-primary-foreground shadow-sm">
          <Icon className="size-4" />
        </span>
        <h2 className="font-display min-w-0 flex-1 text-base font-bold">{title}</h2>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="animate-fade-up px-6 pb-6 pt-0 text-sm leading-relaxed">{children}</div>
      )}
    </section>
  );
}


const CONFIDENCE_STYLES: Record<string, string> = {
  High: "bg-cyan/15 text-cyan border-cyan/30",
  Medium: "bg-gold/15 text-gold border-gold/30",
  Low: "bg-destructive/10 text-destructive border-destructive/30",
};

export function ReportView({ report }: { report: OriginReport }) {
  return (
    <div className="space-y-4">
      <div className="glass-card rounded-3xl p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{report.category}</Badge>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
              CONFIDENCE_STYLES[report.confidence] ?? CONFIDENCE_STYLES.Medium,
            )}
          >
            <BadgeCheck className="size-3.5" />
            {report.confidence} confidence
          </span>
        </div>
        <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
          The origin of <span className="gradient-text">{report.topic}</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{report.overview}</p>
        {report.confidenceNote && (
          <p className="mt-3 flex gap-2 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
            {report.confidenceNote}
          </p>
        )}
      </div>

      {REPORT_SECTIONS.filter((s) => s.key !== "overview").map((section) => {
        const value = report[section.key];
        if (typeof value !== "string" || !value) return null;
        return (
          <Section key={section.key} title={section.label} icon={BookOpen}>
            <p className="whitespace-pre-line text-muted-foreground">{value}</p>
          </Section>
        );
      })}

      {report.timeline?.length > 0 && (
        <Section title="Timeline" icon={Sparkle}>
          <Timeline entries={report.timeline} />
        </Section>
      )}

      {report.people?.length > 0 && (
        <Section title="Key contributors" icon={Users}>
          <ul className="space-y-3">
            {report.people.map((person) => (
              <li key={person.name}>
                <p className="font-semibold">{person.name}</p>
                <p className="text-muted-foreground">{person.contribution}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {report.milestones?.length > 0 && (
        <Section title="Major milestones" icon={Brain}>
          <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
            {report.milestones.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      {report.funFacts?.length > 0 && (
        <Section title="Fun facts" icon={Lightbulb}>
          <ul className="grid gap-2 sm:grid-cols-2">
            {report.funFacts.map((fact, i) => (
              <li key={i} className="rounded-xl bg-muted/60 p-3 text-muted-foreground">
                {fact}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {report.misconceptions?.length > 0 && (
        <Section title="Common misconceptions" icon={TriangleAlert} defaultOpen={false}>
          <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
            {report.misconceptions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      {report.relatedTopics?.length > 0 && (
        <Section title="Related topics" icon={Sparkle}>
          <div className="flex flex-wrap gap-2">
            {report.relatedTopics.map((topic) => (
              <Link
                key={topic}
                to="/discover/$topic"
                params={{ topic }}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
              >
                {topic}
              </Link>
            ))}
          </div>
        </Section>
      )}

      {report.references?.length > 0 && (
        <Section title="References" icon={Quote} defaultOpen={false}>
          <ul className="space-y-2">
            {report.references.map((reference, i) => (
              <li key={i}>
                <p className="font-medium">{reference.title}</p>
                <p className="text-muted-foreground">{reference.note}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
