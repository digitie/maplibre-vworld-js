# TripMate 연동 추가 구현 백로그

이 문서는 `TripMate` 최신 `main` 문서를 기준으로 `maplibre-vworld-js`에서
추가로 구현해야 할 항목을 정리한다. 앱 전용 상태관리/API 호출까지 라이브러리에
끌어오지 않고, TripMate가 반복 구현하지 않아야 할 지도 렌더링 계약만 선별한다.

## 기준

- `maplibre-vworld-js`: `origin/main` `b19baa3`
- `tripmate`: `origin/main` `767bace`
- 작성일: 2026-05-25

참고한 TripMate 문서:

- `README.md`
- `docs/architecture.md`
- `docs/architecture/frontend.md`
- `docs/architecture/user-location.md`
- `docs/design/marker-palette.md`
- `docs/spec/v8/01-data.md`
- `docs/spec/v8/02-backend.md`
- `docs/spec/v8/03-frontend.md`
- `docs/sprints/SPRINT-4.md`

TripMate 문서에는 `react-kakao-maps-sdk` 기준의 오래된 문구가 아직 남아 있다.
하지만 루트 README와 전체 구조는 사용자 대면 UI를 `maplibre-vworld` 기반으로
가져가는 방향을 명시한다. 따라서 이 문서에서는 Kakao SDK 이름을 그대로 따르지
않고, 해당 문구가 표현하는 요구사항을 MapLibre/VWorld 계약으로 치환해 해석한다.

## 현재 제공되는 것

- `<VWorldMap>`: VWorld raster style, layer별 max zoom, `transformRequest`,
  fallback, loading skeleton, `onMapClick`, `onMapContextMenu`,
  `onViewportChange`, `onMapError`, `flyToOptions`.
- 마커 primitive: `<Marker>`, `<PinMarker>`, `<MakiMarker>`, `<ClusterMarker>`,
  `<SimpleMarker>`, `<PlaceMarker>`, `<PriceMarker>`, `<WeatherMarker>`,
  `<RoutePointMarker>`.
- 공간 primitive: `<MarkerClusterer>`, `<ServerClusterLayer>`, `<RouteLine>`,
  `<PolygonArea>`, `<MapPopup>`, `<TripmateFeatureLayer>`.
- 검증/유틸: `LngLatSchema`, `BoundsSchema`, `RouteCoordinatesSchema`,
  `KoreaLngLatSchema`, `KoreaBoundsSchema`, bounds serialize/parse helper,
  `getVWorldMaxZoom`, `isVWorldTileError`, VWorld URL redaction helper,
  TripMate marker palette/resolver.

## 책임 경계

라이브러리가 맡을 것:

- VWorld/MapLibre 초기화, 카메라, 이벤트, 좌표/bounds 표준화.
- React Portal 기반 마커와 MapLibre layer/source 생명주기.
- TripMate가 공통으로 쓰는 marker palette, Maki icon, cluster, route, area
  렌더링 primitive.
- SSR 안전 사용법과 API key/CORS/tile error 처리 계약.

TripMate 앱에 남길 것:

- `/features/in-bounds`, `/features/nearby`, `/features/{id}/weather` 호출.
- TanStack Query, Zustand store, AbortController, 1분 캐시 정책.
- 위치정보 동의, 권한 prompt, 위치 감사 로그, PII 마스킹.
- 우클릭 메뉴의 실제 항목, 모달, 토스트, Day 선택, POI CRUD.
- `python-krtour-map` DTO와 TripMate 응답 모델 변환.

## P0: Sprint 4 진입 전 필요한 공통 계약

### 1. Viewport 이벤트 표면

TripMate는 `center/zoom/bounds` 변경을 `mapViewportStore`에 반영하고,
`GET /features/in-bounds?bounds=&zoom=&kinds[]=` 호출을 트리거해야 한다.
현재는 소비자가 `onMapLoad`로 MapLibre 인스턴스를 받아 직접 `moveend`/`zoomend`
를 붙여야 한다.

추가 제안:

- `<VWorldMap onViewportChange={...} />`
- 콜백 payload:
  - `center: [lng, lat]`
  - `zoom: number`
  - `bounds: [west, south, east, north]`
  - `eventType: 'load' | 'moveend' | 'zoomend' | 'idle'`
- 좌표 순서는 모든 public API에서 `[lng, lat]`로 고정.
- debounce와 AbortController는 TripMate 앱 책임으로 둔다.

구현 상태: 완료. `onViewportChange`는 `load`, `moveend`, `zoomend`, `idle`에서
정규화된 `center/zoom/bounds` payload를 전달한다.

### 2. Context menu 이벤트

TripMate Sprint 4는 지도 우클릭 메뉴 4종과 마커 우클릭 메뉴 3종을 요구한다.
현재 `<VWorldMap>`은 click만 표준화했고, `<Marker>`는 DOM event prop을 받지
않는다.

추가 제안:

