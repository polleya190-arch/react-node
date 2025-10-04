import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function SalaryChartPage({ barData }) {
  return (
    <div className="stylish-card">
      <h2 className="stylish-title">Salary vs Expenses vs Savings</h2>
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
    </div>
  );
}
