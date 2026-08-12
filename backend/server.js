require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Teste do servidor
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    keyConfigured: !!process.env.OPENAI_API_KEY
  });
});

// Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Nenhuma mensagem foi enviada."
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Chave da OpenAI não configurada."
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é a ARVIX IA, uma assistente de inteligência artificial profissional, educada, objetiva e prestativa. Responda sempre em português do Brasil."
        },
        ...messages
      ]
    });

    const reply = completion.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "A OpenAI não retornou uma resposta."
      });
    }

    res.json({ reply });

  } catch (error) {
    console.error("Erro da OpenAI:", error);

    res.status(500).json({
      error: error.message || "Erro ao conectar com a OpenAI."
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 ARVIX IA rodando na porta ${PORT}`);
});
