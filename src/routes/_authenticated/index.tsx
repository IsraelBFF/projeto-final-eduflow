import { createFileRoute } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/_authenticated/")({
  component: () => <ComingSoon title="Início" description="Use o menu lateral para navegar." Icon={Home} />,
});
