import type { TimelineEntry } from "@/lib/report";

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  if (!entries?.length) return null;
  return (
    <ol className="relative ml-3 border-l-2 border-border pl-6">
      {entries.map((entry, index) => (
        <li key={`${entry.year}-${index}`} className="relative pb-7 last:pb-0">
          <span className="absolute -left-[31px] top-1 grid size-4 place-items-center rounded-full bg-[image:var(--gradient-brand)] ring-4 ring-background" />
          <p className="font-display text-sm font-bold text-primary">{entry.year}</p>
          <p className="mt-0.5 font-semibold">{entry.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{entry.description}</p>
        </li>
      ))}
    </ol>
  );
}
