"use client";

import { useState } from "react";
import { saveAuth } from "@/lib/auth";
import { loginAccount } from "@/lib/api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setError("");

      const result = await loginAccount(email, password);

      saveAuth(result.token, result.user);

      const role = result.user.role;

      if (role !== "admin") {
        window.location.href = "/dashboard/mahasiswa";
      } else {
        window.location.href = "/dashboard/user";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
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
      <form onSubmit={handleLogin}>
        <h1 style={{ textAlign: "center" }}>Login</h1>
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
          Login
        </button>
      </form>
      <button
        style={{ marginTop: 10 }}
        className="btn btn-secondary"
        onClick={() => (window.location.href = "/register")}
      >
        Don't have an account? Register here.
      </button>
    </div>
  );
}
