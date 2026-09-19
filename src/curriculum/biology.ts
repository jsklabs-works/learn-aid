import type { Difficulty, Syllabus, Topic } from "../types";
import { unpack } from "./codec";
import { bankMCQ, pick, randInt } from "./utils";

const ORGANELLES: [string, string][] = unpack("W1siY29udHJvbHMgdGhlIGNlbGwncyBhY3Rpdml0aWVzIGFuZCBjb250YWlucyBpdHMgRE5BIiwibnVjbGV1cyJdLFsicmVsZWFzZXMgZW5lcmd5IGZyb20gZ2x1Y29zZSBkdXJpbmcgcmVzcGlyYXRpb24iLCJtaXRvY2hvbmRyaWEiXSxbImFic29yYnMgbGlnaHQgZW5lcmd5IGZvciBwaG90b3N5bnRoZXNpcyIsImNobG9yb3BsYXN0Il0sWyJjb250cm9scyB3aGF0IGVudGVycyBhbmQgbGVhdmVzIHRoZSBjZWxsIiwiY2VsbCBtZW1icmFuZSJdLFsibWFrZXMgcHJvdGVpbnMiLCJyaWJvc29tZSJdLFsiZ2l2ZXMgcGxhbnQgY2VsbHMgYSByaWdpZCwgc3VwcG9ydGl2ZSBzaGFwZSIsImNlbGwgd2FsbCJdLFsic3RvcmVzIHdhdGVyIGFuZCBkaXNzb2x2ZWQgc3Vic3RhbmNlcyBpbiBwbGFudCBjZWxscyIsInZhY3VvbGUiXSxbImNvbnRhaW5zIHRoZSBncmVlbiBwaWdtZW50IGNobG9yb3BoeWxsIiwiY2hsb3JvcGxhc3QiXSxbImlzIHRoZSBzaXRlIHdoZXJlIG1vc3Qgb2YgdGhlIGNlbGwncyBBVFAgaXMgbWFkZSIsIm1pdG9jaG9uZHJpYSJdLFsiaXMgYSBwYXJ0aWFsbHkgcGVybWVhYmxlIGJhcnJpZXIgYXJvdW5kIHRoZSBjeXRvcGxhc20iLCJjZWxsIG1lbWJyYW5lIl1d");
const LEVELS: [string, string][] = unpack("W1siQSBncm91cCBvZiBzaW1pbGFyIGNlbGxzIHdvcmtpbmcgdG9nZXRoZXIiLCJ0aXNzdWUiXSxbIkEgZ3JvdXAgb2YgZGlmZmVyZW50IHRpc3N1ZXMgd29ya2luZyB0b2dldGhlciIsIm9yZ2FuIl0sWyJBIGdyb3VwIG9mIG9yZ2FucyB3b3JraW5nIHRvZ2V0aGVyIiwib3JnYW4gc3lzdGVtIl0sWyJUaGUgYmFzaWMgdW5pdCBvZiBsaWZlIiwiY2VsbCJdLFsiVGhlIHN0b21hY2giLCJvcmdhbiJdLFsiWHlsZW0gaW4gYSBwbGFudCBzdGVtIiwidGlzc3VlIl0sWyJUaGUgZGlnZXN0aXZlIHN5c3RlbSIsIm9yZ2FuIHN5c3RlbSJdLFsiQSBzaW5nbGUgbGl2aW5nIGluZGl2aWR1YWwgbWFkZSBvZiBvcmdhbiBzeXN0ZW1zIiwib3JnYW5pc20iXSxbIkEgcmVkIGJsb29kIGNlbGwiLCJjZWxsIl0sWyJUaGUgaGVhcnQiLCJvcmdhbiJdXQ==");
const SYSTEMS: [string, string][] = unpack("W1sidHJhbnNwb3J0cyBibG9vZCwgbnV0cmllbnRzIGFuZCBveHlnZW4gYXJvdW5kIHRoZSBib2R5IiwiY2lyY3VsYXRvcnkiXSxbImJyZWFrcyBkb3duIGZvb2QgYW5kIGFic29yYnMgbnV0cmllbnRzIiwiZGlnZXN0aXZlIl0sWyJleGNoYW5nZXMgb3h5Z2VuIGFuZCBjYXJib24gZGlveGlkZSB3aXRoIHRoZSBhaXIiLCJyZXNwaXJhdG9yeSJdLFsidXNlcyBlbGVjdHJpY2FsIHNpZ25hbHMgdG8gY29vcmRpbmF0ZSB0aGUgYm9keSIsIm5lcnZvdXMiXSxbInN1cHBvcnRzIHRoZSBib2R5IGFuZCBwcm90ZWN0cyBvcmdhbnMiLCJza2VsZXRhbCJdLFsicmVtb3ZlcyB3YXN0ZSBmcm9tIHRoZSBibG9vZCBhcyB1cmluZSIsImV4Y3JldG9yeSJdLFsiaW5jbHVkZXMgdGhlIGhlYXJ0IGFuZCBibG9vZCB2ZXNzZWxzIiwiY2lyY3VsYXRvcnkiXSxbImluY2x1ZGVzIHRoZSBsdW5ncyBhbmQgdHJhY2hlYSIsInJlc3BpcmF0b3J5Il0sWyJpbmNsdWRlcyB0aGUgYnJhaW4gYW5kIHNwaW5hbCBjb3JkIiwibmVydm91cyJdXQ==");
const EQUATION_FACTS: [string, string][] = unpack("W1siUGhvdG9zeW50aGVzaXM6IGNhcmJvbiBkaW94aWRlICsgX19fIC0+IGdsdWNvc2UgKyBveHlnZW4iLCJ3YXRlciJdLFsiUmVzcGlyYXRpb246IGdsdWNvc2UgKyBfX18gLT4gY2FyYm9uIGRpb3hpZGUgKyB3YXRlciArIGVuZXJneSIsIm94eWdlbiJdLFsiUGxhbnRzIG5lZWQgX19fIGVuZXJneSBmb3IgcGhvdG9zeW50aGVzaXMuIiwibGlnaHQiXSxbIlBsYW50cyByZWxlYXNlIF9fXyBhcyBhIHByb2R1Y3Qgb2YgcGhvdG9zeW50aGVzaXMuIiwib3h5Z2VuIl0sWyJQbGFudHMgdGFrZSBpbiBfX18gZ2FzIGZyb20gdGhlIGFpciBmb3IgcGhvdG9zeW50aGVzaXMuIiwiY2FyYm9uIGRpb3hpZGUiXSxbIlRoZSBzdWdhciBtYWRlIGJ5IHBob3Rvc3ludGhlc2lzIGlzIF9fXy4iLCJnbHVjb3NlIl0sWyJBZXJvYmljIHJlc3BpcmF0aW9uIHJlbGVhc2VzIGNhcmJvbiBkaW94aWRlIGFuZCBfX18gYXMgd2FzdGUgcHJvZHVjdHMuIiwid2F0ZXIiXSxbIlBob3Rvc3ludGhlc2lzOiBfX18gKyB3YXRlciAtPiBnbHVjb3NlICsgb3h5Z2VuIiwiY2FyYm9uIGRpb3hpZGUiXV0=");
const DNA_PROCESSES: [string, string][] = unpack("W1siQ29weWluZyBhIEROQSBtb2xlY3VsZSBiZWZvcmUgYSBjZWxsIGRpdmlkZXMiLCJyZXBsaWNhdGlvbiJdLFsiTWFraW5nIGFuIG1STkEgY29weSBvZiBhIGdlbmUiLCJ0cmFuc2NyaXB0aW9uIl0sWyJCdWlsZGluZyBhIHByb3RlaW4gZnJvbSB0aGUgY29kb25zIGluIG1STkEiLCJ0cmFuc2xhdGlvbiJdLFsiQSBwZXJtYW5lbnQgY2hhbmdlIGluIHRoZSBETkEgYmFzZSBzZXF1ZW5jZSIsIm11dGF0aW9uIl0sWyJPY2N1cnMgaW4gdGhlIG51Y2xldXMgYW5kIHByb2R1Y2VzIG1STkEiLCJ0cmFuc2NyaXB0aW9uIl0sWyJPY2N1cnMgYXQgdGhlIHJpYm9zb21lIiwidHJhbnNsYXRpb24iXSxbIkVuc3VyZXMgZWFjaCBuZXcgY2VsbCByZWNlaXZlcyBhIGZ1bGwgY29weSBvZiB0aGUgRE5BIiwicmVwbGljYXRpb24iXSxbIkNhbiBiZSBjYXVzZWQgYnkgcmFkaWF0aW9uIG9yIGNoZW1pY2FscyBhbmQgbWF5IGFsdGVyIGEgcHJvdGVpbiIsIm11dGF0aW9uIl1d");
const NATURAL_SELECTION: [string, string][] = unpack("W1siZGVzY3JpYmVzIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGluZGl2aWR1YWxzIGluIGEgcG9wdWxhdGlvbiIsInZhcmlhdGlvbiJdLFsiaXMgdGhlIHByb2Nlc3Mgd2hlcmUgaW5kaXZpZHVhbHMgd2l0aCBoZWxwZnVsIHRyYWl0cyBzdXJ2aXZlIGFuZCByZXByb2R1Y2UgbW9yZSIsIm5hdHVyYWwgc2VsZWN0aW9uIl0sWyJpcyB0aGUgcGFzc2luZyBvZiB0cmFpdHMgZnJvbSBwYXJlbnRzIHRvIG9mZnNwcmluZyIsImluaGVyaXRhbmNlIl0sWyJpcyB3aGVuIGEgc3BlY2llcyBwcm9kdWNlcyBtb3JlIG9mZnNwcmluZyB0aGFuIHRoZSBlbnZpcm9ubWVudCBjYW4gc3VwcG9ydCIsIm92ZXJwcm9kdWN0aW9uIl0sWyJpcyB0aGUgZ3JhZHVhbCBjaGFuZ2UgaW4gdGhlIGluaGVyaXRlZCB0cmFpdHMgb2YgYSBwb3B1bGF0aW9uIG92ZXIgZ2VuZXJhdGlvbnMiLCJldm9sdXRpb24iXSxbImlzIHRoZSBmb3JtYXRpb24gb2YgbmV3IHNwZWNpZXMgZnJvbSBwb3B1bGF0aW9ucyB0aGF0IGNhbiBubyBsb25nZXIgaW50ZXJicmVlZCIsInNwZWNpYXRpb24iXV0=");
const FEEDBACK: [string, string][] = unpack("W1siQm9keSB0ZW1wZXJhdHVyZSByaXNlcyBhbmQgc3dlYXRpbmcgY29vbHMgdGhlIGJvZHkgYmFjayB0byBub3JtYWwiLCJuZWdhdGl2ZSBmZWVkYmFjayJdLFsiSW5zdWxpbiByZWxlYXNlIGxvd2VycyBhIGhpZ2ggYmxvb2QgZ2x1Y29zZSBsZXZlbCIsIm5lZ2F0aXZlIGZlZWRiYWNrIl0sWyJPeHl0b2NpbiByZWxlYXNlIGR1cmluZyBjaGlsZGJpcnRoIHN0cmVuZ3RoZW5zIGNvbnRyYWN0aW9ucywgY2F1c2luZyBtb3JlIG94eXRvY2luIHJlbGVhc2UiLCJwb3NpdGl2ZSBmZWVkYmFjayJdLFsiUGxhdGVsZXRzIHJlbGVhc2UgY2hlbWljYWxzIHRoYXQgYXR0cmFjdCBtb3JlIHBsYXRlbGV0cyB0byBhIHdvdW5kIiwicG9zaXRpdmUgZmVlZGJhY2siXSxbIlNoaXZlcmluZyB3aGVuIGJvZHkgdGVtcGVyYXR1cmUgZmFsbHMiLCJuZWdhdGl2ZSBmZWVkYmFjayJdLFsiR2x1Y2Fnb24gcmVsZWFzZSByYWlzZXMgYSBsb3cgYmxvb2QgZ2x1Y29zZSBsZXZlbCIsIm5lZ2F0aXZlIGZlZWRiYWNrIl0sWyJBIHJpcGVuaW5nIGZydWl0IHJlbGVhc2VzIGV0aHlsZW5lLCB3aGljaCBzcGVlZHMgdXAgdGhlIHJpcGVuaW5nIG9mIG5lYXJieSBmcnVpdCIsInBvc2l0aXZlIGZlZWRiYWNrIl1d");
const ENZYMES: [string, string][] = unpack("W1sidGhlIHRlbXBlcmF0dXJlIHJpc2VzIHdlbGwgYWJvdmUgdGhlIGVuenltZSdzIG9wdGltdW0iLCJkZWNyZWFzZXMiXSxbInRoZSB0ZW1wZXJhdHVyZSBpbmNyZWFzZXMgZnJvbSBhIGxvdyB2YWx1ZSB0b3dhcmRzIHRoZSBvcHRpbXVtIiwiaW5jcmVhc2VzIl0sWyJ0aGUgcEggbW92ZXMgZmFyIGF3YXkgZnJvbSB0aGUgZW56eW1lJ3Mgb3B0aW11bSBwSCIsImRlY3JlYXNlcyJdLFsidGhlIHN1YnN0cmF0ZSBjb25jZW50cmF0aW9uIGluY3JlYXNlcyBmcm9tIGEgbG93IGxldmVsIiwiaW5jcmVhc2VzIl0sWyJhbGwgYWN0aXZlIHNpdGVzIGFyZSBhbHJlYWR5IG9jY3VwaWVkIGFuZCBtb3JlIHN1YnN0cmF0ZSBpcyBhZGRlZCIsInN0YXlzIHRoZSBzYW1lIl0sWyJ0aGUgZW56eW1lIGlzIGRlbmF0dXJlZCIsImRlY3JlYXNlcyJdLFsidGhlIGVuenltZSBjb25jZW50cmF0aW9uIGluY3JlYXNlcyBhbmQgdGhlcmUgaXMgcGxlbnR5IG9mIHN1YnN0cmF0ZSIsImluY3JlYXNlcyJdXQ==");
const CELL_LOCATIONS: [string, string][] = unpack("W1siR2x5Y29seXNpcyIsImN5dG9wbGFzbSJdLFsiVGhlIEtyZWJzIGN5Y2xlIiwibWl0b2Nob25kcmlhbCBtYXRyaXgiXSxbIlRoZSBlbGVjdHJvbiB0cmFuc3BvcnQgY2hhaW4gaW4gcmVzcGlyYXRpb24iLCJpbm5lciBtaXRvY2hvbmRyaWFsIG1lbWJyYW5lIl0sWyJUaGUgbGlnaHQtZGVwZW5kZW50IHJlYWN0aW9ucyBvZiBwaG90b3N5bnRoZXNpcyIsInRoeWxha29pZCBtZW1icmFuZXMiXSxbIlRoZSBDYWx2aW4gY3ljbGUiLCJzdHJvbWEiXSxbIkFuYWVyb2JpYyBmZXJtZW50YXRpb24iLCJjeXRvcGxhc20iXV0=");
const CHARACTERISTICS: [string, string][] = unpack("W1siaXMgdGhlIGFiaWxpdHkgdG8gZGV0ZWN0IGFuZCByZXNwb25kIHRvIGNoYW5nZXMgaW4gdGhlIHN1cnJvdW5kaW5ncyIsInNlbnNpdGl2aXR5Il0sWyJpcyB0aGUgcmVtb3ZhbCBvZiB3YXN0ZSBwcm9kdWN0cyBvZiBtZXRhYm9saXNtIiwiZXhjcmV0aW9uIl0sWyJpcyBhIHBlcm1hbmVudCBpbmNyZWFzZSBpbiBzaXplIGFuZCBtYXNzIiwiZ3Jvd3RoIl0sWyJpcyB0aGUgcHJvZHVjdGlvbiBvZiBvZmZzcHJpbmciLCJyZXByb2R1Y3Rpb24iXSxbImlzIHRoZSB0YWtpbmcgaW4gb2YgbWF0ZXJpYWxzIGZvciBlbmVyZ3kgYW5kIGdyb3d0aCIsIm51dHJpdGlvbiJdLFsiaXMgdGhlIGNoZW1pY2FsIHJlYWN0aW9ucyB0aGF0IHJlbGVhc2UgZW5lcmd5IGZyb20gZm9vZCIsInJlc3BpcmF0aW9uIl0sWyJpcyBhbiBhY3Rpb24gYnkgYW4gb3JnYW5pc20gb3IgcGFydCBvZiBpdCB0aGF0IGNoYW5nZXMgaXRzIHBvc2l0aW9uIiwibW92ZW1lbnQiXV0=");
const OSMOSIS: [string, string][] = unpack("W1siQSBwb3RhdG8gY3lsaW5kZXIgaXMgcGxhY2VkIGluIGRpc3RpbGxlZCB3YXRlci4iLCJnYWlucyB3YXRlciJdLFsiQSBwb3RhdG8gY3lsaW5kZXIgaXMgcGxhY2VkIGluIGEgdmVyeSBjb25jZW50cmF0ZWQgc3VnYXIgc29sdXRpb24uIiwibG9zZXMgd2F0ZXIiXSxbIkEgcG90YXRvIGN5bGluZGVyIGlzIHBsYWNlZCBpbiBhIHNvbHV0aW9uIHdpdGggdGhlIHNhbWUgY29uY2VudHJhdGlvbiBhcyBpdHMgY2VsbHMuIiwibm8gbmV0IG1vdmVtZW50Il0sWyJBIHJlZCBibG9vZCBjZWxsIGlzIHBsYWNlZCBpbiBwdXJlIHdhdGVyLiIsImdhaW5zIHdhdGVyIl0sWyJBIHBsYW50IGNlbGwgaXMgcGxhY2VkIGluIGEgc3Ryb25nIHNhbHQgc29sdXRpb24uIiwibG9zZXMgd2F0ZXIiXSxbIkEgY2Fycm90IHN0aWNrIGlzIHBsYWNlZCBpbiBhIGRpbHV0ZSBzb2x1dGlvbi4iLCJnYWlucyB3YXRlciJdXQ==");

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

