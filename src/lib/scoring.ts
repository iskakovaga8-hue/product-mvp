import { SECTIONS } from "../data/questions";

export const BENCHMARK_SCORES: Record<string, number> = {
  expertise_audit: 78,
  product_packaging: 72,
  positioning_brand: 65,
  pricing_intuition: 70,
  sales_networking: 68,
  market_readiness: 74,
};

export function computeSectionScores(
  answers: Record<string, number | string | string[]>
): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const section of SECTIONS) {
    let total = 0;
    let count = 0;

    for (const question of section.questions) {
      const answer = answers[question.key];
      if (answer === undefined || answer === null) continue;

      if (question.type === "likert") {
        // Likert 1-5 → normalize to 0-100
        const val = typeof answer === "number" ? answer : parseInt(String(answer), 10);
        if (!isNaN(val)) {
          total += (val / 5) * 100;
          count++;
        }
      } else if (question.type === "single_choice" && question.options) {
        const option = question.options.find((o) => String(o.value) === String(answer));
        if (option && option.score !== undefined) {
          total += (option.score / 5) * 100;
          count++;
        }
      }
    }

    scores[section.key] = count > 0 ? Math.round(total / count) : 0;
  }

  return scores;
}

export function computeOverallScore(sectionScores: Record<string, number>): number {
  const values = Object.values(sectionScores);
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}
