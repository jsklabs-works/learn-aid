import type { Question, Topic } from "../types";
import { pick, randInt, simplifyFraction } from "./utils";

export type Kind = () => Question;

export const NAMES = ["Ava", "Liam", "Mia", "Noah", "Zoe", "Ethan", "Ruby", "Jack", "Chloe", "Oliver", "Sophie", "Lucas"];
const ITEMS = ["stickers", "marbles", "pencils", "cards", "stamps", "coins", "shells", "buttons"];
const THINGS = ["notebooks", "toy cars", "erasers", "drinks", "muffins"];
export const BUSINESSES = [
  "Ava's Bakery",
  "Noah's Garage",
  "Zoe's Florist",
  "Liam's Cafe",
  "Mia's Bookshop",
  "Ethan's Cycles",
  "Ruby's Salon",
  "Jack's Plumbing",
];

function twoNames(): [string, string] {
  const a = pick(NAMES);
  let b = pick(NAMES);
  while (b === a) b = pick(NAMES);
  return [a, b];
}

const mm = (n: number) => String(n).padStart(2, "0");
const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export function topicFrom(kinds: Kind[]): Topic {
  return { id: "word-problems", label: "Word problems", category: "word-problems", generate: () => pick(kinds)() };
}

// ---------- Maths ----------

function earlyYears(max: number): Kind[] {
  return [
    () => {
      const [n1, n2] = twoNames();
      const item = pick(ITEMS);
      const a = randInt(2, max - 2);
      const b = randInt(2, max - a);
      return {
        prompt: `${n1} has ${a} ${item}. ${n2} gives ${n1} ${b} more. How many ${item} does ${n1} have now?`,
        answer: String(a + b),
        explanation: `Add: ${a} + ${b} = ${a + b}, so ${n1} now has ${a + b} ${item}.`,
      };
    },
    () => {
      const [n] = twoNames();
      const item = pick(ITEMS);
      const a = randInt(5, max);
      const b = randInt(1, a - 1);
      return {
        prompt: `${n} had ${a} ${item} and gave away ${b} of them. How many ${item} does ${n} have left?`,
        answer: String(a - b),
        explanation: `"Gave away" means take away: ${a} - ${b} = ${a - b}.`,
      };
    },
    () => {
      const item = pick(ITEMS);
      const groups = randInt(2, 5);
      const each = randInt(2, Math.min(5, Math.floor(max / groups)));
      return {
        prompt: `There are ${groups} bags with ${each} ${item} in each bag. How many ${item} are there altogether?`,
        answer: String(groups * each),
        explanation: `${groups} bags of ${each} is ${groups} × ${each} = ${groups * each}.`,
      };
    },
    () => {
      const item = pick(ITEMS);
      const friends = randInt(2, 5);
      const each = randInt(2, Math.min(9, Math.floor(max / friends)));
      return {
        prompt: `${friends * each} ${item} are shared equally among ${friends} friends. How many ${item} does each friend get?`,
        answer: String(each),
        explanation: `Sharing equally means dividing: ${friends * each} ÷ ${friends} = ${each}.`,
      };
    },
  ];
}

