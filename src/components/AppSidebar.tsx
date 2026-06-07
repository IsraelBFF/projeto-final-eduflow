import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, BookOpen, GraduationCap, Receipt, Library,
  Bell, MessageSquare, Wallet, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth, ROLE_LABELS, type AppRole } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

type NavItem = { title: string; url: string; icon: React.ComponentType<{ className?: string }>; roles: AppRole[] };

const NAV: NavItem[] = [
  { title: "Dashboard",   url: "/dashboard",   icon: LayoutDashboard, roles: ["aluno","responsavel","professor","coordenacao"] },
  { title: "Boletim",     url: "/boletim",     icon: GraduationCap,   roles: ["aluno","responsavel","professor","coordenacao"] },
  { title: "Mensalidade", url: "/mensalidade", icon: Wallet,          roles: ["aluno","responsavel"] },
  { title: "Extrato",     url: "/extrato",     icon: Receipt,         roles: ["aluno","responsavel"] },
  { title: "Biblioteca",  url: "/biblioteca",  icon: Library,         roles: ["aluno"] },
  { title: "Avisos",      url: "/avisos",      icon: Bell,            roles: ["aluno","responsavel","professor","coordenacao"] },
  { title: "Chat",        url: "/chat",        icon: MessageSquare,   roles: ["aluno","responsavel","professor","coordenacao"] },
];

export function AppSidebar() {
  const { role, user, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = NAV.filter((i) => !role || i.roles.includes(role));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sidebar-foreground">EduGestão</span>
            <span className="text-xs text-sidebar-foreground/70">Sistema Escolar</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-2 py-2 group-data-[collapsible=icon]:hidden">
          <div className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</div>
          {role && <div className="text-xs font-medium text-sidebar-foreground">{ROLE_LABELS[role]}</div>}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => void signOut()}
          className="justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden">Sair</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
