import { WebSocketServer } from "ws";
import readline from "node:readline";
import process from "node:process";

const port = Number.parseInt(process.env.COMMAND_SERVER_PORT ?? "3001", 10);

if (Number.isNaN(port)) {
  console.error("COMMAND_SERVER_PORT must be a valid number");
  process.exit(1);
}

const wss = new WebSocketServer({ port });

const clients = new Set();

wss.on("connection", (socket, request) => {
  clients.add(socket);

  const clientId = `${request.socket.remoteAddress ?? "unknown"}:${
    request.socket.remotePort ?? "?"
  }`;

  console.log(`Client connected (${clientId}). Active clients: ${clients.size}`);

  socket.on("close", () => {
    clients.delete(socket);
    console.log(
      `Client disconnected (${clientId}). Active clients: ${clients.size}`,
    );
  });

  socket.on("error", (error) => {
    clients.delete(socket);
    console.error(`Client error (${clientId}):`, error);
  });
});

const broadcast = (payload) => {
  const message = JSON.stringify(payload);
  let sent = 0;

  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
      sent += 1;
    }
  });

  console.log(`Sent command to ${sent} client${sent === 1 ? "" : "s"}.`);
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "command> ",
});

console.log(
  `Command server listening on ws://localhost:${port}\n` +
    "Type JSON payloads or use 'place <x> <y> <towerType>'.\n" +
    "Tower types map to entries in towers/TowerFactory.ts.",
);

rl.prompt();

const handleLine = (line) => {
  const trimmed = line.trim();
  if (!trimmed) {
    rl.prompt();
    return;
  }

  if (trimmed.startsWith("place ")) {
    const [, xStr, yStr, type] = trimmed.split(/\s+/);

    const x = Number.parseInt(xStr, 10);
    const y = Number.parseInt(yStr, 10);

    if (Number.isNaN(x) || Number.isNaN(y) || !type) {
      console.error(
        "Usage: place <x> <y> <towerType> (e.g. 'place 6 4 SPIKE')",
      );
      rl.prompt();
      return;
    }

    broadcast({
      type: "place_tower",
      position: { x, y },
      towerType: type,
    });
    rl.prompt();
    return;
  }

  try {
    const payload = JSON.parse(trimmed);
    broadcast(payload);
  } catch (error) {
    console.error(
      "Could not parse input as JSON or place command.\n" +
        "Example: {\"type\":\"place_tower\",\"position\":{\"x\":6,\"y\":4},\"towerType\":\"SPIKE\" }",
    );
  }

  rl.prompt();
};

rl.on("line", handleLine);
rl.on("SIGINT", () => {
  rl.close();
});

const shutdown = () => {
  console.log("\nShutting down command server...");
  rl.close();
  wss.close(() => {
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(0);
  }, 100).unref();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

