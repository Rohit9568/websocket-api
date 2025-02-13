import express, { Express } from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket: Socket) => {
  socket.on("message", (message: any) => {
    const modifiedMessage = { ...message, owner: false };
    socket.emit("message", modifiedMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
