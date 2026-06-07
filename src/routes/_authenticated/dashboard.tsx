import { createFileRoute } from "@tanstack/react-router";
import { useAuth, ROLE_LABELS } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  GraduationCap, Wallet, Library, Bell, MessageSquare, Receipt, BookOpen, Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Painel — EduGestão" }] }),
  component: Dashboard,
});

const QUICK_STATS = {
  aluno:        [{ label: "Média geral", value: "8.4", icon: GraduationCap, hint: "Acima da média" },
                 { label: "Mensalidades em aberto", value: "1", icon: Wallet, hint: "Vence em 5 dias" },
                 { label: "Livros emprestados", value: "2", icon: Library, hint: "1 a renovar" },
                 { label: "Avisos novos", value: "3", icon: Bell, hint: "Esta semana" }],
  responsavel:  [{ label: "Mensalidades em aberto", value: "1", icon: Wallet, hint: "Vence em 5 dias" },
                 { label: "Boletim do filho", value: "8.4", icon: GraduationCap, hint: "Média trimestral" },
                 { label: "Avisos novos", value: "3", icon: Bell, hint: "Esta semana" },
                 { label: "Gasto na cantina", value: "R$ 142", icon: Receipt, hint: "Últimos 30 dias" }],
  professor:    [{ label: "Turmas ativas", value: "5", icon: Users, hint: "Neste trimestre" },
                 { label: "Alunos", value: "128", icon: GraduationCap, hint: "Total" },
                 { label: "Notas pendentes", value: "12", icon: BookOpen, hint: "Para lançar" },
                 { label: "Mensagens", value: "7", icon: MessageSquare, hint: "Não lidas" }],
  coordenacao:  [{ label: "Alunos", value: "842", icon: GraduationCap, hint: "Matriculados" },
                 { label: "Professores", value: "47", icon: Users, hint: "Ativos" },
                 { label: "Inadimplência", value: "6%", icon: Wallet, hint: "Mês atual" },
                 { label: "Avisos enviados", value: "18", icon: Bell, hint: "Últimos 30 dias" }],
} as const;

const SHORTCUTS = {
  aluno:       [{ to: "/boletim", label: "Ver boletim", icon: GraduationCap }, { to: "/biblioteca", label: "Biblioteca", icon: Library }, { to: "/mensalidade", label: "Mensalidades", icon: Wallet }, { to: "/chat", label: "Chat", icon: MessageSquare }],
  responsavel: [{ to: "/boletim", label: "Boletim", icon: GraduationCap }, { to: "/mensalidade", label: "Pagar mensalidade", icon: Wallet }, { to: "/extrato", label: "Extrato cantina", icon: Receipt }, { to: "/avisos", label: "Avisos", icon: Bell }],
  professor:   [{ to: "/boletim", label: "Lançar notas", icon: GraduationCap }, { to: "/avisos", label: "Publicar aviso", icon: Bell }, { to: "/chat", label: "Chat", icon: MessageSquare }],
  coordenacao: [{ to: "/avisos", label: "Publicar aviso", icon: Bell }, { to: "/chat", label: "Chat", icon: MessageSquare }, { to: "/boletim", label: "Boletins", icon: GraduationCap }],
} as const;

function Dashboard() {
  const { user, role } = useAuth();
  const effectiveRole = role ?? "aluno";
  const stats = QUICK_STATS[effectiveRole];
  const shortcuts = SHORTCUTS[effectiveRole];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Olá, {user?.email?.split("@")[0]} 👋</h1>
          <p className="text-muted-foreground text-sm">Aqui está um resumo da sua atividade no sistema.</p>
        </div>
        {role && <Badge variant="secondary" className="text-sm">{ROLE_LABELS[role]}</Badge>}
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-primary-glow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{s.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acessos rápidos</CardTitle>
          <CardDescription>As áreas mais usadas para o seu perfil.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            {shortcuts.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="group flex flex-col items-start gap-2 rounded-lg border bg-card p-4 hover:border-primary hover:shadow-sm transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{s.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Em construção</CardTitle>
          <CardDescription>
            Esta é a fundação do sistema. As áreas de Boletim, Mensalidade, Biblioteca, Extrato, Avisos e Chat
            estarão disponíveis nas próximas etapas. Os links no menu lateral já estão visíveis conforme seu perfil.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
