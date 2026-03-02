import type { Request, Response } from "express";


export const dCD = (req: Request, res: Response) => {
  const { input1 } = req.body;

  if (!input1 || typeof input1 !== "object" || Array.isArray(input1)) {
    return res.status(400).json({ message: "Error" });
  }

  const visited = new Set<string>();
  const recStack = new Set<string>();

  const dfs = (node: string): boolean => {
    if (!input1[node]) return false;
    if (recStack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);

    for (const neighbor of input1[node]) {
      if (dfs(neighbor)) return true;
    }

    recStack.delete(node);
    return false;
  };

  for (const node of Object.keys(input1)) {
    if (dfs(node)) {
      return res.json({ message: "Success", output: true });
    }
  }

  res.json({ message: "Success", output: false });
};


export const dSPL = (req: Request, res: Response) => {
  const { input1, input2, input3 } = req.body;

  if (!input1 || !input2 || !input3) {
    return res.status(400).json({ message: "Error" });
  }

  const graph = input1;
  const start = input2;
  const target = input3;
  let minLength = Infinity;
  const visited = new Set<string>();

  const dfs = (node: string, length: number) => {
    if (node === target) {
      minLength = Math.min(minLength, length);
      return;
    }
    visited.add(node);
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) dfs(neighbor, length + 1);
    }
    visited.delete(node);
  };

  dfs(start, 0);

  res.json({ message: "Success", output: minLength === Infinity ? -1 : minLength });
};