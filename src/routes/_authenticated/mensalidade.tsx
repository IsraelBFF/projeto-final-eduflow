import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/_authenticated/mensalidade")({
  component: () => (
    <ComingSoon
      title="Mensalidades"
      description="Consulta de mensalidades, situação de pagamento, emissão de comprovantes e pagamento (cartão, Pix, boleto)."
      Icon={Wallet}
    />
  ),
});
