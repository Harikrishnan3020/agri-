import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

const listings = [];
const clients = new Set();

const sendSse = (res, event, data) => {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/listings", (_req, res) => {
  res.json({ listings });
});

app.post("/api/listings", (req, res) => {
  const listing = req.body;
  if (!listing || !listing.id || !listing.title) {
    res.status(400).json({ error: "Invalid listing payload" });
    return;
  }

  const exists = listings.find((item) => item.id === listing.id);
  if (!exists) {
    listings.unshift(listing);
  }

  for (const client of clients) {
    sendSse(client, "listing", listing);
  }

  res.status(201).json({ listing });
});

app.get("/api/listings/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  sendSse(res, "ready", { ok: true });
  clients.add(res);

  req.on("close", () => {
    clients.delete(res);
  });
});

app.listen(PORT, () => {
  console.log(`Marketplace server running on http://localhost:${PORT}`);
});
