import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  effectiveFrom: { type: Date, required: true }
});

export default mongoose.model("Salary", salarySchema);
