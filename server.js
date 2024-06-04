const WebSocket = require("ws");
const http = require("http");

// Create an HTTP server
const server = http.createServer();

// Create a WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });

// Store connections based on user IDs
const clients = {};

wss.on("connection", (ws, req) => {
  // Get the user ID from query params or headers if necessary
  const userId = new URL(
    req.url,
    `http://${req.headers.host}`
  ).searchParams.get("userId");

  console.log(`User ${userId} connected`);

  if (userId) {
    if (!clients[userId]) {
      clients[userId] = [];
    }
    clients[userId].push(ws);

    ws.on("close", () => {
      clients[userId] = clients[userId].filter((client) => client !== ws);
      if (clients[userId].length === 0) {
        delete clients[userId];
      }
    });
  }

  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === "STREAM_START") {
      const { userId, username, followers } = parsedMessage;

      followers.forEach((followerId) => {
        if (clients[followerId]) {
          clients[followerId].forEach((client) => {
            client.send(
              JSON.stringify({
                type: "STREAM_START",
                userId: userId,
                username: username,
              })
            );
          });
        }
      });
    }
  });
});

// Start the server on port 8080
server.listen(8080, () => {
  console.log("WebSocket server started on port 8080");
});

module.exports = wss;