// ---------- Grades 9-10 ----------

function cellStructures(): Topic {
  return bankTopic("cell-structures", "Cell structures", ORGANELLES, (d) => `Which cell structure ${d}?`, [
    "nucleus",
    "mitochondria",
    "chloroplast",
    "cell membrane",
    "ribosome",
    "cell wall",
    "vacuole",
  ]);
}

function levelsOfOrganisation(): Topic {
  return bankTopic(
    "levels-of-organisation",
    "Levels of organisation",
    LEVELS,
    (x) => `Which level of biological organisation is this? "${x}"`,
    ["cell", "tissue", "organ", "organ system", "organism"],
  );
}

function bodySystems(): Topic {
  return bankTopic("body-systems", "Body systems", SYSTEMS, (d) => `Which body system ${d}?`, [
    "circulatory",
    "digestive",
    "respiratory",
    "nervous",
    "skeletal",
    "excretory",
  ]);
}

function photosynthesisAndRespiration(): Topic {
  return bankTopic(
    "photosynthesis-respiration",
    "Photosynthesis and respiration",
    EQUATION_FACTS,
    (x) => `Fill in the blank: ${x}`,
    ["water", "oxygen", "carbon dioxide", "glucose", "light"],
  );
}

function monohybridCross(): Topic {
  const crosses: [string, string][] = [
    ["Tt", "Tt"],
    ["Tt", "tt"],
    ["TT", "tt"],
    ["TT", "Tt"],
  ];
  return {
    id: "monohybrid-cross",
    label: "Punnett squares (one gene)",
    generate: () => {
      const [p1, p2] = pick(crosses);
      let tall = 0;
      let total = 0;
      for (const a of p1) {
        for (const b of p2) {
          total++;
          if (a === "T" || b === "T") tall++;
        }
      }
      const wantTall = Math.random() < 0.5;
      const pct = ((wantTall ? tall : total - tall) / total) * 100;
      return {
        prompt: `In pea plants, tall (T) is dominant over short (t). Two plants with genotypes ${p1} and ${p2} are crossed. What percentage of the offspring are expected to be ${wantTall ? "tall" : "short"}?`,
        answer: `${pct}%`,
      };
    },
  };
}

