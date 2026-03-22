import React, { useEffect, useRef } from "react";

interface GameCanvasProps {
  gameState: any;
  gridSize: number;
  playerId: string | null;
  onDirectionChange: (dx: number, dy: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  gridSize,
  playerId,
  onDirectionChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          onDirectionChange(0, -1);
          break;
        case "ArrowDown":
          onDirectionChange(0, 1);
          break;
        case "ArrowLeft":
          onDirectionChange(-1, 0);
          break;
        case "ArrowRight":
          onDirectionChange(1, 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onDirectionChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = canvas.width / gridSize;

    // Clear canvas
    ctx.fillStyle = "#141414";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = "#FFFFFF";
    gameState.food.forEach((f: any) => {
      ctx.fillRect(f.x * cellSize + 2, f.y * cellSize + 2, cellSize - 4, cellSize - 4);
    });

    // Draw players
    Object.values(gameState.players).forEach((player: any) => {
      if (!player.alive) return;

      ctx.fillStyle = player.color;
      
      // Draw body
      player.body.forEach((part: any) => {
        ctx.fillRect(part.x * cellSize + 1, part.y * cellSize + 1, cellSize - 2, cellSize - 2);
      });

      // Draw head
      ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
      
      // Draw name label
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(player.name, player.x * cellSize + cellSize / 2, player.y * cellSize - 5);
    });
  }, [gameState, gridSize]);

  return (
    <div className="relative border-4 border-[#141414] shadow-2xl">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="block bg-[#141414]"
      />
      {!gameState?.players[playerId || ""]?.alive && gameState?.players[playerId || ""] && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center p-8 border-2 border-red-500 bg-black">
            <h2 className="text-4xl font-mono text-red-500 mb-4 tracking-tighter italic">GAME OVER</h2>
            <p className="text-white font-mono text-sm opacity-50">REFRESH TO REJOIN THE ARENA</p>
          </div>
        </div>
      )}
    </div>
  );
};
