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

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const topic = value.trim();
    if (!topic) return;
    navigate({ to: "/discover/$topic", params: { topic } });
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "glass-card flex w-full items-center gap-2 rounded-2xl p-2 pl-4 shadow-lg",
        className,
      )}
    >
      <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden />
      <input
        value={value}
        autoFocus={autoFocus}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label="Search a topic"
        className="h-11 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
      />
      <Button type="submit" variant="hero" className="shrink-0">
        Discover
      </Button>
    </form>
  );
}
