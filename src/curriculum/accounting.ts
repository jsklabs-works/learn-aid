import type { Difficulty, Syllabus, Topic } from "../types";
import { unpack } from "./codec";
import { bankMCQ, pick, randInt } from "./utils";
import { accountingWordProblems } from "./wordProblems";

const ACCOUNT_CLASSES: [string, string][] = unpack("W1siQ2FzaCBhdCBiYW5rIiwiYXNzZXQiXSxbIkFjY291bnRzIHJlY2VpdmFibGUiLCJhc3NldCJdLFsiSW52ZW50b3J5IiwiYXNzZXQiXSxbIkVxdWlwbWVudCIsImFzc2V0Il0sWyJNb3RvciB2ZWhpY2xlcyIsImFzc2V0Il0sWyJQcmVwYWlkIGluc3VyYW5jZSIsImFzc2V0Il0sWyJBY2NvdW50cyBwYXlhYmxlIiwibGlhYmlsaXR5Il0sWyJCYW5rIGxvYW4iLCJsaWFiaWxpdHkiXSxbIk1vcnRnYWdlIHBheWFibGUiLCJsaWFiaWxpdHkiXSxbIldhZ2VzIHBheWFibGUiLCJsaWFiaWxpdHkiXSxbIlVuZWFybmVkIHJldmVudWUiLCJsaWFiaWxpdHkiXSxbIk93bmVyJ3MgY2FwaXRhbCIsImVxdWl0eSJdLFsiT3duZXIncyBkcmF3aW5ncyIsImVxdWl0eSJdLFsiUmV0YWluZWQgZWFybmluZ3MiLCJlcXVpdHkiXSxbIlNhbGVzIHJldmVudWUiLCJyZXZlbnVlIl0sWyJGZWVzIGVhcm5lZCIsInJldmVudWUiXSxbIkludGVyZXN0IGluY29tZSIsInJldmVudWUiXSxbIlJlbnQgaW5jb21lIiwicmV2ZW51ZSJdLFsiV2FnZXMgZXhwZW5zZSIsImV4cGVuc2UiXSxbIlJlbnQgZXhwZW5zZSIsImV4cGVuc2UiXSxbIkluc3VyYW5jZSBleHBlbnNlIiwiZXhwZW5zZSJdLFsiRGVwcmVjaWF0aW9uIGV4cGVuc2UiLCJleHBlbnNlIl0sWyJBZHZlcnRpc2luZyBleHBlbnNlIiwiZXhwZW5zZSJdXQ==");
const CASH_FLOW_ITEMS: [string, string][] = unpack("W1siQ2FzaCByZWNlaXZlZCBmcm9tIGN1c3RvbWVycyIsIm9wZXJhdGluZyJdLFsiUGF5bWVudHMgdG8gc3VwcGxpZXJzIiwib3BlcmF0aW5nIl0sWyJXYWdlcyBwYWlkIHRvIGVtcGxveWVlcyIsIm9wZXJhdGluZyJdLFsiUmVudCBwYWlkIiwib3BlcmF0aW5nIl0sWyJQdXJjaGFzZSBvZiBlcXVpcG1lbnQiLCJpbnZlc3RpbmciXSxbIlNhbGUgb2YgYSBtb3RvciB2ZWhpY2xlIiwiaW52ZXN0aW5nIl0sWyJQdXJjaGFzZSBvZiBzaGFyZXMgaW4gYW5vdGhlciBjb21wYW55IiwiaW52ZXN0aW5nIl0sWyJQdXJjaGFzZSBvZiBhIGJ1aWxkaW5nIiwiaW52ZXN0aW5nIl0sWyJQcm9jZWVkcyBmcm9tIGEgYmFuayBsb2FuIiwiZmluYW5jaW5nIl0sWyJSZXBheW1lbnQgb2YgYSBiYW5rIGxvYW4iLCJmaW5hbmNpbmciXSxbIk93bmVyIGludmVzdHMgYWRkaXRpb25hbCBjYXBpdGFsIiwiZmluYW5jaW5nIl0sWyJPd25lcidzIGRyYXdpbmdzIHBhaWQiLCJmaW5hbmNpbmciXV0=");
const STATEMENT_TERMS: [string, string][] = unpack("W1sic2hvd3MgYSBidXNpbmVzcydzIGFzc2V0cywgbGlhYmlsaXRpZXMgYW5kIGVxdWl0eSBhdCBhIHBvaW50IGluIHRpbWUiLCJTdGF0ZW1lbnQgb2YgZmluYW5jaWFsIHBvc2l0aW9uIl0sWyJzaG93cyByZXZlbnVlLCBleHBlbnNlcyBhbmQgcHJvZml0IGZvciBhIHBlcmlvZCIsIkluY29tZSBzdGF0ZW1lbnQiXSxbInNob3dzIGNhc2ggaW5mbG93cyBhbmQgb3V0Zmxvd3MgZm9yIGEgcGVyaW9kIiwiU3RhdGVtZW50IG9mIGNhc2ggZmxvd3MiXSxbImxpc3RzIGFsbCBsZWRnZXIgYmFsYW5jZXMgdG8gY2hlY2sgdGhhdCBkZWJpdHMgZXF1YWwgY3JlZGl0cyIsIlRyaWFsIGJhbGFuY2UiXSxbImlzIHRoZSBDYW1icmlkZ2UgbmFtZSBmb3IgdGhlIEJhbGFuY2UgU2hlZXQiLCJTdGF0ZW1lbnQgb2YgZmluYW5jaWFsIHBvc2l0aW9uIl0sWyJpcyB0aGUgQ2FtYnJpZGdlIG5hbWUgZm9yIHRoZSBQcm9maXQgYW5kIExvc3MgU3RhdGVtZW50IiwiSW5jb21lIHN0YXRlbWVudCJdXQ==");

