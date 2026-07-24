"use client";

import { useState } from "react";
import { registerAccount } from "@/lib/api/auth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setError("");

      await registerAccount(name, email, password);

      window.location.href = "/login";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleRegister}>
        <h1 style={{ textAlign: "center" }}>Register</h1>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <div
          className="form-group"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "300px",
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          Register
        </button>
      </form>
      <button
        style={{ marginTop: 10 }}
        className="btn btn-secondary"
        onClick={() => (window.location.href = "/login")}
      >
        Already have an account? Login here.
      </button>
    </div>
  );
}
