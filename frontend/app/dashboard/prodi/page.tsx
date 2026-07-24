"use client";

import { useEffect, useState } from "react";
import {
  createProdi,
  deleteProdi,
  getProdi,
  updateProdi,
} from "@/lib/api/prodi";
import { usePermissions } from "@/lib/permission/prodi";
import { Prodi, ProdiInput } from "@/lib/type";
import ProdiTable from "@/components/prodi/ProdiTable";
import ProdiForm from "@/components/prodi/ProdiForm";

export default function ProdiPage() {
  const [prodi, setProdi] = useState<Prodi[]>([]);
  const [selectedProdi, setSelectedProdi] = useState<Prodi | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [formVisible, setFormVisible] = useState(false);

  const { canCreate } = usePermissions();

  const loadProdi = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getProdi({
        search,
        page,
        limit,
      });

      setProdi(result.data);
      setTotalPage(result.meta.totalPage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data prodi",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProdi();
  }, []);

  const handleSearch = (searchInput: string) => {
    setSearch(searchInput);
    setPage(1);
    loadProdi();
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    loadProdi();
  };

  const handleEdit = (item: Prodi) => {
    setSelectedProdi(item);
    setFormVisible(true);
  };
  const resetParams = () => {
    setSearch("");
    setPage(1);
  };

  const handleSubmit = async (payload: ProdiInput) => {
    try {
      setMessage("");
      setError("");

      if (selectedProdi) {
        await updateProdi(selectedProdi.id, payload);
        setMessage("Data prodi berhasil diperbarui");
      } else {
        await createProdi(payload);
        setMessage("Data prodi berhasil ditambahkan");
      }

      setSelectedProdi(null);
      setFormVisible(false);
      resetParams();
      await loadProdi();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Yakin ingin menghapus data ini?");
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      await deleteProdi(id);
      setMessage("Data prodi berhasil dihapus");
      await loadProdi();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
      throw err;
    }
  };

  return (
    <main className="container">
      <div>
        <h1>Data Prodi</h1>
      </div>

      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}

      {formVisible && (
        <ProdiForm
          selectedProdi={selectedProdi}
          prodi={prodi}
          onSubmit={handleSubmit}
          onCancelEdit={() => {
            setSelectedProdi(null);
            setFormVisible(false);
          }}
          onCloseForm={() => setFormVisible(false)}
        />
      )}

      {canCreate && (
        <button
          style={{ marginTop: 20 }}
          className="btn btn-primary"
          onClick={() => {
            setSelectedProdi(null);
            setFormVisible(true);
          }}
        >
          Tambah Prodi
        </button>
      )}

      <ProdiTable
        prodiList={prodi}
        search={search}
        loading={loading}
        pagination={{ page, totalPage }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
        onChangePage={handleChangePage}
      />
    </main>
  );
}
