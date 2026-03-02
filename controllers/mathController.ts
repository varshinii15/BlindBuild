import type { Request, Response } from "express";

export const MM = (req: Request, res: Response) => {
  const { input1, input2 } = req.body;

  if (!Array.isArray(input1) || !Array.isArray(input2)) {
    return res.status(400).json({ message: "Error" });
  }

  const rowsA = input1.length, colsA = input1[0].length;
  const rowsB = input2.length, colsB = input2[0].length;

  if (colsA !== rowsB) {
    return res.status(400).json({ message: "Error" });
  }

  const result: number[][] = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += input1[i][k] * input2[k][j];
      }
    }
  }

  res.json({ message: "Success", output: result });
};

export const nthR = (req: Request, res: Response) => {
  const { input1, input2 } = req.body;

  if (typeof input1 !== "number" || typeof input2 !== "number") {
    return res.status(400).json({ message: "Error" });
  }

  if (input2 <= 0) {
    return res.status(400).json({ message: "Error" });
  }

  if (input1 < 0 && input2 % 2 === 0) {
    return res.status(400).json({ message: "Error" });
  }

  const result = Math.pow(input1, 1 / input2);

  res.json({ message: "Success", output: result })
};