const primaryKinds: Kind[] = [
  () => {
    const [n] = twoNames();
    const qty = randInt(2, 8);
    const price = randInt(2, 9);
    const total = qty * price;
    const note = [10, 20, 50, 100].find((v) => v > total) as number;
    return {
      prompt: `${n} buys ${qty} ${pick(THINGS)} at $${price} each and pays with a $${note} note. How much change does ${n} get?`,
      answer: `$${note - total}`,
      explanation: `Total cost = ${qty} × $${price} = $${total}. Change = $${note} - $${total} = $${note - total}.`,
    };
  },
  () => {
    const perBox = randInt(3, 9);
    const boxes = randInt(3, 9);
    return {
      prompt: `A bakery packs ${perBox} muffins in each box. It fills ${boxes} boxes. How many muffins is that altogether?`,
      answer: String(perBox * boxes),
      explanation: `${boxes} boxes with ${perBox} muffins each: ${boxes} × ${perBox} = ${perBox * boxes}.`,
    };
  },
  () => {
    const kids = randInt(3, 8);
    const each = randInt(3, 9);
    return {
      prompt: `${kids * each} stickers are shared equally among ${kids} children. How many stickers does each child get?`,
      answer: String(each),
      explanation: `Sharing equally means dividing: ${kids * each} ÷ ${kids} = ${each}.`,
    };
  },
  () => {
    const hour = randInt(1, 8);
    const minute = pick([0, 15, 30, 45]);
    const duration = pick([30, 45, 60, 75, 90, 105, 120, 135, 150]);
    const end = hour * 60 + minute + duration;
    return {
      prompt: `A film starts at ${hour}:${mm(minute)} and lasts ${duration} minutes. What time does it finish?`,
      answer: `${Math.floor(end / 60)}:${mm(end % 60)}`,
      explanation: `${duration} minutes is ${Math.floor(duration / 60)} h ${duration % 60} min. Add it to the start: ${hour}:${mm(minute)} + ${Math.floor(duration / 60)} h ${duration % 60} min = ${Math.floor(end / 60)}:${mm(end % 60)}.`,
    };
  },
  () => {
    const l = randInt(4, 20);
    const w = randInt(3, l);
    return {
      prompt: `A rectangular garden is ${l} m long and ${w} m wide. How many metres of fencing are needed to go all the way around it?`,
      answer: `${2 * (l + w)} m`,
      explanation: `Fencing goes around the edge, so find the perimeter: 2 × (${l} + ${w}) = 2 × ${l + w} = ${2 * (l + w)} m.`,
    };
  },
  () => {
    const [n] = twoNames();
    const a = randInt(5, 20);
    const b = randInt(5, 20);
    const start = a + b + randInt(5, 40);
    return {
      prompt: `${n} has $${start}. ${n} buys a book for $${a} and a toy for $${b}. How much money does ${n} have left?`,
      answer: `$${start - a - b}`,
      explanation: `Spent = $${a} + $${b} = $${a + b}. Left = $${start} - $${a + b} = $${start - a - b}.`,
    };
  },
];

const upperPrimaryKinds: Kind[] = [
  () => {
    const price = randInt(1, 15) * 20;
    const pct = pick([10, 20, 25, 50]);
    return {
      prompt: `A jacket costs $${price} and is on sale for ${pct}% off. What is the sale price?`,
      answer: `$${price - (price * pct) / 100}`,
      explanation: `Discount = ${pct}% of $${price} = $${(price * pct) / 100}. Sale price = $${price} - $${(price * pct) / 100} = $${price - (price * pct) / 100}.`,
    };
  },
  () => {
    const d = pick([2, 3, 4, 5, 6, 8]);
    const n = randInt(1, d - 1);
    const total = d * randInt(2, 9);
    return {
      prompt: `A class has ${total} students. ${n}/${d} of them travel to school by bus. How many students travel by bus?`,
      answer: String((total / d) * n),
      explanation: `Find 1/${d} of ${total}: ${total} ÷ ${d} = ${total / d}. Then multiply by ${n}: ${total / d} × ${n} = ${(total / d) * n}.`,
    };
  },
  () => {
    const speed = randInt(10, 40);
    const hours = randInt(2, 6);
    return {
      prompt: `A cyclist rides at a steady ${speed} km/h for ${hours} hours. How far does the cyclist ride?`,
      answer: `${speed * hours} km`,
      explanation: `Distance = speed × time = ${speed} × ${hours} = ${speed * hours} km.`,
    };
  },
  () => {
    const [n] = twoNames();
    const mean = randInt(10, 40);
    const d1 = randInt(1, 8);
    const d2 = randInt(1, 8);
    return {
      prompt: `${n} scored ${mean + d1}, ${mean - d1}, ${mean + d2} and ${mean - d2} in four tests. What is ${n}'s mean score?`,
      answer: String(mean),
      explanation: `Mean = total ÷ number of scores. The total is ${mean * 4} and there are 4 scores, so the mean is ${mean * 4} ÷ 4 = ${mean}.`,
    };
  },
  () => {
    const l = randInt(3, 9);
    const w = randInt(3, 9);
    const rate = randInt(5, 20);
    return {
      prompt: `A room is ${l} m long and ${w} m wide. Carpet costs $${rate} per square metre. How much does it cost to carpet the whole floor?`,
      answer: `$${l * w * rate}`,
      explanation: `Floor area = ${l} × ${w} = ${l * w} square metres. Cost = area × price per square metre = ${l * w} × $${rate} = $${l * w * rate}.`,
    };
  },
  () => {
    const [n] = twoNames();
    const qty = randInt(2, 9);
    const price = randInt(3, 20) * 0.5;
    return {
      prompt: `${n} buys ${qty} pens at $${price.toFixed(2)} each. What is the total cost?`,
      answer: `$${(qty * price).toFixed(2)}`,
      explanation: `Total = quantity × price = ${qty} × $${price.toFixed(2)} = $${(qty * price).toFixed(2)}.`,
    };
  },
];