// ---------- Grades 9-10 ----------

function accountingEquation(): Topic {
  return {
    id: "accounting-equation",
    label: "The accounting equation",
    generate: () => {
      const liabilities = randInt(10, 80) * 100;
      const equity = randInt(10, 100) * 100;
      const assets = liabilities + equity;
      const unknown = pick(["assets", "liabilities", "equity"] as const);
      if (unknown === "assets") {
        return {
          prompt: `A business has liabilities of $${liabilities} and owner's equity of $${equity}. What are its total assets?`,
          answer: `$${assets}`,
        };
      }
      if (unknown === "liabilities") {
        return {
          prompt: `A business has assets of $${assets} and owner's equity of $${equity}. What are its total liabilities?`,
          answer: `$${liabilities}`,
        };
      }
      return {
        prompt: `A business has assets of $${assets} and liabilities of $${liabilities}. What is the owner's equity?`,
        answer: `$${equity}`,
      };
    },
  };
}

function accountClassification(): Topic {
  const items = ACCOUNT_CLASSES.map(([account, kind]) => ({
    prompt: `Classify this account: "${account}"`,
    answer: kind,
  }));
  return bankMCQ("account-classification", "Classifying accounts", items, [
    "asset",
    "liability",
    "equity",
    "revenue",
    "expense",
  ]);
}

const NORMAL_SIDE = {
  asset: "debit",
  expense: "debit",
  liability: "credit",
  equity: "credit",
  revenue: "credit",
} as const;

const ACCOUNT_PHRASE: Record<keyof typeof NORMAL_SIDE, string> = {
  asset: "an asset account",
  liability: "a liability account",
  equity: "an owner's equity account",
  revenue: "a revenue account",
  expense: "an expense account",
};

function debitCreditRules(): Topic {
  const types = Object.keys(NORMAL_SIDE) as (keyof typeof NORMAL_SIDE)[];
  return {
    id: "debit-credit-rules",
    label: "Debits and credits",
    generate: () => {
      const type = pick(types);
      const increase = Math.random() < 0.5;
      const normal = NORMAL_SIDE[type];
      const side = increase ? normal : normal === "debit" ? "credit" : "debit";
      return {
        prompt: `Which side is used to record ${increase ? "an increase" : "a decrease"} in ${ACCOUNT_PHRASE[type]}?`,
        answer: side,
        options: ["debit", "credit"],
      };
    },
  };
}

function profitCalculation(): Topic {
  return {
    id: "profit-calculation",
    label: "Calculating net profit",
    generate: () => {
      const revenue = randInt(20, 200) * 100;
      const expenses = randInt(5, Math.floor(revenue / 100) - 5) * 100;
      return {
        prompt: `A business earned revenue of $${revenue} and had total expenses of $${expenses}. What was its net profit?`,
        answer: `$${revenue - expenses}`,
      };
    },
  };
}

function straightLineDepreciation(): Topic {
  return {
    id: "straight-line-depreciation",
    label: "Straight-line depreciation",
    generate: () => {
      const residual = randInt(1, 10) * 500;
      const annual = randInt(2, 20) * 100;
      const years = randInt(3, 10);
      const cost = residual + annual * years;
      return {
        prompt: `An asset costs $${cost}, has a residual value of $${residual} and a useful life of ${years} years. Using the straight-line method, what is the annual depreciation expense?`,
        answer: `$${annual}`,
      };
    },
  };
}

