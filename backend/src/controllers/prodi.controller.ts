import { Request, Response } from "express";
import db from "../config/database";

export const getAllProdi = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nama_prodi, kode_prodi FROM prodi ORDER BY nama_prodi ASC",
    );

    res.json({
      message: "Data prodi berhasil diambil",
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getPaginatedProdi = async (req: Request, res: Response) => {
  try {
    const search = String(req.query.search || "");
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const params: any[] = [];

    if (search) {
      where += " AND (nama_prodi LIKE ? OR kode_prodi LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    const [countRows]: any = await db.query(
      `SELECT COUNT(*) AS total FROM prodi ${where}`,
      params,
    );

    const total = countRows[0].total;

    const [rows] = await db.query(
      `SELECT id, nama_prodi, kode_prodi, created_at
      FROM prodi 
      ${where} 
      ORDER BY id ASC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    res.json({
      message: "Data prodi berhasil diambil",
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const createProdi = async (req: Request, res: Response) => {
  try {
    const { nama_prodi, kode_prodi } = req.body;

    if (!nama_prodi || !kode_prodi) {
      return res.status(400).json({
        message: "Nama prodi dan kode prodi wajib diisi",
      });
    }

    const [existingKode]: any = await db.query(
      "SELECT id FROM prodi WHERE kode_prodi = ?",
      [kode_prodi],
    );

    if (existingKode.length > 0) {
      return res.status(400).json({ message: "Kode prodi sudah digunakan" });
    }

    const [existingNama]: any = await db.query(
      "SELECT id FROM prodi WHERE nama_prodi = ?",
      [nama_prodi],
    );

    if (existingNama.length > 0) {
      return res.status(400).json({ message: "Nama prodi sudah digunakan" });
    }

    const [result]: any = await db.query(
      `INSERT INTO prodi (nama_prodi, kode_prodi)
       VALUES (?, ?)`,
      [nama_prodi, kode_prodi],
    );

    res.status(201).json({
      message: "Prodi berhasil ditambahkan",
      data: { id: result.insertId, nama_prodi, kode_prodi },
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const updateProdi = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama_prodi, kode_prodi } = req.body;

    const fields = ["nama_prodi = ?", "kode_prodi = ?"];
    const values: any[] = [nama_prodi, kode_prodi];

    values.push(id);

    const [result]: any = await db.query(
      `UPDATE prodi SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Prodi tidak ditemukan" });
    }

    res.json({ message: "Prodi berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const deleteProdi = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result]: any = await db.query("DELETE FROM prodi WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Prodi tidak ditemukan" });
    }

    res.json({ message: "Prodi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
