"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";

const QuickRegister = ({ onToggleView, redirectTo }) => {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    residentialAddress: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, number, residentialAddress, email, password } = formData;

    if (!name || !number || !email || !password) {
      setError("Name, Mobile, Email and Password are required.");
      return;
    }

    try {
      setLoading(true);

      // Call Registration API
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setError(data.message || "Registration failed.");
        return;
      }

      // 🔥 Auto-Login after successful SignUp
      const loginResult = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });

      setLoading(false);

      if (loginResult.error) {
        setError("Account created but auto-login failed. Please login manually.");
        onToggleView(); // Switch to login view
        return;
      }

      // SUCCESS → Redirect to home
      window.location.href = redirectTo || '/profile';

    } catch (err) {
      console.error("Register Error:", err);
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <p className="auth-error">{error}</p>}

      <input className="detail" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name *" />

      <input className="detail" type="tel" name="number" value={formData.number} onChange={handleChange} placeholder="Mobile Number *" />

      <input className="detail" type="text" name="residentialAddress" value={formData.residentialAddress} onChange={handleChange} placeholder="Residential Address (optional)" />

      <input className="detail" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" />

      <input className="detail" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password *" />

      <button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? "Creating Account..." : "Sign Up"}
      </button>

      <p className="auth-toggle">
        <button type="button" className="toggle-link" onClick={onToggleView}>
          Already on Dailyhouse? Login
        </button>
      </p>
    </form>
  );
};

export default QuickRegister;
