"use client";

import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LockKeyhole, LogOut, ShieldCheck } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { Toast, type ToastState } from "@/components/forms/toast";
import { loginSchema, type LoginFormValues } from "./admin-form-schema";

interface AdminUser {
  id: number;
  nome: string;
  email: string;
  papel: string;
}

interface CategoriaResumo {
  categoria: string;
  label: string;
  total: number | null;
}

const CATEGORIAS_RESUMO: Array<{ categoria: string; label: string }> = [
  { categoria: "cultura", label: "Cultura" },
  { categoria: "gastronomia", label: "Gastronomia" },
  { categoria: "lazer", label: "Lazer" },
];

const initialToast: ToastState = { open: false, message: "", type: "success" };

function AdminLoginForm({ onLoggedIn }: { onLoggedIn: (user: AdminUser) => void }) {
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [toast, setToast] = useState<ToastState>(initialToast);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setStatus("loading");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message ?? "E-mail ou senha incorretos.");
      }

      onLoggedIn(data.usuario);
    } catch (error) {
      setToast({
        open: true,
        message: error instanceof Error ? error.message : "Falha ao entrar.",
        type: "error",
      });
      window.setTimeout(() => setToast(initialToast), 2600);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="section-container flex min-h-[60vh] items-center justify-center py-16">
      <Card className="w-full max-w-sm p-8">
        <div className="flex items-center gap-2 text-nevoa">
          <LockKeyhole size={20} />
          <span className="text-xs font-semibold uppercase tracking-wide">Área restrita</span>
        </div>
        <h1 className="section-heading mt-2">Entrar no admin</h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
          Acesso exclusivo para a equipe editorial do Terê em Foco.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              {...register("email")}
              className="form-input"
            />
            <p className="mt-1 text-xs text-red-600" aria-live="polite">
              {errors.email?.message}
            </p>
          </div>

          <div>
            <label htmlFor="senha" className="mb-1 block text-sm font-medium">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              {...register("senha")}
              className="form-input"
            />
            <p className="mt-1 text-xs text-red-600" aria-live="polite">
              {errors.senha?.message}
            </p>
          </div>

          <Button type="submit" disabled={status === "loading"} className="w-full">
            {status === "loading" ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Card>
      <Toast toast={toast} onClose={() => setToast(initialToast)} />
    </div>
  );
}

function AdminDashboard({ user, onLoggedOut }: { user: AdminUser; onLoggedOut: () => void }) {
  const [resumo, setResumo] = useState<CategoriaResumo[]>(
    CATEGORIAS_RESUMO.map((item) => ({ ...item, total: null })),
  );
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelado = false;

    Promise.all(
      CATEGORIAS_RESUMO.map(async ({ categoria, label }) => {
        try {
          const res = await fetch(`/api/${categoria}`);
          const data = await res.json();
          return { categoria, label, total: res.ok ? Number(data.data?.total ?? 0) : 0 };
        } catch {
          return { categoria, label, total: 0 };
        }
      }),
    ).then((resultados) => {
      if (!cancelado) setResumo(resultados);
    });

    return () => {
      cancelado = true;
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setLoggingOut(false);
      onLoggedOut();
    }
  };

  return (
    <div className="section-container py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-nevoa" size={28} />
          <div>
            <h1 className="section-heading">Painel administrativo</h1>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Logado como <strong>{user.nome}</strong> ({user.email}) — papel: {user.papel}
            </p>
          </div>
        </div>

        <Button intent="secondary" onClick={handleLogout} disabled={loggingOut}>
          <LogOut size={16} className="mr-2" />
          {loggingOut ? "Saindo..." : "Sair"}
        </Button>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {resumo.map((item) => (
          <Card key={item.categoria} className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-nevoa">
              {item.label}
            </p>
            <p className="mt-2 font-display text-3xl text-terra dark:text-cume">
              {item.total ?? "—"}
            </p>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              artigo(s) no banco MySQL
            </p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-6">
        <p className="text-sm text-stone-600 dark:text-stone-300">
          Este painel confirma que a sessão está sendo validada contra a tabela{" "}
          <code>sessoes</code> e os dados de conteúdo vêm das tabelas <code>categorias</code> e{" "}
          <code>artigos</code>, todas no MySQL.
        </p>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(res.ok && data.ok ? data.data?.usuario : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (loading) {
    return (
      <div className="section-container flex min-h-[60vh] items-center justify-center py-16">
        <p className="text-sm text-stone-500 dark:text-stone-400">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <AdminLoginForm onLoggedIn={setUser} />;
  }

  return <AdminDashboard user={user} onLoggedOut={() => setUser(null)} />;
}