const lowerSecondaryKinds: Kind[] = [
  () => {
    const [n1, n2] = twoNames();
    const a = randInt(1, 5);
    const b = randInt(1, 5);
    const unit = randInt(2, 20) * 10;
    const second = Math.random() < 0.5;
    return {
      prompt: `${n1} and ${n2} share $${(a + b) * unit} in the ratio ${a}:${b}. How much does ${second ? n2 : n1} receive?`,
      answer: `$${(second ? b : a) * unit}`,
      explanation: `Total parts = ${a} + ${b} = ${a + b}. One part = $${(a + b) * unit} ÷ ${a + b} = $${unit}. ${second ? n2 : n1} gets ${second ? b : a} parts: ${second ? b : a} × $${unit} = $${(second ? b : a) * unit}.`,
    };
  },
  () => {
    const price = randInt(5, 40) * 20;
    const pct = pick([10, 15, 20, 25]);
    return {
      prompt: `A phone costs $${price}. Its price rises by ${pct}%. What is the new price?`,
      answer: `$${(price * (100 + pct)) / 100}`,
      explanation: `Increase = ${pct}% of $${price} = $${(price * pct) / 100}. New price = $${price} + $${(price * pct) / 100} = $${(price * (100 + pct)) / 100}.`,
    };
  },
  () => {
    const [n] = twoNames();
    const x = randInt(2, 15);
    const a = randInt(2, 6);
    const b = randInt(1, 12);
    return {
      prompt: `${n} thinks of a number, multiplies it by ${a} and then adds ${b}. The result is ${a * x + b}. What number did ${n} think of?`,
      answer: String(x),
      explanation: `Work backwards. Subtract ${b}: ${a * x + b} - ${b} = ${a * x}. Then divide by ${a}: ${a * x} ÷ ${a} = ${x}.`,
    };
  },
  () => {
    const rate = randInt(4, 20);
    const minutes = randInt(3, 15);
    return {
      prompt: `A tap fills a tank at ${rate} litres per minute. How many minutes does it take to fill ${rate * minutes} litres?`,
      answer: `${minutes} minutes`,
      explanation: `Time = amount ÷ rate = ${rate * minutes} ÷ ${rate} = ${minutes} minutes.`,
    };
  },
  () => {
    const [n] = twoNames();
    const principal = randInt(1, 20) * 100;
    const rate = pick([2, 3, 4, 5, 6]);
    const years = randInt(1, 5);
    return {
      prompt: `${n} invests $${principal} at ${rate}% per year simple interest for ${years} ${plural(years, "year", "years")}. How much interest is earned?`,
      answer: `$${(principal * rate * years) / 100}`,
      explanation: `Simple interest = principal × rate × time / 100 = ${principal} × ${rate} × ${years} / 100 = $${(principal * rate * years) / 100}.`,
    };
  },
  () => {
    const red = randInt(2, 8);
    const blue = randInt(2, 8);
    const green = randInt(1, 6);
    return {
      prompt: `A bag contains ${red} red, ${blue} blue and ${green} green marbles. One marble is picked at random. What is the probability that it is blue? (as a fraction in simplest form)`,
      answer: simplifyFraction(blue, red + blue + green),
      explanation: `Total marbles = ${red} + ${blue} + ${green} = ${red + blue + green}. Probability = ${blue}/${red + blue + green}${simplifyFraction(blue, red + blue + green) !== `${blue}/${red + blue + green}` ? `, which simplifies to ${simplifyFraction(blue, red + blue + green)}` : ""}.`,
    };
  },
];

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [6, 8, 10],
  [9, 12, 15],
];

