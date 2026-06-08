import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Plus, Send, ArrowLeft, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/avisos")({
  head: () => ({ meta: [{ title: "Avisos — EduGestão" }] }),
  component: AvisosPage,
});

type Aviso = { id: string; titulo: string; autor: string; destinatario: string; texto: string; data: string };

const INICIAIS: Aviso[] = [
  { id: "1", titulo: "Reunião de pais — 15/06", autor: "Coordenação", destinatario: "Responsáveis", data: "08/06/2026",
    texto: "Convidamos todos os responsáveis para a reunião pedagógica que acontecerá no auditório principal às 19h. Pauta: desempenho do segundo bimestre e calendário de provas finais." },
  { id: "2", titulo: "Feira de Ciências 2026", autor: "Prof. Marina", destinatario: "Alunos", data: "05/06/2026",
    texto: "A feira de ciências será realizada no dia 28/06. Inscrições de projetos até 20/06 com o professor responsável." },
  { id: "3", titulo: "Suspensão de aulas — feriado", autor: "Coordenação", destinatario: "Todos", data: "01/06/2026",
    texto: "Lembramos que não haverá aulas no dia 12/06 em razão do feriado municipal. As atividades retornam normalmente em 13/06." },
];

type View = "lista" | "leitura" | "novo";

function AvisosPage() {
  const { role } = useAuth();
  const podeCriar = role === "professor" || role === "coordenacao";
  const [avisos, setAvisos] = useState<Aviso[]>(INICIAIS);
  const [view, setView] = useState<View>("lista");
  const [selecionado, setSelecionado] = useState<Aviso | null>(null);

  // form novo
  const [titulo, setTitulo] = useState("");
  const [destinatario, setDestinatario] = useState("Todos");
  const [texto, setTexto] = useState("");

  function enviar() {
    if (!titulo.trim() || !texto.trim()) { toast.error("Preencha título e texto"); return; }
    const novo: Aviso = {
      id: crypto.randomUUID(), titulo, destinatario, texto, autor: "Você",
      data: new Date().toLocaleDateString("pt-BR"),
    };
    setAvisos([novo, ...avisos]);
    setTitulo(""); setTexto(""); setDestinatario("Todos");
    setView("lista");
    toast.success("Aviso publicado");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <Bell className="h-7 w-7 text-primary" /> Avisos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Comunicados publicados pela escola.</p>
        </div>
        {podeCriar && view === "lista" && (
          <Button size="sm" onClick={() => setView("novo")}>
            <Plus className="h-4 w-4 mr-1" /> Novo aviso
          </Button>
        )}
        {view !== "lista" && (
          <Button size="sm" variant="outline" onClick={() => setView("lista")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
        )}
      </div>

      {view === "lista" && (
        <Card>
          <CardHeader>
            <CardTitle>Todos os avisos</CardTitle>
            <CardDescription>Clique em um aviso para ver o conteúdo completo.</CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            {avisos.map((a) => (
              <button
                key={a.id}
                onClick={() => { setSelecionado(a); setView("leitura"); }}
                className="w-full flex items-center gap-4 py-4 text-left hover:bg-accent/40 rounded-md px-2 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{a.titulo}</div>
                  <div className="text-xs text-muted-foreground">{a.autor} • {a.data} • para {a.destinatario}</div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {view === "leitura" && selecionado && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>{selecionado.titulo}</CardTitle>
                <CardDescription>{selecionado.autor} • {selecionado.data} • para {selecionado.destinatario}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{selecionado.texto}</p>
          </CardContent>
        </Card>
      )}

      {view === "novo" && podeCriar && (
        <Card>
          <CardHeader>
            <CardTitle>Novo aviso</CardTitle>
            <CardDescription>Defina o destinatário e escreva o conteúdo do comunicado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título do aviso" />
              </div>
              <div className="space-y-2">
                <Label>Destinatário</Label>
                <Select value={destinatario} onValueChange={setDestinatario}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="Alunos">Alunos</SelectItem>
                    <SelectItem value="Responsáveis">Responsáveis</SelectItem>
                    <SelectItem value="Professores">Professores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Texto</Label>
              <Textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={8} placeholder="Conteúdo do aviso..." />
            </div>
            <div className="flex justify-end">
              <Button onClick={enviar}><Send className="h-4 w-4 mr-1" /> Enviar</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
