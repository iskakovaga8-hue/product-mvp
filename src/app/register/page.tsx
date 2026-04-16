"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    company: "",
    yearsExp: "",
    password: "",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error);
          return;
        }
        router.push(data.redirectTo);
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone || undefined,
            position: form.position || undefined,
            company: form.company || undefined,
            yearsExp: form.yearsExp ? parseInt(form.yearsExp) : undefined,
            password: form.password,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error);
          return;
        }
        router.push(data.redirectTo);
      }
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-gold mb-2">
            {isLogin ? "Войти в аккаунт" : "Начать диагностику"}
          </h1>
          <p className="text-gray-400">
            {isLogin
              ? "Введите email и пароль для входа"
              : "Узнайте свой потенциал независимого консультанта за 15 минут"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-navy-light rounded-2xl shadow-lg p-8 space-y-5 border border-gold/20"
        >
          {!isLogin && (
            <>
              <Input
                label="Имя *"
                placeholder="Иван Петров"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Должность"
                  placeholder="Операционный директор"
                  value={form.position}
                  onChange={(e) => update("position", e.target.value)}
                />
                <Input
                  label="Компания"
                  placeholder="ООО «Пример»"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Телефон"
                  placeholder="+7 (999) 123-45-67"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
                <Input
                  label="Лет в управлении"
                  placeholder="15"
                  type="number"
                  min="0"
                  max="50"
                  value={form.yearsExp}
                  onChange={(e) => update("yearsExp", e.target.value)}
                />
              </div>
            </>
          )}

          <Input
            label="Email *"
            placeholder="ivan@example.com"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
          <Input
            label="Пароль *"
            placeholder="Минимум 6 символов"
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
            minLength={6}
          />

          {error && (
            <div className="bg-red-900/30 border border-red-500/40 rounded-xl px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full" size="lg">
            {isLogin ? "Войти" : "Начать диагностику →"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-sm text-gold hover:underline"
            >
              {isLogin
                ? "Нет аккаунта? Зарегистрироваться"
                : "Уже есть аккаунт? Войти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
