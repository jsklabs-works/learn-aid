import type { Difficulty, Syllabus, Topic } from "../types";
import { unpack } from "./codec";
import { bankMCQ, pick, randInt, shuffle } from "./utils";

const PERIODIC: [string, string][] = unpack("W1siR3JvdXAgMSAoZXhjbHVkaW5nIGh5ZHJvZ2VuKSIsImFsa2FsaSBtZXRhbHMiXSxbIkdyb3VwIDIiLCJhbGthbGluZSBlYXJ0aCBtZXRhbHMiXSxbIkdyb3VwIDE3IiwiaGFsb2dlbnMiXSxbIkdyb3VwIDE4Iiwibm9ibGUgZ2FzZXMiXSxbIlRoZSBibG9jayBvZiBtZXRhbHMgYmV0d2VlbiBHcm91cHMgMiBhbmQgMTMiLCJ0cmFuc2l0aW9uIG1ldGFscyJdLFsiVW5yZWFjdGl2ZSBnYXNlcyB3aXRoIGZ1bGwgb3V0ZXIgc2hlbGxzIiwibm9ibGUgZ2FzZXMiXSxbIlZlcnkgcmVhY3RpdmUgc29mdCBtZXRhbHMgdGhhdCByZWFjdCB2aWdvcm91c2x5IHdpdGggd2F0ZXIiLCJhbGthbGkgbWV0YWxzIl0sWyJSZWFjdGl2ZSBub24tbWV0YWxzIHRoYXQgZm9ybSBzYWx0cyB3aXRoIG1ldGFscyIsImhhbG9nZW5zIl1d");
const BALANCING: [string, string][] = unpack("W1siQmFsYW5jZSBIMiArIE8yIC0+IEgyTyB1c2luZyB0aGUgc21hbGxlc3Qgd2hvbGUgbnVtYmVycy4gV2hhdCBjb2VmZmljaWVudCBnb2VzIGluIGZyb250IG9mIEgyTz8iLCIyIl0sWyJCYWxhbmNlIE4yICsgSDIgLT4gTkgzIHVzaW5nIHRoZSBzbWFsbGVzdCB3aG9sZSBudW1iZXJzLiBXaGF0IGNvZWZmaWNpZW50IGdvZXMgaW4gZnJvbnQgb2YgTkgzPyIsIjIiXSxbIkJhbGFuY2UgTjIgKyBIMiAtPiBOSDMgdXNpbmcgdGhlIHNtYWxsZXN0IHdob2xlIG51bWJlcnMuIFdoYXQgY29lZmZpY2llbnQgZ29lcyBpbiBmcm9udCBvZiBIMj8iLCIzIl0sWyJCYWxhbmNlIE1nICsgTzIgLT4gTWdPIHVzaW5nIHRoZSBzbWFsbGVzdCB3aG9sZSBudW1iZXJzLiBXaGF0IGNvZWZmaWNpZW50IGdvZXMgaW4gZnJvbnQgb2YgTWdPPyIsIjIiXSxbIkJhbGFuY2UgQ0g0ICsgTzIgLT4gQ08yICsgSDJPIHVzaW5nIHRoZSBzbWFsbGVzdCB3aG9sZSBudW1iZXJzLiBXaGF0IGNvZWZmaWNpZW50IGdvZXMgaW4gZnJvbnQgb2YgTzI/IiwiMiJdLFsiQmFsYW5jZSBDM0g4ICsgTzIgLT4gQ08yICsgSDJPIHVzaW5nIHRoZSBzbWFsbGVzdCB3aG9sZSBudW1iZXJzLiBXaGF0IGNvZWZmaWNpZW50IGdvZXMgaW4gZnJvbnQgb2YgTzI/IiwiNSJdLFsiQmFsYW5jZSBGZSArIE8yIC0+IEZlMk8zIHVzaW5nIHRoZSBzbWFsbGVzdCB3aG9sZSBudW1iZXJzLiBXaGF0IGNvZWZmaWNpZW50IGdvZXMgaW4gZnJvbnQgb2YgRmU/IiwiNCJdLFsiQmFsYW5jZSBBbCArIE8yIC0+IEFsMk8zIHVzaW5nIHRoZSBzbWFsbGVzdCB3aG9sZSBudW1iZXJzLiBXaGF0IGNvZWZmaWNpZW50IGdvZXMgaW4gZnJvbnQgb2YgTzI/IiwiMyJdLFsiQmFsYW5jZSBOYSArIENsMiAtPiBOYUNsIHVzaW5nIHRoZSBzbWFsbGVzdCB3aG9sZSBudW1iZXJzLiBXaGF0IGNvZWZmaWNpZW50IGdvZXMgaW4gZnJvbnQgb2YgTmE/IiwiMiJdLFsiQmFsYW5jZSBIMiArIENsMiAtPiBIQ2wgdXNpbmcgdGhlIHNtYWxsZXN0IHdob2xlIG51bWJlcnMuIFdoYXQgY29lZmZpY2llbnQgZ29lcyBpbiBmcm9udCBvZiBIQ2w/IiwiMiJdLFsiQmFsYW5jZSBDMkg2ICsgTzIgLT4gQ08yICsgSDJPIHVzaW5nIHRoZSBzbWFsbGVzdCB3aG9sZSBudW1iZXJzLiBXaGF0IGNvZWZmaWNpZW50IGdvZXMgaW4gZnJvbnQgb2YgQ08yPyIsIjQiXSxbIkJhbGFuY2UgSyArIEgyTyAtPiBLT0ggKyBIMiB1c2luZyB0aGUgc21hbGxlc3Qgd2hvbGUgbnVtYmVycy4gV2hhdCBjb2VmZmljaWVudCBnb2VzIGluIGZyb250IG9mIEs/IiwiMiJdXQ==");
const NEUTRALISATION: [string, string][] = unpack("W1siaHlkcm9jaGxvcmljIGFjaWQgcmVhY3RzIHdpdGggc29kaXVtIGh5ZHJveGlkZSIsInNvZGl1bSBjaGxvcmlkZSJdLFsic3VsZnVyaWMgYWNpZCByZWFjdHMgd2l0aCBzb2RpdW0gaHlkcm94aWRlIiwic29kaXVtIHN1bGZhdGUiXSxbIm5pdHJpYyBhY2lkIHJlYWN0cyB3aXRoIHBvdGFzc2l1bSBoeWRyb3hpZGUiLCJwb3Rhc3NpdW0gbml0cmF0ZSJdLFsiaHlkcm9jaGxvcmljIGFjaWQgcmVhY3RzIHdpdGggcG90YXNzaXVtIGh5ZHJveGlkZSIsInBvdGFzc2l1bSBjaGxvcmlkZSJdLFsic3VsZnVyaWMgYWNpZCByZWFjdHMgd2l0aCBwb3Rhc3NpdW0gaHlkcm94aWRlIiwicG90YXNzaXVtIHN1bGZhdGUiXSxbIm5pdHJpYyBhY2lkIHJlYWN0cyB3aXRoIHNvZGl1bSBoeWRyb3hpZGUiLCJzb2RpdW0gbml0cmF0ZSJdLFsiaHlkcm9jaGxvcmljIGFjaWQgcmVhY3RzIHdpdGggbWFnbmVzaXVtIG94aWRlIiwibWFnbmVzaXVtIGNobG9yaWRlIl0sWyJzdWxmdXJpYyBhY2lkIHJlYWN0cyB3aXRoIGNvcHBlcihJSSkgb3hpZGUiLCJjb3BwZXIoSUkpIHN1bGZhdGUiXV0=");
const CHANGES: [string, string][] = unpack("W1siSWNlIG1lbHRpbmciLCJwaHlzaWNhbCBjaGFuZ2UiXSxbIklyb24gcnVzdGluZyIsImNoZW1pY2FsIGNoYW5nZSJdLFsiQnVybmluZyB3b29kIiwiY2hlbWljYWwgY2hhbmdlIl0sWyJEaXNzb2x2aW5nIHN1Z2FyIGluIHdhdGVyIiwicGh5c2ljYWwgY2hhbmdlIl0sWyJCb2lsaW5nIHdhdGVyIiwicGh5c2ljYWwgY2hhbmdlIl0sWyJCYWtpbmcgYSBjYWtlIiwiY2hlbWljYWwgY2hhbmdlIl0sWyJNaWxrIGdvaW5nIHNvdXIiLCJjaGVtaWNhbCBjaGFuZ2UiXSxbIkNydXNoaW5nIGEgY2FuIiwicGh5c2ljYWwgY2hhbmdlIl1d");
const LE_CHATELIER: [string, string][] = unpack("W1siSW5jcmVhc2luZyB0aGUgY29uY2VudHJhdGlvbiBvZiBhIHJlYWN0YW50LiIsInNoaWZ0cyByaWdodCJdLFsiUmVtb3ZpbmcgYSBwcm9kdWN0IGFzIGl0IGZvcm1zLiIsInNoaWZ0cyByaWdodCJdLFsiSW5jcmVhc2luZyB0aGUgdGVtcGVyYXR1cmUgb2YgYW4gZXhvdGhlcm1pYyByZWFjdGlvbi4iLCJzaGlmdHMgbGVmdCJdLFsiRGVjcmVhc2luZyB0aGUgdGVtcGVyYXR1cmUgb2YgYW4gZXhvdGhlcm1pYyByZWFjdGlvbi4iLCJzaGlmdHMgcmlnaHQiXSxbIkluY3JlYXNpbmcgdGhlIHByZXNzdXJlIG9mIGEgZ2FzZW91cyByZWFjdGlvbiB3aXRoIGZld2VyIG1vbGVzIG9mIGdhcyBvbiB0aGUgcmlnaHQtaGFuZCBzaWRlLiIsInNoaWZ0cyByaWdodCJdLFsiSW5jcmVhc2luZyB0aGUgcHJlc3N1cmUgb2YgYSBnYXNlb3VzIHJlYWN0aW9uIHdpdGggbW9yZSBtb2xlcyBvZiBnYXMgb24gdGhlIHJpZ2h0LWhhbmQgc2lkZS4iLCJzaGlmdHMgbGVmdCJdLFsiQWRkaW5nIGEgY2F0YWx5c3QuIiwibm8gc2hpZnQiXSxbIkluY3JlYXNpbmcgdGhlIHByZXNzdXJlIHdoZW4gdGhlcmUgYXJlIGVxdWFsIG1vbGVzIG9mIGdhcyBvbiBib3RoIHNpZGVzLiIsIm5vIHNoaWZ0Il0sWyJJbmNyZWFzaW5nIHRoZSBjb25jZW50cmF0aW9uIG9mIGEgcHJvZHVjdC4iLCJzaGlmdHMgbGVmdCJdXQ==");
const OXIDATION: [string, string][] = unpack("W1siTW4gaW4gS01uTzQiLCIrNyJdLFsiUyBpbiBTTzIiLCIrNCJdLFsiUyBpbiBIMlNPNCIsIis2Il0sWyJDciBpbiBLMkNyMk83IiwiKzYiXSxbIk4gaW4gTkgzIiwiLTMiXSxbIk4gaW4gSE5PMyIsIis1Il0sWyJDIGluIENPMiIsIis0Il0sWyJDIGluIENINCIsIi00Il0sWyJDbCBpbiBOYUNsTyIsIisxIl0sWyJGZSBpbiBGZTJPMyIsIiszIl0sWyJPIGluIEgyTzIiLCItMSJdLFsiQ3UgaW4gQ3VTTzQiLCIrMiJdXQ==");
const FUNCTIONAL: [string, string][] = unpack("W1siYSBoeWRyb3h5bCAoLU9IKSBncm91cCIsImFsY29ob2wiXSxbImEgY2FyYm9uLWNhcmJvbiBkb3VibGUgYm9uZCIsImFsa2VuZSJdLFsiYSBjYXJib3h5bCAoLUNPT0gpIGdyb3VwIiwiY2FyYm94eWxpYyBhY2lkIl0sWyJvbmx5IHNpbmdsZSBjYXJib24tY2FyYm9uIGJvbmRzIiwiYWxrYW5lIl0sWyJhbiBlc3RlciBsaW5rYWdlICgtQ09PLSkiLCJlc3RlciJdLFsiYW4gYW1pbm8gKC1OSDIpIGdyb3VwIiwiYW1pbmUiXSxbInRoZSBnZW5lcmFsIGZvcm11bGEgQ25IMm4rMiIsImFsa2FuZSJdXQ==");
const GAS_TESTS: [string, string][] = unpack("W1siUmVsaWdodHMgYSBnbG93aW5nIHNwbGludCIsIm94eWdlbiJdLFsiQnVybnMgd2l0aCBhIHNxdWVha3kgcG9wIHdoZW4gYSBsaXQgc3BsaW50IGlzIGFwcGxpZWQiLCJoeWRyb2dlbiJdLFsiVHVybnMgbGltZXdhdGVyIG1pbGt5IiwiY2FyYm9uIGRpb3hpZGUiXSxbIkJsZWFjaGVzIGRhbXAgbGl0bXVzIHBhcGVyIiwiY2hsb3JpbmUiXSxbIlR1cm5zIGRhbXAgcmVkIGxpdG11cyBwYXBlciBibHVlIiwiYW1tb25pYSJdXQ==");
const SEPARATION: [string, string][] = unpack("W1sic2VwYXJhdGluZyBhbiBpbnNvbHVibGUgc29saWQgZnJvbSBhIGxpcXVpZCIsImZpbHRyYXRpb24iXSxbIm9idGFpbmluZyBwdXJlIHdhdGVyIGZyb20gc2FsdCBzb2x1dGlvbiIsImRpc3RpbGxhdGlvbiJdLFsic2VwYXJhdGluZyBkaWZmZXJlbnQgY29sb3VyZWQgaW5rcyIsImNocm9tYXRvZ3JhcGh5Il0sWyJvYnRhaW5pbmcgc29saWQgY3J5c3RhbHMgZnJvbSBhIHNhdHVyYXRlZCBzb2x1dGlvbiIsImNyeXN0YWxsaXNhdGlvbiJdLFsic2VwYXJhdGluZyB0d28gbWlzY2libGUgbGlxdWlkcyB3aXRoIGRpZmZlcmVudCBib2lsaW5nIHBvaW50cyIsImZyYWN0aW9uYWwgZGlzdGlsbGF0aW9uIl0sWyJzZXBhcmF0aW5nIGlyb24gZmlsaW5ncyBmcm9tIHNhbmQiLCJtYWduZXRpYyBzZXBhcmF0aW9uIl1d");

