import { Link } from "@tanstack/react-router";
import logo from "@/assets/originverse-logo.png";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  to = "/",
  showText = true,
  size = 36,
}: {
  className?: string;
  to?: string;
  showText?: boolean;
  size?: number;
}) {
  return (
    <Link to={to} className={cn("group inline-flex items-center gap-2.5", className)}>
      <img
        src={logo}
        alt="OriginVerse AI"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="transition-transform duration-300 group-hover:rotate-12"
      />
      {showText && (
        <span className="font-display text-lg font-extrabold tracking-tight">
          Origin<span className="gradient-text">Verse</span>
        </span>
      )}
    </Link>
  );
}
