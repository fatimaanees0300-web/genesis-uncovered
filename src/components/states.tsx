import { Skeleton } from "@/components/ui/skeleton";

export function ReportSkeleton({ topic }: { topic?: string }) {
  return (
    <div className="space-y-4">
      <div className="glass-card rounded-3xl p-6">
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="mt-4 h-9 w-2/3" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
        <p className="mt-5 text-sm text-muted-foreground">
          Researching {topic ? <span className="font-semibold">{topic}</span> : "your topic"} across
          history, language and culture…
        </p>
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="glass-card rounded-2xl p-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="glass-card rounded-2xl p-8 text-center">
      <p className="font-display text-lg font-bold">Something interrupted the research</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="glass-card rounded-2xl p-10 text-center">
      <p className="font-display text-lg font-bold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
