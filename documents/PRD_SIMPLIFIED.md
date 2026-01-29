# 📱 간소화 스터디 타이머 PRD (3시간 구현 버전)

## 1. 제품 개요

### 1.1 제품 설명
기본 타이머와 학습 세션 기록, AI 챗봇을 제공하는 심플한 스터디 도구입니다.

### 1.2 핵심 가치
- **적응형 타이머**: 집중도에 따라 자동 연장/휴식 제안
- **세션 기록**: 학습 시간 자동 저장
- **AI 챗봇**: 학습 중 질문 답변

### 1.3 타겟 사용자
혼자 공부하는 학습자 (단일 사용자, 인증 불필요)

---

## 2. 핵심 기능 (MUST HAVE)

### 2.1 적응형 타이머
**기능**
- 기본 25분 타이머
- 시작/정지/리셋 버튼
- **타이머 확인 빈도 추적** (핵심!)
- **집중도 기반 자동 제안**:
  - 집중 중 → 연장 제안 (최대 50분)
  - 피로 감지 → 휴식 제안 (5분)

**적응형 로직 (간소화)**
```
[20분 경과 시점]
  ↓
최근 5분간 타이머 확인 횟수 계산
  ↓
확인 1회 이하 → "집중 중! 10분 더 할까요?" 팝업
확인 3회 이상 → "잠깐 쉬어가요! 5분 휴식?" 팝업
  ↓
사용자 선택 (5초 후 자동 진행)
```

**UI**
```
┌─────────────────────────┐
│      ⏱ 24:35           │
│   (큰 원형 타이머)       │
│                         │
│   집중도: ⭐⭐⭐⭐⭐     │  ← 새로 추가
│   (타이머 확인 횟수 기반) │
│                         │
│  [시작] [정지] [리셋]   │
└─────────────────────────┘
```

**제안 팝업 UI**
```
┌────────────────────────────┐
│ 🚀 지금 흐름이 좋네요!      │
│    10분 더 집중할까요?      │
│                            │
│  [네, 계속할래요] [아니요]  │
│  (5초 후 자동으로 연장)     │
└────────────────────────────┘
```

### 2.2 세션 자동 저장 (Supabase)
**저장 데이터**
- 시작 시간
- 종료 시간
- 총 공부 시간
- **타이머 확인 횟수** (집중도 추적용)
- **세션 타입** (normal/extended/break)
- 메모 (선택)

**Supabase 테이블**
```sql
CREATE TABLE study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL,
  ended_at timestamptz,
  duration_minutes integer,
  timer_check_count integer DEFAULT 0,  -- 새로 추가
  session_type varchar(20) DEFAULT 'normal',  -- 새로 추가
  note text,
  created_at timestamptz DEFAULT now()
);
```

### 2.3 대시보드 (세션 목록)
**기능**
- 최근 세션 목록 (최대 50개)
- 오늘 총 공부 시간
- 이번 주 총 공부 시간

**UI**
```
┌──────────────────────────────┐
│ 📊 학습 기록                  │
├──────────────────────────────┤
│ 오늘: 2시간 30분               │
│ 이번 주: 8시간 15분            │
├──────────────────────────────┤
│ 최근 세션                     │
│ • 1/29 14:30 - 25분 공부      │
│ • 1/29 10:00 - 25분 공부      │
│ • 1/28 15:20 - 25분 공부      │
└──────────────────────────────┘
```

### 2.4 AI 챗봇 (간단 버전)
**기능**
- 질문 입력 → OpenAI/Claude API 호출
- 답변 표시
- 대화 히스토리 (세션 단위, 저장 안함)

**UI**
```
┌──────────────────────────┐
│ 💬 AI 학습 도우미    [×] │
├──────────────────────────┤
│ 👤: 미적분 설명해줘      │
│ 🤖: 미적분은...          │
│                          │
├──────────────────────────┤
│ [질문 입력]         [전송]│
└──────────────────────────┘
```

---

## 3. 기술 스택 (최소 구성)

### 3.1 프론트엔드
- **Framework**: Next.js (App Router)
- **스타일링**: Tailwind CSS
- **상태**: useState/useEffect (Context 불필요)

### 3.2 백엔드/DB
- **Database**: Supabase (PostgreSQL)
- **인증**: 없음 (단일 사용자, 직접 접근)

