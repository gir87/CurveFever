import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useGameSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [gridSize, setGridSize] = useState<number>(40);
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io({
      path: "/game/socket.io"
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setPlayerId(newSocket.id || null);
    });

    newSocket.on("init", (data: { gridSize: number }) => {
      setGridSize(data.gridSize);
    });

    newSocket.on("gameState", (state: any) => {
      setGameState(state);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinGame = (name: string) => {
    socket?.emit("join", name);
  };

  const setDirection = (dx: number, dy: number) => {
    socket?.emit("direction", { dx, dy });
  };

  return { gameState, gridSize, playerId, joinGame, setDirection };
}
