import { createFileRoute } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { ComingSoon } from "./index";

export const Route = createFileRoute("/_authenticated/extrato")({
  component: () => (
    <ComingSoon
      title="Extrato da cantina"
      description="Histórico de compras com data, descrição, quantidade, valor e filtros por período."
      Icon={Receipt}
    />
  ),
});
