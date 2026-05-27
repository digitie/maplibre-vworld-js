# JOURNAL — 작업 일지

새 항목은 항상 파일 맨 위에 추가(역시간순). 기존 항목은 절대 수정하지 않는다 — 잘못된 결정조차 기록으로 남는 것이 가치다.

## 2026-05-27 (T-024/T-025 — 소비자 요구사항 문서화 및 CodeGraph worktree 적용)

**작업**: 사용자 요청에 따라 lazy loading, 마커 클릭/지도 클릭 구분 context, 지원되지 않는 타일 대체 이미지, CI/CD 활성화 검토, TripMate/tour-map 요구사항을 문서화했다. 코드 구현은 하지 않고 후속 T-026~T-029로 분리했다. 별도 요청된 CodeGraph는 즉시 적용 범위로 보고 `geo-codex` worktree와 프로젝트 로컬 MCP 설정을 추가했다.

**구현 상세**:
- `docs/consumer-requirements.md` 신설. R-001~R-004 요구사항별 배경, 수용 기준, 예정 API 예시, TripMate/tour-map 예제를 정리.
- `docs/tasks.md`에 T-024/T-025 완료와 T-026~T-029 후속 구현 백로그 추가.
- `docs/decisions.md`에 ADR-12 추가. 에이전트별 고정 worktree(`geo-codex`, `geo-claude`, `geo-antigravity`)와 CodeGraph `init -i`/`sync` 운영 방식을 결정으로 기록.
- `docs/dev-environment.md`, `AGENTS.md`, `SKILL.md`, `CLAUDE.md`, `docs/resume.md`에 worktree + CodeGraph 절차와 새 요구사항 문서 진입점을 반영.
- `.gitignore`에 `.codegraph/` 추가, `.codex/config.toml`에 CodeGraph MCP 서버 설정 추가.

**검증**:
- CodeGraph 공식 문서와 CLI help 기준으로 `init -i`, `sync`, `status`, `serve --mcp` 흐름 확인.
- `npx -y @colbymchenry/codegraph init -i` → 성공. 36 files, 275 nodes, 235 edges 인덱싱.
- `npx -y @colbymchenry/codegraph sync` → Already up to date.
- `npx -y @colbymchenry/codegraph status` → Index is up to date. 36 files, 275 nodes, 474 edges, DB Size 0.59 MB.
- `PUPPETEER_SKIP_DOWNLOAD=1 npm ci` → 통과.
- 사용자 요청으로 app 재시작 전 PR/머지를 우선하여 `npm run type-check`, `npm test`, `npm run build`, `git diff --exit-code -- dist/`, `npm run pack:check`는 생략.

**다음 작업**: T-026~T-029 중 우선순위를 정해 실제 구현. CI/CD 활성화는 ADR-10과 충돌하므로 새 ADR을 먼저 작성.

---

## 2026-05-26 (UX/UI 디테일 보강 및 다중 가격 지원 — PR #21, #22)

**작업**: 겹치는 마커/팝업의 클릭 UX 개선, 주유소 등 다중 가격을 표시하기 위한 `PriceMarker` 배열 지원, 그리고 시멘틱 줌으로 인해 축소된 마커를 수동으로 확장할 수 있는 강제 확장(Manual Expand) 기능 추가. 더불어 개발용 앱(`dev/main.tsx`)에 컨텍스트 메뉴(우클릭) 커스텀 예제 추가.

