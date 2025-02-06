const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Store user tokens (in a real app, use a database)
const userTokens = {
  "user1": "abc123",
  "user2": "xyz789"
};

// Your actual Discord webhook URL
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1337110927786508430/FizcWCZIu9tz2NTDdhW49IG4wq7cHKyS1z4-orAYaHmAOnYJ-Hi8da7OXIBlaT3oIEkd";

// Middleware to verify the token
function verifyToken(req, res, next) {
  const { token } = req.headers;
  if (!token || !Object.values(userTokens).includes(token)) {
    return res.status(403).json({ error: "Invalid token" });
  }
  next();
}

// Handle incoming messages
app.post("/webhook", verifyToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Forward the message to the real Discord webhook
    await axios.post(DISCORD_WEBHOOK_URL, { content: message });

    res.json({ success: true, message: "Message sent to Discord" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.listen(3000, () => console.log("Webhook server running on port 3000"));
