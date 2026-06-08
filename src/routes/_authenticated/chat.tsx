import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({ meta: [{ title: "Chat — EduGestão" }] }),
  component: ChatPage,
});

type Mensagem = { id: string; autor: "eu" | "outro"; texto: string; hora: string };
type Contato  = { id: string; nome: string; papel: string; ultima: string; mensagens: Mensagem[] };

const INICIAIS: Contato[] = [
  { id: "1", nome: "Prof. Marina Souza",  papel: "Professora de Português",  ultima: "Não esqueça da redação!",
    mensagens: [
      { id: "a", autor: "outro", texto: "Olá! Tudo bem com você?", hora: "09:12" },
      { id: "b", autor: "eu",    texto: "Tudo sim professora!",     hora: "09:14" },
      { id: "c", autor: "outro", texto: "Não esqueça da redação para sexta-feira.", hora: "09:15" },
    ]},
  { id: "2", nome: "Coordenação",         papel: "Equipe escolar",           ultima: "Reunião confirmada para 19h.",
    mensagens: [{ id: "a", autor: "outro", texto: "Reunião confirmada para 19h.", hora: "Ontem" }] },
  { id: "3", nome: "Prof. Carlos Lima",   papel: "Professor de Matemática",  ultima: "Bom trabalho na prova!",
    mensagens: [{ id: "a", autor: "outro", texto: "Bom trabalho na prova!", hora: "07/06" }] },
  { id: "4", nome: "Secretaria",          papel: "Atendimento",              ultima: "Documentos recebidos.",
    mensagens: [{ id: "a", autor: "outro", texto: "Documentos recebidos.", hora: "05/06" }] },
  { id: "5", nome: "Prof. Ana Beatriz",   papel: "Professora de História",   ultima: "Material disponível no portal.",
    mensagens: [{ id: "a", autor: "outro", texto: "Material disponível no portal.", hora: "03/06" }] },
];

function ChatPage() {
  const { user } = useAuth();
  const [contatos, setContatos] = useState<Contato[]>(INICIAIS);
  const [ativoId, setAtivoId] = useState<string>(INICIAIS[0].id);
  const [texto, setTexto] = useState("");
  const fimRef = useRef<HTMLDivElement>(null);

  const ativo = contatos.find((c) => c.id === ativoId)!;

  useEffect(() => { fimRef.current?.scrollIntoView({ behavior: "smooth" }); }, [ativo.mensagens.length, ativoId]);

  function enviar() {
    if (!texto.trim()) return;
    const hora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const nova: Mensagem = { id: crypto.randomUUID(), autor: "eu", texto, hora };
    setContatos(contatos.map((c) => c.id === ativoId
      ? { ...c, mensagens: [...c.mensagens, nova], ultima: texto } : c));
    setTexto("");
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
          <MessageSquare className="h-7 w-7 text-primary" /> Chat
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Converse com professores, coordenação e responsáveis.</p>
      </div>

      <Card className="flex-1 grid grid-cols-[280px_1fr] overflow-hidden">
        <div className="border-r overflow-y-auto bg-muted/20">
          {contatos.map((c) => (
            <button key={c.id} onClick={() => setAtivoId(c.id)}
              className={cn("w-full flex items-center gap-3 p-3 border-b text-left hover:bg-accent/40 transition-colors",
                ativoId === c.id && "bg-accent")}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{c.nome}</div>
                <div className="text-xs text-muted-foreground truncate">{c.ultima}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">{ativo.nome}</div>
              <div className="text-xs text-muted-foreground">{ativo.papel}</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
            {ativo.mensagens.map((m) => (
              <div key={m.id} className={cn("flex", m.autor === "eu" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[70%] rounded-2xl px-4 py-2 text-sm",
                  m.autor === "eu" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border rounded-bl-sm")}>
                  <div>{m.texto}</div>
                  <div className={cn("text-[10px] mt-1", m.autor === "eu" ? "text-primary-foreground/70" : "text-muted-foreground")}>{m.hora}</div>
                </div>
              </div>
            ))}
            <div ref={fimRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); enviar(); }} className="flex gap-2 p-3 border-t bg-background">
            <Input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={`Mensagem como ${user?.email?.split("@")[0]}...`} />
            <Button type="submit" disabled={!texto.trim()}><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
