import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

type Search = { mode?: "signin" | "signup"; redirect?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    mode: search.mode === "signup" ? "signup" : "signin",
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — OriginVerse AI" },
      {
        name: "description",
        content: "Sign in or create your free OriginVerse AI account to start discovering origins.",
      },
      { property: "og:title", content: "Sign in — OriginVerse AI" },
      { property: "og:description", content: "Access your OriginVerse AI library and assistant." },
    ],
  }),
  component: AuthPage,
});

function safePath(value?: string) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const target = safePath(search.redirect);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: target, replace: true });
    });
  }, [navigate, target]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${target}`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created — welcome to OriginVerse AI!");
        navigate({ to: target });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: target });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  async function googleSignIn() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}${target}`,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: target });
  }

  async function forgotPassword() {
    if (!email) return toast.error("Enter your email first.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return toast.error(error.message);
    toast.success("Password reset link sent.");
  }

  return (
    <div className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-background px-5 py-14">
      <div className="halo pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]" />
      <div className="dot-grid pointer-events-none absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(60%_50%_at_50%_0%,#000,transparent)]" />
      <div className="blob -z-10 left-[-10%] top-10 size-[320px] bg-primary/30" aria-hidden="true" />
      <div
        className="blob -z-10 right-[-10%] top-40 size-[340px] bg-cyan/30 [animation-delay:-7s]"
        aria-hidden="true"
      />
      <div className="w-full max-w-md animate-fade-up">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="glass-card gradient-ring mt-8 rounded-[1.75rem] p-8 shadow-[var(--shadow-lift)]">
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Start exploring the origin of everything."
              : "Sign in to continue your discoveries."}
          </p>

          <Button
            variant="outline"
            size="lg"
            className="pressable mt-6 w-full"
            onClick={googleSignIn}
            type="button"
          >
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs font-medium text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or use email
            <span className="h-px flex-1 bg-border" />
          </div>


          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={busy}>
              {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </Button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm">
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            >
              {mode === "signup" ? "Have an account? Sign in" : "New here? Create account"}
            </button>
            {mode === "signin" && (
              <button
                type="button"
                onClick={forgotPassword}
                className="text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </button>
            )}
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
