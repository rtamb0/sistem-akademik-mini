"use client";

import { FormEvent, useEffect, useState } from "react";
import { User, UserInput } from "@/lib/type";

type Props = {
  selectedUser: User | null;
  onSubmit: (payload: UserInput) => Promise<void>;
  onCancelEdit: () => void;
  onCloseForm?: () => void;
};

const initialForm: UserInput = {
  name: "",
  email: "",
  password: "",
  role: "viewer",
};

export default function UserForm({
  selectedUser,
  onSubmit,
  onCancelEdit,
  onCloseForm,
}: Props) {
  const [form, setForm] = useState<UserInput>(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setForm({
        name: selectedUser.name,
        email: selectedUser.email,
        password: "",
        role: selectedUser.role,
      });
    } else {
      setForm(initialForm);
    }
  }, [selectedUser]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      console.log("Submitting form:", form);
      await onSubmit(form);
      setForm(initialForm);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3">
      <h2>{selectedUser ? "Edit User" : "Tambah User"}</h2>
      <div className="row row-cols-2 g-3">
        <div>
          <label className="form-label" htmlFor="nama">
            Nama
          </label>
          <input
            className="form-control"
            id="nama"
            value={form.name}
            onChange={(event) =>
              setForm({
                ...form,
                name: event.target.value,
              })
            }
            placeholder="Nama user"
            required
          />
        </div>

        <div>
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={(event) =>
              setForm({
                ...form,
                email: event.target.value,
              })
            }
            className="form-control"
            placeholder="Email user"
            autoComplete="one-time-code"
            required
          />
        </div>

        {selectedUser === null && (
          <div>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={(event) =>
                setForm({
                  ...form,
                  password: event.target.value,
                })
              }
              className="form-control"
              placeholder="Password"
              autoComplete="new-password"
              required
            />
          </div>
        )}

        <div>
          <label className="form-label" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            value={form.role}
            onChange={(event) =>
              setForm({
                ...form,
                role: event.target.value,
              })
            }
            className="form-select"
            required
          >
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div className="mt-3 d-flex gap-2 align-items-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading
              ? "Menyimpan..."
              : selectedUser
                ? "Simpan Perubahan"
                : "Tambah User"}
          </button>

          {!selectedUser && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                setForm(initialForm);
                onCloseForm?.();
              }}
            >
              Cancel
            </button>
          )}

          {selectedUser && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={onCancelEdit}
            >
              Batal Edit
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
