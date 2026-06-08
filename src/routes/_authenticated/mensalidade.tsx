import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wallet, ArrowLeft, Printer, CreditCard, QrCode, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/mensalidade")({
  head: () => ({ meta: [{ title: "Mensalidades — EduGestão" }] }),
  component: MensalidadePage,
});

type Mensalidade = { id: string; mes: string; vencimento: string; valor: number; status: "Aberta" | "Paga" };

const INICIAIS: Mensalidade[] = [
  { id: "1", mes: "Junho/2026",     vencimento: "10/06/2026", valor: 1280, status: "Aberta" },
  { id: "2", mes: "Maio/2026",      vencimento: "10/05/2026", valor: 1280, status: "Paga" },
  { id: "3", mes: "Abril/2026",     vencimento: "10/04/2026", valor: 1280, status: "Paga" },
  { id: "4", mes: "Março/2026",     vencimento: "10/03/2026", valor: 1280, status: "Paga" },
  { id: "5", mes: "Fevereiro/2026", vencimento: "10/02/2026", valor: 1280, status: "Paga" },
];

type View = "lista" | "metodo" | "cartao" | "pix" | "boleto";

function MensalidadePage() {
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>(INICIAIS);
  const [view, setView] = useState<View>("lista");
  const [selecionada, setSelecionada] = useState<Mensalidade | null>(null);
  const [metodo, setMetodo] = useState("cartao");

  function abrirPagamento(m: Mensalidade) { setSelecionada(m); setView("metodo"); }
  function confirmarMetodo() {
    if (metodo === "cartao") setView("cartao");
    else if (metodo === "pix") setView("pix");
    else setView("boleto");
  }
  function pagar() {
    if (!selecionada) return;
    setMensalidades(mensalidades.map((m) => m.id === selecionada.id ? { ...m, status: "Paga" } : m));
    toast.success(`Pagamento de ${selecionada.mes} confirmado`);
    setView("lista"); setSelecionada(null);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <Wallet className="h-7 w-7 text-primary" /> Mensalidades
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Consulte e pague as mensalidades em aberto.</p>
        </div>
        {view !== "lista" && (
          <Button size="sm" variant="outline" onClick={() => setView(view === "metodo" ? "lista" : "metodo")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
        )}
      </div>

      {view === "lista" && (
        <Card>
          <CardHeader>
            <CardTitle>Mensalidades 2026</CardTitle>
            <CardDescription>Selecione uma mensalidade aberta para efetuar o pagamento.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mensalidades.map((m) => (
              <div key={m.id} className="flex items-center gap-4 rounded-lg border p-4 hover:bg-accent/30 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
                  <Wallet className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{m.mes}</div>
                  <div className="text-xs text-muted-foreground">Vencimento: {m.vencimento}</div>
                </div>
                <div className="text-lg font-bold">R$ {m.valor.toFixed(2)}</div>
                {m.status === "Paga"
                  ? <Badge className="bg-success/15 text-success">Paga</Badge>
                  : <Button size="sm" onClick={() => abrirPagamento(m)}>Pagar</Button>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {view === "metodo" && selecionada && (
        <Card>
          <CardHeader>
            <CardTitle>Método de pagamento</CardTitle>
            <CardDescription>{selecionada.mes} — R$ {selecionada.valor.toFixed(2)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={metodo} onValueChange={setMetodo} className="space-y-2">
              {[{ v: "cartao", l: "Cartão de crédito", I: CreditCard },
                { v: "pix",    l: "Pix",                I: QrCode },
                { v: "boleto", l: "Boleto",             I: FileText }].map(({ v, l, I }) => (
                <Label key={v} htmlFor={v} className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent/30">
                  <RadioGroupItem id={v} value={v} />
                  <I className="h-5 w-5 text-primary" />
                  <span className="font-medium">{l}</span>
                </Label>
              ))}
            </RadioGroup>
            <Button className="w-full" onClick={confirmarMetodo}>Confirmar pagamento</Button>
          </CardContent>
        </Card>
      )}

      {view === "cartao" && selecionada && (
        <Card>
          <CardHeader><CardTitle>Cartão de crédito</CardTitle><CardDescription>{selecionada.mes} — R$ {selecionada.valor.toFixed(2)}</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Número do cartão</Label><Input placeholder="0000 0000 0000 0000" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>CVC</Label><Input placeholder="000" /></div>
              <div className="space-y-2"><Label>Validade</Label><Input placeholder="MM/AA" /></div>
            </div>
            <Button className="w-full" onClick={pagar}>Pagar</Button>
          </CardContent>
        </Card>
      )}

      {view === "pix" && selecionada && (
        <Card>
          <CardHeader><CardTitle>Pagamento via Pix</CardTitle><CardDescription>{selecionada.mes} — R$ {selecionada.valor.toFixed(2)}</CardDescription></CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="aspect-square max-w-xs mx-auto rounded-lg bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
              <QrCode className="h-32 w-32 text-primary" />
            </div>
            <div className="space-y-1">
              <Label>Código copia e cola</Label>
              <Input readOnly value={`00020126580014BR.GOV.BCB.PIX0136${selecionada.id}-edugestao-${selecionada.valor}`} className="text-center font-mono text-xs" />
            </div>
            <Button className="w-full" onClick={pagar}>Já paguei</Button>
          </CardContent>
        </Card>
      )}

      {view === "boleto" && selecionada && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Boleto bancário</CardTitle><CardDescription>{selecionada.mes} — R$ {selecionada.valor.toFixed(2)}</CardDescription></div>
            <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" /> Imprimir</Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-dashed p-8 text-center space-y-3 bg-muted/20">
              <FileText className="h-16 w-16 text-primary mx-auto" />
              <div className="font-mono text-sm">23793.38128 60082.901234 56789.012345 6 90000{Math.round(selecionada.valor * 100)}</div>
              <p className="text-xs text-muted-foreground">PDF do boleto — vencimento {selecionada.vencimento}</p>
            </div>
            <Button className="w-full mt-4" onClick={pagar}>Marcar como pago</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