function energyTransfer(): Topic {
  const levels = ["primary consumer", "secondary consumer", "tertiary consumer"];
  return {
    id: "energy-transfer",
    label: "Energy transfer in food chains",
    generate: () => {
      const energy = randInt(1, 9) * 10000;
      const level = randInt(1, 3);
      return {
        prompt: `Producers in a food chain capture ${energy} kJ of energy. Assuming only 10% of the energy is passed on at each level, how much energy reaches the ${levels[level - 1]}?`,
        answer: `${energy / 10 ** level} kJ`,
      };
    },
  };
}

// ---------- Grades 11-12 ----------

function dnaProcesses(): Topic {
  return bankTopic(
    "dna-processes",
    "DNA replication, transcription and translation",
    DNA_PROCESSES,
    (x) => `Which process is described? "${x}"`,
    ["replication", "transcription", "translation", "mutation"],
  );
}

function dnaComplement(): Topic {
  const dnaPair: Record<string, string> = { A: "T", T: "A", G: "C", C: "G" };
  const rnaPair: Record<string, string> = { A: "U", T: "A", G: "C", C: "G" };
  return {
    id: "dna-complement",
    label: "Base pairing and transcription",
    generate: () => {
      const seq = Array.from({ length: 6 }, () => pick(["A", "T", "G", "C"])).join("");
      if (Math.random() < 0.5) {
        return {
          prompt: `A DNA strand has the base sequence ${seq}. Write the sequence of the complementary DNA strand.`,
          answer: [...seq].map((b) => dnaPair[b]).join(""),
        };
      }
      return {
        prompt: `A DNA template strand has the base sequence ${seq}. Write the sequence of the mRNA transcribed from it.`,
        answer: [...seq].map((b) => rnaPair[b]).join(""),
      };
    },
  };
}

