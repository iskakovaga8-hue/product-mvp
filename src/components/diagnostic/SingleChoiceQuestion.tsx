"use client";

import type { QuestionOption } from "@/types";

interface SingleChoiceQuestionProps {
  questionKey: string;
  text: string;
  options: QuestionOption[];
  value: string | null;
  onChange: (key: string, value: string) => void;
}

export default function SingleChoiceQuestion({
  questionKey,
  text,
  options,
  value,
  onChange,
}: SingleChoiceQuestionProps) {
  return (
    <div className="bg-navy-light rounded-2xl p-6 border border-gold/10">
      <p className="text-white font-medium mb-5 leading-relaxed">{text}</p>
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(questionKey, String(option.value))}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
              value === String(option.value)
                ? "bg-gold text-navy border-gold shadow-md shadow-gold/20 font-semibold"
                : "bg-navy-medium text-gray-300 border-gold/10 hover:border-gold/40 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
