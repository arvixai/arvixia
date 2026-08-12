const API_URL = "https://arvixia.onrender.com";

const messagesEl = document.getElementById("messages");
const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

let history = [];

async function checkHealth() {
  try {
    const res = await fetch(`${API_URL}/api/health`);
    const data = await res.json();

    if (data.keyConfigured) {
      statusDot.classList.add("online");
      statusText.textContent = "online";
    } else {
      statusDot.classList.add("offline");
      statusText.textContent = "API não configurada";
    }
  } catch (error) {
    statusDot.classList.add("offline");
    statusText.textContent = "servidor offline";
  }
}

checkHealth();

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 160) + "px";
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});

newChatBtn.addEventListener("click", () => {
  history = [];
  messagesEl.innerHTML = "";

  addMessage(
    "assistant",
    "Olá! Eu sou a <strong>ARVIX IA</strong>. Como posso te ajudar hoje?"
  );
});

function addMessage(role, htmlContent) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${role}`;

  const avatar = document.createElement("div");
  avatar.className =
    `avatar ${role === "user" ? "user-avatar" : "assistant-avatar"}`;

  avatar.textContent = role === "user" ? "V" : "A";

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

  addMessage("user", escapeHtml(text));

  history.push({
    role: "user",
    content: text
  });

  input.value = "";
  input.style.height = "auto";
  sendBtn.disabled = true;

  const typingBubble = addMessage(
    "assistant",
    '<span class="typing"><span></span><span></span><span></span></span>'
  );

  try {
    const res = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: history
      })
    });

    const data = await res.json();

    if (!res.ok) {
      typingBubble.innerHTML =
        `⚠️ ${escapeHtml(data.error || "Erro ao falar com a IA.")}`;
      return;
    }

    typingBubble.innerHTML = escapeHtml(data.reply);

    history.push({
      role: "assistant",
      content: data.reply
    });

  } catch (error) {
    console.error(error);

    typingBubble.innerHTML =
      "⚠️ Não foi possível conectar ao servidor.";
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
});
