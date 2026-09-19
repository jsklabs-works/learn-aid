import type { Difficulty, Syllabus, Topic } from "../types";
import { unpack } from "./codec";
import { bankMCQ, pick, randInt } from "./utils";

const SUPPLY_DEMAND: [string, string][] = unpack("W1siRGVtYW5kIGluY3JlYXNlcyB3aGlsZSBzdXBwbHkgc3RheXMgdGhlIHNhbWUuIiwicHJpY2UgcmlzZXMiXSxbIkRlbWFuZCBkZWNyZWFzZXMgd2hpbGUgc3VwcGx5IHN0YXlzIHRoZSBzYW1lLiIsInByaWNlIGZhbGxzIl0sWyJTdXBwbHkgaW5jcmVhc2VzIHdoaWxlIGRlbWFuZCBzdGF5cyB0aGUgc2FtZS4iLCJwcmljZSBmYWxscyJdLFsiU3VwcGx5IGRlY3JlYXNlcyB3aGlsZSBkZW1hbmQgc3RheXMgdGhlIHNhbWUuIiwicHJpY2UgcmlzZXMiXSxbIkEgaG90IHN1bW1lciBncmVhdGx5IGluY3JlYXNlcyBkZW1hbmQgZm9yIGljZSBjcmVhbSAoc3VwcGx5IGlzIHVuY2hhbmdlZCkuIiwicHJpY2UgcmlzZXMiXSxbIkEgbmV3IHRlY2hub2xvZ3kgbG93ZXJzIHByb2R1Y3Rpb24gY29zdHMgYW5kIGluY3JlYXNlcyBzdXBwbHkgKGRlbWFuZCBpcyB1bmNoYW5nZWQpLiIsInByaWNlIGZhbGxzIl0sWyJBIHBvb3IgaGFydmVzdCByZWR1Y2VzIHRoZSBzdXBwbHkgb2Ygd2hlYXQgKGRlbWFuZCBpcyB1bmNoYW5nZWQpLiIsInByaWNlIHJpc2VzIl0sWyJBIGhlYWx0aCBzY2FyZSByZWR1Y2VzIGRlbWFuZCBmb3IgYSBmb29kIChzdXBwbHkgaXMgdW5jaGFuZ2VkKS4iLCJwcmljZSBmYWxscyJdXQ==");
const SYSTEMS: [string, string][] = unpack("W1siYWxsb2NhdGVzIHJlc291cmNlcyBtYWlubHkgdGhyb3VnaCBwcmljZXMgaW4gbWFya2V0cywgd2l0aCBsaXR0bGUgZ292ZXJubWVudCBpbnZvbHZlbWVudCIsIm1hcmtldCBlY29ub215Il0sWyJoYXMgdGhlIGdvdmVybm1lbnQgZGVjaWRlIHdoYXQsIGhvdyBhbmQgZm9yIHdob20gdG8gcHJvZHVjZSIsImNvbW1hbmQgZWNvbm9teSJdLFsiY29tYmluZXMgcHJpdmF0ZSBtYXJrZXRzIHdpdGggc29tZSBnb3Zlcm5tZW50IGRpcmVjdGlvbiIsIm1peGVkIGVjb25vbXkiXSxbInJlbGllcyBvbiBjdXN0b20gYW5kIHRyYWRpdGlvbiB0byBkZWNpZGUgd2hhdCBpcyBwcm9kdWNlZCIsInRyYWRpdGlvbmFsIGVjb25vbXkiXSxbImlzIGJlc3QgZGVzY3JpYmVkIGJ5IGNlbnRyYWwgcGxhbm5pbmcgb2YgYWxtb3N0IGFsbCBwcm9kdWN0aW9uIiwiY29tbWFuZCBlY29ub215Il0sWyJpcyB0eXBpY2FsIG9mIG1vc3QgbW9kZXJuIGNvdW50cmllcywgd2l0aCBib3RoIHByaXZhdGUgZmlybXMgYW5kIHB1YmxpYyBzZXJ2aWNlcyIsIm1peGVkIGVjb25vbXkiXV0=");
const FACTORS: [string, string][] = unpack("W1siQSBmYXJtZXIncyBwYWRkb2NrIiwibGFuZCJdLFsiSXJvbiBvcmUgaW4gdGhlIGdyb3VuZCIsImxhbmQiXSxbIkEgdGVhY2hlcidzIHdvcmsiLCJsYWJvdXIiXSxbIkEgZGVsaXZlcnkgZHJpdmVyJ3MgdGltZSIsImxhYm91ciJdLFsiQSBiYWtlcnkncyBvdmVucyIsImNhcGl0YWwiXSxbIkEgdHJ1Y2sgb3duZWQgYnkgYSBidXNpbmVzcyIsImNhcGl0YWwiXSxbIkEgcGVyc29uIHdobyBvcmdhbmlzZXMgcmVzb3VyY2VzIGFuZCB0YWtlcyBvbiB0aGUgcmlzayBvZiBhIG5ldyBidXNpbmVzcyIsImVudGVycHJpc2UiXSxbIkFuIGVudHJlcHJlbmV1ciBsYXVuY2hpbmcgYSBzdGFydC11cCIsImVudGVycHJpc2UiXV0=");
const POLICY: [string, string][] = unpack("W1siVGhlIGNlbnRyYWwgYmFuayByYWlzZXMgaW50ZXJlc3QgcmF0ZXMiLCJtb25ldGFyeSBwb2xpY3kiXSxbIlRoZSBnb3Zlcm5tZW50IGN1dHMgaW5jb21lIHRheCByYXRlcyIsImZpc2NhbCBwb2xpY3kiXSxbIlRoZSBnb3Zlcm5tZW50IGluY3JlYXNlcyBzcGVuZGluZyBvbiBpbmZyYXN0cnVjdHVyZSIsImZpc2NhbCBwb2xpY3kiXSxbIlRoZSBjZW50cmFsIGJhbmsgbG93ZXJzIGludGVyZXN0IHJhdGVzIiwibW9uZXRhcnkgcG9saWN5Il0sWyJUaGUgZ292ZXJubWVudCByYWlzZXMgdGhlIHNhbGVzIHRheCByYXRlIiwiZmlzY2FsIHBvbGljeSJdLFsiVGhlIGNlbnRyYWwgYmFuayBidXlzIGJvbmRzIHRvIGluY3JlYXNlIHRoZSBtb25leSBzdXBwbHkiLCJtb25ldGFyeSBwb2xpY3kiXV0=");
const STRUCTURES: [string, string][] = unpack("W1siaGFzIG1hbnkgc21hbGwgc2VsbGVycywgaWRlbnRpY2FsIHByb2R1Y3RzIGFuZCBmcmVlIGVudHJ5IGFuZCBleGl0IiwicGVyZmVjdCBjb21wZXRpdGlvbiJdLFsiaGFzIGEgc2luZ2xlIHNlbGxlciBhbmQgaGlnaCBiYXJyaWVycyB0byBlbnRyeSIsIm1vbm9wb2x5Il0sWyJpcyBkb21pbmF0ZWQgYnkgYSBmZXcgbGFyZ2UgZmlybXMgdGhhdCByZWFjdCB0byBlYWNoIG90aGVyJ3MgcHJpY2VzIiwib2xpZ29wb2x5Il0sWyJoYXMgbWFueSBzZWxsZXJzIG9mZmVyaW5nIGRpZmZlcmVudGlhdGVkIHByb2R1Y3RzIiwibW9ub3BvbGlzdGljIGNvbXBldGl0aW9uIl0sWyJpcyBiZXN0IGlsbHVzdHJhdGVkIGJ5IGEgbG9jYWwgd2F0ZXIgdXRpbGl0eSB3aXRoIG5vIGNvbXBldGl0b3JzIiwibW9ub3BvbHkiXSxbImlzIGJlc3QgaWxsdXN0cmF0ZWQgYnkgYSBzbWFsbCB3aGVhdCBtYXJrZXQgd2hlcmUgZmFybWVycyBhcmUgcHJpY2UgdGFrZXJzIiwicGVyZmVjdCBjb21wZXRpdGlvbiJdXQ==");
const TAXES: [string, string][] = unpack("W1siVGF4IG9uIHdhZ2VzIGFuZCBzYWxhcmllcyIsImRpcmVjdCB0YXgiXSxbIlRheCBvbiBjb21wYW55IHByb2ZpdHMiLCJkaXJlY3QgdGF4Il0sWyJUYXggYWRkZWQgdG8gdGhlIHByaWNlIG9mIGdvb2RzIGFuZCBzZXJ2aWNlcyIsImluZGlyZWN0IHRheCJdLFsiVGF4IG9uIGltcG9ydGVkIGdvb2RzIiwiaW5kaXJlY3QgdGF4Il0sWyJFeGNpc2UgZHV0eSBvbiBmdWVsIiwiaW5kaXJlY3QgdGF4Il0sWyJUYXggb24gcGVyc29uYWwgaW52ZXN0bWVudCBpbmNvbWUiLCJkaXJlY3QgdGF4Il1d");

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
    bank.map(([item, answer]) => ({ prompt: prompt(item), answer })),
    pool,
  );
}

