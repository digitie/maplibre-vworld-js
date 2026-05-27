# DECISIONS — Architecture Decision Records

본 문서는 `maplibre-vworld-js` 프로젝트의 의사결정을 시간순으로 누적한다. 결정이 뒤집힐 때도 이전 기록은 지우지 않고 `superseded by ADR-XXX`로 표시한다.

## ADR 표준 형식

```
## ADR-NNN: <결정 요약>

- 상태: proposed | accepted | superseded by ADR-XXX
- 날짜: YYYY-MM-DD
- 결정자: <agent | human>

### 컨텍스트
<무엇이 문제였나. 어떤 제약·요구가 있었나.>

### 결정
<무엇을 정했는가. 한 문장으로.>

### 근거
- 

### 결과(긍정)
- 

### 결과(부정)
- 

### 후속
- (open) 추가 검증 필요한 사항
```

---

## ADR-1: 렌더링 엔진으로 MapLibre GL JS 채택

- 상태: accepted
- 날짜: 2026-05-23
- 결정자: human

### 컨텍스트

브이월드(VWorld) 지도를 렌더링할 때 기존 Canvas 2D 기반 엔진(예: OpenLayers 과거 버전, Kakao Maps SDK)은 수천 개의 마커나 복잡한 폴리곤을 그릴 때 심각한 프레임 드랍이 발생했다. WebGL 가속이 필요했다.

### 결정

GPU 하드웨어 가속(WebGL)을 완벽히 지원하고 라이선스 이슈가 없는(BSD-3 / 이후 fork) **MapLibre GL JS v5**를 코어 렌더링 엔진으로 채택한다.

### 근거

- 60fps fractional zoom, 3D pitch/bearing 지원
- 벡터/래스터 source를 같은 style spec으로 다룰 수 있음 — VWorld WMTS와 자연스럽게 결합
- 오픈소스 + 활발한 유지보수 (Mapbox GL JS v1.x의 fork)

### 결과(긍정)

- 네이티브 모바일 앱 수준의 렌더링 성능
- `transformRequest`로 CORS/프록시/인증 hook 가능

### 결과(부정)

- WebGL 미지원 환경(IE 등)은 지원 불가 — 다만 VWorld 자체가 모던 브라우저 대상이라 영향 없음

---

## ADR-2: React 통합 방식으로 `React.createPortal` 채택

- 상태: accepted
- 날짜: 2026-05-23
- 결정자: human

### 컨텍스트

MapLibre 내부에 커스텀 HTML 마커를 삽입할 때, 단순 문자열(HTML String)을 주입하면 React의 상태나 라이프사이클과 동기화되지 않아 업데이트가 불가능하다.

### 결정

`React.createPortal`을 사용해 React가 렌더링하는 Virtual DOM 트리를 MapLibre가 생성한 물리적 마커 DOM 노드(`HTMLDivElement`) 속으로 teleport한다.

### 근거

- React 상태/라이프사이클 보존
- Tailwind CSS, SVG, Framer Motion 같은 모던 React 생태계 그대로 사용 가능
- portal teardown은 라이브러리 책임 — `<Marker>` unmount 시 `ReactDOM.unmountComponentAtNode(element)` 호출

### 결과(긍정)

- 마커 children에 임의의 React 컴포넌트 사용 가능
- `data-selected`/`data-highlighted` 같은 attr 기반 CSS hook 자연스러움

### 결과(부정)

- React fiber와 DOM 노드 수명 동기화 책임이 라이브러리에 옴 — teardown 누락 시 stale handler

---

## ADR-3: 대용량 마커 렌더링을 위한 supercluster + viewport culling

- 상태: accepted
- 날짜: 2026-05-23
- 결정자: human

### 컨텍스트

DOM 노드는 브라우저 메모리를 가장 많이 잡아먹는 요소다. 화면 밖에 있는 10만 개의 마커를 모두 DOM에 유지하면 브라우저가 즉각 다운된다.

### 결정