function bankTopic(
  id: string,
  label: string,
  bank: [string, string][],
  prompt: (item: string) => string,
  pool?: string[],
): Topic {
  return bankMCQ(
    id,
    label,
    bank.map(([item, answer]) => ({ prompt: prompt(item), answer })),
    pool,
  );
}

const ELEMENTS: { name: string; z: number; a: number }[] = [
  { name: "hydrogen", z: 1, a: 1 },
  { name: "helium", z: 2, a: 4 },
  { name: "lithium", z: 3, a: 7 },
  { name: "beryllium", z: 4, a: 9 },
  { name: "boron", z: 5, a: 11 },
  { name: "carbon", z: 6, a: 12 },
  { name: "nitrogen", z: 7, a: 14 },
  { name: "oxygen", z: 8, a: 16 },
  { name: "fluorine", z: 9, a: 19 },
  { name: "neon", z: 10, a: 20 },
  { name: "sodium", z: 11, a: 23 },
  { name: "magnesium", z: 12, a: 24 },
  { name: "aluminium", z: 13, a: 27 },
  { name: "silicon", z: 14, a: 28 },
  { name: "phosphorus", z: 15, a: 31 },
  { name: "sulfur", z: 16, a: 32 },
  { name: "chlorine", z: 17, a: 35 },
  { name: "argon", z: 18, a: 40 },
  { name: "potassium", z: 19, a: 39 },
  { name: "calcium", z: 20, a: 40 },
];

