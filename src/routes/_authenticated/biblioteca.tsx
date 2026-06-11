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

type Livro = { id: string; titulo: string; autor: string; categoria: string; disponivel: boolean; capa: string };
type Emprestimo = { id: string; titulo: string; autor: string; devolucao: string; capa: string };

// Capas via Open Library Covers API — domínio público / uso editorial
const coverIsbn = (isbn: string) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
const coverId = (id: number) => `https://covers.openlibrary.org/b/id/${id}-L.jpg`;

const CATALOGO: Livro[] = [
  // Literatura brasileira
  { id: "1",  titulo: "Dom Casmurro",            autor: "Machado de Assis",   categoria: "Literatura", disponivel: true,  capa: coverId(647501) },
  { id: "2",  titulo: "Memórias Póstumas de Brás Cubas", autor: "Machado de Assis", categoria: "Literatura", disponivel: true, capa: coverId(123152) },
  { id: "3",  titulo: "O Cortiço",               autor: "Aluísio Azevedo",    categoria: "Literatura", disponivel: false, capa: coverId(8176059) },
  { id: "4",  titulo: "Iracema",                 autor: "José de Alencar",    categoria: "Literatura", disponivel: true,  capa: coverId(2664651) },
  { id: "5",  titulo: "Capitães da Areia",       autor: "Jorge Amado",        categoria: "Literatura", disponivel: true,  capa: coverId(4178919) },
  { id: "6",  titulo: "Vidas Secas",             autor: "Graciliano Ramos",   categoria: "Literatura", disponivel: true,  capa: coverId(12369687) },
  { id: "7",  titulo: "Grande Sertão: Veredas",  autor: "Guimarães Rosa",     categoria: "Literatura", disponivel: false, capa: coverId(13909068) },
  { id: "8",  titulo: "A Hora da Estrela",       autor: "Clarice Lispector",  categoria: "Literatura", disponivel: true,  capa: coverId(650866) },

  // Literatura estrangeira
  { id: "9",  titulo: "Cem Anos de Solidão",     autor: "Gabriel García Márquez", categoria: "Literatura Estrangeira", disponivel: true, capa: coverIsbn("0060883286") },
  { id: "10", titulo: "1984",                    autor: "George Orwell",      categoria: "Literatura Estrangeira", disponivel: true,  capa: coverIsbn("0451524934") },
  { id: "11", titulo: "O Pequeno Príncipe",      autor: "Antoine de Saint-Exupéry", categoria: "Literatura Estrangeira", disponivel: true, capa: coverIsbn("0156012197") },
  { id: "12", titulo: "Orgulho e Preconceito",   autor: "Jane Austen",        categoria: "Literatura Estrangeira", disponivel: false, capa: coverIsbn("0141439513") },
  { id: "13", titulo: "Crime e Castigo",         autor: "Fiódor Dostoiévski", categoria: "Literatura Estrangeira", disponivel: true,  capa: coverIsbn("0140449132") },

  // Matemática
  { id: "14", titulo: "Cálculo Volume 1",        autor: "James Stewart",      categoria: "Matemática", disponivel: true,  capa: coverIsbn("8522112584") },
  { id: "15", titulo: "Álgebra Linear",          autor: "Boldrini",           categoria: "Matemática", disponivel: true,  capa: "" },
  { id: "16", titulo: "A Matemática do Ensino Médio", autor: "Elon Lages Lima", categoria: "Matemática", disponivel: false, capa: "" },

  // Ciências
  { id: "17", titulo: "Física Conceitual",       autor: "Paul Hewitt",        categoria: "Ciências",   disponivel: true,  capa: coverId(7065516) },
  { id: "18", titulo: "Fundamentos de Física Vol. 1", autor: "Halliday & Resnick", categoria: "Ciências", disponivel: true, capa: coverId(1246724) },
  { id: "19", titulo: "Biologia das Células",    autor: "Amabis & Martho",    categoria: "Ciências",   disponivel: true,  capa: coverId(13558691) },
  { id: "20", titulo: "Química Geral",           autor: "John B. Russell",    categoria: "Ciências",   disponivel: false, capa: coverId(2425495) },

  // História
  { id: "21", titulo: "História do Brasil",      autor: "Boris Fausto",       categoria: "História",   disponivel: true,  capa: coverIsbn("8531403022") },
  { id: "22", titulo: "1808",                    autor: "Laurentino Gomes",   categoria: "História",   disponivel: true,  capa: coverIsbn("8576653206") },
  { id: "23", titulo: "Sapiens",                 autor: "Yuval Noah Harari",  categoria: "História",   disponivel: true,  capa: coverIsbn("0062316095") },

  // Geografia
  { id: "24", titulo: "Geografia Geral e do Brasil", autor: "Demétrio Magnoli", categoria: "Geografia", disponivel: true, capa: "" },
  { id: "25", titulo: "Atlas Geográfico Mundial", autor: "Saraiva",            categoria: "Geografia",  disponivel: true,  capa: coverId(14582252) },

  // Idiomas
  { id: "26", titulo: "English Grammar in Use",  autor: "Raymond Murphy",     categoria: "Idiomas",    disponivel: false, capa: coverIsbn("0521189063") },
  { id: "27", titulo: "Gramática Houaiss",       autor: "José Carlos Azeredo",categoria: "Idiomas",    disponivel: true,  capa: "" },
  { id: "28", titulo: "Le Petit Larousse",       autor: "Larousse",           categoria: "Idiomas",    disponivel: true,  capa: coverId(965175) },
];

const EMPRESTIMOS_INICIAIS: Emprestimo[] = [
  { id: "e1", titulo: "Iracema",                  autor: "José de Alencar", devolucao: "15/06/2026", capa: coverId(2664651) },
  { id: "e2", titulo: "Álgebra Linear",           autor: "Boldrini",        devolucao: "22/06/2026", capa: "" },
  { id: "e3", titulo: "O Pequeno Príncipe",       autor: "Antoine de Saint-Exupéry", devolucao: "30/06/2026", capa: coverIsbn("0156012197") },
];

type View = "home" | "alugar" | "renovar";

function CapaLivro({ src, titulo }: { src: string; titulo: string }) {
  return (
    <div className="aspect-[2/3] rounded-md overflow-hidden bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center mb-2 relative">
      <img
        src={src}
        alt={`Capa de ${titulo}`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      />
      <Library className="h-12 w-12 text-primary/60" />
    </div>
  );
}

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
    setEmprestimos([...emprestimos, { id: l.id, titulo: l.titulo, autor: l.autor, devolucao: dev.toLocaleDateString("pt-BR"), capa: l.capa }]);
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
                    <CapaLivro src={l.capa} titulo={l.titulo} />
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
                <CapaLivro src={e.capa} titulo={e.titulo} />
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
