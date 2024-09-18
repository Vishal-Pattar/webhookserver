require("dotenv").config();
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const app = express();
const upload = multer();
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

app.use(bodyParser.json());

app.post("/webhook", upload.none(), async (req, res) => {
  try {
    const contentType = req.headers["content-type"];

    // Check if content-type is undefined or empty
    if (!contentType) {
      return res.status(400).json({ message: "Content type is missing." });
    }

    let fileData = "";
    let fileName = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = req.body;

      if (!formData) {
        return res.status(400).json({ message: "Form data is missing." });
      }

      fileData = JSON.stringify(formData, null, 2);
      fileName = "form-data.txt";
    } else if (contentType.includes("application/json")) {
      const jsonData = req.body;

      if (!jsonData) {
        return res.status(400).json({ message: "JSON data is missing." });
      }

      fileData = JSON.stringify(jsonData, null, 2);
      fileName = "json-data.txt";
    } else {
      return res.status(400).json({ message: "Unsupported content type." });
    }

    // Define the file path for the temporary file
    const filePath = path.join(__dirname, fileName);

    // Write the data to a file (ensure fileData is not undefined)
    fs.writeFileSync(filePath, fileData, { encoding: "utf8" });

    // Send the file to the Discord webhook
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    await axios.post(discordWebhookUrl, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    // Delete the file after processing
    fs.unlinkSync(filePath);

    return res
      .status(200)
      .json({ message: "Data sent to Discord as a file and deleted." });
  } catch (error) {
    console.error("Error sending data to Discord:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
