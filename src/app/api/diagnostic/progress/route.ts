import { NextResponse } from "next/server";
import crypto from "crypto";
import { query, queryOne } from "@/lib/db";
import { getSession } from "@/lib/session";
import { progressSchema } from "@/lib/validation";

export async function GET() {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  let diagnosticSession = await queryOne<{
    id: string;
    current_step: number;
    status: string;
  }>(
    "SELECT id, current_step, status FROM diagnostic_sessions WHERE user_id = $1 AND status = 'in_progress'",
    [session.userId]
  );

  if (!diagnosticSession) {
    const completed = await queryOne(
      "SELECT id FROM diagnostic_results WHERE user_id = $1",
      [session.userId]
    );
    if (completed) {
      return NextResponse.json({
        session: null,
        answers: {},
        completed: true,
      });
    }

    const sessionId = crypto.randomUUID();
    await query(
      "INSERT INTO diagnostic_sessions (id, user_id) VALUES ($1, $2)",
      [sessionId, session.userId]
    );
    diagnosticSession = { id: sessionId, current_step: 1, status: "in_progress" };
  }

  const answers = await query<{
    question_key: string;
    section_key: string;
    answer_value: unknown;
  }>(
    "SELECT question_key, section_key, answer_value FROM diagnostic_answers WHERE session_id = $1",
    [diagnosticSession.id]
  );

  const answersMap: Record<string, unknown> = {};
  for (const a of answers) {
    answersMap[a.question_key] = a.answer_value;
  }

  return NextResponse.json({
    session: {
      id: diagnosticSession.id,
      currentStep: diagnosticSession.current_step,
    },
    answers: answersMap,
    completed: false,
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = progressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { stepIndex, answers } = parsed.data;

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

  for (const answer of answers) {
    const answerId = crypto.randomUUID();
    await query(
      `INSERT INTO diagnostic_answers (id, session_id, section_key, question_key, answer_value)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (session_id, question_key)
       DO UPDATE SET answer_value = excluded.answer_value, answered_at = datetime('now')`,
      [
        answerId,
        diagnosticSession.id,
        answer.sectionKey,
        answer.questionKey,
        JSON.stringify(answer.value),
      ]
    );
  }

  await query(
    "UPDATE diagnostic_sessions SET current_step = $1 WHERE id = $2",
    [stepIndex, diagnosticSession.id]
  );

  return NextResponse.json({ ok: true });
}
