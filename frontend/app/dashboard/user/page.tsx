"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  createUser,
  deleteUser,
  getUsers,
  resetPasswordByAdmin,
  updateUser,
} from "@/lib/api/user";
import { logoutAccount } from "@/lib/api/auth";
import { getToken, getUser, logout } from "@/lib/auth";
import { User } from "@/lib/type";

type UserForm = {
  name: string;
  email: string;
  password: string;
  role: string;
};

const initialForm: UserForm = {
  name: "",
  email: "",
  password: "",
  role: "viewer",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<UserForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getUsers();
      setUsers(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data user",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setFormVisible(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");
      setError("");

      if (!form.name || !form.email || !form.role) {
        setError("Nama, email, dan role wajib diisi");
        return;
      }

      if (editingId === null && !form.password) {
        setError("Password wajib diisi untuk user baru");
        return;
      }

      if (editingId !== null) {
        await updateUser(editingId, {
          name: form.name,
          email: form.email,
          role: form.role,
        });

        setMessage("User berhasil diperbarui");
      } else {
        await createUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });

        setMessage("User berhasil ditambahkan");
      }

      resetForm();
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setMessage("");
    setError("");
    setFormVisible(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Yakin ingin menghapus user ini?");

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deleteUser(id);
      setMessage("User berhasil dihapus");

      if (editingId === id) {
        resetForm();
      }

      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus user");
    }
  };

  const handleResetPassword = async (id: number) => {
    const confirmed = window.confirm("Yakin ingin mereset password user ini?");

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const result = await resetPasswordByAdmin(id);

      if (result.temporaryPassword) {
        window.alert(`Password sementara: ${result.temporaryPassword}`);
      }

      setMessage(result.message || "Password berhasil direset");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mereset password user",
      );
    }
  };

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1>Manajemen User</h1>
          <p>Halaman CRUD user khusus untuk admin.</p>
        </div>
      </div>

      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <button
        type="button"
        className="btn btn-primary"
        style={{ marginTop: 20 }}
        onClick={() => {
          setEditingId(null);
          setForm(initialForm);
          setMessage("");
          setError("");
          setFormVisible(true);
        }}
      >
        Tambah User
      </button>

      {formVisible && (
        <section className="card" style={{ marginTop: 20 }}>
          <h2>{editingId !== null ? "Edit User" : "Tambah User"}</h2>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gap: 12,
                maxWidth: 500,
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
                <label>Nama</label>
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  placeholder="Nama user"
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
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      email: event.target.value,
                    })
                  }
                  placeholder="Email user"
                />
              </div>

              {editingId === null && (
                <div
                  className="form-group"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                  }}
                >
                  <label>Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        password: event.target.value,
                      })
                    }
                    placeholder="Password"
                  />
                </div>
              )}

              <div
                className="form-group"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <label>Role</label>
                <select
                  value={form.role}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      role: event.target.value,
                    })
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="operator">Operator</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? "Menyimpan..."
                    : editingId !== null
                      ? "Simpan Perubahan"
                      : "Tambah User"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Batal
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      <section className="card" style={{ marginTop: 20 }}>
        <h2>Daftar User</h2>

        {loading ? (
          <p>Memuat data...</p>
        ) : users.length === 0 ? (
          <p>Belum ada data user.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              className="table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={{ padding: 10, textAlign: "left" }}>ID</th>
                  <th style={{ padding: 10, textAlign: "left" }}>Nama</th>
                  <th style={{ padding: 10, textAlign: "left" }}>Email</th>
                  <th style={{ padding: 10, textAlign: "left" }}>Role</th>
                  <th style={{ padding: 10, textAlign: "left" }}>
                    Tanggal Dibuat
                  </th>
                  <th style={{ padding: 10, textAlign: "left" }}>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ padding: 10 }}>{user.id}</td>
                    <td style={{ padding: 10 }}>{user.name}</td>
                    <td style={{ padding: 10 }}>{user.email}</td>
                    <td style={{ padding: 10 }}>{user.role}</td>
                    <td style={{ padding: 10 }}>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td style={{ padding: 10 }}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-warning"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDelete(user.id)}
                        >
                          Hapus
                        </button>

                        <button
                          type="button"
                          className="btn btn-info"
                          onClick={() => handleResetPassword(user.id)}
                        >
                          Reset Password
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
