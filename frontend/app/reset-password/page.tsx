"use client";

import { FormEvent, useEffect, useState } from "react";
import { resetPasswordByUser } from "@/lib/api/user";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    setToken(query.get("token") || "");
    setEmail(query.get("email") || "");
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      if (!token) {
        setError("Token reset password tidak ditemukan");
        return;
      }

      if (!email || !password || !confirmPassword) {
        setError("Email, password, dan konfirmasi password wajib diisi");
        return;
      }

      if (password.length < 6) {
        setError("Password minimal 6 karakter");
        return;
      }

      if (password !== confirmPassword) {
        setError("Konfirmasi password tidak sesuai");
        return;
      }

      const result = await resetPasswordByUser(
        email,
        token,
        password,
        confirmPassword,
      );
      alert(result.message || "Password berhasil diubah");
      setPassword("");
      setConfirmPassword("");
      window.location.href = "/login";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <section
        className="card p-4"
        style={{
          width: "100%",
          maxWidth: 420,
        }}
      >
        <h1 style={{ textAlign: "center" }}>Reset Password</h1>

        <p style={{ textAlign: "center" }}>
          Masukkan email dan password baru Anda.
        </p>

        {message && (
          <div className="message" style={{ marginBottom: 15 }}>
            {message}
          </div>
        )}

        {error && (
          <div className="message error" style={{ marginBottom: 15 }}>
            {error}
          </div>
        )}

        {!token && (
          <p style={{ color: "red", textAlign: "center" }}>
            Link reset password tidak valid karena token tidak ditemukan.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              className="form-group"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                className="form-control"
                required
              />
            </div>

            <div
              className="form-group"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <label className="form-label" htmlFor="password">
                Password Baru
              </label>
              <input
                className="form-control"
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password baru"
                required
              />
            </div>

            <div
              className="form-group"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <label className="form-label" htmlFor="confirmPassword">
                Konfirmasi Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Konfirmasi password baru"
                className="form-control"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary btn"
              disabled={loading || !token}
            >
              {loading ? "Mengubah Password..." : "Ubah Password"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
