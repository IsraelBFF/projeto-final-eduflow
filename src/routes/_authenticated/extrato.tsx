import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Receipt, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/extrato")({
  head: () => ({ meta: [{ title: "Extrato — EduGestão" }] }),
  component: ExtratoPage,
});

type Compra = { id: string; numero: string; data: string; descricao: string; quantidade: number; valor: number; status: "Pago" | "Pendente" };

const COMPRAS: Compra[] = [
  { id: "1", numero: "#0142", data: "07/06/2026", descricao: "Sanduíche natural + suco",    quantidade: 1, valor: 18.50, status: "Pago" },
  { id: "2", numero: "#0138", data: "06/06/2026", descricao: "Salgado + refrigerante",      quantidade: 2, valor: 22.00, status: "Pago" },
  { id: "3", numero: "#0131", data: "05/06/2026", descricao: "Almoço executivo",            quantidade: 1, valor: 28.00, status: "Pago" },
  { id: "4", numero: "#0125", data: "04/06/2026", descricao: "Iogurte + fruta",             quantidade: 1, valor: 12.00, status: "Pendente" },
  { id: "5", numero: "#0119", data: "03/06/2026", descricao: "Pão de queijo (3) + suco",    quantidade: 1, valor: 15.50, status: "Pago" },
  { id: "6", numero: "#0112", data: "02/06/2026", descricao: "Lanche da tarde",             quantidade: 1, valor: 19.00, status: "Pago" },
  { id: "7", numero: "#0105", data: "01/06/2026", descricao: "Açaí 300ml",                  quantidade: 1, valor: 16.00, status: "Pago" },
  { id: "8", numero: "#0098", data: "30/05/2026", descricao: "Almoço + sobremesa",          quantidade: 1, valor: 32.00, status: "Pago" },
];

function ExtratoPage() {
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState<string>("Todos");

  const filtradas = COMPRAS.filter((c) =>
    (status === "Todos" || c.status === status) &&
    (c.descricao.toLowerCase().includes(busca.toLowerCase()) || c.numero.includes(busca))
  );
  const total = filtradas.reduce((s, c) => s + c.valor, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
          <Receipt className="h-7 w-7 text-primary" /> Extrato da cantina
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Histórico de compras realizadas na cantina.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardDescription>Total filtrado</CardDescription><CardTitle className="text-2xl">R$ {total.toFixed(2)}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Compras</CardDescription><CardTitle className="text-2xl">{filtradas.length}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Pendentes</CardDescription><CardTitle className="text-2xl">{COMPRAS.filter((c) => c.status === "Pendente").length}</CardTitle></CardHeader></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <CardTitle>Compras</CardTitle>
            <div className="flex gap-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar..." className="pl-9 w-56" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtradas.map((c) => (
              <Card key={c.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
                    <Receipt className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{c.numero}</span>
                      <Badge variant={c.status === "Pago" ? "secondary" : "destructive"} className={c.status === "Pago" ? "bg-success/15 text-success" : ""}>
                        {c.status}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium truncate mt-1">{c.descricao}</div>
                    <div className="text-xs text-muted-foreground">{c.data} • Qtd {c.quantidade}</div>
                    <div className="text-lg font-bold mt-1">R$ {c.valor.toFixed(2)}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtradas.length === 0 && <p className="text-sm text-muted-foreground col-span-full text-center py-8">Nenhuma compra encontrada.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
