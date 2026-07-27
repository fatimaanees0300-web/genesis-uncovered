import { AlertTriangle, Compass } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ReportSkeleton({ topic }: { topic?: string }) {
  return (
    <div className="space-y-4">
      <div className="glass-card skeleton-sweep rounded-3xl p-7">
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="mt-4 h-9 w-2/3 rounded-xl" />
        <Skeleton className="mt-4 h-4 w-full rounded-lg" />
        <Skeleton className="mt-2 h-4 w-5/6 rounded-lg" />
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="size-2 animate-pulse rounded-full bg-primary" aria-hidden="true" />
          Researching {topic ? <span className="font-semibold">{topic}</span> : "your topic"} across
          history, language and culture…
        </p>
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="glass-card skeleton-sweep animate-fade-up rounded-3xl p-6"
          style={{ animationDelay: `${i * 90}ms` }}
        >
          <Skeleton className="h-5 w-40 rounded-lg" />
          <Skeleton className="mt-3.5 h-4 w-full rounded-lg" />
          <Skeleton className="mt-2 h-4 w-4/5 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="glass-card animate-fade-up rounded-3xl p-10 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" />
      </span>
      <p className="font-display mt-5 text-lg font-bold">Something interrupted the research</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {message}
      </p>
      {onRetry && (
        <Button variant="hero" className="pressable mt-6" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="glass-card animate-fade-up rounded-3xl p-12 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[image:var(--gradient-brand)] text-primary-foreground shadow-[var(--shadow-lift)]">
        {icon ?? <Compass className="size-6" />}
      </span>
      <p className="font-display mt-5 text-lg font-bold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
