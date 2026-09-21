import type { Difficulty, Syllabus, Topic } from "../types";
import { unpack } from "./codec";
import { bankMCQ, pick, randInt } from "./utils";
import { moreBusinessTopics } from "./electivesMore";
import { businessWordProblems } from "./wordProblemsMore";

const OWNERSHIP: [string, string][] = unpack("W1siaXMgb3duZWQgYW5kIHJ1biBieSBvbmUgcGVyc29uIHdobyBpcyBwZXJzb25hbGx5IHJlc3BvbnNpYmxlIGZvciBhbGwgYnVzaW5lc3MgZGVidHMiLCJzb2xlIHRyYWRlciJdLFsiaXMgb3duZWQgYnkgdHdvIG9yIG1vcmUgcGVvcGxlIHdobyBzaGFyZSB0aGUgcHJvZml0cyBhbmQgZGVjaXNpb24tbWFraW5nIiwicGFydG5lcnNoaXAiXSxbImlzIGEgc2VwYXJhdGUgbGVnYWwgZW50aXR5IG93bmVkIGJ5IHNoYXJlaG9sZGVycyB3aG8gaGF2ZSBsaW1pdGVkIGxpYWJpbGl0eSIsImNvbXBhbnkiXSxbImlzIHRoZSBlYXNpZXN0IGFuZCBjaGVhcGVzdCBzdHJ1Y3R1cmUgdG8gc2V0IHVwLCBhbmQgdGhlIG93bmVyIGtlZXBzIGFsbCB0aGUgcHJvZml0Iiwic29sZSB0cmFkZXIiXSxbImNhbiByYWlzZSBsYXJnZSBhbW91bnRzIG9mIGNhcGl0YWwgYnkgaXNzdWluZyBzaGFyZXMiLCJjb21wYW55Il0sWyJoYXMgb3duZXJzIHdobyBjYW4gYmUgcGVyc29uYWxseSBsaWFibGUgZm9yIGVhY2ggb3RoZXIncyBidXNpbmVzcyBkZWJ0cyIsInBhcnRuZXJzaGlwIl0sWyJtdXN0IHB1Ymxpc2ggYW5udWFsIGFjY291bnRzIGFuZCBwYXkgY29tcGFueSB0YXgiLCJjb21wYW55Il0sWyJtYWtlcyBkZWNpc2lvbnMgcXVpY2tseSBiZWNhdXNlIHRoZXJlIGlzIG9ubHkgb25lIG93bmVyIiwic29sZSB0cmFkZXIiXV0=");
const MARKETING_MIX: [string, string][] = unpack("W1siT2ZmZXJpbmcgYSBkaXNjb3VudCBmb3IgdGhlIGZpcnN0IHdlZWsgb2Ygc2FsZXMiLCJwcmljZSJdLFsiQWR2ZXJ0aXNpbmcgb24gc29jaWFsIG1lZGlhIiwicHJvbW90aW9uIl0sWyJTZWxsaW5nIHRocm91Z2ggYW4gb25saW5lIHN0b3JlIGFuZCBpbiBzdXBlcm1hcmtldHMiLCJwbGFjZSJdLFsiRGVzaWduaW5nIGEgYmF0dGVyeSB0aGF0IGxhc3RzIGxvbmdlciIsInByb2R1Y3QiXSxbIlNwb25zb3JpbmcgYSBsb2NhbCBzcG9ydHMgdGVhbSIsInByb21vdGlvbiJdLFsiT3BlbmluZyBhIHN0b3JlIGluIGEgYnVzeSBzaG9wcGluZyBjZW50cmUiLCJwbGFjZSJdLFsiT2ZmZXJpbmcgY3VzdG9tZXJzIGludGVyZXN0LWZyZWUgcGF5bWVudCBwbGFucyIsInByaWNlIl0sWyJDaG9vc2luZyB0aGUgcGFja2FnaW5nIGFuZCBmZWF0dXJlcyBvZiBhIG5ldyBkcmluayIsInByb2R1Y3QiXV0=");
const SWOT: [string, string][] = unpack("W1siQSBza2lsbGVkIGFuZCBsb3lhbCB3b3JrZm9yY2UiLCJzdHJlbmd0aCJdLFsiT3V0ZGF0ZWQgZXF1aXBtZW50Iiwid2Vha25lc3MiXSxbIkdyb3dpbmcgZGVtYW5kIGZvciBlY28tZnJpZW5kbHkgcHJvZHVjdHMiLCJvcHBvcnR1bml0eSJdLFsiQSBuZXcgY29tcGV0aXRvciBlbnRlcmluZyB0aGUgbWFya2V0IiwidGhyZWF0Il0sWyJTdHJvbmcgYnJhbmQgcmVjb2duaXRpb24iLCJzdHJlbmd0aCJdLFsiSGlnaCBzdGFmZiB0dXJub3ZlciIsIndlYWtuZXNzIl0sWyJOZXcgZXhwb3J0IG1hcmtldHMgb3BlbmluZyB1cCIsIm9wcG9ydHVuaXR5Il0sWyJSaXNpbmcgcmF3IG1hdGVyaWFsIGNvc3RzIiwidGhyZWF0Il0sWyJBIHByaW1lIHNob3Bmcm9udCBsb2NhdGlvbiIsInN0cmVuZ3RoIl0sWyJBIHBvb3Igb25saW5lIHByZXNlbmNlIiwid2Vha25lc3MiXSxbIkdvdmVybm1lbnQgZ3JhbnRzIGZvciBzbWFsbCBidXNpbmVzc2VzIiwib3Bwb3J0dW5pdHkiXSxbIk5ldyByZWd1bGF0aW9ucyB0aGF0IGluY3JlYXNlIGNvc3RzIiwidGhyZWF0Il1d");
const OBJECTIVES: [string, string][] = unpack("W1siQSBjYWZlIGN1dHMgaXRzIHByaWNlcyBpbiBhIHNsb3cgd2ludGVyIGp1c3QgdG8gY292ZXIgaXRzIGNvc3RzIiwic3Vydml2YWwiXSxbIkEgY29tcGFueSBvcGVucyB0aHJlZSBuZXcgYnJhbmNoZXMgaW4gb3RoZXIgY2l0aWVzIiwiZ3Jvd3RoIl0sWyJBIGZpcm0gZG9uYXRlcyBwYXJ0IG9mIGl0cyBwcm9maXQgdG8gbG9jYWwgY2hhcml0aWVzIiwic29jaWFsIHJlc3BvbnNpYmlsaXR5Il0sWyJBIHNob3AgcmFpc2VzIGl0cyBwcmljZXMgdG8gZWFybiBtb3JlIG9uIGV2ZXJ5IHNhbGUiLCJwcm9maXQiXSxbIkEgc3RhcnQtdXAgYWNjZXB0cyBhIGxvdy1tYXJnaW4gY29udHJhY3QgdG8ga2VlcCB0cmFkaW5nIHVudGlsIG5leHQgcXVhcnRlciIsInN1cnZpdmFsIl0sWyJBIGJ1c2luZXNzIHVzZXMgb25seSByZWN5Y2xlZCBwYWNrYWdpbmcgZXZlbiB0aG91Z2ggaXQgY29zdHMgbW9yZSIsInNvY2lhbCByZXNwb25zaWJpbGl0eSJdLFsiQSByZXRhaWxlciBsYXVuY2hlcyBhbiBvbmxpbmUgc3RvcmUgdG8gaW5jcmVhc2UgaXRzIG1hcmtldCBzaGFyZSIsImdyb3d0aCJdLFsiQSBtYW51ZmFjdHVyZXIgY3V0cyB3YXN0ZWZ1bCBjb3N0cyB0byBpbmNyZWFzZSBpdHMgZWFybmluZ3MiLCJwcm9maXQiXV0=");
const STAKEHOLDERS: [string, string][] = unpack("W1siZXhwZWN0cyBzYWZlIHByb2R1Y3RzIGFuZCBnb29kIHZhbHVlIGZvciBtb25leSIsImN1c3RvbWVycyJdLFsid2FudHMgZmFpciBwYXkgYW5kIHNhZmUgd29ya2luZyBjb25kaXRpb25zIiwiZW1wbG95ZWVzIl0sWyJleHBlY3RzIGEgcmV0dXJuIG9uIHRoZSBtb25leSB0aGV5IGhhdmUgaW52ZXN0ZWQiLCJvd25lcnMiXSxbInJlcXVpcmVzIHRoZSBidXNpbmVzcyB0byBwYXkgdGF4IGFuZCBvYmV5IHRoZSBsYXciLCJnb3Zlcm5tZW50Il0sWyJ3YW50cyB0byBiZSBwYWlkIHByb21wdGx5IGZvciBnb29kcyB0aGV5IHN1cHBseSIsInN1cHBsaWVycyJdLFsiaXMgY29uY2VybmVkIGFib3V0IHBvbGx1dGlvbiBhbmQgbG9jYWwgam9iIG9wcG9ydHVuaXRpZXMiLCJjb21tdW5pdHkiXSxbIndhbnRzIGpvYiBzZWN1cml0eSBhbmQgY2hhbmNlcyBmb3IgcHJvbW90aW9uIiwiZW1wbG95ZWVzIl0sWyJ3YW50cyBsb3cgcHJpY2VzIGFuZCByZWxpYWJsZSBhZnRlci1zYWxlcyBzZXJ2aWNlIiwiY3VzdG9tZXJzIl0sWyJtYXkgc2V0IHJlZ3VsYXRpb25zIG9uIHNhZmV0eSBhbmQgdGhlIGVudmlyb25tZW50IiwiZ292ZXJubWVudCJdXQ==");
const FUNCTIONS: [string, string][] = unpack("W1siUmVjcnVpdGluZyBhbmQgdHJhaW5pbmcgc3RhZmYiLCJodW1hbiByZXNvdXJjZXMiXSxbIlByZXBhcmluZyBidWRnZXRzIGFuZCBtYW5hZ2luZyBjYXNoIGZsb3ciLCJmaW5hbmNlIl0sWyJTY2hlZHVsaW5nIHByb2R1Y3Rpb24gYW5kIGNvbnRyb2xsaW5nIHF1YWxpdHkiLCJvcGVyYXRpb25zIl0sWyJSZXNlYXJjaGluZyBjdXN0b21lcnMgYW5kIHNldHRpbmcgcHJpY2VzIiwibWFya2V0aW5nIl0sWyJSZXNvbHZpbmcgZGlzcHV0ZXMgYmV0d2VlbiBzdGFmZiBhbmQgbWFuYWdlcnMiLCJodW1hbiByZXNvdXJjZXMiXSxbIkRlY2lkaW5nIGhvdyB0byBmdW5kIGEgbmV3IGZhY3RvcnkiLCJmaW5hbmNlIl0sWyJDaG9vc2luZyBzdXBwbGllcnMgYW5kIG1hbmFnaW5nIHN0b2NrIGxldmVscyIsIm9wZXJhdGlvbnMiXSxbIlBsYW5uaW5nIGFuIGFkdmVydGlzaW5nIGNhbXBhaWduIiwibWFya2V0aW5nIl1d");
const LEADERSHIP: [string, string][] = unpack("W1siVGhlIG1hbmFnZXIgbWFrZXMgZGVjaXNpb25zIGFsb25lIGFuZCBleHBlY3RzIHRoZW0gdG8gYmUgZm9sbG93ZWQiLCJhdXRvY3JhdGljIl0sWyJUaGUgbWFuYWdlciBjb25zdWx0cyBlbXBsb3llZXMgYW5kIGNvbnNpZGVycyB0aGVpciB2aWV3cyBiZWZvcmUgZGVjaWRpbmciLCJkZW1vY3JhdGljIl0sWyJUaGUgbWFuYWdlciBnaXZlcyBlbXBsb3llZXMgdGhlIGZyZWVkb20gdG8gbWFrZSB0aGVpciBvd24gZGVjaXNpb25zIiwibGFpc3Nlei1mYWlyZSJdLFsiU3RhZmYgYXJlIHRvbGQgd2hhdCB0byBkbyBhbmQgYXJlIHJhcmVseSBhc2tlZCBmb3IgdGhlaXIgb3BpbmlvbnMiLCJhdXRvY3JhdGljIl0sWyJEZWNpc2lvbnMgYXJlIG1hZGUgYWZ0ZXIgYSB0ZWFtIHZvdGUiLCJkZW1vY3JhdGljIl0sWyJUaGUgbWFuYWdlciByYXJlbHkgZ2V0cyBpbnZvbHZlZCBhbmQgbGV0cyB0aGUgdGVhbSBkZWNpZGUgaG93IHRvIHdvcmsiLCJsYWlzc2V6LWZhaXJlIl1d");
const ANSOFF: [string, string][] = unpack("W1siU2VsbGluZyBtb3JlIG9mIGFuIGV4aXN0aW5nIHByb2R1Y3QgaW4gYW4gZXhpc3RpbmcgbWFya2V0IiwibWFya2V0IHBlbmV0cmF0aW9uIl0sWyJMYXVuY2hpbmcgYSBuZXcgcHJvZHVjdCBpbiBhbiBleGlzdGluZyBtYXJrZXQiLCJwcm9kdWN0IGRldmVsb3BtZW50Il0sWyJTZWxsaW5nIGFuIGV4aXN0aW5nIHByb2R1Y3QgaW4gYSBuZXcgbWFya2V0IiwibWFya2V0IGRldmVsb3BtZW50Il0sWyJMYXVuY2hpbmcgYSBuZXcgcHJvZHVjdCBpbiBhIG5ldyBtYXJrZXQiLCJkaXZlcnNpZmljYXRpb24iXSxbIkEgc3VwZXJtYXJrZXQgcnVucyBhIHByb21vdGlvbiB0byBzZWxsIG1vcmUgb2YgaXRzIG93bi1icmFuZCBtaWxrIHRvIGN1cnJlbnQgc2hvcHBlcnMiLCJtYXJrZXQgcGVuZXRyYXRpb24iXSxbIkEgcGhvbmUgbWFrZXIgYWRkcyBhIG5ldyB0YWJsZXQgcmFuZ2UgZm9yIGl0cyBjdXJyZW50IGN1c3RvbWVycyIsInByb2R1Y3QgZGV2ZWxvcG1lbnQiXSxbIkEgbG9jYWwgYmFrZXJ5IHN0YXJ0cyBleHBvcnRpbmcgaXRzIGJyZWFkIG92ZXJzZWFzIiwibWFya2V0IGRldmVsb3BtZW50Il0sWyJBIGNsb3RoaW5nIGJyYW5kIG9wZW5zIGEgY2hhaW4gb2YgcmVzdGF1cmFudHMiLCJkaXZlcnNpZmljYXRpb24iXV0=");
const SEGMENTATION: [string, string][] = unpack("W1siRGl2aWRpbmcgY3VzdG9tZXJzIGJ5IGFnZSwgaW5jb21lIGFuZCBnZW5kZXIiLCJkZW1vZ3JhcGhpYyJdLFsiRGl2aWRpbmcgY3VzdG9tZXJzIGJ5IHRoZWlyIGxpZmVzdHlsZSwgdmFsdWVzIGFuZCBpbnRlcmVzdHMiLCJwc3ljaG9ncmFwaGljIl0sWyJEaXZpZGluZyBjdXN0b21lcnMgYnkgY291bnRyeSwgcmVnaW9uIG9yIGNsaW1hdGUiLCJnZW9ncmFwaGljIl0sWyJEaXZpZGluZyBjdXN0b21lcnMgYnkgaG93IG9mdGVuIHRoZXkgYnV5IGFuZCBob3cgbG95YWwgdGhleSBhcmUiLCJiZWhhdmlvdXJhbCJdLFsiVGFyZ2V0aW5nIG9ubHkgY3VzdG9tZXJzIGFnZWQgMTggdG8gMjUiLCJkZW1vZ3JhcGhpYyJdLFsiU2VsbGluZyB3aW50ZXIgY29hdHMgb25seSBpbiBjb2xkIHJlZ2lvbnMiLCJnZW9ncmFwaGljIl0sWyJUYXJnZXRpbmcgYWR2ZW50dXJlLXNlZWtlcnMgd2l0aCBhIG5ldyB0cmF2ZWwgcHJvZHVjdCIsInBzeWNob2dyYXBoaWMiXSxbIlJld2FyZGluZyBmcmVxdWVudCBidXllcnMgd2l0aCBsb3lhbHR5IG9mZmVycyIsImJlaGF2aW91cmFsIl1d");
const SECTORS: [string, string][] = unpack("W1siRmFybWluZywgZmlzaGluZyBhbmQgbWluaW5nIiwicHJpbWFyeSJdLFsiTWFudWZhY3R1cmluZyBnb29kcyBmcm9tIHJhdyBtYXRlcmlhbHMiLCJzZWNvbmRhcnkiXSxbIkJhbmtpbmcsIHJldGFpbCBhbmQgdHJhbnNwb3J0IiwidGVydGlhcnkiXSxbIkV4dHJhY3Rpbmcgb2lsIGZyb20gdGhlIGdyb3VuZCIsInByaW1hcnkiXSxbIkJ1aWxkaW5nIGNhcnMgaW4gYSBmYWN0b3J5Iiwic2Vjb25kYXJ5Il0sWyJQcm92aWRpbmcgZWR1Y2F0aW9uIGFuZCBoZWFsdGhjYXJlIiwidGVydGlhcnkiXSxbIk1ha2luZyBicmVhZCBmcm9tIGZsb3VyIiwic2Vjb25kYXJ5Il0sWyJHcm93aW5nIHdoZWF0IG9uIGEgZmFybSIsInByaW1hcnkiXV0=");
const COST_CLASS: [string, string][] = unpack("W1siUmVudCBvZiBhIGZhY3RvcnkiLCJmaXhlZCJdLFsiUmF3IG1hdGVyaWFscyIsInZhcmlhYmxlIl0sWyJBIHNhbGFyaWVkIG1hbmFnZXIncyB3YWdlcyIsImZpeGVkIl0sWyJQaWVjZS1yYXRlIHdhZ2VzIiwidmFyaWFibGUiXSxbIkluc3VyYW5jZSBwcmVtaXVtcyIsImZpeGVkIl0sWyJQYWNrYWdpbmciLCJ2YXJpYWJsZSJdLFsiTG9hbiBpbnRlcmVzdCIsImZpeGVkIl0sWyJTYWxlcyBjb21taXNzaW9uIiwidmFyaWFibGUiXSxbIkVsZWN0cmljaXR5IHVzZWQgYnkgbWFjaGluZXMiLCJ2YXJpYWJsZSJdXQ==");

