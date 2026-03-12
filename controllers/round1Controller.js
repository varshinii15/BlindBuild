
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