KDBush 기반 알고리즘인 **supercluster**를 내장해 데이터를 메모리에서 초고속으로 병합한다. 추가로 현재 지도의 영역(bounds)을 계산해 **화면 밖 마커는 즉시 DOM에서 unmount**하는 viewport culling을 구현한다.

### 근거

- KDBush index는 10만 포인트 대상 < 50ms 빌드
- viewport에 들어온 마커만 portal로 mount → 메모리 안정
- 클라이언트 클러스터링과 서버 클러스터링 두 가지 표면 제공(`<ClusterLayer>` / `<ServerClusterLayer>`)

### 결과(긍정)

- 10만 마커 대상 메모리 사용량 안정 (수 MB 단위)
- 줌 변경 시 자연스러운 분리/병합 애니메이션

### 결과(부정)

- supercluster가 일반 dependency라 번들 사이즈에 포함 — 다만 클러스터링 라이브러리의 사실상 표준이라 수용

---

## ADR-4: CORS / 도메인 보안 우회를 위한 `transformRequest`

- 상태: accepted
- 날짜: 2026-05-24
- 결정자: human

### 컨텍스트

브이월드(`api.vworld.kr`)는 등록되지 않은 도메인(localhost, 사내망 등)의 요청에 대해 403 또는 CORS 헤더 드랍으로 접근을 차단한다. 폐쇄망 B2B 환경에서 지도가 안 뜨는 사례 발생.

### 결정

최상위 `<VWorldMap>` props에 MapLibre의 `transformRequest`를 그대로 노출한다. 타일이나 외부 리소스를 fetch하기 직전 URL을 가로채 로컬 프록시 주소로 변환하거나 인증 헤더를 강제 주입할 수 있게 한다.

### 근거

- MapLibre 표준 hook을 그대로 노출 — 학습 곡선 없음
- 라이브러리에 프록시 로직을 박지 않음 — 소비자 환경마다 다르므로

### 결과(긍정)

- 폐쇄망에서도 동작
- 인증 헤더 주입 시나리오 지원

### 결과(부정)

- 소비자가 `transformRequest`의 의미를 알아야 함 — `AI_AGENT_GUIDE.md`/README에 명시

---

## ADR-5: GitHub 의존성 소비자를 위해 `dist/`를 커밋

- 상태: accepted
- 날짜: 2026-05-25
- 결정자: human

### 컨텍스트

`maplibre-vworld`를 npm registry 배포 전 GitHub dependency(`npm install digitie/maplibre-vworld-js`)로 설치하는 소비자 프로젝트가 있다. `package.json`의 `exports`는 `dist/`를 가리키는데 저장소에 `dist/`가 없으면 소비자 `npm install` 또는 Next.js build가 package root import 단계에서 실패한다. `prepare` 스크립트로 GitHub 설치 시 빌드하는 방식은 소비자 설치 중 dev dependency 설치와 Puppeteer postinstall 비용을 유발한다.

### 결정

`dist/`를 `.gitignore`에서 제거하고 `vite build` 산출물(`.mjs`, `.umd.js`, CSS, declaration files)을 저장소에 커밋한다. npm publish 전에는 `prepack`으로 다시 빌드하되, GitHub dependency 소비자는 커밋된 `dist/`만으로 import 가능하게 한다.

### 근거

- 소비자는 별도 build step 없이 import 가능
- declaration generation은 `tsconfig.build.json`으로 `src/`만 대상으로 — `dev/`와 `test/` 타입 오류가 배포 산출물에 섞이지 않도록
- 작업자가 PR 머지 전 로컬에서 `git diff --exit-code -- dist/`로 drift 검사 (GitHub Actions는 사용하지 않음 — ADR-10)

### 결과(긍정)

- GitHub dependency 소비자가 즉시 사용 가능
- Next.js / Vite 빌드가 별도 처리 없이 통과

### 결과(부정)

- `dist/` diff가 PR에 포함되어 review noise — 다만 자동 생성물임을 commit message로 명시
- `npm run build`를 잊으면 stale dist/가 머지될 수 있음 — DO NOT 룰에 명시, 작업자가 로컬 게이트에서 확인