const MIX_MEANING: Record<string, string> = {
  product: "what is being sold (its design, features and quality)",
  price: "how much customers pay, including discounts and payment terms",
  place: "where and how customers can buy it",
  promotion: "how the business tells customers about it",
};
const SWOT_MEANING: Record<string, string> = {
  strength: "an internal advantage the business has",
  weakness: "an internal problem the business has",
  opportunity: "an external chance the business could take advantage of",
  threat: "an external risk the business must deal with",
};
const OBJECTIVE_MEANING: Record<string, string> = {
  profit: "aims to earn more than it spends",
  growth: "aims to get bigger, with more sales, branches or customers",
  survival: "aims to keep trading and cover its costs",
  "social responsibility": "aims to benefit the community or the environment",
};
const FUNCTION_MEANING: Record<string, string> = {
  operations: "makes the product or delivers the service",
  marketing: "researches customers, sets prices and promotes the product",
  finance: "manages money, budgets and funding",
  "human resources": "recruits, trains and looks after staff",
};
const LEADERSHIP_MEANING: Record<string, string> = {
  autocratic: "makes decisions alone",
  democratic: "involves the team in decisions",
  "laissez-faire": "leaves the team to decide for themselves",
};
const GROWTH_MEANING: Record<string, string> = {
  "market penetration": "sells more of an existing product in an existing market",
  "product development": "creates new products for existing customers",
  "market development": "sells existing products in new markets",
  diversification: "launches new products in new markets, which is the riskiest option",
};
const SEGMENT_MEANING: Record<string, string> = {
  demographic: "groups customers by age, income, gender or occupation",
  psychographic: "groups customers by lifestyle, values and interests",
  geographic: "groups customers by location or climate",
  behavioural: "groups customers by buying habits and loyalty",
};
const SECTOR_MEANING: Record<string, string> = {
  primary: "extracts or grows raw materials, such as farming, mining and fishing",
  secondary: "turns raw materials into goods, such as manufacturing and construction",
  tertiary: "provides services, such as retail, banking and education",
};
const COST_MEANING: Record<string, string> = {
  fixed: "stays the same however much is produced",
  variable: "changes as the amount produced changes",
};

