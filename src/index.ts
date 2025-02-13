import express, { Express } from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

dotenv.config();

const app: Express = express();

// Add CORS middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Add CSP headers using Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "wss://websocket-api-wqr5.onrender.com"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:  "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket: Socket) => {
  console.log("User connected");

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