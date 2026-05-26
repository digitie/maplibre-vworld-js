# TASKS — 백로그

작업 항목은 `T-NNN` 형식의 ID로 관리한다. 새 작업은 "대기"의 우선순위 순서대로 들어가고, 진행 중이 되면 담당자를 표시한다. 완료된 작업은 "완료" 섹션 상단에 누적한다. T-001부터 T-014까지는 PR #1 ~ #14의 historical 매핑이다.

## 진행 중
- T-015 python-kraddr-geo 문서 구조 채택 — `CLAUDE.md`/`SKILL.md`/`docs/` 신설, ADR/journal 표준 포맷 이식. 브랜치 `chore/adopt-kraddr-doc-structure`.

## 대기 (우선순위 순)
- T-016 supercluster `generateId` 옵션 노출 — cluster id가 매 build마다 재할당되어 React key churn을 만드는 회귀가 있다. `generateId` 또는 `getId` 콜백으로 안정화 옵션 제공.
- T-017 VWorld `getCapabilities` 응답을 활용한 layer/tile matrix 자동 검증 — 현재 `getVWorldMaxZoom`은 하드코딩된 표. WMTS Capabilities XML을 fetch해서 layer-별 zoom 범위를 동적으로 검증할 수 있는지 검토.
- T-018 marker portal teardown 재현 테스트 — `<Marker>` unmount 시 React fiber가 정리되지 않으면 stale handler가 남는 회귀가 있었다. 명시적인 leak 검증 테스트 추가.

## 완료
- [x] T-014 PR #14 — PR #13 follow-up review fixes. onError ref 통합, pendingCameraRef로 camera prop drop 방지, styledata→style.load, Marker className token diff, anchor/offset prop, Popup construction-only opts snapshot, ClusterMarker useEvent, ClusterLayer loaded gate, useMapSelector ref-based selector, 디버그 잔재 제거 (2026-05-26)
- [x] T-013 PR #13 — main 코드 리뷰 후 런타임 결함 수정. stale handler ref 패턴, initial camera replay 방지, pitch/bearing prop, maxBounds undefined 해제, useMapSelector cache, marker scale style, ClusterMarker onClick path, RouteLine dashArray reset (2026-05-25)
- [x] T-012 PR #12 — 범용 라이브러리 정리. TripMate 도메인 코드 제거, API 네이밍 React 컨벤션 정합, center 필수화, Korea 상수 제거(factory로 대체), external store + useSyncExternalStore + useEvent 아키텍처, 'use client' 일괄 적용, isMoving/isEasing 가드, supercluster 타이핑 (2026-05-25)
- [x] T-011 PR #11 — TripMate 지도 primitive P0/P1. onViewportChange, onMapContextMenu, Marker state props, TRIPMATE_MARKER_PALETTE, MakiMarker, ServerClusterLayer, TripmateFeatureLayer, MapPopup (2026-05-25, PR #12에서 도메인 코드 제거됨)
- [x] T-010 PR #10 — TripMate 연동 추가 구현 백로그 문서화. docs/tripmate-implementation-roadmap.md, viewport/context-menu/marker palette/Maki vendor path/Korea schema/server cluster/feature kind/popup primitive 우선순위 정리 (2026-05-25, PR #12에서 docs 제거됨)
- [x] T-009 PR #9 — 디버그 UI 동작 정합화. onMapClick, onMapError, flyToOptions props, isVWorldTileError, redactVWorldTileUrl helper. kraddr-geo-ui와 hook 계약 공유 (2026-05-25)
- [x] T-008 PR #8 — GitHub dependency 소비 가능 패키징. dist/ 커밋, ./style.css export, prepack 스크립트, API key 평문 제거, tsconfig.build.json, peer dependency 분리, getVWorldMaxZoom, attribution 통일 (2026-05-25)
- [x] T-007 zod v4 강제 — peer + dev 모두 v4로 통일. 빌드 산출물에서 zod runtime externalize, ESM/UMD 사이즈 -67% (2026-05-25)
- [x] T-006 CI workflow — type-check + test + build + dist drift 검사 + pack:check (2026-05-25)
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
