# AI Agents Context Recovery Guide

이 문서(`AGENTS.md`)는 향후 이 프로젝트에 투입될 새로운 AI 코딩 에이전트(Cursor, Copilot, ChatGPT 등)가 기존 작업의 문맥(Context)을 잃지 않고 빠르고 정확하게 파악할 수 있도록 돕는 메타(Meta) 지침서입니다.

## 🤖 당신이 AI 에이전트라면 다음 순서대로 행동하세요:

1. **작업 기록 파악 (`journal.md` 읽기)**
   - 가장 먼저 프로젝트 루트에 있는 `journal.md` 파일을 읽으세요.
   - 이 파일에는 과거 개발자가 어떤 에러를 마주했고, 어떻게 해결했는지, 그리고 최근에 어떤 보안 이슈(예: API Key 강제 푸시)가 있었는지가 상세히 기록되어 있습니다. 중복된 실수를 반복하지 않기 위해 필수적으로 읽어야 합니다.

2. **아키텍처 설계 의도 파악 (`ADR.md` 읽기)**
   - 코드를 수정하기 전, `ADR.md` (Architecture Decision Records)를 읽으세요.
   - 이 라이브러리가 왜 Kakao나 Canvas 2D가 아닌 **MapLibre GL JS (WebGL)**을 사용하는지, 마커를 왜 **React Portal**로 주입하는지 그 근본적인 이유가 적혀있습니다. 기존 아키텍처 사상을 훼손하는 코드를 짜면 안 됩니다.

3. **구현 세부 규칙 및 금지 사항 (`AI_AGENT_GUIDE.md` 읽기)**
   - 코드를 작성하기 직전, 반드시 `AI_AGENT_GUIDE.md`를 읽으세요.
   - Next.js SSR 환경에서 발생하는 에러를 피하기 위한 `dynamic import` 규칙, `useMemo`를 사용해야 하는 Props (배열, GeoJSON 데이터 등), 그리고 CORS 에러를 회피하기 위한 `transformRequest` 사용법 등 구체적인 코딩 가이드라인이 명시되어 있습니다.

## 📝 문맥(Context) 유지 원칙
- 코드를 대대적으로 수정하거나 새로운 컴포넌트를 추가했다면, 즉시 `journal.md`에 당신의 작업 내역(날짜, 이슈, 해결방법)을 한글로 상세히 추가 기록(Append)하세요.
- 아키텍처에 중대한 변화(예: 새로운 상태 관리 라이브러리 도입 등)가 생겼다면 `ADR.md`에 새로운 레코드를 추가하세요.
- API 스펙이나 필수 Props가 변경되었다면 `README.md`와 `AI_AGENT_GUIDE.md`를 즉시 동기화하세요.

당신(AI)이 이 문서를 읽고 규칙을 준수할 때, 이 프로젝트는 무한히 확장 가능하고 에러 없는 견고한 라이브러리로 유지될 수 있습니다.
