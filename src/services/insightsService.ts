import openai from "../config/openaiClient.js";

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  category?: string;
  anomaly?: boolean;
}

export const analyzeTransactions = async (transactions: Transaction[]) => {
  const categorized = await Promise.all(
    transactions.map(async (tx) => {
      const completion = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          {
            role: "system",
            content:
              "Classify transaction into categories: Food, Transport, Subscriptions, Income, Shopping",
          },
          {
            role: "user",
            content: tx.description,
          },
        ],
      });

      const category = completion.choices[0]?.message?.content?.trim() || "Uncategorized";;
      return { ...tx, category };
    })
  );
  const alerts: Transaction[] = categorized.map((tx) => {
    let anomaly = false;
    let alertReason = "";

    if (tx.category === "Transport") {
      const avgTransport =
        categorized
          .filter((t) => t.category === "Transport")
          .reduce((sum, t) => sum + Math.abs(t.amount), 0) /
        categorized.filter((t) => t.category === "Transport").length;

      if (Math.abs(tx.amount) > avgTransport * 2) {
        anomaly = true;
        alertReason = "Transport payment unusually high 🔥";
      }
    }

    if (tx.category === "Subscriptions") {
      const count = categorized.filter(
        (t) => t.category === "Subscriptions" && t.description === tx.description
      ).length;

      if (count > 1) {
        anomaly = true;
        alertReason = "Duplicate subscription detected 🔥";
      }
    }

    const categoryAvg =
      categorized
        .filter((t) => t.category === tx.category)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0) /
      categorized.filter((t) => t.category === tx.category).length;

    if (Math.abs(tx.amount) > categoryAvg * 3) {
      anomaly = true;
      alertReason = "Sudden large payment in this category 🔥";
    }

    return { ...tx, anomaly, alertReason: anomaly ? alertReason : undefined };
  });

  const transportTxs = categorized.filter((t) => t.category === "Transport");
  const avgTransport =
    transportTxs.reduce((sum, t) => sum + Math.abs(t.amount), 0) /
    (transportTxs.length || 1);

  const withAnomalies = categorized.map((tx) => {
    if (tx.category === "Transport" && Math.abs(tx.amount) > avgTransport * 2) {
      return { ...tx, anomaly: true };
    }
    return tx;
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      {
        role: "system",
        content: "Generate 3-5 short financial insights based on transactions",
      },
      {
        role: "user",
        content: JSON.stringify(alerts),
      },
    ],
  });

  const insights = completion.choices[0]?.message?.content
    ?.split("\n")
    .filter(Boolean);

  console.log(withAnomalies, insights)

  return { transactions: withAnomalies, insights };
};
