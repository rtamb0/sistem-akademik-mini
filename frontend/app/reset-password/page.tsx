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
  const [success, setSuccess] = useState(false);

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

      setMessage(result.message || "Password berhasil diubah");
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
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
        className="card"
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

        {!success ? (
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
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email"
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
                <label>Password Baru</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password baru"
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
                <label>Konfirmasi Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Konfirmasi password baru"
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !token}
              >
                {loading ? "Mengubah Password..." : "Ubah Password"}
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            className="btn-primary"
            style={{ width: "100%" }}
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Kembali ke Login
          </button>
        )}
      </section>
    </main>
  );
}
