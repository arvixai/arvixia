require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir o frontend
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// Verificação do servidor
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    keyConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Chat da ARVIX
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Nenhuma mensagem foi enviada."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Chave do Gemini não configurada no arquivo .env."
      });
    }

    const texto = messages
      .map((message) => `${message.role}: ${message.content}`)
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
                  text:
                    "Você é a ARVIX IA, uma assistente de inteligência artificial profissional, educada, objetiva e prestativa. Responda sempre em português do Brasil.\n\n" +
                    texto
                }
              ]
            }
          ]
        })
      }
    );

    const data = await resposta.json();

    if (!resposta.ok) {
      console.error("Erro do Gemini:", data);

      return res.status(500).json({
        error: data.error?.message || "Erro ao chamar o Gemini."
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Não consegui gerar uma resposta.";

    res.json({ reply });

  } catch (error) {
    console.error("Erro no servidor:", error);

    res.status(500).json({
      error: "Erro interno ao conectar com a IA."
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 ARVIX IA rodando em http://localhost:${PORT}`);
});