function dihybridCross(): Topic {
  const outcomes = [
    { desc: "both dominant traits", frac: "9/16" },
    { desc: "the dominant trait for A and the recessive trait for B", frac: "3/16" },
    { desc: "the recessive trait for A and the dominant trait for B", frac: "3/16" },
    { desc: "both recessive traits", frac: "1/16" },
  ];
  return {
    id: "dihybrid-cross",
    label: "Dihybrid crosses",
    generate: () => {
      const o = pick(outcomes);
      return {
        prompt: `In a dihybrid cross between two AaBb parents (A and B are dominant, and the genes assort independently), what fraction of the offspring are expected to show ${o.desc}?`,
        answer: o.frac,
      };
    },
  };
}

function naturalSelection(): Topic {
  return bankTopic("natural-selection", "Natural selection and evolution", NATURAL_SELECTION, (d) => `Which term ${d}?`, [
    "variation",
    "natural selection",
    "inheritance",
    "overproduction",
    "evolution",
    "speciation",
  ]);
}

function homeostasisFeedback(): Topic {
  return bankTopic(
    "feedback-loops",
    "Homeostasis and feedback",
    FEEDBACK,
    (x) => `Is this an example of negative feedback or positive feedback? "${x}"`,
    ["negative feedback", "positive feedback"],
  );
}

