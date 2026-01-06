import express from "express";
import wishRoutes from "./routes/wish.routes.js";

const app = express();

app.use(express.json());
app.use("/api/wishes", wishRoutes);

export default app;
