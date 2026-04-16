import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { query, queryOne } from "@/lib/db";
import { getSession } from "@/lib/session";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, position, company, yearsExp, password } =
      parsed.data;

    const existing = await queryOne(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (existing) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже зарегистрирован" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const userId = crypto.randomUUID();

    await query(
      `INSERT INTO users (id, name, email, phone, position, company, years_exp, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId, name, email, phone || null, position || null, company || null, yearsExp ?? null, passwordHash]
    );

    const session = await getSession();
    session.userId = userId;
    session.name = name;
    session.email = email;
    await session.save();

    return NextResponse.json(
      { userId, redirectTo: "/diagnostic/1" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
