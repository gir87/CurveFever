import React, { useState } from "react";
import { useGameSocket } from "./hooks/useGameSocket";
import { Lobby } from "./components/Lobby";
import { GameCanvas } from "./components/GameCanvas";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const { gameState, gridSize, playerId, joinGame, setDirection } = useGameSocket();
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoin = (name: string) => {
    joinGame(name);
    setHasJoined(true);
  };

  const players = gameState ? Object.values(gameState.players) : [];
  const sortedPlayers = [...players].sort((a: any, b: any) => b.score - a.score);

  return (
    <div className="min-h-screen bg-[#E4E3E0] font-sans text-[#141414]">
      <AnimatePresence mode="wait">
        {!hasJoined ? (
          <Lobby key="lobby" onJoin={handleJoin} />
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col lg:flex-row h-screen overflow-hidden"
          >
            {/* Main Game Area */}
            <div className="flex-1 flex items-center justify-center p-4 bg-[#E4E3E0]">
              <GameCanvas
                gameState={gameState}
                gridSize={gridSize}
                playerId={playerId}
                onDirectionChange={setDirection}
              />
            </div>

            {/* Sidebar / Leaderboard */}
            <div className="w-full lg:w-80 bg-white border-l-4 border-[#141414] flex flex-col shadow-[-8px_0px_0px_0px_rgba(20,20,20,0.1)]">
              <div className="p-6 border-b-4 border-[#141414] bg-[#141414] text-white">
                <h2 className="text-2xl font-mono font-bold tracking-tighter italic uppercase">
                  LEADERBOARD
                </h2>
                <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest mt-1">
                  REALTIME_ARENA_STATS
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {sortedPlayers.map((player: any, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center p-3 border-2 border-[#141414] transition-all ${
                      player.id === playerId ? "bg-[#141414] text-white scale-[1.02]" : "bg-white"
                    } ${!player.alive ? "opacity-40 grayscale" : ""}`}
                  >
                    <div className="w-8 font-mono text-xs opacity-50">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div
                      className="w-4 h-4 mr-3 border border-black/20"
                      style={{ backgroundColor: player.color }}
                    />
                    <div className="flex-1 font-mono text-sm truncate uppercase font-bold">
                      {player.name}
                    </div>
                    <div className="font-mono text-sm font-bold">
                      {player.score}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t-4 border-[#141414] bg-[#E4E3E0]">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] opacity-50 uppercase">ACTIVE_PLAYERS</span>
                    <span className="font-mono text-sm font-bold">{players.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] opacity-50 uppercase">ARENA_STATUS</span>
                    <span className="font-mono text-sm font-bold text-green-600">OPERATIONAL</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
