import { getToken } from "../auth";
import { ProdiInput } from "../type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllProdi() {
  try {
    const response = await fetch(`${API_URL}/prodi`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal mengambil data prodi");
    }

    return result;
  } catch (error) {
    console.error("Error fetching prodi:", error);
    throw error;
  }
}

export async function getProdi(params: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const query = new URLSearchParams();

    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const response = await fetch(
      `${API_URL}/prodi/paginated?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal mengambil data prodi");
    }

    return result;
  } catch (error) {
    console.error("Error fetching prodi:", error);
    throw error;
  }
}

export async function createProdi(payload: ProdiInput) {
  try {
    const response = await fetch(`${API_URL}/prodi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal menambahkan prodi");
    }

    return result;
  } catch (error) {
    console.error("Error creating prodi:", error);
    throw error;
  }
}

export async function updateProdi(id: number, payload: ProdiInput) {
  try {
    const response = await fetch(`${API_URL}/prodi/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal memperbarui prodi");
    }

    return result;
  } catch (error) {
    console.error("Error updating prodi:", error);
    throw error;
  }
}

export async function deleteProdi(id: number) {
  try {
    const response = await fetch(`${API_URL}/prodi/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal menghapus prodi");
    }

    return result;
  } catch (error) {
    console.error("Error deleting prodi:", error);
    throw error;
  }
}
