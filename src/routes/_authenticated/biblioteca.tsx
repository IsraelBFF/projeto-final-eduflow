import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Library, ArrowLeft, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/biblioteca")({
  head: () => ({ meta: [{ title: "Biblioteca — EduGestão" }] }),
  component: BibliotecaPage,
});

type Livro = { id: string; titulo: string; autor: string; categoria: string; disponivel: boolean };
type Emprestimo = { id: string; titulo: string; autor: string; devolucao: string };

const CATALOGO: Livro[] = [
  { id: "1", titulo: "Dom Casmurro",      autor: "Machado de Assis", categoria: "Literatura",  disponivel: true },
  { id: "2", titulo: "Memórias Póstumas", autor: "Machado de Assis", categoria: "Literatura",  disponivel: true },
  { id: "3", titulo: "O Cortiço",         autor: "Aluísio Azevedo",  categoria: "Literatura",  disponivel: false },
  { id: "4", titulo: "Cálculo Vol. 1",    autor: "James Stewart",    categoria: "Matemática",  disponivel: true },
  { id: "5", titulo: "Física Conceitual", autor: "Paul Hewitt",      categoria: "Ciências",    disponivel: true },
  { id: "6", titulo: "História do Brasil",autor: "Boris Fausto",     categoria: "História",    disponivel: true },
  { id: "7", titulo: "Geografia Geral",   autor: "Demétrio Magnoli", categoria: "Geografia",   disponivel: true },
  { id: "8", titulo: "Inglês Essencial",  autor: "Murphy",           categoria: "Idiomas",     disponivel: false },
];

const EMPRESTIMOS_INICIAIS: Emprestimo[] = [
  { id: "e1", titulo: "Iracema",            autor: "José de Alencar", devolucao: "15/06/2026" },
  { id: "e2", titulo: "Álgebra Linear",     autor: "Boldrini",        devolucao: "22/06/2026" },
];

type View = "home" | "alugar" | "renovar";

function BibliotecaPage() {
  const [view, setView] = useState<View>("home");
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<string>("Todas");
  const [catalogo, setCatalogo] = useState<Livro[]>(CATALOGO);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>(EMPRESTIMOS_INICIAIS);

  const categorias = ["Todas", ...Array.from(new Set(CATALOGO.map((l) => l.categoria)))];
  const filtrados = catalogo.filter((l) =>
    (categoria === "Todas" || l.categoria === categoria) &&
    (l.titulo.toLowerCase().includes(busca.toLowerCase()) || l.autor.toLowerCase().includes(busca.toLowerCase()))
  );

  function alugar(l: Livro) {
    if (!l.disponivel) return;
    setCatalogo(catalogo.map((x) => x.id === l.id ? { ...x, disponivel: false } : x));
    const dev = new Date(); dev.setDate(dev.getDate() + 14);
    setEmprestimos([...emprestimos, { id: l.id, titulo: l.titulo, autor: l.autor, devolucao: dev.toLocaleDateString("pt-BR") }]);
    toast.success(`"${l.titulo}" alugado. Devolução até ${dev.toLocaleDateString("pt-BR")}.`);
  }

  function renovar(e: Emprestimo) {
    const [d, m, y] = e.devolucao.split("/").map(Number);
    const data = new Date(y, m - 1, d); data.setDate(data.getDate() + 14);
    setEmprestimos(emprestimos.map((x) => x.id === e.id ? { ...x, devolucao: data.toLocaleDateString("pt-BR") } : x));
    toast.success(`"${e.titulo}" renovado até ${data.toLocaleDateString("pt-BR")}.`);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <Library className="h-7 w-7 text-primary" /> Biblioteca
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Alugue novos livros ou renove os atuais.</p>
        </div>
        {view !== "home" && (
          <Button size="sm" variant="outline" onClick={() => setView("home")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
        )}
      </div>

      {view === "home" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <button onClick={() => setView("alugar")}
            className="rounded-xl border bg-card p-8 text-left hover:border-primary hover:shadow-md transition-all">
            <Library className="h-10 w-10 text-primary mb-3" />
            <div className="text-lg font-semibold">Alugar livro</div>
            <p className="text-sm text-muted-foreground mt-1">Pesquise no catálogo e solicite o empréstimo.</p>
          </button>
          <button onClick={() => setView("renovar")}
            className="rounded-xl border bg-card p-8 text-left hover:border-primary hover:shadow-md transition-all">
            <Library className="h-10 w-10 text-primary mb-3" />
            <div className="text-lg font-semibold">Renovar livro</div>
            <p className="text-sm text-muted-foreground mt-1">Estenda o prazo dos livros já emprestados.</p>
          </button>
        </div>
      )}

      {view === "alugar" && (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <Card className="h-fit">
            <CardHeader><CardTitle className="text-base">Filtros</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {categorias.map((c) => (
                <button key={c} onClick={() => setCategoria(c)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    categoria === c ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                  {c}
                </button>
              ))}
            </CardContent>
          </Card>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por título ou autor..." className="pl-9" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {filtrados.map((l) => (
                <Card key={l.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="aspect-[3/4] rounded-md bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center mb-2">
                      <Library className="h-12 w-12 text-primary/60" />
                    </div>
                    <CardTitle className="text-sm">{l.titulo}</CardTitle>
                    <CardDescription className="text-xs">{l.autor} • {l.categoria}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pt-2">
                    <Button size="sm" className="w-full" disabled={!l.disponivel} onClick={() => alugar(l)}>
                      {l.disponivel ? "Alugar" : "Indisponível"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {filtrados.length === 0 && <p className="text-sm text-muted-foreground col-span-full">Nenhum livro encontrado.</p>}
            </div>
          </div>
        </div>
      )}

      {view === "renovar" && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {emprestimos.map((e) => (
            <Card key={e.id}>
              <CardHeader className="pb-2">
                <div className="aspect-[3/4] rounded-md bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center mb-2">
                  <Library className="h-12 w-12 text-primary/60" />
                </div>
                <CardTitle className="text-sm">{e.titulo}</CardTitle>
                <CardDescription className="text-xs">{e.autor}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-2">
                <Badge variant="secondary">Devolução: {e.devolucao}</Badge>
                <Button size="sm" className="w-full" onClick={() => renovar(e)}>Renovar</Button>
              </CardContent>
            </Card>
          ))}
          {emprestimos.length === 0 && <p className="text-sm text-muted-foreground col-span-full">Você não possui empréstimos ativos.</p>}
        </div>
      )}
    </div>
  );
}
