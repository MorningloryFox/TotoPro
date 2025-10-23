import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Users, CheckCircle2 } from "lucide-react";

export default function GameForm({ jogadores, onSubmit, isSubmitting }) {
  const [vencedor1, setVencedor1] = React.useState("");
  const [vencedor2, setVencedor2] = React.useState("");
  const [perdedor1, setPerdedor1] = React.useState("");
  const [perdedor2, setPerdedor2] = React.useState("");

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
  };

  const getAvailableJogadores = (currentFieldValue) => {
    const selectedIds = [vencedor1, vencedor2, perdedor1, perdedor2];
    return jogadores.filter(
      j => !selectedIds.includes(j.id) || j.id === currentFieldValue
    );
  };

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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vencedor1" className="text-green-900 font-medium">
                  Jogador 1
                </Label>
                <Select value={vencedor1} onValueChange={setVencedor1}>
                  <SelectTrigger id="vencedor1" className="bg-white border-green-300">
                    <SelectValue placeholder="Selecione o jogador" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableJogadores(vencedor1).map((jogador) => (
                      <SelectItem key={jogador.id} value={jogador.id}>
                        {jogador.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vencedor2" className="text-green-900 font-medium">
                  Jogador 2
                </Label>
                <Select value={vencedor2} onValueChange={setVencedor2}>
                  <SelectTrigger id="vencedor2" className="bg-white border-green-300">
                    <SelectValue placeholder="Selecione o jogador" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableJogadores(vencedor2).map((jogador) => (
                      <SelectItem key={jogador.id} value={jogador.id}>
                        {jogador.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-red-600" />
              <h3 className="font-bold text-lg text-red-800">Time Perdedor</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="perdedor1" className="text-red-900 font-medium">
                  Jogador 1
                </Label>
                <Select value={perdedor1} onValueChange={setPerdedor1}>
                  <SelectTrigger id="perdedor1" className="bg-white border-red-300">
                    <SelectValue placeholder="Selecione o jogador" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableJogadores(perdedor1).map((jogador) => (
                      <SelectItem key={jogador.id} value={jogador.id}>
                        {jogador.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="perdedor2" className="text-red-900 font-medium">
                  Jogador 2
                </Label>
                <Select value={perdedor2} onValueChange={setPerdedor2}>
                  <SelectTrigger id="perdedor2" className="bg-white border-red-300">
                    <SelectValue placeholder="Selecione o jogador" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableJogadores(perdedor2).map((jogador) => (
                      <SelectItem key={jogador.id} value={jogador.id}>
                        {jogador.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-lg bg-gradient-to-r from-[#1a4d2e] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#1a4d2e] shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Registrar Partida"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
