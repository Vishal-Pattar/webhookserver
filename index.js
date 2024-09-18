require("dotenv").config();
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const upload = multer();
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

app.use(bodyParser.json());

app.post("/webhook", upload.none(), async (req, res) => {
  try {
    const contentType = req.headers["content-type"];

    if (contentType.includes("multipart/form-data")) {
      const formData = req.body;
      const prettyFormData = JSON.stringify(formData, null, 2);

      await axios.post(discordWebhookUrl, {
        content: `**Received form-data:**\n\`\`\`json\n${prettyFormData}\n\`\`\``,
      });

      return res
        .status(200)
        .json({ message: "Form data sent to Discord in pretty format." });
    } else if (contentType.includes("application/json")) {
      const jsonData = req.body;
      const prettyJsonData = JSON.stringify(jsonData, null, 2);

      await axios.post(discordWebhookUrl, {
        content: `**Received JSON data:**\n\`\`\`json\n${prettyJsonData}\n\`\`\``,
      });

      return res
        .status(200)
        .json({ message: "JSON data sent to Discord in pretty format." });
    } else {
      return res.status(400).json({ message: "Unsupported content type." });
    }
  } catch (error) {
    console.error("Error sending data to Discord:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
