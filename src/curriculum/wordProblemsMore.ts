import type { Topic } from "../types";
import { pick, randInt } from "./utils";
import { BUSINESSES, NAMES, topicFrom, type Kind } from "./wordProblems";

const name = () => pick(NAMES);
const num = (x: number) => String(+x.toFixed(4));
/** "a" or "an" before a number as it is read aloud (an 8, an 18, an 800). */
const an = (n: number) => (/^8/.test(String(n)) || n === 11 || n === 18 ? "an" : "a");

// ---------- Physics ----------

const physicsLower: Kind[] = [
  () => {
    const who = name();
    const v = randInt(3, 12);
    const t = randInt(2, 12) * 10;
    const d = v * t;
    return {
      prompt: `${who} cycles ${d} m to school in ${t} s at a steady pace. What is ${who}'s average speed?`,
      answer: `${v} m/s`,
      explanation: `Speed = distance ÷ time = ${d} ÷ ${t} = ${v} m/s.`,
    };
  },
  () => {
    const a = randInt(1, 5);
    const t = randInt(4, 12);
    const v = a * t;
    return {
      prompt: `A car starts from rest and reaches ${v} m/s after ${t} s. What is its acceleration?`,
      answer: `${a} m/s²`,
      explanation: `Acceleration = change in velocity ÷ time = ${v} ÷ ${t} = ${a} m/s².`,
    };
  },
  () => {
    const who = name();
    const m = randInt(1, 8) * 5;
    const a = randInt(1, 4);
    const f = m * a;
    return {
      prompt: `${who} pushes a ${m} kg trolley with a resultant force of ${f} N. What is the trolley's acceleration?`,
      answer: `${a} m/s²`,
      explanation: `From F = ma, a = F ÷ m = ${f} ÷ ${m} = ${a} m/s².`,
    };
  },
  () => {
    const kw = randInt(1, 3);
    const h = randInt(2, 8);
    const c = randInt(4, 8) * 5;
    return {
      prompt: `A ${kw} kW heater runs for ${h} hours. Electricity costs ${c} cents per kWh. How much does it cost to run the heater?`,
      answer: `${kw * h * c} cents`,
      explanation: `Energy used = power × time = ${kw} × ${h} = ${kw * h} kWh. Cost = ${kw * h} × ${c} = ${kw * h * c} cents.`,
    };
  },
  () => {
    const r = randInt(2, 30);
    const i = randInt(1, 5);
    return {
      prompt: `A torch bulb has a resistance of ${r} ohms and a current of ${i} A flows through it. What is the voltage across the bulb?`,
      answer: `${r * i} V`,
      explanation: `V = IR = ${i} × ${r} = ${r * i} V.`,
    };
  },
  () => {
    const t = pick([0.5, 1, 2, 3, 4]);
    const d = (340 * t) / 2;
    return {
      prompt: `${name()} shouts towards a cliff and hears the echo ${t} s later. Sound travels at 340 m/s. How far away is the cliff?`,
      answer: `${d} m`,
      explanation: `The sound travels to the cliff and back, so the total distance is 340 × ${t} = ${340 * t} m. The cliff is half of that: ${d} m away.`,
    };
  },
  () => {
    const m = randInt(1, 5) * 100;
    const h = randInt(1, 4) * 5;
    const t = pick([5, 10, 20]);
    const p = (m * 10 * h) / t;
    return {
      prompt: `A crane lifts a ${m} kg load ${h} m in ${t} s. Taking g = 10 N/kg, what is the power of the crane's motor (ignoring losses)?`,
      answer: `${p} W`,
      explanation: `Work done = m × g × h = ${m} × 10 × ${h} = ${m * 10 * h} J. Power = work ÷ time = ${m * 10 * h} ÷ ${t} = ${p} W.`,
    };
  },
  () => {
    const rho = pick([2, 3, 5, 8, 9]);
    const v = randInt(2, 10) * 5;
    return {
      prompt: `A metal block has a volume of ${v} cm³ and a mass of ${rho * v} g. What is the density of the metal?`,
      answer: `${rho} g/cm³`,
      explanation: `Density = mass ÷ volume = ${rho * v} ÷ ${v} = ${rho} g/cm³.`,
    };
  },
];

