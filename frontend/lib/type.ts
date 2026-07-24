export type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  prodi_id: number;
  nama_prodi: string;
  angkatan: number;
  foto?: string | null;
};

export type MahasiswaInput = {
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  file: File | null;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
};

export type UserInput = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export type Prodi = {
  id: number;
  nama_prodi: string;
  kode_prodi: string;
  created_at?: string;
};

export type ProdiInput = {
  nama_prodi: string;
  kode_prodi: string;
};
