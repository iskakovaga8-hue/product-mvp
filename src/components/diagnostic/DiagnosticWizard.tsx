"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SECTIONS, TOTAL_STEPS } from "../../data/questions";
import LikertQuestion from "./LikertQuestion";
import SingleChoiceQuestion from "./SingleChoiceQuestion";
import Button from "@/components/ui/Button";

interface DiagnosticWizardProps {
  step: number;
}

export default function DiagnosticWizard({ step }: DiagnosticWizardProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const section = SECTIONS[step - 1];

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch("/api/diagnostic/progress");
        const data = await res.json();

        if (!res.ok) {
          router.push("/register");
          return;
        }

        if (data.completed) {
          router.push("/results");
          return;
        }

        if (!data.session && !data.completed) {
          router.push("/register");
          return;
        }
        if (data.answers) {
          setAnswers(data.answers);
        }
      } catch {
        router.push("/register");
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, [router]);

  const handleAnswer = useCallback(
    (key: string, value: number | string) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
      setError("");
    },
    []
  );

  const saveAndNavigate = async (nextStep: number | "submit") => {
    if (!section) return;
    setSaving(true);
    setError("");

    try {
      const stepAnswers = section.questions
        .filter((q) => answers[q.key] !== undefined)
        .map((q) => ({
          questionKey: q.key,
          sectionKey: section.key,
          value: answers[q.key],
        }));

      if (stepAnswers.length > 0) {
        const saveRes = await fetch("/api/diagnostic/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stepIndex: typeof nextStep === "number" ? nextStep : step,
            answers: stepAnswers,
          }),
        });
        if (!saveRes.ok) {
          const errData = await saveRes.json().catch(() => ({}));
          setError(errData.error || "Ошибка сохранения. Попробуйте ещё раз.");
          return;
        }
      }

      if (nextStep === "submit") {
        const res = await fetch("/api/diagnostic/submit", { method: "POST" });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Ошибка при отправке результатов.");
          return;
        }
        router.push(data.redirectTo || "/results");
      } else {
        router.push(`/diagnostic/${nextStep}`);
      }
    } catch {
      setError("Ошибка соединения. Проверьте интернет и попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Загрузка диагностики...</p>
        </div>
      </div>
    );
  }

  if (!section) {
    router.push("/diagnostic/1");
    return null;
  }

  const allAnswered = section.questions.every(
    (q) => answers[q.key] !== undefined
  );
  const isLastStep = step === TOTAL_STEPS;

  return (
    <div className="min-h-screen bg-navy py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Step indicators — compact numbered circles */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {SECTIONS.map((s, i) => {
            const sectionDone = s.questions.every(
              (q) => answers[q.key] !== undefined
            );
            const isCurrent = i + 1 === step;
            return (
              <button
                key={s.key}
                onClick={() => router.push(`/diagnostic/${i + 1}`)}
                title={s.title}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isCurrent
                    ? "bg-gold text-navy scale-110 shadow-lg shadow-gold/30"
                    : sectionDone
                    ? "bg-green-600 text-white"
                    : "bg-navy-light text-gray-500 border border-gold/20 hover:border-gold/50"
                }`}
              >
                {sectionDone && !isCurrent ? "✓" : i + 1}
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-navy-light rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.round((step / TOTAL_STEPS) * 100)}%` }}
          />
        </div>

        {/* Section title */}
        <div className="mb-8">
          <p className="text-gold text-sm font-medium mb-1">
            Шаг {step} из {TOTAL_STEPS}
          </p>
          <h1 className="text-2xl font-heading font-bold text-white mb-2">
            {section.title}
          </h1>
          <p className="text-gray-400">{section.subtitle}</p>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-10">
          {section.questions.map((question) => {
            if (question.type === "likert") {
              return (
                <LikertQuestion
                  key={question.key}
                  questionKey={question.key}
                  text={question.text}
                  value={
                    typeof answers[question.key] === "number"
                      ? (answers[question.key] as number)
                      : null
                  }
                  onChange={handleAnswer}
                />
              );
            }
            if (
              question.type === "single_choice" &&
              question.options
            ) {
              return (
                <SingleChoiceQuestion
                  key={question.key}
                  questionKey={question.key}
                  text={question.text}
                  options={question.options}
                  value={
                    typeof answers[question.key] === "string"
                      ? (answers[question.key] as string)
                      : null
                  }
                  onChange={handleAnswer}
                />
              );
            }
            return null;
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/40 rounded-xl px-4 py-3 text-red-300 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pb-8">
          <Button
            variant="ghost"
            onClick={() => {
              if (step > 1) router.push(`/diagnostic/${step - 1}`);
            }}
            disabled={step === 1}
          >
            ← Назад
          </Button>

          <Button
            variant="primary"
            size="lg"
            loading={saving}
            disabled={!allAnswered}
            onClick={() =>
              saveAndNavigate(isLastStep ? "submit" : step + 1)
            }
          >
            {isLastStep ? "Завершить и узнать результаты →" : "Далее →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
