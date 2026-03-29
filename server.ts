import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = process.env.PORT || 3000;
  const GRID_SIZE = 40;
  const TICK_RATE = 100; // ms

  interface Player {
    id: string;
    name: string;
    x: number;
    y: number;
    dx: number;
    dy: number;
    body: { x: number; y: number }[];
    color: string;
    score: number;
    alive: boolean;
  }

  interface GameState {
    players: Record<string, Player>;
    food: { x: number; y: number }[];
  }

  const gameState: GameState = {
    players: {},
    food: [],
  };

  const colors = [
    "#FF5555", "#55FF55", "#5555FF", "#FFFF55", 
    "#FF55FF", "#55FFFF", "#FFAA00", "#AA00FF"
  ];

  function spawnFood() {
    gameState.food.push({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    });
  }

  // Initial food
  for (let i = 0; i < 5; i++) spawnFood();

  io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    socket.on("join", (name: string) => {
      const color = colors[Object.keys(gameState.players).length % colors.length];
      gameState.players[socket.id] = {
        id: socket.id,
        name: name || "Anonymous",
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        dx: 1,
        dy: 0,
        body: [],
        color,
        score: 0,
        alive: true,
      };
      socket.emit("init", { gridSize: GRID_SIZE });
    });

    socket.on("direction", (dir: { dx: number; dy: number }) => {
      const player = gameState.players[socket.id];
      if (player && player.alive) {
        // Prevent 180 degree turns
        if (dir.dx !== -player.dx || dir.dy !== -player.dy) {
          player.dx = dir.dx;
          player.dy = dir.dy;
        }
      }
    });

    socket.on("disconnect", () => {
      delete gameState.players[socket.id];
      console.log("Player disconnected:", socket.id);
    });
  });

  // Game Loop
  setInterval(() => {
    const players = Object.values(gameState.players);
    
    players.forEach(player => {
      if (!player.alive) return;

      // Update position
      const nextX = (player.x + player.dx + GRID_SIZE) % GRID_SIZE;
      const nextY = (player.y + player.dy + GRID_SIZE) % GRID_SIZE;

      // Check collisions with self or others
      const allBodies = players.flatMap(p => p.body.concat({ x: p.x, y: p.y }));
      const collision = allBodies.some(part => part.x === nextX && part.y === nextY);

      if (collision) {
        player.alive = false;
        return;
      }

      // Move body
      player.body.push({ x: player.x, y: player.y });
      player.x = nextX;
      player.y = nextY;

      // Check food
      const foodIndex = gameState.food.findIndex(f => f.x === player.x && f.y === player.y);
      if (foodIndex !== -1) {
        gameState.food.splice(foodIndex, 1);
        player.score += 10;
        spawnFood();
      } else {
        player.body.shift();
      }
    });

    io.emit("gameState", gameState);
  }, TICK_RATE);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