// ---------- Grades 9-10 ----------

function atomicStructure(): Topic {
  return {
    id: "atomic-structure",
    label: "Atomic structure",
    generate: () => {
      const el = pick(ELEMENTS);
      const kind = pick(["neutrons", "protons", "electrons"] as const);
      const intro = `An atom of ${el.name} has atomic number ${el.z} and mass number ${el.a}.`;
      if (kind === "neutrons") {
        return { prompt: `${intro} How many neutrons does it contain?`, answer: String(el.a - el.z) };
      }
      if (kind === "protons") {
        return { prompt: `${intro} How many protons does it contain?`, answer: String(el.z) };
      }
      return { prompt: `${intro} How many electrons does a neutral atom of ${el.name} contain?`, answer: String(el.z) };
    },
  };
}

function periodicGroups(): Topic {
  return bankTopic(
    "periodic-groups",
    "The periodic table",
    PERIODIC,
    (x) => `Which name describes this part of the periodic table? "${x}"`,
    ["alkali metals", "alkaline earth metals", "halogens", "noble gases", "transition metals"],
  );
}

function balancingEquations(): Topic {
  return bankTopic("balancing-equations", "Balancing equations", BALANCING, (x) => x, ["1", "2", "3", "4", "5", "6", "7"]);
}

function phClassification(): Topic {
  return {
    id: "ph-classification",
    label: "Acids, bases and pH",
    generate: () => {
      const ph = randInt(1, 14);
      return {
        prompt: `A solution has a pH of ${ph}. Is it acidic, neutral or alkaline?`,
        answer: ph < 7 ? "acidic" : ph === 7 ? "neutral" : "alkaline",
        options: ["acidic", "neutral", "alkaline"],
      };
    },
  };
}

