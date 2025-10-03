import Salary from "../models/Salary.js";

export const addSalary = async (req, res) => {
  try {
    const { userId, amount, effectiveFrom } = req.body;
    const salary = new Salary({ userId, amount, effectiveFrom });
    await salary.save();

    // Also create a credit transaction for this salary
    const Transaction = (await import("../models/Transaction.js")).default;
    const transaction = new Transaction({
      userId,
      type: "credit",
      amount,
      description: "Monthly Salary",
      date: effectiveFrom,
    });
    await transaction.save();

    res.json(salary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSalaryHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await Salary.find({ userId }).sort({ effectiveFrom: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
