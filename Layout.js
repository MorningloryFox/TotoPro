import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Trophy, Users, FileText, Target, Trash2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { base44 } from "@/api/base44Client";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };
    loadUser();
  }, []);

  const isAdmin = user?.role === 'admin';

  const publicPages = [
    {
      title: "Placar",
      url: createPageUrl("Placar"),
      icon: Trophy,
    },
    {
      title: "Relatório do Dia",
      url: createPageUrl("Relatorio"),
      icon: FileText,
    },
  ];

  const adminPages = [
    {
      title: "Registrar Jogo",
      url: createPageUrl("RegistrarJogo"),
      icon: Target,
    },
    {
      title: "Gerenciar Jogadores",
      url: createPageUrl("GerenciarJogadores"),
      icon: Users,
    },
    {
      title: "Limpar Dados",
      url: createPageUrl("LimparDados"),
      icon: Trash2,
    },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <style>{`
        :root {
          --foosball-green: #1a4d2e;
          --foosball-light-green: #2d5a3d;
          --gold: #d4af37;
          --wood: #8b6f47;
          --danger: #dc2626;
        }
        
        /* Garantir que os textos do menu fiquem sempre visíveis */
        [data-sidebar] a,
        [data-sidebar] button {
          color: white !important;
        }
        
        [data-sidebar] a:hover,
        [data-sidebar] button:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar className="border-r border-gray-200 bg-gradient-to-b from-[#1a4d2e] to-[#2d5a3d]">
          <SidebarHeader className="border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#d4af37] rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="w-7 h-7 text-[#1a4d2e]" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-white">Tótó Pro</h2>
                <p className="text-xs text-white/70">Placar de Pebolim</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <div className="text-xs font-semibold text-white/70 uppercase tracking-wider px-3 py-2 mb-1">
                Público
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {publicPages.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={item.url} 
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-200 text-white hover:bg-white/10 ${
                            location.pathname === item.url ? 'bg-white/20 shadow-md font-semibold' : ''
                          }`}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {isAdmin && (
              <SidebarGroup className="mt-4">
                <div className="text-xs font-semibold text-white/70 uppercase tracking-wider px-3 py-2 mb-1">
                  Administração
                </div>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminPages.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link 
                            to={item.url} 
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-200 text-white hover:bg-white/10 ${
                              location.pathname === item.url ? 'bg-white/20 shadow-md font-semibold' : ''
                            }`}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold">Tótó Pro</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
