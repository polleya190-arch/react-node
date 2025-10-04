import React, { useState } from "react";
import axios from "axios";

export default function Register({ onRegistered }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("/api/user/register", { username, email, password });
      alert("Registration successful! Please login.");
      onRegistered();
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
  <form className="stylish-form" onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Register</button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  );
}