### 주의

`react`, `react-dom`, `maplibre-gl`, `zod`는 peer dependency로 둔다. `zod`는 `^4.4.3` 기준으로 빌드/테스트하며 v3는 지원하지 않는다. peer + rollup external로 둠으로써 소비자 번들에 zod 사본이 중복되지 않게 한다.

---

## ADR-6: zod v4 강제, v3 미지원

- 상태: accepted
- 날짜: 2026-05-25
- 결정자: human

### 컨텍스트

초기 PR #6에서 zod v3로 일시 다운그레이드되었지만, 이는 의도된 기술 결정이 아니라 마이그레이션 잔존물이었다. zod v4(2025-05 stable)는 v3 대비 배열 파싱 ~7배, 문자열 파싱 ~2배 빠르고, TypeScript instantiation 카운트가 ~100배 감소해 소비자 IDE/빌드 체감을 크게 개선한다.

### 결정

peer + dev 모두 `zod@^4.4.3`로 고정한다. `src/schemas.ts`는 v3/v4 양쪽에서 동일한 stable API(`z.tuple`, `z.union`, `z.object().extend`, `z.array().min`, `z.number().min().max`)만 사용하므로 코드 변경은 없다.

### 근거

- 성능 차이가 명확 (특히 IDE TypeScript instantiation 비용)
- stable API만 사용하므로 마이그레이션 비용 없음
- 소비자 graph에서 zod 사본 중복 방지

### 결과(긍정)

- 빌드 산출물에서 zod runtime이 제거(externalize)되어 ESM 132 kB → 43 kB, UMD 99 kB → 32 kB로 **-67% 축소**
- 소비자 TypeScript IDE 응답 개선

### 결과(부정)

- v3에 묶인 소비자는 zod 업그레이드 필요 — 마이그레이션 가이드는 zod 공식 문서 참고

---

## ADR-7: 범용 라이브러리 경계 — 도메인 특화 코드 비포함

- 상태: accepted
- 날짜: 2026-05-25
- 결정자: human

### 컨텍스트

PR #10/#11에서 TripMate(특정 소비자 앱) 도메인 지식(16색 marker palette, 7종 feature kind enum, 한국어 관광 카테고리 enum, `₩` currency)이 `src/tripmate.ts`, `src/components/TripmateFeatureLayer.tsx`에 박혔다. 다른 소비자가 이 라이브러리를 채택할 때 dead weight가 되고, TripMate의 schema 변경이 라이브러리 release를 강제하는 결합이 생긴다.

### 결정

도메인 특화 모듈은 라이브러리에서 제거하고 소비자 앱에 거주시킨다. 라이브러리는 **map primitive만** 제공한다 — markers, popup, layers, clustering, region-bounded zod schemas. 한국 지역 preset 같은 helper도 factory(`makeBoundedLngLatSchema`)로 일반화하고, Korea constant는 core에서 제거한다.

### 근거

- 라이브러리/앱 책임 경계가 명확해짐 — 라이브러리는 "지도가 도는 토대", 앱은 "도메인 데이터/UI"
- 다른 소비자(kraddr-geo-ui 같은) 채택 비용 감소
- 번들 사이즈 약 5KB 감소

### 결과(긍정)

- TripMate 의존성 없이 어떤 React + MapLibre + VWorld 소비자도 사용 가능
- ADR 위반 여부를 코드 리뷰에서 "이게 도메인 특화인가?" 한 질문으로 판단 가능

### 결과(부정)

- 기존 TripMate 코드가 사용하던 `<TripmateFeatureLayer>` 같은 컴포넌트는 소비자 앱으로 이주 필요 — PR #12에서 일괄 처리됨

### 운영 규칙

소비자 앱이 자기 도메인 preset을 만들고 싶으면 라이브러리 factory를 사용한다:

