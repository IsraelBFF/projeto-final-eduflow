import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/_authenticated/chat")({
  component: () => (
    <ComingSoon
      title="Chat"
      description="Mensagens em tempo real entre alunos, responsáveis, professores e coordenação."
      Icon={MessageSquare}
    />
  ),
});
