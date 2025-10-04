import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import salaryRoutes from "./routes/salaryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: "*",  // 🔥 for testing; later restrict to your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// User registration/login routes
app.use("/api/user", userRoutes);

// Serve React build in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, "../client/build");
const PORT = process.env.PORT || 5000;
app.use(express.static(clientBuildPath));

// API Routes
app.use("/api/salary", salaryRoutes);
app.use("/api/transactions", transactionRoutes);

// Catch-all route for React (must be last)
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => console.log("❌ Error:", err));
