import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getOriginReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { topic: string }) => {
    const topic = data.topic?.trim();
    if (!topic) throw new Error("Please enter something to discover.");
    return { topic: topic.slice(0, 120) };
  })
  .handler(async ({ data, context }) => {
    const { buildReport } = await import("./discover.server");
    const report = await buildReport(data.topic);
    await context.supabase
      .from("search_history")
      .insert({ user_id: context.userId, query: data.topic, category: report.category ?? null });
    return report;
  });

export const getComparison = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { a: string; b: string }) => {
    const a = data.a?.trim();
    const b = data.b?.trim();
    if (!a || !b) throw new Error("Enter two topics to compare.");
    return { a: a.slice(0, 120), b: b.slice(0, 120) };
  })
  .handler(async ({ data }) => {
    const { buildComparison } = await import("./discover.server");
    return buildComparison(data.a, data.b);
  });

export const getQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { topic: string }) => ({ topic: data.topic.trim().slice(0, 120) }))
  .handler(async ({ data }) => {
    const { buildQuiz } = await import("./discover.server");
    return buildQuiz(data.topic);
  });

export const getRetelling = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { topic: string; mode: "eli5" | "story" }) => ({
    topic: data.topic.trim().slice(0, 120),
    mode: data.mode === "story" ? ("story" as const) : ("eli5" as const),
  }))
  .handler(async ({ data }) => {
    const { buildRetelling } = await import("./discover.server");
    return { text: await buildRetelling(data.topic, data.mode) };
  });

export const getDailyDiscovery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { buildDailyDiscovery } = await import("./discover.server");
    return buildDailyDiscovery();
  });
