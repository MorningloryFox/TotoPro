
import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth, logAction } from "@/components/hooks/useAuth";

export default function LimparDadosPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const { user, permissions, isLoading: isLoadingAuth } = useAuth();
  React.useEffect(() => {
    // Redirect if authentication is loaded and user does not have permission
    if (!isLoadingAuth && !permissions.canClearData) {
      navigate(createPageUrl("Placar"));
    }
  }, [isLoadingAuth, permissions.canClearData, navigate]);

  const { data: partidas } = useQuery({
    queryKey: ['partidas'],
    queryFn: () => base44.entities.Partida.list(),
    initialData: [],
  });

  const { data: jogadores } = useQuery({
    queryKey: ['jogadores'],
    queryFn: () => base44.entities.Jogador.list(),
    initialData: [],
  });

  const handleDeletePartidas = async () => {
    setIsDeleting(true);
    try {
      for (const partida of partidas) {
        await base44.entities.Partida.delete(partida.id);
      }
      queryClient.invalidateQueries({ queryKey: ['partidas'] });
      setShowSuccess(true);
      logAction(user, "LIMPAR_DADOS", `Partidas deletadas: ${partidas.length}`);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao deletar partidas:", error);
    }
    setIsDeleting(false);
  };

  const handleDeleteJogadores = async () => {
    setIsDeleting(true);
    try {
      for (const jogador of jogadores) {
        await base44.entities.Jogador.delete(jogador.id);
      }
      queryClient.invalidateQueries({ queryKey: ['jogadores'] });
      setShowSuccess(true);
      logAction(user, "LIMPAR_DADOS", `Jogadores deletados: ${jogadores.length}`);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao deletar jogadores:", error);
    }
    setIsDeleting(false);
  };

  const handleDeleteTudo = async () => {
    setIsDeleting(true);
    try {
      for (const partida of partidas) {
        await base44.entities.Partida.delete(partida.id);
      }
      for (const jogador of jogadores) {
        await base44.entities.Jogador.delete(jogador.id);
      }
      queryClient.invalidateQueries({ queryKey: ['partidas'] });
      queryClient.invalidateQueries({ queryKey: ['jogadores'] });
      setShowSuccess(true);
      logAction(user, "RESET_TOTAL", `Partidas: ${partidas.length}, Jogadores: ${jogadores.length}`);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao deletar dados:", error);
    }
    setIsDeleting(false);
  };

  // While authentication is loading or if user doesn't have permission, render an empty div.
  // The useEffect above will handle redirection if permission is denied.
  if (isLoadingAuth || !permissions.canClearData) {
    return <div className="min-h-screen p-4"></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl shadow-xl mb-4">
            <AlertTriangle className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Limpar Dados</h1>
          </div>
          <p className="text-gray-600 text-lg mt-4">
            Remova dados de teste ou reinicie o sistema
          </p>
        </div>

        {showSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Dados removidos com sucesso!
            </AlertDescription>
          </Alert>
        )}

        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atenção!</strong> Essas ações são irreversíveis. Os dados deletados não poderão ser recuperados.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-lg border-2 border-orange-200">
            <CardHeader className="bg-orange-50">
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Trash2 className="w-6 h-6" />
                Limpar Partidas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Remove todas as partidas registradas, mas mantém os jogadores cadastrados.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm font-medium">
                  Total de partidas: <span className="text-orange-600">{partidas.length}</span>
                </p>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full border-orange-500 text-orange-700 hover:bg-orange-50"
                    disabled={partidas.length === 0 || isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpar Partidas
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Isso irá deletar permanentemente todas as {partidas.length} partidas registradas.
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeletePartidas}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-yellow-200">
            <CardHeader className="bg-yellow-50">
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Trash2 className="w-6 h-6" />
                Limpar Jogadores
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Remove todos os jogadores cadastrados. As partidas existentes também serão afetadas.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm font-medium">
                  Total de jogadores: <span className="text-yellow-600">{jogadores.length}</span>
                </p>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                    disabled={jogadores.length === 0 || isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpar Jogadores
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Isso irá deletar permanentemente todos os {jogadores.length} jogadores cadastrados.
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteJogadores}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-xl border-2 border-red-300">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-6 h-6" />
              Limpar Tudo (Reset Completo)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              Remove <strong>TODOS</strong> os dados do sistema: partidas e jogadores. Use para reiniciar completamente.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm font-medium mb-1">Será deletado:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {partidas.length} partidas</li>
                <li>• {jogadores.length} jogadores</li>
              </ul>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  disabled={(partidas.length === 0 && jogadores.length === 0) || isDeleting}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Limpar TUDO
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-600">⚠️ ATENÇÃO: Reset Completo</AlertDialogTitle>
                  <AlertDialogDescription>
                    Isso irá deletar permanentemente <strong>TODOS os dados</strong> do sistema:
                    <br />• {partidas.length} partidas
                    <br />• {jogadores.length} jogadores
                    <br /><br />
                    Esta ação é <strong>IRREVERSÍVEL</strong> e não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteTudo}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Sim, Limpar Tudo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
