import type { Subject } from "./types";

export interface FormulaEntry {
  subject: Subject;
  /** Shown from this grade upwards. */
  minGrade: number;
  topic: string;
  name: string;
  formula: string;
  note?: string;
  example?: string;
}

/**
 * Written in plain PDF-safe text (sqrt, pi, theta, ->, <=, " - "). `prettify` swaps in the
 * proper symbols for on-screen display.
 */
type Row = [subject: Subject, minGrade: number, topic: string, name: string, formula: string, note?: string, example?: string];

const ROWS: Row[] = [
  // ---------- Maths ----------
  ["maths", 3, "Units and number", "Length", "1 km = 1000 m;  1 m = 100 cm;  1 cm = 10 mm", "Going to a smaller unit, multiply. Going to a bigger unit, divide.", "2.5 m = 2.5 × 100 = 250 cm"],
  ["maths", 3, "Units and number", "Mass and capacity", "1 kg = 1000 g;  1 L = 1000 mL", "Same idea: multiply to go down a unit, divide to go up.", "3000 mL = 3000 ÷ 1000 = 3 L"],
  ["maths", 3, "Units and number", "Time", "1 h = 60 min;  1 min = 60 s;  1 day = 24 h", "For elapsed time, count on from the start time to the end time.", "3:15 to 4:45 is 1 h 30 min = 90 min"],
  ["maths", 3, "Units and number", "Rounding", "5 or more: round up.  4 or less: round down.", "Look at the digit to the right of the place you are rounding to.", "1277 to the nearest 100: the tens digit is 7, so round up to 1300"],
  ["maths", 3, "Units and number", "Change from a purchase", "Change = amount paid - price", undefined, "Pay $20 for $13.50: change = $6.50"],
  ["maths", 3, "Units and number", "Fraction of an amount", "(n/d) of A = A ÷ d × n", "Divide by the bottom number, then multiply by the top.", "3/4 of 24 = 24 ÷ 4 × 3 = 18"],
  ["maths", 3, "Units and number", "Equivalent fractions", "a/b = (a × k) / (b × k)", "Multiply the top and bottom by the same number.", "2/5 = (2 × 3) / (5 × 3) = 6/15"],
  ["maths", 5, "Units and number", "Order of operations (BODMAS)", "Brackets, Orders (powers), Division and Multiplication, Addition and Subtraction", "Work left to right within each step.", "2 + 3 × 4 = 2 + 12 = 14"],
  ["maths", 5, "Units and number", "HCF and LCM", "HCF = largest number that divides both;  LCM = smallest number both divide into;  HCF × LCM = a × b", undefined, "12 and 18: HCF = 6, LCM = 36, and 6 × 36 = 12 × 18"],

  ["maths", 3, "Shapes and measurement", "Perimeter of a rectangle", "P = 2 × (l + w)", "Add up all four sides.", "l = 8, w = 3: P = 2 × 11 = 22"],
  ["maths", 3, "Shapes and measurement", "Area of a rectangle", "A = l × w", "Area is measured in square units.", "8 cm by 3 cm: A = 24 cm²"],
  ["maths", 5, "Shapes and measurement", "Area of a triangle", "A = 1/2 × b × h", "h is the perpendicular (right-angle) height.", "b = 10, h = 6: A = 1/2 × 10 × 6 = 30"],
  ["maths", 5, "Shapes and measurement", "Volume of a cuboid", "V = l × w × h", "Volume is measured in cubic units.", "4 × 3 × 5 = 60 cm³"],
  ["maths", 5, "Shapes and measurement", "Angle facts", "Straight line = 180°;  triangle = 180°;  quadrilateral = 360°;  around a point = 360°", undefined, "Two triangle angles are 50° and 60°, so the third is 180° - 110° = 70°"],
  ["maths", 6, "Shapes and measurement", "The Cartesian plane", "Reflect in the x-axis: (x, y) -> (x, -y).  Reflect in the y-axis: (x, y) -> (-x, y).", "To translate, add to x for left or right and to y for up or down. Write points as (x, y).", "(3, 2) reflected in the y-axis is (-3, 2)"],
  ["maths", 7, "Shapes and measurement", "Circumference of a circle", "C = 2 × pi × r  (or C = pi × d)", "Use pi = 3.14 unless told otherwise.", "r = 5: C = 2 × 3.14 × 5 = 31.4"],
  ["maths", 7, "Shapes and measurement", "Area of a circle", "A = pi × r²", undefined, "r = 5: A = 3.14 × 25 = 78.5"],
  ["maths", 7, "Shapes and measurement", "Angles in a polygon", "Sum of interior angles = (n - 2) × 180°", "n is the number of sides. In a regular polygon each angle = sum ÷ n.", "Hexagon: (6 - 2) × 180° = 720°, so each angle is 120°"],
  ["maths", 7, "Shapes and measurement", "Speed, distance and time", "speed = distance ÷ time;  distance = speed × time;  time = distance ÷ speed", undefined, "150 km in 2 h: speed = 75 km/h"],
  ["maths", 9, "Shapes and measurement", "Volume of a prism", "V = area of cross-section × length", undefined, "Base area 12 cm², length 5 cm: V = 60 cm³"],
  ["maths", 9, "Shapes and measurement", "Volume of a cylinder", "V = pi × r² × h", undefined, "r = 3, h = 5: V = 3.14 × 9 × 5 = 141.3"],
  ["maths", 10, "Shapes and measurement", "Sphere", "V = 4/3 × pi × r³;  surface area = 4 × pi × r²", undefined, "r = 3: V = 4/3 × 3.14 × 27 = 113.04"],
  ["maths", 10, "Shapes and measurement", "Cone", "V = 1/3 × pi × r² × h", undefined, "r = 3, h = 4: V = 1/3 × 3.14 × 9 × 4 = 37.68"],

  ["maths", 5, "Percentages and money", "Percentage of an amount", "p% of A = p ÷ 100 × A", undefined, "15% of 80 = 0.15 × 80 = 12"],
  ["maths", 7, "Percentages and money", "Percentage change", "% change = (new - old) ÷ old × 100", "A positive answer is an increase and a negative answer is a decrease.", "$40 to $50: (50 - 40) ÷ 40 × 100 = 25% increase"],
  ["maths", 7, "Percentages and money", "Simple interest", "I = P × R × T ÷ 100", "P = amount invested, R = % per year, T = years.", "$2000 at 5% for 3 years: I = 2000 × 5 × 3 ÷ 100 = $300"],
  ["maths", 7, "Percentages and money", "GST (10%)", "price with GST = price × 1.1;  GST inside a total = total ÷ 11", undefined, "$220 + GST = $242, and the GST inside $242 is $22"],
  ["maths", 9, "Percentages and money", "Reverse percentages", "original = final ÷ (1 ± p/100)", "Use + for an increase and - for a discount.", "After a 20% discount the price is $80: original = 80 ÷ 0.8 = $100"],
  ["maths", 10, "Percentages and money", "Compound interest", "A = P × (1 + r/100)^n", "n = number of periods and r = % per period.", "$1000 at 5% for 2 years: 1000 × 1.05² = $1102.50"],

  ["maths", 5, "Statistics and probability", "Averages", "mean = total ÷ number of values;  median = middle value in order;  mode = most common;  range = highest - lowest", undefined, "2, 4, 4, 6, 9: mean = 25 ÷ 5 = 5, median = 4, mode = 4, range = 7"],
  ["maths", 7, "Statistics and probability", "Probability", "P(event) = favourable outcomes ÷ total outcomes", "Always between 0 and 1. P(not A) = 1 - P(A).", "3 red marbles in 10: P(red) = 3/10"],
  ["maths", 9, "Statistics and probability", "Two independent events", "P(A and B) = P(A) × P(B)", "Use when the first event does not change the second, for example when marbles are replaced.", "P(red then red) = 3/10 × 3/10 = 9/100"],
  ["maths", 11, "Statistics and probability", "Permutations and combinations", "nPr = n! ÷ (n - r)!;  nCr = n! ÷ (r! × (n - r)!)", "Use nPr when order matters and nCr when it does not.", "5C2 = 5! ÷ (2! × 3!) = 10"],

  ["maths", 7, "Algebra", "Expanding brackets", "a(b + c) = ab + ac", "Multiply every term inside the bracket.", "3(x + 4) = 3x + 12"],
  ["maths", 7, "Algebra", "Solving equations", "Do the same to both sides to get x on its own", "Undo the operations in reverse order.", "3x + 5 = 20, so 3x = 15 and x = 5"],
  ["maths", 9, "Algebra", "Index laws", "a^m × a^n = a^(m + n);  a^m ÷ a^n = a^(m - n);  (a^m)^n = a^(mn);  a^0 = 1;  a^(-n) = 1 ÷ a^n", undefined, "2^3 × 2^4 = 2^7 = 128"],
  ["maths", 9, "Algebra", "Expanding two brackets", "(x + a)(x + b) = x² + (a + b)x + ab", undefined, "(x + 2)(x + 5) = x² + 7x + 10"],
  ["maths", 9, "Algebra", "Difference of two squares", "a² - b² = (a + b)(a - b)", undefined, "x² - 9 = (x + 3)(x - 3)"],
  ["maths", 9, "Algebra", "Factorising quadratics", "x² + bx + c = (x + p)(x + q), where p + q = b and p × q = c", undefined, "x² + 7x + 12: 3 + 4 = 7 and 3 × 4 = 12, so (x + 3)(x + 4)"],
  ["maths", 9, "Algebra", "Quadratic formula", "x = (-b ± sqrt(b² - 4ac)) ÷ 2a", "For ax² + bx + c = 0.", "x² - 5x + 6 = 0: x = (5 ± sqrt(25 - 24)) ÷ 2, so x = 3 or 2"],
  ["maths", 9, "Algebra", "Straight lines", "gradient m = (y2 - y1) ÷ (x2 - x1);  line: y = mx + c", "c is where the line crosses the y-axis.", "Through (1, 2) and (3, 8): m = 6 ÷ 2 = 3"],
  ["maths", 9, "Algebra", "Distance and midpoint", "d = sqrt((x2 - x1)² + (y2 - y1)²);  midpoint = ((x1 + x2) ÷ 2, (y1 + y2) ÷ 2)", undefined, "(0, 0) to (3, 4): d = sqrt(9 + 16) = 5"],
  ["maths", 9, "Algebra", "Standard form", "a × 10^n, where a is between 1 and 10", undefined, "45 000 = 4.5 × 10^4"],
  ["maths", 11, "Algebra", "The discriminant", "D = b² - 4ac.  D > 0: two roots;  D = 0: one root;  D < 0: no real roots", undefined, "x² + 2x + 5: D = 4 - 20 = -16, so no real roots"],
  ["maths", 11, "Algebra", "Arithmetic sequences", "nth term = a + (n - 1)d;  sum of n terms Sn = n ÷ 2 × (2a + (n - 1)d)", "a = first term and d = common difference.", "a = 3, d = 4: 10th term = 3 + 9 × 4 = 39"],
  ["maths", 11, "Algebra", "Geometric sequences", "nth term = a × r^(n - 1);  Sn = a(1 - r^n) ÷ (1 - r)", "r = common ratio.", "a = 2, r = 3: 4th term = 2 × 27 = 54"],
  ["maths", 11, "Algebra", "Log laws", "log(xy) = log x + log y;  log(x ÷ y) = log x - log y;  log(x^n) = n log x;  log_a(x) = y means a^y = x", undefined, "log 2 + log 5 = log 10 = 1"],

  ["maths", 9, "Geometry and trigonometry", "Pythagoras' theorem", "a² + b² = c²", "c is the hypotenuse, the longest side of a right-angled triangle.", "Sides 3 and 4: c = sqrt(9 + 16) = 5"],
  ["maths", 9, "Geometry and trigonometry", "Trigonometric ratios", "sin theta = opposite ÷ hypotenuse;  cos theta = adjacent ÷ hypotenuse;  tan theta = opposite ÷ adjacent", "Remember SOH CAH TOA.", "Hypotenuse 10 and angle 30°: opposite = 10 × sin 30° = 5"],
  ["maths", 10, "Geometry and trigonometry", "Sine and cosine rules", "a ÷ sin A = b ÷ sin B = c ÷ sin C;  c² = a² + b² - 2ab cos C", "Use the cosine rule when you know two sides and the angle between them.", "a = 7, b = 5, C = 60°: c² = 49 + 25 - 35 = 39, so c is about 6.24"],
  ["maths", 10, "Geometry and trigonometry", "Area of a triangle (using sine)", "A = 1/2 × a × b × sin C", undefined, "a = 6, b = 8, C = 30°: A = 1/2 × 6 × 8 × 0.5 = 12"],
  ["maths", 11, "Geometry and trigonometry", "Trigonometric identities", "sin²theta + cos²theta = 1;  tan theta = sin theta ÷ cos theta", undefined, "If sin theta = 0.6 then cos²theta = 1 - 0.36 = 0.64"],
  ["maths", 11, "Geometry and trigonometry", "Exact trig values", "sin 30° = 1/2;  sin 45° = sqrt(2)/2;  sin 60° = sqrt(3)/2;  cos 30° = sqrt(3)/2;  cos 60° = 1/2;  tan 45° = 1"],

  ["maths", 11, "Calculus and vectors", "Differentiation (power rule)", "d/dx (a x^n) = a n x^(n - 1)", undefined, "d/dx (3x^4) = 12x^3"],
  ["maths", 11, "Calculus and vectors", "Integration (power rule)", "integral of a x^n dx = a x^(n + 1) ÷ (n + 1) + C", "Works for any n except -1.", "integral of 8x^3 dx = 2x^4 + C"],
  ["maths", 11, "Calculus and vectors", "Stationary points", "Solve f'(x) = 0 to find the x-value", undefined, "f(x) = x² - 6x + 5: f'(x) = 2x - 6 = 0, so x = 3"],
  ["maths", 11, "Calculus and vectors", "Magnitude of a vector", "|a i + b j| = sqrt(a² + b²)", undefined, "|3i + 4j| = sqrt(9 + 16) = 5"],

  // ---------- Physics ----------
  ["physics", 9, "Motion", "Speed", "v = d ÷ t", "Average speed = total distance ÷ total time.", "150 m in 30 s: v = 5 m/s"],
  ["physics", 9, "Motion", "Acceleration", "a = (v - u) ÷ t", "u = starting velocity and v = final velocity.", "0 to 20 m/s in 4 s: a = 5 m/s²"],
  ["physics", 11, "Motion", "Constant acceleration (SUVAT)", "v = u + at;  s = ut + 1/2 at²;  v² = u² + 2as;  s = (u + v) ÷ 2 × t", "Use when acceleration is constant.", "u = 0, a = 2, t = 5: v = 10 m/s and s = 25 m"],
  ["physics", 11, "Motion", "Falling and projectiles", "h = 1/2 g t²  (g = 10 m/s²);  horizontal distance = speed × time", "Horizontal and vertical motion are independent.", "h = 45 m: t = sqrt(45 ÷ 5) = 3 s"],
  ["physics", 9, "Forces", "Newton's second law", "F = ma", "F in newtons, m in kg and a in m/s².", "5 kg at 3 m/s²: F = 15 N"],
  ["physics", 9, "Forces", "Weight", "W = mg", "g = 10 N/kg (or 9.8) near the Earth's surface.", "10 kg: W = 100 N"],
  ["physics", 9, "Forces", "Density", "density = mass ÷ volume  (rho = m ÷ V)", undefined, "200 g in 50 cm³: rho = 4 g/cm³"],
  ["physics", 9, "Forces", "Pressure", "P = F ÷ A;  in a liquid: P = rho g h", undefined, "500 N on 5 m²: P = 100 Pa.  Water 3 m deep: 1000 × 10 × 3 = 30 000 Pa"],
  ["physics", 11, "Forces", "Hooke's law", "F = kx", "k is the spring constant and x is the extension.", "k = 200 N/m, x = 0.1 m: F = 20 N"],
  ["physics", 11, "Forces", "Momentum and impulse", "p = mv;  impulse = F × t = change in momentum", "Momentum is conserved in a collision.", "2 kg at 6 m/s: p = 12 kg m/s"],
  ["physics", 11, "Forces", "Circular motion", "F = m v² ÷ r", "The force points towards the centre.", "2 kg at 3 m/s, r = 2 m: F = 2 × 9 ÷ 2 = 9 N"],
  ["physics", 9, "Energy", "Work", "W = F × d", "Work done = energy transferred.", "20 N over 5 m: W = 100 J"],
  ["physics", 9, "Energy", "Power", "P = E ÷ t  (or W ÷ t)", undefined, "600 J in 10 s: P = 60 W"],
  ["physics", 9, "Energy", "Kinetic energy", "KE = 1/2 m v²", undefined, "4 kg at 2 m/s: KE = 1/2 × 4 × 4 = 8 J"],
  ["physics", 9, "Energy", "Gravitational potential energy", "GPE = m g h", undefined, "3 kg raised 2 m: GPE = 3 × 10 × 2 = 60 J"],
  ["physics", 9, "Energy", "Efficiency", "efficiency = useful energy out ÷ total energy in × 100%", undefined, "500 J in, 375 J useful: 75%"],
  ["physics", 9, "Electricity", "Ohm's law", "V = I R", "V in volts, I in amps and R in ohms.", "5 A through 4 ohms: V = 20 V"],
  ["physics", 9, "Electricity", "Electrical power and energy", "P = V I;  E = P t", "Household energy is measured in kWh = kW × hours.", "2 kW for 3 h at 30 c/kWh: 6 kWh costs 180 c"],
  ["physics", 9, "Electricity", "Charge", "Q = I t", undefined, "3 A for 10 s: Q = 30 C"],
  ["physics", 11, "Electricity", "Resistors", "Series: R = R1 + R2 + ...;  parallel: 1/R = 1/R1 + 1/R2 + ...", "Two resistors in parallel: R = (R1 × R2) ÷ (R1 + R2).", "6 and 3 in parallel: R = 18 ÷ 9 = 2 ohms"],
  ["physics", 11, "Electricity", "Transformers", "Vp ÷ Vs = Np ÷ Ns", "p = primary coil and s = secondary coil.", "Np = 100, Ns = 300, Vp = 24 V: Vs = 72 V"],
  ["physics", 9, "Waves and heat", "Wave equation", "v = f × lambda", "v = speed, f = frequency and lambda = wavelength.", "f = 10 Hz, lambda = 3 m: v = 30 m/s"],
  ["physics", 11, "Waves and heat", "Lenses", "1/f = 1/u + 1/v", "u = object distance and v = image distance.", "f = 10, u = 20: 1/v = 1/10 - 1/20, so v = 20 cm"],
  ["physics", 9, "Waves and heat", "Heat energy", "Q = m c (change in temperature)", "c is the specific heat capacity (water: 4200 J/kg/°C).", "2 kg of water up 5 °C: Q = 2 × 4200 × 5 = 42 000 J"],
  ["physics", 11, "Waves and heat", "Half-life", "remaining = start × (1/2)^(number of half-lives)", undefined, "160 g, 3 half-lives: 160 ÷ 8 = 20 g"],

  // ---------- Chemistry ----------
  ["chemistry", 9, "Atoms", "Sub-atomic particles", "protons = atomic number;  neutrons = mass number - atomic number;  electrons = protons (in a neutral atom)", undefined, "Magnesium (atomic number 12, mass number 24): 12 protons, 12 neutrons, 12 electrons"],
  ["chemistry", 9, "Atoms", "Electron shells", "Shells hold 2, 8, 8 electrons in order (for the first 20 elements)", undefined, "Sodium (11 electrons): 2, 8, 1"],
  ["chemistry", 9, "Moles and solutions", "Moles from mass", "n = m ÷ M", "n = moles, m = mass in g and M = molar mass in g/mol.", "66 g of CO2 (M = 44): n = 1.5 mol"],
  ["chemistry", 9, "Moles and solutions", "Relative formula mass", "Mr = sum of the Ar of every atom in the formula", undefined, "CaCO3: 40 + 12 + 3 × 16 = 100"],
  ["chemistry", 11, "Moles and solutions", "Concentration", "c = n ÷ V;  n = c × V", "V in litres and c in mol/L.", "0.5 mol/L in 4 L: n = 2 mol"],
  ["chemistry", 11, "Moles and solutions", "Dilution and titration", "c1 × V1 = c2 × V2", "For a 1:1 reaction, moles of acid = moles of base.", "10 mL of 0.1 mol/L acid neutralises 20 mL of base: c = 0.05 mol/L"],
  ["chemistry", 11, "Moles and solutions", "Gas volumes at STP", "V = n × 22.4 L", undefined, "2 mol of gas: V = 44.8 L"],
  ["chemistry", 11, "Moles and solutions", "Ideal gas law", "PV = nRT", "R = 8.31 J/mol/K, with T in kelvin (K = °C + 273).", undefined],
  ["chemistry", 11, "Moles and solutions", "Number of particles", "particles = n × 6.02 × 10^23", undefined, "0.5 mol: 3.01 × 10^23 particles"],
  ["chemistry", 11, "Reactions", "Stoichiometry", "Coefficients in a balanced equation are mole ratios", undefined, "2H2 + O2 -> 2H2O: 4 mol of H2 makes 4 mol of H2O"],
  ["chemistry", 11, "Reactions", "Percentage yield", "% yield = actual yield ÷ theoretical yield × 100", undefined, "14 g collected out of 20 g possible: 70%"],
  ["chemistry", 11, "Reactions", "Rate of reaction", "rate = amount of product ÷ time", undefined, "20 cm³ of gas in 10 s: 2 cm³/s"],
  ["chemistry", 11, "Reactions", "Le Chatelier's principle", "An equilibrium shifts to oppose any change made to it", "More reactant shifts right; more product shifts left; a catalyst does not shift it.", undefined],
  ["chemistry", 9, "Reactions", "Neutralisation", "acid + base -> salt + water", "The salt's name comes from the metal in the base and the acid: hydrochloric gives chloride, sulfuric gives sulfate, nitric gives nitrate.", "Hydrochloric acid + sodium hydroxide -> sodium chloride + water"],
  ["chemistry", 9, "Acids and energy", "pH scale", "pH < 7 acidic;  pH = 7 neutral;  pH > 7 alkaline", undefined, undefined],
  ["chemistry", 11, "Acids and energy", "pH calculations", "pH = -log[H+];  pH + pOH = 14", "For a strong acid, [H+] equals the acid concentration.", "0.01 mol/L HCl: pH = 2"],
  ["chemistry", 9, "Acids and energy", "Heat energy", "q = m c (change in temperature)", "For water, c = 4.18 J/g/°C.", "100 g up 10 °C: q = 100 × 4.18 × 10 = 4180 J"],
  ["chemistry", 11, "Acids and energy", "Oxidation numbers", "In a neutral compound they add up to 0.  O is usually -2 and H is usually +1.", undefined, "SO2: S + 2(-2) = 0, so S = +4"],
  ["chemistry", 11, "Organic chemistry", "Hydrocarbon families", "alkanes CnH2n+2;  alkenes CnH2n", "Alkanes have only single bonds. Alkenes have a C=C double bond.", "Propane has 3 carbons: C3H8"],

  // ---------- Biology ----------
  ["biology", 9, "Cells", "Magnification", "magnification = image size ÷ actual size", "Convert both to the same unit first (1 mm = 1000 micrometres).", "Image 4000 micrometres, actual 40 micrometres: 100 times"],
  ["biology", 9, "Cells", "Surface area to volume ratio", "cube: SA = 6 × side²;  V = side³", "Small cells have a larger SA:V ratio, so exchange is faster.", "Side 2 cm: SA = 24, V = 8, ratio = 3 : 1"],
  ["biology", 9, "Cells", "Osmosis", "Water moves from a dilute solution to a more concentrated one across a partially permeable membrane", undefined, "A potato cylinder in distilled water gains water"],
  ["biology", 9, "Cells", "Percentage change in mass", "% change = (final - initial) ÷ initial × 100", undefined, "5 g to 5.5 g: 0.5 ÷ 5 × 100 = 10% increase"],
  ["biology", 9, "Energy in living things", "Photosynthesis", "6CO2 + 6H2O -> C6H12O6 + 6O2  (needs light)", undefined, undefined],
  ["biology", 9, "Energy in living things", "Aerobic respiration", "C6H12O6 + 6O2 -> 6CO2 + 6H2O + energy", undefined, undefined],
  ["biology", 9, "Energy in living things", "Energy in a food chain", "About 10% of energy passes to the next level", undefined, "20 000 kJ in producers: 2000 kJ to primary consumers, 200 kJ to secondary consumers"],
  ["biology", 9, "Genetics", "Monohybrid cross", "Tt × Tt gives TT : Tt : Tt : tt, a 3 : 1 ratio of dominant to recessive", "Cross homozygous dominant with recessive (TT × tt): all Tt.", undefined],
  ["biology", 11, "Genetics", "Dihybrid cross", "AaBb × AaBb gives a 9 : 3 : 3 : 1 ratio", undefined, "Both dominant: 9/16"],
  ["biology", 11, "Genetics", "Base pairing", "DNA: A-T and G-C;  RNA: A-U and G-C", undefined, "DNA template TAC is transcribed to mRNA AUG"],
  ["biology", 11, "Genetics", "Hardy-Weinberg", "p + q = 1;  p² + 2pq + q² = 1", "q² = recessive homozygotes and 2pq = carriers.", "q² = 0.04: q = 0.2, p = 0.8, carriers = 2 × 0.8 × 0.2 = 0.32"],
  ["biology", 11, "Ecology", "Estimating population size", "N = (marked × second catch) ÷ marked recaptured", undefined, "50 marked, second catch 15 with 5 marked: N = 150"],
  ["biology", 11, "Ecology", "Population density", "density = number of organisms ÷ area", undefined, "16 animals in 2 km²: 8 per km²"],

  // ---------- Accounting ----------
  ["accounting", 9, "Basics", "The accounting equation", "Assets = Liabilities + Owner's equity", undefined, "Assets $80 000 and liabilities $30 000: equity = $50 000"],
  ["accounting", 9, "Basics", "Debits and credits", "Debit: assets and expenses increase.  Credit: liabilities, equity and revenue increase.", undefined, "Paying rent: debit Rent expense, credit Cash"],
  ["accounting", 9, "Profit", "Gross profit", "Gross profit = sales - cost of sales", undefined, "Sales $146 000, cost of sales $101 000: gross profit = $45 000"],
  ["accounting", 9, "Profit", "Net profit", "Net profit = gross profit - expenses  (or revenue - expenses)", undefined, "Gross profit $45 000, expenses $20 000: net profit = $25 000"],
  ["accounting", 9, "Profit", "GST", "price with GST = price × 1.1;  GST inside a total = total ÷ 11", "Cambridge courses use VAT at the local rate.", "$220 + GST = $242"],
  ["accounting", 9, "Depreciation", "Straight-line depreciation", "annual depreciation = (cost - residual value) ÷ useful life", undefined, "Cost $12 000, residual $2000, 5 years: $2000 a year"],
  ["accounting", 11, "Depreciation", "Reducing balance", "depreciation = book value × rate", "The book value falls each year, so depreciation falls too.", "Book value $10 000 at 20%: $2000, then $1600 the next year"],
  ["accounting", 11, "Ratios", "Current ratio", "current assets ÷ current liabilities", "Above 1 means the business can cover its short-term debts.", "$60 000 ÷ $40 000 = 1.5"],
  ["accounting", 11, "Ratios", "Profit margins", "gross margin = gross profit ÷ sales × 100;  net margin = net profit ÷ sales × 100", undefined, "$16 000 net profit on $200 000 sales: 8%"],
  ["accounting", 11, "Ratios", "Return on equity", "ROE = net profit ÷ owner's equity × 100", undefined, "$99 900 ÷ $370 000 × 100 = 27%"],
  ["accounting", 11, "Ratios", "Debt to equity", "total liabilities ÷ owner's equity", "A higher ratio means more reliance on borrowing.", "$50 000 ÷ $100 000 = 0.5"],
  ["accounting", 11, "Inventory and costs", "Weighted average cost", "total cost ÷ total units", undefined, "60 units at $15 and 60 units at $19: $2040 ÷ 120 = $17"],
  ["accounting", 11, "Inventory and costs", "Break-even point", "break-even units = fixed costs ÷ (selling price - variable cost per unit)", undefined, "Fixed $6000, price $20, variable cost $8: 500 units"],
  ["accounting", 11, "Inventory and costs", "Margin of safety", "(expected sales - break-even) ÷ expected sales × 100", undefined, "800 expected, 720 break-even: 10%"],
  ["accounting", 11, "Inventory and costs", "Doubtful debts", "allowance = % × accounts receivable", undefined, "3% of $40 000 = $1200"],
  ["accounting", 11, "Cash flow", "Cash flow classification", "Operating: day-to-day trading.  Investing: buying or selling assets.  Financing: loans and owner's capital.", undefined, "Buying a delivery van is an investing activity"],

  // ---------- Business Studies ----------
  ["business", 9, "Pricing and sales", "Mark-up", "selling price = cost + mark-up;  mark-up % = mark-up ÷ cost × 100", undefined, "Cost $40, mark-up 25%: selling price $50"],
  ["business", 9, "Pricing and sales", "Revenue and profit", "revenue = price × quantity;  profit = revenue - costs", undefined, "150 units at $43: revenue = $6450"],
  ["business", 9, "Pricing and sales", "Market share", "market share = firm's sales ÷ total market sales × 100", undefined, "$2 million of a $20 million market: 10%"],
  ["business", 9, "Strategy", "Marketing mix (the 4Ps)", "Product, Price, Promotion, Place", undefined, undefined],
  ["business", 9, "Strategy", "SWOT analysis", "Strengths and Weaknesses are internal;  Opportunities and Threats are external", undefined, undefined],
  ["business", 9, "Strategy", "Product life cycle", "Introduction, Growth, Maturity, Decline", undefined, undefined],
  ["business", 11, "Performance", "Return on investment", "ROI = (gain - cost) ÷ cost × 100", undefined, "Invest $10 000 and gain $12 000: ROI = 20%"],
  ["business", 11, "Performance", "Net profit margin", "net profit ÷ revenue × 100", undefined, "$16 000 on $200 000: 8%"],
  ["business", 11, "Performance", "Sales growth", "(new sales - old sales) ÷ old sales × 100", undefined, "$120 000 up from $100 000: 20%"],
  ["business", 11, "Performance", "Average cost", "total cost ÷ quantity produced", undefined, "$5000 for 250 units: $20 each"],
  ["business", 11, "People and operations", "Staff turnover", "leavers ÷ average number of staff × 100", undefined, "6 leavers from 60 staff: 10%"],
  ["business", 11, "People and operations", "Labour productivity", "output ÷ labour input", undefined, "1200 units from 20 workers: 60 units per worker"],
  ["business", 11, "People and operations", "Absenteeism rate", "days lost ÷ total working days × 100", undefined, "50 days lost out of 1250: 4%"],
  ["business", 11, "People and operations", "Capacity utilisation", "actual output ÷ maximum capacity × 100", undefined, "1600 out of 2000: 80%"],

  // ---------- Economics ----------
  ["economics", 9, "Measuring the economy", "Inflation rate", "inflation = (new CPI - old CPI) ÷ old CPI × 100", undefined, "CPI 100 to 103: 3%"],
  ["economics", 9, "Measuring the economy", "GDP per capita", "GDP ÷ population", undefined, "$1600 billion ÷ 20 million = $80 000"],
  ["economics", 9, "Measuring the economy", "Opportunity cost", "The value of the next best alternative given up", undefined, "Spending an afternoon studying instead of working: the lost pay is the cost"],
  ["economics", 9, "Markets", "Shifts in demand and supply", "Demand shifts right with higher incomes, a rise in substitutes' prices or better tastes.  Supply shifts right with lower costs, new technology or subsidies.", "A change in the good's own price moves along the curve, not the curve itself.", undefined],
  ["economics", 11, "Measuring the economy", "GDP (expenditure approach)", "GDP = C + I + G + (X - M)", "C = consumption, I = investment, G = government spending, X = exports, M = imports.", "1040 + 310 + 200 + (350 - 180) = 1720"],
  ["economics", 11, "Measuring the economy", "Economic growth rate", "growth = (new real GDP - old real GDP) ÷ old real GDP × 100", undefined, "1000 to 1030: 3%"],
  ["economics", 11, "Measuring the economy", "Unemployment rate", "unemployed ÷ labour force × 100", undefined, "60 000 of 1 200 000: 5%"],
  ["economics", 11, "Measuring the economy", "Real wages", "real wage = nominal wage ÷ CPI × 100", undefined, "$484 with CPI 110: $440"],
  ["economics", 11, "Measuring the economy", "Budget balance", "government revenue - government spending", "A positive result is a surplus and a negative result is a deficit.", "$430 billion - $380 billion = $50 billion surplus"],
  ["economics", 11, "Markets", "Price elasticity of demand", "PED = % change in quantity demanded ÷ % change in price", "Ignoring the sign: above 1 is elastic and below 1 is inelastic.", "Price up 10%, quantity down 20%: PED = 2 (elastic)"],
  ["economics", 11, "Markets", "The multiplier", "multiplier = 1 ÷ (1 - MPC)", "MPC = marginal propensity to consume.", "MPC = 0.8: multiplier = 5"],

  // ---------- English ----------
  ["english", 1, "Sentences and punctuation", "Types of sentences", "Statement (.), question (?), exclamation (!), command (an instruction)", undefined, "Close the door. is a command"],
  ["english", 1, "Sentences and punctuation", "Capital letters and full stops", "Start every sentence, name and the word I with a capital letter. End a statement with a full stop.", undefined, "i went to sydney -> I went to Sydney."],
  ["english", 1, "Words", "Plurals", "Add -s.  After s, x, z, ch or sh add -es.  After a consonant + y change the y to -ies.", undefined, "bus -> buses;  baby -> babies"],
  ["english", 3, "Words", "Contractions and apostrophes", "An apostrophe replaces missing letters: do not -> don't", "Its = belonging to it.  It's = it is.", "It's raining and the dog wagged its tail"],
  ["english", 3, "Words", "Prefixes and suffixes", "un-, re-, pre- (before);  -ful (full of), -less (without), -ness (state of), -ly (how)", undefined, "care + ful = careful;  care + less = careless"],
  ["english", 3, "Words", "Common homophones", "their (belonging), there (place), they're (they are);  to, too (also), two;  your (belonging), you're (you are)", undefined, undefined],
  ["english", 3, "Grammar", "Subject-verb agreement", "A singular subject takes a singular verb (the dog barks).  A plural subject takes a plural verb (the dogs bark).", "Each, everyone and neither are singular.", "Each of the students has a pencil"],
  ["english", 3, "Grammar", "Past tense", "Regular verbs add -ed (walk -> walked).  Irregular verbs change (run -> ran, go -> went).", undefined, undefined],
  ["english", 3, "Punctuation", "Commas", "Use commas in lists, after an opening phrase, and before a joining word (and, but, so) that links two full sentences.", undefined, "After lunch, we played cricket, but it rained"],
  ["english", 5, "Punctuation", "Speech marks", "Put the spoken words inside speech marks and the comma or question mark inside them too.", undefined, "\"Come here,\" said Mum."],
  ["english", 5, "Grammar", "Simple, compound and complex sentences", "Simple: one main clause.  Compound: two main clauses joined by and, but, so, or.  Complex: a main clause plus a dependent clause (because, although, when, if).", undefined, "Although it rained, we played (complex)"],
  ["english", 5, "Language techniques", "Figurative language", "Simile: compares using like or as.  Metaphor: says one thing is another.  Personification: human qualities for a non-human thing.  Hyperbole: exaggeration.  Alliteration: repeated starting sounds.  Onomatopoeia: a sound word.", undefined, "The wind whispered (personification)"],
  ["english", 7, "Grammar", "Active and passive voice", "Active: subject + verb + object.  Passive: object + was/were + past participle + by + subject.", undefined, "The chef cooked the meal -> The meal was cooked by the chef"],
  ["english", 7, "Grammar", "Independent and dependent clauses", "An independent clause can stand alone as a sentence. A dependent clause cannot.", undefined, "Because he was tired (dependent), he went to bed (independent)"],
  ["english", 7, "Punctuation", "Semicolons and colons", "Semicolon: joins two related full sentences.  Colon: introduces a list or explanation after a full statement.", undefined, "I love reading; my brother prefers sport.  You need three things: a pencil, a ruler and an eraser."],
  ["english", 7, "Language techniques", "Persuasive techniques", "Rhetorical question, emotive language, statistics, expert opinion, repetition, bandwagon (everyone is doing it), urgency", undefined, undefined],
  ["english", 7, "Language techniques", "Point of view", "First person: I, we.  Second person: you.  Third person: he, she, they.", undefined, undefined],
  ["english", 9, "Language techniques", "Ethos, pathos and logos", "Ethos: credibility.  Pathos: emotion.  Logos: logic and evidence.", undefined, undefined],
  ["english", 9, "Grammar", "Comma splice and run-on sentences", "Two full sentences cannot be joined by a comma alone. Use a full stop, a semicolon, or a comma plus a joining word.", undefined, "It was raining, so we stayed in"],
  ["english", 11, "Grammar", "Parallel structure", "Keep list items in the same form.", undefined, "She enjoys reading, writing and painting (not ... and to paint)"],
  ["english", 11, "Style", "Concise writing", "Cut wordy phrases: due to the fact that -> because;  at this point in time -> now;  in the event that -> if", undefined, undefined],
];