function neutralisationSalts(): Topic {
  return bankTopic("neutralisation-salts", "Neutralisation and salts", NEUTRALISATION, (x) => `What salt is formed when ${x}?`);
}

const SUBSTANCES: [string, number][] = [
  ["water", 18],
  ["carbon dioxide", 44],
  ["methane", 16],
  ["oxygen gas (O2)", 32],
  ["ammonia", 17],
  ["calcium carbonate", 100],
  ["sodium hydroxide", 40],
  ["magnesium oxide", 40],
  ["nitrogen gas (N2)", 28],
  ["hydrogen gas (H2)", 2],
];

function moleCalculations(): Topic {
  return {
    id: "mole-calculations",
    label: "Moles and mass",
    generate: () => {
      const [name, molarMass] = pick(SUBSTANCES);
      const moles = pick([0.25, 0.5, 1, 1.5, 2, 3]);
      const mass = moles * molarMass;
      if (Math.random() < 0.5) {
        return {
          prompt: `What is the mass of ${moles} mol of ${name} (molar mass ${molarMass} g/mol)?`,
          answer: `${mass} g`,
        };
      }
      return {
        prompt: `How many moles are in ${mass} g of ${name} (molar mass ${molarMass} g/mol)?`,
        answer: String(moles),
      };
    },
  };
}

