Com certeza. O seu `README.md` atual é muito simples. Baseado em todas as funcionalidades que implementamos, um `README.md` profissional e completo para o seu projeto `TotoPro` deveria se parecer com este:

-----

# 🏆 Tótó Pro

Um placar de pebolim (totó) em tempo real com ranking, estatísticas e um sistema de gerenciamento administrativo avançado. Construído com Base44 e React.

**Link da Aplicação:** `[https://toto-pro-d740d6de.base44.app]`

-----

## ✨ Funcionalidades

O Tótó Pro é dividido em uma área pública (para visualização) e uma área administrativa com permissões granulares.

### Páginas Públicas

  * **Placar Geral:** Ranking de todos os jogadores, ordenado por taxa de vitória (Win Rate).
  * **Relatório do Dia:** Um resumo em texto puro das vitórias e derrotas de cada jogador, ideal para copiar e colar.

### Painel de Administração (Protegido)

  * **Registrar Jogo:** Formulário para registrar uma nova partida (dupla vencedora vs. dupla perdedora).
  * **Gerenciar Jogadores:** Adicionar ou remover jogadores do sistema.
  * **Limpar Dados:** Ferramenta de "reset" para limpar todas as partidas, jogadores ou ambos.
  * **Gerenciar Permissões:** (Apenas Super Admin) Painel para conceder permissões (registrar jogo, gerenciar jogadores, limpar dados) a outros usuários por e-mail.
  * **Ver Logs:** (Apenas Super Admin) Visualizador de logs de auditoria para monitorar todas as ações administrativas.

-----

## 🚀 Arquitetura e Tech Stack

Este projeto é construído inteiramente na plataforma **Base44**, utilizando:

  * **Hospedagem e Banco de Dados:** Base44 (com deploy via GitHub)
  * **Autenticação:** Base44 Auth
  * **Frontend:** React (com TypeScript)
  * **UI:** TailwindCSS, `shadcn/ui`, `lucide-react`
  * **Animações:** `framer-motion`
  * **Data Fetching:** `@tanstack/react-query`

### Sistema de Permissões

O sistema de administração é protegido por um hook customizado (`hooks/useAuth.tsx`) que centraliza a lógica de autorização.

1.  **Super Admin:** É o usuário que possui a `role` nativa `"admin"` no sistema de autenticação do Base44. Este usuário é o único que pode acessar a página "Gerenciar Permissões".
2.  **Usuários Autorizados:** Usuários comuns (com `role: 'user'`) podem receber permissões granulares através da entidade `Autorizacao`. Um Super Admin pode definir quais usuários podem registrar jogos, gerenciar jogadores ou limpar dados.
3.  **Log de Auditoria:** Todas as ações que criam, atualizam ou deletam dados (registrar jogo, criar jogador, limpar dados, alterar permissão) são registradas na entidade `LogAcao` para auditoria.

-----

## 🔧 Configuração Inicial (Como se tornar Super Admin)

Para acessar o painel de "Gerenciar Permissões" pela primeira vez, você precisa se definir manualmente como Super Admin.

1.  Faça o deploy do projeto no Base44.
2.  Crie uma conta (faça login) no seu próprio aplicativo.
3.  Abra o painel do seu projeto no Base44.
4.  Vá até a aba **Data** e encontre a tabela `users`.
5.  Encontre o seu registro de usuário (identifique pelo seu e-mail).
6.  Na coluna `role`, mude o valor de `user` para `admin`.
7.  Salve a alteração.
8.  Atualize a página do seu aplicativo. Agora você verá os links "Gerenciar Permissões" e "Ver Logs" no menu lateral, permitindo que você conceda acesso a outros usuários.

-----

## 📁 Estrutura do Projeto

```
/
├── Entities/
│   ├── Autorizacao.json  # Define permissões por e-mail
│   ├── Jogador.json      # Define a entidade Jogador
│   ├── LogAcao.json      # Define a entidade de Log
│   └── Partida.json      # Define a entidade Partida
│
├── Pages/
│   ├── GerenciarAutorizacoes.tsx # Página de gerenciamento de permissões (Admin)
│   ├── GerenciarJogadores.tsx    # Página de gerenciamento de jogadores (Admin)
│   ├── LimparDados.tsx           # Página de limpeza de dados (Admin)
│   ├── Placar.tsx                # Página pública do placar
│   ├── RegistrarJogo.tsx         # Página de registro de jogos (Admin)
│   ├── Relatorio.tsx             # Página pública de relatório
│   └── VerLogs.tsx               # Página de visualização de logs (Admin)
│
├── Components/
│   ├── placar/PlayerCard.tsx     # Card de jogador individual no placar
│   └── registrar/GameForm.tsx    # Formulário de registro de partida
│
├── hooks/
│   └── useAuth.tsx           # Hook central de autenticação e permissões
│
├── Layout.js                     # Layout principal com a sidebar de navegação
└── README.md                     # Este arquivo
```