function enzymeActivity(): Topic {
  return bankTopic(
    "enzyme-activity",
    "Enzyme activity",
    ENZYMES,
    (x) => `What happens to the rate of an enzyme-catalysed reaction when ${x}?`,
    ["increases", "decreases", "stays the same"],
  );
}

function magnification(): Topic {
  return {
    id: "magnification",
    label: "Magnification",
    generate: () => {
      const actual = pick([10, 20, 25, 40, 50]);
      const mag = pick([40, 100, 400, 1000]);
      return {
        prompt: `A specimen has an actual length of ${actual} micrometres. In a micrograph its image is ${actual * mag} micrometres long. Calculate the magnification (as a number).`,
        answer: String(mag),
      };
    },
  };
}

function surfaceAreaToVolume(): Topic {
  return {
    id: "sa-to-volume",
    label: "Surface area to volume ratio",
    generate: () => {
      const side = pick([1, 2, 3, 6]);
      return {
        prompt: `A cube-shaped cell has sides of length ${side} cm. Calculate its surface area to volume ratio (write your answer as x:1).`,
        answer: `${6 / side}:1`,
      };
    },
  };
}

// ---------- Advanced extension topics (Grade 11-12 "Advanced" only) ----------

function hardyWeinberg(): Topic {
  return {
    id: "hardy-weinberg",
    label: "Hardy-Weinberg calculations",
    generate: () => {
      const q = pick([0.1, 0.2, 0.3, 0.4, 0.5]);
      return {
        prompt: `In a population in Hardy-Weinberg equilibrium, the frequency of the homozygous recessive genotype (q^2) is ${(q * q).toFixed(2)}. What is the frequency of heterozygous carriers (2pq)?`,
        answer: (2 * (1 - q) * q).toFixed(2),
      };
    },
  };
}

