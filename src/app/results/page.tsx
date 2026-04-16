"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CompetencyRadar from "@/components/results/CompetencyRadar";
import ReadinessScore from "@/components/results/ReadinessScore";
import AreaFeedback from "@/components/results/AreaFeedback";
import Button from "@/components/ui/Button";
import { SECTIONS } from "@/data/questions";

interface ResultsData {
  overallScore: number;
  sectionScores: Record<string, number>;
  recommendations: Record<string, { level: string; text: string }>;
}

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const res = await fetch("/api/results");
        if (res.status === 401) {
          router.push("/register");
          return;
        }
        if (res.status === 404) {
          router.push("/diagnostic/1");
          return;
        }
        const json = await res.json();
        setData(json);
      } catch {
        router.push("/register");
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [router]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Рассчитываем результаты...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gold mb-3">
            Ваши результаты диагностики
          </h1>
          <p className="text-gray-400 text-lg">
            Анализ готовности к переходу в независимый консалтинг
          </p>
        </div>

        {/* Overall Score + Radar */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-navy-light rounded-2xl p-8 border border-gold/20 flex items-center justify-center animate-fade-in">
            <ReadinessScore score={data.overallScore} />
          </div>
          <div className="bg-navy-light rounded-2xl p-8 border border-gold/20 animate-fade-in">
            <h2 className="text-lg font-heading font-semibold text-white mb-4 text-center">
              Карта компетенций
            </h2>
            <CompetencyRadar scores={data.sectionScores} />
            <div className="flex justify-center gap-6 mt-4 text-xs text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-gold inline-block" />
                Ваш результат
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-0.5 inline-block" style={{ borderTop: "2px dashed #ff6b00" }} />
                Успешные консультанты
              </span>
            </div>
          </div>
        </div>

        {/* Section-by-section feedback */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-gold mb-6">
            Детальный анализ по направлениям
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {SECTIONS.map((section) => (
              <AreaFeedback
                key={section.key}
                sectionKey={section.key}
                score={data.sectionScores[section.key] || 0}
                recommendation={
                  data.recommendations[section.key] || {
                    level: "developing",
                    text: "",
                  }
                }
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-navy-light rounded-2xl p-8 md:p-12 text-center border-2 border-gold/30">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
            Хотите разобрать результаты с экспертом?
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto text-lg">
            Запишитесь на бесплатную 30-минутную диагностику с Ольгой Полднер.
            Разберём ваши результаты и обсудим стратегию перехода.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() =>
                window.open("https://t.me/OlgaPoldner", "_blank")
              }
            >
              Записаться на бесплатную диагностику →
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/")}
            >
              Подробнее о программе
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
