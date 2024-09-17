const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post("/webhook", async (req, res) => {
  const formData = req.body;

  let messageText = "New Jotform Submission:\n";
  for (const [key, value] of Object.entries(formData)) {
    messageText += `*${key}*: ${value}\n`;
  }

  const slackMessage = {
    text: messageText,
  };

  console.log(slackMessage);

  try {
    await axios.post(process.env.WEBHOOK_URL, slackMessage);
    res.status(200).send("Data sent to Slack successfully!");
  } catch (error) {
    console.error("Error sending data to Slack:", error);
    res.status(500).send("Failed to send data to Slack");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
