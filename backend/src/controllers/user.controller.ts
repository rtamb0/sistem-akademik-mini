import { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "../config/database";
import crypto from "crypto";
import { mailer } from "../config/mail";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, email, role, created_at
       FROM users
       ORDER BY id ASC`,
    );

    res.json({
      message: "Data user berhasil diambil",
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getPaginatedUsers = async (req: Request, res: Response) => {
  try {
    const search = String(req.query.search || "");
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const params: any[] = [];

    if (search) {
      where += " AND (name LIKE ? OR email LIKE ? OR role LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [countRows]: any = await db.query(
      `SELECT COUNT(*) AS total FROM users ${where}`,
      params,
    );

    const total = countRows[0].total;

    const [rows] = await db.query(
      `SELECT id, name, email, role, created_at
      FROM users 
      ${where} 
      ORDER BY id ASC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    res.json({
      message: "Data user berhasil diambil",
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

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Nama, email, password, dan role wajib diisi",
      });
    }

    const allowedRoles = ["admin", "operator", "viewer"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Role tidak valid" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role],
    );

    res.status(201).json({ message: "User berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const [result]: any = await db.query(
      "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
      [name, email, role, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({ message: "User berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result]: any = await db.query("DELETE FROM users WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({ message: "User berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

function generateTemporaryPassword() {
  return Math.random().toString(36).slice(-10);
}

export const resetPasswordByAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const [result]: any = await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({
      message: "Password berhasil direset",
      temporaryPassword,
      note: "Tampilkan hanya sekali, lalu minta user mengganti password.",
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const requestPasswordResetByUser = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email wajib diisi",
      });
    }

    const normalisedEmail = String(email).trim().toLowerCase();

    const [users]: any = await db.query(
      `SELECT id, email
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [normalisedEmail],
    );

    if (users.length === 0) {
      res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const user = users[0];

    const rawToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    await db.query(
      `UPDATE users
       SET reset_token = ?,
           reset_token_expired_at = DATE_ADD(NOW(), INTERVAL 30 MINUTE)
       WHERE id = ?`,
      [tokenHash, user.id],
    );

    const resetUrl =
      `${process.env.APP_URL}/reset-password` +
      `?token=${encodeURIComponent(rawToken)}` +
      `&email=${encodeURIComponent(user.email)}`;

    try {
      await mailer.sendMail({
        from: `Admin Kampus <${process.env.MAIL_USER}>`,
        to: user.email,
        subject: "Reset Password",
        html: `
          <p>Anda meminta reset password.</p>
          <p>Klik link berikut untuk mengganti password:</p>
          <p>
            <a href="${resetUrl}">
              Reset Password
            </a>
          </p>
          <p>Link berlaku selama 30 menit.</p>
          <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
        `,
      });
    } catch (mailError) {
      await db.query(
        `UPDATE users
         SET reset_token = NULL,
             reset_token_expired_at = NULL
         WHERE id = ?
           AND reset_token = ?`,
        [user.id, tokenHash],
      );

      throw mailError;
    }

    res.status(200).json({
      message: "Link reset password telah dikirim ke email",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  }
};

export const resetPasswordByUser = async (req: Request, res: Response) => {
  try {
    const { email, token, password, confirmPassword } = req.body;

    if (!email || !token || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Email, token, password, dan konfirmasi password wajib diisi",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password minimal 6 karakter",
      });
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        message: "Konfirmasi password tidak sesuai",
      });
    }

    const normalisedEmail = String(email).trim().toLowerCase();

    const tokenHash = crypto
      .createHash("sha256")
      .update(String(token))
      .digest("hex");

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result]: any = await db.query(
      `UPDATE users
       SET password = ?,
           reset_token = NULL,
           reset_token_expired_at = NULL
       WHERE email = ?
         AND reset_token = ?
         AND reset_token_expired_at IS NOT NULL
         AND reset_token_expired_at > NOW()`,
      [hashedPassword, normalisedEmail, tokenHash],
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Token tidak valid atau sudah kedaluwarsa",
      });
    }

    res.status(200).json({
      message: "Password berhasil diubah",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  }
};
