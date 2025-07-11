require('dotenv').config();
const OpenAI = require("openai");
const express = require('express');
const cors = require('cors');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

// Configuración CORS mejorada para permitir GitHub Pages
app.use(cors({
  origin: [
    'https://koval71.github.io/4Fam./',  // Tu GitHub Pages correcto
    'https://koval71.github.io',         // Por si acaso
    'http://localhost:8000',             // Para pruebas locales
    'http://localhost:3000',             // Para pruebas locales
    'http://127.0.0.1:8000'             // Para pruebas locales
  ],
  credentials: true
}));

app.use(express.json());

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
        });
        res.json({ reply: response.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));