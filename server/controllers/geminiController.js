// Utility to list available Gemini models
export async function listGeminiModels() {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Available Gemini models:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error listing Gemini models:', err?.response?.data || err);
    return null;
  }
}
// server/controllers/geminiController.js
import axios from 'axios';

// Utility to build a detailed financial prompt
export function buildFinancialPrompt({ salaryHistory, monthlySummary, transactions }) {
  let prompt = 'Here is my financial summary for the past year:';

  // Salary by month
  if (salaryHistory && salaryHistory.length) {
    prompt += '\nSalary by month:';
    salaryHistory.forEach(s => {
      const date = new Date(s.effectiveFrom);
      const label = date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear();
      if (s.amount !== undefined) {
        prompt += ` ${label} ₹${s.amount},`;
      }
    });
  }

  // Expenses and savings by month
  if (monthlySummary && monthlySummary.length) {
    prompt += '\nExpenses by month:';
    monthlySummary.forEach(m => {
      let label = m.label;
      if (/^\d{1,2}-\d{4}$/.test(label)) {
        const [month, year] = label.split('-');
        const date = new Date(year, month - 1);
        label = date.toLocaleString('default', { month: 'long' }) + ' ' + year;
      }
      if (m.expenses !== undefined) {
        prompt += ` ${label} ₹${m.expenses},`;
      }
    });
    prompt += '\nSavings by month:';
    monthlySummary.forEach(m => {
      let label = m.label;
      if (/^\d{1,2}-\d{4}$/.test(label)) {
        const [month, year] = label.split('-');
        const date = new Date(year, month - 1);
        label = date.toLocaleString('default', { month: 'long' }) + ' ' + year;
      }
      if (m.savings !== undefined) {
        prompt += ` ${label} ₹${m.savings},`;
      }
    });
  }

  // Expense breakdown by category per month
  if (monthlySummary && monthlySummary.length) {
    prompt += '\nExpense breakdown:';
    monthlySummary.forEach(m => {
      let label = m.label;
      if (/^\d{1,2}-\d{4}$/.test(label)) {
        const [month, year] = label.split('-');
        const date = new Date(year, month - 1);
        label = date.toLocaleString('default', { month: 'long' }) + ' ' + year;
      }
      if (m.expenseBreakdown && typeof m.expenseBreakdown === 'object' && Object.keys(m.expenseBreakdown).length > 0) {
        prompt += ` ${label}:`;
        Object.entries(m.expenseBreakdown).forEach(([cat, amt]) => {
          if (amt !== undefined) {
            prompt += ` ${cat} ₹${amt},`;
          }
        });
      }
    });
  }

  prompt += '\nBased on this data, suggest practical ways I can improve my savings next year.';
  return prompt;
}

// Replace with your Gemini API endpoint and key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent';
const GEMINI_API_KEY = 'AIzaSyAulSjthAVvkDUVuN1Ype-qDmUV4qoe3Og';

export async function getSuggestion(req, res) {
  const { salaryHistory, monthlySummary, transactions } = req.body;
  console.log('Gemini request body:', req.body);
  if (!salaryHistory || !monthlySummary || !transactions) {
    console.error('Missing financial data in request body:', req.body);
    return res.status(400).json({ error: 'Missing financial data (salaryHistory, monthlySummary, transactions) in request body.' });
  }
  try {
    const prompt = buildFinancialPrompt({ salaryHistory, monthlySummary, transactions });
    console.log('Gemini prompt:', prompt);
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    console.log('Gemini API response:', response.data);
    const suggestion = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No suggestion available.';
    res.json({ suggestion });
  } catch (err) {
    console.error('Gemini API error:', err?.response?.data || err);
    res.status(500).json({ error: 'Failed to fetch suggestion', details: err?.response?.data || err.message });
  }
}
