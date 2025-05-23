require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(__dirname)); // Sert tous les fichiers du dossier "formulaire"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/send', async (req, res) => {
    try {
        const { email, message } = req.body;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Nouveau message depuis le formulaire',
            text: message
        });
        res.json({ message: "Message envoyé avec succès !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Échec de l'envoi" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
