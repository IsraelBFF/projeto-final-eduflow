import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { ComingSoon } from "./index";

export const Route = createFileRoute("/_authenticated/avisos")({
  component: () => (
    <ComingSoon
      title="Avisos"
      description="Lista de avisos da escola. Professores e coordenação podem criar, editar e remover."
      Icon={Bell}
    />
  ),
});