function physicalOrChemical(): Topic {
  return bankTopic(
    "physical-chemical-change",
    "Physical and chemical changes",
    CHANGES,
    (x) => `Is this a physical change or a chemical change? "${x}"`,
    ["physical change", "chemical change"],
  );
}

// ---------- Grades 11-12 ----------

const REACTIONS: { eq: string; from: string; fc: number; to: string; tc: number }[] = [
  { eq: "2H2 + O2 -> 2H2O", from: "H2", fc: 2, to: "H2O", tc: 2 },
  { eq: "2H2 + O2 -> 2H2O", from: "O2", fc: 1, to: "H2O", tc: 2 },
  { eq: "N2 + 3H2 -> 2NH3", from: "N2", fc: 1, to: "NH3", tc: 2 },
  { eq: "N2 + 3H2 -> 2NH3", from: "H2", fc: 3, to: "NH3", tc: 2 },
  { eq: "2Mg + O2 -> 2MgO", from: "O2", fc: 1, to: "MgO", tc: 2 },
  { eq: "CH4 + 2O2 -> CO2 + 2H2O", from: "CH4", fc: 1, to: "H2O", tc: 2 },
  { eq: "CH4 + 2O2 -> CO2 + 2H2O", from: "O2", fc: 2, to: "CO2", tc: 1 },
  { eq: "C3H8 + 5O2 -> 3CO2 + 4H2O", from: "C3H8", fc: 1, to: "CO2", tc: 3 },
];

