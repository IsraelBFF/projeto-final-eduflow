import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function ComingSoon({ title, description, Icon }: { title: string; description: string; Icon: LucideIcon }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
          <Icon className="h-7 w-7 text-primary" />
          {title}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-warning" /> Em desenvolvimento
          </CardTitle>
          <CardDescription>
            Esta área faz parte do escopo do sistema e será construída na próxima onda de implementação,
            com banco de dados, validações e controle de acesso por perfil.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Solicite a continuação para implementarmos esta funcionalidade completa.
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/")({
  component: () => <ComingSoon title="Início" description="Use o menu para navegar." Icon={Construction} />,
});
