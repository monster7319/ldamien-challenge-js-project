require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(__dirname));

// Connexion PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Création de la table messages si elle n'existe pas
pool.query(`
  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Fonction pour stocker un message
async function storeMessage(email, message) {
  await pool.query(
    'INSERT INTO messages (email, message) VALUES ($1, $2)',
    [email, message]
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

// Route POST pour enregistrer et envoyer le message
app.post('/send', async (req, res) => {
    try {
        const { email, message } = req.body;

        await storeMessage(email, message);

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
app.get('/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => { // '0.0.0.0' pour Railway[1]
  console.log('Server running on port', PORT);
});