function cellProcessLocations(): Topic {
  return bankTopic(
    "cell-process-locations",
    "Where cell processes occur",
    CELL_LOCATIONS,
    (x) => `Where in the cell does this stage occur? "${x}"`,
    ["cytoplasm", "mitochondrial matrix", "inner mitochondrial membrane", "thylakoid membranes", "stroma"],
  );
}

function xLinkedInheritance(): Topic {
  const questions = [
    { q: "What is the probability that a son is affected?", a: "50%" },
    { q: "What is the probability that a daughter is affected?", a: "0%" },
    { q: "What is the probability that a daughter is a carrier?", a: "50%" },
  ];
  return {
    id: "x-linked",
    label: "X-linked inheritance",
    generate: () => {
      const item = pick(questions);
      return {
        prompt: `A mother is a carrier of an X-linked recessive condition and the father is unaffected. ${item.q}`,
        answer: item.a,
      };
    },
  };
}

// ---------- Cambridge International extras (Grade 9+) ----------

function characteristicsOfLife(): Topic {
  return bankTopic(
    "characteristics-of-life",
    "Characteristics of living organisms",
    CHARACTERISTICS,
    (d) => `Which characteristic of living organisms ${d}?`,
    ["sensitivity", "excretion", "growth", "reproduction", "nutrition", "respiration", "movement"],
  );
}

