import type { Difficulty, Syllabus, Topic } from "../types";
import { unpack } from "./codec";
import { bankMCQ, pick, randInt } from "./utils";
import { morePhysicsTopics } from "./electivesMore";

const ENERGY_TRANSFORMS: [string, string][] = unpack("W1siQSBzb2xhciBwYW5lbCBnZW5lcmF0aW5nIGVsZWN0cmljaXR5IiwibGlnaHQgdG8gZWxlY3RyaWNhbCJdLFsiQSBjYXIgZW5naW5lIGJ1cm5pbmcgcGV0cm9sIiwiY2hlbWljYWwgdG8ga2luZXRpYyJdLFsiQSB3aW5kIHR1cmJpbmUgY29ubmVjdGVkIHRvIGEgZ2VuZXJhdG9yIiwia2luZXRpYyB0byBlbGVjdHJpY2FsIl0sWyJBIGxvdWRzcGVha2VyIHBsYXlpbmcgbXVzaWMiLCJlbGVjdHJpY2FsIHRvIHNvdW5kIl0sWyJBIGNhbXBmaXJlIiwiY2hlbWljYWwgdG8gdGhlcm1hbCJdLFsiQSBmaWxhbWVudCBsaWdodCBidWxiICh1c2VmdWwgb3V0cHV0KSIsImVsZWN0cmljYWwgdG8gbGlnaHQiXV0=");
const WAVE_BEHAVIOUR: [string, string][] = unpack("W1siV2F2ZXMgYm91bmNlIGJhY2sgZnJvbSBhIHN1cmZhY2UiLCJyZWZsZWN0aW9uIl0sWyJXYXZlcyBjaGFuZ2UgZGlyZWN0aW9uIGFzIHRoZXkgZW50ZXIgYSBkaWZmZXJlbnQgbWVkaXVtIiwicmVmcmFjdGlvbiJdLFsiV2F2ZXMgc3ByZWFkIG91dCBhZnRlciBwYXNzaW5nIHRocm91Z2ggYSBuYXJyb3cgZ2FwIiwiZGlmZnJhY3Rpb24iXSxbIlR3byB3YXZlcyBvdmVybGFwIGFuZCBjb21iaW5lIGludG8gYSBzaW5nbGUgd2F2ZSIsImludGVyZmVyZW5jZSJdLFsiUmlwcGxlcyBjaGFuZ2Ugc3BlZWQgYW5kIGRpcmVjdGlvbiB3aGVuIGVudGVyaW5nIHNoYWxsb3cgd2F0ZXIiLCJyZWZyYWN0aW9uIl0sWyJTb3VuZCBpcyBoZWFyZCBhcm91bmQgYSBjb3JuZXIiLCJkaWZmcmFjdGlvbiJdLFsiQW4gZWNobyBoZWFyZCBmcm9tIGEgY2xpZmYiLCJyZWZsZWN0aW9uIl1d");
const THERMAL: [string, string][] = unpack("W1siSGVhdCBwYXNzaW5nIGFsb25nIGEgbWV0YWwgcm9kIGZyb20gdGhlIGhvdCBlbmQgdG8gdGhlIGNvb2wgZW5kIiwiY29uZHVjdGlvbiJdLFsiV2FybSBhaXIgcmlzaW5nIGFib3ZlIGEgaGVhdGVyIGFuZCBjb29sIGFpciBzaW5raW5nIiwiY29udmVjdGlvbiJdLFsiVGhlIFN1biB3YXJtaW5nIHRoZSBFYXJ0aCBhY3Jvc3MgZW1wdHkgc3BhY2UiLCJyYWRpYXRpb24iXSxbIkEgbWV0YWwgc3Bvb24gYmVjb21pbmcgaG90IGluIGEgYm93bCBvZiBob3Qgc291cCIsImNvbmR1Y3Rpb24iXSxbIldhcm0gd2F0ZXIgcmlzaW5nIGluIGEgaGVhdGVkIHBhbiIsImNvbnZlY3Rpb24iXSxbIkZlZWxpbmcgaGVhdCBmcm9tIGEgY2FtcGZpcmUgb24geW91ciBmYWNlIHdpdGhvdXQgdG91Y2hpbmcgaXQiLCJyYWRpYXRpb24iXV0=");
const EM_SPECTRUM: [string, string][] = unpack("W1siVXNlZCBmb3IgY29va2luZyBhbmQgc2F0ZWxsaXRlIGNvbW11bmljYXRpb24iLCJtaWNyb3dhdmVzIl0sWyJVc2VkIGluIHJlbW90ZSBjb250cm9scyBhbmQgdGhlcm1hbCBpbWFnaW5nIiwiaW5mcmFyZWQiXSxbIlVzZWQgaW4gbWVkaWNhbCBpbWFnaW5nIG9mIGJvbmVzIiwiWC1yYXlzIl0sWyJVc2VkIHRvIHN0ZXJpbGlzZSB3YXRlciBhbmQgZGV0ZWN0IGZvcmdlZCBiYW5rbm90ZXMiLCJ1bHRyYXZpb2xldCJdLFsiVXNlZCBmb3IgYnJvYWRjYXN0aW5nIHJhZGlvIGFuZCB0ZWxldmlzaW9uIiwicmFkaW8gd2F2ZXMiXSxbIkhhcyB0aGUgaGlnaGVzdCBmcmVxdWVuY3kgYW5kIGlzIGVtaXR0ZWQgYnkgcmFkaW9hY3RpdmUgbnVjbGVpIiwiZ2FtbWEgcmF5cyJdLFsiSXMgdGhlIG9ubHkgcGFydCBkZXRlY3RlZCBieSB0aGUgaHVtYW4gZXllIiwidmlzaWJsZSBsaWdodCJdXQ==");

