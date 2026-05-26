# RESUME — 작업 재개 가이드

새 에이전트 세션이 시작될 때 "지금 어디까지 했고, 다음은 뭐 하면 되나"를 한 화면에서 답한다.

## 현재 진척도 (2026-05-26 갱신)

- ✅ T-001~T-014: 코어 라이브러리 + 보안 패치 + GitHub dependency 패키징 + zod v4 + 디버그 hook + TripMate primitive + 범용 라이브러리 정리 + 런타임 결함 수정 + post-PR13 review fixes
- 🟡 T-015: python-kraddr-geo 문서 구조 채택 (브랜치 `chore/adopt-kraddr-doc-structure`, PR 진행 중)
- ⬜ T-016: supercluster `generateId` 옵션 노출
- ⬜ T-017: VWorld `getCapabilities` 응답 기반 layer/tile matrix 자동 검증
- ⬜ T-018: marker portal teardown 재현 테스트

## 다음 한 작업 (1시간 이내 분량)

T-015 PR을 머지 → 새 에이전트가 `CLAUDE.md`를 진입점으로 정상 동작하는지 1~2 세션 동안 관찰. 진입 흐름에 마찰이 보이면 `CLAUDE.md`/`SKILL.md`에서 보강한다.

그 다음 후보:
- T-016이 가장 작다 (supercluster 옵션 한 줄 + 회귀 테스트).
- T-018은 fiber leak 시나리오 reproduction이 까다로워 약간 더 큼.
- T-017은 WMTS Capabilities XML 파싱 + cache 정책 결정이 필요해 ADR이 먼저 나와야 할 수 있다.

## 작업 시작 전 확인할 것

- [ ] `CLAUDE.md` 읽기 — 현재 작업 + 잔존 부채
- [ ] `AGENTS.md` 읽기 — DO NOT 룰, 식별자 매트릭스
- [ ] `SKILL.md` 읽기 — 도메인 어휘, 자주 묻는 작업
- [ ] `docs/architecture.md` 읽기 — MapStore + useEvent 구조
- [ ] `docs/decisions.md` 읽기 — 특히 ADR-7(도메인 코드 비포함), ADR-8(외부 store 패턴)
- [ ] 마지막 `docs/journal.md` 엔트리 읽기
- [ ] `git status` + `git log --oneline -10` — 어느 브랜치에 있고 어디까지 커밋되었는가
- [ ] `npm test`가 깨끗하게 통과하는지 — 시작점이 green인지 확인

## 알려진 함정

- **`dist/` 커밋 누락**: `src/` 수정 후 `npm run build`를 안 하면 CI의 `git diff --exit-code -- dist/`가 실패. PR을 머지하기 전 반드시 빌드 산출물을 커밋.
- **`'use client'` 누락**: 새 컴포넌트를 추가하면서 directive를 잊으면 Next.js App Router에서 RSC 경계 위반. DOM-touching 모듈은 모두 첫 줄에 명시.
- **inline object prop**: consumer가 `<Popup offset={[0, -8]}>`처럼 인라인 객체를 넘기는 게 일반적. effect deps에 이 객체를 그대로 넣으면 매 render마다 popup이 remount되어 `onClose` 무한 루프. construction-only opts는 ref snapshot, mutable opts는 dedicated setter effect로 분리.
- **camera prop drop**: 사용자 제스처 중 들어온 camera prop을 `isMoving()` 가드로 silent drop하면 안 됨. `pendingCameraRef` + `moveend` 핸들러로 재시도.
- **`styledata` 재진입**: 우리 자신의 `setPaintProperty`가 다시 `styledata`를 발화시켜 재진입. layer 보존이 필요하면 `style.load` 사용 (setStyle 완료 시 1회).
- **selector unstable identity**: consumer가 `useMapSelector(s => …)`처럼 매 render마다 새 함수를 넘겨도 무한 render가 일어나지 않아야 함. selector는 ref에 보관하고 cache key는 snapshot identity만 사용.
- **MapLibre mock 누락**: 새 MapLibre API를 사용하면 `test/setup.ts`의 mock에 method를 추가해야 한다. 누락 시 `TypeError: map.someMethod is not a function`.
- **VWorld API key 평문**: `.env.local`에만 두고, 코드/문서/dev 파일에 절대 박지 않는다. 과거 사고로 git history rewrite 발생한 적 있음(2026-05-24).
- **Puppeteer postinstall**: `npm install` 시 헤드리스 브라우저 다운로드가 일어남. `PUPPETEER_SKIP_DOWNLOAD=1` 환경변수로 회피.
- **TripMate 같은 도메인 코드 슬립**: PR review에서 카테고리 enum, 통화 단위, 색상 팔레트가 들어오는 PR을 발견하면 ADR-7을 들어 거절. 범용화가 필요하면 factory로 노출.

## 작업 후 의무사항

1. `docs/journal.md`에 항목 추가 (날짜·작업·구현 상세·검증·다음 작업, 역시간순)
2. `docs/tasks.md`의 T-NNN 상태 갱신 (진행 중 → 완료로 이동)
3. 결정이 있었다면 `docs/decisions.md`에 ADR 추가
4. 사용자 가시 변경이면 `CHANGELOG.md` 갱신
5. public API 변경이면 `README.md`와 `AI_AGENT_GUIDE.md` 동기화
6. `npm run build` 후 `dist/` 커밋
