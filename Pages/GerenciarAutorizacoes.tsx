
import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert, Plus, Trash2, UserCog, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth, logAction } from "@/components/hooks/useAuth";

export default function GerenciarAutorizacoesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [novoEmail, setNovoEmail] = React.useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Usa o hook para proteção
  const { user, isAdmin, isLoading: isLoadingAuth } = useAuth();
  React.useEffect(() => {
    if (!isLoadingAuth && !isAdmin) { // Apenas Super Admins
      navigate(createPageUrl("Placar"));
    }
  }, [isLoadingAuth, isAdmin, navigate]);

  const { data: autorizacoes, isLoading } = useQuery({
    queryKey: ['autorizacoes'],
    queryFn: () => base44.entities.Autorizacao.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (email) => base44.entities.Autorizacao.create({ email }),
    onSuccess: (_, email) => {
      queryClient.invalidateQueries({ queryKey: ['autorizacoes'] });
      setNovoEmail("");
      setShowSuccess(true);
      logAction(user, "CREATE_AUTH", `Usuário: ${email}`);
      setTimeout(() => setShowSuccess(false), 2000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (auth) => base44.entities.Autorizacao.delete(auth.id),
    onSuccess: (_, auth) => {
      queryClient.invalidateQueries({ queryKey: ['autorizacoes'] });
      logAction(user, "DELETE_AUTH", `Usuário: ${auth.email}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, field, value }) => 
      base44.entities.Autorizacao.update(id, { [field]: value }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['autorizacoes'] });
      logAction(user, "UPDATE_AUTH", `ID: ${vars.id}, Campo: ${vars.field}, Valor: ${vars.value}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (novoEmail.trim() && !autorizacoes.find(a => a.email === novoEmail.trim())) {
      createMutation.mutate(novoEmail.trim());
    }
  };
  
  const handleToggle = (id, field, currentValue) => {
    updateMutation.mutate({ id, field, value: !currentValue });
  };

  if (isLoadingAuth || !isAdmin) {
    return <div className="min-h-screen p-4"></div>; // Loading
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1a4d2e] to-[#2d5a3d] text-white px-8 py-4 rounded-2xl shadow-xl mb-4">
            <UserCog className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Gerenciar Permissões</h1>
          </div>
        </div>

        {showSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Usuário adicionado! Configure as permissões abaixo.
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-8 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#1a4d2e] to-[#2d5a3d] text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Plus className="w-7 h-7" />
              Adicionar Novo Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                type="email"
                placeholder="E-mail do usuário (login)"
                value={novoEmail}
                onChange={(e) => setNovoEmail(e.target.value)}
                className="flex-1 h-12 text-lg"
              />
              <Button type="submit" className="h-12 px-8 bg-gradient-to-r from-[#1a4d2e] to-[#2d5a3d] hover:from-[#2d5a3d] hover:to-[#1a4d2e]">
                Adicionar
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl">
              Usuários e Permissões ({autorizacoes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {isLoading && <p>Carregando...</p>}
            {autorizacoes.map((auth) => (
              <div key={auth.id} className="p-4 border-2 rounded-xl bg-white shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-lg">{auth.email}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(auth)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Switch
                      id={`game-${auth.id}`}
                      checked={auth.canRegisterGame}
                      onCheckedChange={() => handleToggle(auth.id, 'canRegisterGame', auth.canRegisterGame)}
                    />
                    <Label htmlFor={`game-${auth.id}`}>Registrar Jogo</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Switch
                      id={`players-${auth.id}`}
                      checked={auth.canManagePlayers}
                      onCheckedChange={() => handleToggle(auth.id, 'canManagePlayers', auth.canManagePlayers)}
                    />
                    <Label htmlFor={`players-${auth.id}`}>Gerenciar Jogadores</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                    <Switch
                      id={`clear-${auth.id}`}
                      checked={auth.canClearData}
                      onCheckedChange={() => handleToggle(auth.id, 'canClearData', auth.canClearData)}
                      className="data-[state=checked]:bg-red-600"
                    />
                    <Label htmlFor={`clear-${auth.id}`} className="text-red-700 font-medium">Limpar Dados</Label>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
