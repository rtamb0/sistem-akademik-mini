"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Mahasiswa, MahasiswaInput } from "@/lib/type";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type Props = {
  selectedMahasiswa: Mahasiswa | null;
  onSubmit: (payload: MahasiswaInput) => Promise<void>;
  onCancelEdit: () => void;
  onCloseForm?: () => void;
  prodi: { id: number; nama_prodi: string }[];
};

const initialForm: MahasiswaInput = {
  nim: "",
  nama: "",
  prodi: "",
  angkatan: new Date().getFullYear(),
  file: null,
};

export default function MahasiswaForm({
  selectedMahasiswa,
  onSubmit,
  onCancelEdit,
  onCloseForm,
  prodi,
}: Props) {
  const [form, setForm] = useState<MahasiswaInput>(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMahasiswa) {
      setForm({
        nim: selectedMahasiswa.nim,
        nama: selectedMahasiswa.nama,
        prodi: selectedMahasiswa.prodi_id.toString(),
        angkatan: selectedMahasiswa.angkatan,
        file: null,
      });
    } else {
      setForm(initialForm);
    }
  }, [selectedMahasiswa]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
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
      <h2>{selectedMahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa"}</h2>

      <div className="row row-cols-2 g-3">
        <div>
          <label className="form-label" htmlFor="nim">
            NIM
          </label>
          <input
            id="nim"
            className="form-control"
            value={form.nim}
            onChange={(e) => setForm({ ...form, nim: e.target.value })}
            placeholder="Contoh: 2201001"
            required
          />
        </div>

        <div>
          <label className="form-label" htmlFor="nama">
            Nama
          </label>
          <input
            id="nama"
            className="form-control"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            placeholder="Nama mahasiswa"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="prodi">
            Prodi
          </label>
          <select
            id="prodi"
            className="form-select"
            value={form.prodi}
            onChange={(e) => setForm({ ...form, prodi: e.target.value })}
            required
          >
            <option value="">Pilih Prodi</option>
            {prodi.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama_prodi}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="angkatan">
            Angkatan
          </label>
          <input
            id="angkatan"
            type="number"
            className="form-control"
            value={form.angkatan}
            onChange={(e) =>
              setForm({ ...form, angkatan: Number(e.target.value) })
            }
            required
          />
        </div>

        <div className="d-flex align-items-center gap-2">
          <div>
            <img
              src={
                selectedMahasiswa && selectedMahasiswa.foto
                  ? `${BACKEND_URL}/uploads/mahasiswa/${selectedMahasiswa.foto}`
                  : "/Portrait_Placeholder.png"
              }
              alt="Current Foto"
              width={48}
              height={48}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
          <div>
            <label htmlFor="file">Foto (opsional)</label>
            <input
              id="file"
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setForm({ ...form, file });
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Menyimpan..." : selectedMahasiswa ? "Update" : "Simpan"}
        </button>
        {!selectedMahasiswa && (
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

        {selectedMahasiswa && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={onCancelEdit}
          >
            Batal Edit
          </button>
        )}
      </div>
    </form>
  );
}
