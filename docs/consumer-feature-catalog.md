# Consumer Feature Catalog

> 본 문서는 소비자 앱 (1차 TripMate, 향후 다른 React 지도 앱) 이 본 라이브러리에
> 요구할 가능성이 있는 기능을 정리한다. **공통 기능 / 도메인 전용** 책임 경계와,
> 각 항목의 라이브러리 측 구현 상태를 박는다.
>
> 본 문서는 **소비자가 본 라이브러리에 PR을 보내야 할 항목**의 1차 reference.
> TripMate의 v0.1.0 릴리즈 게이트는 본 문서 §1의 "라이브러리 PR 필요" 항목이
> 모두 머지된 상태를 요구한다 (소비자 측 `docs/sprints/SPRINT-4.md`).

## 0. 책임 분류 기준

| 분류 | 판정 기준 | 위치 |
|------|----------|------|
| **라이브러리 (본 저장소)** | "어떤 지도 앱에서도 쓸 수 있는 일반 기능" — 좌표 / 마커 / 이벤트 / popup 등 SDK 표준 영역 | `maplibre-vworld-js` 본 저장소 |
| **소비자 전용** | 소비자 도메인 룰 / 데이터 모델 / 권한 / 팔레트 매핑 / 사용자 UX | 소비자 앱 (TripMate `apps/web/lib/` 등) |

본 라이브러리는 **generic primitive만 export**한다 (`VWorldMap` / `Marker` /
`Popup` / `PolygonArea` / `RouteLine` / `ClusterLayer`). 소비자 도메인 wrapper /
팔레트 상수는 라이브러리에 박지 않는다 (TripMate ADR-005 mirror — 라이브러리는
앱 lock-in을 만들지 않는다).

## 1. 공통 기능 카탈로그 (라이브러리 PR 대상)

상태 표기:
- ✅ 제공 (현재 라이브러리에 있음)
- 🚧 PR queued / 진행 중
- ❓ 확인 필요 (소비자가 사용 중 발견 필요)
- ❌ 미구현 (라이브러리 PR 필요)

### 1.1 viewport 이벤트

| 기능 | 상태 | 비고 |
|------|------|------|
| `onMoveEnd` / `onZoomEnd` / `onIdle` callback | ✅ | raw `MapLibreEvent` 노출 |
| viewport state subscription (zoom/bounds/center) | ✅ | `useMapSelector(selector)` |
| `useEvent(handler)` stable callback | ✅ | 리렌더 안 타는 handler |

debounce는 소비자 측에서 (예: 250ms + AbortController). 라이브러리는 raw stream만.

### 1.2 사용자 위치 marker

| 기능 | 상태 | 비고 |
|------|------|------|
| `<UserLocationMarker lngLat accuracy_m />` | ❓ | `<PulsingMarker>`로 대체 가능 여부 확인 |
| `flyToUserLocation` prop pattern | ✅ | 선언형 `center` prop 변경 또는 `flyToOptions` |

소비자가 사용 시 발견되면 PR 후보.

### 1.3 우클릭 메뉴

| 기능 | 상태 | 비고 |
|------|------|------|
| `onContextMenu(e)` 지도 우클릭 | ✅ | raw `MapMouseEvent` |
| `<Marker onContextMenu>` 마커 우클릭 | ❓ | 확인 후 PR 가능 |

### 1.4 Marker generic props

| Prop | 상태 | 비고 |
|------|------|------|
| `lngLat` / `color` / `icon` / `size` | ✅ | 기본 SDK 영역 |
| `title` / `description` / `imageUrl` | ❓ | tooltip 데이터로 활용 |
| `onClick` / `onHover` / `onContextMenu` | ✅ / ❓ / ❓ | hover / contextmenu 확인 |
| `selected` boolean | ❓ | 양방향 selection (목록 ↔ 마커) 강조 |

소비자별 marker (Place / Weather / Event / Notice) 는 본 라이브러리에 박지
않는다 (`§2` 참고). marker prop 자체의 generic 확장만 라이브러리 영역.

### 1.5 Tooltip / Popup

| 기능 | 상태 | 비고 |
|------|------|------|
| `<Popup>` 컴포넌트 (마커 click) | ✅ | 이전 `<MapPopup>`에서 이름 변경 |
| 마커 hover tooltip | ❓ | 별 컴포넌트 또는 marker prop 옵션 |
| Popup `offset` / `anchor` / `maxWidth` | ✅ | 일반 SDK |

### 1.6 카메라 / 애니메이션