### 3.3 AI
- **LLM API**: OpenAI GPT-4-mini 또는 Claude
- **통신**: Next.js API Route

### 3.4 배포
- **Hosting**: Vercel (무료)

---

## 4. 데이터베이스 스키마 (간소화)

### 4.1 study_sessions 테이블
```sql
CREATE TABLE study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  duration_minutes integer,
  timer_check_count integer DEFAULT 0,
  session_type varchar(20) DEFAULT 'normal',
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 최근 세션 조회용 인덱스
CREATE INDEX idx_sessions_created
  ON study_sessions(created_at DESC);

-- 제약조건
ALTER TABLE study_sessions
  ADD CONSTRAINT chk_timer_check_positive
  CHECK (timer_check_count >= 0);

ALTER TABLE study_sessions
  ADD CONSTRAINT chk_session_type
  CHECK (session_type IN ('normal', 'extended', 'break_suggested'));
```

---

## 5. 페이지 구조

### 5.1 사이트맵
```
/ (Root - 메인 페이지)
│
├── /timer        # 타이머 화면 (메인)
└── /dashboard    # 대시보드 (세션 목록)
```

### 5.2 라우팅
```
app/
├── page.tsx              # → redirect to /timer
├── timer/
│   └── page.tsx          # 타이머 메인 화면
├── dashboard/
│   └── page.tsx          # 대시보드
└── api/
    └── chat/
        └── route.ts      # AI 챗봇 API
```

---

## 6. 컴포넌트 구조

```
app/
├── components/
│   ├── Timer.tsx            # 타이머 컴포넌트
│   ├── ChatModal.tsx        # 챗봇 모달
│   ├── SessionList.tsx      # 세션 목록
│   └── Stats.tsx            # 통계 카드
├── lib/
│   ├── supabase.ts          # Supabase 클라이언트
│   └── api.ts               # API 헬퍼
└── types/
    └── index.ts             # 타입 정의
```

---

## 7. 사용자 플로우

### 7.1 적응형 타이머 사용 플로우
```
1. /timer 접속
   ↓
2. [시작] 버튼 클릭 → 타이머 시작 (25분 기본)
   ↓
3. 공부 중 (타이머 클릭 시마다 카운트 증가)
   ↓
4. 20분 경과 → 집중도 체크
   ↓
   [집중 중] (확인 1회 이하)
     → "10분 더 할까요?" 팝업
     → 수락 시 타이머 35분으로 연장

   [피로 감지] (확인 3회 이상)
     → "5분 휴식?" 팝업
     → 수락 시 5분 휴식 타이머 시작
   ↓
5. 타이머 종료 → 알림
   ↓
6. Supabase 저장 (시간 + 확인 횟수 + 세션 타입)
   ↓
7. [다시 시작] 또는 [대시보드 보기] 선택
```

### 7.2 챗봇 사용 플로우
```
1. [💬 챗봇] 버튼 클릭
   ↓
2. 모달 열림
   ↓
3. 질문 입력 → Enter
   ↓
4. API 호출 → AI 답변
   ↓
5. 답변 표시
```

---

## 8. API 설계

### 8.1 세션 조회
```typescript
// GET /api/sessions
Response: {
  sessions: [
    {
      id: string,
      started_at: string,
      ended_at: string,
      duration_minutes: number,
      note: string
    }
  ]
}
```

### 8.2 챗봇
```typescript
// POST /api/chat
Request: {
  message: string
}

Response: {
  reply: string
}
```

---

