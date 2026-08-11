// ==========================================================
// ARVIX IA - Lógica do frontend
// ==========================================================

const messagesEl = document.getElementById("messages");
const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

// Histórico da conversa (enviado para o backend a cada mensagem)
let history = [];

// ---- Verifica se o backend / chave de API estão ok ----
async function checkHealth() {
  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    if (data.keyConfigured) {
      statusDot.classList.add("online");
      statusText.textContent = `online (${data.model})`;
    } else {
      statusDot.classList.add("offline");
      statusText.textContent = "chave de API não configurada";
    }
  } catch (e) {
    statusDot.classList.add("offline");
    statusText.textContent = "servidor offline";
  }
}
checkHealth();

// ---- Auto-resize da caixa de texto ----
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 160) + "px";
});

// ---- Envia mensagem ao pressionar Enter (sem Shift) ----
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});

newChatBtn.addEventListener("click", () => {
  history = [];
  messagesEl.innerHTML = "";
  addMessage("assistant", "Olá! Eu sou a <strong>ARVIX IA</strong>. Como posso te ajudar hoje?");
});

function addMessage(role, htmlContent) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${role}`;

  const avatar = document.createElement("div");
  avatar.className = `avatar ${role === "user" ? "user-avatar" : "assistant-avatar"}`;
  avatar.textContent = role === "user" ? "Você".charAt(0) : "A";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = htmlContent;

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  messagesEl.appendChild(wrapper);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return bubble;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  // Mostra a mensagem do usuário
  addMessage("user", escapeHtml(text));
  history.push({ role: "user", content: text });

  input.value = "";
  input.style.height = "auto";
  sendBtn.disabled = true;

  // Indicador de "digitando..."
  const typingBubble = addMessage(
    "assistant",
    '<span class="typing"><span></span><span></span><span></span></span>'
  );

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });

    const data = await res.json();

    if (!res.ok) {
      typingBubble.innerHTML = `⚠️ ${escapeHtml(data.error || "Erro ao falar com a IA.")}`;
      return;
    }

    typingBubble.innerHTML = escapeHtml(data.reply);
    history.push({ role: "assistant", content: data.reply });
  } catch (err) {
    typingBubble.innerHTML = "⚠️ Não foi possível conectar ao servidor.";
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
});
