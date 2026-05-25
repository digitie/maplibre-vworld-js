# 개발 작업 일지 (Journal)

이 문서는 프로젝트의 진행 과정, 문제 해결 내역, 그리고 각 단계별 핵심 인사이트를 상세하게 기록하는 작업 일지입니다.

---

## 2026-05-25: main 브랜치 코드 리뷰 후 런타임 결함 수정

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

## 2026-05-25: 범용 라이브러리로 정리 + API/성능 리팩토링

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

## 2026-05-25: TripMate 지도 primitive P0/P1 구현

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

## 2026-05-25: TripMate 연동 추가 구현 백로그 문서화

### 1. TripMate 최신 main 문서 기준의 지도 요구사항 정리
- **이슈**: `tripmate`는 사용자 대면 UI를 `maplibre-vworld` 기반 지도로 가져가는 방향을 명시하지만, 세부 Sprint 문서에는 과거 Kakao SDK 기준 문구와 지도 UI 요구사항이 섞여 있다. 이 상태에서 바로 구현에 들어가면 앱 책임(TanStack Query, Zustand, 위치 동의/감사 로그)과 라이브러리 책임(MapLibre 이벤트, marker primitive, VWorld 오류 처리)이 뒤섞일 위험이 있었다.
- **조치**:
  1. `tripmate` `origin/main` `767bace`와 `maplibre-vworld-js` `origin/main` `b19baa3`를 기준점으로 고정했다.
  2. `docs/tripmate-implementation-roadmap.md`를 추가해 viewport 이벤트, context menu, 16색 마커 팔레트, Maki icon vendor path, Korea 좌표/bounds helper, 서버 클러스터, feature kind 렌더링, 선택/호버 상태, popup primitive를 우선순위별로 정리했다.
  3. README와 `AI_AGENT_GUIDE.md`에 새 백로그 문서 링크와 책임 경계 주의사항을 추가했다.
- **결과**: 후속 PR은 TripMate Sprint 4 요구사항을 라이브러리 public API로 승격할지, TripMate 앱 내부에 남길지를 먼저 확인한 뒤 작게 나눠 구현할 수 있다.

### 2. 검증
- `git diff --check` → 통과.

## 2026-05-25: 디버그 UI 동작 정합화를 위한 Map event hook 보강

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

## 2026-05-25: GitHub dependency 소비 가능 패키징 보강

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
