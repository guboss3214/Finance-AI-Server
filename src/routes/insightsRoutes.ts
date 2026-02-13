import { Router } from "express";
import { getInsights } from "../controllers/insightsController.js";

const router = Router();

router.post("/insights", getInsights);

export default router;
