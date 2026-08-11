require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "ARVIX IA está funcionando!"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Mensagens inválidas."
      });
    }

    const texto = messages
      .map(m => `${m.role}: ${m.content}`)
      .join("\n");

    const resposta = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Você é a ARVIX IA, uma assistente inteligente, profissional e prestativa. Responda em português do Brasil.

${texto}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await resposta.json();

    if (!resposta.ok) {
      console.error(data);
      return res.status(500).json({
        error: "Erro na API do Gemini."
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Não consegui gerar uma resposta.";

    res.json({ reply });

  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({
      error: "Erro ao conectar com a IA."
    });
  }
});

app.listen(PORT, () => {
  console.log(`ARVIX IA rodando em http://localhost:${PORT}`);
});