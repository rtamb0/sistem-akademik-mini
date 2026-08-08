# Academic Management System Mini

An integrated academic management application with responsive web interface and robust REST API. Built with **Next.js 16** (frontend) and **Express + TypeScript** (backend), equipped with JWT authentication and role-based permission management.

## 🚀 Deployment

This application is deployed using **Docker** and runs on VPS. For production access, see the [Public Access](#public-access) section below.

**Server Information:**

- Frontend: Running on Nginx reverse proxy
- Backend: Express API (port 3000, internal)
- Database: MySQL 8 (container)

## 📋 Table of Contents

- [Public Access](#public-access)
- [Project Architecture](#project-architecture)
- [Local Setup (Development)](#local-setup-development)
- [Docker Deployment](#docker-deployment)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)

## 🌐 Public Access

The application can be accessed through VPS domain/IP with basePath `/sistem-akademik-mini`:

```
Frontend:   https://your-vps-domain.com/sistem-akademik-mini
Backend API: https://your-vps-domain.com/sistem-akademik-mini/api
```

Or if using VPS IP:

```
Frontend:   http://<VPS_IP>/sistem-akademik-mini
Backend API: http://<VPS_IP>/sistem-akademik-mini/api
```

> **Note:** Login using provided credentials (see test account table below). Contact administrator for new accounts.

## 🏗️ Project Architecture

```
├── backend/                 # Express API (TypeScript)
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth, validation, upload
│   │   ├── config/          # Database, mail config
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── Dockerfile           # Docker configuration
│   └── package.json
│
├── frontend/                # Next.js Frontend
│   ├── app/                 # App router pages
│   ├── components/          # Reusable components
│   ├── lib/                 # Utilities, API clients
│   ├── public/              # Static assets
│   ├── Dockerfile           # Docker configuration
│   └── package.json
│
├── nginx/
│   └── nginx.conf           # Reverse proxy configuration
│
├── docker-compose.yml       # Docker orchestration
├── database.sql             # Database schema
└── README.md
```

## 💻 Local Setup (Development)

### Prerequisites

- Node.js v18+ and npm
- Docker & Docker Compose (for MySQL database)
- Git

### Installation Steps

#### 1. Clone Repository

```bash
git clone <repository-url>
cd 0112523048-tugas-webdin-Frontend-NextJS-untuk-Backend-Express-CRUD
```

#### 2. Setup Database (Docker)

```bash
docker-compose up -d mysql
```

Wait for MySQL to be ready (check with `docker logs <container-id>`), then import schema:

```bash
docker exec -it <mysql-container-id> mysql -uroot -padmin db_kuliah < database.sql
```

**Alternative** (access MySQL from host on port 3307):

```bash
mysql -h 127.0.0.1 -P 3307 -uroot -padmin db_kuliah < database.sql
```

#### 3. Backend Setup

```bash
cd backend
npm install
```

#### 4. Frontend Setup

```bash
cd frontend
npm install
```

### Environment Variables

#### Backend (`backend/.env`)

```env
# Database
DB_HOST=localhost           # 'mysql' when using Docker
DB_PORT=3306               # 3307 if accessing from host
DB_USER=root
DB_PASSWORD=admin
DB_NAME=db_kuliah

# JWT
JWT_SECRET=replace_with_long_and_difficult_to_guess_secret
JWT_EXPIRES_IN=2h

# Application (Frontend URL for password reset link)
APP_URL=http://localhost:3000

# Email (for password reset)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_SECURE=true
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
```

#### Frontend (create `frontend/.env.local` for development)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

**For Docker/Production:**

```env
NEXT_PUBLIC_API_URL=https://your-vps-domain.com/api
NEXT_PUBLIC_BACKEND_URL=https://your-vps-domain.com
```

### Running Local Project

Since both services use port `3000`, run with custom configuration:

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend will be available at `http://localhost:3000`

**Terminal 2 - Frontend (different port):**

```bash
cd frontend
NEXT_PUBLIC_API_URL=http://localhost:3000/api npm run dev
```

Frontend will be available at `http://localhost:3000` (custom port can be set via PORT env var if needed)

## 🐳 Docker Deployment

### Build & Run with Docker Compose

```bash
docker-compose up --build
```

This will build and run:

- **Nginx** - Reverse proxy at `http://localhost` (port 80)
- **MySQL Database** - Local access at `localhost:3307` (port 3307 from host)
- **Express Backend** - Internal at `localhost:3000` (internal to Nginx only)
- **Next.js Frontend** - Internal at `localhost:3000` (internal to Nginx only)

**Port Notes:**

- Frontend and Backend both expose port 3000 internally
- Nginx uses path routing to differentiate requests:
  - `/sistem-akademik-mini/api/*` → Backend
  - `/sistem-akademik-mini/*` → Frontend
- Access from browser: `http://localhost/sistem-akademik-mini`

### Production Checklist

- [ ] Update `.env` with secure production credentials
- [ ] Set `JWT_SECRET` with strong and random value
- [ ] Configure MAIL\_\* for email notifications
- [ ] Update `APP_URL` to production domain
- [ ] Ensure DNS is pointing to VPS
- [ ] Setup SSL/TLS (HTTPS) in Nginx
- [ ] Backup database regularly

## 📡 API Endpoints

### Authentication (Public)

```
POST   /api/auth/register       # Register new account
POST   /api/auth/login          # User login
POST   /api/auth/logout         # Logout
POST   /api/user/forgot-password # Request password reset
PATCH  /api/user/reset-password # Reset password with token
```

### Protected Routes

**Prodi (Academic Programs)**

```
GET    /api/prodi              # List programs
POST   /api/prodi              # Create (admin only)
PATCH  /api/prodi/:id          # Update (admin only)
DELETE /api/prodi/:id          # Delete (admin only)
```

**Mahasiswa (Students)**

```
GET    /api/mahasiswa          # List students
POST   /api/mahasiswa          # Create (admin only)
PATCH  /api/mahasiswa/:id      # Update (admin only)
DELETE /api/mahasiswa/:id      # Delete (admin only)
```

**Users**

```
GET    /api/user               # List users (admin only)
POST   /api/user               # Create user (admin only)
PATCH  /api/user/:id           # Update user (admin only)
DELETE /api/user/:id           # Delete user (admin only)
GET    /api/profile            # Get current user profile
```

### Roles & Permissions

- **Admin**: Full access to all features
- **Operator**: Create/Read/Update data (cannot delete users)
- **Viewer**: Read-only access

## 📦 Dependencies

### Backend

- Express.js - Web framework
- TypeScript - Type-safe JavaScript
- JWT - Authentication
- Multer - File upload
- Nodemailer - Email service

### Frontend

- Next.js 16 - React framework
- TypeScript - Type-safe JavaScript
- Bootstrap 5 - CSS framework
- Axios - HTTP client

## 🔒 Security Notes

- Use HTTPS in production
- Never commit `.env` file to repository
- Rotate `JWT_SECRET` periodically
- Update dependencies for security patches
- Use strong passwords in database

## 📝 License

This project was created for academic purposes.

## 👨‍💻 Support

For questions or issues, contact the development team or create an issue in this repository.

## Test Account List

| No  | Account Name | Email               | Password     | Role     | Description                  |
| --- | ------------ | ------------------- | ------------ | -------- | ---------------------------- |
| 1   | Admin        | admin@kampus.com    | Admin123!    | admin    | Full access to all features  |
| 2   | Operator     | operator@kampus.com | Operator123! | operator | Manage programs and students |
| 3   | Viewer       | viewer@kampus.com   | Viewer123!   | viewer   | View data only               |

## Endpoint List

### General Endpoints

| Method | Endpoint   | Description              |
| ------ | ---------- | ------------------------ |
| GET    | `/health`  | Backend service status   |
| GET    | `/profile` | Application profile info |
| GET    | `/about`   | Application information  |

### Auth

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | User login        |
| POST   | `/api/auth/logout`   | User logout       |

### User

| Method | Endpoint                       | Access | Description                          |
| ------ | ------------------------------ | ------ | ------------------------------------ |
| POST   | `/api/user/forgot-password`    | Public | Request password reset link          |
| PATCH  | `/api/user/reset-password`     | Public | Reset password via token             |
| GET    | `/api/user`                    | Admin  | Get all users                        |
| GET    | `/api/user/paginated`          | Admin  | Get users with pagination and search |
| POST   | `/api/user`                    | Admin  | Add user                             |
| PUT    | `/api/user/:id`                | Admin  | Update user                          |
| DELETE | `/api/user/:id`                | Admin  | Delete user                          |
| PATCH  | `/api/user/:id/reset-password` | Admin  | Reset user password by admin         |

### Prodi

| Method | Endpoint               | Access                  | Description                             |
| ------ | ---------------------- | ----------------------- | --------------------------------------- |
| GET    | `/api/prodi`           | Admin, Operator, Viewer | Get all programs                        |
| GET    | `/api/prodi/paginated` | Admin, Operator, Viewer | Get programs with pagination and search |
| POST   | `/api/prodi`           | Admin, Operator         | Add program                             |
| PUT    | `/api/prodi/:id`       | Admin, Operator         | Update program                          |
| DELETE | `/api/prodi/:id`       | Admin                   | Delete program                          |

### Mahasiswa

| Method | Endpoint             | Access                  | Description      |
| ------ | -------------------- | ----------------------- | ---------------- |
| GET    | `/api/mahasiswa`     | Admin, Operator, Viewer | Get student data |
| POST   | `/api/mahasiswa`     | Admin, Operator         | Add student      |
| PUT    | `/api/mahasiswa/:id` | Admin, Operator         | Update student   |
| DELETE | `/api/mahasiswa/:id` | Admin                   | Delete student   |

### File Upload

| Method | Endpoint     | Description                                     |
| ------ | ------------ | ----------------------------------------------- |
| GET    | `/uploads/*` | Access uploaded files, including student photos |

## Quick Access Flow

- Login using `/api/auth/login` endpoint.
- After login, frontend stores token and role in cookies.
- Non-admin users are directed to student dashboard.
- Admin can access user dashboard to manage other users.

## Additional Notes

- Backend uses CORS for origin `http://localhost:3001`.
- Frontend retrieves API from `NEXT_PUBLIC_API_URL`.
- Password reset endpoint requires valid email configuration.