const ENERGY_NOTE: Record<string, string> = {
  "A solar panel generating electricity": "the panel takes in light and gives out electrical energy",
  "A car engine burning petrol": "the petrol stores chemical energy, which becomes the kinetic energy of the moving car",
  "A wind turbine connected to a generator": "the moving air has kinetic energy, which the generator turns into electrical energy",
  "A loudspeaker playing music": "it takes in electrical energy and gives out sound",
  "A campfire": "the wood stores chemical energy, which is released mainly as thermal energy",
  "A filament light bulb (useful output)": "it takes in electrical energy and the useful output is light (most of the energy is wasted as heat)",
};

const WAVE_NOTE: Record<string, string> = {
  reflection: "waves bounce off a surface",
  refraction: "waves change speed, and so change direction, when they enter a different medium",
  diffraction: "waves spread out when they pass through a gap or around an obstacle",
  interference: "two waves meet and add together or cancel out",
};

const WAVE_ITEM_NOTE: Record<string, string> = {
  "Ripples change speed and direction when entering shallow water": "a change of speed and direction at a boundary is refraction",
  "Sound is heard around a corner": "sound spreading around the edge of the corner is diffraction",
  "An echo heard from a cliff": "sound bouncing back off the cliff is reflection",
};

const THERMAL_NOTE: Record<string, string> = {
  conduction: "heat passes through a solid from particle to particle, with no bulk movement of the material",
  convection: "heat is carried by the movement of a warm fluid, which rises while cooler fluid sinks",
  radiation: "heat travels as infrared waves, so it needs no material to pass through, even empty space",
};

const EM_NOTE: Record<string, string> = {
  microwaves: "Microwaves heat water in food and carry satellite signals",
  infrared: "Infrared is emitted by warm objects, so it is used in remote controls and thermal cameras",
  "X-rays": "X-rays pass through soft tissue but are absorbed by bone, so they show bones on an image",
  ultraviolet: "Ultraviolet radiation kills microbes and makes special inks glow",
  "radio waves": "Radio waves have the longest wavelength and carry radio and television signals",
  "gamma rays": "Gamma rays have the shortest wavelength and highest frequency and come from radioactive nuclei",
  "visible light": "Visible light is the small part of the spectrum that our eyes can detect",
};

const EXPLAIN: Record<string, (item: string, answer: string) => string> = {
  "energy-transformations": (x, a) => `${x}: ${ENERGY_NOTE[x]}. The main transformation is ${a}.`,
  "wave-behaviour": (x, a) => `${WAVE_ITEM_NOTE[x] ? `${WAVE_ITEM_NOTE[x][0].toUpperCase()}${WAVE_ITEM_NOTE[x].slice(1)}` : `In ${a}, ${WAVE_NOTE[a]}`}. So the answer is ${a}.`,
  "thermal-transfer": (_x, a) => `This is ${a}: ${THERMAL_NOTE[a]}.`,
  "em-spectrum": (_x, a) => `${EM_NOTE[a]}, so the answer is ${a}.`,
};

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
    bank.map(([item, answer]) => ({ prompt: prompt(item), answer, explanation: EXPLAIN[id]?.(item, answer) })),
    pool,
  );
}