// ---------- Grades 9-10 ----------

function supplyAndDemand(): Topic {
  return bankTopic(
    "supply-demand",
    "Supply and demand",
    SUPPLY_DEMAND,
    (s) => `What is the likely effect on the equilibrium price? ${s}`,
    ["price rises", "price falls"],
  );
}

function economicSystems(): Topic {
  return bankTopic("economic-systems", "Economic systems", SYSTEMS, (d) => `Which type of economic system ${d}?`, [
    "market economy",
    "command economy",
    "mixed economy",
    "traditional economy",
  ]);
}

function factorsOfProduction(): Topic {
  return bankTopic(
    "factors-of-production",
    "Factors of production",
    FACTORS,
    (i) => `Which factor of production is this? "${i}"`,
    ["land", "labour", "capital", "enterprise"],
  );
}

function opportunityCost(): Topic {
  return {
    id: "opportunity-cost",
    label: "Opportunity cost",
    generate: () => {
      const wage = randInt(10, 40);
      const hours = randInt(2, 8);
      return {
        prompt: `Sam can work ${hours} hours at $${wage} per hour, or go to a free concert instead. What is the opportunity cost of going to the concert?`,
        answer: `$${wage * hours}`,
      };
    },
  };
}

function inflationRate(): Topic {
  return {
    id: "inflation-rate",
    label: "Inflation rate",
    generate: () => {
      const before = randInt(2, 20) * 100;
      const pct = pick([2, 3, 4, 5, 10]);
      return {
        prompt: `A basket of goods cost $${before} last year and $${(before * (100 + pct)) / 100} this year. Calculate the inflation rate.`,
        answer: `${pct}%`,
      };
    },
  };
}

