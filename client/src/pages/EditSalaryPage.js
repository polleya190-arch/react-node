import React from "react";

export default function EditSalaryPage({ lastTransaction, editAmount, editDescription, setEditAmount, setEditDescription, handleEditTransaction }) {
  return (
    <div>
      <h2>Edit Last Salary Transaction</h2>
      {lastTransaction ? (
  <form className="stylish-form" onSubmit={handleEditTransaction}>
          <label>Amount:</label>
          <input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)} required />
          <label>Description:</label>
          <input type="text" value={editDescription} onChange={e => setEditDescription(e.target.value)} />
          <button type="submit">Update</button>
        </form>
      ) : (
        <p>No salary transaction to edit.</p>
      )}
    </div>
  );
}