// ---------- Grades 9-10 ----------

function speedDistanceTime(): Topic {
  return {
    id: "speed-distance-time",
    label: "Speed, distance and time",
    generate: () => {
      const speed = randInt(2, 30);
      const time = randInt(2, 20);
      const distance = speed * time;
      const kind = pick(["speed", "distance", "time"] as const);
      if (kind === "speed") {
        return {
          prompt: `A car travels ${distance} m in ${time} s. What is its average speed?`,
          answer: `${speed} m/s`,
          explanation: `Speed = distance / time = ${distance} / ${time} = ${speed} m/s.`,
        };
      }
      if (kind === "distance") {
        return {
          prompt: `A cyclist travels at a constant ${speed} m/s for ${time} s. How far does the cyclist travel?`,
          answer: `${distance} m`,
          explanation: `Distance = speed x time = ${speed} x ${time} = ${distance} m.`,
        };
      }
      return {
        prompt: `A runner covers ${distance} m at a constant speed of ${speed} m/s. How long does this take?`,
        answer: `${time} s`,
        explanation: `Time = distance / speed = ${distance} / ${speed} = ${time} s.`,
      };
    },
  };
}

function newtonsSecondLaw(): Topic {
  return {
    id: "newtons-second-law",
    label: "Force, mass and acceleration",
    generate: () => {
      const mass = randInt(1, 20);
      const accel = randInt(1, 10);
      const force = mass * accel;
      const kind = pick(["force", "mass", "acceleration"] as const);
      if (kind === "force") {
        return {
          prompt: `A ${mass} kg object accelerates at ${accel} m/s^2. What is the resultant force acting on it?`,
          answer: `${force} N`,
          explanation: `Force = mass x acceleration (F = ma) = ${mass} x ${accel} = ${force} N.`,
        };
      }
      if (kind === "mass") {
        return {
          prompt: `A resultant force of ${force} N gives an object an acceleration of ${accel} m/s^2. What is its mass?`,
          answer: `${mass} kg`,
          explanation: `Rearrange F = ma to m = F / a = ${force} / ${accel} = ${mass} kg.`,
        };
      }
      return {
        prompt: `A resultant force of ${force} N acts on a ${mass} kg object. What is its acceleration?`,
        answer: `${accel} m/s^2`,
        explanation: `Rearrange F = ma to a = F / m = ${force} / ${mass} = ${accel} m/s^2.`,
      };
    },
  };
}

function ohmsLaw(): Topic {
  return {
    id: "ohms-law",
    label: "Voltage, current and resistance",
    generate: () => {
      const current = randInt(1, 5);
      const resistance = randInt(2, 50);
      const voltage = current * resistance;
      const kind = pick(["voltage", "current", "resistance"] as const);
      if (kind === "voltage") {
        return {
          prompt: `A current of ${current} A flows through a ${resistance} ohm resistor. What is the voltage across it?`,
          answer: `${voltage} V`,
          explanation: `Voltage = current x resistance (V = IR) = ${current} x ${resistance} = ${voltage} V.`,
        };
      }
      if (kind === "current") {
        return {
          prompt: `A ${voltage} V supply is connected across a ${resistance} ohm resistor. What current flows?`,
          answer: `${current} A`,
          explanation: `Rearrange V = IR to I = V / R = ${voltage} / ${resistance} = ${current} A.`,
        };
      }
      return {
        prompt: `A ${voltage} V supply drives a current of ${current} A through a resistor. What is its resistance?`,
        answer: `${resistance} ohms`,
        explanation: `Rearrange V = IR to R = V / I = ${voltage} / ${current} = ${resistance} ohms.`,
      };
    },
  };
}

function energyTransformations(): Topic {
  return bankTopic(
    "energy-transformations",
    "Energy transformations",
    ENERGY_TRANSFORMS,
    (x) => `What is the main energy transformation in this device or process? "${x}"`,
  );
}

