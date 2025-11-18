import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, History, Trash2, Calendar, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function VerLogsPage() {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = React.useState(null);
  const [filtro, setFiltro] = React.useState("todos");

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
      } catch (error) {
        setCurrentUser(null);
      }
    };
    loadUser();
  }, []);

  const { data: allLogs, isLoading } = useQuery({
    queryKey: ['logs'],
    queryFn: () => base44.entities.LogAcao.list('-created_date', 100),
    initialData: [],
  });

  const deletePartidaMutation = useMutation({
    mutationFn: async (partidaId) => {
      await base44.entities.Partida.delete(partidaId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      queryClient.invalidateQueries({ queryKey: ['partidas'] });
    },
  });

  const formatDateBrasilia = (dateString) => {
    const date = new Date(dateString);
    const brasiliaDate = new Date(date.getTime() - (3 * 60 * 60 * 1000));
    
    return brasiliaDate.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatUserName = (email) => {
    if (email === "morningloryfox@gmail.com") {
      return "Admin";
    }
    return email;
  };

  const getFilteredLogs = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return allLogs.filter(log => {
      const logDate = new Date(log.created_date);
      
      if (filtro === "hoje") {
        return logDate >= today;
      } else if (filtro === "7dias") {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return logDate >= weekAgo;
      } else if (filtro === "30dias") {
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        return logDate >= monthAgo;
      }
      return true;
    });
  };

  const logs = getFilteredLogs();

  const exportToCSV = () => {
    const headers = ['Data e Hora', 'Ação', 'Usuário', 'Detalhes'];
    const rows = logs.map(log => [
      formatDateBrasilia(log.created_date),
      log.action,
      formatUserName(log.userEmail),
      log.details || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `logs_${filtro}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const extractPartidaId = (details) => {
    // Tenta extrair o ID da partida dos detalhes
    const match = details?.match(/ID:\s*([a-zA-Z0-9-]+)/);
    return match ? match[1] : null;
  };

  const canDeletePartida = currentUser?.email === "morningloryfox@gmail.com";

  const getFiltroLabel = () => {
    if (filtro === "hoje") return "Hoje";
    if (filtro === "7dias") return "Últimos 7 dias";
    if (filtro === "30dias") return "Últimos 30 dias";
    return "Todo o Período";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-8 py-4 rounded-2xl shadow-xl mb-4">
            <History className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Histórico de Ações</h1>
          </div>
          <p className="text-gray-600 text-lg mt-4">
            Registro de todas as ações administrativas realizadas no sistema
          </p>
        </div>

        {canDeletePartida && (
          <Alert className="mb-6 bg-orange-50 border-orange-200">
            <AlertDescription className="text-orange-800">
              <strong>Modo Admin:</strong> Você pode deletar registros de partidas diretamente daqui.
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-xl mb-6">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Filtrar por Período
              </CardTitle>
              <div className="flex gap-3 flex-wrap">
                <Select value={filtro} onValueChange={setFiltro}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hoje">Hoje</SelectItem>
                    <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                    <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                    <SelectItem value="todos">Todo o Período</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToCSV}
                  disabled={logs.length === 0}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-xl">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl">
              {getFiltroLabel()} - {logs.length} {logs.length === 1 ? 'Ação' : 'Ações'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Nenhum log encontrado no período selecionado</p>
                <p className="text-sm mt-2">Tente selecionar outro período</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => {
                  const partidaId = log.action === "REGISTRO_JOGO" ? extractPartidaId(log.details) : null;
                  
                  return (
                    <div key={log.id} className="p-4 bg-white border rounded-lg shadow-sm">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-800">{log.action}</span>
                            <span className="text-xs text-gray-500">
                              {formatDateBrasilia(log.created_date)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Usuário:</span> {formatUserName(log.userEmail)}
                          </p>
                          {log.details && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Detalhes:</span> {log.details}
                            </p>
                          )}
                        </div>
                        
                        {canDeletePartida && log.action === "REGISTRO_JOGO" && partidaId && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-red-50 hover:text-red-600 flex-shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Deletar Partida?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação é irreversível. A partida será removida permanentemente do sistema.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deletePartidaMutation.mutate(partidaId)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Deletar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {!isLoading && logs.length > 0 && (
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Exportação de Dados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Exporte os logs filtrados em formato CSV para análise externa.
                  Os arquivos incluem data, ação, usuário e detalhes.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Filtro Ativo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Período atual: <strong>{getFiltroLabel()}</strong>
                  <br />
                  Total de registros: <strong>{logs.length}</strong>
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