const upperSecondaryKinds: Kind[] = [
  () => {
    const fee = pick([20, 35, 45, 50]);
    const rate = pick([20, 25, 30, 40]);
    const hours = randInt(2, 8);
    return {
      prompt: `A plumber charges a $${fee} call-out fee plus $${rate} per hour. A job costs $${fee + rate * hours}. How many hours did the job take?`,
      answer: `${hours} hours`,
      explanation: `Take off the call-out fee: $${fee + rate * hours} - $${fee} = $${rate * hours}. Divide by the hourly rate: $${rate * hours} ÷ $${rate} = ${hours} hours.`,
    };
  },
  () => {
    const adult = randInt(8, 20);
    const child = randInt(4, 12);
    let a1: number, c1: number, a2: number, c2: number;
    do {
      a1 = randInt(1, 5);
      c1 = randInt(1, 5);
      a2 = randInt(1, 5);
      c2 = randInt(1, 5);
    } while (a1 * c2 - a2 * c1 === 0);
    return {
      prompt: `A cinema sells adult and child tickets. Group 1 pays $${a1 * adult + c1 * child} for ${a1} adult and ${c1} child tickets. Group 2 pays $${a2 * adult + c2 * child} for ${a2} adult and ${c2} child tickets. What is the price of one adult ticket?`,
      answer: `$${adult}`,
      explanation: `Let a = adult price and c = child price. ${a1}a + ${c1}c = ${a1 * adult + c1 * child} and ${a2}a + ${c2}c = ${a2 * adult + c2 * child}. Multiply the first equation by ${c2} and the second by ${c1}, then subtract to remove c: ${a1 * c2 - a2 * c1}a = ${(a1 * adult + c1 * child) * c2 - (a2 * adult + c2 * child) * c1}, so a = $${adult}.`,
    };
  },
  () => {
    const [a, b, c] = pick(TRIPLES);
    if (Math.random() < 0.5) {
      return {
        prompt: `A ${c} m ladder leans against a vertical wall with its base ${a} m from the wall. How high up the wall does it reach?`,
        answer: `${b} m`,
        explanation: `The ladder, wall and ground form a right triangle. Height² = ${c}² - ${a}² = ${c * c} - ${a * a} = ${c * c - a * a}, so height = √${c * c - a * a} = ${b} m.`,
      };
    }
    return {
      prompt: `A rectangular field is ${a} m by ${b} m. How long is its diagonal?`,
      answer: `${c} m`,
      explanation: `The diagonal is the hypotenuse of a right triangle. d² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}, so d = √${a * a + b * b} = ${c} m.`,
    };
  },
  () => {
    const start = pick([100, 200, 500]);
    const hours = randInt(2, 5);
    return {
      prompt: `A colony of ${start} bacteria doubles every hour. How many bacteria are there after ${hours} hours?`,
      answer: String(start * 2 ** hours),
      explanation: `Doubling ${hours} times multiplies by 2^${hours} = ${2 ** hours}. So ${start} × ${2 ** hours} = ${start * 2 ** hours}.`,
    };
  },
  () => {
    const cost = randInt(1, 20) * 20;
    const pct = pick([10, 20, 25, 50]);
    return {
      prompt: `A shop buys an item for $${cost} and sells it for $${(cost * (100 + pct)) / 100}. What is the percentage profit?`,
      answer: `${pct}%`,
      explanation: `Profit = selling price - cost = $${(cost * (100 + pct)) / 100} - $${cost} = $${(cost * pct) / 100}. Percentage profit = profit ÷ cost × 100 = ${(cost * pct) / 100} ÷ ${cost} × 100 = ${pct}%.`,
    };
  },
  () => {
    const width = randInt(2, 9);
    const extra = randInt(1, 5);
    return {
      prompt: `A rectangle is ${extra} m longer than it is wide. Its area is ${width * (width + extra)} square metres. What is its width in metres?`,
      answer: `${width} m`,
      explanation: `Let the width be w, so the length is w + ${extra}. Then w(w + ${extra}) = ${width * (width + extra)}, so w² + ${extra}w - ${width * (width + extra)} = 0. This factorises as (w - ${width})(w + ${width + extra}) = 0. A width cannot be negative, so w = ${width} m.`,
    };
  },
];

