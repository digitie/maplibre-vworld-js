# TASKS — 백로그

작업 항목은 `T-NNN` 형식의 ID로 관리한다. 새 작업은 "대기"의 우선순위 순서대로 들어가고, 진행 중이 되면 담당자를 표시한다. 완료된 작업은 "완료" 섹션 상단에 누적한다. T-001부터 T-014까지는 PR #1 ~ #14의 historical 매핑이다.

## 진행 중
- (없음)

## 대기 (우선순위 순)
- T-019 VWorld `getCapabilities` 응답을 활용한 layer/tile matrix 자동 검증 — 현재 `getVWorldMaxZoom`은 하드코딩된 표. WMTS Capabilities XML을 fetch해서 layer-별 zoom 범위를 동적으로 검증할 수 있는지 검토.

## 완료
- [x] T-029 CI/CD 활성화 재검토 — ADR-13 작성하여 ADR-10 대체, GitHub Actions (`.github/workflows/ci.yml`)에 제한적 범위의 CI/CD (테스트 및 빌드 게이트) 복원 완료. (2026-05-28)
- [x] T-028 지원되지 않는 타일 대체 이미지/동작 구현 — VWorld layer/zoom 상한 또는 provider 오류 시 금지 아이콘이 포함된 중립 목업 타일을 표시하고, `isVWorldTileError`/`redactVWorldUrl` 로깅 패턴과 연결 완료. (2026-05-28)
- [x] T-027 마커 클릭/지도 클릭 구분 context 지원 — raw 이벤트를 유지하면서 두 번째 인자로 `source`, `interactionId`, `lngLat` 같은 context를 전달하는 비파괴 API 구현 완료. (2026-05-28)
- [x] T-026 `<VWorldMap>` lazy loading 지원 — `IntersectionObserver` 기반으로 viewport 진입 전 MapLibre 인스턴스와 VWorld 타일 요청 지연 적용. `lazy`, `lazyRootMargin`, manual enable 기능 구현 및 테스트 작성. (2026-05-27)
- [x] T-030 Antigravity 2.0 에 맞게 프로젝트 MCP 설정 반영 — `.gemini/mcp.json` 파일 생성 및 `dev-environment.md` 업데이트. (2026-05-27)
- [x] T-025 CodeGraph + 에이전트별 고정 worktree 운영 정책 적용 — `geo-codex` worktree 생성, `.codegraph/` gitignore, `.codex/config.toml` MCP 설정, ADR-12 및 개발 환경 문서 추가. (2026-05-27)
- [x] T-024 TripMate/tour-map 소비자 요구사항 문서화 — lazy loading, 클릭 context, 지원되지 않는 타일 fallback, CI/CD 활성화 검토를 `docs/consumer-requirements.md`에 수용 기준과 예제로 정리. 코드 구현은 후속 T-026~T-029로 분리. (2026-05-27)
- [x] T-023 PR #23 — ADR-11 추가. 동적 z-index와 시멘틱 줌 manual expand에 대한 결정 기록. (2026-05-26)
- [x] T-022 PR #22 — PriceMarker 다중 가격 배열 지원, 3단계 LOD 적용, 시멘틱 줌 마커 강제 확장(Manual Expand) 기능 추가, 우클릭(onContextMenu) 예제 추가. (2026-05-26)
- [x] T-021 PR #21 — 겹치는 마커/팝업 클릭 시 전역 카운터 기반 동적 `z-index` 증가 로직 도입으로 클릭 요소 최상단 노출. (2026-05-26)
- [x] T-020 RouteLine GeoJSON 복구 및 Marker Portal 메모리 누수 방지 테스트 — GeoJSON `data` Prop 복구 및 Zod 유효성 검사 추가. `<Marker>` 언마운트 누수 검증. (2026-05-26)
- [x] T-018 supercluster `generateId` 옵션 노출 — 클러스터 마커의 React Key Churn 방지. (2026-05-26)
- [x] T-017 PR #19 — 모든 Markdown 문서를 한글로 작성하도록 정책 강화. AGENTS.md 언어 정책에서 예외 조항 제거, README.md / AI_AGENT_GUIDE.md / CHANGELOG.md 한글로 재작성. 보존 대상은 6개 카테고리(코드 식별자/명령어/외부 공식 용어/벤더/표준 keyword/shell 출력)로 명시. (2026-05-26)
- [x] T-016 PR #17 — GitHub Actions / CI 제거. .github/workflows/ci.yml 삭제, ADR-10 추가, 모든 문서에서 CI 언급을 로컬 게이트 표현으로 정정. 백로그 번호 시프트(T-016/17/18 → T-017/18/19) (2026-05-26)
- [x] T-015 PR #15 — python-kraddr-geo 문서 구조 채택. CLAUDE.md/AGENTS.md(재작성)/SKILL.md 루트, docs/{architecture,decisions,journal,tasks,resume,dev-environment}.md, CHANGELOG.md 신설. ADR.md→docs/decisions.md, journal.md→docs/journal.md 이전. 코드 변경 없음 (2026-05-26)
- [x] T-014 PR #14 — PR #13 follow-up review fixes. onError ref 통합, pendingCameraRef로 camera prop drop 방지, styledata→style.load, Marker className token diff, anchor/offset prop, Popup construction-only opts snapshot, ClusterMarker useEvent, ClusterLayer loaded gate, useMapSelector ref-based selector, 디버그 잔재 제거 (2026-05-26)
- [x] T-013 PR #13 — main 코드 리뷰 후 런타임 결함 수정. stale handler ref 패턴, initial camera replay 방지, pitch/bearing prop, maxBounds undefined 해제, useMapSelector cache, marker scale style, ClusterMarker onClick path, RouteLine dashArray reset (2026-05-25)
- [x] T-012 PR #12 — 범용 라이브러리 정리. TripMate 도메인 코드 제거, API 네이밍 React 컨벤션 정합, center 필수화, Korea 상수 제거(factory로 대체), external store + useSyncExternalStore + useEvent 아키텍처, 'use client' 일괄 적용, isMoving/isEasing 가드, supercluster 타이핑 (2026-05-25)
- [x] T-011 PR #11 — TripMate 지도 primitive P0/P1. onViewportChange, onMapContextMenu, Marker state props, TRIPMATE_MARKER_PALETTE, MakiMarker, ServerClusterLayer, TripmateFeatureLayer, MapPopup (2026-05-25, PR #12에서 도메인 코드 제거됨)
- [x] T-010 PR #10 — TripMate 연동 추가 구현 백로그 문서화. docs/tripmate-implementation-roadmap.md, viewport/context-menu/marker palette/Maki vendor path/Korea schema/server cluster/feature kind/popup primitive 우선순위 정리 (2026-05-25, PR #12에서 docs 제거됨)
- [x] T-009 PR #9 — 디버그 UI 동작 정합화. onMapClick, onMapError, flyToOptions props, isVWorldTileError, redactVWorldTileUrl helper. kraddr-geo-ui와 hook 계약 공유 (2026-05-25)
- [x] T-008 PR #8 — GitHub dependency 소비 가능 패키징. dist/ 커밋, ./style.css export, prepack 스크립트, API key 평문 제거, tsconfig.build.json, peer dependency 분리, getVWorldMaxZoom, attribution 통일 (2026-05-25)
- [x] T-007 zod v4 강제 — peer + dev 모두 v4로 통일. 빌드 산출물에서 zod runtime externalize, ESM/UMD 사이즈 -67% (2026-05-25)
- [x] T-006 CI workflow — type-check + test + build + dist drift 검사 + pack:check (2026-05-25, T-016에서 제거됨)
- [x] T-005 코어 라이브러리 안정화 — MarkerClusterer renderCluster 인자 수정, RouteLine console.log 제거, window.vworldMap leak 제거, PolygonArea 주석 정리, VWorldMap 테스트 수정, getCanvas mock fresh object per call, encodeURIComponent 회귀 테스트 (2026-05-24)
- [x] T-004 보안 패치 — dev/main.tsx VWorld API key 하드코드 제거, .env 환경변수 분리, git history rewrite (2026-05-24)
- [x] T-003 transformRequest hook 노출 — CORS/프록시 우회 지원, README troubleshooting 섹션 (2026-05-24)
- [x] T-002 supercluster + viewport culling — 10만 마커 메모리 안전, KDBush 기반 (2026-05-23)
- [x] T-001 코어 라이브러리 부트스트랩 — React.createPortal 기반 Marker, MapLibre GL JS v5, zod schemas (2026-05-23)

## 사양 참조
- 아키텍처 세부: `docs/architecture.md`
- 결정 기록: `docs/decisions.md`
- 작업 일지: `docs/journal.md`
- 개발 환경: `docs/dev-environment.md`
