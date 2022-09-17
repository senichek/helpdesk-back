// Chat server (Socket IO)
const cors = require("cors");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Private messaging:   https://socket.io/get-started/private-messaging-part-1/
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

// Get the list of all connected clients (users)
io.on("connection", (socket) => {
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      socketId: id,
      userId: socket.username, // username is ID of user in database
    });
  }
  console.log("Users connected to chat server >>>", users);

  // Emit event to all connected clients except the sender
  socket.broadcast.emit("connected_chat_users", users);
});

module.exports = server;