const EXPLAIN: Record<string, (item: string, answer: string) => string> = {
  "business-ownership": (d, a) => `A ${a} ${d}.`,
  "marketing-mix": (s, a) => `"${s}" is about ${a}, which covers ${MIX_MEANING[a]}.`,
  swot: (f, a) => `"${f}" is a ${a}: ${SWOT_MEANING[a]}.`,
  "business-objectives": (s, a) => `The action "${s}" shows the objective of ${a}. A business with this objective ${OBJECTIVE_MEANING[a]}.`,
  stakeholders: (d, a) => `The stakeholder group that ${d} is ${a === "community" ? "the community" : a}.`,
  "business-functions": (t, a) => `"${t}" is the job of ${a}. This function ${FUNCTION_MEANING[a]}.`,
  "leadership-styles": (_d, a) => `This is ${a} leadership: an ${a} leader ${LEADERSHIP_MEANING[a]}.`.replace("an laissez-faire", "a laissez-faire").replace("an democratic", "a democratic"),
  "growth-strategies": (_d, a) => `This is ${a}: it ${GROWTH_MEANING[a]}.`,
  "market-segmentation": (_d, a) => `This is ${a} segmentation: it ${SEGMENT_MEANING[a]}.`,
  "industry-sectors": (s, a) => `"${s}" belongs to the ${a} sector, which ${SECTOR_MEANING[a]}.`,
  "cost-classification": (c, a) => `"${c}" is a ${a} cost. A ${a} cost ${COST_MEANING[a]}.`,
};