function waveEquation(): Topic {
  return {
    id: "wave-equation",
    label: "Wave speed, frequency and wavelength",
    generate: () => {
      const freq = pick([2, 5, 10, 20, 50]);
      const wavelength = randInt(1, 10);
      const speed = freq * wavelength;
      const kind = pick(["speed", "frequency", "wavelength"] as const);
      if (kind === "speed") {
        return {
          prompt: `A wave has a frequency of ${freq} Hz and a wavelength of ${wavelength} m. What is its speed?`,
          answer: `${speed} m/s`,
          explanation: `Wave speed = frequency x wavelength (v = f x wavelength) = ${freq} x ${wavelength} = ${speed} m/s.`,
        };
      }
      if (kind === "frequency") {
        return {
          prompt: `A wave travels at ${speed} m/s and has a wavelength of ${wavelength} m. What is its frequency?`,
          answer: `${freq} Hz`,
          explanation: `Rearrange v = f x wavelength to f = v / wavelength = ${speed} / ${wavelength} = ${freq} Hz.`,
        };
      }
      return {
        prompt: `A wave travels at ${speed} m/s and has a frequency of ${freq} Hz. What is its wavelength?`,
        answer: `${wavelength} m`,
        explanation: `Rearrange v = f x wavelength to wavelength = v / f = ${speed} / ${freq} = ${wavelength} m.`,
      };
    },
  };
}

function density(): Topic {
  return {
    id: "density",
    label: "Density",
    generate: () => {
      const rho = pick([1, 2, 3, 5, 8, 10]);
      const volume = randInt(10, 100);
      const mass = rho * volume;
      const kind = pick(["density", "mass", "volume"] as const);
      if (kind === "density") {
        return {
          prompt: `A block has a mass of ${mass} g and a volume of ${volume} cm^3. What is its density?`,
          answer: `${rho} g/cm^3`,
          explanation: `Density = mass / volume = ${mass} / ${volume} = ${rho} g/cm^3.`,
        };
      }
      if (kind === "mass") {
        return {
          prompt: `A material has a density of ${rho} g/cm^3. What is the mass of ${volume} cm^3 of it?`,
          answer: `${mass} g`,
          explanation: `Mass = density x volume = ${rho} x ${volume} = ${mass} g.`,
        };
      }
      return {
        prompt: `A material has a density of ${rho} g/cm^3. What volume is occupied by ${mass} g of it?`,
        answer: `${volume} cm^3`,
        explanation: `Volume = mass / density = ${mass} / ${rho} = ${volume} cm^3.`,
      };
    },
  };
}

function workAndPower(): Topic {
  return {
    id: "work-and-power",
    label: "Work and power",
    generate: () => {
      if (Math.random() < 0.5) {
        const force = randInt(5, 100);
        const dist = randInt(2, 20);
        return {
          prompt: `A force of ${force} N moves an object ${dist} m in the direction of the force. How much work is done?`,
          answer: `${force * dist} J`,
          explanation: `Work done = force x distance = ${force} x ${dist} = ${force * dist} J.`,
        };
      }
      const energy = randInt(2, 50) * 10;
      const time = pick([2, 5, 10]);
      return {
        prompt: `A machine transfers ${energy} J of energy in ${time} s. What is its power?`,
        answer: `${energy / time} W`,
        explanation: `Power = energy / time = ${energy} / ${time} = ${energy / time} W.`,
      };
    },
  };
}

// ---------- Grades 11-12 ----------

function suvat(): Topic {
  return {
    id: "suvat",
    label: "Kinematics (constant acceleration)",
    generate: () => {
      const u = pick([0, 2, 4, 6]);
      const a = randInt(1, 5);
      if (Math.random() < 0.5) {
        const t = randInt(2, 10);
        return {
          prompt: `A car accelerates uniformly from ${u} m/s at ${a} m/s^2 for ${t} s. What is its final velocity?`,
          answer: `${u + a * t} m/s`,
          explanation: `Use v = u + at = ${u} + ${a} x ${t} = ${u + a * t} m/s.`,
        };
      }
      const t = randInt(1, 5) * 2;
      return {
        prompt: `A car accelerates uniformly from ${u} m/s at ${a} m/s^2 for ${t} s. How far does it travel in this time?`,
        answer: `${u * t + (a * t * t) / 2} m`,
        explanation: `Use s = ut + 1/2 at^2 = ${u} x ${t} + 1/2 x ${a} x ${t}^2 = ${u * t} + ${(a * t * t) / 2} = ${u * t + (a * t * t) / 2} m.`,
      };
    },
  };
}

