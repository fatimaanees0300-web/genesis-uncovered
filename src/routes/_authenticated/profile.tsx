import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import { deleteAccount, getProfile, updateProfile } from "@/lib/library.functions";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — OriginVerse AI" },
      { name: "description", content: "Manage your OriginVerse AI profile, theme and account." },
      { property: "og:title", content: "Profile — OriginVerse AI" },
      { property: "og:description", content: "Your OriginVerse AI account settings." },
    ],
  }),
  component: Profile,
});

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ur", label: "Urdu" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "ar", label: "Arabic" },
];

function Profile() {
  const { user } = useSession();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const profile = useQuery({ queryKey: ["profile"], queryFn: () => getProfile() });
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (profile.data) {
      setName(profile.data.display_name ?? "");
      setLanguage(profile.data.language ?? "en");
    }
  }, [profile.data]);

  const save = useMutation({
    mutationFn: () => updateProfile({ data: { display_name: name, language } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeAccount = useMutation({
    mutationFn: () => deleteAccount(),
    onSuccess: async () => {
      await supabase.auth.signOut();
      queryClient.clear();
      navigate({ to: "/", replace: true });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[image:var(--gradient-brand)] text-lg font-extrabold text-primary-foreground shadow-[var(--shadow-lift)]">
          {(name || user?.email || "?").charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h1 className="font-display truncate text-3xl font-extrabold tracking-tight">
            {name || "Profile"}
          </h1>
          <p className="mt-1 truncate text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <div className="glass-card space-y-6 rounded-3xl p-7">
        <div className="space-y-2">
          <Label htmlFor="display-name">Display name</Label>
          <Input
            id="display-name"
            className="h-11 rounded-2xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Preferred language</Label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-11 w-full rounded-2xl border border-input bg-card px-3.5 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
          >
            {LANGUAGES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/50 p-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold">Dark mode</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Easier reading at night.</p>
          </div>
          <Switch checked={dark} onCheckedChange={toggle} aria-label="Toggle dark mode" />
        </div>
        <Button
          variant="hero"
          size="lg"
          className="pressable"
          onClick={() => save.mutate()}
          disabled={save.isPending}
        >
          {save.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>

      <div className="glass-card rounded-3xl border-destructive/30 p-7">
        <h2 className="font-display text-base font-bold">Danger zone</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Deleting your account permanently removes your saved reports, history and conversations.
        </p>
        <Button
          variant="destructive"
          className="pressable mt-5"
          disabled={removeAccount.isPending}
          onClick={() => {
            if (window.confirm("Delete your account and all data? This cannot be undone.")) {
              removeAccount.mutate();
            }
          }}
        >
          Delete account
        </Button>
      </div>
    </div>
  );
}

