// AddSalary.js
import React, { useState } from "react";
import { addSalary } from "../services/api";

function AddSalary({ userId, onAdded }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addSalary({ userId, amount, effectiveFrom: date });
    alert("✅ Salary Added");
    setAmount("");
    setDate("");
    if (onAdded) onAdded(); // refresh dashboard
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Salary</h2>
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <button type="submit">Save</button>
    </form>
  );
}

export default AddSalary;
