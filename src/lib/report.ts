export type TimelineEntry = {
  year: string;
  title: string;
  description: string;
};

export type PersonEntry = {
  name: string;
  contribution: string;
};

export type ReferenceEntry = {
  title: string;
  note: string;
};

export type OriginReport = {
  topic: string;
  category: string;
  confidence: "High" | "Medium" | "Low";
  confidenceNote: string;
  overview: string;
  origin: string;
  etymology: string;
  historicalBackground: string;
  timeline: TimelineEntry[];
  evolution: string;
  people: PersonEntry[];
  milestones: string[];
  culturalImpact: string;
  modernRelevance: string;
  funFacts: string[];
  misconceptions: string[];
  relatedTopics: string[];
  references: ReferenceEntry[];
};

export type CompareReport = {
  topicA: string;
  topicB: string;
  rows: { label: string; a: string; b: string }[];
  verdict: string;
};

export const POPULAR_SEARCHES = [
  "Coffee",
  "Pizza",
  "Albert Einstein",
  "Internet",
  "DNA",
  "Google",
  "Artificial Intelligence",
  "Islam",
  "Pakistan",
];

export const CATEGORIES = [
  { name: "Foods", icon: "UtensilsCrossed", sample: "Chocolate" },
  { name: "Science", icon: "Atom", sample: "Gravity" },
  { name: "Technology", icon: "Cpu", sample: "Transistor" },
  { name: "History", icon: "Landmark", sample: "Silk Road" },
  { name: "Medicine", icon: "Stethoscope", sample: "Penicillin" },
  { name: "People", icon: "Users", sample: "Ada Lovelace" },
  { name: "Languages", icon: "Languages", sample: "Urdu" },
  { name: "Countries", icon: "Globe2", sample: "Japan" },
  { name: "Religions", icon: "Sparkle", sample: "Buddhism" },
  { name: "Companies", icon: "Building2", sample: "Toyota" },
];

export const REPORT_SECTIONS: { key: keyof OriginReport; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "origin", label: "Origin" },
  { key: "etymology", label: "Etymology" },
  { key: "historicalBackground", label: "Historical Background" },
  { key: "evolution", label: "Evolution" },
  { key: "culturalImpact", label: "Cultural Impact" },
  { key: "modernRelevance", label: "Modern Relevance" },
];

export const ASSISTANT_SYSTEM_PROMPT = `You are OriginVerse AI, an assistant that explains the origin, history, evolution and cultural significance of anything.

Always answer using this exact markdown structure, using "## " headings:
## Overview
## Origin
## Etymology
## Historical Background
## Timeline
## Evolution
## Key Contributors
## Importance
## Modern Relevance
## Fun Facts
## Misconceptions
## Related Topics
## References

Rules:
- Be accurate, concise and educational. Use bullet points where helpful.
- The Timeline section must be a bulleted list of "**year** — event" entries in chronological order.
- If historical evidence is uncertain, disputed or unknown, say so explicitly (e.g. "Evidence is uncertain: ...") instead of inventing facts.
- References must be real, well-known sources or scholarly traditions; never fabricate URLs or citations.
- If a question is not about origins, still answer helpfully, but keep the structure.`;
