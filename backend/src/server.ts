import { Request, Response } from "express";
import app from "./app";

const PORT = 3000;

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    service: "Express CRUD API",
  });
});

app.get("/profile", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: {
      name: "Ralf Fadilla",
      NIM: "0112523048",
    },
  });
});

app.get("/about", (req: Request, res: Response) => {
  res.json({
    message:
      "Ini jaman digital, era teknologi, selamat berkarya, salam dari Jokowi",
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di ${PORT}`);
});