function trialBalanceCheck(): Topic {
  return {
    id: "trial-balance-check",
    label: "Trial balance check",
    generate: () => {
      const debits = randInt(20, 200) * 100;
      const balanced = Math.random() < 0.5;
      const credits = balanced ? debits : debits + pick([-1, 1]) * randInt(1, 9) * 100;
      return {
        prompt: `A trial balance shows total debits of $${debits} and total credits of $${credits}. Do the totals balance?`,
        answer: balanced ? "Yes" : "No",
        options: ["Yes", "No"],
      };
    },
  };
}

// ---------- Grades 11-12 ----------

function reducingBalanceDepreciation(): Topic {
  return {
    id: "reducing-balance-depreciation",
    label: "Reducing balance depreciation",
    generate: () => {
      const cost = randInt(2, 30) * 1000;
      const rate = pick([10, 20, 25]);
      const years = randInt(1, 3);
      const carrying = cost * Math.pow(1 - rate / 100, years);
      return {
        prompt: `An asset costing $${cost} is depreciated at ${rate}% p.a. using the reducing balance method. What is its carrying amount at the end of year ${years}? (to the nearest cent)`,
        answer: `$${carrying.toFixed(2)}`,
      };
    },
  };
}

function profitRatios(): Topic {
  return {
    id: "profit-ratios",
    label: "Profit margin ratios",
    generate: () => {
      const revenue = randInt(5, 50) * 1000;
      const pct = pick([10, 20, 25, 40, 50]);
      const profit = (revenue * pct) / 100;
      const kind = pick(["gross", "net"] as const);
      return {
        prompt: `A business had revenue of $${revenue} and ${kind} profit of $${profit}. Calculate the ${kind} profit margin (as a percentage).`,
        answer: `${pct}%`,
      };
    },
  };
}

function liquidityRatio(): Topic {
  return {
    id: "current-ratio",
    label: "The current ratio",
    generate: () => {
      const liabilities = randInt(1, 10) * 2000;
      const ratio = pick([1.5, 2, 2.5, 3]);
      const assets = liabilities * ratio;
      return {
        prompt: `A business has current assets of $${assets} and current liabilities of $${liabilities}. Calculate the current ratio (as x:1, to 1 decimal place).`,
        answer: `${ratio.toFixed(1)}:1`,
      };
    },
  };
}

function badDebts(): Topic {
  return {
    id: "doubtful-debts",
    label: "Allowance for doubtful debts",
    generate: () => {
      const receivable = randInt(5, 100) * 1000;
      const pct = pick([2, 3, 4, 5, 10]);
      return {
        prompt: `A business has accounts receivable of $${receivable} and estimates ${pct}% will not be collected. What amount should be recorded as the allowance for doubtful debts?`,
        answer: `$${(receivable * pct) / 100}`,
      };
    },
  };
}

function inventoryFifo(): Topic {
  return {
    id: "inventory-fifo",
    label: "Inventory valuation (FIFO)",
    generate: () => {
      const q1 = randInt(10, 50);
      const p1 = randInt(5, 20);
      const q2 = randInt(10, 50);
      const p2 = p1 + randInt(1, 5);
      const sold = randInt(q1 + 1, q1 + q2);
      const cogs = q1 * p1 + (sold - q1) * p2;
      return {
        prompt: `A business buys ${q1} units at $${p1} each, then ${q2} more units at $${p2} each. It sells ${sold} units. Using FIFO, what is the cost of goods sold?`,
        answer: `$${cogs}`,
      };
    },
  };
}

function breakEven(): Topic {
  return {
    id: "break-even",
    label: "Break-even analysis",
    generate: () => {
      const contribution = randInt(2, 20);
      const variable = randInt(5, 30);
      const price = variable + contribution;
      const units = randInt(50, 500);
      const fixed = contribution * units;
      return {
        prompt: `A product sells for $${price} and has variable costs of $${variable} per unit. Fixed costs are $${fixed}. How many units must be sold to break even?`,
        answer: `${units} units`,
      };
    },
  };
}

function cashFlowClassification(): Topic {
  const items = CASH_FLOW_ITEMS.map(([activity, category]) => ({
    prompt: `In a cash flow statement, how is this classified: "${activity}"?`,
    answer: category,
  }));
  return bankMCQ("cash-flow-classification", "Cash flow classification", items, [
    "operating",
    "investing",
    "financing",
  ]);
}

// ---------- Advanced extension topics ----------