const physicsUpper: Kind[] = [
  () => {
    const u = pick([10, 20, 30, 40]);
    if (Math.random() < 0.5) {
      return {
        prompt: `${name()} throws a ball straight up at ${u} m/s. Taking g = 10 m/s² and ignoring air resistance, how long does it take to reach its highest point?`,
        answer: `${u / 10} s`,
        explanation: `At the top v = 0. Use v = u + at with a = -10: 0 = ${u} - 10t, so t = ${u} ÷ 10 = ${u / 10} s.`,
      };
    }
    return {
      prompt: `${name()} throws a ball straight up at ${u} m/s. Taking g = 10 m/s² and ignoring air resistance, how high does it rise?`,
      answer: `${(u * u) / 20} m`,
      explanation: `At the top v = 0. Use v² = u² + 2as: 0 = ${u}² - 2 × 10 × s, so s = ${u * u} ÷ 20 = ${(u * u) / 20} m.`,
    };
  },
  () => {
    const m1 = randInt(1, 5);
    const k = randInt(2, 4);
    const m2 = m1 * (k - 1);
    const v = k * randInt(2, 8);
    return {
      prompt: `A ${m1} kg trolley moving at ${v} m/s hits a stationary ${m2} kg trolley and the two stick together. What is their velocity after the collision?`,
      answer: `${v / k} m/s`,
      explanation: `Momentum is conserved. Before: ${m1} × ${v} = ${m1 * v} kg m/s. After: total mass ${m1 + m2} kg, so v = ${m1 * v} ÷ ${m1 + m2} = ${v / k} m/s.`,
    };
  },
  () => {
    const i = randInt(1, 4);
    const r1 = randInt(2, 10);
    const r2 = randInt(2, 10);
    const v = i * (r1 + r2);
    return {
      prompt: `Two resistors of ${r1} ohms and ${r2} ohms are connected in series to ${an(v)} ${v} V battery. What current flows?`,
      answer: `${i} A`,
      explanation: `Series resistance = ${r1} + ${r2} = ${r1 + r2} ohms. I = V ÷ R = ${v} ÷ ${r1 + r2} = ${i} A.`,
    };
  },
  () => {
    const [h, t] = pick([
      [5, 1],
      [20, 2],
      [45, 3],
      [80, 4],
    ] as [number, number][]);
    const v = randInt(2, 15);
    return {
      prompt: `A stone is thrown horizontally at ${v} m/s from a cliff ${h} m high. Taking g = 10 m/s² and ignoring air resistance, how far from the base of the cliff does it land?`,
      answer: `${v * t} m`,
      explanation: `Fall time from h = 1/2 g t²: ${h} = 5t², so t = ${t} s. The horizontal speed stays ${v} m/s, so distance = ${v} × ${t} = ${v * t} m.`,
    };
  },
  () => {
    const [h, v] = pick([
      [5, 10],
      [20, 20],
      [45, 30],
      [80, 40],
      [125, 50],
    ] as [number, number][]);
    const m = randInt(1, 10) * 2;
    return {
      prompt: `${an(m).replace(/^a/, "A")} ${m} kg ball is dropped from a height of ${h} m. Ignoring air resistance and taking g = 10 m/s², what is its speed just before it hits the ground?`,
      answer: `${v} m/s`,
      explanation: `Gravitational potential energy becomes kinetic energy: mgh = 1/2 mv², so v = √(2gh) = √(2 × 10 × ${h}) = √${20 * h} = ${v} m/s. (The mass cancels.)`,
    };
  },
  () => {
    const days = pick([2, 3, 5, 10]);
    const n = randInt(1, 4);
    const start = randInt(1, 12) * 2 ** n;
    return {
      prompt: `A radioactive sample has a half-life of ${days} days. It starts with ${start} g. How much is left after ${days * n} days?`,
      answer: `${start / 2 ** n} g`,
      explanation: `${days * n} days is ${n} half-li${n === 1 ? "fe" : "ves"}, so halve the mass ${n} time${n === 1 ? "" : "s"}: ${start} ÷ ${2 ** n} = ${start / 2 ** n} g.`,
    };
  },
  () => {
    const vs = pick([5, 6, 9, 12]);
    return {
      prompt: `A phone charger contains a transformer with 1200 turns on the primary coil. It is plugged into 240 V mains and gives a secondary voltage of ${vs} V. How many turns are on the secondary coil?`,
      answer: String(vs * 5),
      explanation: `Vp ÷ Vs = Np ÷ Ns, so Ns = Np × Vs ÷ Vp = 1200 × ${vs} ÷ 240 = ${vs * 5} turns.`,
    };
  },
  () => {
    let m = 1000;
    let v = 10;
    let r = 20;
    do {
      m = pick([800, 1000, 1200]);
      v = pick([10, 15, 20]);
      r = pick([20, 25, 40, 50]);
    } while ((m * v * v) % r !== 0);
    return {
      prompt: `${an(m).replace(/^a/, "A")} ${m} kg car takes a bend of radius ${r} m at ${v} m/s. What centripetal force is needed?`,
      answer: `${(m * v * v) / r} N`,
      explanation: `F = mv² ÷ r = ${m} × ${v}² ÷ ${r} = ${m} × ${v * v} ÷ ${r} = ${(m * v * v) / r} N.`,
    };
  },
];

// ---------- Chemistry ----------

const SUBSTANCES: [string, number][] = [
  ["water", 18],
  ["carbon dioxide", 44],
  ["sodium chloride", 58.5],
  ["calcium carbonate", 100],
  ["sodium hydroxide", 40],
  ["magnesium oxide", 40],
  ["ammonia", 17],
];

