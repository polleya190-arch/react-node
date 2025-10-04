import React from "react";

export default function LatestSalaryPage({ latestSalary }) {
  return (
    <div className="stylish-card">
      <h2 className="stylish-title">Latest Salary</h2>
      {latestSalary ? (
        <p>
          ₹{latestSalary.amount} (Effective from {latestSalary.effectiveFrom ? new Date(latestSalary.effectiveFrom).toLocaleDateString() : ""})
        </p>
      ) : (
        <p>No salary history yet.</p>
      )}
    </div>
  );
}
