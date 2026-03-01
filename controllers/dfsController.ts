import { Request, Response } from "express";
import Question from "../models/Question";


// GET all DFS problems
export const getDFSProblems = async (req: Request, res: Response) => {
  try {
    const problems = await Question.find({ category: "dfs" });
    res.json(problems);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// POST: DFS Traversal
export const dfsTraversal = (req: Request, res: Response) => {
  const { graph, start } = req.body;
  if (!graph || !start) {
    return res.status(400).json({ constraints: "Graph and start node required" });
  }

  const visited: string[] = [];
  const dfs = (node: string) => {
    if (!graph[node] || visited.includes(node)) return;
    visited.push(node);
    for (const neighbor of graph[node]) {
      dfs(neighbor);
    }
  };

  dfs(start);
  res.json({ message: "Success", output: visited, hint: "Explore as deep as possible before backtracking." });
};

// POST: DFS Path Existence
export const dfsPathExists = (req: Request, res: Response) => {
  const { graph, start, target } = req.body;
  if (!graph || !start || !target) {
    return res.status(400).json({ constraints: "Graph, start, and target required" });
  }

  const visited = new Set<string>();
  const dfs = (node: string): boolean => {
    if (node === target) return true;
    if (!graph[node] || visited.has(node)) return false;
    visited.add(node);
    return graph[node].some((neighbor: string) => dfs(neighbor));
  };

  res.json({ message: "Success", output: dfs(start), hint: "Can you reach the target by going deeper?" });
};