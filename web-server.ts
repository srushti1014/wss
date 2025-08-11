// import { WebSocketServer, WebSocket } from "ws";
// import http from "http";

// const PORT = process.env.PORT || 3001;

// // Store mapping of socket -> spaceId
// const clients = new Map<WebSocket, string>();

// const server = http.createServer((req, res) => {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("OK");
// });
// const wss = new WebSocketServer({ server });

// wss.on("connection", (socket) => {
//   console.log("New client connected");

//   socket.on("message", (message) => {
//     try {
//       const parsed = JSON.parse(message.toString());
//       console.log("Received:", parsed);

//       if (parsed.type === "join-room") {
//         const spaceId = parsed.data?.spaceId;
//         if (spaceId) {
//           clients.set(socket, spaceId);
//           console.log(`Socket joined space ${spaceId}`);
//         }
//         return; // no need to broadcast join-room
//       }

//       // Broadcast only to clients in the same spaceId
//       const spaceId = parsed.data?.spaceId;
//       if (spaceId) {
//         wss.clients.forEach((client) => {
//           if (
//             client.readyState === WebSocket.OPEN &&
//             clients.get(client) === spaceId
//           ) {
//             client.send(JSON.stringify(parsed));
//           }
//         });
//       }
//     } catch (err) {
//       console.error("Invalid message", err);
//     }
//   });

//   socket.on("close", () => {
//     console.log("Client disconnected");
//     clients.delete(socket);
//   });
// });

// server.listen(PORT, () => {
//   console.log(`WebSocket Server running on ws://localhost:${PORT}`);
// });



import { WebSocketServer, WebSocket } from "ws";
import http from "http";

const PORT = process.env.PORT || 3001;

// roomId -> Set of sockets
const rooms: Map<string, Set<WebSocket>> = new Map();

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket: WebSocket) => {
  let joinedRoom: string | null = null;

  socket.on("message", (msg: string) => {
    try {
      const { type, data } = JSON.parse(msg.toString()) as {
        type: string;
        data: any;
      };

      if (type === "join-room") {
        joinedRoom = data.spaceId;
        if (!joinedRoom) {
          console.warn("join-room called without spaceId");
          return;
        }
        if (!rooms.has(joinedRoom)) {
          rooms.set(joinedRoom, new Set());
        }
        rooms.get(joinedRoom)!.add(socket);
        console.log(`Client joined room ${joinedRoom}`);
        return;
      }

      // Broadcast all other events to the same room
      if (joinedRoom && rooms.has(joinedRoom)) {
        for (const client of rooms.get(joinedRoom)!) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type, data }));
          }
        }
      }
    } catch (err) {
      console.error("Invalid message format", err);
    }
  });

  socket.on("close", () => {
    if (joinedRoom && rooms.has(joinedRoom)) {
      rooms.get(joinedRoom)!.delete(socket);
      if (rooms.get(joinedRoom)!.size === 0) {
        rooms.delete(joinedRoom);
      }
    }
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket Server running on ws://localhost:${PORT}`);
});


// import { WebSocketServer } from "ws";
// import http from "http";

// const PORT = process.env.PORT || 3001;

// // const server = http.createServer();
// const server = http.createServer((req, res) => {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("OK");
// });
// const wss = new WebSocketServer({ server });


// wss.on("connection", (socket) => {
//   console.log("New client connected");

//   socket.on("message", (message) => {
//     console.log("Received:", message.toString());

//     socket.send(message.toString());
//   });

//   socket.on("close", () => {
//     console.log("Client disconnected");
//   });
// });

// server.listen(PORT, () => {
//   console.log(`WebSocket Server running on ws://localhost:${PORT}`);
// });
