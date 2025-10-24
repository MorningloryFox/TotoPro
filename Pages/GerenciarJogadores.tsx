
import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert, Plus, Trash2, Users, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, logAction } from "@/components/hooks/useAuth"; // Corrected import path

export default function GerenciarJogadoresPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [novoNome, setNovoNome] = React.useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);

  const { user, permissions, isLoading: isLoadingAuth } = useAuth();
  React.useEffect(() => {
    if (!isLoadingAuth && !permissions.canManagePlayers) {
      navigate(createPageUrl("Placar"));
    }
  }, [isLoadingAuth, permissions.canManagePlayers, navigate]);

  const { data: jogadores, isLoading } = useQuery({
    queryKey: ['jogadores'],
    queryFn: () => base44.entities.Jogador.list('-created_date'),
    initialData: [],
  });

  const createJogadorMutation = useMutation({
    mutationFn: (nome) => base44.entities.Jogador.create({ nome }),
    onSuccess: (data, nome) => {
      queryClient.invalidateQueries({ queryKey: ['jogadores'] });
      setNovoNome("");
      setShowSuccess(true);
      logAction(user, "CREATE_JOGADOR", `Nome: ${nome}`);
      setTimeout(() => setShowSuccess(false), 2000);
    },
  });

  const deleteJogadorMutation = useMutation({
    mutationFn: (jogador) => base44.entities.Jogador.delete(jogador.id),
    onSuccess: (data, jogador) => {
      queryClient.invalidateQueries({ queryKey: ['jogadores'] });
      logAction(user, "DELETE_JOGADOR", `Nome: ${jogador.nome}, ID: ${jogador.id}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (novoNome.trim()) {
      createJogadorMutation.mutate(novoNome.trim());
    }
  };

  if (isLoadingAuth || !permissions.canManagePlayers) {
    return <div className="min-h-screen p-4"></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1a4d2e] to-[#2d5a3d] text-white px-8 py-4 rounded-2xl shadow-xl mb-4">
            <Users className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Gerenciar Jogadores</h1>
          </div>
          <p className="text-gray-600 text-lg mt-4">
            Adicione ou remova jogadores do sistema
          </p>
        </div>

        {showSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Jogador adicionado com sucesso!
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-8 shadow-xl border-none">
          <CardHeader className="bg-gradient-to-r from-[#1a4d2e] to-[#2d5a3d] text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Plus className="w-7 h-7" />
              Adicionar Novo Jogador
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                placeholder="Nome do jogador"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                className="flex-1 h-12 text-lg"
              />
              <Button 
                type="submit" 
                className="h-12 px-8 bg-gradient-to-r from-[#1a4d2e] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#1a4d2e]"
                disabled={!novoNome.trim() || createJogadorMutation.isPending}
              >
                {createJogadorMutation.isPending ? "Adicionando..." : "Adicionar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-none">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl">
              Jogadores Cadastrados ({jogadores.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Carregando jogadores...
              </div>
            ) : jogadores.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Nenhum jogador cadastrado</p>
                <p className="text-sm mt-2">Adicione o primeiro jogador acima</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {jogadores.map((jogador) => (
                    <motion.div
                      key={jogador.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#1a4d2e] to-[#2d5a3d] rounded-full flex items-center justify-center text-white font-bold">
                          {jogador.nome[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-lg">{jogador.nome}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteJogadorMutation.mutate(jogador)}
                        disabled={deleteJogadorMutation.isPending}
                        className="hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