## 9. 환경 변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI (또는 Claude)
OPENAI_API_KEY=your-api-key
```

---

## 10. 3시간 구현 체크리스트

### Phase 1: 프로젝트 셋업 (30분)
- [ ] Next.js 프로젝트 생성
- [ ] Tailwind CSS 설정
- [ ] Supabase 프로젝트 생성
- [ ] 환경 변수 설정

### Phase 2: 적응형 타이머 구현 (90분) ⏱️ 추가 30분
- [ ] Timer 컴포넌트 (카운트다운)
- [ ] 타이머 클릭 추적 로직
- [ ] 집중도 계산 (최근 5분간 클릭 횟수)
- [ ] 20분 경과 시 자동 체크
- [ ] 연장/휴식 제안 팝업
- [ ] 5초 자동 진행 타이머
- [ ] Supabase 세션 저장 (확인 횟수 포함)

### Phase 3: 대시보드 (30분) ⏱️ 시간 단축
- [ ] Supabase 세션 목록 조회
- [ ] SessionList 컴포넌트 (세션 타입 표시)
- [ ] Stats 컴포넌트

### Phase 4: AI 챗봇 (30분) ⏱️ 시간 단축
- [ ] ChatModal 컴포넌트
- [ ] /api/chat API Route
- [ ] OpenAI API 연동

---

## 11. 제외된 기능 (원본 PRD 대비)

### 제거된 복잡 기능
- ❌ 사용자 인증/로그인
- ❌ **문제 풀이 속도/정답률 추적** (복잡함)
- ❌ **다중 요인 집중도 계산** (문제 풀이, 질문 품질 등)
- ❌ 휴식 모드 풀스크린 (음악, 애니메이션)
- ❌ AI 인사이트 자동 생성
- ❌ 시간대별 히트맵
- ❌ 과목별 통계
- ❌ 대화 히스토리 저장

### 유지/간소화된 핵심 기능
- ✅ **적응형 타이머**: 타이머 확인 빈도만으로 집중도 추정
  - 원본: 4가지 요인 (문제 속도, 정답률, 타이머, 질문)
  - 간소화: **1가지 요인** (타이머 확인만)
- ✅ **자동 연장/휴식 제안**: 20분 시점에 1회만 체크
- ✅ **집중도 표시**: 별 1~5개 (시각적 피드백)
- ✅ 저장: 시간 + 확인 횟수 + 세션 타입
- ✅ 대시보드: 목록만 (차트 없음)
- ✅ 챗봇: 기본 Q&A

---

## 12. 화면 레이아웃 (간소화)

### 12.1 타이머 페이지
```
┌─────────────────────────────────────┐
│  [타이머]  [대시보드]        [💬]  │  ← 헤더
├─────────────────────────────────────┤
│                                     │
│                                     │
│            ⏱ 24:35                 │
│         (큰 타이머 표시)            │
│                                     │
│                                     │
│      [시작] [정지] [리셋]          │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### 12.2 대시보드 페이지
```
┌─────────────────────────────────────┐
│  [타이머]  [대시보드]        [💬]  │
├─────────────────────────────────────┤
│  📊 학습 통계                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  오늘: 2시간 30분                    │
│  이번 주: 8시간 15분                 │
│                                     │
│  📝 최근 세션                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • 1/29 14:30 - 25분                │
│  • 1/29 10:00 - 25분                │
│  • 1/28 15:20 - 25분                │
│  ...                                │
└─────────────────────────────────────┘
```

---

## 13. 코드 예시 (핵심 부분)

