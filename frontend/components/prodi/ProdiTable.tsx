"use client";

import { useState } from "react";
import { usePermissions } from "@/lib/permission/prodi";
import { Prodi } from "@/lib/type";

type Props = {
  prodiList: Prodi[];
  search: string;
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    totalPage: number;
  };
  onEdit: (item: Prodi) => void;
  onDelete: (id: number) => Promise<void>;
  onSearch: (search: string) => void;
  onChangePage: (page: number) => void;
};

export default function ProdiTable({
  prodiList,
  search,
  loading,
  pagination,
  onEdit,
  onDelete,
  onSearch,
  onChangePage,
}: Props) {
  const { canEdit, canDelete } = usePermissions();

  const [inputSearch, setInputSearch] = useState(search);

  const checkIfProdiListEmpty = prodiList.length === 0;

  return (
    <section className="card p-2" style={{ marginTop: 20 }}>
      <div className="row g-2">
        <div className="col-auto">
          <input
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            placeholder="Cari kode atau nama prodi"
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
      ) : checkIfProdiListEmpty ? (
        <p>Belum ada data prodi.</p>
      ) : (
        <table className="table table-striped mt-2 mb-2">
          <thead>
            <tr>
              <th>No</th>
              <th>Kode Prodi</th>
              <th>Nama Prodi</th>
              <th>Created At</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {prodiList.map((item, index) => (
              <tr key={item.id}>
                <td>
                  {pagination.page === 1
                    ? index + 1
                    : (pagination.page - 1) * pagination.limit + index + 1}
                </td>
                <td>{item.kode_prodi}</td>
                <td>{item.nama_prodi}</td>
                <td>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString("id-ID")
                    : "-"}
                </td>
                <td>
                  <div className="d-flex gap-2">
                    {canEdit && (
                      <button
                        className="btn btn-warning"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </button>
                    )}

                    {canDelete && (
                      <button
                        className="btn btn-danger"
                        onClick={() => onDelete(item.id)}
                      >
                        Hapus
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
