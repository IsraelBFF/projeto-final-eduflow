import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth, ROLE_LABELS, type AppRole } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap, Wallet, Library, Bell, MessageSquare, Receipt, Users, UserCircle2, BookOpen,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Painel — EduGestão" }] }),
  component: Dashboard,
});

type Stat = { label: string; value: string; icon: React.ComponentType<{ className?: string }>; hint?: string };
type ChartConfig =
  | { type: "bar"; title: string; description: string; data: { name: string; value: number }[]; dataKey?: string; yLabel?: string }
  | { type: "line"; title: string; description: string; data: { name: string; value: number }[]; yLabel?: string };

const ROLE_CONFIG: Record<AppRole, { stats: Stat[]; chart: ChartConfig; quickLinks: { to: string; label: string }[] }> = {
  aluno: {
    stats: [
      { label: "Faltas", value: "3", icon: Users, hint: "No bimestre" },
      { label: "Média", value: "8.4", icon: GraduationCap, hint: "Geral" },
      { label: "Valor gasto na cantina", value: "R$ 142", icon: Receipt, hint: "Últimos 30 dias" },
    ],
    chart: {
      type: "bar",
      title: "Faltas no bimestre",
      description: "Quantidade de faltas registradas por disciplina.",
      data: [
        { name: "Mat", value: 1 }, { name: "Port", value: 0 }, { name: "Hist", value: 2 },
        { name: "Geo", value: 0 }, { name: "Bio", value: 0 }, { name: "Fís", value: 0 },
      ],
    },
    quickLinks: [
      { to: "/biblioteca", label: "Biblioteca" },
      { to: "/extrato", label: "Extrato" },
      { to: "/boletim", label: "Boletim" },
      { to: "/chat", label: "Chat" },
      { to: "/avisos", label: "Avisos" },
      { to: "/mensalidade", label: "Mensalidade" },
    ],
  },
  responsavel: {
    stats: [
      { label: "Faltas", value: "3", icon: Users, hint: "Do filho no bimestre" },
      { label: "Média", value: "8.4", icon: GraduationCap, hint: "Trimestral" },
      { label: "Valor gasto na cantina", value: "R$ 142", icon: Receipt, hint: "Últimos 30 dias" },
    ],
    chart: {
      type: "line",
      title: "Médias nos últimos bimestres",
      description: "Evolução da média geral do aluno.",
      data: [
        { name: "1º Bim", value: 7.8 }, { name: "2º Bim", value: 8.1 },
        { name: "3º Bim", value: 8.0 }, { name: "4º Bim", value: 8.4 },
      ],
    },
    quickLinks: [
      { to: "/extrato", label: "Extrato" },
      { to: "/boletim", label: "Boletim" },
      { to: "/chat", label: "Chat" },
      { to: "/avisos", label: "Avisos" },
      { to: "/mensalidade", label: "Mensalidade" },
    ],
  },
  professor: {
    stats: [
      { label: "Alunos", value: "128", icon: GraduationCap, hint: "Em 5 turmas" },
      { label: "Boletins", value: "12", icon: BookOpen, hint: "Notas pendentes" },
    ],
    chart: {
      type: "line",
      title: "Média dos alunos por bimestre",
      description: "Desempenho médio nas suas disciplinas.",
      data: [
        { name: "1º Bim", value: 7.2 }, { name: "2º Bim", value: 7.6 },
        { name: "3º Bim", value: 7.4 }, { name: "4º Bim", value: 7.9 },
      ],
    },
    quickLinks: [
      { to: "/boletim", label: "Boletim" },
      { to: "/chat", label: "Chat" },
      { to: "/avisos", label: "Avisos" },
    ],
  },
  coordenacao: {
    stats: [
      { label: "Alunos", value: "842", icon: GraduationCap, hint: "Matriculados" },
      { label: "Boletins", value: "47", icon: BookOpen, hint: "Turmas ativas" },
    ],
    chart: {
      type: "bar",
      title: "Faltas por turma",
      description: "Quantidade de faltas no bimestre por turma.",
      data: [
        { name: "6ºA", value: 18 }, { name: "6ºB", value: 22 }, { name: "7ºA", value: 14 },
        { name: "7ºB", value: 27 }, { name: "8ºA", value: 19 }, { name: "8ºB", value: 24 },
        { name: "9ºA", value: 16 },
      ],
    },
    quickLinks: [
      { to: "/boletim", label: "Boletim" },
      { to: "/chat", label: "Chat" },
      { to: "/avisos", label: "Avisos" },
    ],
  },
};

function Dashboard() {
  const { user, role } = useAuth();
  const effectiveRole: AppRole = role ?? "aluno";
  const cfg = ROLE_CONFIG[effectiveRole];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Olá, {user?.email?.split("@")[0]} 👋
          </h1>
          <p className="text-muted-foreground text-sm">
            Painel do perfil {ROLE_LABELS[effectiveRole]}.
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">{ROLE_LABELS[effectiveRole]}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        {/* Painel lateral do perfil */}
        <Card className="h-fit">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-base truncate w-full">
              {user?.email?.split("@")[0]}
            </CardTitle>
            <CardDescription className="text-xs">{ROLE_LABELS[effectiveRole]}</CardDescription>
          </CardHeader>
          <CardContent>
            <nav className="flex flex-col gap-1">
              {cfg.quickLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Conteúdo principal */}
        <div className="space-y-4">
          <div className={`grid gap-4 sm:grid-cols-${Math.min(cfg.stats.length, 3)}`}>
            {cfg.stats.map((s) => (
              <Card key={s.label} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {s.label}
                  </CardTitle>
                  <s.icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{s.value}</div>
                  {s.hint && <p className="text-xs text-muted-foreground mt-1">{s.hint}</p>}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{cfg.chart.title}</CardTitle>
              <CardDescription>{cfg.chart.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {cfg.chart.type === "bar" ? (
                    <BarChart data={cfg.chart.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                          fontSize: "0.875rem",
                        }}
                      />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={cfg.chart.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 10]} />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                          fontSize: "0.875rem",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "hsl(var(--primary))" }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
