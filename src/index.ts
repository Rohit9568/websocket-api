import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("message", (message) => {
    const modifiedMessage = { ...message, owner: false };
    socket.emit("message", modifiedMessage);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`WebSocket Server running on port ${PORT}`);
});
