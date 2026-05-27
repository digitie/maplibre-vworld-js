# CHANGELOG

`maplibre-vworld`의 주목할 만한 변경 사항을 기록한다. 포맷은 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)를 따르고 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)을 느슨하게 준수한다. 1.0.0은 PR #14 머지 후 안정 baseline이다. 표준 헤더(`### Added`/`Changed`/`Removed`/`Fixed`/`Security`)는 Keep-a-Changelog 표준에 따라 영문을 유지하고, 본문 항목은 한글로 적는다.

## [Unreleased]

### Added

- TripMate/tour-map 소비자 요구사항 문서 `docs/consumer-requirements.md` 추가. lazy loading, 클릭 context, 지원되지 않는 타일 fallback, CI/CD 활성화 검토를 수용 기준과 예정 API 예제로 정리 (T-024).
- CodeGraph MCP 프로젝트 설정 `.codex/config.toml` 추가 및 `.codegraph/` gitignore 등록 (T-025).
- `RouteLine`에 GeoJSON 포맷을 직접 주입할 수 있는 `data` Prop 복구. (단일 `LineString` 외에 `MultiLineString` 지원)
- 개발 환경(`NODE_ENV !== 'production'`) 한정으로 `PolygonArea`와 `RouteLine`의 입력 데이터(GeoJSON 등) 구조를 검증하여 경고를 띄우는 Zod 런타임 유효성 검사 추가. (`PolygonAreaInputSchema`, `RouteLineGeoJSONSchema`)
- `ClusterLayer`에 React Key Churn을 방지하는 클러스터 고유 ID 자동 생성 옵션 `generateId` 노출 (T-018).
- `Marker` 포털 메모리 누수를 검증하는 자동화 단위 테스트 추가 (T-020).
- `PolygonArea`, `RouteLine`의 라이프사이클 및 이벤트 바인딩 검증을 위한 단위 테스트 추가.
- `Popup` 또는 `Marker`가 클릭될 경우 동적으로 `z-index`를 높여 다른 요소들 위로 최상단 렌더링되도록 개선 (PR #21).
- `PriceMarker`에 배열 데이터(`price: PriceItem[]`)를 전달하여 주유소처럼 여러 개의 가격(휘발유, 고급유 등)을 동시에 표시할 수 있는 기능 추가 (PR #22).
- `PriceMarker`에 3단계 Semantic Zoom LOD 적용 및 `lodThresholds` prop 노출.
- 시멘틱 줌에 의해 간소화된 마커(`PlaceMarker`, `WeatherMarker`, `PriceMarker`)를 사용자가 한 번 클릭하면 줌 레벨과 무관하게 전체 내용이 강제로 확장 표시(Manual Expand)되는 기능 추가.

### Changed

- 에이전트별 고정 worktree(`geo-codex`, `geo-claude`, `geo-antigravity`)와 CodeGraph `init -i`/`sync` 운영 방식을 ADR-12 및 개발 문서에 반영 (T-025).
- 모든 Markdown 문서를 한글로 작성하도록 정책을 강화하고 영문으로 남아 있던 `README.md`, `AI_AGENT_GUIDE.md`, `CHANGELOG.md`를 한글화 (T-017). 코드 식별자, 명령어, URL, 외부 공식 용어, 벤더/제품명, Keep-a-Changelog 표준 keyword는 영문을 유지.
- `python-kraddr-geo` 식 문서 구조 채택 (T-015): 루트에 `CLAUDE.md`/`AGENTS.md`/`SKILL.md`, 나머지는 `docs/{architecture,decisions,journal,tasks,resume,dev-environment}.md`. public API는 변경 없음.

### Removed

- GitHub Actions / CI 워크플로 (T-016, ADR-10). `.github/workflows/ci.yml` 삭제. 품질 게이트(`npm run type-check && npm test && npm run build && git diff --exit-code -- dist/`)는 유지보수자가 머지 전 로컬에서 직접 실행.

## [1.0.0] — 2026-05-26

이번 릴리스는 PR #1 ~ #14를 안정 baseline으로 통합한다. 이 시점 이후의 breaking change는 semver를 따른다.

### Added

- 외부 store 아키텍처: `MapStore` + `useSyncExternalStore` (ADR-8). 패키지 root에서 `useMap`, `useMapZoom`, `useMapLoaded`, `useMapSelector`, `useEvent` 노출.
- `<VWorldMap>` prop: `fallback`, `loadingSkeleton`, `animateCameraChanges`, `flyToOptions`, `onClick`, `onContextMenu`, `onMoveEnd`, `onZoomEnd`, `onIdle`, `onError`, `transformRequest`, `semanticZoomThreshold`.
- `<Marker>` 상태 prop: `selected`, `highlighted`, `zIndex`, `ariaLabel`, `className`. `<Marker>`에 construction-time anchor/offset prop 추가.
- `<Popup>`: construction-only 옵션 ref snapshot + 전용 setter effect (인라인 `offset` 객체 변경 시 remount되지 않음).
- `<ClusterLayer>` (supercluster 기반 클라이언트 사이드)와 `<ServerClusterLayer>` (서버에서 그룹화된 클러스터).
- 마커 variant: `PinMarker`, `MakiMarker`, `PulsingMarker`, `SimpleMarker`, `PlaceMarker`, `PriceMarker`, `WeatherMarker`, `RoutePointMarker`, `ClusterMarker`.
- 레이어 컴포넌트: `RouteLine`, `PolygonArea`.
- 스키마: `LngLatSchema`, `BoundsSchema`, `PointSchema`, `RouteCoordinatesSchema`, `makeBoundedLngLatSchema`, `makeBoundedBoundsSchema`, `extendPointSchema`, `formatLngLat`, `serializeBounds`, `parseBoundsParam`.
- VWorld 헬퍼: `getVWorldTileUrl`, `getVWorldStyle`, `getVWorldMaxZoom`, `redactVWorldUrl`, `isVWorldTileError`.
- 모든 DOM 모듈에 `'use client'` directive (Next.js App Router 안전).
- GitHub URL 소비자를 위한 `dist/` 커밋 (ADR-5).
- (historical) GitHub Actions CI 워크플로의 `git diff --exit-code -- dist/` drift 검사. 2026-05-26 ADR-10에 따라 제거 — 품질 게이트는 이제 로컬에서 실행.

### Changed

- API naming을 React 생태계 컨벤션에 맞춤 (PR #12):
  - `onMapClick` → `onClick`, `onMapLoad` → `onLoad`, `onMapError` → `onError`, `onMapContextMenu` → `onContextMenu`
  - `showNavigationControl`/`showGeolocateControl`/`showScaleControl` → `navigation`/`geolocate`/`scale`
  - `MarkerClusterer` → `ClusterLayer`, `MapPopup` → `Popup`
  - `<RouteLine>`의 `lineWidth`/`lineDasharray` → `width`/`dashArray`
  - `BasePointDataSchema` → `PointSchema`, `createPointDataSchema` → `extendPointSchema`
- `<VWorldMap center>`를 필수 prop으로 변경 — 서울 기본값 제거 (PR #12).
- 카메라 prop 변경(`center`, `zoom`, `pitch`, `bearing`)이 사용자 제스처 중에는 `pendingCameraRef`로 큐잉되고 `moveend` 시 재시도된다 (PR #14).
- `<RouteLine>`/`<PolygonArea>`가 `styledata` 대신 `style.load`를 리스닝하도록 변경 — 우리 자신의 `setPaintProperty` 호출이 재진입을 일으키지 않도록 (PR #14).
- `useMapSelector`가 selector를 ref에 보관 — 불안정한 selector identity도 cache를 invalidate하지 않음 (PR #14).
- `<Marker>` `className` diff를 토큰 집합(`prev - next` 제거, `next - prev` 추가) 방식으로 변경 — 공통 토큰의 CSS transition 깜빡임 방지 (PR #14).
- `<PinMarker>`와 `<PlaceMarker>`가 `<Marker anchor="bottom" offset={...}>`을 사용하도록 변경 — 수동 `transform: translate(...)`을 제거해 MapLibre anchor와 이중 변환되지 않게 함 (PR #14).
- zod를 `^4.4.3`로 고정 (peer + dev). zod v3는 더 이상 지원하지 않음 (ADR-6, PR #8). externalize로 빌드 산출물 약 67% 축소.

### Removed

- 도메인 특화 TripMate 코드 (`src/tripmate.ts`, `<TripmateFeatureLayer>`, `TRIPMATE_MARKER_PALETTE`, 한국 관광 카테고리 enum, `₩` 통화 하드코드) — ADR-7 (PR #12).
- `KoreaLngLatSchema`, `KoreaBoundsSchema`, `KOREA_LNG_RANGE` 상수 — `makeBoundedLngLatSchema` factory로 대체 (PR #12).
- `VWorldMapErrorInfo`/`VWorldMapContextMenuInfo`/`VWorldViewportInfo` envelope — raw MapLibre 이벤트를 직접 노출 (PR #12).
- `MakiMarker` alias `iconName`/`fallbackIcon` — 단일 `icon` prop으로 통일 (PR #12).
- `redactVWorldTileUrl` — `redactVWorldUrl`에 흡수 (overload로 `undefined` 통과 가능) (PR #12).
- 디버그 잔재: `analyze_tiles.js`, `generate_html.js`, `test_tiles.js`, `tiles.html`, 여러 PNG 스크린샷 (PR #14).

### Fixed

- `useEvent` 패턴(`useLayoutEffect + useRef + useCallback`)이 MapLibre 관점에서 stale 이벤트 핸들러 closure를 방지 — prop callback은 자유롭게 변경 가능하며 listener를 재바인딩하지 않음 (PR #12, PR #13/14에서 정련).
- 카메라 prop 적용 시 `map.isMoving() || map.isEasing()` 가드로 제스처 중 진동 방지 (PR #12, drop 수정은 PR #14).
- `useMapSelector` referential caching: 같은 snapshot → 같은 selector 결과 reference. `Object.is` 값 비교로 새 snapshot에서도 불필요한 re-render 방지 (PR #13/14).
- `<Marker>` selected/highlighted scale이 실제 `style.scale` 속성에 적용됨 (Safari fallback은 `--vworld-marker-scale` CSS 변수) (PR #13).
- `<RouteLine>`이 `dashArray` prop이 제거되면 paint property도 초기화 (PR #13).
- `<VWorldMap>` 초기 mount가 `load` 이후 `center`/`zoom`을 redundant `flyTo`로 replay하지 않음 (PR #13).
- `<VWorldMap maxBounds>` 제거 시 `setMaxBounds(undefined)`로 bound가 정상 해제됨 (PR #13).
- `<ClusterMarker>` `onClick`이 `<Marker onClick>` 경로로 라우팅되고(map click으로 bubble되지 않음) `useEvent` + `useMemo`로 안정화 (PR #13/14).
- `<Popup>`이 인라인 객체 `offset` prop 변경 시 remount되지 않음 — construction-only 옵션은 snapshot, mutable 옵션은 dedicated setter effect로 처리 (PR #14).
- `<ClusterLayer>`가 `load` 이전 `map.getBounds()` race를 방어 — `map.loaded()` 체크 + `map.once('load', update)` fallback (PR #14).
- `isVWorldTileError(event)`가 `error?.message` null 안전 (PR #14).
- window 글로벌 누수(`window.vworldMap`) 및 디버그 `console.log` 제거 (PR #6/7).

### Security

- `dev/main.tsx`의 VWorld API key를 git history에서 제거; 추후 누설은 `redactVWorldUrl()`과 평문 커밋 금지 DO NOT 규칙으로 방지 (2026-05-24).

## 이전 이력

PR #1 ~ #5는 초기 라이브러리 부트스트랩을 다룬다 (MapLibre 통합, React portal 마커, supercluster + viewport culling, zod 스키마). 상세 항목은 `docs/journal.md`에서 확인.