function momentumAndImpulse(): Topic {
  return {
    id: "momentum-impulse",
    label: "Momentum and impulse",
    generate: () => {
      const kind = pick(["momentum", "impulse", "collision"] as const);
      if (kind === "momentum") {
        const m = randInt(1, 20);
        const v = randInt(1, 30);
        return {
          prompt: `A ${m} kg object moves at ${v} m/s. What is its momentum?`,
          answer: `${m * v} kg m/s`,
          explanation: `Momentum = mass x velocity = ${m} x ${v} = ${m * v} kg m/s.`,
        };
      }
      if (kind === "impulse") {
        const force = randInt(1, 10) * 10;
        const time = randInt(1, 5);
        return {
          prompt: `A constant force of ${force} N acts on an object for ${time} s. What is the impulse?`,
          answer: `${force * time} Ns`,
          explanation: `Impulse = force x time = ${force} x ${time} = ${force * time} Ns.`,
        };
      }
      const m = randInt(1, 10);
      const v1 = randInt(1, 10) * 2;
      return {
        prompt: `A ${m} kg trolley moving at ${v1} m/s collides with a stationary ${m} kg trolley and they stick together. What is their velocity after the collision?`,
        answer: `${v1 / 2} m/s`,
        explanation: `Momentum is conserved. Before: ${m} x ${v1} + ${m} x 0 = ${m * v1} kg m/s. After they stick together the mass is ${2 * m} kg, so v = ${m * v1} / ${2 * m} = ${v1 / 2} m/s.`,
      };
    },
  };
}

function kineticAndPotentialEnergy(): Topic {
  return {
    id: "ke-gpe",
    label: "Kinetic and potential energy",
    generate: () => {
      if (Math.random() < 0.5) {
        const m = pick([2, 4, 6, 8, 10]);
        const v = randInt(2, 12);
        return {
          prompt: `A ${m} kg object moves at ${v} m/s. What is its kinetic energy?`,
          answer: `${(m * v * v) / 2} J`,
          explanation: `Kinetic energy = 1/2 x m x v^2 = 1/2 x ${m} x ${v}^2 = 1/2 x ${m} x ${v * v} = ${(m * v * v) / 2} J.`,
        };
      }
      const m = randInt(1, 20);
      const h = randInt(1, 30);
      return {
        prompt: `A ${m} kg object is lifted ${h} m above the ground. Taking g = 10 m/s^2, what is its gravitational potential energy gain?`,
        answer: `${m * 10 * h} J`,
        explanation: `Gravitational potential energy gain = m x g x h = ${m} x 10 x ${h} = ${m * 10 * h} J.`,
      };
    },
  };
}

const PARALLEL_PAIRS: [number, number, number][] = [
  [6, 3, 2],
  [4, 4, 2],
  [12, 4, 3],
  [10, 10, 5],
  [20, 5, 4],
  [6, 6, 3],
  [30, 15, 10],
  [12, 6, 4],
];

function seriesAndParallel(): Topic {
  return {
    id: "series-parallel",
    label: "Series and parallel resistors",
    generate: () => {
      if (Math.random() < 0.5) {
        const r1 = randInt(2, 50);
        const r2 = randInt(2, 50);
        return {
          prompt: `Two resistors of ${r1} ohms and ${r2} ohms are connected in series. What is the total resistance?`,
          answer: `${r1 + r2} ohms`,
          explanation: `In series the resistances add: ${r1} + ${r2} = ${r1 + r2} ohms.`,
        };
      }
      const [r1, r2, total] = pick(PARALLEL_PAIRS);
      return {
        prompt: `Two resistors of ${r1} ohms and ${r2} ohms are connected in parallel. What is the total resistance?`,
        answer: `${total} ohms`,
        explanation: `In parallel, 1/R = 1/${r1} + 1/${r2} = ${r1 + r2}/${r1 * r2}. Turn it upside down: R = ${r1 * r2}/${r1 + r2} = ${total} ohms.`,
      };
    },
  };
}

