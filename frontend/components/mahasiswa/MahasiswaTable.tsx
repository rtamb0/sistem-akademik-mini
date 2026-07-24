"use client";

import { Mahasiswa } from "@/lib/type";
import { useState } from "react";
import { usePermissions } from "@/lib/permission/mahasiswa";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type Props = {
  mahasiswaList: Mahasiswa[];
  prodiList: { id: number; nama: string }[];
  search: string;
  prodiId: string;
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    totalPage: number;
  };
  onEdit: (item: Mahasiswa) => void;
  onDelete: (id: number) => Promise<void>;
  onSearch: (search: string, prodiId: string) => void;
  onChangePage: (page: number) => void;
};

export default function MahasiswaTable({
  mahasiswaList,
  prodiList,
  search,
  prodiId,
  loading,
  pagination,
  onEdit,
  onDelete,
  onSearch,
  onChangePage,
}: Props) {
  const { canEdit, canDelete } = usePermissions();

  const [selectedProdi, setSelectedProdi] = useState(prodiId);
  const [inputSearch, setInputSearch] = useState(search);

  const checkIfMahasiswaListEmpty = mahasiswaList.length === 0;

  return (
    <section className="card p-2" style={{ marginTop: 20 }}>
      <div className="row g-2">
        <div className="col-auto">
          <input
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            placeholder="Cari NIM atau nama"
            className="form-control"
          />
        </div>
        <div className="col-auto">
          <select
            value={selectedProdi}
            onChange={(e) => {
              setSelectedProdi(e.target.value);
            }}
            className="form-select"
          >
            <option value="">Semua Prodi</option>
            {prodiList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama_prodi}
              </option>
            ))}
          </select>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-primary"
            onClick={() => onSearch(inputSearch, selectedProdi)}
          >
            Cari
          </button>
        </div>
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : checkIfMahasiswaListEmpty ? (
        <p>Belum ada data mahasiswa.</p>
      ) : (
        <table className="table table-striped mt-2 mb-2">
          <thead>
            <tr>
              <th>No</th>
              <th>NIM</th>
              <th>Nama</th>
              <th>Prodi</th>
              <th>Angkatan</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {mahasiswaList.map((item, index) => (
              <tr key={item.id}>
                <td>
                  {pagination.page === 1
                    ? index + 1
                    : (pagination.page - 1) * pagination.limit + index + 1}
                </td>
                <td>{item.nim}</td>
                <td
                  style={
                    item.foto ? { display: "flex", alignItems: "center" } : {}
                  }
                >
                  {item.foto && (
                    <img
                      src={
                        item.foto
                          ? `${BACKEND_URL}/uploads/mahasiswa/${item.foto}`
                          : "/avatar-placeholder.png"
                      }
                      alt={item.nama}
                      width={48}
                      height={48}
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "10px",
                      }}
                    />
                  )}
                  {item.nama}
                </td>
                <td>{item.nama_prodi}</td>
                <td>{item.angkatan}</td>
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
