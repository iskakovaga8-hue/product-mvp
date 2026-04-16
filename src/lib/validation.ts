import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  phone: z.string().optional(),
  position: z.string().optional(),
  company: z.string().optional(),
  yearsExp: z.number().min(0).max(50).optional(),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

export const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export const progressSchema = z.object({
  stepIndex: z.number().min(1).max(6),
  answers: z.array(
    z.object({
      questionKey: z.string(),
      sectionKey: z.string(),
      value: z.union([z.number(), z.string(), z.array(z.string())]),
    })
  ),
});

export const adminLoginSchema = z.object({
  password: z.string().min(1),
});

export const userStatusSchema = z.object({
  status: z.enum(["new", "contacted", "in_program"]),
});
