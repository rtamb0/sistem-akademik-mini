"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MahasiswaForm from "@/components/MahasiswaForm";
import MahasiswaTable from "@/components/MahasiswaTable";
import {
  createMahasiswa,
  getAllProdi,
  getMahasiswa,
  Mahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
  logoutAccount,
} from "@/lib/api";
import { getToken, getUser, logout } from "@/lib/auth";

export default function MahasiswaPage() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [prodi, setProdi] = useState<{ id: number; nama: string }[]>([]);
  const [search, setSearch] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  const role = user?.role;
  const canCreate = role === "admin" || role === "operator";

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }
    const user = getUser();
    setUser(user);
  }, []);

  const loadMahasiswa = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getMahasiswa({
        search,
        prodi_id: prodiId,
        page,
        limit,
      });

      setMahasiswa(result.data);
      setTotalPage(result.meta.totalPage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data mahasiswa",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadProdi = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getAllProdi();
      setProdi(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data prodi",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMahasiswa();
    loadProdi();
  }, []);

  const handleSearch = (searchInput: string, prodiInput: string) => {
    setSearch(searchInput);
    setProdiId(prodiInput);
    setPage(1);
    loadMahasiswa();
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    loadMahasiswa();
  };

  const handleEdit = (item: Mahasiswa) => {
    setSelectedMahasiswa(item);
    setFormVisible(true);
  };
  const resetParams = () => {
    setSearch("");
    setProdiId("");
    setPage(1);
  };

  const handleSubmit = async (payload: MahasiswaInput) => {
    try {
      setMessage("");
      setError("");

      const formData = new FormData();

      formData.append("nim", payload.nim);
      formData.append("nama", payload.nama);
      formData.append("prodi_id", payload.prodi);
      formData.append("angkatan", String(payload.angkatan));

      if (payload.file instanceof File) {
        formData.append("foto", payload.file);
      }

      if (selectedMahasiswa) {
        await updateMahasiswa(selectedMahasiswa.id, formData);
        setMessage("Data mahasiswa berhasil diperbarui");
      } else {
        await createMahasiswa(formData);
        setMessage("Data mahasiswa berhasil ditambahkan");
      }

      setSelectedMahasiswa(null);
      setFormVisible(false);
      resetParams();
      await loadMahasiswa();
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
      await deleteMahasiswa(id);
      setMessage("Data mahasiswa berhasil dihapus");
      await loadMahasiswa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
      throw err;
    }
  };

  const handleLogout = async () => {
    const confirmed = window.confirm("Yakin ingin logout?");
    if (confirmed) {
      await logoutAccount();
      logout();
      window.location.href = "/login";
    }
  };

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1>CRUD Data Mahasiswa</h1>
          <p>Frontend Next.js yang terhubung ke backend Express.js.</p>
        </div>

        <div>
          <div>
            <p>Welcome, {user?.name || "User"}</p>
          </div>
          <button className="btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}

      {formVisible && (
        <MahasiswaForm
          selectedMahasiswa={selectedMahasiswa}
          prodi={prodi}
          onSubmit={handleSubmit}
          onCancelEdit={() => {
            setSelectedMahasiswa(null);
            setFormVisible(false);
          }}
          onCloseForm={() => setFormVisible(false)}
        />
      )}

      {canCreate && (
        <button
          style={{ marginTop: 20 }}
          className="btn-primary"
          onClick={() => {
            setSelectedMahasiswa(null);
            setFormVisible(true);
          }}
        >
          Tambah Mahasiswa
        </button>
      )}

      <MahasiswaTable
        mahasiswaList={mahasiswa}
        prodiList={prodi}
        search={search}
        prodiId={prodiId}
        loading={loading}
        pagination={{ page, totalPage }}
        totalPage={totalPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
        onChangePage={handleChangePage}
      />
    </main>
  );
}
