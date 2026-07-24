const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllProdi() {
  try {
    const response = await fetch(`${API_URL}/prodi`);
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