// ---------- Grades 11-12 ----------

function priceElasticity(): Topic {
  return {
    id: "price-elasticity",
    label: "Price elasticity of demand",
    generate: () => {
      const pricePct = pick([10, 20]);
      const ped = pick([0.5, 1, 1.5, 2, 3]);
      return {
        prompt: `The price of a good rises by ${pricePct}% and the quantity demanded falls by ${pricePct * ped}%. Calculate the price elasticity of demand (ignore the sign, to 1 decimal place).`,
        answer: ped.toFixed(1),
      };
    },
  };
}

function elasticityInterpretation(): Topic {
  return {
    id: "elasticity-interpretation",
    label: "Elastic and inelastic demand",
    generate: () => {
      const ped = pick([0.3, 0.5, 0.8, 1, 1.2, 2, 3]);
      const answer = ped < 1 ? "inelastic" : ped === 1 ? "unit elastic" : "elastic";
      return {
        prompt: `A good has a price elasticity of demand of ${ped.toFixed(1)}. Is demand elastic, inelastic or unit elastic?`,
        answer,
        options: ["elastic", "inelastic", "unit elastic"],
      };
    },
  };
}

function economicGrowth(): Topic {
  return {
    id: "economic-growth",
    label: "Economic growth rate",
    generate: () => {
      const before = randInt(1, 20) * 100;
      const pct = pick([2, 3, 4, 5]);
      return {
        prompt: `Real GDP grew from $${before} billion to $${(before * (100 + pct)) / 100} billion. Calculate the percentage growth rate.`,
        answer: `${pct}%`,
      };
    },
  };
}

function unemploymentRate(): Topic {
  return {
    id: "unemployment-rate",
    label: "Unemployment rate",
    generate: () => {
      const labourForce = randInt(10, 100) * 1000;
      const pct = pick([3, 4, 5, 6, 8, 10]);
      const unemployed = (labourForce * pct) / 100;
      return {
        prompt: `An economy has ${labourForce - unemployed} people employed and ${unemployed} people unemployed. What is the unemployment rate?`,
        answer: `${pct}%`,
      };
    },
  };
}

function policyTools(): Topic {
  return bankTopic(
    "policy-tools",
    "Fiscal and monetary policy",
    POLICY,
    (a) => `Is this fiscal policy or monetary policy? "${a}"`,
    ["fiscal policy", "monetary policy"],
  );
}

function marketStructures(): Topic {
  return bankTopic("market-structures", "Market structures", STRUCTURES, (d) => `Which market structure ${d}?`, [
    "perfect competition",
    "monopoly",
    "oligopoly",
    "monopolistic competition",
  ]);
}

// ---------- Advanced extension topics (Grade 11-12 "Advanced" only) ----------

