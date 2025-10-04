import React from "react";
import AddSalary from "./AddSalary";

export default function AddSalaryPage({ userId, onAdded }) {
  return (
    <div>
      <h2>Add Salary</h2>
      <AddSalary userId={userId} onAdded={onAdded} />
    </div>
  );
}
