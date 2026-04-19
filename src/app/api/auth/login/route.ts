import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { queryOne } from "@/lib/db";
import { getSession } from "@/lib/session";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await queryOne<{
      id: string;
      name: string;
      email: string;
      password_hash: string;
    }>("SELECT id, name, email, password_hash FROM users WHERE email = $1", [
      email,
    ]);

    if (!user) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    const session = await getSession();
    session.userId = user.id;
    session.name = user.name;
    session.email = user.email;
    await session.save();

    // Check if user already completed diagnostic
    const completed = await queryOne(
      "SELECT id FROM diagnostic_results WHERE user_id = $1",
      [user.id]
    );

    const redirectTo = completed ? "/results" : "/diagnostic/1";

    return NextResponse.json({ userId: user.id, redirectTo });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
