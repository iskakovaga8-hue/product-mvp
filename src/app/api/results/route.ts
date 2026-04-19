import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const result = await queryOne<{
    overall_score: number;
    section_scores: Record<string, number>;
    recommendations: Record<string, { level: string; text: string }>;
    created_at: string;
  }>(
    `SELECT dr.overall_score, dr.section_scores, dr.recommendations, dr.created_at
     FROM diagnostic_results dr
     JOIN diagnostic_sessions ds ON dr.session_id = ds.id
     WHERE dr.user_id = $1 AND ds.status = 'completed'
     ORDER BY dr.created_at DESC
     LIMIT 1`,
    [session.userId]
  );

  if (!result) {
    return NextResponse.json(
      { error: "Результаты не найдены" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    overallScore: Number(result.overall_score),
    sectionScores: result.section_scores,
    recommendations: result.recommendations,
    computedAt: result.created_at,
  });
}