```typescript
import { makeBoundedLngLatSchema } from 'maplibre-vworld';
const KoreaLngLat = makeBoundedLngLatSchema([124, 132], [33, 43]);
```

이런 preset은 소비자 앱 안에 둔다. 라이브러리에 다시 박지 않는다.

---

## ADR-8: 외부 store + `useSyncExternalStore` + `useEvent`

- 상태: accepted
- 날짜: 2026-05-25
- 결정자: human

### 컨텍스트

이전 구현은 두 개의 `createContext`(map 인스턴스용, zoom용)와 `mapRef.current` + `useMemo` factory 조합을 사용했다. 다음 문제들이 있었다:

1. `createContext` value를 매 render마다 새 object로 만들면 모든 consumer가 churn.
2. `mapRef.current`를 `useMemo` factory에서 읽으면 React가 변경을 감지 못해 stale value 노출 가능.
3. prop callback이 매 render마다 새 closure면 MapLibre에 listener를 매번 다시 붙여야 함.
4. zoom 같은 자주 바뀌는 값을 context로 broadcast하면 marker tree 전체가 re-render.

### 결정

vanilla JS `MapStore` class를 만들고 `useSyncExternalStore`로 구독한다. selector 패턴(`useMapSelector`)으로 slice 변경 시에만 re-render. handler는 `useEvent`(canonical `useLayoutEffect + useRef + useCallback`)로 stable identity 유지하고 최신 closure 호출. 모든 DOM-touching 모듈에 `'use client'` 명시.

### 근거

- `useSyncExternalStore`는 React 18+ 표준 외부 store hook. tearing 방지 + concurrent mode 안전.
- selector 패턴은 zustand/redux에서 검증된 사실상 표준.
- `useEvent`는 React 공식 RFC(예정 hook `useEffectEvent`)와 동일한 의도 — handler identity 안정 + 최신 closure.
- `'use client'`로 Next.js RSC 경계 명시 — 소비자가 `next/dynamic({ ssr: false })`로 감쌀 필요 없음.

### 결과(긍정)

- 카메라/zoom 이벤트가 마커 트리 전체를 re-render 시키지 않음.
- semantic-zoom marker는 threshold cross 시에만 re-render (fractional 11.5 → 11.7은 무시).
- consumer callback 변경 시 map 재구성 0회.
- store가 단일 source of truth — 두 context 사이 sync 버그 가능성 제거.

### 결과(부정)

- `useMapSelector` 사용 시 selector를 `useCallback`으로 감싸는 게 권장사항 — 다만 PR #14에서 selector를 ref에 보관하도록 변경해 unstable selector도 안전하게 동작.
- 신규 hook 학습 곡선 — README/AI_AGENT_GUIDE에 패턴 명시.

### 후속

- (open) 새 store slice 추가 시 (예: `bearing`, `pitch`) selector 표면 일관성 가이드 필요.

---

## ADR-9: python-kraddr-geo 문서 구조 채택

- 상태: accepted
- 날짜: 2026-05-26
- 결정자: human

### 컨텍스트

기존 문서는 루트의 `AGENTS.md` + `ADR.md` + `AI_AGENT_GUIDE.md` + `journal.md` + `README.md` 5개로 흩어져 있어 새 에이전트가 어디부터 읽어야 할지 불명확했다. 작업 항목 추적도 free-form text(`journal.md`)로만 되어 있어 "지금 진행 중인 작업이 무엇인가?"가 즉답되지 않았다.

`python-kraddr-geo` 저장소는 같은 사용자가 운영하며, 다음 구조로 정착되어 있다:

- `CLAUDE.md` (root) — 현재 상태 + 세션 연속성
- `AGENTS.md` (root) — 언어 정책, 식별자 매트릭스, DO NOT
- `SKILL.md` (root) — 빠른 시작, DO NOT, 자주 묻는 작업, 도메인 어휘
- `docs/architecture.md`, `docs/decisions.md` (ADR), `docs/journal.md` (역시간순), `docs/tasks.md` (T-NNN), `docs/resume.md`, `docs/dev-environment.md`