- `<VWorldMap onMapContextMenu={...} />`
- `<Marker onClick onContextMenu />` 또는 custom child wrapper에 전달되는
  표준 event helper.
- context menu payload에는 `lngLat`, 원본 DOM event, MapLibre event를 포함.
- 메뉴 UI 자체는 TripMate의 `RightClickMenu.tsx`에 둔다.

구현 상태: 완료. `<VWorldMap onMapContextMenu>`와 `<Marker onContextMenu>`가
추가되었고, 마커 이벤트는 DOM event를 앱으로 전달한다.

### 3. TripMate marker palette 상수

TripMate는 P-01~P-16 색상과 `label_color`를 앱/관리자/POI override에서 공유한다.
현재 라이브러리에는 이 palette가 없다.

추가 제안:

- `TRIPMATE_MARKER_PALETTE`
- `TripmateMarkerColorKey`
- `TRIPMATE_CATEGORY_MARKERS`
- `resolveTripmateMarkerStyle({ category, markerColor, markerIcon })`

DB override와 사용자 custom 값이 최종 우선권을 갖기 때문에, 라이브러리 상수는
fallback default로만 사용한다.

구현 상태: 완료. `TRIPMATE_MARKER_PALETTE`, `TRIPMATE_CATEGORY_MARKERS`,
`resolveTripmateMarkerStyle`, `isTripmateMarkerColorKey`를 export한다.

### 4. Maki icon 계약 정리

TripMate는 Mapbox Maki 8 아이콘을 `apps/web/public/maki/`에 vendoring하는 정책이다.
현재 `<MakiMarker>`는 unpkg CDN URL을 직접 사용하고 prop 이름도 `iconName`이다.

추가 제안:

- `iconName`은 유지하되 `icon` alias를 추가해 TripMate DTO의 `marker_icon`과
  바로 매핑할 수 있게 한다.
- `iconBaseUrl?: string`를 추가해 `/maki` 같은 로컬 vendor path를 사용하게 한다.
- CDN 기본값 사용 여부를 문서화하고, 운영 앱 예제는 로컬 vendor path를 권장한다.
- 없는 icon일 때 `marker` 또는 `circle` fallback을 제공한다.

구현 상태: 완료. `<MakiMarker>`는 `icon`, `iconName`, `iconBaseUrl`,
`fallbackIcon`을 지원한다. 운영 앱은 `iconBaseUrl="/maki"`처럼 vendored path를
전달한다.

### 5. 대한민국 좌표/bounds helper

TripMate user-location 문서는 UI 표시 좌표 정밀도와 한국 영역 검증을 별도로 둔다.
현재 `LngLatSchema`/`BoundsSchema`는 전세계 범위만 검증한다.

추가 제안:

- `KoreaLngLatSchema`: 대략 `lng 124~132`, `lat 33~43`.
- `KoreaBoundsSchema`
- `formatLngLat(lngLat, precision = 4)`
- `serializeBounds(bounds)` / `parseBoundsParam(value)`

정밀한 법정동/CRS 변환은 `python-krtour-map`과 `python-kraddr-geo` 책임으로 둔다.

구현 상태: 완료. `KoreaLngLatSchema`, `KoreaBoundsSchema`, `formatLngLat`,
`serializeBounds`, `parseBoundsParam`을 export한다.

## P1: TripMate 지도 화면 구현을 줄이는 primitive

### 6. 서버 클러스터 표시 primitive

TripMate는 zoom 단계별 서버 클러스터링을 계획한다:

- zoom < 7: `sido`
- zoom < 11: `sigungu`
- zoom < 14: `eupmyeondong`
- zoom >= 14: 개별 마커

현재 `<MarkerClusterer>`는 클라이언트 supercluster 기반이다. 서버가 이미 cluster를
반환하는 경우에는 이중 클러스터링을 피해야 한다.

추가 제안:

- `<ServerClusterMarker>` 또는 `<FeatureClusterLayer>` primitive.
- cluster payload에는 `id`, `lngLat`, `count`, `label`, `bounds?`, `zoomTo?`를 허용.
- cluster click 기본 동작은 `bounds`가 있으면 `fitBounds`, 없으면 `flyTo`.
- 기존 `<MarkerClusterer>`는 클라이언트 전용 대량 point fallback으로 유지.

구현 상태: 완료. `<ServerClusterLayer>`가 서버 cluster payload를 받아 기본
`ClusterMarker`를 렌더링하고, cluster click 시 `fitBounds` 또는 `flyTo`를 수행한다.

### 7. Feature kind 렌더링 helper

TripMate feature는 `place/event/notice/price/weather/route/area` 7종이다.
현재 라이브러리는 개별 primitive는 있으나 feature kind를 받아 적절한 marker,
route, polygon으로 분기하는 표준 helper가 없다.

추가 제안:

- `TripmateFeatureLike` 타입.
- `<FeatureLayer features renderPopup? renderMarker? />`
- 기본 분기:
  - `place/event/notice`: Maki marker
  - `price`: price marker 또는 Maki marker + price badge
  - `weather`: weather marker
  - `route`: `<RouteLine>`
  - `area`: `<PolygonArea>` + centroid marker 옵션

