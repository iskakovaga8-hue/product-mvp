"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CompetencyRadar from "@/components/results/CompetencyRadar";
import AreaFeedback from "@/components/results/AreaFeedback";
import { SECTIONS } from "@/data/questions";

interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string | null;
  company: string | null;
  years_exp: number | null;
  status: string;
  created_at: string;
}

interface UserResult {
  overall_score: number;
  section_scores: Record<string, number>;
  recommendations: Record<string, { level: string; text: string }>;
  computed_at: string;
}

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [result, setResult] = useState<UserResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        if (res.status === 403) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
        setResult(data.result);
      } catch {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy text-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-blue-200 hover:text-white"
            >
              ← Назад
            </Link>
            <h1 className="text-xl font-heading font-bold">{user.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* User info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-heading font-semibold text-navy mb-4">
            Информация о пользователе
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Email:</span>{" "}
              <span className="text-gray-800">{user.email}</span>
            </div>
            <div>
              <span className="text-gray-500">Телефон:</span>{" "}
              <span className="text-gray-800">{user.phone || "—"}</span>
            </div>
            <div>
              <span className="text-gray-500">Должность:</span>{" "}
              <span className="text-gray-800">{user.position || "—"}</span>
            </div>
            <div>
              <span className="text-gray-500">Компания:</span>{" "}
              <span className="text-gray-800">{user.company || "—"}</span>
            </div>
            <div>
              <span className="text-gray-500">Опыт:</span>{" "}
              <span className="text-gray-800">
                {user.years_exp ? `${user.years_exp} лет` : "—"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Дата регистрации:</span>{" "}
              <span className="text-gray-800">
                {new Date(user.created_at).toLocaleDateString("ru-RU")}
              </span>
            </div>
          </div>
        </div>

        {/* Results */}
        {result ? (
          <>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <h3 className="font-heading font-semibold text-navy mb-2">
                  Общий балл
                </h3>
                <p className="text-5xl font-heading font-bold text-navy">
                  {Math.round(Number(result.overall_score))}
                </p>
                <p className="text-gray-400 text-sm mt-1">из 100</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <CompetencyRadar
                  scores={result.section_scores}
                  size={300}
                />
              </div>
            </div>

            <h2 className="text-xl font-heading font-semibold text-navy mb-4">
              Детальные результаты
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {SECTIONS.map((section) => (
                <AreaFeedback
                  key={section.key}
                  sectionKey={section.key}
                  score={result.section_scores[section.key] || 0}
                  recommendation={
                    result.recommendations[section.key] || {
                      level: "developing",
                      text: "",
                    }
                  }
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center text-gray-400">
            Пользователь ещё не прошёл диагностику
          </div>
        )}
      </div>
    </div>
  );
}
