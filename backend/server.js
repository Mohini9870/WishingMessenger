import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import mongoose from "mongoose";
import wishRoutes from "./routes/wish.routes.js";
import authRoutes from "./routes/auth.routes.js";
import otpRoutes from "./routes/otp.routes.js";

// 👇 cron ko bas import karo
import "./jobs/wish.scheduler.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/wishes", wishRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
