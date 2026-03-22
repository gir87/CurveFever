import React, { useState } from "react";
import { motion } from "motion/react";

interface LobbyProps {
  onJoin: (name: string) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ onJoin }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onJoin(name.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-[#E4E3E0] p-4"
    >
      <div className="w-full max-w-md bg-white border-4 border-[#141414] p-8 shadow-[12px_12px_0px_0px_#141414]">
        <h1 className="text-6xl font-mono font-bold text-[#141414] mb-8 tracking-tighter italic uppercase border-b-4 border-[#141414] pb-4">
          CURVE FEVER
        </h1>
        
        <p className="font-serif italic text-sm text-[#141414] opacity-60 mb-8 leading-relaxed">
          Welcome to the arena. Enter your handle to begin. Survive, grow, and outmaneuver your rivals in this high-stakes digital landscape.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-mono text-xs uppercase tracking-widest text-[#141414] opacity-50">
              PLAYER_IDENTIFIER
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ENTER NAME..."
              maxLength={15}
              className="w-full bg-[#E4E3E0] border-2 border-[#141414] p-4 font-mono text-lg focus:outline-none focus:bg-white transition-colors"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#141414] text-[#E4E3E0] font-mono text-xl p-4 uppercase tracking-widest hover:bg-[#FF5555] hover:text-[#141414] transition-all cursor-pointer active:translate-y-1"
          >
            INITIALIZE_GAME
          </button>
        </form>

        <div className="mt-12 grid grid-cols-2 gap-4 border-t-2 border-[#141414] pt-8">
          <div className="space-y-1">
            <span className="block font-mono text-[10px] opacity-40 uppercase">CONTROLS</span>
            <span className="block font-mono text-xs font-bold">ARROW_KEYS</span>
          </div>
          <div className="space-y-1">
            <span className="block font-mono text-[10px] opacity-40 uppercase">OBJECTIVE</span>
            <span className="block font-mono text-xs font-bold">SURVIVE_AND_GROW</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
