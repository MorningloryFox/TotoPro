import React, { useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function RelatorioPage() {
  const [copied, setCopied] = React.useState(false);

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

  const relatorio = useMemo(() => {
    if (!jogadores.length || !partidas.length) return "";

    const stats = jogadores.map(jogador => {
      const vitorias = partidas.filter(p => 
        p.vencedor_1 === jogador.id || p.vencedor_2 === jogador.id
      ).length;

      const derrotas = partidas.filter(p => 
        p.perdedor_1 === jogador.id || p.perdedor_2 === jogador.id
      ).length;

      return {
        nome: jogador.nome,
        vitorias,
        derrotas,
        totalJogos: vitorias + derrotas
      };
    });

    const linhas = stats
      .filter(s => s.totalJogos > 0)
      .sort((a, b) => {
        const winRateA = a.vitorias / a.totalJogos;
        const winRateB = b.vitorias / b.totalJogos;
        return winRateB - winRateA || b.vitorias - a.vitorias;
      })
      .map(s => `Nome: ${s.nome} | ${s.vitorias} V | ${s.derrotas} D`);

    return linhas.join('\n');
  }, [jogadores, partidas]);

  const handleCopy = () => {
    navigator.clipboard.writeText(relatorio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLoading = loadingJogadores || loadingPartidas;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1a4d2e] to-[#2d5a3d] text-white px-8 py-4 rounded-2xl shadow-xl mb-4">
            <FileText className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Relatório do Dia</h1>
          </div>
          <p className="text-gray-600 text-lg mt-4">
            Resumo formatado de todos os jogadores e suas estatísticas
          </p>
        </div>

        <Card className="shadow-2xl border-none">
          <CardHeader className="bg-gradient-to-r from-[#1a4d2e] to-[#2d5a3d] text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Estatísticas Gerais</CardTitle>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
                disabled={!relatorio}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : relatorio ? (
              <pre className="font-mono text-sm bg-gray-50 p-6 rounded-xl border-2 border-gray-200 whitespace-pre-wrap break-words leading-relaxed">
                {relatorio}
              </pre>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Nenhuma partida registrada ainda</p>
                <p className="text-sm mt-2">O relatório aparecerá após as primeiras partidas</p>
              </div>
            )}
          </CardContent>
        </Card>

        {!isLoading && relatorio && (
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Formato do Relatório</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Cada linha mostra o nome do jogador seguido de suas vitórias e derrotas.
                  Os jogadores estão ordenados por taxa de vitória.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Como Usar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Clique em "Copiar" para copiar o relatório e compartilhar com seu time.
                  Perfeito para enviar em grupos ou salvar em arquivos.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
