// File: app.js
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const upload = multer();

// Load Discord webhook URL from environment variable
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

// Middleware to handle JSON body
app.use(bodyParser.json());

// Route to handle POST requests
app.post("/webhook", upload.none(), async (req, res) => {
  try {
    // Determine the content type
    const contentType = req.headers["content-type"];

    // Check if the content-type is multipart/form-data
    if (contentType.includes("multipart/form-data")) {
      const formData = req.body;

      // Send form data to Discord
      await axios.post(discordWebhookUrl, {
        content: `Received form-data: ${JSON.stringify(formData)}`,
      });

      return res.status(200).json({ message: "Form data sent to Discord." });
    } else if (contentType.includes("application/json")) {
      // If JSON data is sent
      const jsonData = req.body;

      // Send JSON data to Discord
      await axios.post(discordWebhookUrl, {
        content: `Received JSON data: ${JSON.stringify(jsonData)}`,
      });

      return res.status(200).json({ message: "JSON data sent to Discord." });
    } else {
      return res.status(400).json({ message: "Unsupported content type." });
    }
  } catch (error) {
    console.error("Error sending data to Discord:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
