import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

export const addTransaction = async (req, res) => {
  try {
    const { userId, type, amount, description, date } = req.body;
    const tx = new Transaction({ userId, type, amount, description, date });
    await tx.save();
    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Transaction.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMonthlySummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const summary = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" }, type: "$type" },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all transactions for a user
export const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ userId }).sort({ date: 1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};