const seniorKinds: Kind[] = [
  () => {
    const start = randInt(1, 10) * 10000;
    const rate = pick([10, 20, 25]);
    return {
      prompt: `A machine bought for $${start} loses ${rate}% of its value each year. What is its value after 2 years?`,
      answer: `$${(start * (100 - rate) * (100 - rate)) / 10000}`,
      explanation: `Each year the value is multiplied by ${(100 - rate) / 100}. After 2 years: $${start} × ${(100 - rate) / 100} × ${(100 - rate) / 100} = $${(start * (100 - rate) * (100 - rate)) / 10000}.`,
    };
  },
  () => {
    const [n] = twoNames();
    const first = randInt(20, 100);
    const step = randInt(2, 15);
    const week = randInt(6, 20);
    return {
      prompt: `${n} saves $${first} in week 1 and saves $${step} more each week than the week before. How much does ${n} save in week ${week}?`,
      answer: `$${first + (week - 1) * step}`,
      explanation: `This is an arithmetic sequence. Week ${week} = first + (week - 1) × step = ${first} + ${week - 1} × ${step} = $${first + (week - 1) * step}.`,
    };
  },
  () => {
    const [n] = twoNames();
    const first = randInt(20, 100);
    const step = randInt(2, 15);
    const weeks = randInt(6, 20);
    return {
      prompt: `${n} saves $${first} in week 1 and saves $${step} more each week than the week before. How much has ${n} saved in total after ${weeks} weeks?`,
      answer: `$${(weeks * (2 * first + (weeks - 1) * step)) / 2}`,
      explanation: `Sum of an arithmetic sequence = n/2 × (2a + (n - 1)d) = ${weeks}/2 × (2 × ${first} + ${weeks - 1} × ${step}) = ${weeks}/2 × ${2 * first + (weeks - 1) * step} = $${(weeks * (2 * first + (weeks - 1) * step)) / 2}.`,
    };
  },
  () => {
    const a = randInt(1, 5);
    const b = randInt(1, 9);
    const t = randInt(1, 6);
    return {
      prompt: `The distance travelled by a particle is s = ${a}t^2 + ${b}t metres, where t is in seconds. What is its velocity at t = ${t} seconds?`,
      answer: `${2 * a * t + b} m/s`,
      explanation: `Velocity is the derivative of distance: ds/dt = ${2 * a}t + ${b}. At t = ${t}: ${2 * a} × ${t} + ${b} = ${2 * a * t + b} m/s.`,
    };
  },
  () => {
    const length = randInt(2, 10) * 2;
    return {
      prompt: `A ramp ${length} m long makes an angle of 30 degrees with the ground. How high is the top of the ramp above the ground?`,
      answer: `${length / 2} m`,
      explanation: `Height = length × sin(30°) = ${length} × 0.5 = ${length / 2} m.`,
    };
  },
  () => {
    const mean = randInt(50, 100);
    const sd = randInt(2, 10);
    const k = pick([1, 2, 3]);
    return {
      prompt: `Test scores are normally distributed with mean ${mean} and standard deviation ${sd}. Approximately what percentage of scores lie between ${mean - k * sd} and ${mean + k * sd}?`,
      answer: ["68%", "95%", "99.7%"][k - 1],
      explanation: `${mean - k * sd} to ${mean + k * sd} is ${mean} ± ${k} × ${sd}, which is within ${k} standard deviation${k > 1 ? "s" : ""} of the mean. By the 68-95-99.7 rule, about ${["68%", "95%", "99.7%"][k - 1]} of scores lie within ${k} standard deviation${k > 1 ? "s" : ""}.`,
    };
  },
];

export function mathsWordProblems(grade: number): Topic {
  if (grade <= 2) return topicFrom(earlyYears(grade === 1 ? 20 : 50));
  if (grade <= 4) return topicFrom(primaryKinds);
  if (grade <= 6) return topicFrom(upperPrimaryKinds);
  if (grade <= 8) return topicFrom(lowerSecondaryKinds);
  if (grade <= 10) return topicFrom(upperSecondaryKinds);
  return topicFrom(seniorKinds);
}

// ---------- Accounting ----------