function stoichiometry(): Topic {
  return {
    id: "stoichiometry",
    label: "Stoichiometry (mole ratios)",
    generate: () => {
      const r = pick(REACTIONS);
      const k = randInt(1, 5);
      return {
        prompt: `Given the equation ${r.eq}, how many moles of ${r.to} are produced from ${r.fc * k} mol of ${r.from}?`,
        answer: String(r.tc * k),
      };
    },
  };
}

function concentration(): Topic {
  return {
    id: "concentration",
    label: "Concentration (mol/L)",
    generate: () => {
      const conc = pick([0.1, 0.2, 0.5, 1, 2]);
      const volume = pick([0.25, 0.5, 1, 2, 4]);
      const moles = parseFloat((conc * volume).toFixed(4));
      if (Math.random() < 0.5) {
        return {
          prompt: `${moles} mol of solute is dissolved to make ${volume} L of solution. What is the concentration in mol/L?`,
          answer: String(conc),
        };
      }
      return {
        prompt: `How many moles of solute are in ${volume} L of a ${conc} mol/L solution?`,
        answer: String(moles),
      };
    },
  };
}

function leChatelier(): Topic {
  return bankTopic(
    "le-chatelier",
    "Le Chatelier's principle",
    LE_CHATELIER,
    (x) => `In a system at equilibrium, what is the effect of this change? ${x}`,
    ["shifts right", "shifts left", "no shift"],
  );
}

function oxidationNumbers(): Topic {
  return bankTopic("oxidation-numbers", "Oxidation numbers", OXIDATION, (x) => `What is the oxidation number of ${x}?`, [
    "-4",
    "-3",
    "-2",
    "-1",
    "+1",
    "+2",
    "+3",
    "+4",
    "+5",
    "+6",
    "+7",
  ]);
}

function functionalGroups(): Topic {
  return bankTopic(
    "functional-groups",
    "Organic families",
    FUNCTIONAL,
    (x) => `Which organic family is characterised by ${x}?`,
    ["alcohol", "alkene", "carboxylic acid", "alkane", "ester", "amine"],
  );
}

const ALKANES = ["methane", "ethane", "propane", "butane", "pentane", "hexane", "heptane", "octane"];

function alkanes(): Topic {
  return {
    id: "alkanes",
    label: "Alkanes",
    generate: () => {
      const n = randInt(1, ALKANES.length);
      if (Math.random() < 0.5) {
        const wrong = shuffle(ALKANES.filter((a) => a !== ALKANES[n - 1])).slice(0, 3);
        return {
          prompt: `What is the name of the alkane with ${n} carbon ${n === 1 ? "atom" : "atoms"}?`,
          answer: ALKANES[n - 1],
          options: shuffle([ALKANES[n - 1], ...wrong]),
        };
      }
      return {
        prompt: `What is the molecular formula of the alkane with ${n} carbon ${n === 1 ? "atom" : "atoms"}? (for example, C2H6)`,
        answer: `C${n}H${2 * n + 2}`,
      };
    },
  };
}

function calorimetry(): Topic {
  return {
    id: "calorimetry",
    label: "Heat energy calculations",
    generate: () => {
      const mass = pick([50, 100, 200]);
      const rise = pick([2, 5, 10]);
      return {
        prompt: `${mass} g of water is heated and its temperature rises by ${rise} degrees C. Calculate the heat energy absorbed (specific heat capacity of water = 4.18 J/g/degree C).`,
        answer: `${(mass * 418 * rise) / 100} J`,
      };
    },
  };
}

// ---------- Advanced extension topics (Grade 11-12 "Advanced" only) ----------

function dilution(): Topic {
  return {
    id: "dilution",
    label: "Dilution",
    generate: () => {
      const v1 = pick([10, 20, 25, 50]);
      const c1 = pick([2, 4, 5, 10]);
      const factor = pick([2, 4, 5, 10]);
      return {
        prompt: `${v1} mL of a ${c1} mol/L solution is diluted with water to ${v1 * factor} mL. What is the new concentration in mol/L?`,
        answer: String(c1 / factor),
      };
    },
  };
}

