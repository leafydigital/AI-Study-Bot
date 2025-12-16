const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

const landing = document.getElementById("landing");
const chatContainer = document.querySelector(".chat-container");
const landingInput = document.getElementById("landingInput");

const waitingMessages = [
  "Just a sec",
  "Thinking...",
  "Let me check that",
  "Analyzing your question",
  "Almost there"
];

function getRandomWaitingText() {
  return waitingMessages[Math.floor(Math.random() * waitingMessages.length)];
}


function handleLandingEnter(event) {
  if (event.key === "Enter") {
    startChat();
  }
}

function startChat() {
  const text = landingInput.value.trim();
  if (!text) return;

  landing.classList.add("hidden");
  chatContainer.classList.remove("hidden");

  userInput.value = text;
  sendMessage();
}

function useSuggestion(text) {
  landingInput.value = text;
  landingInput.focus();
}


function createMessageElement(text, className) {
  const div = document.createElement("div");
  div.classList.add("message", className);

  // Convert **bold** to <strong>
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Convert bullet points
  text = text.replace(/^• (.*)$/gm, "<li>$1</li>");

  // Wrap list items in <ul>
  if (text.includes("<li>")) {
    text = "<ul>" + text + "</ul>";
  }

  // Convert new lines to <br>
  text = text.replace(/\n/g, "<br>");

  div.innerHTML = text; // IMPORTANT
  return div;
}

function formatBotText(text) {
  // Convert **bold** to <strong>
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Convert bullet points
  text = text.replace(/^• (.*)$/gm, "<li>$1</li>");

  // Wrap list items in <ul>
  if (text.includes("<li>")) {
    text = "<ul>" + text + "</ul>";
  }

  // Convert new lines to <br>
  text = text.replace(/\n/g, "<br>");

  return text;
}


function handleEnter(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}


function createLoader() {
  const loader = document.createElement("div");
  loader.classList.add("loader");
  return loader;
}

async function sendMessage() {
  const question = userInput.value.trim();
  if (!question) return;

  // User message
  chatBox.appendChild(createMessageElement(question, "user-message"));
  chatBox.scrollTop = chatBox.scrollHeight;
  userInput.value = "";

  // Waiting indicator
  const waiting = createWaitingIndicator(getRandomWaitingText());

  chatBox.appendChild(waiting);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await response.json();

    // Remove waiting indicator
    waiting.remove();

    // Bot message container
    const botMessage = document.createElement("div");
    botMessage.classList.add("message", "bot-message", "typing-text");
    chatBox.appendChild(botMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Apply typing animation
    const formatted = formatBotText(data.response);
    typeHTML(botMessage, formatted, 10);


  } catch (err) {
    waiting.remove();
    chatBox.appendChild(
      createMessageElement("Error fetching answer.", "bot-message")
    );
  }
}



function createWaitingIndicator(text = "Just a sec") {
  const container = document.createElement("div");
  container.classList.add("waiting");

  const loader = document.createElement("div");
  loader.classList.add("loader");

  const message = document.createElement("span");
  message.classList.add("typing-text");
  message.textContent = text;

  container.appendChild(loader);
  container.appendChild(message);

  return container;
}

function typeHTML(element, html, speed = 15) {
  let i = 0;
  element.innerHTML = "";

  const interval = setInterval(() => {
    element.innerHTML = html.slice(0, i);
    i++;

    if (i > html.length) {
      clearInterval(interval);
      element.classList.remove("typing-text");
    }
  }, speed);
}