function budgetVariance(): Topic {
  return {
    id: "budget-variance",
    label: "Budget variances",
    generate: () => {
      const kind = pick(["revenue", "expense"] as const);
      const label = kind === "revenue" ? "sales revenue" : "wages expense";
      const budget = randInt(10, 100) * 100;
      const diff = randInt(1, 9) * 100;
      const over = Math.random() < 0.5;
      const actual = over ? budget + diff : budget - diff;
      if (Math.random() < 0.5) {
        return {
          prompt: `Budgeted ${label} was $${budget} and actual ${label} was $${actual}. What is the amount of the variance?`,
          answer: `$${diff}`,
        };
      }
      const favourable = kind === "revenue" ? over : !over;
      return {
        prompt: `Budgeted ${label} was $${budget} and actual ${label} was $${actual}. Is the variance favourable or unfavourable?`,
        answer: favourable ? "favourable" : "unfavourable",
        options: ["favourable", "unfavourable"],
      };
    },
  };
}

function accrualAdjustments(): Topic {
  return {
    id: "accrual-adjustments",
    label: "Prepaid and accrued expenses",
    generate: () => {
      const monthly = randInt(1, 10) * 100;
      if (Math.random() < 0.5) {
        const elapsed = randInt(3, 9);
        return {
          prompt: `A business paid $${12 * monthly} for 12 months' insurance starting ${elapsed} months before its financial year end. How much is a prepaid expense at year end?`,
          answer: `$${monthly * (12 - elapsed)}`,
        };
      }
      const unpaid = randInt(1, 4);
      return {
        prompt: `Monthly rent is $${monthly}. The rent for the last ${unpaid} ${unpaid === 1 ? "month" : "months"} of the financial year has not yet been paid. What is the accrued rent expense at year end?`,
        answer: `$${monthly * unpaid}`,
      };
    },
  };
}

function partnershipProfitShare(): Topic {
  return {
    id: "partnership-profit-share",
    label: "Partnership profit sharing",
    generate: () => {
      const a = randInt(1, 5);
      const b = randInt(1, 5);
      const unit = randInt(2, 20) * 100;
      const profit = (a + b) * unit;
      const partner = pick(["A", "B"] as const);
      return {
        prompt: `Partners A and B share profits in the ratio ${a}:${b}. The partnership profit is $${profit}. What is Partner ${partner}'s share?`,
        answer: `$${(partner === "A" ? a : b) * unit}`,
      };
    },
  };
}

// ---------- Cambridge International extras (Grade 9+) ----------

function vatCalculation(): Topic {
  return {
    id: "vat-calculation",
    label: "VAT calculations",
    generate: () => {
      const rate = pick([10, 15, 20]);
      const excl = randInt(1, 50) * 100;
      const vat = (excl * rate) / 100;
      if (Math.random() < 0.5) {
        return {
          prompt: `An item costs $${excl} excluding VAT. VAT is charged at ${rate}%. What is the price including VAT?`,
          answer: `$${excl + vat}`,
        };
      }
      return {
        prompt: `An item's price including ${rate}% VAT is $${excl + vat}. How much of this is VAT?`,
        answer: `$${vat}`,
      };
    },
  };
}

function financialStatementTerms(): Topic {
  const items = STATEMENT_TERMS.map(([description, statement]) => ({
    prompt: `Which document ${description}?`,
    answer: statement,
  }));
  return bankMCQ("statement-terms", "Financial statement terminology", items, [
    "Statement of financial position",
    "Income statement",
    "Statement of cash flows",
    "Trial balance",
  ]);
}

function baseAccountingTopics(grade: number): Topic[] {
  return [...coreAccountingTopics(grade), accountingWordProblems(grade)];
}

function coreAccountingTopics(grade: number): Topic[] {
  if (grade <= 10) {
    return [
      accountingEquation(),
      accountClassification(),
      debitCreditRules(),
      profitCalculation(),
      straightLineDepreciation(),
      trialBalanceCheck(),
    ];
  }
  return [
    reducingBalanceDepreciation(),
    profitRatios(),
    liquidityRatio(),
    badDebts(),
    inventoryFifo(),
    breakEven(),
    cashFlowClassification(),
  ];
}

/** "Advanced" pulls in the next band's topics; the top band gets genuinely new extension topics. */
function advancedAccountingExtras(grade: number): Topic[] {
  if (grade <= 10) return [reducingBalanceDepreciation(), profitRatios()];
  return [budgetVariance(), accrualAdjustments(), partnershipProfitShare()];
}

function cambridgeAccountingExtras(grade: number): Topic[] {
  return grade >= 9 ? [vatCalculation(), financialStatementTerms()] : [];
}

export function getAccountingTopics(
  grade: number,
  syllabus: Syllabus = "vic",
  difficulty: Difficulty = "standard",
): Topic[] {
  const base = baseAccountingTopics(grade);
  const advanced = difficulty === "advanced" ? advancedAccountingExtras(grade) : [];
  const cambridge = syllabus === "cambridge" ? cambridgeAccountingExtras(grade) : [];
  return [...base, ...advanced, ...cambridge];
}