T-NNN task 시스템이 특히 효과적이었다(작업 항목별 고유 ID, journal/PR과 cross-reference 가능).

### 결정

`maplibre-vworld-js`도 동일한 구조를 채택한다. 기존 `ADR.md` → `docs/decisions.md`(표준 ADR 포맷으로 재작성), `journal.md` → `docs/journal.md`(역시간순), `AI_AGENT_GUIDE.md`는 영문 사용자 대상 진입점으로 유지하되 한글 에이전트 매뉴얼은 `SKILL.md`로 신설. `CLAUDE.md`, `docs/architecture.md`, `docs/tasks.md`, `docs/resume.md`, `docs/dev-environment.md`, `CHANGELOG.md`를 신규 작성.

### 근거

- 새 에이전트의 진입점이 `CLAUDE.md` 한 곳으로 통일.
- T-NNN로 작업 추적 → journal/PR/commit message에서 cross-reference 가능.
- ADR 표준 포맷(컨텍스트/결정/근거/결과+/결과-/후속)으로 결정 품질 향상.
- 두 저장소 간 작업 흐름 일치 → 에이전트가 두 프로젝트를 오갈 때 학습 비용 0.

### 결과(긍정)

- 새 에이전트가 30초 안에 "지금 무엇을 하고 있는가"를 파악 가능 (`CLAUDE.md`).
- 작업 항목이 PR title/commit message/journal에서 일관된 ID로 참조됨.
- 결정 누락 방지 — ADR 포맷이 "근거/결과(부정)/후속" 칸을 강제.

### 결과(부정)

