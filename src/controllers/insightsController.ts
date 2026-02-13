import type { Request, Response } from "express";
import { analyzeTransactions, type Transaction } from "../services/insightsService.js";

export const getInsights = async (req: Request, res: Response) => {
  try {
    const { demoTransactions } = req.body;
    const transactions: Transaction[] = demoTransactions;

    const { transactions: processed, insights } = await analyzeTransactions(transactions);

    res.json({ transactions: processed, insights });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error in getInsights" });
  }
};
