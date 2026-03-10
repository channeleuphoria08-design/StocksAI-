import express from "express";
import { createServer as createViteServer } from "vite";
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      
      const results = await yahooFinance.search(q) as any;
      const formattedResults = results.quotes
        .filter((q: any) => q.isYahooFinance)
        .slice(0, 5)
        .map((q: any) => ({
          symbol: q.symbol,
          shortname: q.shortname || q.longname || q.symbol,
          exchange: q.exchange
        }));
        
      res.json(formattedResults);
    } catch (error: any) {
      console.error("Error searching stocks:", error);
      res.status(500).json({ error: "Failed to search stocks", details: error.message });
    }
  });

  app.get("/api/news", async (req, res) => {
    try {
      // Fetch general market news
      const query = 'market';
      const result = await yahooFinance.search(query, { newsCount: 12 }) as any;
      res.json(result.news || []);
    } catch (error: any) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Failed to fetch news", details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