function bankTopic(
  id: string,
  label: string,
  bank: [string, string][],
  prompt: (item: string) => string,
  pool: string[],
): Topic {
  return bankMCQ(
    id,
    label,
    bank.map(([item, answer]) => ({ prompt: prompt(item), answer, explanation: EXPLAIN[id]?.(item, answer) })),
    pool,
  );
}

// ---------- Grades 9-10 ----------

function businessOwnership(): Topic {
  return bankTopic("business-ownership", "Types of business ownership", OWNERSHIP, (d) => `Which business structure ${d}?`, [
    "sole trader",
    "partnership",
    "company",
  ]);
}

function marketingMix(): Topic {
  return bankTopic(
    "marketing-mix",
    "The marketing mix (4Ps)",
    MARKETING_MIX,
    (s) => `Which element of the marketing mix is this? "${s}"`,
    ["product", "price", "place", "promotion"],
  );
}

function swotAnalysis(): Topic {
  return bankTopic(
    "swot",
    "SWOT analysis",
    SWOT,
    (f) => `In a SWOT analysis, how is this factor classified: "${f}"?`,
    ["strength", "weakness", "opportunity", "threat"],
  );
}

function businessObjectives(): Topic {
  return bankTopic(
    "business-objectives",
    "Business objectives",
    OBJECTIVES,
    (a) => `Which business objective is best shown by this action: "${a}"?`,
    ["profit", "growth", "survival", "social responsibility"],
  );
}