const chemistryLower: Kind[] = [
  () => {
    const [sub, mass] = pick(SUBSTANCES);
    const n = pick([0.5, 1, 1.5, 2, 3]);
    return {
      prompt: `${name()} weighs out ${num(n * mass)} g of ${sub} (molar mass ${mass} g/mol). How many moles is that?`,
      answer: `${n} mol`,
      explanation: `Moles = mass ÷ molar mass = ${num(n * mass)} ÷ ${mass} = ${n} mol.`,
    };
  },
  () => {
    const [sub, mass] = pick(SUBSTANCES);
    const n = pick([0.25, 0.5, 2, 4]);
    return {
      prompt: `A recipe for a science demonstration needs ${n} mol of ${sub} (molar mass ${mass} g/mol). What mass should ${name()} weigh out?`,
      answer: `${num(n * mass)} g`,
      explanation: `Mass = moles × molar mass = ${n} × ${mass} = ${num(n * mass)} g.`,
    };
  },
  () => {
    const x = pick([0.5, 1, 2, 3, 5]);
    return {
      prompt: `A student needs to neutralise ${x} mol of sulfuric acid (H2SO4) with sodium hydroxide (NaOH). H2SO4 + 2NaOH -> Na2SO4 + 2H2O. How many moles of NaOH are needed?`,
      answer: `${2 * x} mol`,
      explanation: `The equation shows 2 mol of NaOH for every 1 mol of H2SO4, so ${x} × 2 = ${2 * x} mol.`,
    };
  },
  () => {
    const k = pick([2, 4, 5, 10]);
    const c1 = k * randInt(1, 3);
    const v1 = pick([10, 20, 25, 50]);
    return {
      prompt: `${v1} mL of ${an(c1)} ${c1} mol/L solution is diluted with water until the total volume is ${v1 * k} mL. What is the new concentration?`,
      answer: `${c1 / k} mol/L`,
      explanation: `The amount of solute is unchanged: c1V1 = c2V2. c2 = ${c1} × ${v1} ÷ ${v1 * k} = ${c1 / k} mol/L.`,
    };
  },
  () => {
    const [eq, fuel, ratio, product] = pick([
      ["CH4 + 2O2 -> CO2 + 2H2O", "methane", 2, "oxygen"],
      ["2H2 + O2 -> 2H2O", "hydrogen", 0.5, "oxygen"],
      ["C3H8 + 5O2 -> 3CO2 + 4H2O", "propane", 5, "oxygen"],
    ] as [string, string, number, string][]);
    const n = pick([2, 4, 6]);
    return {
      prompt: `${name()} burns ${n} mol of ${fuel} in a lab. The equation is ${eq}. How many moles of ${product} are used?`,
      answer: `${num(n * ratio)} mol`,
      explanation: `Use the mole ratio from the equation: ${ratio} mol of ${product} for every 1 mol of ${fuel}. ${n} × ${ratio} = ${num(n * ratio)} mol.`,
    };
  },
  () => {
    const n = randInt(1, 4);
    const conc = ["0.1", "0.01", "0.001", "0.0001"][n - 1];
    return {
      prompt: `A pool cleaner contains hydrochloric acid at ${conc} mol/L. Assuming it fully dissociates, what is its pH?`,
      answer: String(n),
      explanation: `HCl is a strong acid, so [H+] = ${conc} mol/L. pH = -log(${conc}) = ${n}.`,
    };
  },
  () => {
    const m = pick([50, 100, 200]);
    const dt = pick([5, 10, 20]);
    const q = m * 4.18 * dt;
    return {
      prompt: `${name()} heats ${m} g of water and its temperature rises by ${dt} °C. How much heat energy did the water absorb? (Specific heat capacity of water = 4.18 J/g/°C.)`,
      answer: `${num(q)} J`,
      explanation: `q = m × c × change in temperature = ${m} × 4.18 × ${dt} = ${num(q)} J.`,
    };
  },
  () => {
    const [el, z, a] = pick([
      ["sodium", 11, 23],
      ["calcium", 20, 40],
      ["chlorine", 17, 35],
      ["magnesium", 12, 24],
      ["potassium", 19, 39],
    ] as [string, number, number][]);
    return {
      prompt: `An atom of ${el} has a mass number of ${a} and an atomic number of ${z}. How many neutrons does it have?`,
      answer: String(a - z),
      explanation: `Neutrons = mass number - atomic number = ${a} - ${z} = ${a - z}.`,
    };
  },
];

const chemistryUpper: Kind[] = [
  () => {
    const n = pick([0.5, 1, 2, 3]);
    return {
      prompt: `${name()} burns ${num(24 * n)} g of magnesium in oxygen: 2Mg + O2 -> 2MgO (Mg = 24, O = 16). What mass of magnesium oxide forms?`,
      answer: `${num(40 * n)} g`,
      explanation: `Moles of Mg = ${num(24 * n)} ÷ 24 = ${n} mol. The ratio Mg : MgO is 2 : 2, so ${n} mol of MgO forms. Mass = ${n} × 40 = ${num(40 * n)} g.`,
    };
  },
  () => {
    const a = randInt(1, 4);
    const b = randInt(1, 4) * 3;
    const limiting = a < b / 3 ? "N2" : "H2";
    const nh3 = Math.min(2 * a, (2 * b) / 3);
    return {
      prompt: `A reactor contains ${a} mol of N2 and ${b} mol of H2. N2 + 3H2 -> 2NH3. What is the maximum amount of NH3 that can form?`,
      answer: `${num(nh3)} mol`,
      explanation: `N2 could make 2 × ${a} = ${2 * a} mol of NH3. H2 could make ${b} × 2/3 = ${num((2 * b) / 3)} mol. The smaller amount, ${num(nh3)} mol, is the maximum, and ${limiting} is the limiting reagent.`,
    };
  },
  () => {
    const n = pick([0.5, 1, 2, 3]);
    const v = pick([250, 500, 1000]);
    return {
      prompt: `${name()} dissolves ${num(40 * n)} g of sodium hydroxide (M = 40 g/mol) in water and makes the solution up to ${v} mL. What is the concentration?`,
      answer: `${num((n * 1000) / v)} mol/L`,
      explanation: `Moles = ${num(40 * n)} ÷ 40 = ${n} mol. Volume = ${v} ÷ 1000 = ${v / 1000} L. c = ${n} ÷ ${v / 1000} = ${num((n * 1000) / v)} mol/L.`,
    };
  },
  () => {
    for (;;) {
      const c = pick([0.1, 0.2, 0.5]);
      const v = pick([10, 12.5, 15, 20, 25, 30]);
      const cNaOH = (c * v) / 25;
      if (Math.round(cNaOH * 1000) / 1000 !== cNaOH) continue;
      return {
        prompt: `In a titration, 25.0 mL of sodium hydroxide solution is neutralised by ${v} mL of ${c} mol/L hydrochloric acid. What is the concentration of the sodium hydroxide?`,
        answer: `${num(cNaOH)} mol/L`,
        explanation: `HCl + NaOH react 1 : 1. Moles of HCl = ${c} × ${v / 1000} = ${num((c * v) / 1000)} mol, so there are ${num((c * v) / 1000)} mol of NaOH in 0.025 L. c = ${num((c * v) / 1000)} ÷ 0.025 = ${num(cNaOH)} mol/L.`,
      };
    }
  },
  () => {
    const t = randInt(2, 10) * 10;
    const pct = pick([50, 60, 70, 80, 90]);
    return {
      prompt: `A factory should make ${t} tonnes of product but only makes ${(t * pct) / 100} tonnes. What is the percentage yield?`,
      answer: `${pct}%`,
      explanation: `Percentage yield = actual ÷ theoretical × 100 = ${(t * pct) / 100} ÷ ${t} × 100 = ${pct}%.`,
    };
  },
  () => {
    const n = pick([0.5, 1, 2, 3, 4]);
    return {
      prompt: `${name()} collects ${num(n)} mol of carbon dioxide at standard temperature and pressure. What volume does it occupy? (1 mol of gas = 22.4 L.)`,
      answer: `${num(22.4 * n)} L`,
      explanation: `Volume = moles × 22.4 = ${n} × 22.4 = ${num(22.4 * n)} L.`,
    };
  },
  () => {
    const rate = randInt(2, 9);
    const t = randInt(2, 8) * 5;
    const start = rate * t + randInt(5, 20);
    return {
      prompt: `The mass of a reactant falls from ${start} g to ${start - rate * t} g in ${t} s. What is the average rate of reaction?`,
      answer: `${rate} g/s`,
      explanation: `Rate = change in mass ÷ time = (${start} - ${start - rate * t}) ÷ ${t} = ${rate * t} ÷ ${t} = ${rate} g/s.`,
    };
  },
  () => {
    const n = randInt(1, 3);
    const conc = ["0.1", "0.01", "0.001"][n - 1];
    return {
      prompt: `A drain cleaner is ${conc} mol/L sodium hydroxide, which fully dissociates. What is its pH at 25 °C?`,
      answer: String(14 - n),
      explanation: `[OH-] = ${conc} mol/L, so pOH = ${n}. pH = 14 - ${n} = ${14 - n}.`,
    };
  },
];

