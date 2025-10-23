import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import GameForm from "../components/registrar/GameForm";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegistrarJogoPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = React.useState(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        if (currentUser.role !== 'admin') {
          navigate(createPageUrl("Placar"));
        }
      } catch (error) {
        navigate(createPageUrl("Placar"));
      }
    };
    loadUser();
  }, [navigate]);

  const { data: jogadores, isLoading } = useQuery({
    queryKey: ['jogadores'],
    queryFn: () => base44.entities.Jogador.list(),
    initialData: [],
  });

  const createPartidaMutation = useMutation({
    mutationFn: (partidaData) => base44.entities.Partida.create(partidaData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partidas'] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const handleSubmit = async (partidaData) => {
    createPartidaMutation.mutate(partidaData);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            Acesso negado. Esta página é apenas para administradores.
          </AlertDescription>
        </Alert>
      </div>
    );
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
