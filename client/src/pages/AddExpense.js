// AddExpense.js
import React, { useState } from "react";
import { addTransaction } from "../services/api";

function AddExpense({ userId, onAdded }) {
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTransaction({ userId, type: "debit", amount, description: desc, date });
    alert("✅ Expense Added");
    setAmount("");
    setDesc("");
    setDate("");
    if (onAdded) onAdded(); // refresh dashboard
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Expense</h2>
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      <input type="text" placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <button type="submit">Save</button>
    </form>
  );
}

export default AddExpense;
