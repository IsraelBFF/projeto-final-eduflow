import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, GraduationCap, Users, BookOpen, Briefcase, UserCircle2, Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth, ROLE_LABELS, type AppRole } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar — EduGestão" }] }),
  component: AuthPage,
});

const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres").max(72),
});
const signupSchema = loginSchema.extend({
  fullName: z.string().trim().min(2, "Informe seu nome").max(100),
  role: z.enum(["aluno", "responsavel", "professor", "coordenacao"]),
});

const ROLE_ICONS: Record<AppRole, typeof GraduationCap> = {
  aluno: GraduationCap,
  responsavel: Users,
  professor: BookOpen,
  coordenacao: Briefcase,
};

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(null);

  useEffect(() => {
    if (!loading && session) void navigate({ to: "/dashboard", replace: true });
  }, [session, loading, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary via-primary to-primary-glow p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center text-primary-foreground">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">EduGestão</h1>
          <p className="text-sm text-primary-foreground/80">Sistema de Gestão Escolar</p>
        </div>

        <Card className="shadow-xl">
          {selectedRole === null ? (
            <>
              <CardHeader className="items-center text-center">
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <UserCircle2 className="h-9 w-9 text-muted-foreground" />
                </div>
                <CardTitle>Selecione seu perfil</CardTitle>
                <CardDescription>Escolha como deseja acessar o sistema.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(ROLE_LABELS) as AppRole[]).map((r) => {
                    const Icon = ROLE_ICONS[r];
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedRole(r)}
                        className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-5 transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                        <span className="text-sm font-medium">{ROLE_LABELS[r]}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="mb-2 inline-flex items-center gap-1 self-start text-xs text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3 w-3" /> Trocar perfil
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    {(() => {
                      const Icon = ROLE_ICONS[selectedRole];
                      return <Icon className="h-5 w-5 text-primary" />;
                    })()}
                  </div>
                  <div>
                    <CardTitle>{ROLE_LABELS[selectedRole]}</CardTitle>
                    <CardDescription>Acesse sua conta ou cadastre-se.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Entrar</TabsTrigger>
                    <TabsTrigger value="signup">Cadastrar</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="mt-4"><LoginForm expectedRole={selectedRole} /></TabsContent>
                  <TabsContent value="signup" className="mt-4">
                    <SignupForm defaultRole={selectedRole} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

function LoginForm({ expectedRole }: { expectedRole: AppRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) { setBusy(false); toast.error("Falha no login: " + error.message); return; }

    const userId = data.user?.id;
    if (userId) {
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", expectedRole)
        .maybeSingle();
      if (!roleRow) {
        await supabase.auth.signOut();
        setBusy(false);
        toast.error(`Este e-mail não está cadastrado como ${ROLE_LABELS[expectedRole]}.`);
        return;
      }
    }
    setBusy(false);
    toast.success("Login realizado!");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Login</Label>
        <Input id="login-email" type="email" autoComplete="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Senha</Label>
        <Input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Logar
      </Button>
    </form>
  );
}

function SignupForm({ defaultRole }: { defaultRole: AppRole }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AppRole>(defaultRole);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = signupSchema.safeParse({ fullName, email, password, role });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: parsed.data.fullName, role: parsed.data.role },
      },
    });
    setBusy(false);
    if (error) { toast.error("Falha no cadastro: " + error.message); return; }
    toast.success("Cadastro realizado! Você já pode entrar.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="su-name">Nome completo</Label>
        <Input id="su-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="su-email">E-mail</Label>
        <Input id="su-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="su-password">Senha</Label>
        <Input id="su-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label>Perfil de acesso</Label>
        <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {(Object.keys(ROLE_LABELS) as AppRole[]).map((r) => (
              <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Criar conta
      </Button>
    </form>
  );
}
