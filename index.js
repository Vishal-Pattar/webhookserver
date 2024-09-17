const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

app.post('/webhook', (req, res) => {
    const data = req.body.form_response.answers;

    let message = '';
    data.forEach(answer => {
        const question = answer.text;
        const answerText = answer.answer;
        message += `**${question}:** ${answerText}\n`;
    });

    // Send message to Discord
    axios.post(DISCORD_WEBHOOK_URL, { content: message })
        .then(() => res.status(200).send('OK'))
        .catch(error => res.status(500).send('Error sending to Discord'));

});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
