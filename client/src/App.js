import React from "react";
import SalaryDashboard from "./pages/SalaryDashboard";

function App() {
  const userId = "68dbd28dc2e4ce62fcc282a8"; // Replace with logged-in user

  return (
    <div>
      <h1>Salary & Expenses Tracker</h1>
      
      <SalaryDashboard userId={userId} />
    </div>
  );
}

export default App;
