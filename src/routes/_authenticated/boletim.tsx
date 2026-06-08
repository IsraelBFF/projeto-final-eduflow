import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Pencil, Save, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/boletim")({
  head: () => ({ meta: [{ title: "Boletim — EduGestão" }] }),
  component: BoletimPage,
});

type Linha = { materia: string; b1: number | null; b2: number | null; b3: number | null; b4: number | null };

const INICIAL: Linha[] = [
  { materia: "Português",      b1: 8.5, b2: 7.8, b3: 9.0, b4: null },
  { materia: "Matemática",     b1: 7.2, b2: 8.0, b3: 7.5, b4: null },
  { materia: "História",       b1: 9.0, b2: 8.5, b3: 9.2, b4: null },
  { materia: "Geografia",      b1: 8.0, b2: 7.9, b3: 8.4, b4: null },
  { materia: "Ciências",       b1: 7.8, b2: 8.2, b3: 8.0, b4: null },
  { materia: "Inglês",         b1: 9.2, b2: 9.0, b3: 9.5, b4: null },
  { materia: "Educação Física", b1: 9.5, b2: 9.5, b3: 9.7, b4: null },
];

function media(l: Linha): string {
  const vals = [l.b1, l.b2, l.b3, l.b4].filter((v): v is number => v !== null);
  if (!vals.length) return "—";
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
}

function BoletimPage() {
  const { role } = useAuth();
  const podeEditar = role === "professor" || role === "coordenacao";
  const [linhas, setLinhas] = useState<Linha[]>(INICIAL);
  const [editando, setEditando] = useState(false);
  const [draft, setDraft] = useState<Linha[]>(INICIAL);

  const dados = editando ? draft : linhas;

  function setNota(i: number, campo: keyof Omit<Linha, "materia">, v: string) {
    const novo = [...draft];
    const num = v === "" ? null : Math.max(0, Math.min(10, Number(v)));
    novo[i] = { ...novo[i], [campo]: num };
    setDraft(novo);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <GraduationCap className="h-7 w-7 text-primary" /> Boletim
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Notas por bimestre e situação final do ano letivo.</p>
        </div>
        {podeEditar && (editando ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { setDraft(linhas); setEditando(false); }}>
              <X className="h-4 w-4 mr-1" /> Cancelar
            </Button>
            <Button size="sm" onClick={() => { setLinhas(draft); setEditando(false); toast.success("Notas salvas com sucesso"); }}>
              <Save className="h-4 w-4 mr-1" /> Salvar
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => { setDraft(linhas); setEditando(true); }}>
            <Pencil className="h-4 w-4 mr-1" /> Editar notas
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ano letivo 2026</CardTitle>
          <CardDescription>
            {podeEditar ? "Clique em editar para lançar ou ajustar as notas dos bimestres." : "Visualização das notas lançadas pelo professor."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matéria</TableHead>
                  <TableHead className="text-center">1º Bim.</TableHead>
                  <TableHead className="text-center">2º Bim.</TableHead>
                  <TableHead className="text-center">3º Bim.</TableHead>
                  <TableHead className="text-center">4º Bim.</TableHead>
                  <TableHead className="text-center">Média</TableHead>
                  <TableHead className="text-center">Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dados.map((l, i) => {
                  const m = media(l);
                  const aprovado = m !== "—" && Number(m) >= 7;
                  return (
                    <TableRow key={l.materia}>
                      <TableCell className="font-medium">{l.materia}</TableCell>
                      {(["b1", "b2", "b3", "b4"] as const).map((c) => (
                        <TableCell key={c} className="text-center">
                          {editando ? (
                            <Input
                              type="number" min={0} max={10} step={0.1}
                              value={l[c] ?? ""}
                              onChange={(e) => setNota(i, c, e.target.value)}
                              className="w-20 mx-auto text-center"
                            />
                          ) : (l[c] ?? "—")}
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-semibold">{m}</TableCell>
                      <TableCell className="text-center">
                        {m === "—" ? <Badge variant="secondary">—</Badge>
                          : aprovado ? <Badge className="bg-success text-success-foreground">Aprovado</Badge>
                          : <Badge variant="destructive">Recuperação</Badge>}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground">Frequência</TableCell>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">96% de presença no ano letivo</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