### 13.1 적응형 타이머 컴포넌트
```typescript
'use client'
import { useState, useEffect } from 'react'

export default function AdaptiveTimer() {
  const [seconds, setSeconds] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [timerCheckCount, setTimerCheckCount] = useState(0)
  const [checkTimestamps, setCheckTimestamps] = useState<number[]>([])
  const [showPrompt, setShowPrompt] = useState<'extend' | 'break' | null>(null)
  const [sessionType, setSessionType] = useState<'normal' | 'extended' | 'break_suggested'>('normal')

  // 타이머 카운트다운
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1)
      }, 1000)
    } else if (seconds === 0) {
      handleSessionEnd()
    }
    return () => { if (interval) clearInterval(interval) }
  }, [isActive, seconds])

  // 20분 경과 시 집중도 체크
  useEffect(() => {
    if (seconds === 5 * 60 && isActive) { // 20분 경과 (25-5=20)
      checkFocusLevel()
    }
  }, [seconds, isActive])

  // 타이머 클릭 시 (사용자가 타이머 확인)
  const handleTimerClick = () => {
    setTimerCheckCount(prev => prev + 1)
    setCheckTimestamps(prev => [...prev, Date.now()])
  }

  // 집중도 체크
  const checkFocusLevel = () => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    const recentChecks = checkTimestamps.filter(t => t > fiveMinutesAgo).length

    if (recentChecks <= 1) {
      // 집중 중 → 연장 제안
      setShowPrompt('extend')
      setTimeout(() => {
        if (showPrompt === 'extend') handleExtend()
      }, 5000) // 5초 후 자동 연장
    } else if (recentChecks >= 3) {
      // 피로 감지 → 휴식 제안
      setShowPrompt('break')
      setTimeout(() => {
        if (showPrompt === 'break') handleBreak()
      }, 5000) // 5초 후 자동 휴식
    }
  }

  // 연장 수락
  const handleExtend = () => {
    setSeconds(prev => prev + 10 * 60) // 10분 추가
    setSessionType('extended')
    setShowPrompt(null)
  }

  // 휴식 수락
  const handleBreak = () => {
    setSessionType('break_suggested')
    handleSessionEnd() // 현재 세션 종료
    // 5분 휴식 타이머 시작 (별도 구현 필요)
    setShowPrompt(null)
  }

  // 세션 종료
  const handleSessionEnd = async () => {
    if (!startTime) return

    const endTime = new Date()
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000)

    await saveSession({
      started_at: startTime,
      ended_at: endTime,
      duration_minutes: duration,
      timer_check_count: timerCheckCount,
      session_type: sessionType
    })

    alert(`${duration}분 완료!`)
    setIsActive(false)
    setSeconds(25 * 60)
    setTimerCheckCount(0)
    setCheckTimestamps([])
    setSessionType('normal')
  }

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const focusScore = Math.max(1, Math.min(5, 6 - Math.floor(timerCheckCount / 2)))

  return (
    <div className="flex flex-col items-center gap-8">
      {/* 타이머 (클릭 시 카운트 증가) */}
      <div
        className="text-8xl font-mono cursor-pointer"
        onClick={handleTimerClick}
      >
        {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>

      {/* 집중도 표시 */}
      <div className="text-xl">
        집중도: {'⭐'.repeat(focusScore)}
      </div>

      {/* 제어 버튼 */}
      <div className="flex gap-4">
        <button onClick={() => { setIsActive(true); setStartTime(new Date()) }}>
          시작
        </button>
        <button onClick={() => setIsActive(false)}>정지</button>
        <button onClick={() => setSeconds(25 * 60)}>리셋</button>
      </div>

      {/* 적응형 제안 팝업 */}
      {showPrompt === 'extend' && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                        bg-white p-6 rounded-lg shadow-xl">
          <p className="text-xl mb-4">🚀 지금 흐름이 좋네요!</p>
          <p className="mb-4">10분 더 집중할까요?</p>
          <div className="flex gap-4">
            <button onClick={handleExtend}>네, 계속할래요</button>
            <button onClick={() => setShowPrompt(null)}>아니요</button>
          </div>
          <p className="text-sm text-gray-500 mt-2">(5초 후 자동 연장)</p>
        </div>
      )}

      {showPrompt === 'break' && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                        bg-white p-6 rounded-lg shadow-xl">
          <p className="text-xl mb-4">😌 잠깐 쉬어가는 게 좋겠어요</p>
          <p className="mb-4">5분 휴식을 시작할까요?</p>
          <div className="flex gap-4">
            <button onClick={handleBreak}>휴식 시작</button>
            <button onClick={() => setShowPrompt(null)}>5분만 더</button>
          </div>
          <p className="text-sm text-gray-500 mt-2">(5초 후 자동 휴식)</p>
        </div>
      )}
    </div>
  )
}
```

### 13.2 챗봇 API
```typescript
// app/api/chat/route.ts
import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { message } = await req.json()

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: "당신은 학습을 돕는 AI 도우미입니다." },
      { role: "user", content: message }
    ]
  })

  return Response.json({
    reply: completion.choices[0].message.content
  })
}
```

---

## 14. 배포 가이드

### 14.1 Vercel 배포
```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 배포
vercel

# 3. 환경 변수 설정 (Vercel 대시보드)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
OPENAI_API_KEY
```

---

## 15. 향후 확장 가능 기능

### Phase 2 (추가 1-2시간)
- 메모 기능 (세션 종료 시 간단한 메모 입력)
- 주간 차트 (막대 그래프)

### Phase 3 (추가 2-3시간)
- 과목별 분류
- 간단한 통계 (가장 많이 공부한 요일)

---

**문서 버전**: v1.1-simplified-adaptive
**작성일**: 2026-01-29
**최종 수정**: 2026-01-29 (적응형 타이머 추가)
**목표 구현 시간**: 3시간 (셋업 30분 + 타이머 90분 + 대시보드 30분 + 챗봇 30분)
**난이도**: 초급~중급 (React hooks, 상태 관리 이해 필요)