function projectileMotion(): Topic {
  return {
    id: "projectile-motion",
    label: "Projectile motion",
    generate: () => {
      const height = pick([5, 20, 45, 80]);
      const fallTime = Math.sqrt(height / 5);
      const speed = randInt(2, 20);
      if (Math.random() < 0.5) {
        return {
          prompt: `A ball is thrown horizontally from a cliff ${height} m high. Taking g = 10 m/s^2 and ignoring air resistance, how long does it take to reach the ground?`,
          answer: `${fallTime} s`,
          explanation: `Vertically the ball starts with no downward speed, so height = 1/2 x g x t^2. ${height} = 5 x t^2, so t^2 = ${height / 5} and t = ${fallTime} s.`,
        };
      }
      return {
        prompt: `A ball is thrown horizontally at ${speed} m/s from a cliff ${height} m high. Taking g = 10 m/s^2 and ignoring air resistance, how far from the base of the cliff does it land?`,
        answer: `${speed * fallTime} m`,
        explanation: `First find the fall time from height = 1/2 x g x t^2: ${height} = 5 x t^2, so t = ${fallTime} s. The horizontal speed stays ${speed} m/s, so distance = ${speed} x ${fallTime} = ${speed * fallTime} m.`,
      };
    },
  };
}

function waveBehaviour(): Topic {
  return bankTopic(
    "wave-behaviour",
    "Wave behaviour",
    WAVE_BEHAVIOUR,
    (x) => `Which wave behaviour is described? "${x}"`,
    ["reflection", "refraction", "diffraction", "interference"],
  );
}

function radioactiveDecay(): Topic {
  return {
    id: "half-life",
    label: "Radioactive decay (half-life)",
    generate: () => {
      const halfLife = pick([2, 3, 5, 10]);
      const halfLives = randInt(1, 4);
      const start = randInt(1, 20) * 16;
      return {
        prompt: `A sample contains ${start} g of a radioactive isotope with a half-life of ${halfLife} days. How much remains after ${halfLife * halfLives} days?`,
        answer: `${start / 2 ** halfLives} g`,
        explanation: `${halfLife * halfLives} days is ${halfLives} half-li${halfLives === 1 ? "fe" : "ves"}. Halve the amount ${halfLives} time${halfLives === 1 ? "" : "s"}: ${Array.from({ length: halfLives + 1 }, (_, i) => `${start / 2 ** i} g`).join(" -> ")}.`,
      };
    },
  };
}

// ---------- Advanced extension topics (Grade 11-12 "Advanced" only) ----------

function centripetalForce(): Topic {
  return {
    id: "centripetal-force",
    label: "Circular motion",
    generate: () => {
      const r = pick([1, 2, 4, 5, 10]);
      const k = randInt(1, 5);
      const v = randInt(2, 10);
      return {
        prompt: `A ${k * r} kg object moves in a circle of radius ${r} m at ${v} m/s. Calculate the centripetal force.`,
        answer: `${k * v * v} N`,
        explanation: `Centripetal force = m x v^2 / r = ${k * r} x ${v}^2 / ${r} = ${k * r} x ${v * v} / ${r} = ${k * v * v} N.`,
      };
    },
  };
}

function electricalPower(): Topic {
  return {
    id: "electrical-power",
    label: "Electrical power and energy",
    generate: () => {
      const kind = pick(["vi", "i2r", "energy"] as const);
      if (kind === "vi") {
        const v = pick([3, 6, 9, 12]);
        const i = randInt(1, 5);
        return {
          prompt: `A component has ${v} V across it and carries ${i} A. What is its power?`,
          answer: `${v * i} W`,
          explanation: `Power = voltage x current = ${v} x ${i} = ${v * i} W.`,
        };
      }
      if (kind === "i2r") {
        const i = randInt(1, 5);
        const r = randInt(2, 20);
        return {
          prompt: `A current of ${i} A flows through a ${r} ohm resistor. What power is dissipated?`,
          answer: `${i * i * r} W`,
          explanation: `Power = I^2 x R = ${i}^2 x ${r} = ${i * i} x ${r} = ${i * i * r} W.`,
        };
      }
      const p = randInt(1, 10) * 100;
      const t = pick([10, 30, 60]);
      return {
        prompt: `A ${p} W heater runs for ${t} s. How much energy does it transfer?`,
        answer: `${p * t} J`,
        explanation: `Energy = power x time = ${p} x ${t} = ${p * t} J.`,
      };
    },
  };
}

