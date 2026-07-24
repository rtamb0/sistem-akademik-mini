import { getToken } from "../auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginAccount(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login gagal");
    }

    return result;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

export async function registerAccount(
  name: string,
  email: string,
  password: string,
) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Registrasi gagal");
    }

    return result;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
}

export async function logoutAccount() {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Logout gagal");
    }

    return result;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
}
