import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/_authenticated/boletim")({
  component: () => (
    <ComingSoon
      title="Boletim"
      description="Consulta de notas por disciplina, médias e situação final. Professores poderão lançar e editar notas."
      Icon={GraduationCap}
    />
  ),
});
