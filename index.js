const express = require("express");
const axios = require("axios");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Replace this with your Discord webhook URL
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Middleware to parse incoming JSON data from Jotform
app.use(bodyParser.json());

// Endpoint to receive Jotform submissions
app.post("/webhook", async (req, res) => {
  try {
    const formData = req.body;

    // Log the data received from Jotform
    console.log("Received Jotform data:", formData);

    // Save the form data to a file (optional)
    const fileName = `form-data-${Date.now()}.json`;
    fs.writeFileSync(fileName, JSON.stringify(formData, null, 2), "utf-8");

    // Format data to send to Discord (customize this as needed)
    const discordMessage = {
      content: "New Jotform Submission",
      embeds: [
        {
          title: "Jotform Submission Details",
          description: `Form ID: ${formData.formID}\nSubmission ID: ${formData.submissionID}`,
          fields: Object.keys(formData).map((key) => ({
            name: key,
            value: formData[key],
            inline: true,
          })),
          color: 3447003,
        },
      ],
    };

    // Send data to Discord webhook
    await axios.post(DISCORD_WEBHOOK_URL, discordMessage);

    // Respond to Jotform that data was successfully received
    res.status(200).send("Form submission received and sent to Discord.");
  } catch (error) {
    console.error("Error handling Jotform submission:", error);
    res.status(500).send("An error occurred while processing the submission.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
