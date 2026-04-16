import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { getAdminSession } from "@/lib/session";

export async function GET() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const totalResult = await queryOne<{ count: string }>(
    "SELECT COUNT(*) as count FROM users"
  );
  const total = parseInt(totalResult?.count || "0");

  const byStatusRows = await query<{ status: string; count: string }>(
    "SELECT status, COUNT(*) as count FROM users GROUP BY status"
  );
  const byStatus: Record<string, number> = {};
  for (const row of byStatusRows) {
    byStatus[row.status] = parseInt(row.count);
  }

  const completedResult = await queryOne<{ count: string }>(
    "SELECT COUNT(DISTINCT user_id) as count FROM diagnostic_results"
  );
  const completed = parseInt(completedResult?.count || "0");
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const avgResult = await queryOne<{ avg: string }>(
    "SELECT AVG(overall_score) as avg FROM diagnostic_results"
  );
  const avgScore = avgResult?.avg ? Math.round(parseFloat(avgResult.avg)) : 0;

  return NextResponse.json({
    total,
    byStatus,
    completed,
    completionRate,
    avgScore,
  });
}
