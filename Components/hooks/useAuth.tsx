import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// Permissões padrão (nenhuma)
const defaultPermissions = {
  canRegisterGame: false,
  canManagePlayers: false,
  canClearData: false,
};

/**
 * Hook para buscar o usuário logado e suas permissões.
 * Redireciona para o Placar se não estiver logado.
 */
export const useAuth = () => {
  const navigate = useNavigate();

  // 1. Busca o usuário logado
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch (error) {
        navigate(createPageUrl("Placar")); // Redireciona se não logado
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const isAdmin = user?.role === 'admin';
  const userEmail = user?.email;

  // 2. Busca as permissões desse usuário
  const { data: authData, isLoading: isLoadingAuth } = useQuery({
    queryKey: ['userPermissions', userEmail],
    queryFn: async () => {
      // Busca na tabela Autorizacao pelo e-mail do usuário
      const result = await base44.entities.Autorizacao.filter({ email: userEmail });
      return result[0] || null;
    },
    enabled: !!userEmail, // Só executa se o e-mail do usuário estiver disponível
  });

  // 3. Monta o objeto final de permissões
  const permissions = React.useMemo(() => {
    if (isAdmin) {
      // Admin tem todas as permissões
      return {
        canRegisterGame: true,
        canManagePlayers: true,
        canClearData: true,
      };
    }
    // Usuário comum tem as permissões do banco ou as padrões
    return authData ? 
      {
        canRegisterGame: authData.canRegisterGame,
        canManagePlayers: authData.canManagePlayers,
        canClearData: authData.canClearData,
      } : defaultPermissions;
  }, [isAdmin, authData]);

  return {
    user,
    permissions,
    isAdmin,
    isLoading: isLoadingUser || (!!userEmail && isLoadingAuth),
  };
};

/**
 * Helper para registrar uma ação no log
 */
export const logAction = (user, action, details = "") => {
  if (!user?.email) return;
  
  base44.entities.LogAcao.create({
    userEmail: user.email,
    action,
    details,
  }).catch(console.error); // Dispara e esquece
};
