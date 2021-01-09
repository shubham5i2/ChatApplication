const socket = io();

const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const messageContainer = document.querySelector(".container");
const greetingContainer = document.getElementById("greeting");

const name = prompt("Enter your name to join");
socket.emit("new-user-joined", name);
const greetMessage = document.createElement("div");
greetingContainer.append(`Welcome to iDiscuss ${name}`);

socket.on("user-connected", (name) => {
  appendMessage(`${name} joined the chat`, "right");
});

socket.on("receive-message", (data) => {
  appendMessage(`${data.name}:${data.message}`, "left");
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

socket.on("user-disconnected", (name) => {
  appendMessage(`${name} has left the chat`, "left");
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`, "right");
  socket.emit("send-message", message);
  messageInput.value = "";
  messageInput.focus();
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

function appendMessage(message, position) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
}