const juniorAccountingKinds: Kind[] = [
  () => {
    const biz = pick(BUSINESSES);
    let cash: number, credit: number, wages: number, rent: number, other: number;
    do {
      cash = randInt(10, 60) * 100;
      credit = randInt(5, 40) * 100;
      wages = randInt(5, 30) * 100;
      rent = randInt(2, 15) * 100;
      other = randInt(1, 10) * 100;
    } while (cash + credit <= wages + rent + other + 200);
    return {
      prompt: `${biz} made cash sales of $${cash} and credit sales of $${credit} this month. Its expenses were wages $${wages}, rent $${rent} and other costs $${other}. What was its net profit?`,
      answer: `$${cash + credit - wages - rent - other}`,
      explanation: `Revenue = $${cash} + $${credit} = $${cash + credit}. Expenses = $${wages} + $${rent} + $${other} = $${wages + rent + other}. Net profit = revenue - expenses = $${cash + credit - wages - rent - other}.`,
    };
  },
  () => {
    const biz = pick(BUSINESSES);
    const liabilities = randInt(5, 30) * 100;
    const assets = liabilities + randInt(10, 50) * 100;
    const invested = randInt(1, 10) * 100;
    const drawings = randInt(1, 5) * 100;
    const profit = randInt(2, 20) * 100;
    return {
      prompt: `At the start of the year ${biz} had assets of $${assets} and liabilities of $${liabilities}. During the year the owner invested a further $${invested}, withdrew $${drawings} in drawings, and the business earned a net profit of $${profit}. What is the owner's equity at the end of the year?`,
      answer: `$${assets - liabilities + invested - drawings + profit}`,
      explanation: `Opening equity = assets - liabilities = $${assets} - $${liabilities} = $${assets - liabilities}. Closing equity = opening equity + investments - drawings + profit = $${assets - liabilities} + $${invested} - $${drawings} + $${profit} = $${assets - liabilities + invested - drawings + profit}.`,
    };
  },
  () => {
    const biz = pick(BUSINESSES);
    const annual = randInt(2, 20) * 100;
    const years = randInt(4, 10);
    const residual = randInt(1, 10) * 500;
    const cost = residual + annual * years;
    const elapsed = randInt(1, 3);
    return {
      prompt: `${biz} buys a van for $${cost}. It is expected to last ${years} years with a residual value of $${residual}. Using the straight-line method, what is the van's carrying amount after ${elapsed} ${plural(elapsed, "year", "years")}?`,
      answer: `$${cost - annual * elapsed}`,
      explanation: `Annual depreciation = (cost - residual) ÷ life = ($${cost} - $${residual}) ÷ ${years} = $${annual}. After ${elapsed} ${plural(elapsed, "year", "years")}, accumulated depreciation = $${annual * elapsed}. Carrying amount = $${cost} - $${annual * elapsed} = $${cost - annual * elapsed}.`,
    };
  },
  () => {
    const biz = pick(BUSINESSES);
    let cash: number, equipment: number, expenses: number, capital: number, sales: number;
    do {
      cash = randInt(20, 80) * 100;
      equipment = randInt(20, 80) * 100;
      expenses = randInt(5, 30) * 100;
      capital = randInt(10, 60) * 100;
      sales = randInt(5, 40) * 100;
    } while (cash + equipment + expenses - capital - sales <= 0);
    return {
      prompt: `The trial balance of ${biz} shows debit balances: cash $${cash}, equipment $${equipment} and expenses $${expenses}. The credit balances are capital $${capital}, sales $${sales} and a loan. What must the loan balance be for the trial balance to balance?`,
      answer: `$${cash + equipment + expenses - capital - sales}`,
      explanation: `Total debits = $${cash} + $${equipment} + $${expenses} = $${cash + equipment + expenses}. Known credits = $${capital} + $${sales} = $${capital + sales}. The loan must make credits equal debits: $${cash + equipment + expenses} - $${capital + sales} = $${cash + equipment + expenses - capital - sales}.`,
    };
  },
  () => {
    const biz = pick(BUSINESSES);
    const price = randInt(1, 50) * 10;
    return {
      prompt: `${biz} sells an item for $${price} plus 10% sales tax. What is the total price the customer pays?`,
      answer: `$${(price * 11) / 10}`,
      explanation: `Sales tax = 10% of $${price} = $${price / 10}. Total price = $${price} + $${price / 10} = $${(price * 11) / 10}.`,
    };
  },
];

