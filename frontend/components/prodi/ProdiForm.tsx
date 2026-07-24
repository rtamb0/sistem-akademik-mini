"use client";

import { Prodi, ProdiInput } from "@/lib/type";
import { FormEvent, useEffect, useState } from "react";

type Props = {
  selectedProdi: Prodi | null;
  onSubmit: (payload: ProdiInput) => Promise<void>;
  onCancelEdit: () => void;
  onCloseForm?: () => void;
};

const initialForm: ProdiInput = {
  kode_prodi: "",
  nama_prodi: "",
};

export default function ProdiForm({
  selectedProdi,
  onSubmit,
  onCancelEdit,
  onCloseForm,
}: Props) {
  const [form, setForm] = useState<ProdiInput>(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProdi) {
      setForm({
        kode_prodi: selectedProdi.kode_prodi,
        nama_prodi: selectedProdi.nama_prodi,
      });
    } else {
      setForm(initialForm);
    }
  }, [selectedProdi]);

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
      <h2>{selectedProdi ? "Edit Prodi" : "Tambah Prodi"}</h2>

      <div className="row row-cols-2 g-3">
        <div>
          <label className="form-label" htmlFor="kode_prodi">
            Kode Prodi
          </label>
          <input
            id="kode_prodi"
            className="form-control"
            value={form.kode_prodi}
            onChange={(e) => setForm({ ...form, kode_prodi: e.target.value })}
            placeholder="Contoh: TI"
            required
          />
        </div>

        <div>
          <label className="form-label" htmlFor="nama_prodi">
            Nama Prodi
          </label>
          <input
            id="nama_prodi"
            className="form-control"
            value={form.nama_prodi}
            onChange={(e) => setForm({ ...form, nama_prodi: e.target.value })}
            placeholder="Nama prodi"
            required
          />
        </div>
      </div>

      <div className="mt-3 d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Menyimpan..." : selectedProdi ? "Update" : "Simpan"}
        </button>
        {!selectedProdi && (
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

        {selectedProdi && (
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
