# 📐 적응형 스터디 타이머 - Information Architecture (IA) 문서

## 문서 정보
- **버전**: v1.0
- **최종 수정일**: 2026-01-29
- **작성자**: IA Team
- **검토자**: CTO, PM, UX Designer

---

## 목차
1. [사이트 맵 (Site Map)](#1-사이트-맵-site-map)
2. [사용자 플로우 (User Flow)](#2-사용자-플로우-user-flow)
3. [네비게이션 구조 (Navigation Structure)](#3-네비게이션-구조-navigation-structure)
4. [페이지 계층 구조 (Page Hierarchy)](#4-페이지-계층-구조-page-hierarchy)
5. [콘텐츠 조직 (Content Organization)](#5-콘텐츠-조직-content-organization)
6. [인터랙션 패턴 (Interaction Patterns)](#6-인터랙션-패턴-interaction-patterns)
7. [URL 구조 (URL Structure)](#7-url-구조-url-structure)
8. [컴포넌트 계층 구조 (Component Hierarchy)](#8-컴포넌트-계층-구조-component-hierarchy)

---

## 1. 사이트 맵 (Site Map)

### 1.1 전체 구조 다이어그램

```
/ (Root)
│
├── /auth
│   ├── /login          # 로그인
│   └── /signup         # 회원가입
│
├── /app (Main Application - 인증 필수)
│   │
│   ├── /study          # 공부 모드 (기본 화면)
│   │   ├── /active     # 활성 세션 중
│   │   └── /paused     # 일시정지 상태
│   │
│   ├── /break          # 휴식 모드
│   │   └── /active     # 휴식 진행 중
│   │
│   ├── /insights       # 인사이트 대시보드
│   │   ├── /daily      # 일일 통계
│   │   ├── /weekly     # 주간 리포트
│   │   └── /patterns   # 학습 패턴 분석
│   │
│   ├── /chat           # AI 코치 챗봇 (모달/사이드패널)
│   │
│   └── /settings       # 설정
│       ├── /profile    # 프로필 정보
│       ├── /preferences # 학습 환경 설정
│       └── /account    # 계정 관리
│
└── /onboarding         # 첫 사용자 온보딩
    ├── /welcome        # 환영 메시지
    ├── /setup          # 초기 설정
    └── /tutorial       # 간단한 튜토리얼
```

### 1.2 상태 기반 화면 전환

이 애플리케이션은 전통적인 페이지 구조보다는 **상태 기반 풀스크린 모드**로 동작합니다.

```
┌─────────────────────────────────────────────┐
│           애플리케이션 상태 전환도           │
├─────────────────────────────────────────────┤
│                                             │
│   [IDLE]                                    │
│     ↓                                       │
│   [STUDY MODE] ←→ [PAUSED]                 │
│     ↓                                       │
│   [BREAK MODE]                              │
│     ↓                                       │
│   [SESSION END] → [INSIGHTS]                │
│                                             │
│   (언제든지) → [SETTINGS]                   │
│   (언제든지) → [CHAT with AI]               │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 2. 사용자 플로우 (User Flow)

### 2.1 첫 방문 사용자 플로우

```
START
  ↓
[랜딩 화면]
  ↓
로그인 필요?
  ↓ (Yes)
[/auth/signup] → Supabase 인증 → 이메일 인증
  ↓
[/onboarding/welcome]
  ↓
[/onboarding/setup]
  - 주요 학습 주제 입력
  - 선호 휴식 음악 스타일 선택
  - 알림 설정
  ↓
[/onboarding/tutorial]
  - "타이머가 자동으로 조절돼요"
  - "집중도 점수를 실시간으로 확인하세요"
  - "AI 코치에게 언제든 질문하세요"
  ↓
[/app/study] → 첫 세션 시작
```

### 2.2 일반 공부 세션 플로우

```
[/app/study] (IDLE 상태)
  ↓
사용자: "세션 시작" 버튼 클릭
  ↓
과목/주제 입력 (선택사항)
  ↓
[/app/study/active] → 타이머 시작
  │
  ├─ (공부 중 행동)
  │   ├─ 문제 풀이 기록 (외부 도구 or 수동 입력)
  │   ├─ 챗봇 질문 (/chat 모달 열기)
  │   └─ 타이머 확인 (자동 추적)
  │
  ├─ (집중도 높음 감지)
  │   └─ 시스템: "10분 더 하시겠어요?" 팝업
  │       ├─ 수락 → 타이머 연장
  │       └─ 거절 → 현재 타이머 유지
  │
  ├─ (피로도 감지)
  │   └─ 시스템: "휴식 시작할게요" 알림
  │       └─ 자동 전환 → [/app/break/active]
  │
  └─ (사용자 수동 종료)
      ↓
    [세션 종료 화면]
      - 집중 시간: XX분
      - 평균 집중도: X.X/10
      - AI 간단 피드백
      ↓
    선택지:
      ├─ "새 세션 시작" → [/app/study]
      ├─ "인사이트 보기" → [/app/insights/daily]
      └─ "종료" → [/app/study] (IDLE)
```

### 2.3 휴식 모드 플로우

```
[/app/break/active]
  ↓
풀스크린 휴식 화면
  - 배경 애니메이션
  - 카운트다운 타이머
  - 배경 음악 자동 재생
  ↓
5분 경과 or 사용자 조기 종료
  ↓
[휴식 종료 화면]
  - "휴식 전 질문하신 내용 답변드릴까요?" (선택)
  ↓
선택지:
  ├─ "다시 집중하기" → [/app/study/active]
  ├─ "오늘은 여기까지" → [/app/insights/daily]
  └─ "추가 휴식" → [/app/break/active] (연장)
```

### 2.4 인사이트 확인 플로우

```
[/app/insights]
  ↓
탭 네비게이션:
  ├─ [/insights/daily]
  │   - 오늘 총 공부 시간
  │   - 세션별 집중도 그래프
  │   - AI 일일 피드백
  │
  ├─ [/insights/weekly]
  │   - 주간 공부 시간 추이
  │   - 시간대별 집중도 히트맵
  │   - AI 주간 인사이트
  │
  └─ [/insights/patterns]
      - 요일별 패턴
      - 골든타임 분석
      - 과목별 통계
```

### 2.5 AI 챗봇 상호작용 플로우

```
[공부 중 언제든지]
  ↓
사용자: 챗봇 아이콘 클릭
  ↓
[/chat] 모달/사이드패널 열림
  ↓
사용자: 질문 입력
  - "이 개념 설명해줘"
  - "예시 문제 만들어줘"
  - "지금 집중 상태 어때?"
  ↓
AI: 답변 생성 및 표시
  ↓
대화 히스토리 Supabase 저장
  ↓
사용자: 모달 닫기 → 공부 모드 복귀
```

---

## 3. 네비게이션 구조 (Navigation Structure)

### 3.1 글로벌 네비게이션 (Top Bar - Minimal)

**Desktop 버전**
```
┌────────────────────────────────────────────────────────┐
│ [로고] StudyFlow    [공부][휴식][인사이트]   [💬] [⚙️] [👤] │
└────────────────────────────────────────────────────────┘
```

**구성 요소:**
- **로고 영역**: 클릭 시 `/app/study` (홈)으로 이동
- **주요 모드 탭**: 
  - `공부` → `/app/study`
  - `휴식` → 비활성화 (자동 전환만 가능)
  - `인사이트` → `/app/insights`
- **액션 아이콘**:
  - `💬 챗봇` → `/chat` 모달 열기
  - `⚙️ 설정` → `/settings` 드롭다운
  - `👤 프로필` → 계정 정보 / 로그아웃

**Mobile 버전**
```
┌──────────────────────────┐
│ [≡] StudyFlow     [👤]   │
└──────────────────────────┘
```
- **햄버거 메뉴**: 모든 네비게이션 항목 포함
- **프로필 아이콘**: 간소화된 계정 메뉴

### 3.2 상태별 네비게이션 가시성

| 상태 | Top Bar 표시 | 특이사항 |
|------|-------------|---------|
| IDLE (공부 대기) | 전체 표시 | 모든 탭 활성 |
| 공부 중 (Study Active) | 최소화 옵션 | "집중 모드"로 Top Bar 숨김 가능 |
| 휴식 중 (Break Active) | 완전 숨김 | 풀스크린 휴식 화면 |
| 인사이트 확인 | 전체 표시 | 인사이트 내부 탭 네비게이션 추가 |
| 설정 화면 | 전체 표시 | 설정 사이드바 추가 |

### 3.3 컨텍스트 네비게이션

#### 3.3.1 인사이트 페이지 내부 탭
```
┌──────────────────────────────────────┐
│ 📊 인사이트                           │
├──────────────────────────────────────┤
│ [일일] [주간] [패턴 분석]             │
├──────────────────────────────────────┤
│ (선택된 탭 콘텐츠 표시)               │
└──────────────────────────────────────┘
```

#### 3.3.2 설정 화면 사이드바
```
┌────────┬───────────────────────────┐
│ 설정   │                           │
├────────┤                           │
│ 프로필 │  (선택된 설정 항목 내용)  │
│ 환경설정│                           │
│ 계정   │                           │
└────────┴───────────────────────────┘
```

### 3.4 모달/오버레이 네비게이션

- **AI 챗봇**: 우측 슬라이드 패널 (Desktop) / 풀스크린 모달 (Mobile)
- **세션 종료 요약**: 중앙 모달
- **연장/휴식 제안 팝업**: 상단 중앙 작은 알림 박스

---

## 4. 페이지 계층 구조 (Page Hierarchy)

### 4.1 계층도 (Depth 기준)

```
Level 0: / (인증 전 랜딩)
│
├─ Level 1: /auth (인증 화면)
│   ├─ /login
│   └─ /signup
│
├─ Level 1: /onboarding (첫 사용자)
│   ├─ /welcome
│   ├─ /setup
│   └─ /tutorial
│
└─ Level 1: /app (메인 애플리케이션)
    │
    ├─ Level 2: /study (공부 모드 - 기본 화면)
    │   ├─ Level 3: /active
    │   └─ Level 3: /paused
    │
    ├─ Level 2: /break (휴식 모드)
    │   └─ Level 3: /active
    │
    ├─ Level 2: /insights (인사이트)
    │   ├─ Level 3: /daily
    │   ├─ Level 3: /weekly
    │   └─ Level 3: /patterns
    │
    ├─ Level 2: /chat (AI 챗봇 - 모달)
    │
    └─ Level 2: /settings (설정)
        ├─ Level 3: /profile
        ├─ Level 3: /preferences
        └─ Level 3: /account
```

### 4.2 페이지 중요도 및 접근 빈도

| 페이지 | 중요도 | 접근 빈도 | 정보 깊이 |
|--------|--------|----------|----------|
| `/app/study` | 최상 | 매우 높음 | 얕음 (액션 중심) |
| `/app/break` | 상 | 높음 | 최소 (휴식만) |
| `/app/insights` | 상 | 중간 | 중간 (시각화) |
| `/chat` | 중 | 중간 | 깊음 (대화형) |
| `/settings` | 하 | 낮음 | 중간 (설정) |
| `/onboarding` | 중 | 1회 | 얕음 (안내) |

---

## 5. 콘텐츠 조직 (Content Organization)

### 5.1 공부 모드 (`/app/study`) 콘텐츠 구조

**레이아웃 (Desktop)**
```
┌─────────────────────────────────────────────────┐
│           [Top Bar - 최소화 가능]                │
├─────────────────────────────────────────────────┤
│                                                 │
│              [과목: 수학] (작게)                 │
│                                                 │
│                   ⏱ 23:45                       │
│              (대형 원형 타이머)                  │
│                                                 │
│          ⭐️⭐️⭐️⭐️⭐️⭐️⭐️ 집중도 7/10              │
│              (실시간 업데이트)                   │
│                                                 │
│          ━━━━━━━━━━━━━━━━━━━━                  │
│          예상 종료: 오후 3:45                    │
│                                                 │
│      [💬 AI 코치에게 질문하기]                   │
│                                                 │
│      [⏸ 일시정지]    [⏹ 세션 종료]             │
│                                                 │
└─────────────────────────────────────────────────┘
```

**콘텐츠 우선순위:**
1. **타이머 (Primary)**: 가장 큰 시각적 비중
2. **집중도 점수 (Secondary)**: 실시간 피드백
3. **액션 버튼 (Tertiary)**: 필요시 접근

**Mobile 최적화:**
- 타이머 크기 60% 유지
- 집중도 점수를 숫자만 표시 (별 아이콘 축소)
- 버튼을 하단 고정

### 5.2 휴식 모드 (`/app/break`) 콘텐츠 구조

**레이아웃 (풀스크린)**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│        (파도 애니메이션 배경 전체 화면)          │
│                                                 │
│                                                 │
│                 🎵 4:32 🎵                      │
│            (카운트다운 타이머)                   │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│            [휴식 끝내기] (작게)                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

**콘텐츠 원칙:**
- **미니멀리즘**: 타이머와 배경만 표시
- **비침입성**: 버튼도 최소화
- **감각적 경험**: 음악 + 시각적 애니메이션 우선

### 5.3 인사이트 페이지 (`/app/insights`) 콘텐츠 구조

#### 5.3.1 일일 통계 (`/insights/daily`)
```
┌─────────────────────────────────────────────────┐
│ 📊 오늘의 학습 리포트                            │
├─────────────────────────────────────────────────┤
│                                                 │
│  🕐 총 공부 시간: 3시간 25분                     │
│  📈 평균 집중도: 7.2/10                          │
│  🔥 최장 집중 세션: 42분                         │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│                                                 │
│  [세션별 집중도 그래프]                          │
│   집중도                                         │
│   10│     ╱╲                                    │
│    8│    ╱  ╲  ╱╲                               │
│    6│   ╱    ╲╱  ╲                              │
│    4│  ╱          ╲                             │
│     └─────────────────→ 시간                    │
│      9AM  11AM  2PM  4PM                        │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│                                                 │
│  💡 AI 코치의 한마디                             │
│  "오후 2-4시에 집중도가 가장 높았어요!           │
│   내일도 이 시간대를 활용해보세요 😊"            │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 5.3.2 주간 리포트 (`/insights/weekly`)
```
┌─────────────────────────────────────────────────┐
│ 📅 이번 주 학습 패턴 (1/22 - 1/28)               │
├─────────────────────────────────────────────────┤
│                                                 │
│  총 공부 시간: 15시간 30분                       │
│  평균 세션 길이: 32분                            │
│  가장 생산적인 날: 수요일 (3시간 20분)           │
│                                                 │
│  [일별 공부 시간 막대 그래프]                    │
│  시간(h)                                         │
│   4│         ██                                 │
│   3│     ██  ██                                 │
│   2│ ██  ██  ██  ██                             │
│   1│ ██  ██  ██  ██  ██                         │
│    └─────────────────────→                     │
│     월  화  수  목  금  토  일                   │
│                                                 │
│  [시간대별 집중도 히트맵]                        │
│      6AM 9AM 12PM 3PM 6PM 9PM                   │
│  월  🟦 🟩 🟩 🟨 🟦 ⬜                          │
│  화  ⬜ 🟩 🟩 🟩 🟨 ⬜                          │
│  수  🟦 🟩 🟨 🟩 🟩 ⬜                          │
│  ...                                            │
│                                                 │
│  💡 이번 주 인사이트                             │
│  • 평일 오전 집중도가 주말보다 높아요            │
│  • 목요일 오후 집중도 저하 - 충분한 휴식 필요    │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 5.3.3 학습 패턴 분석 (`/insights/patterns`)
```
┌─────────────────────────────────────────────────┐
│ 🧠 나의 학습 패턴                                │
├─────────────────────────────────────────────────┤
│                                                 │
│  [골든타임 분석]                                 │
│  🌟 최고 집중 시간대: 오후 2-4시                 │
│  ⏰ 평균 집중 지속: 35분                         │
│  ☕ 휴식 후 집중력 회복: 평균 18분               │
│                                                 │
│  [과목별 통계] (최근 30일)                       │
│  수학     ███████████ 45% (15시간)              │
│  영어     ███████ 30% (10시간)                  │
│  코딩     █████ 25% (8시간)                     │
│                                                 │
│  [추천 학습 전략]                                │
│  💡 어려운 문제는 오후 2시 이후에 푸세요          │
│  💡 긴 세션(40분+)은 주 2-3회가 적당해요         │
│  💡 월요일 아침은 복습 시간으로 활용하세요        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 5.4 AI 챗봇 (`/chat`) 콘텐츠 구조

**Desktop: 우측 슬라이드 패널 (400px)**
```
┌─────────────────────────┐
│ 💬 AI 학습 코치    [×]  │
├─────────────────────────┤
│                         │
│ [대화 히스토리]          │
│                         │
│ 👤: 미적분 연쇄법칙     │
│     설명해줘            │
│                         │
│ 🤖: 연쇄법칙은...       │
│     [예시 포함 답변]    │
│                         │
│ 👤: 예시 문제 내줘      │
│                         │
│ 🤖: [문제 생성]         │
│                         │
│ ↓ (스크롤 가능)          │
│                         │
├─────────────────────────┤
│ [질문 입력창]           │
│ [전송] [이미지 첨부]    │
└─────────────────────────┘
```

**Mobile: 풀스크린 모달**
- 상단: 헤더 + 닫기 버튼
- 중앙: 대화 영역 (전체 화면)
- 하단: 입력창 고정

**대화 톤 & 스타일:**
- **따뜻하고 격려하는 톤**: "잘하고 있어요!", "좋은 질문이에요!"
- **간결하고 명확한 답변**: 불필요한 인사말 최소화
- **맥락 기억**: 이전 질문 참조 가능

### 5.5 설정 페이지 (`/settings`) 콘텐츠 구조

**Desktop: 사이드바 + 메인 영역**
```
┌──────────┬────────────────────────────────┐
│ ⚙️ 설정   │                                │
├──────────┤  [프로필]                       │
│          │                                │
│ 👤 프로필 │  이름: 홍길동                   │
│          │  이메일: user@example.com      │
│ 🎨 환경설정│  [프로필 사진 변경]             │
│          │                                │
│ 🔐 계정   │  ─────────────────────         │
│          │                                │
│          │  주요 학습 과목:                │
│          │  □ 수학 ☑ 영어 □ 과학          │
│          │                                │
│          │  [저장]                         │
│          │                                │
└──────────┴────────────────────────────────┘
```

**환경 설정 항목:**
- 타이머 최소/최대 시간 조정
- 휴식 음악 스타일 선택
- 집중 모드 시 알림 차단
- 집중도 점수 표시 on/off

---

## 6. 인터랙션 패턴 (Interaction Patterns)

### 6.1 주요 인터랙션 유형

#### 6.1.1 타이머 제어
```
[세션 시작]
클릭 → 과목 입력 (선택) → 타이머 시작
  ↓
자동으로 /app/study/active 상태 전환

[일시정지]
클릭 → 타이머 정지 → 집중도 계산 중단
  ↓
"재개하기" 또는 "종료하기" 선택

[세션 종료]
클릭 → 확인 모달 → 세션 요약 표시
  ↓
데이터 Supabase 저장
```

#### 6.1.2 적응형 제안 응답
```
[연장 제안 팝업]
┌─────────────────────────────────┐
│ 🚀 지금 흐름이 좋네요!           │
│    10분 더 집중하시겠어요?       │
│                                 │
│    [네, 계속할래요]  [아니요]   │
│                                 │
│    (5초 후 자동 진행)            │
└─────────────────────────────────┘

사용자 응답:
- "네" → 타이머 +10분 연장
- "아니요" → 현재 타이머 유지
- 무응답 → 기본값 "네" (자동 연장)
```

```
[휴식 제안 알림]
┌─────────────────────────────────┐
│ 😌 잠깐 쉬어가는 게 좋겠어요     │
│    5분 휴식을 시작할게요         │
│                                 │
│    [휴식 시작]  [5분만 더]      │
│                                 │
│    (3초 후 자동 휴식 시작)       │
└─────────────────────────────────┘

사용자 응답:
- "휴식 시작" → 즉시 /app/break 전환
- "5분만 더" → 휴식 미루기 (1회 한정)
- 무응답 → 자동 휴식 시작
```

#### 6.1.3 챗봇 상호작용
```
[질문 입력]
텍스트 입력 → Enter 또는 전송 버튼
  ↓
로딩 인디케이터 (AI 생각 중...)
  ↓
답변 스트리밍 표시 (타이핑 효과)
  ↓
완료 후 추가 질문 가능

[빠른 액션]
"예시 문제 만들어줘" 버튼
  ↓
즉시 AI에게 요청 전송
  ↓
문제 생성 및 표시
```

#### 6.1.4 데이터 시각화 인터랙션
```
[차트 호버]
마우스 오버 → 툴팁 표시
  - 정확한 수치
  - 해당 시점 정보

[기간 선택]
드롭다운: [오늘] [이번 주] [이번 달] [전체]
  ↓
차트 데이터 재로딩 및 업데이트

[세부 정보 확장]
세션 항목 클릭 → 세부 내용 펼치기
  - 학습 주제
  - 챗봇 질문 히스토리
  - 집중도 변화 그래프
```

### 6.2 피드백 메커니즘

#### 6.2.1 시각적 피드백
| 액션 | 피드백 |
|------|--------|
| 세션 시작 | 타이머 페이드인 애니메이션 + "집중 시작!" 메시지 |
| 집중도 상승 | 별 아이콘 밝아짐 + 초록색 강조 |
| 집중도 하락 | 별 아이콘 흐려짐 + 주황색 경고 |
| 휴식 진입 | 부드러운 페이드 아웃 → 휴식 화면 전환 |
| 세션 완료 | 축하 애니메이션 (confetti) + 성취 메시지 |

#### 6.2.2 청각적 피드백
- **타이머 시작**: 부드러운 "틱" 사운드
- **휴식 시작**: 잔잔한 종소리
- **중요 알림**: 은은한 알림음 (방해하지 않는 수준)
- **세션 완료**: 긍정적인 완료 사운드

#### 6.2.3 햅틱 피드백 (Mobile)
- 버튼 클릭: 가벼운 진동
- 중요 알림: 중간 강도 진동
- 휴식 종료: 부드러운 패턴 진동

### 6.3 에러 및 엣지 케이스 처리

#### 6.3.1 네트워크 오류
```
[Supabase 연결 실패]
  ↓
로컬 스토리지에 임시 저장
  ↓
상단에 경고 배너 표시:
"⚠️ 연결이 불안정해요. 데이터는 안전하게 저장 중입니다."
  ↓
연결 복구 시 자동 동기화 + 배너 제거
```

#### 6.3.2 AI API 오류
```
[챗봇 응답 실패]
  ↓
재시도 (최대 3회)
  ↓
모두 실패 시:
"😢 잠시 답변이 어려워요. 나중에 다시 시도해주세요."
  ↓
질문은 히스토리에 저장 (나중에 재전송 가능)
```

#### 6.3.3 데이터 부족 상황
```
[인사이트 페이지 - 데이터 없음]
  ↓
빈 상태 화면 표시:
"📊 아직 충분한 데이터가 없어요
   공부를 시작하면 인사이트가 생성됩니다!"
  ↓
[첫 세션 시작하기] 버튼
```

---

## 7. URL 구조 (URL Structure)

### 7.1 URL 설계 원칙
- **단순성**: 직관적이고 예측 가능한 경로
- **상태 반영**: URL이 애플리케이션 상태를 정확히 반영
- **북마크 가능**: 주요 화면은 직접 URL 접근 가능
- **SEO 무관**: 내부 사용자 전용이므로 SEO 최적화 불필요

### 7.2 전체 URL 맵

| URL | 설명 | 인증 필요 | 북마크 가능 |
|-----|------|----------|-----------|
| `/` | 랜딩/리디렉션 | X | O |
| `/auth/login` | 로그인 | X | O |
| `/auth/signup` | 회원가입 | X | O |
| `/onboarding/welcome` | 온보딩 시작 | O | X |
| `/onboarding/setup` | 초기 설정 | O | X |
| `/onboarding/tutorial` | 튜토리얼 | O | X |
| `/app` | 앱 메인 (→ /app/study) | O | O |
| `/app/study` | 공부 모드 홈 | O | O |
| `/app/study/active` | 활성 세션 중 | O | △ (세션 복원) |
| `/app/study/paused` | 일시정지 상태 | O | △ |
| `/app/break/active` | 휴식 중 | O | X (자동 전환만) |
| `/app/insights` | 인사이트 홈 (→ daily) | O | O |
| `/app/insights/daily` | 일일 통계 | O | O |
| `/app/insights/weekly` | 주간 리포트 | O | O |
| `/app/insights/patterns` | 패턴 분석 | O | O |
| `/app/chat` | 챗봇 (모달) | O | X (모달) |
| `/app/settings` | 설정 홈 | O | O |
| `/app/settings/profile` | 프로필 설정 | O | O |
| `/app/settings/preferences` | 환경 설정 | O | O |
| `/app/settings/account` | 계정 관리 | O | O |

### 7.3 쿼리 파라미터 사용

```
/app/insights/daily?date=2026-01-28
- 특정 날짜 통계 조회

/app/insights/weekly?week=2026-W04
- 특정 주 리포트

/app/chat?context=session-123
- 특정 세션 관련 대화

/app/study/active?session=abc123&resume=true
- 중단된 세션 복원
```

### 7.4 리디렉션 규칙

```
/ 
  ├─ (인증 안됨) → /auth/login
  └─ (인증됨) → /app/study

/app
  ├─ (온보딩 미완료) → /onboarding/welcome
  └─ (온보딩 완료) → /app/study

/app/insights
  → /app/insights/daily (기본 탭)

/app/settings
  → /app/settings/profile (기본 탭)

/app/break/active
  ├─ (직접 접근) → 에러 또는 /app/study
  └─ (자동 전환) → 정상 표시
```

### 7.5 404 및 권한 오류 처리

```
404 (존재하지 않는 경로)
  → /app/study + "페이지를 찾을 수 없습니다" 토스트

401 (인증 필요)
  → /auth/login + return_url 파라미터

403 (권한 없음)
  → /app/study + "접근 권한이 없습니다" 토스트
```

---

## 8. 컴포넌트 계층 구조 (Component Hierarchy)

### 8.1 전체 컴포넌트 트리

```
App
├── AuthProvider (Supabase Auth 컨텍스트)
├── ThemeProvider (다크 모드 지원)
└── Router
    │
    ├── PublicRoutes (인증 불필요)
    │   ├── LandingPage
    │   └── AuthPages
    │       ├── LoginPage
    │       │   ├── LoginForm
    │       │   └── SocialAuthButtons
    │       └── SignupPage
    │           ├── SignupForm
    │           └── TermsCheckbox
    │
    ├── OnboardingRoutes (첫 사용자)
    │   ├── WelcomePage
    │   │   └── IntroSlides
    │   ├── SetupPage
    │   │   ├── SubjectSelector
    │   │   ├── MusicPreference
    │   │   └── NotificationSettings
    │   └── TutorialPage
    │       └── InteractiveTour
    │
    └── ProtectedRoutes (인증 필요 - MainLayout 사용)
        │
        ├── MainLayout
        │   ├── TopBar
        │   │   ├── Logo
        │   │   ├── NavTabs
        │   │   │   ├── StudyTab
        │   │   │   ├── BreakTab (비활성)
        │   │   │   └── InsightsTab
        │   │   └── ActionIcons
        │   │       ├── ChatButton
        │   │       ├── SettingsDropdown
        │   │       └── ProfileMenu
        │   │
        │   └── MainContent (Outlet)
        │
        ├── StudyPage (/app/study)
        │   ├── StudyIdle (세션 시작 전)
        │   │   ├── StartSessionButton
        │   │   ├── SubjectInput
        │   │   └── RecentSessions
        │   │
        │   └── StudyActive (/app/study/active)
        │       ├── Timer
        │       │   ├── CircularProgress
        │       │   ├── TimeDisplay
        │       │   └── ProgressBar
        │       ├── FocusScore
        │       │   ├── StarRating
        │       │   └── ScoreNumber
        │       ├── AdaptivePrompts
        │       │   ├── ExtendSessionPrompt
        │       │   └── BreakSuggestionPrompt
        │       ├── ControlButtons
        │       │   ├── PauseButton
        │       │   └── EndSessionButton
        │       └── ChatTrigger
        │
        ├── BreakPage (/app/break/active)
        │   ├── FullscreenContainer
        │   ├── BackgroundAnimation
        │   │   ├── WaveAnimation
        │   │   ├── CloudAnimation
        │   │   └── StarAnimation
        │   ├── Countdown
        │   ├── MusicPlayer
        │   └── EndBreakButton
        │
        ├── InsightsPage (/app/insights)
        │   ├── InsightsTabs
        │   │   ├── DailyTab
        │   │   ├── WeeklyTab
        │   │   └── PatternsTab
        │   │
        │   ├── DailyInsights (/insights/daily)
        │   │   ├── StatCards
        │   │   │   ├── TotalTimeCard
        │   │   │   ├── AvgFocusCard
        │   │   │   └── LongestSessionCard
        │   │   ├── FocusChart
        │   │   │   └── LineChart (Recharts)
        │   │   └── AIFeedback
        │   │       └── FeedbackCard
        │   │
        │   ├── WeeklyInsights (/insights/weekly)
        │   │   ├── WeeklySummary
        │   │   ├── DailyBarChart
        │   │   ├── HeatMap
        │   │   │   └── TimeSlotGrid
        │   │   └── WeeklyAIInsights
        │   │       └── InsightList
        │   │
        │   └── PatternInsights (/insights/patterns)
        │       ├── GoldenTimeCard
        │       ├── SubjectDistribution
        │       │   └── PieChart (Recharts)
        │       └── RecommendationCards
        │
        ├── ChatModal (/app/chat - 모달)
        │   ├── ModalOverlay
        │   ├── ChatContainer
        │   │   ├── ChatHeader
        │   │   │   ├── Title
        │   │   │   └── CloseButton
        │   │   ├── MessageList
        │   │   │   ├── UserMessage
        │   │   │   └── AIMessage
        │   │   │       ├── Avatar
        │   │   │       ├── MessageBubble
        │   │   │       └── Timestamp
        │   │   └── InputArea
        │   │       ├── TextInput
        │   │       ├── ImageUpload
        │   │       └── SendButton
        │   └── QuickActions
        │       ├── ExampleButton
        │       └── QuizButton
        │
        └── SettingsPage (/app/settings)
            ├── SettingsSidebar
            │   ├── SidebarMenu
            │   │   ├── ProfileItem
            │   │   ├── PreferencesItem
            │   │   └── AccountItem
            │
            ├── ProfileSettings (/settings/profile)
            │   ├── AvatarUpload
            │   ├── NameField
            │   └── EmailDisplay
            │
            ├── PreferencesSettings (/settings/preferences)
            │   ├── TimerSettings
            │   │   ├── MinDurationSlider
            │   │   └── MaxDurationSlider
            │   ├── BreakMusicSelector
            │   ├── NotificationToggle
            │   └── FocusScoreToggle
            │
            └── AccountSettings (/settings/account)
                ├── PasswordChange
                ├── DataExport
                └── DeleteAccount
```

### 8.2 공통 컴포넌트 (Shared Components)

```
/components/shared
│
├── Button
│   ├── PrimaryButton
│   ├── SecondaryButton
│   └── IconButton
│
├── Input
│   ├── TextInput
│   ├── NumberInput
│   └── SelectDropdown
│
├── Card
│   ├── BaseCard
│   ├── StatCard
│   └── InsightCard
│
├── Modal
│   ├── BaseModal
│   ├── ConfirmModal
│   └── AlertModal
│
├── Loading
│   ├── Spinner
│   ├── SkeletonLoader
│   └── ProgressBar
│
├── Toast
│   ├── SuccessToast
│   ├── ErrorToast
│   └── InfoToast
│
└── Charts (Recharts 래퍼)
    ├── LineChart
    ├── BarChart
    ├── PieChart
    └── HeatMap
```

### 8.3 상태 관리 컴포넌트

```
/contexts (React Context API)
│
├── AuthContext
│   ├── 사용자 인증 상태
│   ├── 로그인/로그아웃 함수
│   └── 사용자 정보
│
├── SessionContext
│   ├── 현재 세션 상태 (idle/active/paused/break)
│   ├── 타이머 데이터 (시작 시간, 경과 시간)
│   ├── 집중도 점수
│   └── 세션 제어 함수
│
├── ChatContext
│   ├── 챗봇 대화 히스토리
│   ├── 메시지 전송 함수
│   └── 로딩 상태
│
└── SettingsContext
    ├── 사용자 환경 설정
    └── 설정 업데이트 함수
```

### 8.4 데이터 흐름 (Supabase 연동)

```
Component
  ↓ (액션)
Context/Hook
  ↓ (API 호출)
Supabase Client
  ↓
Database/Auth/Storage
  ↓ (응답)
Context 업데이트
  ↓ (구독)
Component 리렌더링
```

**주요 Hooks:**
```
/hooks
│
├── useAuth.ts (인증 관련)
├── useSession.ts (세션 제어)
├── useFocusScore.ts (집중도 계산)
├── useChat.ts (챗봇 통신)
├── useInsights.ts (인사이트 데이터 로드)
└── useSupabase.ts (Supabase 클라이언트)
```

### 8.5 반응형 컴포넌트 전략

**Desktop 우선 설계 + 모바일 오버라이드**

```tsx
// 예시: Timer 컴포넌트
<Timer>
  <CircularProgress 
    size={{ desktop: 280, mobile: 200 }} 
  />
  <TimeDisplay 
    fontSize={{ desktop: '4rem', mobile: '3rem' }}
  />
  <FocusScore 
    layout={{ desktop: 'stars', mobile: 'numeric' }}
  />
</Timer>
```

**브레이크포인트:**
- Desktop: 1024px 이상
- Tablet: 768px ~ 1023px (기본 지원 없음, 필요시 추가)
- Mobile: 767px 이하

---

## 9. 접근성 및 사용성 고려사항

### 9.1 키보드 네비게이션
- **Tab 순서**: 논리적 흐름 (타이머 → 챗봇 → 제어 버튼)
- **단축키**:
  - `Space`: 세션 시작/일시정지
  - `Esc`: 모달 닫기
  - `/`: 챗봇 포커스
  - `Ctrl/Cmd + I`: 인사이트 페이지

### 9.2 스크린 리더 지원
- 모든 인터랙티브 요소에 `aria-label`
- 타이머 상태 변경 시 `aria-live="polite"` 알림
- 집중도 점수 업데이트 시 음성 안내

### 9.3 색상 접근성
- WCAG AA 준수 (4.5:1 대비율)
- 색맹 고려 색상 팔레트
- 집중도 표시에 색상 + 숫자 병행

---

## 10. 성능 최적화 전략

### 10.1 초기 로딩
- **Code Splitting**: 라우트별 lazy loading
- **Critical CSS**: 인라인 스타일 우선 로드
- **이미지 최적화**: WebP 포맷 + lazy loading

### 10.2 실시간 데이터 동기화
- **Supabase Realtime**: 집중도 점수만 실시간 업데이트
- **Debouncing**: 타이머 확인 이벤트는 5초마다 배치 전송
- **로컬 우선**: 클라이언트에서 계산 → 주기적 서버 동기화

### 10.3 차트 렌더링
- **가상화**: 긴 세션 히스토리는 가상 스크롤
- **메모이제이션**: 차트 데이터 변경 시에만 리렌더링

---

## 11. 향후 확장 고려사항

### 11.1 추가 가능 기능
- **스터디 그룹**: 친구와 공부 시간 비교
- **목표 설정**: 주간/월간 목표 추적
- **배지 시스템**: 마일스톤 달성 보상
- **캘린더 뷰**: 월별 학습 활동 시각화

### 11.2 IA 확장 시 고려사항
- `/app/groups` - 그룹 기능
- `/app/goals` - 목표 관리
- `/app/achievements` - 배지 컬렉션
- 네비게이션 복잡도 증가 → 햄버거 메뉴 검토 필요

---

## 12. 부록

### 12.1 IA 다이어그램 범례
```
[페이지명] - 독립적인 페이지/화면
(상태) - 동적 UI 상태
└─ 하위 항목 - 계층 관계
→ - 전환/리디렉션
↔ - 양방향 이동
```

### 12.2 참고 자료
- **Material Design**: 모달 및 인터랙션 패턴
- **Apple Human Interface Guidelines**: 미니멀 UI 원칙
- **Nielsen Norman Group**: IA 베스트 프랙티스

---

**문서 버전**: v1.0  
**최종 수정일**: 2026-01-29  
**작성자**: IA Team  
**검토 완료**: ✅