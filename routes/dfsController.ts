import express from "express";
import { getDFSProblems, dfsTraversal, dfsPathExists } from "../controllers/dfsController";

const router = express.Router();

// GET all DFS problems from DB
router.get("/problem", getDFSProblems);

// POST hidden logic endpoints
router.post("/problem1", dfsTraversal);    // DFS traversal
router.post("/problem2", dfsPathExists);   // Path existence

export default router;