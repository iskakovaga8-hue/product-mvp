CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  phone         TEXT,
  position      TEXT,
  company       TEXT,
  years_exp     INTEGER,
  password_hash TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'contacted', 'in_program')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE diagnostic_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'in_progress'
                CHECK (status IN ('in_progress', 'completed')),
  current_step  INTEGER NOT NULL DEFAULT 1,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at  TIMESTAMPTZ
);

CREATE UNIQUE INDEX one_active_session_per_user
  ON diagnostic_sessions(user_id)
  WHERE status = 'in_progress';

CREATE TABLE diagnostic_answers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id     UUID NOT NULL REFERENCES diagnostic_sessions(id) ON DELETE CASCADE,
  section_key    TEXT NOT NULL,
  question_key   TEXT NOT NULL,
  answer_value   JSONB NOT NULL,
  answered_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, question_key)
);

CREATE TABLE diagnostic_results (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id          UUID NOT NULL UNIQUE REFERENCES diagnostic_sessions(id),
  user_id             UUID NOT NULL REFERENCES users(id),
  overall_score       NUMERIC(5,2) NOT NULL,
  section_scores      JSONB NOT NULL,
  recommendations     JSONB NOT NULL,
  computed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