// ---------- Biology ----------

const biologyLower: Kind[] = [
  () => {
    const [size, mag] = [pick([10, 20, 40, 50]), pick([40, 100, 400])];
    return {
      prompt: `${name()} looks at a cell that is ${size} micrometres long. In a photo taken through the microscope it is ${size * mag} micrometres long. What is the magnification?`,
      answer: String(mag),
      explanation: `Magnification = image size ÷ actual size = ${size * mag} ÷ ${size} = ${mag}.`,
    };
  },
  () => {
    const e = randInt(1, 9) * 10000;
    const level = randInt(1, 3);
    const names = ["primary consumers", "secondary consumers", "tertiary consumers"];
    return {
      prompt: `The grass in a paddock captures ${e} kJ of energy. If only 10% passes to each next level, how much energy reaches the ${names[level - 1]}?`,
      answer: `${e / 10 ** level} kJ`,
      explanation: `Divide by 10 for each step: ${Array.from({ length: level + 1 }, (_, i) => `${e / 10 ** i} kJ`).join(" -> ")}. The ${names[level - 1]} receive ${e / 10 ** level} kJ.`,
    };
  },
  () => {
    const n = randInt(1, 6) * 4;
    return {
      prompt: `Two pea plants that are both Tt (T = tall, dominant) are crossed and produce ${n * 4} seeds. About how many of the seeds are expected to grow into tall plants?`,
      answer: String(n * 3),
      explanation: `Tt × Tt gives TT, Tt, Tt and tt, so 3 out of 4 (3/4) are tall. ${n * 4} × 3/4 = ${n * 3}.`,
    };
  },
  () => {
    const t = pick([15, 20, 30]);
    const bpm = randInt(5, 8) * 12;
    const beats = (bpm * t) / 60;
    return {
      prompt: `${name()} counts ${beats} heartbeats in ${t} seconds. What is the heart rate in beats per minute?`,
      answer: `${bpm} beats per minute`,
      explanation: `${t} seconds fits into one minute ${60 / t} times, so multiply by ${60 / t}: ${beats} × ${60 / t} = ${bpm} beats per minute.`,
    };
  },
  () => {
    const t = randInt(2, 6);
    const rate = randInt(3, 12);
    return {
      prompt: `A pond plant releases ${rate * t} cm³ of oxygen in ${t} minutes. What is its rate of photosynthesis in cm³ of oxygen per minute?`,
      answer: `${rate} cm³/min`,
      explanation: `Rate = volume ÷ time = ${rate * t} ÷ ${t} = ${rate} cm³ per minute.`,
    };
  },
  () => {
    const initial = pick([4, 5, 10, 20]);
    const pct = pick([10, 20, 25, 40]);
    const gain = Math.random() < 0.5;
    const final = (initial * (gain ? 100 + pct : 100 - pct)) / 100;
    return {
      prompt: `${name()} leaves a potato cylinder of mass ${initial} g in a salt solution. Later it has a mass of ${final} g. What is the percentage ${gain ? "increase" : "decrease"} in mass?`,
      answer: `${pct}%`,
      explanation: `Percentage change = change ÷ original × 100 = ${num(Math.abs(final - initial))} ÷ ${initial} × 100 = ${pct}%.`,
    };
  },
  () => {
    const side = pick([1, 2, 3, 6]);
    return {
      prompt: `A model cell is a cube with sides of ${side} cm. What is its surface area to volume ratio?`,
      answer: `${6 / side}:1`,
      explanation: `Surface area = 6 × ${side}² = ${6 * side * side} cm². Volume = ${side}³ = ${side ** 3} cm³. Ratio = ${6 * side * side} : ${side ** 3} = ${6 / side} : 1.`,
    };
  },
  () => {
    const tv = pick([400, 500, 600]);
    const r = randInt(12, 20);
    return {
      prompt: `Each breath ${name()} takes moves about ${tv} mL of air. At rest they take ${r} breaths a minute. How much air is moved in one minute?`,
      answer: `${tv * r} mL`,
      explanation: `Volume per minute = volume per breath × breaths per minute = ${tv} × ${r} = ${tv * r} mL.`,
    };
  },
];