| 기능 | 상태 | 비고 |
|------|------|------|
| `center` / `zoom` 선언형 prop | ✅ | rerender 시 자동 transition |
| `cameraTarget={center, zoom, bearing, pitch}` | ❓ | 통합 prop으로 정리 PR 후보 |
| `cameraTransition: 'instant' / 'smooth' / 'flyOver'` | ❓ | 애니메이션 종류 prop |
| `bbox` prop (= `fitBounds`) | ❓ | viewport reset |

### 1.7 거리 / 측정

| 기능 | 상태 | 비고 |
|------|------|------|
| `<MeasureLine points={...}>` | ❓ | 사용자 측정 도구 — PR 후보 |
| `haversine(a, b)` utility export | ❓ | 클라이언트 직선 거리 |

### 1.8 좌표 / 검증

| 기능 | 상태 | 비고 |
|------|------|------|
| `LngLatSchema` zod export | ✅ | 소비자 schemas에서 import 가능 |
| `BBoxSchema` zod | ✅ | viewport bounds 검증 |
| `makeBoundedLngLatSchema([lng_min, lng_max], [lat_min, lat_max])` factory | ✅ | 국가/도메인 범위 제한 |
| `PointSchema` / `extendPointSchema()` | ✅ | 소비자 도메인 POI 스키마 확장 |

소비자별 한국 범위 검증 (`makeBoundedLngLatSchema([124, 132], [33, 43])`)은
소비자가 1회 생성해 재사용 (라이브러리에 박지 않음).

### 1.9 SSR / hydration

| 기능 | 상태 | 비고 |
|------|------|------|
| `loadingSkeleton` prop | ✅ | |
| `fallback` prop | ✅ | |
| Server Component import 차단 | ✅ | `'use client'` 강제 (dynamic import) |

### 1.10 transformRequest 프록시

| 기능 | 상태 | 비고 |
|------|------|------|
| `transformRequest` prop | ✅ | VWorld API 키 redact, 도메인 화이트리스트 |
| `apiKey` prop + auto-injection | ✅ | env에서 주입 |

## 2. 소비자 전용 (라이브러리에 박지 않는다)

다음은 **소비자 (TripMate 등)** 가 본인 저장소에 구현한다. 본 라이브러리에 PR
받지 않음 — 받으면 closed 처리 후 소비자 측 구현으로 안내.

- **16색 (또는 N색) 팔레트 → 카테고리 매핑** — 소비자 도메인 데이터
  (TripMate: `apps/web/lib/markerPalette.ts` + DB `app.category_mappings`)
- **POI / 마커 D&D 비즈니스 룰** — LexoRank reorder / optimistic lock / 동시편집
  conflict 등 — 소비자 도메인
- **도메인 marker 컴포넌트** (`PlaceMarker` / `WeatherMarker` /
  `EventMarker` / `NoticeMarker`) — 소비자가 `<Marker>` generic primitive 위에
  도메인 props로 wrap
  *(단, `PriceMarker`는 다중 가격 표시 및 3단계 LOD 패턴의 보편성을 인정받아 예외적으로 라이브러리 기본 컴포넌트로 유지함 - ADR-15)*
- **Notice / Plan / Trip 도메인 다이얼로그** — 소비자 도메인
- **사용자 동의 기반 위치 권한 흐름** — 소비자 법규 (한국 LBS, GDPR 등)
- **`feature_link_broken_at` 처리** — 소비자 ↔ provider 책임 경계
- **CSP / proxy 정책** — 소비자 보안 설정
- **국가별 좌표 범위 상수** (예: 한국 124-132, 33-43) — 소비자가 `makeBoundedLngLatSchema`
  factory로 1회 생성

## 3. 분류 변경 절차

본 카탈로그를 갱신할 때:

1. 항목 분류가 명확하면 §1 / §2 표 갱신 + PR
2. 애매한 항목은 본 저장소 issue로 토론 → 결정 후 ADR (라이브러리 측) 또는 본
   카탈로그에 박음
3. 소비자가 본 라이브러리에 wrapper / 도메인 데이터를 박으려 하면 reject 후 §2로
   안내

## 4. PR 처리 가이드 (라이브러리 maintainer 용)

소비자가 본 라이브러리에 PR을 보낼 때:

1. 본 카탈로그 §1 분류 확인 — 공통 기능인지
2. ❌ / ❓ 항목이면 우선 검토
3. ✅ 항목과 중복이면 기존 API 확인 요청
4. §2 (소비자 전용) 항목이면 reject + 소비자 측 구현 권유
5. 머지 시 §1 표 상태 → ✅ + 본 카탈로그 PR 동봉

## 5. 참조

- `architecture.md` — 라이브러리 구조
- `decisions.md` — ADR 누적
- TripMate (1차 소비자): `docs/integrations/maplibre-vworld.md` + `docs/sprints/SPRINT-4.md` §5
