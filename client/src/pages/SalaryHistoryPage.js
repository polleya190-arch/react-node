import React from "react";

export default function SalaryHistoryPage({ history }) {
  return (
    <section className="stylish-section">
      <h2 className="stylish-title">Salary History</h2>
      {history.length > 0 ? (
        <table className="stylish-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Effective From</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item._id}>
                <td>₹{item.amount}</td>
                <td>{new Date(item.effectiveFrom).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No salary records found.</p>
      )}
    </section>
  );
}
