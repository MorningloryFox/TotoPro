
import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import GameForm from "../components/registrar/GameForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth, logAction } from "@/components/hooks/useAuth";

export default function RegistrarJogoPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = React.useState(false);

  const { user, permissions, isLoading: isLoadingAuth } = useAuth();
  React.useEffect(() => {
    if (!isLoadingAuth && !permissions.canRegisterGame) {
      navigate(createPageUrl("Placar"));
    }
  }, [isLoadingAuth, permissions.canRegisterGame, navigate]);

  const { data: jogadores, isLoading } = useQuery({
    queryKey: ['jogadores'],
    queryFn: () => base44.entities.Jogador.list(),
    initialData: [],
  });

  const createPartidaMutation = useMutation({
    mutationFn: (partidaData) => base44.entities.Partida.create(partidaData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['partidas'] });
      setShowSuccess(true);
      
      const getNome = (id) => jogadores.find(j => j.id === id)?.nome || id;
      const v1 = getNome(variables.vencedor_1);
      const v2 = getNome(variables.vencedor_2);
      const p1 = getNome(variables.perdedor_1);
      const p2 = getNome(variables.perdedor_2);
      logAction(user, "REGISTRO_JOGO", `Venc: ${v1}, ${v2} | Perd: ${p1}, ${p2}`);

      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const handleSubmit = async (partidaData) => {
    createPartidaMutation.mutate(partidaData);
  };

  if (isLoadingAuth || !permissions.canRegisterGame) {
    return <div className="min-h-screen p-4"></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {showSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Partida registrada com sucesso!
            </AlertDescription>
          </Alert>
        )}

        <GameForm 
          jogadores={jogadores}
          onSubmit={handleSubmit}
          isSubmitting={createPartidaMutation.isPending}
        />

        {jogadores.length === 0 && !isLoading && (
          <Alert className="mt-6">
            <AlertDescription>
              Nenhum jogador cadastrado. Cadastre jogadores primeiro na página "Gerenciar Jogadores".
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