function lensEquation(): Topic {
  return {
    id: "lens-equation",
    label: "Converging lenses",
    generate: () => {
      const f = pick([4, 6, 8, 10, 12, 20]);
      const factor = pick([1.5, 2, 3]);
      const u = f * factor;
      const v = (u * f) / (u - f);
      return {
        prompt: `An object is placed ${u} cm from a converging lens of focal length ${f} cm. How far from the lens is the image?`,
        answer: `${v} cm`,
        explanation: `Use 1/f = 1/u + 1/v, so 1/v = 1/${f} - 1/${u}. Then v = u x f / (u - f) = ${u} x ${f} / (${u} - ${f}) = ${u * f} / ${u - f} = ${v} cm.`,
      };
    },
  };
}

// ---------- Cambridge International extras (Grade 9+) ----------

function pressureCalculations(): Topic {
  return {
    id: "pressure",
    label: "Pressure",
    generate: () => {
      if (Math.random() < 0.5) {
        const p = pick([10, 20, 50, 100]);
        const area = pick([1, 2, 4, 5, 10]);
        return {
          prompt: `A force of ${p * area} N acts on an area of ${area} m^2. What is the pressure?`,
          answer: `${p} Pa`,
          explanation: `Pressure = force / area = ${p * area} / ${area} = ${p} Pa.`,
        };
      }
      const depth = randInt(1, 10);
      return {
        prompt: `Water has a density of 1000 kg/m^3. Taking g = 10 N/kg, what is the pressure due to the water at a depth of ${depth} m?`,
        answer: `${10000 * depth} Pa`,
        explanation: `Pressure = density x g x depth = 1000 x 10 x ${depth} = ${10000 * depth} Pa.`,
      };
    },
  };
}

function thermalTransfer(): Topic {
  return bankTopic(
    "thermal-transfer",
    "Thermal energy transfer",
    THERMAL,
    (x) => `Which method of thermal energy transfer is this? "${x}"`,
    ["conduction", "convection", "radiation"],
  );
}

function electromagneticSpectrum(): Topic {
  return bankTopic(
    "em-spectrum",
    "The electromagnetic spectrum",
    EM_SPECTRUM,
    (x) => `Which part of the electromagnetic spectrum is this? "${x}"`,
    ["radio waves", "microwaves", "infrared", "visible light", "ultraviolet", "X-rays", "gamma rays"],
  );
}

function basePhysicsTopics(grade: number): Topic[] {
  if (grade <= 10) {
    return [
      speedDistanceTime(),
      newtonsSecondLaw(),
      ohmsLaw(),
      energyTransformations(),
      waveEquation(),
      density(),
      workAndPower(),
    ];
  }
  return [
    suvat(),
    momentumAndImpulse(),
    kineticAndPotentialEnergy(),
    seriesAndParallel(),
    projectileMotion(),
    waveBehaviour(),
    radioactiveDecay(),
  ];
}

/** "Advanced" pulls in the next band's topics; the top band gets genuinely new extension topics. */
function advancedPhysicsExtras(grade: number): Topic[] {
  if (grade <= 10) return [suvat(), kineticAndPotentialEnergy()];
  return [centripetalForce(), electricalPower(), lensEquation()];
}

function cambridgePhysicsExtras(grade: number): Topic[] {
  return grade >= 9 ? [pressureCalculations(), thermalTransfer(), electromagneticSpectrum()] : [];
}

export function getPhysicsTopics(
  grade: number,
  syllabus: Syllabus = "vic",
  difficulty: Difficulty = "standard",
): Topic[] {
  const base = [...basePhysicsTopics(grade), ...morePhysicsTopics(grade)];
  const advanced = difficulty === "advanced" ? advancedPhysicsExtras(grade) : [];
  const cambridge = syllabus === "cambridge" ? cambridgePhysicsExtras(grade) : [];
  return [...base, ...advanced, ...cambridge];
}
