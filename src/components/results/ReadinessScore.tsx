"use client";

interface ReadinessScoreProps {
  score: number;
}

export default function ReadinessScore({ score }: ReadinessScoreProps) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = "text-red-400";
  let label = "Начальный уровень";
  if (score >= 75) {
    colorClass = "text-green-400";
    label = "Высокая готовность";
  } else if (score >= 50) {
    colorClass = "text-gold";
    label = "Хорошая база";
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#1a2744"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            className={`${colorClass} animate-score-ring`}
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-heading font-bold text-white">
            {score}
          </span>
          <span className="text-sm text-gray-500">из 100</span>
        </div>
      </div>
      <p className={`mt-3 font-heading font-semibold text-lg ${colorClass}`}>
        {label}
      </p>
      <p className="text-gray-500 text-sm mt-1">
        Индекс готовности к консалтингу
      </p>
    </div>
  );
}
