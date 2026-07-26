import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { UIMessage } from "ai";

export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("chat_threads")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { title?: string }) => data ?? {})
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("chat_threads")
      .insert({ user_id: context.userId, title: data?.title?.slice(0, 80) || "New conversation" })
      .select("id, title, updated_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const renameThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; title: string }) => data)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("chat_threads")
      .update({ title: data.title.slice(0, 80) })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("chat_threads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getThreadMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { threadId: string }) => data)
  .handler(async ({ data, context }) => {
    const thread = await context.supabase
      .from("chat_threads")
      .select("id, title")
      .eq("id", data.threadId)
      .maybeSingle();
    if (thread.error) throw new Error(thread.error.message);
    if (!thread.data) throw new Error("Conversation not found.");

    const { data: rows, error } = await context.supabase
      .from("chat_messages")
      .select("id, role, parts, client_message_id")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    const messages = (rows ?? []).map((row) => ({
      id: row.client_message_id ?? row.id,
      role: row.role as "user" | "assistant",
      parts: (row.parts ?? []) as UIMessage["parts"],
    })) as UIMessage[];

    return { thread: thread.data, messages };
  });
