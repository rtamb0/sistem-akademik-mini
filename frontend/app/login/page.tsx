"use client";

import { useState } from "react";
import { saveAuth } from "@/lib/auth";
import { loginAccount } from "@/lib/api/auth";
import { requestPasswordResetByUser } from "@/lib/api/user";
import { withBasePath } from "../../lib/base-path";

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
        window.location.href = withBasePath("/dashboard/mahasiswa");
      } else {
        window.location.href = withBasePath("/dashboard/user");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
    }
  };

  const handleResetPassword = () => {
    const email = prompt("Masukkan email Anda untuk mereset password:")?.trim();
    if (email) {
      requestPasswordResetByUser(email)
        .then((result) => {
          alert(
            result.message || "Link reset password telah dikirim ke email Anda",
          );
        })
        .catch((err) => {
          alert(
            err instanceof Error
              ? err.message
              : "Gagal mengirim link reset password",
          );
        });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div className="p-4 bg-dark text-white w-100">
        <h1 className="text-center">Sistem Akademik Mini</h1>
      </div>
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card p-5">
          <h2 className="text-center">Login</h2>
          {error && <p className="text-danger text-center">{error}</p>}
          <form onSubmit={handleLogin}>
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
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <input
                type="password"
                value={password}
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-2"
              style={{ width: "100%" }}
            >
              Login
            </button>
          </form>
          <p className="mt-2" style={{ textAlign: "center" }}>
            Forgot your password?
            <a onClick={handleResetPassword} className="btn btn-link">
              Reset it here
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
