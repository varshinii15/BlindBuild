
// Keyboard Cipher
const qwerty = [
  "`1234567890-=",
  "qwertyuiop[]\\",
  "asdfghjkl;'",
  "zxcvbnm,./"
];
function shiftRight(char) {
  for (const row of qwerty) {
    const idx = row.indexOf(char.toLowerCase());
    if (idx !== -1) {
      if (idx === row.length - 1) return ""; // end of row
      const shifted = row[idx + 1];
      return char === char.toUpperCase() ? shifted.toUpperCase() : shifted;
    }
  }
  return char;
}
exports.translateKeyboard = (req, res) => {
  const { input } = req.body;
  if (input === undefined) return res.status(400).json({ error: "Error" });
  const result = input.split("").map(shiftRight).join("");
  res.json({ result });
};

//Bit‑Flip Mirror
exports.bitFlip = (req, res) => {
  const { input } = req.body;
  if (typeof input !== "number" || input < 0 || input > 255) {
    return res.status(400).json({ error: "Error" });
  }
  const bin = input.toString(2).padStart(8, "0");
  const reversed = bin.split("").reverse().join("");
  const result = parseInt(reversed, 2);
  res.json({ result });
};

//Chess Knight Validator
exports.knightValidator = (req, res) => {
  const { start, end } = req.body;
  if (!Array.isArray(start) || !Array.isArray(end)) {
    return res.status(400).json({ error: "Error" });
  }
  const dx = Math.abs(start[0] - end[0]);
  const dy = Math.abs(start[1] - end[1]);
  const valid = (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
  res.json({ valid });
};

//Color Mixer
const mixMap = {
  Yellow: { Blue: "Green", Red: "Orange" },
  Blue: { Red: "Purple", Yellow: "Green" },
  Red: { Yellow: "Orange", Blue: "Purple", White: "Pink", Green: "Brown" }
};
exports.combineColors = (req, res) => {
  const { input1, input2 } = req.body;
  if (!input1 || !input2) return res.status(400).json({ error: "Missing colors" });
  if (input1 === input2) return res.json({ status: "success", result: input1 });
  const result = mixMap[input1]?.[input2] || mixMap[input2]?.[input1];
  if (!result) return res.status(400).json({ error: "Error" });
  res.json({ status: "success", result });
};

//Vowel Orbit
const vowels = "AEIOUaeiou";
exports.vowelOrbit = (req, res) => {
  const { input } = req.body;
  if (input === undefined) return res.status(400).json({ error: "Error" });
  const chars = input.split("");
  const vowelIndices = chars.map((c, i) => (vowels.includes(c) ? i : -1)).filter(i => i !== -1);
  const vowelChars = vowelIndices.map(i => chars[i]);
  if (vowelChars.length > 0) {
    const rotated = [vowelChars[vowelChars.length - 1], ...vowelChars.slice(0, -1)];
    vowelIndices.forEach((idx, j) => {
      chars[idx] = rotated[j];
    });
  }
  res.json({ status: "success", result: chars.join("") });
};

//Gravity Well
exports.gravityProcess = (req, res) => {
  const { input } = req.body;
  if (typeof input !== "string") return res.status(400).json({ error: "Error" });
  let balance = 0;
  for (const ch of input) {
    const code = ch.charCodeAt(0);
    balance += code % 2 === 0 ? 1 : -1;
  }
  res.json({ result: balance });
};
// 1. Hidden Network Problem (Fixed Graph - Shortest Path)
// Hidden Network Graph
const hiddenGraph = {
  1: [2, 3],
  2: [4, 5],
  3: [5],
  4: [6],
  5: [6, 7],
  6: [8],
  7: [9],
  8: [10],
  9: [10],
  10: [],
  11: [3, 7],
  12: [8]
};
exports.HNP = (req, res) => {
  const { input1, input2 } = req.body || {};

  const start = Number(input1);
  const target = Number(input2);

  if (!Number.isInteger(start) || !Number.isInteger(target)) {
    return res.status(400).json({ message: "Error" });
  }
  if (!(start in hiddenGraph) || !(target in hiddenGraph)) {
    return res.status(400).json({ message: "Error" });
  }

  const queue = [[start, 0]];
  const visited = new Set([start]);

  while (queue.length) {
    const [node, dist] = queue.shift();
    if (node === target) return res.json({ message: "Success", output: dist });
    for (const neighbor of hiddenGraph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }

  return res.status(404).json({ message: "Error" });
};

exports.RFC = (req, res) => {
  const { input1 } = req.body;

  if (typeof input1 !== "string" || input1.trim() === "") {
    return res.status(400).json({ message: "Error" });
  }
  if (!/^[a-zA-Z]+$/.test(input1)) {
    return res.status(400).json({ message: "Error" });
  }

  const rail0 = [];
  const rail1 = [];

  for (let i = 0; i < input1.length; i++) {
    if (i % 2 === 0) rail0.push(input1[i]);
    else rail1.push(input1[i]);
  }

  const output = [...rail0, ...rail1].join("");
  res.json({ message: "Success", output });
};

exports.TDL = (req, res) => {
  const { input1 } = req.body;

  if (typeof input1 !== "number" || !Number.isInteger(input1)) {
    return res.status(400).json({ message: "Error" });
  }

  const currentSecond = new Date().getSeconds();
  const output = input1 + currentSecond;

  res.json({ message: "Success", output });
};
const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
};
exports.PMF = (req, res) => {
  const { input1 } = req.body;

  if (typeof input1 !== "string" || input1.trim() === "") {
    return res.status(400).json({ message: "Error" });
  }

  const output = isPrime(input1.length);
  res.json({ message: "Success", output });
};
// 15. First-Letter Extractor
// POST /api/v1/start
// {"text": "DEVELOPER"} → {"status": "success", "result": "D"}
exports.firstLetter = (req, res) => {
  const { text } = req.body;
  if (!text || text.length === 0) {
    return res.status(400).json({ status: "error", code: 400, msg: "Empty input" });
  }
  res.json({ status: "success", result: text[0] });
};

// 16. Uppercase Counter
// POST /api/v1/count-upper
// {"text": "HeLLo"} → {"status": "success", "result": 3}
exports.countUpper = (req, res) => {
  const { text } = req.body;
  if (typeof text !== "string" || /[0-9]/.test(text)) {
    return res.status(400).json({ status: "error", code: 400, msg: "Invalid input" });
  }
  const result = text.split("").filter(c => c >= "A" && c <= "Z").length;
  res.json({ status: "success", result });
};

// 17. Duplicate Detector
// POST /api/v1/duplicate
// {"text": "apple"} → {"status": "success", "result": true}
exports.duplicateDetector = (req, res) => {
  const { text } = req.body;
  if (typeof text !== "string" || text.length === 0) {
    return res.status(400).json({ status: "error", code: 400, msg: "Invalid input" });
  }
  const result = new Set(text).size !== text.length;
  res.json({ status: "success", result });
};

// 18. Word Sorter
// POST /api/v1/sort
// {"input": "blind"} → {"status": "success", "result": "bdiln"}
exports.wordSorter = (req, res) => {
  const { input } = req.body;
  if (typeof input !== "string" || input.length === 0) {
    return res.status(400).json({ status: "error", code: 400, msg: "Invalid input" });
  }
  const result = input.split("").sort().join("");
  res.json({ status: "success", result });
};

// 19. Middle Character
// POST /api/v1/middle
// {"text": "coding"} → {"status": "success", "result": "d"}
// Even length → two middle chars; Odd length → one middle char
exports.middleChar = (req, res) => {
  const { text } = req.body;
  if (typeof text !== "string" || text.length === 0) {
    return res.status(400).json({ status: "error", code: 400, msg: "Invalid input" });
  }
  const len = text.length;
  const mid = Math.floor(len / 2);
  const result = len % 2 === 0 ? text.slice(mid - 1, mid + 1) : text[mid];
  res.json({ status: "success", result });
};




exports.Mirror = (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({
      status: "error",
      code: 400,
      msg: "Empty input",
    });
  }

  const result = text.split("").reverse().join("");

  return res.status(200).json({
    status: "success",
    result,
  });
};
// Controller 12: Even-Odd Gate
 exports.evenOddGate = (req, res) => {
  const { number } = req.body;

  if (number === undefined || number === null || isNaN(Number(number)) || typeof number === "string" && number.trim() === "") {
    return res.status(400).json({
      status: "error",
      code: 400,
      msg: "Invalid number",
    });
  }

  const num = Number(number);
  const result = num % 2 === 0 ? "Even" : "Odd";

  return res.status(200).json({
    status: "success",
    result,
  });
};

// Controller 13: Alphabet Position
exports.alphabetPosition = (req, res) => {
  const { char } = req.body;

  if (!char || char.length !== 1 || !/^[a-zA-Z]$/.test(char)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      msg: "Invalid character",
    });
  }

  const result = char.toUpperCase().charCodeAt(0) - 64; // 'A' = 65, so A→1, B→2, ..., Z→26

  return res.status(200).json({
    status: "success",
    result,
  });
};

// Controller 14: Word Length Counter
exports.wordLengthCounter = (req, res) => {
  const { word } = req.body;

  if (!word || word.trim() === "" || /\s/.test(word)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      msg: "Invalid input",
    });
  }

  const result = word.length;

  return res.status(200).json({
    status: "success",
    result,
  });
};


