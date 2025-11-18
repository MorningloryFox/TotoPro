import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target, Users, CheckCircle2, Search } from "lucide-react";

export default function GameForm({ jogadores, onSubmit, isSubmitting }) {
  const [vencedor1, setVencedor1] = React.useState("");
  const [vencedor2, setVencedor2] = React.useState("");
  const [perdedor1, setPerdedor1] = React.useState("");
  const [perdedor2, setPerdedor2] = React.useState("");
  const [buscaVencedores, setBuscaVencedores] = React.useState("");
  const [buscaPerdedores, setBuscaPerdedores] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!vencedor1 || !vencedor2 || !perdedor1 || !perdedor2) {
      alert("Por favor, selecione todos os jogadores");
      return;
    }

    const jogadoresSelecionados = [vencedor1, vencedor2, perdedor1, perdedor2];
    const jogadoresUnicos = new Set(jogadoresSelecionados);
    
    if (jogadoresUnicos.size !== 4) {
      alert("Todos os jogadores devem ser diferentes");
      return;
    }

    onSubmit({
      vencedor_1: vencedor1,
      vencedor_2: vencedor2,
      perdedor_1: perdedor1,
      perdedor_2: perdedor2
    });

    setVencedor1("");
    setVencedor2("");
    setPerdedor1("");
    setPerdedor2("");
    setBuscaVencedores("");
    setBuscaPerdedores("");
  };

  const getAvailableJogadores = (currentFieldValue, busca) => {
    const selectedIds = [vencedor1, vencedor2, perdedor1, perdedor2];
    return jogadores
      .filter(j => !selectedIds.includes(j.id) || j.id === currentFieldValue)
      .filter(j => j.nome.toLowerCase().includes(busca.toLowerCase()))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  };

  const PlayerButton = ({ jogador, isSelected, onClick, color }) => (
    <button
      type="button"
      onClick={() => onClick(jogador.id)}
      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
        isSelected
          ? color === 'green' 
            ? 'bg-green-600 border-green-700 text-white shadow-lg scale-105'
            : 'bg-red-600 border-red-700 text-white shadow-lg scale-105'
          : color === 'green'
            ? 'bg-white border-green-300 hover:border-green-500 hover:bg-green-50'
            : 'bg-white border-red-300 hover:border-red-500 hover:bg-red-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
          isSelected
            ? 'bg-white/20'
            : color === 'green' 
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
        }`}>
          {jogador.nome[0].toUpperCase()}
        </div>
        <span className={`font-medium text-base ${isSelected ? '' : 'text-gray-800'}`}>
          {jogador.nome}
        </span>
      </div>
    </button>
  );

  return (
    <Card className="border-none shadow-xl bg-white">
      <CardHeader className="border-b bg-gradient-to-r from-[#1a4d2e] to-[#2d5a3d] text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Target className="w-7 h-7" />
          Registrar Nova Partida
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-lg text-green-800">Time Vencedor</h3>
            </div>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar jogador..."
                  value={buscaVencedores}
                  onChange={(e) => setBuscaVencedores(e.target.value)}
                  className="pl-10 bg-white border-green-300 h-12"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-green-900 mb-2">Jogador 1</p>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {getAvailableJogadores(vencedor1, buscaVencedores).map((jogador) => (
                    <PlayerButton
                      key={jogador.id}
                      jogador={jogador}
                      isSelected={vencedor1 === jogador.id}
                      onClick={setVencedor1}
                      color="green"
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-green-900 mb-2">Jogador 2</p>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {getAvailableJogadores(vencedor2, buscaVencedores).map((jogador) => (
                    <PlayerButton
                      key={jogador.id}
                      jogador={jogador}
                      isSelected={vencedor2 === jogador.id}
                      onClick={setVencedor2}
                      color="green"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-red-600" />
              <h3 className="font-bold text-lg text-red-800">Time Perdedor</h3>
            </div>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar jogador..."
                  value={buscaPerdedores}
                  onChange={(e) => setBuscaPerdedores(e.target.value)}
                  className="pl-10 bg-white border-red-300 h-12"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-red-900 mb-2">Jogador 1</p>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {getAvailableJogadores(perdedor1, buscaPerdedores).map((jogador) => (
                    <PlayerButton
                      key={jogador.id}
                      jogador={jogador}
                      isSelected={perdedor1 === jogador.id}
                      onClick={setPerdedor1}
                      color="red"
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-red-900 mb-2">Jogador 2</p>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {getAvailableJogadores(perdedor2, buscaPerdedores).map((jogador) => (
                    <PlayerButton
                      key={jogador.id}
                      jogador={jogador}
                      isSelected={perdedor2 === jogador.id}
                      onClick={setPerdedor2}
                      color="red"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-lg bg-gradient-to-r from-[#1a4d2e] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#1a4d2e] shadow-lg"
            disabled={isSubmitting || !vencedor1 || !vencedor2 || !perdedor1 || !perdedor2}
          >
            {isSubmitting ? "Registrando..." : "Registrar Partida"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
