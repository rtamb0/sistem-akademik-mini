import { getToken } from "../auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export async function getUsers() {
  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal mengambil data user");
    }

    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function createUser(payload: UserInput) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal menambahkan user");
    }

    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(
  id: number,
  payload: {
    name: string;
    email: string;
    role: string;
  },
) {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal memperbarui user");
    }

    return result;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(id: number) {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal menghapus user");
    }

    return result;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function resetPasswordByAdmin(id: number) {
  try {
    const response = await fetch(`${API_URL}/users/${id}/reset-password`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal mereset password user");
    }

    return result;
  } catch (error) {
    console.error("Error resetting user password:", error);
    throw error;
  }
}

export async function requestPasswordResetByUser(email: string) {
  try {
    const response = await fetch(`${API_URL}/users/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal mengirim link reset password");
    }

    return result;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
}

export async function resetPasswordByUser(
  email: string,
  token: string,
  password: string,
  confirmPassword: string,
) {
  try {
    const response = await fetch(`${API_URL}/users/reset-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        token,
        password,
        confirmPassword,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal mengubah password");
    }

    return result;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}