const seniorAccountingKinds: Kind[] = [
  () => {
    const biz = pick(BUSINESSES);
    const liabilities = randInt(1, 10) * 2000;
    const ratio = pick([1, 1.5, 2]);
    const inventory = randInt(1, 10) * 500;
    return {
      prompt: `${biz} has current assets of $${ratio * liabilities + inventory}, of which $${inventory} is inventory, and current liabilities of $${liabilities}. Calculate the quick ratio (as x:1, to 1 decimal place).`,
      answer: `${ratio.toFixed(1)}:1`,
      explanation: `Quick ratio = (current assets - inventory) ÷ current liabilities = ($${ratio * liabilities + inventory} - $${inventory}) ÷ $${liabilities} = $${ratio * liabilities} ÷ $${liabilities} = ${ratio.toFixed(1)}:1.`,
    };
  },
  () => {
    const biz = pick(BUSINESSES);
    const opening = randInt(1, 10) * 1000;
    const purchases = randInt(10, 40) * 1000;
    const closing = randInt(1, 10) * 1000;
    const cogs = opening + purchases - closing;
    const profit = randInt(5, 30) * 1000;
    return {
      prompt: `${biz} began the year with inventory of $${opening}, bought $${purchases} of stock and finished with $${closing} of inventory. Sales were $${cogs + profit}. What was its gross profit?`,
      answer: `$${profit}`,
      explanation: `Cost of goods sold = opening inventory + purchases - closing inventory = $${opening} + $${purchases} - $${closing} = $${cogs}. Gross profit = sales - cost of goods sold = $${cogs + profit} - $${cogs} = $${profit}.`,
    };
  },
  () => {
    const biz = pick(BUSINESSES);
    const loan = randInt(2, 20) * 5000;
    const rate = pick([4, 5, 6, 8, 10]);
    return {
      prompt: `${biz} has a $${loan} loan at ${rate}% p.a. interest. What is the interest expense for the year?`,
      answer: `$${(loan * rate) / 100}`,
      explanation: `Interest expense = loan × rate = $${loan} × ${rate}% = $${(loan * rate) / 100}.`,
    };
  },
  () => {
    const biz = pick(BUSINESSES);
    let opening: number, cashSales: number, debtors: number, wages: number, suppliers: number, rent: number;
    do {
      opening = randInt(2, 20) * 500;
      cashSales = randInt(5, 30) * 100;
      debtors = randInt(3, 20) * 100;
      wages = randInt(3, 20) * 100;
      suppliers = randInt(3, 20) * 100;
      rent = randInt(2, 10) * 100;
    } while (opening + cashSales + debtors - wages - suppliers - rent <= 0);
    return {
      prompt: `${biz} expects an opening cash balance of $${opening}. It expects to receive $${cashSales} from cash sales and $${debtors} from debtors, and to pay $${wages} in wages, $${suppliers} to suppliers and $${rent} in rent. What is the expected closing cash balance?`,
      answer: `$${opening + cashSales + debtors - wages - suppliers - rent}`,
      explanation: `Receipts = $${cashSales} + $${debtors} = $${cashSales + debtors}. Payments = $${wages} + $${suppliers} + $${rent} = $${wages + suppliers + rent}. Closing cash = opening + receipts - payments = $${opening} + $${cashSales + debtors} - $${wages + suppliers + rent} = $${opening + cashSales + debtors - wages - suppliers - rent}.`,
    };
  },
  () => {
    const biz = pick(BUSINESSES);
    const cost = randInt(1, 20) * 1000;
    const rate = pick([10, 20]);
    return {
      prompt: `${biz} buys equipment for $${cost} and depreciates it at ${rate}% p.a. using the reducing balance method. What is the depreciation expense in year 2?`,
      answer: `$${(cost * (100 - rate) * rate) / 10000}`,
      explanation: `Year 1 depreciation = ${rate}% of $${cost} = $${(cost * rate) / 100}, so the carrying amount after year 1 is $${cost - (cost * rate) / 100}. Year 2 depreciation = ${rate}% of $${cost - (cost * rate) / 100} = $${(cost * (100 - rate) * rate) / 10000}.`,
    };
  },
  () => {
    const breakEven = randInt(50, 300);
    const actual = breakEven + randInt(10, 200);
    return {
      prompt: `A business must sell ${breakEven} units to break even. It actually sells ${actual} units. What is its margin of safety in units?`,
      answer: `${actual - breakEven} units`,
      explanation: `Margin of safety = actual sales - break-even sales = ${actual} - ${breakEven} = ${actual - breakEven} units.`,
    };
  },
];

export function accountingWordProblems(grade: number): Topic {
  return topicFrom(grade <= 10 ? juniorAccountingKinds : seniorAccountingKinds);
}
