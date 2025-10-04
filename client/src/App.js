
import React, { useState } from "react";
import "./styles/Stylish.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SalaryDashboard from "./pages/SalaryDashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AddSalaryPage from "./pages/AddSalaryPage";
import AddExpensePage from "./pages/AddExpensePage";
import LatestSalaryPage from "./pages/LatestSalaryPage";
import SalaryHistoryPage from "./pages/SalaryHistoryPage";
import EditSalaryPage from "./pages/EditSalaryPage";
import SalaryChartPage from "./pages/SalaryChartPage";
import ExpenseBreakdownPage from "./pages/ExpenseBreakdownPage";
import { getSalaryHistory, getMonthlySummary, getTransactions, updateTransaction } from "./services/api";

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [history, setHistory] = useState([]);
  const [latestSalary, setLatestSalary] = useState(null);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [summaryData, setSummaryData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Fetch all dashboard data
  const fetchData = async () => {
    if (!userId) return;
    try {
      const salaryRes = await getSalaryHistory(userId);
      setHistory(salaryRes.data);
      if (salaryRes.data.length > 0) {
        setLatestSalary(salaryRes.data[salaryRes.data.length - 1]);
      }
      const txRes = await getTransactions(userId);
      setTransactions(txRes.data);
      const credits = txRes.data.filter((t) => t.type === "credit");
      if (credits.length > 0) {
        const last = credits[credits.length - 1];
        setLastTransaction(last);
        setEditAmount(last.amount);
        setEditDescription(last.description);
      }
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

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [userId]);

  // Prepare data for Salary vs Expenses vs Savings (Histogram)
  const barData = summaryData.map((item) => ({
    name: item.name,
    Salary: item.salary,
    Expenses: item.expenses,
    Savings: item.savings,
  }));

  // Prepare expense breakdown for every salary month
  const salaryMonths = history.map((item) => {
    const date = new Date(item.effectiveFrom);
    return {
      key: `${date.getMonth() + 1}-${date.getFullYear()}`,
      label: `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  });
  const expenseBreakdownCharts = salaryMonths.map(({ key, label, month, year }) => {
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
    const data = Object.keys(breakdown).map((cat) => ({
      name: cat,
      amount: breakdown[cat],
    }));
    return { key, label, data };
  });

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

  const handleLogout = () => {
    localStorage.clear();
    setUserId(null);
  };

  function Logout() {
    React.useEffect(() => {
      handleLogout();
      window.location.replace("/login");
    }, []);
    return null;
  }

  return (
    <Router>
      <div className="stylish-container">
        <h1 className="stylish-title">Salary & Expenses Tracker</h1>
        <nav className="navbar">
          {userId ? (
            <>
              <a href="/dashboard">Dashboard</a>
              <a href="/add-salary">Add Salary</a>
              <a href="/add-expense">Add Expense</a>
              <a href="/latest-salary">Latest Salary</a>
              <a href="/salary-history">Salary History</a>
              <a href="/edit-salary">Edit Salary</a>
              <a href="/salary-chart">Salary Chart</a>
              <a href="/expense-breakdown">Expense Breakdown</a>
              <button onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <a href="/login">Sign In</a>
              <a href="/register">Register</a>
            </>
          )}
        </nav>
        <Routes>
          <Route path="/" element={userId ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLoggedIn={id => { setUserId(id); }} />} />
          <Route path="/register" element={<Register onRegistered={() => window.location.replace('/login')} />} />
          <Route path="/dashboard" element={userId ? (
            <SalaryDashboard userId={userId} />
          ) : (<Navigate to="/login" />)} />
          <Route path="/add-salary" element={userId ? <AddSalaryPage userId={userId} onAdded={fetchData} /> : <Navigate to="/login" />} />
          <Route path="/add-expense" element={userId ? <AddExpensePage userId={userId} onAdded={fetchData} /> : <Navigate to="/login" />} />
          <Route path="/latest-salary" element={userId ? <LatestSalaryPage latestSalary={latestSalary} /> : <Navigate to="/login" />} />
          <Route path="/salary-history" element={userId ? <SalaryHistoryPage history={history} /> : <Navigate to="/login" />} />
          <Route path="/edit-salary" element={userId ? <EditSalaryPage lastTransaction={lastTransaction} editAmount={editAmount} editDescription={editDescription} setEditAmount={setEditAmount} setEditDescription={setEditDescription} handleEditTransaction={handleEditTransaction} /> : <Navigate to="/login" />} />
          <Route path="/salary-chart" element={userId ? <SalaryChartPage barData={barData} /> : <Navigate to="/login" />} />
          <Route path="/expense-breakdown" element={userId ? <ExpenseBreakdownPage expenseBreakdownCharts={expenseBreakdownCharts} /> : <Navigate to="/login" />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
