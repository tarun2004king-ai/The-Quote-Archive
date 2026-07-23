require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const quoteRoutes = require("./routes/quotes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quote_generator";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.use("/api/quotes", quoteRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", dbState: mongoose.connection.readyState });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
