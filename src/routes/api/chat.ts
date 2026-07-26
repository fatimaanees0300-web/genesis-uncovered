import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  createLovableAiGatewayProvider,
  ORIGINVERSE_MODEL,
} from "@/lib/ai-gateway.server";
import { ASSISTANT_SYSTEM_PROMPT } from "@/lib/report";
import type { Database, Json } from "@/integrations/supabase/types";

type ChatBody = { messages?: UIMessage[]; threadId?: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) return new Response("Unauthorized", { status: 401 });

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
        const aiKey = process.env.LOVABLE_API_KEY;
        if (!supabaseUrl || !supabaseKey) return new Response("Backend not configured", { status: 500 });
        if (!aiKey) return new Response("AI is not configured", { status: 500 });

        const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
          auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
          global: {
            fetch: (input, init) => {
              const headers = new Headers(init?.headers);
              headers.delete("Authorization");
              headers.set("apikey", supabaseKey);
              headers.set("Authorization", `Bearer ${token}`);
              return fetch(input, { ...init, headers });
            },
          },
        });

        const { data: claims } = await supabase.auth.getClaims(token);
        const userId = claims?.claims?.sub;
        if (!userId) return new Response("Unauthorized", { status: 401 });

        const body = (await request.json()) as ChatBody;
        const messages = body.messages;
        const threadId = body.threadId;
        if (!Array.isArray(messages) || !threadId) {
          return new Response("Messages and threadId are required", { status: 400 });
        }

        const { data: thread } = await supabase
          .from("chat_threads")
          .select("id, title")
          .eq("id", threadId)
          .maybeSingle();
        if (!thread) return new Response("Conversation not found", { status: 404 });

        const last = messages[messages.length - 1];
        if (last?.role === "user") {
          const { error } = await supabase.from("chat_messages").insert({
            thread_id: threadId,
            user_id: userId,
            role: "user",
            client_message_id: last.id,
            parts: last.parts as unknown as Json,
          });
          if (error) console.error("[chat] failed to save user message", error.message);

          const firstText = last.parts.find((p) => p.type === "text");
          if (thread.title === "New conversation" && firstText && "text" in firstText) {
            await supabase
              .from("chat_threads")
              .update({ title: String(firstText.text).slice(0, 60) })
              .eq("id", threadId);
          }
        }

        const gateway = createLovableAiGatewayProvider(aiKey);
        const result = streamText({
          model: gateway(ORIGINVERSE_MODEL),
          system: ASSISTANT_SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages,
          onFinish: async ({ responseMessage }) => {
            const { error } = await supabase.from("chat_messages").insert({
              thread_id: threadId,
              user_id: userId,
              role: "assistant",
              client_message_id: responseMessage.id,
              parts: responseMessage.parts as unknown as Json,
            });
            if (error) console.error("[chat] failed to save assistant message", error.message);
            await supabase
              .from("chat_threads")
              .update({ updated_at: new Date().toISOString() })
              .eq("id", threadId);
          },
        });
      },
    },
  },
});
