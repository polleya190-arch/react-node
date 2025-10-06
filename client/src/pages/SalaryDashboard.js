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
import MonthlySavingsSuggestions from "./MonthlySavingsSuggestions";
import "./../styles/SalaryDashboard.css";

function SalaryDashboard({ userId }) {
  // ...existing code...
  // State declarations (must be at the top)
  const [history, setHistory] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // 1️⃣ Fetch all dashboard data
  useEffect(() => {
    async function fetchData() {
      try {
        const salaryRes = await getSalaryHistory(userId);
        setHistory(salaryRes.data);
        const summaryRes = await getMonthlySummary(userId);
        const txRes = await getTransactions(userId);
        setTransactions(txRes.data);
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
    }
    fetchData();
  }, [userId]);

  // Prepare data for Salary vs Expenses vs Savings (Histogram)
  const barData = summaryData.map((item) => ({
    name: item.name,
    Salary: item.salary,
    Expenses: item.expenses,
    Savings: item.savings,
  }));

  // Prepare monthlyData for AI suggestions
  const monthlyData = summaryData.map((item) => {
    const [month, year] = item.name.split("-");
    const expenseBreakdown = {};
    transactions.forEach((t) => {
      const tDate = new Date(t.date);
      if (
        t.type === "debit" &&
        tDate.getMonth() + 1 === Number(month) &&
        tDate.getFullYear() === Number(year)
      ) {
        const cat = t.description || "Other";
        expenseBreakdown[cat] = (expenseBreakdown[cat] || 0) + t.amount;
      }
    });
    return {
      key: item.name,
      label: item.name,
      salary: item.salary,
      expenses: item.expenses,
      savings: item.savings,
      expenseBreakdown,
    };
  });

  return (
    <div className="stylish-container">
      {/* Salary History */}
      <section className="stylish-section">
        <h2 className="stylish-title">📜 Salary History</h2>
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

      {/* Salary vs Expenses vs Savings Histogram */}
      <section className="stylish-section">
        <h2 className="stylish-title">📊 Salary vs Expenses vs Savings</h2>
        {barData.length > 0 ? (
          <div className="stylish-card">
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
          </div>
        ) : (
          <p>No data available for chart.</p>
        )}
      </section>

      {/* AI Savings Suggestions Monthly */}
      <MonthlySavingsSuggestions monthlyData={monthlyData} />
    </div>
  );
}

export default SalaryDashboard;
