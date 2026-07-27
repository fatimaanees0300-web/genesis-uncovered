import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SearchBar({
  className,
  autoFocus,
  initial = "",
  placeholder = "Search anything — a food, invention, person, country, idea…",
}: {
  className?: string;
  autoFocus?: boolean;
  initial?: string;
  placeholder?: string;
}) {
  const navigate = useNavigate();
  const [value, setValue] = useState(initial);
  const [focused, setFocused] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const topic = value.trim();
    if (!topic) return;
    navigate({ to: "/discover/$topic", params: { topic } });
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-1 rounded-[1.6rem] bg-[image:var(--gradient-brand)] opacity-0 blur-lg transition-opacity duration-500",
          focused && "opacity-40",
        )}
      />
      <form
        onSubmit={onSubmit}
        className={cn(
          "glass-card relative flex w-full items-center gap-2 rounded-2xl p-2 pl-4 shadow-lg transition-all duration-300",
          focused && "shadow-[var(--shadow-lift)]",
        )}
      >
        <Search
          className={cn(
            "size-5 shrink-0 transition-colors duration-300",
            focused ? "text-primary" : "text-muted-foreground",
          )}
          aria-hidden="true"
        />
        <input
          value={value}
          autoFocus={autoFocus}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          aria-label="Search a topic"
          className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
        <Button type="submit" variant="hero" className="pressable shrink-0">
          Discover
        </Button>
      </form>
    </div>
  );
}
