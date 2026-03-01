import express from "express";
import { getMathProblems, sumDigits, reverseNumber } from "../controllers/mathController";

const router = express.Router();

// GET all math problems from DB
router.get("/problem", getMathProblems);

// POST hidden logic endpoints
router.post("/problem1", sumDigits);       
router.post("/problem2", reverseNumber);   

export default router;