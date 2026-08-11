// ==========================================================
// ARVIX IA - Backend Server
// ==========================================================
// Este servidor recebe as mensagens do chat (frontend),
// envia para a API da OpenAI e devolve a resposta da IA.
//
// A chave de API NUNCA fica escrita aqui no código.
// Ela é lida do arquivo .env (veja .env.example) para não
// vazar quando você publicar o projeto no GitHub.
// ==========================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Verificação da chave de API ----
if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "\n⚠️  ATENÇÃO: OPENAI_API_KEY não encontrada.\n" +
      "   Crie um arquivo .env na pasta 'backend' com o conteúdo:\n" +
      "   OPENAI_API_KEY=sua_chave_aqui\n"
  );
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ---- Configurações da IA (personalize à vontade) ----
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const SYSTEM_PROMPT =
  process.env.ARVIX_SYSTEM_PROMPT ||
  "Você é a ARVIX IA, uma assistente de inteligência artificial profissional, " +
    "educada, objetiva e prestativa. Responda sempre em português do Brasil, " +
    "de forma clara e organizada, a não ser que o usuário peça outro idioma.";

app.use(cors());
app.use(express.json());

// Serve os arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "..", "frontend")));

// ---- Rota principal do chat ----
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Envie um array 'messages' válido." });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error:
          "Chave de API não configurada no servidor. Configure OPENAI_API_KEY no arquivo .env.",
      });
    }

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("Erro ao chamar a API da OpenAI:", err.message);
    res.status(500).json({
      error:
        "Ocorreu um erro ao falar com a IA. Verifique sua chave de API e sua conexão.",
    });
  }
});

// ---- Rota de verificação de saúde do servidor ----
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", model: MODEL, keyConfigured: !!process.env.OPENAI_API_KEY });
});

app.listen(PORT, () => {
  console.log(`\n🚀 ARVIX IA rodando em http://localhost:${PORT}\n`);
});
