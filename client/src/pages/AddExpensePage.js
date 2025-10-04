import React from "react";
import AddExpense from "./AddExpense";

export default function AddExpensePage({ userId, onAdded }) {
  return (
    <div>
      <h2>Add Expense</h2>
      <AddExpense userId={userId} onAdded={onAdded} />
    </div>
  );
}
