import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, TrendingDown, Medal } from "lucide-react";
import { motion } from "framer-motion";

export default function PlayerCard({ player, rank, totalPlayers }) {
  const isPodium = rank <= 3;
  const isSerieB = rank > totalPlayers - 4;
  
  const getPodiumIcon = () => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-[#d4af37]" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-[#cd7f32]" />;
    return null;
  };

  const getBgClass = () => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-50 to-amber-50 border-[#d4af37] border-2";
    if (isPodium) return "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300 border-2";
    if (isSerieB) return "bg-gradient-to-br from-red-50 to-rose-50 border-red-200 border";
    return "bg-white border-gray-200 border";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
    >
      <Card className={`${getBgClass()} shadow-md hover:shadow-lg transition-all duration-300`}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                isPodium ? "bg-gradient-to-br from-[#1a4d2e] to-[#2d5a3d] text-white" :
                isSerieB ? "bg-red-100 text-red-600" :
                "bg-gray-100 text-gray-600"
              }`}>
                {rank}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{player.nome}</h3>
                  {isPodium && getPodiumIcon()}
                  {isSerieB && <TrendingDown className="w-5 h-5 text-red-500" />}
                </div>
                <p className="text-sm text-gray-500">
                  {player.vitorias} V | {player.derrotas} D
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-3xl font-bold ${
                isPodium ? "text-[#1a4d2e]" :
                isSerieB ? "text-red-600" :
                "text-gray-700"
              }`}>
                {player.winRate}%
              </div>
              <p className="text-xs text-gray-500">{player.totalJogos} jogos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
