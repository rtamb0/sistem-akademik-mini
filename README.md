# Sistem Akademik Mini

Project ini terdiri dari 2 aplikasi terpisah:

- `backend` = API Express + TypeScript
- `frontend` = Next.js

Frontend berjalan di `http://localhost:3001` dan backend berjalan di `http://localhost:3000`.

## Prasyarat

- Node.js versi yang kompatibel dengan Next.js 16 dan TypeScript project ini
- MySQL
- Database dan tabel sudah disiapkan sesuai schema project backend

## Cara Instalasi

### 1) Backend

Masuk ke folder backend lalu install dependency:

```bash
cd backend
npm install
```

### 2) Frontend

Masuk ke folder frontend lalu install dependency:

```bash
cd frontend
npm install
```

## Konfigurasi `.env`

### Backend

Buat file `backend/.env` lalu isi minimal seperti ini:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=nama_database

JWT_SECRET=isi_dengan_secret_yang_kuat
JWT_EXPIRES_IN=2h

APP_URL=http://localhost:3001

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=alamat_email_pengirim
MAIL_PASS=password_atau_app_password
```

Catatan:

- `APP_URL` dipakai untuk membuat link reset password ke frontend.
- `MAIL_*` dipakai saat user meminta reset password.
- Jika belum memakai email reset, variabel mail tetap sebaiknya disiapkan agar fitur tidak gagal saat dipanggil.

### Frontend

Buat file `frontend/.env.local` lalu isi:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

## Menjalankan Project

### Backend

```bash
cd backend
npm run dev
```

Perintah lain yang tersedia:

```bash
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run dev
```

Frontend akan tersedia di `http://localhost:3001`.

## Daftar Akun Uji Coba

| No  | Nama Akun | Email               | Password     | Role     | Keterangan                 |
| --- | --------- | ------------------- | ------------ | -------- | -------------------------- |
| 1   | Admin     | admin@kampus.com    | Admin123!    | admin    | Akses penuh ke semua fitur |
| 2   | Operator  | operator@kampus.com | Operator123! | operator | Kelola prodi dan mahasiswa |
| 3   | Viewer    | viewer@kampus.com   | Viewer123!   | viewer   | Hanya melihat data         |

## Daftar Endpoint

### Endpoint umum

| Method | Endpoint   | Keterangan                 |
| ------ | ---------- | -------------------------- |
| GET    | `/health`  | Status service backend     |
| GET    | `/profile` | Informasi profil aplikasi  |
| GET    | `/about`   | Informasi singkat aplikasi |

### Auth

| Method | Endpoint             | Keterangan           |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/register` | Registrasi user baru |
| POST   | `/api/auth/login`    | Login user           |
| POST   | `/api/auth/logout`   | Logout               |

### User

| Method | Endpoint                       | Akses  | Keterangan                                 |
| ------ | ------------------------------ | ------ | ------------------------------------------ |
| POST   | `/api/user/forgot-password`    | Publik | Minta link reset password                  |
| PATCH  | `/api/user/reset-password`     | Publik | Reset password via token                   |
| GET    | `/api/user`                    | Admin  | Ambil semua user                           |
| GET    | `/api/user/paginated`          | Admin  | Ambil user dengan pagination dan pencarian |
| POST   | `/api/user`                    | Admin  | Tambah user                                |
| PUT    | `/api/user/:id`                | Admin  | Ubah user                                  |
| DELETE | `/api/user/:id`                | Admin  | Hapus user                                 |
| PATCH  | `/api/user/:id/reset-password` | Admin  | Reset password user oleh admin             |

### Prodi

| Method | Endpoint               | Akses                   | Keterangan                                  |
| ------ | ---------------------- | ----------------------- | ------------------------------------------- |
| GET    | `/api/prodi`           | Admin, Operator, Viewer | Ambil semua prodi                           |
| GET    | `/api/prodi/paginated` | Admin, Operator, Viewer | Ambil prodi dengan pagination dan pencarian |
| POST   | `/api/prodi`           | Admin, Operator         | Tambah prodi                                |
| PUT    | `/api/prodi/:id`       | Admin, Operator         | Ubah prodi                                  |
| DELETE | `/api/prodi/:id`       | Admin                   | Hapus prodi                                 |

### Mahasiswa

| Method | Endpoint             | Akses                   | Keterangan           |
| ------ | -------------------- | ----------------------- | -------------------- |
| GET    | `/api/mahasiswa`     | Admin, Operator, Viewer | Ambil data mahasiswa |
| POST   | `/api/mahasiswa`     | Admin, Operator         | Tambah mahasiswa     |
| PUT    | `/api/mahasiswa/:id` | Admin, Operator         | Ubah mahasiswa       |
| DELETE | `/api/mahasiswa/:id` | Admin                   | Hapus mahasiswa      |

### File Upload

| Method | Endpoint     | Keterangan                                        |
| ------ | ------------ | ------------------------------------------------- |
| GET    | `/uploads/*` | Akses file yang diunggah, termasuk foto mahasiswa |

## Alur Singkat Akses

- Login memakai endpoint `/api/auth/login`.
- Setelah login, frontend menyimpan token dan role di cookie.
- User non-admin diarahkan ke dashboard mahasiswa.
- Admin bisa masuk ke dashboard user untuk mengelola user lain.

## Catatan Tambahan

- Backend memakai CORS untuk origin `http://localhost:3001`.
- Frontend mengambil API dari `NEXT_PUBLIC_API_URL`.
- Endpoint reset password membutuhkan konfigurasi email yang valid.