const biologyUpper: Kind[] = [
  () => {
    const marked = pick([20, 30, 40, 50]);
    const recaptured = pick([2, 4, 5, 10]);
    const second = recaptured * randInt(2, 8);
    return {
      prompt: `Researchers mark ${marked} frogs in a pond and release them. A week later they catch ${second} frogs and ${recaptured} of them are marked. Estimate the frog population of the pond.`,
      answer: String((marked * second) / recaptured),
      explanation: `Population = (marked × second catch) ÷ marked recaptured = ${marked} × ${second} ÷ ${recaptured} = ${(marked * second) / recaptured}.`,
    };
  },
  () => {
    const q = pick([0.1, 0.2, 0.3, 0.4, 0.5]);
    return {
      prompt: `In a population in Hardy-Weinberg equilibrium, ${num(q * q * 100)}% of people show a recessive trait. What percentage are heterozygous carriers?`,
      answer: `${num(2 * q * (1 - q) * 100)}%`,
      explanation: `q² = ${num(q * q)}, so q = ${q} and p = 1 - q = ${num(1 - q)}. Carriers = 2pq = 2 × ${num(1 - q)} × ${q} = ${num(2 * q * (1 - q))}, which is ${num(2 * q * (1 - q) * 100)}%.`,
    };
  },
  () => {
    const n = randInt(1, 5) * 16;
    return {
      prompt: `Two AaBb plants (genes assort independently) are crossed and produce ${n} offspring. How many are expected to be aabb?`,
      answer: String(n / 16),
      explanation: `In an AaBb × AaBb cross, the chance of aabb is 1/4 × 1/4 = 1/16. ${n} × 1/16 = ${n / 16}.`,
    };
  },
  () => {
    const rate = randInt(2, 9);
    const t = randInt(2, 8) * 5;
    return {
      prompt: `An enzyme reaction makes ${rate * t} g of product in ${t} minutes. What is the rate of reaction in g per minute?`,
      answer: `${rate} g/min`,
      explanation: `Rate = product ÷ time = ${rate * t} ÷ ${t} = ${rate} g/min.`,
    };
  },
  () => {
    const start = randInt(1, 9) * 100;
    const t = pick([10, 20, 30]);
    const k = randInt(2, 5);
    return {
      prompt: `A culture starts with ${start} bacteria that double every ${t} minutes. How many are there after ${t * k} minutes?`,
      answer: String(start * 2 ** k),
      explanation: `${t * k} minutes is ${k} doublings, so ${start} × 2^${k} = ${start} × ${2 ** k} = ${start * 2 ** k}.`,
    };
  },
  () => {
    const area = pick([2, 5, 10, 20]);
    const d = pick([3, 5, 8, 12, 15]);
    return {
      prompt: `A wildlife survey counts ${d * area} echidnas in a park of ${area} km². What is the population density?`,
      answer: `${d} per km²`,
      explanation: `Density = number ÷ area = ${d * area} ÷ ${area} = ${d} per km².`,
    };
  },
  () => {
    const a = randInt(2, 9) * 1000;
    const pct = pick([5, 10, 15, 20]);
    return {
      prompt: `Producers in a lake capture ${a} kJ of energy and the primary consumers gain ${(a * pct) / 100} kJ. What percentage of the energy is transferred?`,
      answer: `${pct}%`,
      explanation: `Transfer efficiency = energy gained ÷ energy available × 100 = ${(a * pct) / 100} ÷ ${a} × 100 = ${pct}%.`,
    };
  },
  () => {
    const bar = pick([10, 20, 25, 50]);
    const real = pick([10, 20, 50]);
    const mag = (bar * 1000) / real;
    return {
      prompt: `On a micrograph, a scale bar of ${bar} mm represents ${real} micrometres. What is the magnification?`,
      answer: String(mag),
      explanation: `Convert to the same unit: ${bar} mm = ${bar * 1000} micrometres. Magnification = ${bar * 1000} ÷ ${real} = ${mag}.`,
    };
  },
];

// ---------- Economics ----------