export const FORMULAS: FormulaEntry[] = ROWS.map(([subject, minGrade, topic, name, formula, note, example]) => ({
  subject,
  minGrade,
  topic,
  name,
  formula,
  note,
  example,
}));

/** Swaps the plain-text notation for proper symbols on screen. */
export function prettify(text: string): string {
  return text
    .replace(/\bsqrt\b/g, "√")
    .replace(/\bpi\b/g, "π")
    .replace(/\btheta\b/g, "θ")
    .replace(/\blambda\b/g, "λ")
    .replace(/\brho\b/g, "ρ")
    .replace(/->/g, "→")
    .replace(/<=/g, "≤")
    .replace(/>=/g, "≥")
    .replace(/ - /g, " − ")
    .replace(/\(- /g, "(− ")
    .replace(/\(-(?=[\da-z])/g, "(−");
}

export function subjectsWithFormulas(): Subject[] {
  return Array.from(new Set(FORMULAS.map((f) => f.subject)));
}

export function formulasFor(subject: Subject, grade: number, query = ""): FormulaEntry[] {
  const q = query.trim().toLowerCase();
  return FORMULAS.filter((f) => {
    if (f.subject !== subject || f.minGrade > grade) return false;
    if (!q) return true;
    return [f.topic, f.name, f.formula, f.note ?? "", f.example ?? ""].some((text) => text.toLowerCase().includes(q));
  });
}

export function groupByTopic(entries: FormulaEntry[]): { topic: string; entries: FormulaEntry[] }[] {
  const groups: { topic: string; entries: FormulaEntry[] }[] = [];
  for (const entry of entries) {
    const group = groups.find((g) => g.topic === entry.topic);
    if (group) group.entries.push(entry);
    else groups.push({ topic: entry.topic, entries: [entry] });
  }
  return groups;
}