- 기존 한 곳을 보던 사람은 여러 파일을 보게 됨 — 다만 `CLAUDE.md`가 진입점 역할을 해서 실제 진입 비용은 낮음.
- 이전 PR(#1~#9)을 retroactive T-NNN으로 매핑하는 작업 필요 — `docs/tasks.md` 작성 시 1회만 수행.

### 후속

- (open) GitHub Issues와 T-NNN을 어떻게 매핑할지 — 현재는 PR 본문/commit message에서 `T-NNN` 라벨로 참조하는 컨벤션만 둔다.

---

## ADR-10: GitHub Actions / CI/CD 비사용

- 상태: accepted
- 날짜: 2026-05-26
- 결정자: human

### 컨텍스트

PR #8에서 `.github/workflows/ci.yml`을 도입해 type-check + test + build + `git diff --exit-code -- dist/` + `pack:check` 5단계를 GitHub Actions에서 자동 실행했다. 그러나 PR #15 머지 시점에 GitHub 계정이 일시적 / 영구적 suspend 상태로 들어가 Actions checkout 자체가 403으로 막혔다. 그 외에도 본 저장소의 운영자가 GitHub의 무료 Actions 분당 한도, 키 관리, third-party action 보안 검토에 대한 운영 부담을 지속할 의사가 없다.

라이브러리 규모도 작아 로컬 게이트(`npm run type-check && npm test && npm run build`) 한 번이면 90% 신뢰성이 확보된다 — `dist/` drift는 작업자가 `git diff --exit-code -- dist/`로 직접 확인한다.

### 결정

GitHub Actions / 외부 CI/CD를 사용하지 않는다. `.github/workflows/` 디렉토리를 제거한다. 품질 게이트는 작업자가 PR을 푸시하기 직전 로컬에서 직접 실행한다. 이 컨벤션은 `AGENTS.md` DO NOT 룰과 `SKILL.md` §7 체크리스트에 명시.

### 근거

- 계정 suspension 같은 외부 인프라 의존을 제거.
- 라이브러리 규모 대비 CI 운영 비용이 과함 — 컴포넌트 17개 + 테스트 50개 수준.
- 작업자가 로컬 게이트를 돌리는 규율을 가지고 있고, PR 검토자가 PR body의 "Test plan" 체크리스트로 확인.
- 무료 Actions 분당 한도 / third-party action 검토 부담 제거.

### 결과(긍정)

- 외부 인프라 의존 0. GitHub이 불안정해도 머지 가능.
- 빌드 시간 = 로컬 머신 한 번. 큐 대기 없음.
- 키/시크릿을 GitHub Secret으로 위탁할 필요 없음.

### 결과(부정)

- 작업자가 로컬 게이트를 잊으면 stale dist 또는 깨진 빌드가 머지될 위험 — `AGENTS.md` 체크리스트와 PR body 템플릿으로 보강. 잘못 머지된 경우 follow-up PR로 정정.
- 외부 기여자(소비자가 PR을 보낼 때) 자동 검증이 없음 — 다만 본 저장소는 핵심 운영자만 머지 권한을 가진 폐쇄형 운영이므로 영향이 작다.

### 후속

- (open) `pre-commit` 또는 `husky` 같은 로컬 git hook으로 push 전 자동 게이트를 거는 옵션 검토. 다만 작업자 동의 없는 hook 강제는 마찰을 만들 수 있어 우선순위는 낮다.

---

## ADR-11: 마커 및 팝업의 동적 Z-Index 관리 및 시멘틱 줌 오버라이드(Manual Expand)

- 상태: accepted
- 날짜: 2026-05-26
- 결정자: human

### 컨텍스트

1. 지도 위에서 마커나 팝업들이 촘촘하게 겹쳐 있을 때, 클릭한 요소가 다른 요소 아래에 가려져 보이지 않는 UX 결함이 지속적으로 발생했다. CSS의 `z-index`를 고정값으로 부여하는 방식으로는 가장 마지막에 추가된 마커가 항상 최상단을 차지하는 문제를 해결할 수 없었다.
2. 줌 아웃 시 지도 성능 최적화 및 가독성을 위해 마커를 간소화(Simplify)하는 시멘틱 줌(Semantic Zoom)이 적용되었으나, 줌 아웃된 상태에서도 특정 마커의 요약 정보를 빠르게 확인하고 싶다는 요구사항이 제기되었다. 기존 구조에서는 반드시 줌 인을 해야만 정보를 볼 수 있었다.

### 결정

1. **동적 Z-Index 관리**: 전역 카운터 변수(`globalMarkerZIndex = 1`)를 도입하고, `<Marker>`나 `<Popup>`에 `onClick` 이벤트가 발생할 때마다 전역 카운터를 1씩 증가시켜 해당 요소의 인라인 `z-index`에 부여한다.
2. **시멘틱 줌 오버라이드 (Manual Expand)**: `PlaceMarker`, `WeatherMarker`, `PriceMarker` 등 시멘틱 줌에 종속적인 컴포넌트 내부에 `isManuallyExpanded` 상태를 도입한다. 간소화된 핀을 클릭 시 이 상태를 활성화하여 강제로 원래 형태를 노출하며, 지도를 줌 인 하여 시멘틱 줌 임계치를 자연스럽게 넘어가면 오버라이드 상태를 백그라운드에서 초기화한다.

### 근거

- **UX 우선**: 지도는 시각적으로 복잡해지기 쉽다. 사용자의 마지막 상호작용(클릭)이 화면의 포커스를 가져야 한다는 기본 원칙(Focus follows click)을 충족시킨다.
- **상태 동기화 최소화**: 전역 `z-index` 카운터는 단순한 모듈 스코프 변수로 관리하여 `useSyncExternalStore` 같은 복잡한 상태 관리를 피한다.
- **선택적 확장**: 시멘틱 줌 오버라이드는 개별 마커 컴포넌트의 로컬 상태(`useState`)로만 관리하여 MapStore 전체에 부하를 주지 않는다. 

### 결과(긍정)

- 겹친 마커나 팝업 간의 Z-Index 경합이 완벽히 해결됨.
- 줌인/줌아웃을 반복하지 않아도 원하는 마커의 상세 내용을 즉각 탐색할 수 있어 탐색 효율성 극대화.

### 결과(부정)

- 전역 변수(`globalMarkerZIndex`)를 사용하므로, 만에 하나 한 페이지에 여러 개의 독립적인 `<VWorldMap>` 인스턴스가 렌더링될 경우 `z-index` 카운터를 공유하게 됨. (실제 운영 환경에서는 문제될 가능성이 매우 희박하여 수용)
- 시멘틱 줌 기능이 포함된 새로운 커스텀 마커를 개발할 때마다 오버라이드(Manual Expand)와 자연스러운 해제 로직을 중복 구현해야 함.

### 후속

- (open) 커스텀 마커 개발 시마다 오버라이드 로직 작성을 피하기 위해, `useSemanticZoom` 커스텀 훅이 오버라이드 상태까지 함께 반환해 주는 형태의 리팩토링 검토.

---

## ADR-12: 에이전트별 고정 worktree와 CodeGraph 인덱스 채택

- 상태: accepted
- 날짜: 2026-05-27
- 결정자: human

### 컨텍스트

ChatGPT Codex, Claude Code, Google Antigravity 2.0 같은 여러 AI 에이전트가 같은 저장소를 다루면 한 checkout 안에서 브랜치 전환, 로컬 캐시, MCP 인덱스가 서로 충돌한다. 특히 CodeGraph는 프로젝트별 `.codegraph/` 인덱스를 유지하므로, agent가 작업 중인 브랜치와 인덱스가 계속 바뀌면 탐색 결과를 신뢰하기 어렵다.

CodeGraph 공식 문서는 `codegraph init -i`로 프로젝트 인덱스를 처음 만들고, 이후 `codegraph sync`로 변경분을 증분 갱신하는 흐름을 권장한다. MCP 서버는 현재 CLI 기준 `codegraph serve --mcp`로 실행한다.

### 결정

에이전트별 고정 worktree를 둔다. ChatGPT Codex는 `geo-codex`, Claude Code는 `geo-claude`, Google Antigravity 2.0은 `geo-antigravity`를 사용한다. 각 worktree는 최초 1회 `codegraph init -i`를 실행하고, 이후 작업마다 새 브랜치를 만든 뒤 `codegraph sync`로 인덱스를 유지한다. `.codegraph/`는 gitignore 대상이다.

프로젝트 로컬 Codex MCP 설정은 `.codex/config.toml`에 둔다.

```toml
[mcp_servers.codegraph]
enabled = true
command = "npx"
args = ["-y", "@colbymchenry/codegraph", "serve", "--mcp"]
```

### 근거

- agent별 작업 디렉토리를 고정하면 다른 agent의 브랜치 전환이나 미완성 변경이 현재 작업을 깨지 않는다.
- `.codegraph/`가 worktree별로 분리되어 브랜치별 인덱스 오염을 줄인다.
- `codegraph sync`는 변경분만 처리하므로 매 작업마다 재초기화하는 것보다 빠르고 안정적이다.
- 프로젝트 로컬 `.codex/config.toml`을 커밋하면 Codex 세션이 같은 MCP 서버 설정을 재사용할 수 있다.

### 결과(긍정)

- 여러 agent가 동시에 작업해도 checkout과 인덱스 상태 충돌이 줄어든다.
- 코드 탐색은 CodeGraph, 품질 검증은 기존 로컬 게이트라는 역할 구분이 명확해진다.
- 새 agent가 `docs/dev-environment.md`만 읽어도 worktree 생성, branch 생성, `codegraph sync` 순서를 따라갈 수 있다.

### 결과(부정)

- worktree마다 `node_modules/`와 `.codegraph/`가 생겨 디스크 사용량이 늘어난다.
- `geo-*` worktree가 오래 방치되면 stale branch가 남을 수 있어 주기적인 `git worktree list` 점검이 필요하다.

### 후속

- (open) `geo-claude`, `geo-antigravity` worktree 생성 여부는 각 agent가 처음 작업할 때 확인한다.
- (open) CodeGraph CLI가 MCP command alias를 추가하면 `.codex/config.toml`의 `args`를 재검토한다.
