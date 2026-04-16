import { NextResponse } from "next/server";
import crypto from "crypto";
import { query, queryOne } from "@/lib/db";
import { getSession } from "@/lib/session";
import { computeSectionScores, computeOverallScore } from "@/lib/scoring";
import { generateRecommendations } from "@/lib/recommendations";

export async function POST() {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const diagnosticSession = await queryOne<{ id: string }>(
    "SELECT id FROM diagnostic_sessions WHERE user_id = $1 AND status = 'in_progress'",
    [session.userId]
  );

  if (!diagnosticSession) {
    return NextResponse.json(
      { error: "Нет активной сессии диагностики" },
      { status: 404 }
    );
  }

  // Check if already completed
  const existing = await queryOne(
    "SELECT id FROM diagnostic_results WHERE session_id = $1",
    [diagnosticSession.id]
  );
  if (existing) {
    return NextResponse.json({ redirectTo: "/results" });
  }

  // Fetch all answers
  const answers = await query<{
    question_key: string;
    answer_value: unknown;
  }>(
    "SELECT question_key, answer_value FROM diagnostic_answers WHERE session_id = $1",
    [diagnosticSession.id]
  );

  const answersMap: Record<string, number | string | string[]> = {};
  for (const a of answers) {
    const val = a.answer_value;
    answersMap[a.question_key] = val as number | string | string[];
  }

  const sectionScores = computeSectionScores(answersMap);
  const overallScore = computeOverallScore(sectionScores);
  const recommendations = generateRecommendations(sectionScores);

  const resultId = crypto.randomUUID();
  await query(
    `INSERT INTO diagnostic_results (id, session_id, user_id, overall_score, section_scores, recommendations)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      resultId,
      diagnosticSession.id,
      session.userId,
      overallScore,
      JSON.stringify(sectionScores),
      JSON.stringify(recommendations),
    ]
  );

  await query(
    "UPDATE diagnostic_sessions SET status = 'completed', completed_at = NOW() WHERE id = $1",
    [diagnosticSession.id]
  );

  return NextResponse.json({ redirectTo: "/results" });
}
