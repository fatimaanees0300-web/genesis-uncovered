import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/originverse-logo.png";
import {
  createThread,
  deleteThread,
  getThreadMessages,
  listThreads,
} from "@/lib/threads.functions";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "AI assistant — OriginVerse AI" },
      {
        name: "description",
        content: "Ask the OriginVerse AI assistant follow-up questions in saved conversations.",
      },
      { property: "og:title", content: "AI assistant — OriginVerse AI" },
      { property: "og:description", content: "Threaded AI conversations about origins." },
    ],
  }),
  component: ChatThread,
});

function ChatThread() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const threads = useQuery({ queryKey: ["threads"], queryFn: () => listThreads() });
  const thread = useQuery({
    queryKey: ["thread", threadId],
    queryFn: () => getThreadMessages({ data: { threadId } }),
  });

  const create = useMutation({
    mutationFn: () => createThread({ data: {} }),
    onSuccess: (row) => {
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      navigate({ to: "/chat/$threadId", params: { threadId: row.id } });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteThread({ data: { id } }),
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({ queryKey: ["threads"] });
      if (id === threadId) navigate({ to: "/chat" });
    },
  });

  if (thread.isLoading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Shimmer>Loading conversation…</Shimmer>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block">
        <Button variant="hero" className="w-full" onClick={() => create.mutate()}>
          <Plus className="size-4" />
          New conversation
        </Button>
        <ul className="mt-3 space-y-1">
          {(threads.data ?? []).map((item) => (
            <li
              key={item.id}
              className={cn(
                "group flex items-center gap-1 rounded-xl px-1 transition-colors hover:bg-accent",
                item.id === threadId && "bg-accent",
              )}
            >
              <Link
                to="/chat/$threadId"
                params={{ threadId: item.id }}
                className="flex-1 truncate px-2 py-2 text-sm"
              >
                {item.title}
              </Link>
              <button
                aria-label="Delete conversation"
                onClick={() => remove.mutate(item.id)}
                className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <ChatWindow
        key={threadId}
        threadId={threadId}
        initialMessages={(thread.data?.messages ?? []) as unknown as UIMessage[]}
        onNewThread={() => create.mutate()}
      />
    </div>
  );
}

function ChatWindow({
  threadId,
  initialMessages,
  onNewThread,
}: {
  threadId: string;
  initialMessages: UIMessage[];
  onNewThread: () => void;
}) {
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { threadId },
      fetch: async (input, init) => {
        const { data } = await supabase.auth.getSession();
        const headers = new Headers(init?.headers);
        if (data.session) headers.set("Authorization", `Bearer ${data.session.access_token}`);
        return fetch(input, { ...init, headers });
      },
    }),
    onError: (error) => toast.error(error.message || "The assistant could not respond."),
    onFinish: () => {
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      textareaRef.current?.focus();
    },
  });

  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId]);

  const busy = status === "submitted" || status === "streaming";

  function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    sendMessage({ text });
  }

  return (
    <div className="glass-card flex h-[calc(100vh-13rem)] flex-col overflow-hidden rounded-2xl">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <img src={logo} alt="" width={24} height={24} className="size-6" />
        <p className="font-display text-sm font-bold">OriginVerse assistant</p>
        <Button variant="ghost" size="sm" className="ml-auto lg:hidden" onClick={onNewThread}>
          <Plus className="size-4" />
          New
        </Button>
      </div>

      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 && (
            <ConversationEmptyState
              icon={<img src={logo} alt="" width={40} height={40} className="size-10" />}
              title="Ask about any origin"
              description="Try “Where did chess come from?” or “How did the Urdu language form?”"
            />
          )}
          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent
                className={message.role === "assistant" ? "bg-transparent p-0" : undefined}
              >
                {message.parts.map((part, index) =>
                  part.type === "text" ? (
                    <MessageResponse key={index}>{part.text}</MessageResponse>
                  ) : null,
                )}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && <Shimmer>Thinking…</Shimmer>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border p-3">
        <PromptInput onSubmit={(_message, event) => submit(event)}>
          <PromptInputTextarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about the origin of anything…"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={!input.trim() && !busy} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
