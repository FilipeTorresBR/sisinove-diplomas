import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import poleRoutes from "./routes/poleRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import diplomaRoutes from "./routes/diplomaRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(path.resolve("uploads")));
app.get("/api/health", (_, res) =>
  res.json({ status: "ok", system: "Sisinove Diplomas" }),
);
app.use("/api/auth", authRoutes);
app.use("/api/poles", poleRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/diplomas", diplomaRoutes);
app.use("/api/reports", reportRoutes);
app.listen(process.env.PORT || 4001, () =>
  console.log(`API running on ${process.env.PORT || 4001}`),
);
