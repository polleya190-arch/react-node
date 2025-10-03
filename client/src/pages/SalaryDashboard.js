// client/src/pages/SalaryDashboard.js
import React, { useEffect, useState } from "react";
import {
  getSalaryHistory,
  getMonthlySummary,
  getTransactions,
  updateTransaction,
} from "../services/api";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import AddSalary from "./AddSalary";
import AddExpense from "./AddExpense";
import "./../styles/SalaryDashboard.css";

function SalaryDashboard({ userId }) {
  // ...existing code...
  // State declarations (must be at the top)
  const [history, setHistory] = useState([]);
  const [latestSalary, setLatestSalary] = useState(null);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [summaryData, setSummaryData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Debug: Log transactions to verify data
  useEffect(() => {
    console.log('Transactions:', transactions);
  }, [transactions]);

  // 1️⃣ Fetch all dashboard data
  const fetchData = async () => {
    try {
      // Salary history
      const salaryRes = await getSalaryHistory(userId);
      setHistory(salaryRes.data);
      if (salaryRes.data.length > 0) {
        setLatestSalary(salaryRes.data[salaryRes.data.length - 1]);
      }

      // Transactions
      const txRes = await getTransactions(userId);
      setTransactions(txRes.data);
      const credits = txRes.data.filter((t) => t.type === "credit");
      if (credits.length > 0) {
        const last = credits[credits.length - 1];
        setLastTransaction(last);
        setEditAmount(last.amount);
        setEditDescription(last.description);
      }

      // Monthly summary
      const summaryRes = await getMonthlySummary(userId);
      const formatted = [];
      summaryRes.data.forEach((item) => {
        const key = `${item._id.month}-${item._id.year}`;
        let record = formatted.find((f) => f.name === key);
        if (!record) {
          record = { name: key, salary: 0, expenses: 0, savings: 0 };
          formatted.push(record);
        }
        if (item._id.type === "credit") record.salary += item.total;
        if (item._id.type === "debit") record.expenses += item.total;
        record.savings = record.salary - record.expenses;
      });
      setSummaryData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  // 2️⃣ Initial fetch
  useEffect(() => {
    fetchData();
  }, [userId]);

  // 3️⃣ Edit last salary transaction
  const handleEditTransaction = async (e) => {
    e.preventDefault();
    try {
      await updateTransaction(lastTransaction._id, { amount: editAmount, description: editDescription });
      alert("✅ Salary transaction updated");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("❌ Error updating transaction");
    }
  };

  // 4️⃣ Prepare data for Salary vs Expenses vs Savings (Histogram)
  const barData = summaryData.map((item) => ({
    name: item.name,
    Salary: item.salary,
    Expenses: item.expenses,
    Savings: item.savings,
  }));

  // 5️⃣ Prepare expense breakdown for every salary month
  // Find months with salary credit transactions
  const salaryCreditMonths = transactions
    .filter((t) => t.type === "credit")
    .map((t) => {
      const date = new Date(t.date);
      return {
        key: `${date.getMonth() + 1}-${date.getFullYear()}`,
        label: `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      };
    });

  // Remove duplicate months
  const uniqueSalaryMonths = Array.from(
    new Map(salaryCreditMonths.map((m) => [m.key, m])).values()
  );

  // Group expenses by month and category for salary credit months
  const allCategories = Array.from(new Set(
    transactions.filter((t) => t.type === "debit").map((t) => t.description || "Other")
  ));

  const expenseBreakdownCharts = uniqueSalaryMonths.map(({ key, label, month, year }) => {
    const breakdown = {};
    transactions.forEach((t) => {
      if (t.type === "debit") {
        const tDate = new Date(t.date);
        if (tDate.getMonth() + 1 === month && tDate.getFullYear() === year) {
          const cat = t.description || "Other";
          breakdown[cat] = (breakdown[cat] || 0) + t.amount;
        }
      }
    });
    // Always show all categories, even if zero
    const data = allCategories.map((cat) => ({
      name: cat,
      amount: breakdown[cat] || 0,
    }));
    return { key, label, data };
  });

  return (
    <div className="salary-dashboard">
      {/* Add Salary & Expense */}
      <section className="add-section">
        <AddSalary userId={userId} onAdded={fetchData} />
        <AddExpense userId={userId} onAdded={fetchData} />
      </section>

      {/* Latest Salary */}
      <section className="latest-salary">
        <h2>💰 Latest Salary</h2>
        {latestSalary ? (
          <p>
            ₹{latestSalary.amount} (Effective from {latestSalary.effectiveFrom ? new Date(latestSalary.effectiveFrom).toLocaleDateString() : ""})
          </p>
        ) : (
          <p>No salary history yet.</p>
        )}
      </section>

      {/* Salary History */}
      <section className="salary-history">
        <h2>📜 Salary History</h2>
        {history.length > 0 ? (
          <table border="1" cellPadding="10">
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

      {/* Edit Last Salary Transaction */}
      <section className="edit-salary">
        <h2>✏️ Edit Last Salary Transaction</h2>
        {lastTransaction ? (
          <form onSubmit={handleEditTransaction}>
            <label>Amount:</label>
            <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} required />
            <label>Description:</label>
            <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            <button type="submit">Update</button>
          </form>
        ) : (
          <p>No salary transaction to edit.</p>
        )}
      </section>

      {/* Salary vs Expenses vs Savings Histogram */}
      <section className="salary-chart">
        <h2>📊 Salary vs Expenses vs Savings</h2>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Salary" fill="#4CAF50" />
              <Bar dataKey="Expenses" fill="#F44336" />
              <Bar dataKey="Savings" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No data available for chart.</p>
        )}
      </section>

      {/* Expense Breakdown for Every Salary Month */}
      <section className="expense-breakdown">
        <h2>📊 Expense Breakdown by Category for Each Salary Month</h2>
        {expenseBreakdownCharts.length > 0 ? (
          expenseBreakdownCharts.map(({ key, label, data }) => (
            <div key={key} style={{ marginBottom: "2rem" }}>
              <h3>{label}</h3>
              {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#FF5722" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p>No expense data available for this month.</p>
              )}
            </div>
          ))
        ) : (
          <p>No expense data available.</p>
        )}
      </section>
    </div>
  );
}

export default SalaryDashboard;
