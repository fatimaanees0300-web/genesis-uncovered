import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { OriginReport } from "./report";

export const listLibrary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [saved, history] = await Promise.all([
      context.supabase
        .from("saved_reports")
        .select("id, topic, summary, collection, is_favourite, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      context.supabase
        .from("search_history")
        .select("id, query, category, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    if (saved.error) throw new Error(saved.error.message);
    if (history.error) throw new Error(history.error.message);
    return { saved: saved.data ?? [], history: history.data ?? [] };
  });

export const saveReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { report: OriginReport; collection?: string }) => data)
  .handler(async ({ data, context }) => {
    const { error, data: row } = await context.supabase
      .from("saved_reports")
      .insert({
        user_id: context.userId,
        topic: data.report.topic,
        summary: data.report.overview?.slice(0, 400) ?? null,
        content: data.report as unknown as Json,
        collection: data.collection?.trim() || "General",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const getSavedReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("saved_reports")
      .select("id, topic, content, collection, is_favourite")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("That saved discovery no longer exists.");
    return { ...row, content: row.content as unknown as OriginReport };
  });

export const toggleFavourite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; value: boolean }) => data)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("saved_reports")
      .update({ is_favourite: data.value })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSaved = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("saved_reports").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const clearHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("search_history")
      .delete()
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("id, display_name, avatar_url, language")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (
      data ?? { id: context.userId, display_name: null, avatar_url: null, language: "en" }
    );
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { display_name?: string; avatar_url?: string; language?: string }) => data)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .upsert({ id: context.userId, ...data }, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
