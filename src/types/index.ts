export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string | null;
  company: string | null;
  years_exp: number | null;
  status: "new" | "contacted" | "in_program";
  created_at: string;
  updated_at: string;
}

export interface DiagnosticSession {
  id: string;
  user_id: string;
  status: "in_progress" | "completed";
  current_step: number;
  started_at: string;
  completed_at: string | null;
}

export interface DiagnosticAnswer {
  id: string;
  session_id: string;
  section_key: string;
  question_key: string;
  answer_value: number | string | string[];
  answered_at: string;
}

export interface DiagnosticResult {
  id: string;
  session_id: string;
  user_id: string;
  overall_score: number;
  section_scores: Record<string, number>;
  recommendations: Record<string, { level: string; text: string }>;
  computed_at: string;
}

export interface SessionData {
  userId: string;
  name: string;
  email: string;
}

export interface AdminSessionData {
  isAdmin: boolean;
}

export type QuestionType = "likert" | "single_choice" | "multi_choice";

export interface QuestionOption {
  value: string | number;
  label: string;
  score?: number;
}

export interface Question {
  key: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
}

export interface Section {
  key: string;
  title: string;
  subtitle: string;
  questions: Question[];
}
