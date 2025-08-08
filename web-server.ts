// ws-server/server.ts
import { WebSocketServer } from "ws";
import http from "http";

const PORT = process.env.PORT || 3001;

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("message", (message) => {
    console.log("Received:", message.toString());

    // Echo back
    socket.send(`Server received: ${message}`);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket Server running on ws://localhost:${PORT}`);
});