const economicsLower: Kind[] = [
  () => {
    const w = randInt(15, 40);
    const h = randInt(2, 8);
    return {
      prompt: `${name()} could work at a cafe for $${w} an hour but chooses to spend ${h} hours at a free workshop instead. What is the opportunity cost of the workshop?`,
      answer: `$${w * h}`,
      explanation: `The opportunity cost is the next best alternative given up: ${h} hours × $${w} = $${w * h} in lost pay.`,
    };
  },
  () => {
    const a = pick([100, 200, 250, 400, 500]);
    const pct = pick([2, 3, 4, 5, 6, 8, 10]);
    const b = (a * (100 + pct)) / 100;
    return {
      prompt: `A basket of groceries cost $${a} last year and costs $${b} this year. What is the inflation rate for the basket?`,
      answer: `${pct}%`,
      explanation: `Inflation = (new price - old price) ÷ old price × 100 = (${b} - ${a}) ÷ ${a} × 100 = ${pct}%.`,
    };
  },
  () => {
    const people = pick([5, 10, 20, 25]);
    const pc = pick([20000, 30000, 40000, 50000, 60000]);
    return {
      prompt: `A country has a GDP of $${(pc * people) / 1000} billion and ${people} million people. What is its GDP per person?`,
      answer: `$${pc}`,
      explanation: `GDP per capita = GDP ÷ population. $${(pc * people) / 1000} billion ÷ ${people} million = $${pc}.`,
    };
  },
  () => {
    const r = pick([0.6, 0.65, 0.7, 0.75]);
    const x = randInt(1, 10) * 100;
    return {
      prompt: `The exchange rate is 1 Australian dollar = ${r} US dollars. ${name()} exchanges A$${x} for US dollars. How many US dollars do they receive?`,
      answer: `US$${num(x * r)}`,
      explanation: `Multiply by the exchange rate: ${x} × ${r} = US$${num(x * r)}.`,
    };
  },
  () => {
    const labour = randInt(2, 10) * 100000;
    const pct = randInt(3, 9);
    return {
      prompt: `A town has a labour force of ${labour} people and ${(labour * pct) / 100} of them are unemployed. What is the unemployment rate?`,
      answer: `${pct}%`,
      explanation: `Unemployment rate = unemployed ÷ labour force × 100 = ${(labour * pct) / 100} ÷ ${labour} × 100 = ${pct}%.`,
    };
  },
  () => {
    const p = pick([5, 10, 20]);
    const ped = pick([0.5, 1, 1.5, 2, 3]);
    return {
      prompt: `${name()}'s shop raises the price of a product by ${p}% and the quantity sold falls by ${num(ped * p)}%. What is the price elasticity of demand?`,
      answer: String(ped),
      explanation: `PED = % change in quantity ÷ % change in price = ${num(ped * p)} ÷ ${p} = ${ped}. ${ped > 1 ? "This is above 1, so demand is elastic." : ped < 1 ? "This is below 1, so demand is inelastic." : "This equals 1, so demand is unit elastic."}`,
    };
  },
  () => {
    const price = randInt(2, 40) * 10;
    return {
      prompt: `A jacket is advertised at $${price} before GST. GST is 10%. What is the price a customer pays?`,
      answer: `$${num(price * 1.1)}`,
      explanation: `GST = 10% of $${price} = $${price / 10}. Total = $${price} + $${price / 10} = $${num(price * 1.1)}.`,
    };
  },
  () => {
    const rev = randInt(20, 60) * 10;
    const spend = randInt(20, 60) * 10;
    return {
      prompt: `A state government collects $${rev} million in taxes and spends $${spend} million. Is there a surplus or a deficit, and how large is it?`,
      answer: rev === spend ? "balanced budget" : `${rev > spend ? "surplus" : "deficit"} of $${Math.abs(rev - spend)} million`,
      explanation: `Compare revenue with spending: ${rev} - ${spend} = ${rev - spend}. ${rev > spend ? "Revenue is greater, so it is a surplus" : rev < spend ? "Spending is greater, so it is a deficit" : "They are equal, so the budget is balanced"}.`,
    };
  },
];

const economicsUpper: Kind[] = [
  () => {
    const mpc = pick([0.5, 0.6, 0.75, 0.8, 0.9]);
    const g = randInt(1, 8) * 10;
    const multiplier = 1 / (1 - mpc);
    return {
      prompt: `The marginal propensity to consume is ${mpc}. The government increases spending by $${g} million. What is the total increase in national income?`,
      answer: `$${num(g * multiplier)} million`,
      explanation: `Multiplier = 1 ÷ (1 - MPC) = 1 ÷ ${num(1 - mpc)} = ${num(multiplier)}. Total change = ${g} × ${num(multiplier)} = $${num(g * multiplier)} million.`,
    };
  },
  () => {
    const deflator = pick([110, 120, 125, 150, 200]);
    const real = randInt(4, 20) * 100;
    return {
      prompt: `Nominal GDP is $${(real * deflator) / 100} billion and the GDP deflator is ${deflator} (base year = 100). What is real GDP?`,
      answer: `$${real} billion`,
      explanation: `Real GDP = nominal GDP ÷ deflator × 100 = ${(real * deflator) / 100} ÷ ${deflator} × 100 = $${real} billion.`,
    };
  },
  () => {
    const c = randInt(40, 100) * 10;
    const i = randInt(10, 30) * 10;
    const g = randInt(10, 30) * 10;
    const x = randInt(10, 30) * 10;
    const m = randInt(10, 30) * 10;
    return {
      prompt: `In one year, consumption was $${c} billion, investment $${i} billion, government spending $${g} billion, exports $${x} billion and imports $${m} billion. Calculate GDP.`,
      answer: `$${c + i + g + x - m} billion`,
      explanation: `GDP = C + I + G + (X - M) = ${c} + ${i} + ${g} + (${x} - ${m}) = $${c + i + g + x - m} billion.`,
    };
  },
  () => {
    const cpi = pick([110, 125, 140, 150, 200]);
    const real = randInt(20, 60) * 20;
    return {
      prompt: `${name()} earns $${(real * cpi) / 100} a week and the consumer price index is ${cpi} (base = 100). What is the real weekly wage in base-year dollars?`,
      answer: `$${real}`,
      explanation: `Real wage = nominal wage ÷ CPI × 100 = ${(real * cpi) / 100} ÷ ${cpi} × 100 = $${real}.`,
    };
  },
  () => {
    const old = pick([100, 120, 125, 150, 200]);
    const pct = pick([2, 3, 4, 5, 6, 8]);
    const now = num((old * (100 + pct)) / 100);
    return {
      prompt: `The consumer price index rises from ${old} to ${now}. What is the inflation rate?`,
      answer: `${pct}%`,
      explanation: `Inflation = (${now} - ${old}) ÷ ${old} × 100 = ${pct}%.`,
    };
  },
  () => {
    const wA = randInt(2, 5) * 10;
    const cA = randInt(1, 4) * 5;
    const wB = randInt(2, 5) * 5;
    const cB = randInt(1, 4) * 5;
    const ocA = wA / cA;
    const ocB = wB / cB;
    return {
      prompt: `In a day, country A can produce either ${wA} units of wheat or ${cA} units of cloth. Country B can produce either ${wB} units of wheat or ${cB} units of cloth. What is the opportunity cost of one unit of cloth in country A, in units of wheat?`,
      answer: `${num(ocA)} wheat`,
      explanation: `For country A, giving up ${wA} wheat gets ${cA} cloth, so 1 cloth costs ${wA} ÷ ${cA} = ${num(ocA)} wheat. In country B it costs ${wB} ÷ ${cB} = ${num(ocB)} wheat, so ${ocA < ocB ? "country A" : ocA > ocB ? "country B" : "neither country"} has the lower opportunity cost of cloth${ocA === ocB ? "" : " and the comparative advantage in it"}.`,
    };
  },
  () => {
    const before = pick([0.6, 0.65, 0.7]);
    const after = pick([0.75, 0.8]);
    const price = randInt(1, 10) * 1000;
    return {
      prompt: `An Australian company sells a machine for A$${price}. When A$1 = US$${before} the machine costs a US buyer US$${num(price * before)}. If the exchange rate rises to A$1 = US$${after}, what will the buyer pay?`,
      answer: `US$${num(price * after)}`,
      explanation: `New price = ${price} × ${after} = US$${num(price * after)}. The Australian dollar has appreciated, so Australian exports cost more to overseas buyers.`,
    };
  },
  () => {
    const p = pick([5, 10, 20]);
    const ped = pick([0.5, 0.8, 1.5, 2, 2.5]);
    return {
      prompt: `${pick(BUSINESSES)} raises the price of a product by ${p}%. The price elasticity of demand for the product is ${ped}. By what percentage is the quantity sold expected to fall?`,
      answer: `${num(ped * p)}%`,
      explanation: `PED = % change in quantity ÷ % change in price, so % change in quantity = ${ped} × ${p} = ${num(ped * p)}%. Demand is ${ped > 1 ? "elastic, so the fall is bigger than the price rise" : "inelastic, so the fall is smaller than the price rise"}.`,
    };
  },
];

