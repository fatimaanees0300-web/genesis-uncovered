import { generateText } from "ai";
import {
  createLovableAiGatewayProvider,
  ORIGINVERSE_MODEL,
  requireGatewayKey,
} from "./ai-gateway.server";
import type { CompareReport, OriginReport } from "./report";

function extractJson<T>(raw: string): T {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced ? fenced[1] : raw).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("The AI returned an unexpected response.");
  return JSON.parse(candidate.slice(start, end + 1)) as T;
}

async function complete(prompt: string, system: string): Promise<string> {
  const gateway = createLovableAiGatewayProvider(requireGatewayKey());
  try {
    const { text } = await generateText({
      model: gateway(ORIGINVERSE_MODEL),
      system,
      prompt,
    });
    return text;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("429")) throw new Error("Too many requests right now. Try again shortly.");
    if (message.includes("402"))
      throw new Error("AI credits are exhausted. Add credits to keep exploring.");
    console.error("[OriginVerse AI]", message);
    throw new Error("The AI could not complete this request. Please try again.");
  }
}

const REPORT_SYSTEM = `You are OriginVerse AI, a rigorous origins researcher.
Return ONLY minified JSON, no prose, no code fences, matching this TypeScript type:
{
  "topic": string, "category": string,
  "confidence": "High" | "Medium" | "Low", "confidenceNote": string,
  "overview": string, "origin": string, "etymology": string,
  "historicalBackground": string,
  "timeline": { "year": string, "title": string, "description": string }[],
  "evolution": string,
  "people": { "name": string, "contribution": string }[],
  "milestones": string[], "culturalImpact": string, "modernRelevance": string,
  "funFacts": string[], "misconceptions": string[], "relatedTopics": string[],
  "references": { "title": string, "note": string }[]
}
Rules: 8-14 timeline entries in chronological order; 3-6 people; 4-6 milestones, fun facts, misconceptions and related topics; 3-6 references to real, verifiable sources (no invented URLs).
Prose fields are 2-5 sentences each. Where historical evidence is uncertain or disputed, say so explicitly inside the relevant field and lower the confidence level.`;

export async function buildReport(topic: string): Promise<OriginReport> {
  const text = await complete(
    `Produce a complete origin report about: "${topic}".`,
    REPORT_SYSTEM,
  );
  const report = extractJson<OriginReport>(text);
  return { ...report, topic: report.topic || topic };
}

export async function buildComparison(a: string, b: string): Promise<CompareReport> {
  const text = await complete(
    `Compare "${a}" and "${b}".`,
    `You are OriginVerse AI. Return ONLY minified JSON matching:
{"topicA":string,"topicB":string,"rows":{"label":string,"a":string,"b":string}[],"verdict":string}
rows must cover exactly these labels in order: "Origins", "Timeline", "Evolution", "Modern Usage", "Fun Facts".
Each cell is 2-4 sentences. State uncertainty where evidence is disputed. The verdict is a balanced 2-3 sentence summary, not a winner declaration unless the facts clearly support one.`,
  );
  return extractJson<CompareReport>(text);
}

export type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export async function buildQuiz(topic: string): Promise<QuizQuestion[]> {
  const text = await complete(
    `Create a 5-question multiple choice quiz about the origin and history of "${topic}".`,
    `Return ONLY minified JSON: {"questions":{"question":string,"options":string[4],"answerIndex":number,"explanation":string}[]}. Only use facts that are well established.`,
  );
  return extractJson<{ questions: QuizQuestion[] }>(text).questions;
}

export async function buildRetelling(topic: string, mode: "eli5" | "story"): Promise<string> {
  const system =
    mode === "eli5"
      ? `Explain like the reader is five years old: warm, simple, short sentences, no jargon. 150-220 words. Plain markdown.`
      : `Tell the origin as a vivid short story with scenes and human detail, historically faithful. 250-350 words. Plain markdown. Note clearly if any part is legend rather than documented history.`;
  return complete(`Topic: "${topic}".`, system);
}

export async function buildDailyDiscovery(): Promise<{ topic: string; teaser: string }> {
  const seed = new Date().toISOString().slice(0, 10);
  const text = await complete(
    `Today is ${seed}. Pick one genuinely interesting topic whose origin story surprises people.`,
    `Return ONLY minified JSON: {"topic":string,"teaser":string}. The teaser is one intriguing sentence (max 160 characters).`,
  );
  return extractJson<{ topic: string; teaser: string }>(text);
}
