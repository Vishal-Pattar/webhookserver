const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

app.use(express.json());

app.all("*", async (req, res) => {
  try {
    const requestDetails = {
      method: req.method,
      headers: req.headers,
      body: req.body,
      url: req.originalUrl,
    };

    await axios.post(DISCORD_WEBHOOK_URL, {
      content: `New request received:\n\`\`\`json\n${JSON.stringify(
        requestDetails,
        null,
        2
      )}\n\`\`\``,
    });

    res.status(200).send("Request received and sent to Discord.");
  } catch (error) {
    res.status(500).send("An error occurred.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
