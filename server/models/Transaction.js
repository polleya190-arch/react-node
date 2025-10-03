import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  amount: { type: Number, required: true },
  description: String,
  date: { type: Date, required: true },
});

export default mongoose.model("Transaction", transactionSchema);
