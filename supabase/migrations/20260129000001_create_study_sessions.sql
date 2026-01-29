-- ============================================
-- 스터디 타이머 데이터베이스 스키마
-- 생성일: 2026-01-29
-- 테이블: study_sessions
-- ============================================

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- study_sessions 테이블 생성
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  duration_minutes integer,
  timer_check_count integer NOT NULL DEFAULT 0,
  session_type varchar(20) NOT NULL DEFAULT 'normal',
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 제약조건: 종료 시간은 시작 시간보다 나중이어야 함
ALTER TABLE study_sessions
  ADD CONSTRAINT chk_session_time_order
  CHECK (ended_at IS NULL OR ended_at > started_at);

-- 제약조건: 공부 시간은 0보다 커야 함
ALTER TABLE study_sessions
  ADD CONSTRAINT chk_duration_positive
  CHECK (duration_minutes IS NULL OR duration_minutes > 0);

-- 제약조건: 타이머 확인 횟수는 0 이상
ALTER TABLE study_sessions
  ADD CONSTRAINT chk_timer_check_positive
  CHECK (timer_check_count >= 0);

-- 제약조건: 세션 타입
ALTER TABLE study_sessions
  ADD CONSTRAINT chk_session_type
  CHECK (session_type IN ('normal', 'extended', 'break_suggested'));

-- 인덱스: 최근 세션 조회용 (가장 많이 사용)
CREATE INDEX IF NOT EXISTS idx_sessions_created_desc
  ON study_sessions(created_at DESC);

-- 인덱스: 날짜별 필터링용
CREATE INDEX IF NOT EXISTS idx_sessions_started
  ON study_sessions(started_at);

-- RLS (Row Level Security) 활성화 (선택사항)
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 모든 데이터 접근 가능 (인증 없음)
CREATE POLICY "Allow all operations"
  ON study_sessions
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 샘플 데이터 삽입 (테스트용)
INSERT INTO study_sessions (
  started_at, ended_at, duration_minutes,
  timer_check_count, session_type, note
)
VALUES
  ('2026-01-29 09:00:00+00', '2026-01-29 09:25:00+00', 25, 1, 'normal', '수학 - 미적분'),
  ('2026-01-29 10:30:00+00', '2026-01-29 11:05:00+00', 35, 0, 'extended', '영어 단어'),
  ('2026-01-29 14:00:00+00', '2026-01-29 14:20:00+00', 20, 5, 'break_suggested', '코딩 공부'),
  ('2026-01-28 15:00:00+00', '2026-01-28 15:25:00+00', 25, 2, 'normal', '물리 복습'),
  ('2026-01-28 16:00:00+00', '2026-01-28 16:35:00+00', 35, 1, 'extended', NULL);
