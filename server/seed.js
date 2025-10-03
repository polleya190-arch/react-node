import mongoose from "mongoose";
import dotenv from "dotenv";
import Salary from "./models/Salary.js";
import Transaction from "./models/Transaction.js";

dotenv.config();

const userId = new mongoose.Types.ObjectId(); // Dummy user

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected");

    // Clear old data
    await Salary.deleteMany({});
    await Transaction.deleteMany({});

    // Insert salary history
    const salaries = await Salary.insertMany([
      { userId, amount: 30000, effectiveFrom: new Date("2024-01-01") },
      { userId, amount: 35000, effectiveFrom: new Date("2024-07-01") },
    ]);

    // Insert sample salary credit transactions
    const salaryTx = [
      {
        userId,
        type: "credit",
        amount: 30000,
        description: "Monthly Salary",
        date: new Date("2024-02-01"),
      },
      {
        userId,
        type: "credit",
        amount: 35000,
        description: "Monthly Salary",
        date: new Date("2024-08-01"),
      },
    ];

    // Insert sample expenses
    const expenses = [
      {
        userId,
        type: "debit",
        amount: 1200,
        description: "Groceries",
        date: new Date("2024-02-05"),
      },
      {
        userId,
        type: "debit",
        amount: 5000,
        description: "Rent",
        date: new Date("2024-02-01"),
      },
      {
        userId,
        type: "debit",
        amount: 800,
        description: "Transport",
        date: new Date("2024-02-10"),
      },
    ];

    await Transaction.insertMany([...salaryTx, ...expenses]);

    console.log("🌱 Seed data inserted successfully");
    console.log("👉 Use this dummy userId in frontend:", userId.toString());

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  }
}

seed();