const MULTIPLIERS: [number, number][] = [
  [0.5, 2],
  [0.75, 4],
  [0.8, 5],
  [0.9, 10],
];

function multiplierEffect(): Topic {
  return {
    id: "multiplier",
    label: "The multiplier effect",
    generate: () => {
      const [mpc, multiplier] = pick(MULTIPLIERS);
      const injection = randInt(1, 20) * 10;
      return {
        prompt: `The marginal propensity to consume is ${mpc}. Government spending rises by $${injection} million. What is the total change in national income?`,
        answer: `$${injection * multiplier} million`,
      };
    },
  };
}

function realGdp(): Topic {
  return {
    id: "real-gdp",
    label: "Real vs nominal GDP",
    generate: () => {
      const deflator = pick([110, 120, 125, 150, 200]);
      const real = randInt(2, 30) * 100;
      return {
        prompt: `Nominal GDP is $${(real * deflator) / 100} billion and the GDP deflator is ${deflator}. What is real GDP?`,
        answer: `$${real} billion`,
      };
    },
  };
}

function comparativeAdvantage(): Topic {
  return {
    id: "comparative-advantage",
    label: "Comparative advantage",
    generate: () => {
      let a1: number, a2: number, b1: number, b2: number;
      do {
        a1 = pick([10, 20, 30]);
        b1 = pick([10, 20, 30]);
        a2 = randInt(1, 6) * 10;
        b2 = randInt(1, 6) * 10;
      } while (a2 * b1 === b2 * a1);
      // The country giving up fewer units of Y per unit of X has the comparative advantage in X.
      const answer = a2 * b1 < b2 * a1 ? "Country A" : "Country B";
      return {
        prompt: `In a day, Country A can produce ${a1} units of X or ${a2} units of Y. Country B can produce ${b1} units of X or ${b2} units of Y. Which country has the comparative advantage in producing X?`,
        answer,
        options: ["Country A", "Country B"],
      };
    },
  };
}

// ---------- Cambridge International extras (Grade 9+) ----------

function exchangeRates(): Topic {
  return {
    id: "exchange-rates",
    label: "Exchange rates",
    generate: () => {
      const rate = pick([0.5, 0.8, 1.5, 2]);
      const dollars = randInt(1, 50) * 10;
      return {
        prompt: `The exchange rate is 1 US dollar = ${rate} units of foreign currency. How many units of foreign currency will you receive for $${dollars}?`,
        answer: (dollars * rate).toFixed(2),
      };
    },
  };
}

function taxTypes(): Topic {
  return bankTopic("tax-types", "Direct and indirect taxes", TAXES, (t) => `Is this a direct tax or an indirect tax? "${t}"`, [
    "direct tax",
    "indirect tax",
  ]);
}

function tradeBalance(): Topic {
  return {
    id: "trade-balance",
    label: "Trade balance",
    generate: () => {
      const exports = randInt(10, 90);
      const imports = exports + pick([-1, 1]) * randInt(1, 9);
      return {
        prompt: `A country exports $${exports} billion and imports $${imports} billion of goods. Is there a trade surplus or a trade deficit?`,
        answer: exports > imports ? "surplus" : "deficit",
        options: ["surplus", "deficit"],
      };
    },
  };
}

function baseEconomicsTopics(grade: number): Topic[] {
  if (grade <= 10) {
    return [supplyAndDemand(), economicSystems(), factorsOfProduction(), opportunityCost(), inflationRate()];
  }
  return [
    priceElasticity(),
    elasticityInterpretation(),
    economicGrowth(),
    unemploymentRate(),
    policyTools(),
    marketStructures(),
  ];
}

/** "Advanced" pulls in the next band's topics; the top band gets genuinely new extension topics. */
function advancedEconomicsExtras(grade: number): Topic[] {
  if (grade <= 10) return [priceElasticity(), marketStructures()];
  return [multiplierEffect(), realGdp(), comparativeAdvantage()];
}

function cambridgeEconomicsExtras(grade: number): Topic[] {
  return grade >= 9 ? [exchangeRates(), taxTypes(), tradeBalance()] : [];
}

export function getEconomicsTopics(
  grade: number,
  syllabus: Syllabus = "vic",
  difficulty: Difficulty = "standard",
): Topic[] {
  const base = baseEconomicsTopics(grade);
  const advanced = difficulty === "advanced" ? advancedEconomicsExtras(grade) : [];
  const cambridge = syllabus === "cambridge" ? cambridgeEconomicsExtras(grade) : [];
  return [...base, ...advanced, ...cambridge];
}
