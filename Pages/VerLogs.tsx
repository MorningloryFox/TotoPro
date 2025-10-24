
import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert, FileText, History } from "lucide-react";
import { useAuth } from "@/components/hooks/useAuth"; // Corrected import path
import { Skeleton } from "@/components/ui/skeleton";

export default function VerLogsPage() {
  const navigate = useNavigate();

  // Usa o hook para proteção
  const { user, isAdmin, isLoading: isLoadingAuth } = useAuth();
  React.useEffect(() => {
    if (!isLoadingAuth && !isAdmin) { // Apenas Super Admins
      navigate(createPageUrl("Placar"));
    }
  }, [isLoadingAuth, isAdmin, navigate]);

  const { data: logs, isLoading } = useQuery({
    queryKey: ['logs'],
    queryFn: () => base44.entities.LogAcao.list('-created_date', 100), // Lista os 100 mais recentes
    initialData: [],
  });

  if (isLoadingAuth || !isAdmin) {
    return <div className="min-h-screen p-4"></div>; // Loading
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-8 py-4 rounded-2xl shadow-xl mb-4">
            <History className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Logs de Ações</h1>
          </div>
          <p className="text-gray-600 text-lg mt-4">
            Histórico de ações administrativas realizadas no sistema
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl">Últimas 100 Ações</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Nenhum log encontrado</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 bg-white border rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-800">{log.action}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.created_date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Usuário:</span> {log.userEmail}
                    </p>
                    {log.details && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Detalhes:</span> {log.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
