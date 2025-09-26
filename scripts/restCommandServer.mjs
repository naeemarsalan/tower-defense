import { createServer } from "node:http";
import process from "node:process";
import { WebSocketServer } from "ws";

const port = Number.parseInt(process.env.COMMAND_SERVER_PORT ?? "3001", 10);

if (Number.isNaN(port)) {
  console.error("COMMAND_SERVER_PORT must be a valid number");
  process.exit(1);
}

const clients = new Set();

const boardState = createBoardState();

const httpServer = createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, {
      error: "Invalid request",
      details: "Missing request URL",
    });
    return;
  }

  const url = new URL(req.url, `http://localhost:${port}`);

  if (req.method === "GET" && url.pathname === "/board") {
    sendJson(res, 200, boardState.getSnapshot());
    return;
  }

  if (req.method === "POST" && url.pathname === "/towers") {
    try {
      const body = await readRequestBody(req);
      const validationError = validateTowerPayload(body);

      if (validationError) {
        sendJson(res, 400, { error: "Invalid payload", details: validationError });
        return;
      }

      const payload = {
        type: "place_tower",
        position: { x: body.x, y: body.y },
        towerType: body.towerType,
      };

      boardState.placeTower(payload.position, payload.towerType);
      broadcast(payload);
      sendJson(res, 201, { status: "ok" });
    } catch (error) {
      if (error instanceof SyntaxError) {
        sendJson(res, 400, {
          error: "Invalid JSON",
          details: "Request body must be valid JSON",
        });
        return;
      }

      if ((error?.code ?? null) === "PAYLOAD_TOO_LARGE") {
        sendJson(res, 400, {
          error: "Invalid payload",
          details: "Payload too large",
        });
        return;
      }

      console.error("Error handling request:", error);
      sendJson(res, 500, {
        error: "Internal server error",
      });
    }

    return;
  }

  if (req.method === "OPTIONS" && ["/towers", "/board"].includes(url.pathname)) {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.end();
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

const wss = new WebSocketServer({ server: httpServer });

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

httpServer.listen(port, () => {
  console.log(
    `REST command server listening on http://localhost:${port} and ws://localhost:${port}`,
  );
});

const shutdown = () => {
  console.log("\nShutting down REST command server...");
  httpServer.close(() => {
    wss.close(() => {
      process.exit(0);
    });
  });

  setTimeout(() => {
    process.exit(0);
  }, 100).unref();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify(payload));
}

function validateTowerPayload(body) {
  if (typeof body !== "object" || body === null) {
    return "Body must be a JSON object";
  }

  const { x, y, towerType } = body;

  if (typeof x !== "number" || !Number.isFinite(x)) {
    return "'x' must be a finite number";
  }

  if (typeof y !== "number" || !Number.isFinite(y)) {
    return "'y' must be a finite number";
  }

  if (typeof towerType !== "string" || towerType.trim() === "") {
    return "'towerType' must be a non-empty string";
  }

  return null;
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.setEncoding("utf8");

    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        const error = new Error("Payload too large");
        error.code = "PAYLOAD_TOO_LARGE";
        req.destroy(error);
        reject(error);
      }
    });

    req.on("end", () => {
      if (data.length === 0) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(new SyntaxError("Invalid JSON"));
      }
    });

    req.on("error", (error) => {
      reject(error);
    });
  });
}

function createBoardState() {
  const towers = new Map();

  return {
    placeTower(position, towerType) {
      const key = `${position.x}:${position.y}`;
      towers.set(key, {
        x: position.x,
        y: position.y,
        towerType,
      });
    },
    getSnapshot() {
      return {
        towers: Array.from(towers.values()),
      };
    },
  };
}
