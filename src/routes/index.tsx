import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <BookOpen className="h-6 w-6 text-primary" />
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando EduGestão…</span>
        </div>
      </div>
    );
  }

  return <Navigate to={session ? "/dashboard" : "/auth"} replace />;
}
