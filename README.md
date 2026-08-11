# 🤖 ARVIX IA

Assistente de inteligência artificial estilo ChatGPT, construída do zero com **Node.js + Express** no backend e **HTML/CSS/JS puro** no frontend. Pronta para publicar no GitHub.

![status](https://img.shields.io/badge/status-pronto-brightgreen)

---

## 📁 Estrutura do projeto

```
arvix-ia/
├── backend/
│   ├── server.js         # Servidor Express + chamada à API da IA
│   ├── package.json
│   └── .env.example      # Modelo do arquivo de variáveis (SEM chave real)
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .gitignore
└── README.md
```

---

## 🔑 Onde colocar a chave da API (passo a passo)

1. Entre na pasta `backend`.
2. Copie o arquivo `.env.example` e renomeie a cópia para **`.env`**.
   ```bash
   cd backend
   cp .env.example .env
   ```
3. Abra o arquivo `.env` e cole sua chave da OpenAI no lugar indicado:
   ```
   OPENAI_API_KEY=sk-sua-chave-aqui
   ```
   👉 Você gera uma chave gratuitamente (com créditos iniciais/pagos) em:
   https://platform.openai.com/api-keys

4. **Nunca** apague a linha `.env` do `.gitignore` — ela existe para garantir que sua chave real **não** vá para o GitHub. O que vai para o GitHub é apenas o `.env.example` (sem a chave).

> Se você preferir usar outro provedor de IA (Anthropic Claude, Google Gemini, DeepSeek, etc.), me avise que eu adapto o `server.js` — a estrutura já foi pensada para isso ser simples.

---

## ▶️ Como rodar localmente

Pré-requisito: [Node.js 18+](https://nodejs.org) instalado.

```bash
cd backend
npm install
npm start
```

O servidor vai subir em: **http://localhost:3000**

Abra esse endereço no navegador e pronto — a ARVIX IA já está funcionando, com o frontend sendo servido automaticamente pelo próprio backend.

---

## 🚀 Como publicar no GitHub

```bash
cd arvix-ia
git init
git add .
git commit -m "ARVIX IA - versão inicial"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/arvix-ia.git
git push -u origin main
```

Como o `.env` está no `.gitignore`, sua chave **não** será enviada. Quem clonar o projeto precisará criar o próprio `.env` seguindo o passo a passo acima.

---

## ☁️ Como colocar no ar (deploy gratuito)

Você pode hospedar o backend (que já serve o frontend junto) em serviços como:

- **Render** (render.com) — plano gratuito, ideal para Node/Express
- **Railway** (railway.app)
- **Fly.io**

Em qualquer um deles, o processo é parecido:
1. Conecte o repositório do GitHub.
2. Defina o comando de start: `npm start` (dentro da pasta `backend`).
3. Nas configurações do projeto, adicione a variável de ambiente `OPENAI_API_KEY` com sua chave (isso substitui o arquivo `.env`, que só é usado localmente).
4. Publique — sua ARVIX IA estará online com uma URL pública.

---

## ⚙️ Personalização

- **Trocar o "jeito de falar" da IA:** edite `ARVIX_SYSTEM_PROMPT` no `.env`.
- **Trocar o modelo:** edite `OPENAI_MODEL` no `.env` (ex.: `gpt-4o`, `gpt-4o-mini`, `gpt-3.5-turbo`).
- **Mudar cores/visual:** edite `frontend/style.css` (as cores estão centralizadas em `:root`).
- **Trocar o nome/logo:** edite o texto "ARVIX" em `frontend/index.html`.

---

## 🛠️ Tecnologias usadas

- Node.js + Express (backend)
- SDK oficial da OpenAI (`openai`)
- HTML, CSS e JavaScript puros (frontend, sem frameworks — leve e fácil de entender)

---

## 📄 Licença

Este projeto é livre para uso, modificação e distribuição.
