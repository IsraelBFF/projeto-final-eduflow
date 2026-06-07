import { createFileRoute } from "@tanstack/react-router";
import { Library } from "lucide-react";
import { ComingSoon } from "./index";

export const Route = createFileRoute("/_authenticated/biblioteca")({
  component: () => (
    <ComingSoon
      title="Biblioteca"
      description="Catálogo de livros, aluguel, renovação de empréstimos, histórico e disponibilidade."
      Icon={Library}
    />
  ),
});