function markupPricing(): Topic {
  return {
    id: "markup-pricing",
    label: "Markup pricing",
    generate: () => {
      const cost = randInt(1, 25) * 20;
      const pct = pick([10, 20, 25, 50]);
      return {
        prompt: `A retailer buys an item for $${cost} and adds a ${pct}% markup. What is the selling price?`,
        answer: `$${cost + (cost * pct) / 100}`,
        explanation: `Markup = ${pct}% of $${cost} = $${(cost * pct) / 100}. Selling price = cost + markup = $${cost} + $${(cost * pct) / 100} = $${cost + (cost * pct) / 100}.`,
      };
    },
  };
}

function marketShare(): Topic {
  return {
    id: "market-share",
    label: "Market share",
    generate: () => {
      const total = randInt(10, 100) * 1000;
      const pct = pick([5, 10, 15, 20, 25, 30, 40]);
      return {
        prompt: `A business has sales of $${(total * pct) / 100} in a market with total sales of $${total}. What is its market share?`,
        answer: `${pct}%`,
        explanation: `Market share = business sales ÷ total market sales × 100 = $${(total * pct) / 100} ÷ $${total} × 100 = ${pct}%.`,
      };
    },
  };
}

// ---------- Grades 11-12 ----------

function stakeholders(): Topic {
  return bankTopic("stakeholders", "Stakeholders", STAKEHOLDERS, (d) => `Which stakeholder group ${d}?`, [
    "customers",
    "employees",
    "owners",
    "government",
    "suppliers",
    "community",
  ]);
}