// ---------- Business Studies ----------

const businessLower: Kind[] = [
  () => {
    const biz = pick(BUSINESSES);
    const cost = randInt(2, 20) * 10;
    const pct = pick([20, 25, 40, 50]);
    return {
      prompt: `${biz} buys an item for $${cost} and adds a ${pct}% mark-up. What is the selling price?`,
      answer: `$${num(cost * (1 + pct / 100))}`,
      explanation: `Mark-up = ${pct}% of $${cost} = $${num((cost * pct) / 100)}. Selling price = $${cost} + $${num((cost * pct) / 100)} = $${num(cost * (1 + pct / 100))}.`,
    };
  },
  () => {
    const biz = pick(BUSINESSES);
    const price = randInt(5, 40);
    const qty = randInt(2, 40) * 50;
    const profit = randInt(1, Math.floor((price * qty) / 200)) * 100;
    return {
      prompt: `${biz} sells ${qty} items at $${price} each. Its total costs for the month are $${price * qty - profit}. What is its profit?`,
      answer: `$${profit}`,
      explanation: `Revenue = ${qty} × $${price} = $${price * qty}. Profit = revenue - costs = $${price * qty} - $${price * qty - profit} = $${profit}.`,
    };
  },
  () => {
    const biz = pick(BUSINESSES);
    const pct = pick([5, 8, 10, 15, 20, 25]);
    const market = randInt(2, 20) * 1000000;
    return {
      prompt: `${biz} has sales of $${(market * pct) / 100} in a market worth $${market} in total. What is its market share?`,
      answer: `${pct}%`,
      explanation: `Market share = firm's sales ÷ total market sales × 100 = ${(market * pct) / 100} ÷ ${market} × 100 = ${pct}%.`,
    };
  },
  () => {
    const biz = pick(BUSINESSES);
    const fixed = randInt(2, 10) * 1000;
    const price = randInt(10, 30);
    const vc = randInt(3, price - 4);
    const units = Math.ceil(fixed / (price - vc));
    return {
      prompt: `${biz} has fixed costs of $${fixed} a month. Each item sells for $${price} and costs $${vc} to make. How many items must it sell to break even? (Round up to a whole item.)`,
      answer: String(units),
      explanation: `Break-even = fixed costs ÷ (price - variable cost) = ${fixed} ÷ (${price} - ${vc}) = ${fixed} ÷ ${price - vc} = ${num(fixed / (price - vc))}, so ${units} items.`,
    };
  },
  () => {
    const biz = pick(BUSINESSES);
    const staff = randInt(2, 12);
    const rate = randInt(20, 35);
    const hours = randInt(2, 5) * 10;
    return {
      prompt: `${biz} employs ${staff} staff who each work ${hours} hours a week at $${rate} an hour. What is the weekly wage bill?`,
      answer: `$${staff * hours * rate}`,
      explanation: `Total hours = ${staff} × ${hours} = ${staff * hours}. Wage bill = ${staff * hours} × $${rate} = $${staff * hours * rate}.`,
    };
  },
  () => {
    const biz = pick(BUSINESSES);
    const price = randInt(4, 40) * 5;
    const d = pick([10, 20, 25, 30, 40]);
    return {
      prompt: `${biz} puts a $${price} product on sale with ${d}% off. What is the sale price?`,
      answer: `$${num((price * (100 - d)) / 100)}`,
      explanation: `Discount = ${d}% of $${price} = $${num((price * d) / 100)}. Sale price = $${price} - $${num((price * d) / 100)} = $${num((price * (100 - d)) / 100)}.`,
    };
  },
  () => {
    const biz = pick(BUSINESSES);
    const old = randInt(4, 20) * 50;
    const pct = pick([10, 20, 25, 40]);
    return {
      prompt: `${biz} had ${old} customers last month and ${(old * (100 + pct)) / 100} this month. What is the percentage growth in customers?`,
      answer: `${pct}%`,
      explanation: `Growth = (new - old) ÷ old × 100 = (${(old * (100 + pct)) / 100} - ${old}) ÷ ${old} × 100 = ${pct}%.`,
    };
  },
  () => {
    const biz = pick(BUSINESSES);
    const rev = randInt(5, 60) * 1000;
    const pct = pick([5, 8, 10, 12, 15, 20]);
    return {
      prompt: `${biz} has revenue of $${rev} and a net profit of $${(rev * pct) / 100}. What is its net profit margin?`,
      answer: `${pct}%`,
      explanation: `Net profit margin = net profit ÷ revenue × 100 = ${(rev * pct) / 100} ÷ ${rev} × 100 = ${pct}%.`,
    };
  },
];

