import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import insightsRoute from "./routes/insightsRoutes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL
}));
app.use(express.json());

app.use("/api", insightsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
