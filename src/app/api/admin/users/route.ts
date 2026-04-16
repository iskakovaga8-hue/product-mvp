import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAdminSession } from "@/lib/session";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const status = url.searchParams.get("status") || "";
  const search = url.searchParams.get("search") || "";
  const limit = 20;
  const offset = (page - 1) * limit;

  let whereClause = "WHERE 1=1";
  const params: unknown[] = [];
  let paramIndex = 1;

  if (status) {
    whereClause += ` AND u.status = $${paramIndex++}`;
    params.push(status);
  }
  if (search) {
    whereClause += ` AND (u.name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
    paramIndex++;
    params.push(`%${search}%`);
  }

  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM users u ${whereClause}`,
    params
  );
  const total = parseInt(countResult[0].count);

  const users = await query(
    `SELECT u.id, u.name, u.email, u.phone, u.position, u.company, u.years_exp,
            u.status, u.created_at,
            latest_result.overall_score,
            latest_session.status as diagnostic_status
     FROM users u
     LEFT JOIN LATERAL (
       SELECT status FROM diagnostic_sessions WHERE user_id = u.id ORDER BY started_at DESC LIMIT 1
     ) latest_session ON true
     LEFT JOIN LATERAL (
       SELECT overall_score FROM diagnostic_results WHERE user_id = u.id ORDER BY computed_at DESC LIMIT 1
     ) latest_result ON true
     ${whereClause}
     ORDER BY u.created_at DESC
     LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
    [...params, limit, offset]
  );

  return NextResponse.json({
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
