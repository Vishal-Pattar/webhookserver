const express = require('express');
const axios = require('axios');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Configure multer to handle multipart/form-data (file uploads and form fields)
const upload = multer();

// Middleware to parse JSON bodies (if needed)
app.use(express.json());

// Route to handle all incoming requests with multipart/form-data
app.all('*', upload.any(), async (req, res) => {
    try {
        // Create an object to hold form data and any uploaded files
        const formData = {};
        
        // Populate formData with regular form fields
        req.body && Object.keys(req.body).forEach(key => {
            formData[key] = req.body[key];
        });
        
        // If there are any uploaded files, add them to formData
        if (req.files && req.files.length > 0) {
            formData.files = req.files.map(file => ({
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
            }));
        }

        const requestDetails = {
            method: req.method,
            headers: req.headers,
            body: formData,  // This contains both form fields and file metadata
            query: req.query,
            params: req.params,
            url: req.originalUrl,
            ip: req.ip,
            protocol: req.protocol,
            hostname: req.hostname,
        };

        // Send the request details to Discord
        await axios.post(DISCORD_WEBHOOK_URL, {
            content: `New request received:\n\`\`\`json\n${JSON.stringify(requestDetails, null, 2)}\n\`\`\``,
        });

        res.status(200).send('Form data and files received and sent to Discord.');
    } catch (error) {
        res.status(500).send('An error occurred.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
