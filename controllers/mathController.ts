import { Request, Response } from "express";
import Question from "../models/Question";



// GET all math problems
export const getMathProblems = async (req: Request, res: Response) => {
  try {
    const problems = await Question.find({ category: "math" });
    res.json(problems);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// POST: Sum of digits
export const sumDigits = (req: Request, res: Response) => {
  const { n } = req.body;
  if (typeof n !== "number" || n < 0) {
    return res.status(400).json({ constraints: "Provide a non-negative integer" });
  }
  const result = n.toString().split("").reduce((acc, digit) => acc + Number(digit), 0);
  res.json({ message: "Success", output: result, hint: "Think about breaking the number into parts." });
};

// POST: Reverse number
export const reverseNumber = (req: Request, res: Response) => {
  const { n } = req.body;
  if (typeof n !== "number") {
    return res.status(400).json({ constraints: "Provide a valid integer" });
  }
  const result = Number(n.toString().split("").reverse().join(""));
  res.json({ message: "Success", output: result, hint: "What happens if you flip the digits?" });
};