function osmosisPredictions(): Topic {
  return bankTopic(
    "osmosis-predictions",
    "Osmosis predictions",
    OSMOSIS,
    (x) => `Predict the net movement of water by osmosis: ${x}`,
    ["gains water", "loses water", "no net movement"],
  );
}

function osmosisPercentageChange(): Topic {
  return {
    id: "osmosis-percentage-change",
    label: "Percentage change in mass",
    generate: () => {
      const initial = pick([2, 4, 5, 10, 20]);
      const pct = pick([10, 20, 25, 40]);
      const increase = Math.random() < 0.5;
      const final = (initial * (increase ? 100 + pct : 100 - pct)) / 100;
      return {
        prompt: `A potato cylinder has a mass of ${initial} g before and ${final} g after being left in a solution. Calculate the percentage ${increase ? "increase" : "decrease"} in mass.`,
        answer: `${pct}%`,
      };
    },
  };
}

function baseBiologyTopics(grade: number): Topic[] {
  if (grade <= 10) {
    return [
      cellStructures(),
      levelsOfOrganisation(),
      bodySystems(),
      photosynthesisAndRespiration(),
      monohybridCross(),
      energyTransfer(),
    ];
  }
  return [
    dnaProcesses(),
    dnaComplement(),
    dihybridCross(),
    naturalSelection(),
    homeostasisFeedback(),
    enzymeActivity(),
    magnification(),
    surfaceAreaToVolume(),
  ];
}

/** "Advanced" pulls in the next band's topics; the top band gets genuinely new extension topics. */
function advancedBiologyExtras(grade: number): Topic[] {
  if (grade <= 10) return [dnaProcesses(), dihybridCross()];
  return [hardyWeinberg(), cellProcessLocations(), xLinkedInheritance()];
}

function cambridgeBiologyExtras(grade: number): Topic[] {
  return grade >= 9 ? [characteristicsOfLife(), osmosisPredictions(), osmosisPercentageChange()] : [];
}

export function getBiologyTopics(
  grade: number,
  syllabus: Syllabus = "vic",
  difficulty: Difficulty = "standard",
): Topic[] {
  const base = baseBiologyTopics(grade);
  const advanced = difficulty === "advanced" ? advancedBiologyExtras(grade) : [];
  const cambridge = syllabus === "cambridge" ? cambridgeBiologyExtras(grade) : [];
  return [...base, ...advanced, ...cambridge];
}
