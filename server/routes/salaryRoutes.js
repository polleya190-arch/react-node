import express from "express";
import { addSalary, getSalaryHistory } from "../controllers/salaryController.js";

const router = express.Router();

router.post("/", addSalary);
router.get("/:userId", getSalaryHistory);

export default router;
