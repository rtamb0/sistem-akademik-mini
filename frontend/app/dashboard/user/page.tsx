"use client";

import { useEffect, useState } from "react";
import {
  createUser,
  deleteUser,
  getUsers,
  resetPasswordByAdmin,
  updateUser,
} from "@/lib/api/user";
import { User, UserInput } from "@/lib/type";
import UserTable from "@/components/user/UserTable";
import UserForm from "@/components/user/UserForm";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const loadUsers = async (
    searchValue: string = search,
    pageValue: number = page,
  ) => {
    try {
      setLoading(true);
      setError("");

      const result = await getUsers({
        search: searchValue,
        page: pageValue,
        limit,
      });

      setUsers(result.data);
      setTotalPage(result.meta.totalPage);
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

  const handleSearch = (searchInput: string) => {
    setSearch(searchInput);
    setPage(1);
    loadUsers(searchInput, 1);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    loadUsers(search, newPage);
  };

  const resetParams = () => {
    setSearch("");
    setPage(1);
  };

  const handleSubmit = async (payload: UserInput) => {
    try {
      setMessage("");
      setError("");

      if (selectedUser) {
        await updateUser(selectedUser.id, payload);
        setMessage("User berhasil diperbarui");
      } else {
        await createUser(payload);
        setMessage("User berhasil ditambahkan");
      }

      setSelectedUser(null);
      setFormVisible(false);
      resetParams();
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan user");
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
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

      if (selectedUser && selectedUser.id === id) {
        setSelectedUser(null);
        setFormVisible(false);
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
          <h1>Data User</h1>
        </div>
      </div>

      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}

      {formVisible && (
        <UserForm
          selectedUser={selectedUser}
          onSubmit={handleSubmit}
          onCancelEdit={() => {
            setSelectedUser(null);
            setFormVisible(false);
          }}
          onCloseForm={() => setFormVisible(false)}
        />
      )}

      <button
        type="button"
        className="btn btn-primary"
        style={{ marginTop: 20 }}
        onClick={() => {
          setSelectedUser(null);
          setFormVisible(true);
        }}
      >
        Tambah User
      </button>

      <UserTable
        userList={users}
        loading={loading}
        search={search}
        pagination={{ page, totalPage }}
        onSearch={handleSearch}
        onChangePage={handleChangePage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onResetPassword={handleResetPassword}
      />
    </main>
  );
}