function businessFunctions(): Topic {
  return bankTopic(
    "business-functions",
    "Business functions",
    FUNCTIONS,
    (t) => `Which business function is mainly responsible for this: "${t}"?`,
    ["operations", "marketing", "finance", "human resources"],
  );
}

function leadershipStyles(): Topic {
  return bankTopic(
    "leadership-styles",
    "Leadership styles",
    LEADERSHIP,
    (d) => `Which leadership style is this? "${d}"`,
    ["autocratic", "democratic", "laissez-faire"],
  );
}

function returnOnInvestment(): Topic {
  return {
    id: "roi",
    label: "Return on investment",
    generate: () => {
      const investment = randInt(2, 50) * 1000;
      const pct = pick([5, 8, 10, 12, 15, 20, 25]);
      return {
        prompt: `A business invests $${investment} and earns a profit of $${(investment * pct) / 100} from the investment. Calculate the return on investment (as a percentage).`,
        answer: `${pct}%`,
        explanation: `ROI = profit ÷ investment × 100 = $${(investment * pct) / 100} ÷ $${investment} × 100 = ${pct}%.`,
      };
    },
  };
}

function staffTurnover(): Topic {
  return {
    id: "staff-turnover",
    label: "Staff turnover rate",
    generate: () => {
      const employees = randInt(2, 20) * 20;
      const pct = pick([5, 10, 15, 20, 25]);
      return {
        prompt: `A business had an average of ${employees} employees and ${(employees * pct) / 100} of them left during the year. Calculate the staff turnover rate.`,
        answer: `${pct}%`,
        explanation: `Staff turnover rate = employees who left ÷ average employees × 100 = ${(employees * pct) / 100} ÷ ${employees} × 100 = ${pct}%.`,
      };
    },
  };
}

