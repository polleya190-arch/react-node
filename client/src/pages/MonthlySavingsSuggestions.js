import React, { useState } from "react";
import { getGeminiSuggestions } from "../services/api";

export default function MonthlySavingsSuggestions({ monthlyData }) {
  const [suggestions, setSuggestions] = useState({});
  const [loading, setLoading] = useState({});

  // You need to pass salaryHistory, monthlySummary, transactions from parent
  // For demo, we use monthlyData for monthlySummary and assume salaryHistory/transactions are available globally
  const fetchSuggestion = async (monthKey, monthInfo) => {
    setLoading((prev) => ({ ...prev, [monthKey]: true }));
    try {
      // Format label as 'January 2025' if possible
      let label = monthInfo.label;
      if (/^\d{1,2}-\d{4}$/.test(label)) {
        const [m, y] = label.split('-');
        const date = new Date(y, m - 1);
        label = date.toLocaleString('default', { month: 'long' }) + ' ' + y;
      }
      // Format expense breakdown for backend
      // You should pass these as props from SalaryDashboard for full context
      const salaryHistory = window.salaryHistory || [];
      const monthlySummary = monthlyData.map(m => ({
        ...m,
        label: m.label,
        expenseBreakdown: m.expenseBreakdown // send as object, let backend format
      }));
      const transactions = window.transactions || [];

      const res = await getGeminiSuggestions({
        salaryHistory,
        monthlySummary,
        transactions
      });
      setSuggestions((prev) => ({ ...prev, [monthKey]: res.data.suggestion }));
    } catch (err) {
      setSuggestions((prev) => ({ ...prev, [monthKey]: "Error fetching suggestion." }));
    }
    setLoading((prev) => ({ ...prev, [monthKey]: false }));
  };

  return (
    <div className="stylish-section">
      <h2 className="stylish-title">AI Savings Tips (Monthly)</h2>
      {monthlyData.map((month) => (
        <div key={month.key} className="stylish-card">
          <h3 style={{ color: '#4f8cff', marginBottom: '0.5rem' }}>{month.label}</h3>
          <p>Salary: ₹{month.salary} | Expenses: ₹{month.expenses} | Savings: ₹{month.savings}</p>
          <button
            className="stylish-form"
            style={{ width: 'fit-content', marginBottom: '1rem' }}
            onClick={() => fetchSuggestion(month.key, month)}
            disabled={loading[month.key]}
          >
            {loading[month.key] ? "Loading..." : "Get AI Suggestion"}
          </button>
          {suggestions[month.key] && (
            <div className="stylish-card" style={{ background: '#f7faff', border: '2px solid #4f8cff', borderRadius: '12px', padding: '1.5rem', marginTop: '1rem', color: '#222' }}>
              <h3 style={{ color: '#2196F3', marginBottom: '1rem' }}>AI Savings Suggestion</h3>
              {suggestions[month.key].split(/\n|---|###/).map((section, idx) => {
                if (!section.trim()) return null;
                // Headings
                if (section.trim().startsWith('Initial Analysis')) {
                  return <h4 key={idx} style={{ color: '#4f8cff', marginTop: '1.2rem' }}>{section.trim()}</h4>;
                }
                if (section.trim().startsWith('Practical Ways')) {
                  return <h4 key={idx} style={{ color: '#4f8cff', marginTop: '1.2rem' }}>{section.trim()}</h4>;
                }
                if (section.trim().startsWith('Summary of Recommendations')) {
                  return <h4 key={idx} style={{ color: '#43a047', marginTop: '1.2rem' }}>{section.trim()}</h4>;
                }
                // Subheadings
                if (section.trim().startsWith('1.')) {
                  return <h5 key={idx} style={{ color: '#2196F3', marginTop: '1rem' }}>{section.trim()}</h5>;
                }
                if (section.trim().startsWith('2.')) {
                  return <h5 key={idx} style={{ color: '#2196F3', marginTop: '1rem' }}>{section.trim()}</h5>;
                }
                if (section.trim().startsWith('3.')) {
                  return <h5 key={idx} style={{ color: '#2196F3', marginTop: '1rem' }}>{section.trim()}</h5>;
                }
                if (section.trim().startsWith('4.')) {
                  return <h5 key={idx} style={{ color: '#2196F3', marginTop: '1rem' }}>{section.trim()}</h5>;
                }
                // Bullet points
                if (section.trim().startsWith('*')) {
                  return <ul key={idx} style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>{section.trim().split('*').filter(Boolean).map((item, i) => <li key={i} style={{ marginBottom: '0.3rem' }}>{item.trim()}</li>)}</ul>;
                }
                // Paragraphs
                return <p key={idx} style={{ marginBottom: '0.7rem', lineHeight: 1.7 }}>{section.trim()}</p>;
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
