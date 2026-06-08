import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Loader2, ArrowRight, Calendar, Bell, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduGestão — Portal da Escola" },
      { name: "description", content: "Portal institucional EduGestão: notícias, avisos e acesso ao sistema escolar para alunos, responsáveis, professores e coordenação." },
    ],
  }),
  component: Index,
});

const NOTICIAS = [
  {
    titulo: "Matrículas 2026 abertas",
    resumo: "Período de matrículas e rematrículas para o próximo ano letivo já está disponível.",
    data: "05 Jun",
    tag: "Matrícula",
    Icon: GraduationCap,
  },
  {
    titulo: "Reunião de pais e mestres",
    resumo: "Encontro presencial no auditório, sábado às 9h. Confira o cronograma por turma.",
    data: "03 Jun",
    tag: "Evento",
    Icon: Users,
  },
  {
    titulo: "Feira de Ciências",
    resumo: "Alunos do fundamental II apresentam projetos no pátio central. Entrada gratuita.",
    data: "01 Jun",
    tag: "Cultural",
    Icon: Bell,
  },
  {
    titulo: "Calendário do 2º trimestre",
    resumo: "Datas de provas, recuperação e conselho de classe já publicadas no portal.",
    data: "28 Mai",
    tag: "Acadêmico",
    Icon: Calendar,
  },
];

function Index() {
  const { session, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b bg-card sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-foreground">EduGestão</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Portal da Escola</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#noticias" className="hover:text-foreground transition-colors">Notícias</a>
            <a href="#sobre" className="hover:text-foreground transition-colors">Sobre</a>
            <a href="#contato" className="hover:text-foreground transition-colors">Contato</a>
          </nav>

          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : session ? (
            <Button asChild size="sm">
              <Link to="/dashboard">Acessar painel <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth">Acessar <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-12">
          {/* Hero / Propaganda */}
          <section
            className="relative overflow-hidden rounded-2xl border shadow-sm"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-glow) 100%)",
            }}
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2), transparent 45%)",
              }}
            />
            <div className="relative px-6 py-12 md:px-14 md:py-20 text-primary-foreground">
              <Badge className="bg-white/15 text-primary-foreground border-0 hover:bg-white/20">
                Ano Letivo 2026
              </Badge>
              <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight max-w-2xl">
                Educação que conecta família, aluno e escola.
              </h1>
              <p className="mt-4 max-w-xl text-primary-foreground/85 text-base md:text-lg">
                Acompanhe boletins, mensalidades, avisos e a vida escolar do seu filho em um só lugar.
                Acesso seguro para alunos, responsáveis, professores e coordenação.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary" className="shadow-md">
                  <Link to={session ? "/dashboard" : "/auth"}>
                    {session ? "Ir para o painel" : "Acessar o sistema"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent border-white/40 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                  <a href="#noticias">Ver notícias</a>
                </Button>
              </div>
            </div>
          </section>

          {/* Notícias */}
          <section id="noticias" className="space-y-6">
            <div className="flex items-end justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Últimas notícias</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Fique por dentro dos comunicados e eventos da escola.
                </p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/avisos">Todas <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {NOTICIAS.map((n) => (
                <Card key={n.titulo} className="group hover:shadow-md hover:border-primary/40 transition-all overflow-hidden">
                  <div className="h-28 flex items-center justify-center relative"
                    style={{ background: "linear-gradient(135deg, var(--color-accent), var(--color-secondary))" }}
                  >
                    <n.Icon className="h-10 w-10 text-primary" />
                    <Badge variant="secondary" className="absolute top-2 left-2 text-[10px]">
                      {n.tag}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{n.data}</div>
                    <h3 className="font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                      {n.titulo}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{n.resumo}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Sobre / CTA */}
          <section id="sobre" className="grid md:grid-cols-3 gap-4">
            {[
              { Icon: GraduationCap, t: "Acompanhamento acadêmico", d: "Boletim, frequência e desempenho sempre atualizados." },
              { Icon: Bell, t: "Comunicação direta", d: "Avisos, mensagens e notificações em tempo real." },
              { Icon: Users, t: "Toda a comunidade escolar", d: "Aluno, responsável, professor e coordenação no mesmo portal." },
            ].map(({ Icon, t, d }) => (
              <Card key={t}>
                <CardContent className="p-6 space-y-2">
                  <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{t}</h3>
                  <p className="text-sm text-muted-foreground">{d}</p>
                </CardContent>
              </Card>
            ))}
          </section>
        </div>
      </main>

      <footer id="contato" className="border-t bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>© {new Date().getFullYear()} EduGestão — Portal da Escola</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Privacidade</a>
            <a href="#" className="hover:text-foreground">Termos</a>
            <Link to="/auth" className="hover:text-foreground">Entrar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
