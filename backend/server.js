// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// API route to generate story via Gemini
app.post("/api/generate-story", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("📩 Prompt received:", prompt);

    const GEMINI_API_URL =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": process.env.GEMINI_API_KEY, // ✅ stored in .env
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (response.ok) {
      res.json({
        story:
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No story generated.",
      });
    } else {
      console.error("❌ Gemini API error:", data);
      res.status(500).json({ error: data });
    }
  } catch (error) {
    console.error("🔥 Server error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