function labourProductivity(): Topic {
  return {
    id: "labour-productivity",
    label: "Labour productivity",
    generate: () => {
      const rate = randInt(2, 20);
      const hours = randInt(50, 500);
      return {
        prompt: `A factory produces ${rate * hours} units using ${hours} labour hours. What is its labour productivity (units per labour hour)?`,
        answer: String(rate),
        explanation: `Labour productivity = output ÷ labour hours = ${rate * hours} ÷ ${hours} = ${rate} units per labour hour.`,
      };
    },
  };
}

// ---------- Advanced extension topics (Grade 11-12 "Advanced" only) ----------

function growthStrategies(): Topic {
  return bankTopic(
    "growth-strategies",
    "Growth strategies (Ansoff)",
    ANSOFF,
    (d) => `Which growth strategy is this? "${d}"`,
    ["market penetration", "product development", "market development", "diversification"],
  );
}

function marketSegmentation(): Topic {
  return bankTopic(
    "market-segmentation",
    "Market segmentation",
    SEGMENTATION,
    (d) => `Which basis of market segmentation is this? "${d}"`,
    ["demographic", "psychographic", "geographic", "behavioural"],
  );
}

function salesGrowth(): Topic {
  return {
    id: "sales-growth",
    label: "Sales growth rate",
    generate: () => {
      const before = randInt(10, 100) * 1000;
      const pct = pick([5, 10, 20, 25, 50]);
      return {
        prompt: `A business's sales rose from $${before} to $${(before * (100 + pct)) / 100}. Calculate the percentage growth in sales.`,
        answer: `${pct}%`,
        explanation: `Sales growth = (new sales - old sales) ÷ old sales × 100 = ($${(before * (100 + pct)) / 100} - $${before}) ÷ $${before} × 100 = ${pct}%.`,
      };
    },
  };
}

