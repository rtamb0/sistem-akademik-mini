"use client";

import { getUser, logout } from "@/lib/auth";
import { useEffect, useState } from "react";
import { logoutAccount } from "@/lib/api/auth";
import Link from "next/dist/client/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [currentMenu, setCurrentMenu] = useState<string>("");

  useEffect(() => {
    const storedUser = getUser();
    setCurrentMenu(window.location.pathname);
    setCurrentUser(storedUser);
  }, []);

  const handleLogout = async () => {
    const confirmed = window.confirm("Yakin ingin logout?");

    if (!confirmed) {
      return;
    }

    try {
      await logoutAccount();
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      window.location.href = "/login";
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <header
        className="d-flex justify-content-between p-4"
        style={{ backgroundColor: "#333", color: "#fff" }}
      >
        <h1 className="mb-0">Dashboard</h1>
        <div className="d-flex align-items-center gap-3">
          <p className="mb-0">Welcome, {currentUser?.name || ""}</p>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>
      <main className="pt-4 pb-4 flex-grow-1 d-flex">
        <nav style={{ width: 300, backgroundColor: "#f8f9fa" }}>
          <ul className="ps-2 pe-2 list-unstyled d-flex flex-column gap-2">
            <li>
              <Link
                href="/dashboard/mahasiswa"
                className="p-2 rounded-3 d-block"
                style={{
                  backgroundColor:
                    currentMenu === "/dashboard/mahasiswa"
                      ? "#e9ecef"
                      : "transparent",
                }}
              >
                Mahasiswa
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/prodi"
                className="p-2 rounded-3 d-block"
                style={{
                  backgroundColor:
                    currentMenu === "/dashboard/prodi"
                      ? "#e9ecef"
                      : "transparent",
                }}
              >
                Prodi
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/user"
                className="p-2 rounded-3 d-block"
                style={{
                  backgroundColor:
                    currentMenu === "/dashboard/user"
                      ? "#e9ecef"
                      : "transparent",
                }}
              >
                Users
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex-grow-1 p-4">{children}</div>
      </main>
      <footer
        className="p-4 text-center"
        style={{ backgroundColor: "#333", color: "#fff" }}
      >
        Ralf Fadilla - 0112523048
      </footer>
    </div>
  );
}
