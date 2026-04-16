"use client";

interface LikertQuestionProps {
  questionKey: string;
  text: string;
  value: number | null;
  onChange: (key: string, value: number) => void;
}

const LABELS = [
  "Совсем не про меня",
  "Скорее нет",
  "Нейтрально",
  "Скорее да",
  "Точно про меня",
];

export default function LikertQuestion({
  questionKey,
  text,
  value,
  onChange,
}: LikertQuestionProps) {
  return (
    <div className="bg-navy-light rounded-2xl p-6 border border-gold/10">
      <p className="text-white font-medium mb-5 leading-relaxed">{text}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(questionKey, n)}
            className={`flex-1 py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
              value === n
                ? "bg-gold text-navy border-gold shadow-md shadow-gold/20 scale-105"
                : "bg-navy-medium text-gray-400 border-gold/10 hover:border-gold/40 hover:text-white"
            }`}
          >
            <div className="text-lg mb-1">{n}</div>
            <div className="text-xs leading-tight hidden sm:block">
              {LABELS[n - 1]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
