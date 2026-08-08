"use client";

import { useState } from "react";
import { User } from "@/lib/type";

type Props = {
  userList: User[];
  search: string;
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    totalPage: number;
  };
  onEdit: (item: User) => void;
  onDelete: (id: number) => Promise<void>;
  onSearch: (search: string) => void;
  onChangePage: (page: number) => void;
  onResetPassword: (id: number) => Promise<void>;
};

export default function UserTable({
  userList,
  search,
  loading,
  pagination,
  onEdit,
  onDelete,
  onSearch,
  onChangePage,
  onResetPassword,
}: Props) {
  const [inputSearch, setInputSearch] = useState(search);

  const checkIfUserListEmpty = userList.length === 0;

  return (
    <section className="card p-2" style={{ marginTop: 20 }}>
      <div className="row g-2">
        <div className="col-auto">
          <input
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            placeholder="Cari user"
            className="form-control"
          />
        </div>
        <div className="col-auto">
          <button
            className="btn btn-primary"
            onClick={() => onSearch(inputSearch)}
          >
            Cari
          </button>
        </div>
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : checkIfUserListEmpty ? (
        <p>Belum ada data user.</p>
      ) : (
        <table className="table table-striped mt-2 mb-2">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Tanggal Dibuat</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {userList.map((user, index) => (
              <tr key={user.id}>
                <td>
                  {pagination.page === 1
                    ? index + 1
                    : (pagination.page - 1) * pagination.limit + index + 1}
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.created_at
                    ? new Date(user.created_at).toLocaleString("id-ID")
                    : "-"}
                </td>
                <td style={{ padding: 10 }}>
                  <div className="d-flex gap-2">
                    {user.role !== "admin" && (
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() => onEdit(user)}
                      >
                        Edit
                      </button>
                    )}

                    {user.role !== "admin" && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => onDelete(user.id)}
                      >
                        Hapus
                      </button>
                    )}

                    {user.role !== "admin" && (
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={() => onResetPassword(user.id)}
                      >
                        Reset Password
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <button
          disabled={pagination.page <= 1}
          onClick={() => onChangePage(pagination.page - 1)}
          className="btn btn-primary"
        >
          Previous
        </button>
        <span>
          Halaman {pagination.page} dari {pagination.totalPage}
        </span>
        <button
          className="btn btn-primary"
          disabled={pagination.page >= pagination.totalPage}
          onClick={() => onChangePage(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
