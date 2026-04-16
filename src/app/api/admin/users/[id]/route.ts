import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { getAdminSession } from "@/lib/session";
import { userStatusSchema } from "@/lib/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { id } = await params;

  const user = await queryOne(
    `SELECT id, name, email, phone, position, company, years_exp, status, created_at
     FROM users WHERE id = $1`,
    [id]
  );

  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  }

  const result = await queryOne(
    `SELECT overall_score, section_scores, recommendations, computed_at
     FROM diagnostic_results WHERE user_id = $1
     ORDER BY computed_at DESC LIMIT 1`,
    [id]
  );

  return NextResponse.json({ user, result });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = userStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Неверный статус" }, { status: 400 });
  }

  await query("UPDATE users SET status = $1 WHERE id = $2", [
    parsed.data.status,
    id,
  ]);

  return NextResponse.json({ ok: true });
}
