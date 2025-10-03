import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL + "/api" });

// ===== Salary =====
export const addSalary = (data) => API.post("/salary", data);
export const getSalaryHistory = (userId) => API.get(`/salary/${userId}`);

// ===== Transactions =====
export const addTransaction = (data) => API.post("/transactions", data);
export const updateTransaction = (id, data) => API.put(`/transactions/${id}`, data);
export const getTransactions = (userId) => API.get(`/transactions/user/${userId}`);
export const getMonthlySummary = (userId) => API.get(`/transactions/summary/${userId}`);