단, API 응답 schema 전체를 라이브러리에 고정하지 않는다. TripMate가 transform
함수로 라이브러리의 얕은 타입에 맞춰 넘기는 구조가 안전하다.

### 8. 선택/호버 상태 contract

TripMate는 패널 카드 hover/click과 마커 hover/click을 양방향으로 동기화한다.
현재 marker 컴포넌트에는 `selected`, `highlighted`, `zIndex` 같은 표준 prop이 없다.

추가 제안:

- marker primitive 공통 prop:
  - `selected?: boolean`
  - `highlighted?: boolean`
  - `zIndex?: number`
  - `ariaLabel?: string`
- 선택 시 scale/shadow 기본값은 제공하되, `className`/`style` override를 허용.
- TripMate의 Zustand store 자체는 앱 책임으로 둔다.

### 9. Popup/overlay primitive

TripMate는 `SelectedPoiPopup`, feature detail, weather card를 지도 위에 띄운다.
현재는 소비자가 marker child로 직접 구성해야 한다.

추가 제안:

- `<MapPopup lngLat offset onClose>`: MapLibre Popup 생명주기를 React Portal로 감싼다.
- `<MarkerPopover>`: marker anchor 기준 lightweight popover.
- popup 내용과 비즈니스 action은 TripMate 컴포넌트로 주입.

구현 상태: 완료. `<MapPopup>`이 MapLibre Popup 생명주기를 React Portal로 감싼다.

## P2: 품질과 운영 안정성

### 10. Route/area 개선

현재 `<RouteLine>`과 `<PolygonArea>`는 기본 렌더링은 가능하지만 TripMate의 route/area
feature에는 hover, selected, fit bounds, centroid 보조 표시가 필요하다.

추가 제안:

- `fitToGeometry(map, geometry, options)` helper.
- `<RouteLine selected highlighted />`
- `<PolygonArea fillOpacity selected highlighted />`
- area centroid marker는 앱이 계산한 값을 우선 사용하고, 라이브러리 centroid 계산은
  선택 기능으로 둔다.

### 11. Weather/price marker DTO 정리

TripMate의 weather/price 데이터는 `python-krtour-map`의 `WeatherCard`/`PriceCard`
계열 응답을 거쳐 온다. 현재 marker props는 데모용에 가깝다.

추가 제안:

- 원시 DTO 전체를 받기보다 표시용 adapter 타입을 정의한다.
- `WeatherMarker`는 KMA 시간축과 sources 표시 여부를 render prop으로 분리한다.
- `PriceMarker`는 원화 기본, fuel/rest-area category를 고려한 label formatter를
  옵션으로 둔다.

### 12. 테스트/예제 강화

추가 구현 PR마다 다음을 맞춘다:

- Vitest로 event payload, marker event bubbling, palette resolver 테스트.
- `dev/main.tsx`에 TripMate 유사 viewport/cluster/context-menu 예제 추가.
- 코드 변경이 있으면 `dist/` 재생성.
- README와 `AI_AGENT_GUIDE.md` 예제는 실제 prop 이름과 동기화.

## Non-goals

- Kakao SDK wrapper를 이 저장소에 추가하지 않는다.
- TripMate API client, TanStack Query key, Zustand store를 이 라이브러리에 넣지 않는다.
- 위치정보법 동의/감사 로그/권한 prompt를 이 라이브러리에 넣지 않는다.
- 지도 타일이나 feature 데이터를 Service Worker로 오프라인 캐싱하지 않는다.
- React Native 지도 컴포넌트는 별도 패키지 또는 TripMate 모바일 앱에서 다룬다.

## 권장 구현 순서

1. P0-3/P0-4: marker palette와 Maki icon 계약을 먼저 추가한다.
2. P0-1/P0-2: viewport/contextmenu 이벤트 표면을 추가한다.
3. P0-5: Korea 좌표/bounds helper와 query param helper를 추가한다.
4. P1-6/P1-8: 서버 cluster와 selected/highlighted marker 상태를 추가한다.
5. P1-7/P1-9: feature layer와 popup primitive를 추가한다.
6. P2 항목은 TripMate Sprint 4 실제 API shape가 굳은 뒤 구현한다.

## 완료 기준

- TripMate `apps/web/components/map/*`가 MapLibre event/listener를 직접 붙이지 않고
  라이브러리 public API로 viewport, click, contextmenu, cluster, marker 상태를
  처리할 수 있다.
- TripMate marker 색/아이콘 fallback이 앱과 라이브러리에서 같은 상수를 사용한다.
- `feature.kind=route/area`가 지도에 안정적으로 렌더링되고, point centroid 보조
  표시를 앱이 선택할 수 있다.
- API key, 좌표, tile URL이 로그나 UI에 평문으로 과노출되지 않는다.
