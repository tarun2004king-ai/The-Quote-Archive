const express = require("express");
const axios = require("axios");
const Quote = require("../models/Quote");

const router = express.Router();

const EXTERNAL_API_URL = "https://zenquotes.io/api/random";

// if the live fetch fails.
const FALLBACK_QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
];

function pickFallback() {
  const q = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  return { text: q.text, author: q.author, source: "fallback" };
}


router.get("/random", async (req, res) => {
  let quoteData;

  try {
    const { data } = await axios.get(EXTERNAL_API_URL, { timeout: 6000 });
    const first = Array.isArray(data) ? data[0] : null;

    if (!first || !first.q) {
      throw new Error("Unexpected response shape from external API");
    }

    quoteData = {
      text: first.q,
      author: first.a && first.a.trim() ? first.a : "Unknown",
      source: "zenquotes",
    };
  } catch (err) {
    console.error("External quote API failed, using fallback:", err.message);
    quoteData = pickFallback();
  }

  try {
    const saved = await Quote.create(quoteData);
    return res.status(201).json(saved);
  } catch (err) {
    console.error("Failed to save quote to history:", err.message);

    return res.status(200).json({ ...quoteData, _id: null, viewedAt: new Date() });
  }
});

router.get("/history", async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

  try {
    const history = await Quote.find().sort({ viewedAt: -1 }).limit(limit);
    res.json(history);
  } catch (err) {
    console.error("Failed to load history:", err.message);
    res.status(500).json({ error: "Could not load quote history." });
  }
});

router.delete("/history/:id", async (req, res) => {
  try {
    await Quote.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error("Failed to delete quote:", err.message);
    res.status(500).json({ error: "Could not delete that entry." });
  }
});


router.delete("/history", async (req, res) => {
  try {
    await Quote.deleteMany({});
    res.status(204).end();
  } catch (err) {
    console.error("Failed to clear history:", err.message);
    res.status(500).json({ error: "Could not clear history." });
  }
});

module.exports = router;
