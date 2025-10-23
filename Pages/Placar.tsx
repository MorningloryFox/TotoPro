import React, { useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PlayerCard from "../components/placar/PlayerCard";

export default function PlacarPage() {
  const { data: jogadores, isLoading: loadingJogadores } = useQuery({
    queryKey: ['jogadores'],
    queryFn: () => base44.entities.Jogador.list(),
    initialData: [],
  });

  const { data: partidas, isLoading: loadingPartidas } = useQuery({
    queryKey: ['partidas'],
    queryFn: () => base44.entities.Partida.list(),
    initialData: [],
  });

  const placar = useMemo(() => {
    if (!jogadores.length || !partidas.length) return [];

    const stats = jogadores.map(jogador => {
      const vitorias = partidas.filter(p => 
        p.vencedor_1 === jogador.id || p.vencedor_2 === jogador.id
      ).length;

      const derrotas = partidas.filter(p => 
        p.perdedor_1 === jogador.id || p.perdedor_2 === jogador.id
      ).length;

      const totalJogos = vitorias + derrotas;
      const winRate = totalJogos > 0 ? Math.round((vitorias / totalJogos) * 100) : 0;

      return {
        ...jogador,
        vitorias,
        derrotas,
        totalJogos,
        winRate
      };
    });

    return stats
      .filter(s => s.totalJogos > 0)
      .sort((a, b) => b.winRate - a.winRate || b.vitorias - a.vitorias);
  }, [jogadores, partidas]);

  const isLoading = loadingJogadores || loadingPartidas;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1a4d2e] to-[#2d5a3d] text-white px-8 py-4 rounded-2xl shadow-xl mb-4">
            <Trophy className="w-10 h-10 text-[#d4af37]" />
            <h1 className="text-4xl font-bold">Placar Geral</h1>
          </div>
          <p className="text-gray-600 text-lg mt-4">
            Ranking oficial de jogadores ordenado por taxa de vitória
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : placar.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">Nenhuma partida registrada ainda</p>
            <p className="text-gray-400">Comece a jogar para ver o placar!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {placar.map((player, index) => (
              <PlayerCard 
                key={player.id} 
                player={player} 
                rank={index + 1}
                totalPlayers={placar.length}
              />
            ))}
          </div>
        )}

        {!isLoading && placar.length > 0 && (
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border-2 border-[#d4af37] shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-[#d4af37]" />
                <h3 className="font-bold text-lg">Pódio</h3>
              </div>
              <p className="text-sm text-gray-600">Top 3 jogadores com melhor desempenho</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full" />
                <h3 className="font-bold text-lg">Meio de Tabela</h3>
              </div>
              <p className="text-sm text-gray-600">Jogadores com desempenho regular</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-xl border-2 border-red-200 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">⬇️</span>
                </div>
                <h3 className="font-bold text-lg">Zona de Risco</h3>
              </div>
              <p className="text-sm text-gray-600">Últimos 4 jogadores - hora de treinar!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
