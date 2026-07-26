import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { createThread, listThreads } from "@/lib/threads.functions";

export const Route = createFileRoute("/_authenticated/chat/")({
  head: () => ({
    meta: [
      { title: "AI assistant — OriginVerse AI" },
      {
        name: "description",
        content: "Chat with the OriginVerse AI assistant about the origin of anything.",
      },
      { property: "og:title", content: "AI assistant — OriginVerse AI" },
      { property: "og:description", content: "Threaded conversations about history and origins." },
    ],
  }),
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  const threads = useQuery({ queryKey: ["threads"], queryFn: () => listThreads() });
  const create = useMutation({
    mutationFn: () => createThread({ data: {} }),
    onSuccess: (thread) =>
      navigate({ to: "/chat/$threadId", params: { threadId: thread.id }, replace: true }),
  });

  useEffect(() => {
    if (threads.isLoading || create.isPending || create.isSuccess) return;
    const first = threads.data?.[0];
    if (first) {
      navigate({ to: "/chat/$threadId", params: { threadId: first.id }, replace: true });
    } else if (threads.data) {
      create.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threads.data, threads.isLoading]);

  return (
    <div className="grid min-h-[50vh] place-items-center">
      <Shimmer>Opening your conversations…</Shimmer>
    </div>
  );
}