function limitingReagent(): Topic {
  return {
    id: "limiting-reagent",
    label: "Limiting reagent",
    generate: () => {
      let h2: number, o2: number;
      do {
        h2 = randInt(1, 8);
        o2 = randInt(1, 8);
      } while (h2 / 2 === o2);
      return {
        prompt: `For the reaction 2H2 + O2 -> 2H2O, a mixture contains ${h2} mol of H2 and ${o2} mol of O2. Which is the limiting reagent?`,
        answer: h2 / 2 < o2 ? "H2" : "O2",
        options: ["H2", "O2"],
      };
    },
  };
}

function strongAcidBasePh(): Topic {
  return {
    id: "strong-acid-base-ph",
    label: "pH of strong acids and bases",
    generate: () => {
      const n = pick([1, 2, 3]);
      const conc = ["0.1", "0.01", "0.001"][n - 1];
      const acid = Math.random() < 0.5;
      return {
        prompt: `What is the pH of a ${conc} mol/L solution of ${acid ? "hydrochloric acid" : "sodium hydroxide"} at 25 degrees C? (Assume it is fully dissociated.)`,
        answer: String(acid ? n : 14 - n),
      };
    },
  };
}

// ---------- Cambridge International extras (Grade 9+) ----------

function gasTests(): Topic {
  return bankTopic(
    "gas-tests",
    "Tests for gases",
    GAS_TESTS,
    (x) => `Which gas is identified by this test result: "${x}"?`,
    ["oxygen", "hydrogen", "carbon dioxide", "chlorine", "ammonia"],
  );
}

function separationMethods(): Topic {
  return bankTopic(
    "separation-methods",
    "Separation techniques",
    SEPARATION,
    (x) => `Which separation method is best for: ${x}?`,
    [
      "filtration",
      "distillation",
      "chromatography",
      "crystallisation",
      "fractional distillation",
      "magnetic separation",
    ],
  );
}

const FORMULA_MASSES: [string, number][] = [
  ["H2SO4", 98],
  ["Ca(OH)2", 74],
  ["Mg(NO3)2", 148],
  ["NaOH", 40],
  ["CaCO3", 100],
  ["(NH4)2SO4", 132],
  ["Al2O3", 102],
  ["CO2", 44],
  ["HNO3", 63],
  ["KOH", 56],
  ["CuSO4", 160],
  ["Na2CO3", 106],
];

function relativeFormulaMass(): Topic {
  return {
    id: "relative-formula-mass",
    label: "Relative formula mass",
    generate: () => {
      const [formula, mass] = pick(FORMULA_MASSES);
      return {
        prompt: `Calculate the relative formula mass (Mr) of ${formula}. (Ar: H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, Al = 27, S = 32, K = 39, Ca = 40, Cu = 64)`,
        answer: String(mass),
      };
    },
  };
}

function baseChemistryTopics(grade: number): Topic[] {
  if (grade <= 10) {
    return [
      atomicStructure(),
      periodicGroups(),
      balancingEquations(),
      phClassification(),
      neutralisationSalts(),
      moleCalculations(),
      physicalOrChemical(),
    ];
  }
  return [
    stoichiometry(),
    concentration(),
    leChatelier(),
    oxidationNumbers(),
    functionalGroups(),
    alkanes(),
    calorimetry(),
  ];
}

/** "Advanced" pulls in the next band's topics; the top band gets genuinely new extension topics. */
function advancedChemistryExtras(grade: number): Topic[] {
  if (grade <= 10) return [stoichiometry(), leChatelier()];
  return [dilution(), limitingReagent(), strongAcidBasePh()];
}

function cambridgeChemistryExtras(grade: number): Topic[] {
  return grade >= 9 ? [gasTests(), separationMethods(), relativeFormulaMass()] : [];
}

export function getChemistryTopics(
  grade: number,
  syllabus: Syllabus = "vic",
  difficulty: Difficulty = "standard",
): Topic[] {
  const base = baseChemistryTopics(grade);
  const advanced = difficulty === "advanced" ? advancedChemistryExtras(grade) : [];
  const cambridge = syllabus === "cambridge" ? cambridgeChemistryExtras(grade) : [];
  return [...base, ...advanced, ...cambridge];
}