const businessUpper: Kind[] = [
  () => {
    const cost = randInt(5, 50) * 1000;
    const pct = pick([10, 15, 20, 25, 30]);
    return {
      prompt: `${pick(BUSINESSES)} spends $${cost} on new equipment and it adds $${(cost * pct) / 100} to profit over the year. What is the return on investment?`,
      answer: `${pct}%`,
      explanation: `ROI = gain ÷ cost × 100 = ${(cost * pct) / 100} ÷ ${cost} × 100 = ${pct}%.`,
    };
  },
  () => {
    const staff = pick([20, 40, 50, 80, 100]);
    const pct = pick([5, 10, 15, 20]);
    return {
      prompt: `${pick(BUSINESSES)} has an average of ${staff} staff and ${(staff * pct) / 100} of them left during the year. What is the staff turnover rate?`,
      answer: `${pct}%`,
      explanation: `Staff turnover = leavers ÷ average staff × 100 = ${(staff * pct) / 100} ÷ ${staff} × 100 = ${pct}%.`,
    };
  },
  () => {
    const workers = randInt(4, 25);
    const per = randInt(30, 90);
    return {
      prompt: `A factory with ${workers} workers makes ${workers * per} units in a week. What is its labour productivity?`,
      answer: `${per} units per worker`,
      explanation: `Labour productivity = output ÷ labour input = ${workers * per} ÷ ${workers} = ${per} units per worker.`,
    };
  },
  () => {
    let fixed = 5000;
    let price = 20;
    let vc = 5;
    do {
      fixed = randInt(2, 8) * 5000;
      price = pick([20, 25, 30, 40, 50]);
      vc = pick([5, 10, 15]);
    } while (fixed % (price - vc) !== 0);
    const breakEven = fixed / (price - vc);
    const expected = breakEven + randInt(1, 10) * 50;
    return {
      prompt: `A business has fixed costs of $${fixed}, sells at $${price} and has variable costs of $${vc} per unit. It expects to sell ${expected} units. What is its margin of safety in units?`,
      answer: `${expected - breakEven} units`,
      explanation: `Break-even = ${fixed} ÷ (${price} - ${vc}) = ${breakEven} units. Margin of safety = expected sales - break-even = ${expected} - ${breakEven} = ${expected - breakEven} units.`,
    };
  },
  () => {
    const cap = pick([2000, 4000, 5000, 8000]);
    const pct = pick([50, 60, 75, 80, 90]);
    return {
      prompt: `A factory can make ${cap} units a month but makes ${(cap * pct) / 100}. What is its capacity utilisation?`,
      answer: `${pct}%`,
      explanation: `Capacity utilisation = actual output ÷ capacity × 100 = ${(cap * pct) / 100} ÷ ${cap} × 100 = ${pct}%.`,
    };
  },
  () => {
    const staff = pick([20, 50, 100]);
    const days = pick([20, 25]);
    let pct = 1;
    while (((staff * days * pct) / 100) % 1 !== 0) pct = pick([1, 2, 4, 5]);
    return {
      prompt: `${pick(BUSINESSES)} has ${staff} employees who should each work ${days} days this month. ${(staff * days * pct) / 100} days were lost to absence. What is the absenteeism rate?`,
      answer: `${pct}%`,
      explanation: `Days that should be worked = ${staff} × ${days} = ${staff * days}. Rate = ${(staff * days * pct) / 100} ÷ ${staff * days} × 100 = ${pct}%.`,
    };
  },
  () => {
    const units = randInt(2, 20) * 100;
    const cost = randInt(2, 15) * 1000;
    return {
      prompt: `${pick(BUSINESSES)} spends $${cost} to produce ${units} units. What is the average cost per unit?`,
      answer: `$${num(cost / units)}`,
      explanation: `Average cost = total cost ÷ quantity = $${cost} ÷ ${units} = $${num(cost / units)} per unit.`,
    };
  },
  () => {
    const rev = randInt(10, 100) * 10000;
    const pct = pick([4, 5, 8, 10, 12]);
    const next = (rev * (100 + pct)) / 100;
    return {
      prompt: `${pick(BUSINESSES)}'s sales grew from $${rev} to $${next}. What is the sales growth rate?`,
      answer: `${pct}%`,
      explanation: `Sales growth = (new - old) ÷ old × 100 = (${next} - ${rev}) ÷ ${rev} × 100 = ${pct}%.`,
    };
  },
];

export const physicsWordProblems = (grade: number): Topic => topicFrom(grade <= 10 ? physicsLower : physicsUpper);
export const chemistryWordProblems = (grade: number): Topic => topicFrom(grade <= 10 ? chemistryLower : chemistryUpper);
export const biologyWordProblems = (grade: number): Topic => topicFrom(grade <= 10 ? biologyLower : biologyUpper);
export const economicsWordProblems = (grade: number): Topic => topicFrom(grade <= 10 ? economicsLower : economicsUpper);
export const businessWordProblems = (grade: number): Topic => topicFrom(grade <= 10 ? businessLower : businessUpper);
