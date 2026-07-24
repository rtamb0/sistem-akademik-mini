"use client";

import { Mahasiswa } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type Props = {
  mahasiswaList: Mahasiswa[];
  prodiList: { id: number; nama: string }[];
  search: string;
  prodiId: string;
  loading: boolean;
  pagination: {
    page: number;
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
  const user = getUser();
  const role = user?.role;
  const canEdit = role === "admin" || role === "operator";
  const canDelete = role === "admin";

  const [selectedProdi, setSelectedProdi] = useState(prodiId);
  const [inputSearch, setInputSearch] = useState(search);

  const checkIfMahasiswaListEmpty = mahasiswaList.length === 0;

  return (
    <section className="card" style={{ marginTop: 20 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <input
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
          placeholder="Cari NIM atau nama"
        />
        <select
          value={selectedProdi}
          onChange={(e) => {
            setSelectedProdi(e.target.value);
          }}
        >
          <option value="">Semua Prodi</option>
          {prodiList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama_prodi}
            </option>
          ))}
        </select>
        <button onClick={() => onSearch(inputSearch, selectedProdi)}>
          Cari
        </button>
      </div>

      <h2>Daftar Mahasiswa</h2>
      {loading ? (
        <p>Memuat data...</p>
      ) : checkIfMahasiswaListEmpty ? (
        <p>Belum ada data mahasiswa.</p>
      ) : (
        <table>
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
                <td>{index + 1}</td>
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
                  <div className="actions">
                    {canEdit && (
                      <button
                        className="btn-secondary"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </button>
                    )}

                    {canDelete && (
                      <button
                        className="btn-danger"
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
        >
          Previous
        </button>
        <span>
          Halaman {pagination.page} dari {pagination.totalPage}
        </span>
        <button
          disabled={pagination.page >= pagination.totalPage}
          onClick={() => onChangePage(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
