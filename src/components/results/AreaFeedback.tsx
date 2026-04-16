"use client";

import { SECTIONS } from "@/data/questions";
import { BENCHMARK_SCORES } from "@/lib/scoring";

interface AreaFeedbackProps {
  sectionKey: string;
  score: number;
  recommendation: { level: string; text: string };
}

const LEVEL_STYLES = {
  strong: {
    badge: "bg-green-900/40 text-green-400 border border-green-500/30",
    label: "Сильная сторона",
    icon: "✓",
  },
  developing: {
    badge: "bg-gold/10 text-gold border border-gold/30",
    label: "В развитии",
    icon: "→",
  },
  needs_work: {
    badge: "bg-red-900/30 text-red-400 border border-red-500/30",
    label: "Зона роста",
    icon: "!",
  },
};

export default function AreaFeedback({
  sectionKey,
  score,
  recommendation,
}: AreaFeedbackProps) {
  const section = SECTIONS.find((s) => s.key === sectionKey);
  const benchmark = BENCHMARK_SCORES[sectionKey] || 70;
  const style =
    LEVEL_STYLES[recommendation.level as keyof typeof LEVEL_STYLES] ||
    LEVEL_STYLES.developing;

  return (
    <div className="bg-navy-light rounded-2xl p-6 border border-gold/10">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading font-semibold text-white text-lg">
            {section?.title || sectionKey}
          </h3>
          <span
            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${style.badge}`}
          >
            {style.icon} {style.label}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-heading font-bold text-gold">
            {score}
          </div>
          <div className="text-xs text-gray-500">
            бенчмарк: {benchmark}
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="relative h-3 bg-navy-medium rounded-full mb-4 overflow-hidden">
        <div
          className="absolute h-full bg-gold rounded-full transition-all duration-700"
          style={{ width: `${Math.min(score, 100)}%` }}
        />
        <div
          className="absolute h-full w-0.5 bg-orange"
          style={{ left: `${Math.min(benchmark, 100)}%` }}
          title={`Бенчмарк: ${benchmark}`}
        />
      </div>

      <p className="text-gray-400 leading-relaxed text-sm">
        {recommendation.text}
      </p>
    </div>
  );
}
