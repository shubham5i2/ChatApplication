const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });
  //   console.log("new user");
  //   socket.emit("chat-message", "Hello world");
  socket.on("send-message", (message) => {
    // console.log(message);
    socket.broadcast.emit("receive-message", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(80, () => {
  console.log("Connected to server on port 80");
});