**구현 상세**:
- **T-021 (PR #21)**: `<Popup>`과 `<Marker>`에 전역 카운터를 사용하는 자동 `z-index` 증가 로직(`onClick` 인터셉트)을 추가해 클릭한 요소가 무조건 최상단에 올라오도록 개선.
- **T-022 (PR #22)**: 
  - `PriceMarker`가 `price` prop으로 `PriceItem[]` 배열을 받아 여러 개의 가격을 수직 레이아웃으로 표시할 수 있도록 지원.
  - `PriceMarker`에 3단계 Semantic Zoom (Stage 1: 전체, Stage 2: 2개 제한, Stage 3: 단순 점 마커) LOD 적용 및 `lodThresholds` prop 노출.
  - 시멘틱 줌 대상 마커(`PlaceMarker`, `WeatherMarker`, `PriceMarker`)들에 `isManuallyExpanded` 상태를 도입하여, 간소화된 핀을 1번 클릭 시 즉시 원래 뷰가 확장 표시되도록 적용. 닫기(`✕`) 버튼 또는 토글 기능 제공.
  - 사용자가 지도를 확대하여 줌 임계치를 넘어가면 자연스럽게 강제 확장 상태를 초기화하는 UX 디테일 추가.
- `dev/main.tsx`에 `<VWorldMap>` 및 `<Marker>`의 `onContextMenu`를 활용한 커스텀 우클릭 메뉴 UI 예제 추가.

**검증**:
- `npm run type-check` 및 `npm test` 모두 통과 (53 Tests Passed).
- `npm run build` 산출물(`dist/`) 커밋 및 푸시 완료.

**다음 작업**: 해당 변경 사항을 메인 브랜치로 머지.

---

## 2026-05-26 (RouteLine GeoJSON 복구 및 라이브러리 고도화)

**작업**: 사용자 요청에 따라 라이브러리의 4가지 핵심 개선점(T-019 제외)을 반영하여 확장성과 안정성을 보강.

**구현 상세**:
- `RouteLine`의 GeoJSON 지원(`data` Prop)이 이전 리팩토링 중 유실된 것을 파악하고 다시 복구. 이제 단일 `LineString`뿐만 아니라 `MultiLineString`도 주입 가능.
- `src/schemas.ts`에 `PolygonAreaInputSchema` 및 `RouteLineGeoJSONSchema` 추가.
- `RouteLine`, `PolygonArea` 내부에서 개발 환경(`NODE_ENV !== 'production'`)인 경우 입력된 데이터를 Zod로 얕게 검사하여 잘못된 구조일 때 `console.warn`을 띄우도록 개선.
- T-018: React Key Churn을 방지하기 위해 `ClusterLayer`에 `generateId` 속성을 추가하고 `useSupercluster`에 연동.
- T-020: `test/MarkerTeardown.test.tsx` 신설. `<Marker>` 컴포넌트가 언마운트될 때 React Portal과 MapLibre DOM 찌꺼기가 남지 않고 정상 제거(remove)되는지 검증.
- `test/RouteLine.test.tsx`, `test/PolygonArea.test.tsx` 단위 테스트 작성. (이 과정에서 기존 `MapContext.Provider` 모의 렌더링이 더 이상 유효하지 않음을 발견하고 `<VWorldMap>`을 감싸는 형태로 모든 테스트를 수정).

**검증**:
- `npm run test` → 통과 (9 files / 52 tests).
- 수동 로컬 데브 서버 기동 및 렌더링 이상 없음 확인.

**다음 작업**: 해당 브랜치(`feat/enhance-routes-and-stability`) PR 생성 및 사용자 머지 대기.

---

## 2026-05-26 (T-017 — 모든 문서 한글화)

**작업**: 사용자 지시 "모든 문서는 한글로 작성할 것을 문서화하고, 현재 영어로 작성된 문서도 한글화 할 것"에 따라 `AGENTS.md` 언어 정책에서 영문 예외 조항을 제거하고 `README.md`, `AI_AGENT_GUIDE.md`, `CHANGELOG.md`를 한글로 재작성.

**구현 상세**:
- `AGENTS.md` 문서 언어 정책 재작성. 기존: "README와 AI_AGENT_GUIDE는 예외". 신규: "모든 Markdown 문서는 한글로 작성한다. 예외 없음." 보존 대상은 6개 카테고리로 명시 — 코드 식별자, 명령어/경로, 외부 공식 용어, 벤더/제품명, 표준 keyword, shell 출력.
- `README.md` 한글화. 뱃지/Quick start 코드/API table 헤더는 그대로 두되 설명 문장과 trouble-shooting 섹션을 한글로. "More reading" → "참고 문서" 섹션 추가.
- `AI_AGENT_GUIDE.md` 한글화. 진입점 표기: 본 문서 = 소비자 앱을 짜는 AI/개발자용, SKILL.md = 본 저장소 컨트리뷰터용. 역할 분리를 첫 단락에서 명시.
- `CHANGELOG.md` 한글화. Keep-a-Changelog 표준 헤더(`### Added`/`Changed`/`Removed`/`Fixed`/`Security`)는 영문 보존, 본문 항목은 한글. T-017 Unreleased 항목 추가.
- 한글화 정책에 따라 보존 대상은 의도적으로 영문: `useMapSelector`, `'use client'`, `npm run build`, `https://api.vworld.kr/...`, MapLibre, VWorld, zod, Keep-a-Changelog.

**검증** (로컬 게이트, ADR-10):
- `npm run type-check` → 통과.
- `npm test` → 통과 (7 files / 48 tests).
- `npm run build` → 통과.
- `git diff --exit-code -- dist/` → 깨끗 (코드 변경 없음, 문서 전용).

**다음 작업**: 후속 백로그 T-018(supercluster generateId)/T-019(VWorld getCapabilities)/T-020(marker portal teardown 테스트). 영문 README/AI_AGENT_GUIDE를 찾는 영어권 사용자가 다시 등장하면 별도 `*.en.md` 변형을 만드는 옵션 검토.

---

## 2026-05-26 (T-016 — GitHub Actions / CI 제거)

**작업**: 사용자 지시 "깃헙 ci/cd 쓰지마"에 따라 `.github/workflows/ci.yml`을 제거하고 모든 문서에서 CI 언급을 로컬 게이트 표현으로 정리. ADR-10(GitHub Actions 비사용)을 추가.

**배경**: PR #15 머지 시점에 `digitie` 계정이 일시적/영구적 suspend 상태로 들어가 Actions checkout이 403으로 막혔다. 외부 인프라 의존을 끊고 작업자 로컬 게이트만으로 품질을 관리하는 운영 결정.

**구현 상세**:
- 삭제: `.github/workflows/ci.yml` (해당 디렉토리 전체가 비게 됨).
- 추가: ADR-10 "GitHub Actions / CI/CD 비사용" — 컨텍스트(계정 suspend, 무료 한도, third-party action 검토 부담), 결정(외부 CI 미사용 + 로컬 게이트), 근거, 결과+/-, 후속(pre-commit/husky 검토).
- 갱신: `CLAUDE.md`, `AGENTS.md`, `SKILL.md`, `docs/architecture.md`, `docs/decisions.md`, `docs/dev-environment.md`, `docs/resume.md`, `docs/tasks.md`, `AI_AGENT_GUIDE.md`, `CHANGELOG.md` — "CI runs ...", "CI에서 자동", "CI와 동일" 등의 표현을 "PR 머지 전 로컬에서 직접 실행" / "작업자가 직접 확인"으로 정정.
- 갱신: AGENTS.md DO NOT §3 — "CI가 실패한다"를 "GitHub dependency 소비자가 stale 산출물을 가져간다"로 정정. 핵심 게이트(`git diff --exit-code -- dist/`)는 작업자가 직접 돌린다고 명시.
- 갱신: tasks.md — 미래 백로그 T-016/17/18을 T-017/18/19로 시프트하여 본 작업이 T-016이 되도록 정리.
- 보존: 본 journal 엔트리(T-015) — 기존 작업 기록은 수정하지 않는다.

**검증**:
- `npm run type-check` → 통과.
- `npm test` → 통과 (7 files / 48 tests).
- `npm run build` → 통과.
- `git diff --exit-code -- dist/` → 깨끗 (코드 변경 없음).
- `ls .github/` → "No such file or directory" (의도된 결과).

**다음 작업**: 작업자가 PR을 push할 때마다 `npm run type-check && npm test && npm run build && git diff --exit-code -- dist/`를 직접 돌리는 규율을 유지. 누락 시 follow-up PR로 정정.

---

## 2026-05-26 (T-015 — python-kraddr-geo 문서 구조 채택)

**작업**: 기존 `AGENTS.md` + `ADR.md` + `AI_AGENT_GUIDE.md` + `journal.md` + `README.md` 5개 루트 파일 구조를 python-kraddr-geo 식으로 재배치. `CLAUDE.md` 신설, `AGENTS.md` 재작성(언어 정책/식별자 매트릭스/DO NOT 포맷), `SKILL.md` 신설(한글 에이전트 매뉴얼), `docs/` 디렉토리에 architecture/decisions/journal/tasks/resume/dev-environment 분리. `CHANGELOG.md` 신설.

**구현 상세**:
- 신규: `CLAUDE.md` — 현재 작업(T-015), 잔존 부채(D1~D3), 브랜치 정리, 후속 백로그, 로컬 개발 환경, 빠른 검증 명령, 주요 결정 사항.
- 재작성: `AGENTS.md` — 문서 언어 정책, 식별자 매트릭스, 개발 환경 정책, 지시 우선순위, DO NOT 14항목, 외부 의존성 사용 원칙, 작업 후 체크리스트.
- 신규: `SKILL.md` — 정체성, 빠른 시작, 디렉토리 지도, DO NOT 14항목, 자주 묻는 작업, 도메인 어휘, 작업 후 체크리스트.
- 신규: `docs/architecture.md` — 한 패키지 두 표면(컴포넌트 + hook), 계층 의존, MapStore + useSyncExternalStore, useEvent, VWorldMap 라이프사이클, Marker/Popup 라이프사이클, semantic zoom 흐름, RouteLine/PolygonArea style.load 재등록, 에러 분류, 빌드/배포, 테스트, 호환성.
- 재작성: `docs/decisions.md` — 기존 `ADR.md`의 8개 결정을 표준 포맷(컨텍스트/결정/근거/결과+/결과-/후속)으로 다시 정리하고 ADR-9(본 문서 구조 채택)를 추가.
- 이전: `journal.md` → `docs/journal.md` (역시간순 유지, 본 항목 추가).
- 신규: `docs/tasks.md` — T-001~T-014를 historical PR에서 retroactive 매핑, T-015~T-018을 후속 백로그로 등록.
- 신규: `docs/resume.md` — 현재 진척도, 다음 한 작업, 작업 시작 전 확인할 것, 알려진 함정.
- 신규: `docs/dev-environment.md` — Node 버전, Puppeteer 환경변수, dist 커밋 정책, .env.local 권한, dev 서버 사용법.
- 신규: `CHANGELOG.md` — Keep-a-Changelog 포맷. 1.0.0 (PR #14 기준)으로 backfill.
- 보존: `AI_AGENT_GUIDE.md` — 영문 사용자 대상 진입점으로 유지(소비자 앱 개발자가 영어로 검색해 들어오는 경로). `SKILL.md`는 한글 에이전트 매뉴얼로 별도.
- 보존: `README.md` — 영문 사용자 대상 표지. 마이그레이션과 무관.

**검증**:
- `npm run type-check` → 통과.
- `npm test` → 통과 (8 files / 50 tests).
- `npm run build` → 통과. `dist/` 변경 없음(코드 변경 없으므로).
- `git diff --exit-code -- dist/` → 깨끗.

**다음 작업**: PR 올리고 머지. 새 에이전트가 `CLAUDE.md` 한 곳을 진입점으로 사용하는지 1~2 세션 동안 관찰.

---

## 2026-05-26: PR #13 후속 코드 리뷰 — 정합성/edge case 보강 (PR #14)

### 1. 핸들러 관리 정리
- **이슈**: PR #13에서 `<VWorldMap>` onError에 `hasOnErrorRef` + `stableOnError` 2개 ref가 동시에 동기화됐는데 둘이 같은 사실(`onError !== undefined`)을 추적. race + 중복.
- **조치**: `onErrorRef` 하나로 통합. `useLayoutEffect`로 최신 핸들러를 가리키게 하고, 디스패치 시점에 `ref.current ? handler : console.warn` 분기.
- **결과**: ref가 하나로 줄고 race 가능성 제거. dispatch 의도가 명확.

### 2. 카메라 prop drop 문제 해결
- **이슈**: 사용자가 패닝 중일 때 부모가 `center`/`zoom`을 바꾸면 `map.isMoving()` 가드 때문에 update가 사일런트 drop. lastCameraRef도 갱신 안 되어 다음 prop 변경까지 영구 무시.
- **조치**: `pendingCameraRef`를 도입해 가용한 가장 최신 카메라를 큐잉. 즉시 적용이 불가하면 `moveend` 핸들러가 idle 상태에서 재시도.
- **결과**: 어떤 prop 변경도 사일런트로 사라지지 않음. 사용자 제스처 우선권은 유지.

### 3. styledata 재진입 → style.load
- **이슈**: `<RouteLine>`/`<PolygonArea>`가 `styledata` 리스너를 등록했는데, 이 이벤트는 `setPaintProperty`마다 발화 → 우리 자신의 paint update가 `addOrUpdate`를 재호출 → O(N²) 가능성.
- **조치**: 두 컴포넌트 모두 `style.load`로 교체. 이 이벤트는 `setStyle()` 완료 시 한 번만 발화 → 우리 layer 보존 의도와 정확히 일치.

### 4. Marker className diff 알고리즘 개선
- **이슈**: `applyMarkerState`가 prev 토큰을 모두 remove 후 next 토큰을 모두 add. 공통 토큰이 잠시 사라졌다 다시 추가되어 CSS transition 한 프레임 깜빡임.
- **조치**: 토큰 셋 diff로 변경 (`prev - next` remove, `next - prev` add). 공통 토큰은 건드리지 않음.

### 5. Marker anchor / offset prop 추가
- **이슈**: `<PinMarker>`와 `<PlaceMarker>`가 `transform: translate(-50%, -100%)` + `marginTop`으로 수동 anchor 처리. MapLibre의 anchor와 이중 변환으로 좌표 오프셋이 어긋남.
- **조치**: `<Marker>`에 `anchor` (construction-time) 와 `offset` (setter 지원) prop 추가. `<PinMarker>`는 `anchor="bottom"`으로, `<PlaceMarker>`는 `anchor="bottom" offset={[0,-8]}`로 단순화.

### 6. Popup 옵션 분류 정리
- **이슈**: `<Popup>`의 effect deps에 `offset` 같은 객체가 있어서 consumer가 인라인 객체로 전달하면 매 render마다 popup이 remount → unmount 시 onClose가 발화하는 무한 루프 가능.
- **조치**: construction-only 옵션(closeButton, closeOnClick, className)은 첫 render에 ref로 스냅샷. mutable 옵션(`offset`, `maxWidth`, `lngLat`)은 dedicated setter effect로 적용.

### 7. ClusterMarker 클로저 안정화
- **이슈**: `<ClusterMarker>`가 `onClick ? () => onClick() : undefined`로 매 render마다 새 함수 → 자식 `<Marker>`가 보는 onClick identity 매번 변경.
- **조치**: `useEvent`로 onClick 디스패치 안정화 + `useMemo`로 wrapper도 stable identity. onMouseEnter/Leave도 `useCallback`.

### 8. ClusterLayer 초기 viewport 가드
- **이슈**: `<ClusterLayer>`의 mount effect가 `map.getBounds()`를 즉시 호출하는데, `load` 이전엔 degenerate bounds(0/0/0/0). 첫 클러스터 계산이 빈 결과로 종료.
- **조치**: `map.loaded()` 체크 후 `update()` 즉시 호출 vs `map.once('load', update)`로 가드.

### 9. useMapSelector 안정성 개선
- **이슈**: cache key가 selector identity까지 포함해서, consumer가 useCallback을 잊으면 매 render마다 cache miss → 값이 같아도 새 reference 반환 가능 → 무한 render.
- **조치**: selector는 ref로 wrap. cache key는 snapshot identity만 사용. `Object.is`로 값 동등성 비교 → unstable selector도 안전하게 동작.

### 10. 기타 정리
- `<PriceMarker>`의 `'₩'` currency 기본값 제거 → 빈 문자열. 라이브러리는 통화 단위를 가정하지 않음.
- `<PinMarker>`, `<PriceMarker>`, `<RoutePointMarker>`에 `'use client'` 누락 → 추가. AI_AGENT_GUIDE의 "every DOM-touching module" 약속과 일치.
- 디버그 잔재 파일 제거: `analyze_tiles.js`, `generate_html.js`, `test_tiles.js`, `tiles.html`, `screenshot_before_fly.png`, `z17.png`, `z18.png`, `z19.png`.

### 11. 검증
- type-check: 통과.
- test: 7 files / 48 tests 통과.
- 회귀 테스트 추가: camera pending re-apply (moveend 시), Popup offset/maxWidth setter (no remount), Marker anchor 전달, Marker className 토큰셋 diff, useMapSelector unstable selector tolerance, hooks outside provider throw.

---

## 2026-05-25: main 브랜치 코드 리뷰 후 런타임 결함 수정 (PR #13)

### 1. stale event handler와 camera 동기화 문제 해결
- **이슈**: `useEvent`로 최신 callback을 보장하도록 리팩토링했지만, 일부 이벤트는 mount 시점의 prop 존재 여부를 closure로 잡고 있었다. 그 결과 `<VWorldMap onError>`나 `<Marker onClick>`을 렌더 후 추가하면 MapLibre/DOM listener가 최신 handler를 호출하지 못했다.
- **조치**:
  1. `<VWorldMap>`의 error handler와 `<Marker>`의 click/contextmenu handler가 최신 prop 존재 여부를 ref로 판단하도록 변경했다.
  2. 초기 load 직후 `center/zoom`을 불필요하게 다시 `flyTo`하지 않도록 마지막 camera snapshot을 추적한다.
  3. `pitch`/`bearing` prop 변경도 camera update에 포함하고, `flyToOptions`는 camera 좌표 계열 값을 override하지 못하도록 타입과 문서를 정리했다.
  4. `maxBounds` prop 제거 시 `map.setMaxBounds(undefined)`가 호출되어 이전 제한이 남지 않도록 했다.

### 2. selector/marker/layer 렌더링 정합성 보강
- **이슈**: `useMapSelector` 문서는 referential caching을 약속하지만 실제 구현은 selector 결과를 매번 새로 반환했다. 객체 selector는 `useSyncExternalStore` 경고나 불필요한 렌더를 만들 수 있었다. 또한 marker selected/highlighted scale은 CSS 변수만 설정하고 실제 scale 속성을 적용하지 않아 시각 효과가 빠져 있었다.
- **조치**:
  1. `useMapSelector`가 동일 store snapshot에서는 이전 selector 결과를 재사용하고, 새 snapshot에서도 `Object.is`로 같은 값이면 기존 참조를 유지하도록 cache를 추가했다.
  2. marker state 적용 시 `--vworld-marker-scale`과 함께 실제 `scale` style도 갱신해 selected/highlighted 기본 효과를 복구했다.
  3. `<ClusterMarker>` click은 child div가 아니라 `<Marker onClick>` 경로로 처리해 cluster click이 지도 click으로 bubble되는 위험을 줄였다.
  4. `<RouteLine>`의 `dashArray` 제거 시 기존 MapLibre paint property도 `undefined`로 갱신하도록 보정했다.

### 3. 검증
- stale handler, 초기 camera replay 방지, `pitch/bearing` camera 변경, `maxBounds` 해제, selector cache, route dash reset 회귀 테스트를 추가했다.

---

## 2026-05-25: 범용 라이브러리로 정리 + API/성능 리팩토링 (PR #12)

### 1. 도메인-특화 코드 제거 (TripMate)
- **이슈**: PR #10/#11에서 `src/tripmate.ts`, `src/components/TripmateFeatureLayer.tsx`, `docs/tripmate-implementation-roadmap.md`가 추가되며 라이브러리에 TripMate 도메인 지식(`TRIPMATE_MARKER_PALETTE` P-01~P-16, 한국어 관광 카테고리 enum, 7종 feature kind enum, `₩` currency hardcode)이 박혔다. 범용 지도 라이브러리의 책임 경계를 벗어남.
- **조치**: 위 파일들 + 대응 테스트(`test/tripmate.test.ts`, `test/TripmateFeatureLayer.test.tsx`) 삭제, README/AI_AGENT_GUIDE에서 TripMate 섹션 제거. 범용 패턴인 `ServerClusterLayer`, `MapPopup`(→`Popup`), `MakiMarker`, `Marker.selected/highlighted/zIndex/ariaLabel/className`은 유지.
- **결과**: 다운로드 사이즈 약 5KB 감소, 외부 도메인 지식 0.

### 2. API 네이밍: React 생태계 컨벤션 정합
- `onMapClick` → `onClick`, `onMapLoad` → `onLoad`, `onMapError` → `onError`, `onMapContextMenu` → `onContextMenu` (`react-map-gl`/`react-leaflet` 따름).
- `showNavigationControl`/`showGeolocateControl`/`showScaleControl` → `navigation`/`geolocate`/`scale`.
- `MarkerClusterer` → `ClusterLayer`, `MapPopup` → `Popup` — singular convention.
- `RouteLine`: `lineWidth`/`lineDasharray` → `width`/`dashArray`. `data` prop 제거하고 `coordinates`만 받음 (raw GeoJSON이 필요하면 `useMap()`으로 직접 처리).
- `MakiMarker`: `icon`/`iconName`/`fallbackIcon` 3종 alias → `icon: string` 하나로.
- `VWorldMapErrorInfo`/`VWorldMapContextMenuInfo`/`VWorldViewportInfo` wrapper 제거 — raw MapLibre event 그대로 노출. 카운트/임계치는 앱에서 구현 (라이브러리 책임 외).
- `onViewportChange(eventType=…)` → `onMoveEnd`/`onZoomEnd`/`onIdle` 분리.
- `redactVWorldTileUrl` 제거 (`redactVWorldUrl`에 흡수, overload로 `undefined` 통과).

### 3. 기본값/필수값 정리
- `center` 필수화 — 한국 좌표(서울) 기본값 제거. 라이브러리가 위치를 결정하지 않음.
- `KOREA_LNG_RANGE`/`KoreaLngLatSchema`/`KoreaBoundsSchema` 제거. `makeBoundedLngLatSchema(lngRange, latRange)` factory로 대체.
- `BasePointDataSchema` → `PointSchema`, `createPointDataSchema` → `extendPointSchema`.

### 4. 아키텍처: external store + selector 패턴
- 신설: `src/store/{mapStore,hooks}.ts`. `MapStore`는 vanilla JS class, `useSyncExternalStore`로 React 구독. `useMap`/`useMapZoom`/`useMapLoaded`/`useMapSelector`/`useEvent` export.
- 기존 dual createContext(`MapInstanceContext`/`MapZoomContext`)와 `mapRef + mapLoaded` proxy 패턴 제거 → store가 단일 source of truth.
- `useMap()`이 `Map | null` 직접 반환 (`{ map }` 객체 wrapping 제거). `useMapContext()` 삭제.
- `useEvent`(canonical pattern: `useLayoutEffect + useRef + useCallback`)로 핸들러 ID 안정화 → prop callback 변경 시 MapLibre 재구성 없음.
- `useMapSelector`로 thresh-crossing만 re-render → SimpleMarker/PlaceMarker/WeatherMarker는 zoom 매번 re-render 안 함.

### 5. React/MapLibre 베스트 프랙티스 수정
- 모든 DOM-touching 모듈에 `'use client'` 추가 (RSC 환경에서 직접 import 가능).
- 카메라 업데이트 effect에 `map.isMoving() || map.isEasing()` 가드 → 사용자 제스처 중 prop change 시 진동 방지.
- `mapRef.current`를 `useMemo` factory에서 읽던 antipattern 제거 — store가 instance 변경을 제대로 emit.
- `PulsingMarker`/`WeatherMarker`의 `<style>` 인스턴스별 주입 → 모듈-레벨 single-injection.
- `Marker` element scale: CSS3 `scale` 단독 속성 → `--vworld-marker-scale` CSS var로 변경 (Safari 호환).
- `applyMarkerState`의 className 누락 제거: 직전 className 토큰만 빼고 새 토큰 add (idempotent).
- `RouteLine`/`PolygonArea`: `JSON.stringify(coordinates)` deps 제거 → 참조 안정성 명시 (consumer가 memoize). 큰 GeoJSON 시 main thread stall 위험 제거.
- `isVWorldTileError`의 `error.message` null 안전성 강화.
- `(e: any)` 타입 캐스트 제거, `MapMouseEvent & { features?: MapGeoJSONFeature[] }`로 정확히 타이핑.
- `ClusterLayer`의 `supercluster: any` → `Supercluster` 타입.
- `ResizeObserver` 존재 가드 (구형 브라우저).

### 6. 결과
- `src/store/` 신설 (3개 파일).
- 17개 컴포넌트 + 2개 helper 모듈 갱신.
- 테스트: 34/34 통과. type-check 통과. build 통과 (mjs 51KB / umd 39KB, gzip 16KB / 14KB).
- README, AI_AGENT_GUIDE 전면 재작성 — 새 API만 문서화.

---

## (이전 기록은 history로 보존)

## 2026-05-25: TripMate 지도 primitive P0/P1 구현 (PR #11)

### 1. PR #10 백로그 기반 public API 추가
- **이슈**: 문서화된 TripMate Sprint 4 요구사항 중 viewport 변화, 우클릭 메뉴, marker palette, Maki vendor path, 서버 클러스터, feature kind 렌더링, popup은 소비자 앱마다 직접 MapLibre listener와 DOM portal을 붙이면 중복과 성능 저하 위험이 크다.
- **조치**:
  1. `<VWorldMap>`에 `onViewportChange`, `onMapContextMenu`를 추가해 `center/zoom/bounds`와 우클릭 좌표를 정규화한다.
  2. `<Marker>`에 `onClick`, `onContextMenu`, `selected`, `highlighted`, `zIndex`, `ariaLabel`, `className`을 추가하고 event handler ref로 map/marker 재생성을 피한다.
  3. `TRIPMATE_MARKER_PALETTE`, `TRIPMATE_CATEGORY_MARKERS`, `resolveTripmateMarkerStyle`, Korea 좌표/bounds schema와 bounds serialize/parse helper를 추가했다.
  4. `<MakiMarker>`가 `icon`, `iconBaseUrl`, `fallbackIcon`을 받아 TripMate의 `/maki` vendored SVG 정책을 지원한다.
  5. `<ServerClusterLayer>`, `<TripmateFeatureLayer>`, `<MapPopup>`을 추가했다.
  6. `<MarkerClusterer>`의 raw point → GeoJSON 변환을 `useMemo`로 고정하고, bounds/zoom state update를 동일 값에서 건너뛰도록 줄였다.
- **결과**: TripMate는 MapLibre listener를 직접 붙이지 않고도 viewport query trigger, right-click menu, 서버 cluster, 7종 feature marker/route/area, popup을 라이브러리 primitive로 구성할 수 있다. API 호출, Zustand/TanStack Query, 위치 동의/감사 로그는 여전히 앱 책임으로 남는다.

### 2. 검증
- `PATH=/tmp/node-v20.19.5-linux-x64/bin:$PATH PUPPETEER_SKIP_DOWNLOAD=1 npm ci` → Node 20 환경에서 Puppeteer Node 22 권장 engine 경고만 출력, 설치 성공.
- `PATH=/tmp/node-v20.19.5-linux-x64/bin:$PATH npm run type-check` → 통과.
- `PATH=/tmp/node-v20.19.5-linux-x64/bin:$PATH npm test` → 7 files / 44 tests 통과.

## 2026-05-25: TripMate 연동 추가 구현 백로그 문서화 (PR #10)

### 1. TripMate 최신 main 문서 기준의 지도 요구사항 정리
- **이슈**: `tripmate`는 사용자 대면 UI를 `maplibre-vworld` 기반 지도로 가져가는 방향을 명시하지만, 세부 Sprint 문서에는 과거 Kakao SDK 기준 문구와 지도 UI 요구사항이 섞여 있다. 이 상태에서 바로 구현에 들어가면 앱 책임(TanStack Query, Zustand, 위치 동의/감사 로그)과 라이브러리 책임(MapLibre 이벤트, marker primitive, VWorld 오류 처리)이 뒤섞일 위험이 있었다.
- **조치**:
  1. `tripmate` `origin/main` `767bace`와 `maplibre-vworld-js` `origin/main` `b19baa3`를 기준점으로 고정했다.
  2. `docs/tripmate-implementation-roadmap.md`를 추가해 viewport 이벤트, context menu, 16색 마커 팔레트, Maki icon vendor path, Korea 좌표/bounds helper, 서버 클러스터, feature kind 렌더링, 선택/호버 상태, popup primitive를 우선순위별로 정리했다.
  3. README와 `AI_AGENT_GUIDE.md`에 새 백로그 문서 링크와 책임 경계 주의사항을 추가했다.
- **결과**: 후속 PR은 TripMate Sprint 4 요구사항을 라이브러리 public API로 승격할지, TripMate 앱 내부에 남길지를 먼저 확인한 뒤 작게 나눠 구현할 수 있다.

### 2. 검증
- `git diff --check` → 통과.

## 2026-05-25: 디버그 UI 동작 정합화를 위한 Map event hook 보강 (PR #9)

### 1. `python-kraddr-geo` 디버그 지도와 공통화할 이벤트 표면 추가
- **이슈**: `kraddr-geo-ui`는 지도 click 좌표를 `(lon, lat)` 입력값으로 반영하고, VWorld tile 오류를 API key redaction 후 transient warning/overlay로 처리한다. 기존 `<VWorldMap>`은 지도 표시와 marker/cluster 중심이라 이 디버그 UI 동작을 공통 package API로 옮기기 어려웠다.
- **조치**:
  1. `<VWorldMap>`에 `onMapClick`, `onMapError`, `flyToOptions` props를 추가했다.
  2. `isVWorldTileError(event)`와 `redactVWorldTileUrl(url)` helper를 `src/vworld.ts`에서 export했다.
  3. `Hybrid` 이중 source와 `vworld-${layerType}` source id를 고려해 VWorld tile 오류를 `vworld` prefix, WMTS URL, transient HTTP status, fetch/tile message 기준으로 판별한다.
  4. README, `AI_AGENT_GUIDE.md`, `ADR.md`에 운영·디버그 UI에서 이 hook을 사용하는 기준을 추가했다.
- **결과**: 소비자 프로젝트는 overlay/fallback 정책은 자체적으로 유지하되, click/error/flyTo와 VWorld tile redaction 계약은 이 라이브러리와 같은 helper로 검증할 수 있다.

### 2. 검증
- `PATH=/tmp/node-v20.19.5-linux-x64/bin:$PATH npm run test` → 3 files / 21 tests 통과.
- `PATH=/tmp/node-v20.19.5-linux-x64/bin:$PATH npm run type-check` → 통과.
- `PATH=/tmp/node-v20.19.5-linux-x64/bin:$PATH npm run build` → 통과.
- `PATH=/tmp/node-v20.19.5-linux-x64/bin:$PATH npm run pack:check` → 통과. tarball에 `dist/`와 declaration files 포함 확인.
- `git diff --check` → 통과.

## 2026-05-25: GitHub dependency 소비 가능 패키징 보강 (PR #8)

### 1. `dist/` 산출물 누락 문제 해결
- **이슈**: `package.json`의 `main`/`module`/`types`/`exports`가 모두 `dist/`를 가리키지만, 저장소에는 `dist/`가 커밋되어 있지 않아 GitHub dependency로 설치한 소비자 프로젝트에서 package root import가 실패할 수 있었다.
- **조치**:
  1. `.gitignore`에서 `dist` 제외를 제거하고 `vite build` 산출물을 커밋 대상으로 전환했다.
  2. `package.json`에 `./style.css` export와 CSS side effect 설정을 추가했다.
  3. `prepack`과 `pack:check` 스크립트를 추가해 npm publish 또는 pack 검증 시 산출물을 다시 생성하도록 했다.
- **결과**: `npm pack --dry-run` 기준 tarball에 `dist/maplibre-vworld-js.mjs`, `dist/maplibre-vworld-js.umd.js`, `dist/maplibre-vworld-js.css`, declaration files가 모두 포함된다.

### 2. 테스트 스크립트 API key 평문 제거
- **이슈**: `test_tiles.js`에 VWorld API key가 평문으로 남아 있었다. 브라우저 노출용 키라도 저장소에 남기면 재사용·복사·로그 전파 위험이 있다.
- **조치**: `process.env.VITE_VWORLD_API_KEY`를 읽도록 바꾸고, 환경변수가 없으면 명확한 오류를 던진다.
- **결과**: `rg`로 저장소 안의 UUID 형식 VWorld key가 더 이상 검색되지 않는다.

### 3. 타입 생성 범위와 peer dependency 정리
- **이슈**: `vite-plugin-dts`가 `dev/`와 `test/`까지 선언 파일 생성 대상으로 잡아 빌드 중 타입 오류를 출력했고, `maplibre-gl`/`zod`/React 계열이 소비자 dependency graph에 불필요하게 중복될 수 있었다.
- **조치**:
  1. `tsconfig.build.json`을 추가해 declaration generation을 `src/`로 한정했다.
  2. `type-check` 스크립트를 추가하고 기존 test/dev 타입 오류를 정리했다.
  3. `react`, `react-dom`, `maplibre-gl`, `zod`를 peer dependency로 이동하고, 빌드·테스트용 dev dependency로만 유지했다.
- **결과**: `PUPPETEER_SKIP_DOWNLOAD=1 npm ci`, `npm run type-check`, `npm test`, `npm run build`, `npm run pack:check`, `npm audit --audit-level=high`가 통과한다. Node 20 환경에서는 Puppeteer 25의 Node 22 권장 engine 경고가 출력되지만 설치 자체는 성공한다.

### 4. VWorld layer 계약 보정
- **이슈**: `Satellite`/`Hybrid`가 z19까지 요청될 수 있어 타일 404가 발생할 수 있고, attribution 표기가 소비자 프로젝트와 일치하지 않았다.
- **조치**: `getVWorldMaxZoom(layerType)`를 추가하고 `Satellite`/`Hybrid`는 z18, 나머지는 z19로 제한했다. attribution은 `공간정보 오픈플랫폼 브이월드`로 통일했다.
- **결과**: `kraddr-geo-ui` 같은 소비자 프로젝트가 같은 layer/zoom/attribution 계약을 공유할 수 있다.

---

## 2026-05-24: 보안 패치 및 아키텍처 문서화 완료

### 1. VWorld API Key 보안 위협 제거 및 Git History 소각
- **이슈**: `dev/main.tsx` 내부에 VWorld API Key가 하드코딩된 채로 GitHub 저장소에 커밋됨. 
- **조치**: 
  1. 루트 디렉토리에 `.env` 파일을 생성하고 `VITE_VWORLD_API_KEY` 환경 변수로 키를 분리.
  2. `.gitignore`에 `.env` 및 `.env.local`이 포함된 것을 확인.
  3. **가장 중요**: 단순히 새로운 커밋을 추가하는 것이 아니라, `git reset --soft` 명령을 사용하여 저장소의 초기 상태로 히스토리를 롤백한 후, 키가 제거된 클린(Clean) 상태로 다시 커밋을 생성함.
  4. `git push -f origin main`을 통해 원격 저장소의 오염된 과거 히스토리를 영구적으로 덮어씌움(Rewrite History).
- **결과**: GitHub 상에서 과거 커밋을 뒤져보더라도 API Key가 절대 노출되지 않도록 완벽히 방어함.

### 2. CORS 및 도메인 보안 에러 해결 구조 도입
- **이슈**: 로컬 개발(localhost)이나 사내망 환경에서 브이월드 서버(`api.vworld.kr`)로 타일 요청 시, 도메인 불일치로 인한 CORS 에러 및 403 Forbidden 에러 발생 우려.
- **조치**:
  1. `<VWorldMap>`의 Props에 MapLibre의 `transformRequest` 훅을 뚫어줌.
  2. 이를 통해 요청 URL을 가로채어(Intercept) 로컬 Proxy 서버로 돌리거나, 커스텀 인증 헤더(Authorization)를 심을 수 있도록 프레임워크 레벨에서 지원함.
  3. `README.md`에 문제 해결 가이드(Troubleshooting) 섹션 신설.

### 3. 포괄적인 문서(Docs) 한글화 및 고도화 작업
- **이슈**: README 등 핵심 문서가 부족하거나 영문으로 작성되어 국내 개발자들이 바로 도입하기에 러닝 커브가 존재함.
- **조치**:
  1. **README.md 전면 개편**: Github 표준 오픈소스 형식에 맞추어 기술 뱃지(Badges), 표 형태의 API 레퍼런스, Next.js App Router용 퀵스타트 코드를 매우 상세하게 한글로 재작성함.
  2. **AI_AGENT_GUIDE.md 고도화**: 향후 Cursor나 Copilot 같은 AI가 이 라이브러리를 사용해 코딩할 때 절대 에러를 내지 않도록 모든 Prop 시그니처와 SSR 주의사항, CORS 해결 지침을 주입함.
  3. **ADR.md 작성**: 프로젝트 뼈대를 구성하는 4대 아키텍처 결정 사항(MapLibre 선택 이유, React Portal 채택 이유, Supercluster 병합 메커니즘 등)을 명문화함.
  4. **AGENTS.md 작성**: 추후 접속할 새로운 AI 에이전트들이 즉시 문맥을 복원(Context Recovery)할 수 있도록 진입점 매뉴얼을 구축함.

---

## 2026-05-23: 코어 라이브러리 개발 완료

### 1. 극한의 렌더링 최적화 
- React-DOM 포털을 통한 마커 생성 및 Viewport 밖 요소 Unmount(Culling) 기술 적용 완료. 10만 건 렌더링 테스트 통과.

### 2. 다이나믹 클러스터링(`MarkerClusterer`) 구축
- 줌인/줌아웃 시 마커가 자연스럽게 합쳐지고 갈라지는 기능을 `supercluster` 기반으로 구현.

### 3. Zod 기반 데이터 무결성 
- 외부에서 들어오는 위경도(`[number, number]`) 및 폴리곤 데이터의 오염을 런타임 전에 방지하기 위해 `zod` 검증 스키마(`src/schemas.ts`) 적용 완료.
