import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function ExpenseBreakdownPage({ expenseBreakdownCharts }) {
  return (
    <div>
      <h2 className="stylish-title">Expense Breakdown by Category for Each Salary Month</h2>
      {expenseBreakdownCharts.length > 0 ? (
        expenseBreakdownCharts.map(({ key, label, data }) => (
          <div key={key} className="stylish-card">
            <h3 style={{ color: '#4f8cff', marginBottom: '1rem' }}>{label}</h3>
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
    </div>
    );
  }
