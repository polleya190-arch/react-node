import express from "express";
import {
  addTransaction,
  updateTransaction,
  getMonthlySummary,
  getUserTransactions
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", addTransaction);
router.put("/:id", updateTransaction);
router.get("/summary/:userId", getMonthlySummary);
router.get("/user/:userId", getUserTransactions); // ✅ clean version

export default router;