// ---------- Cambridge International extras (Grade 9+) ----------

function industrySectors(): Topic {
  return bankTopic(
    "industry-sectors",
    "Sectors of industry",
    SECTORS,
    (a) => `Which sector of industry is this? "${a}"`,
    ["primary", "secondary", "tertiary"],
  );
}

function costClassification(): Topic {
  return bankTopic(
    "cost-classification",
    "Fixed and variable costs",
    COST_CLASS,
    (c) => `Is this a fixed or variable cost? "${c}"`,
    ["fixed", "variable"],
  );
}

function averageCost(): Topic {
  return {
    id: "average-cost",
    label: "Average cost per unit",
    generate: () => {
      const output = randInt(10, 100);
      const fixedPerUnit = randInt(2, 20);
      const variable = randInt(1, 15);
      return {
        prompt: `Fixed costs are $${output * fixedPerUnit}, variable costs are $${variable} per unit and output is ${output} units. What is the average cost per unit?`,
        answer: `$${fixedPerUnit + variable}`,
        explanation: `Total cost = fixed costs + variable costs = $${output * fixedPerUnit} + ($${variable} × ${output}) = $${output * fixedPerUnit + variable * output}. Average cost = total cost ÷ output = $${output * fixedPerUnit + variable * output} ÷ ${output} = $${fixedPerUnit + variable}.`,
      };
    },
  };
}

function baseBusinessTopics(grade: number): Topic[] {
  if (grade <= 10) {
    return [businessOwnership(), marketingMix(), swotAnalysis(), businessObjectives(), markupPricing(), marketShare()];
  }
  return [
    stakeholders(),
    businessFunctions(),
    leadershipStyles(),
    returnOnInvestment(),
    staffTurnover(),
    labourProductivity(),
  ];
}

/** "Advanced" pulls in the next band's topics; the top band gets genuinely new extension topics. */
function advancedBusinessExtras(grade: number): Topic[] {
  if (grade <= 10) return [stakeholders(), returnOnInvestment()];
  return [growthStrategies(), marketSegmentation(), salesGrowth()];
}

function cambridgeBusinessExtras(grade: number): Topic[] {
  return grade >= 9 ? [industrySectors(), costClassification(), averageCost()] : [];
}

export function getBusinessTopics(
  grade: number,
  syllabus: Syllabus = "vic",
  difficulty: Difficulty = "standard",
): Topic[] {
  const base = [...baseBusinessTopics(grade), ...moreBusinessTopics(grade), businessWordProblems(grade)];
  const advanced = difficulty === "advanced" ? advancedBusinessExtras(grade) : [];
  const cambridge = syllabus === "cambridge" ? cambridgeBusinessExtras(grade) : [];
  return [...base, ...advanced, ...cambridge];
}
