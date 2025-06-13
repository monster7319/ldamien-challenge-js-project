require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(__dirname));

// Initialisation de la base SQLite
const db = new sqlite3.Database('messages.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Fonctionnalité supplémentaire : fonction pour stocker un message
function storeMessage(email, message, callback) {
  db.run(
    `INSERT INTO messages (email, message) VALUES (?, ?)`,
    [email, message],
    function (err) {
      callback(err);
    }
  );
}

// Transporteur Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Route POST pour recevoir et stocker les messages, puis envoyer l'email
app.post('/send', async (req, res) => {
    try {
        const { email, message } = req.body;

        // Appel de la fonctionnalité de stockage
        storeMessage(email, message, (err) => {
          if (err) {
            console.error('Erreur lors de l\'insertion en base :', err);
            // On continue quand même pour l’envoi d’email
          }
        });

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

// (Optionnel) Route GET pour récupérer tous les messages
app.get('/messages', (req, res) => {
  db.all('SELECT * FROM messages ORDER BY date DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération' });
      return;
    }
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
