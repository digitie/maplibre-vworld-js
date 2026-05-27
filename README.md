<div align="center">
  <img src="https://img.shields.io/badge/MapLibre-0081F2?style=for-the-badge&logo=maplibre&logoColor=white" alt="MapLibre" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/VWorld-Korea-blue?style=for-the-badge" alt="VWorld" />

  <h1>🗺️ maplibre-vworld-js</h1>
  <p><strong>MapLibre GL JS로 브이월드(VWorld) 타일을 렌더링하는 React 바인딩.</strong></p>
</div>

<br />

VWorld 베이스맵을 React에서 사용하기 위해 MapLibre GL JS를 얇게 감싼 라이브러리다. **지도 primitive만** 제공한다 — 마커, 팝업, 레이어, 클러스터링. 데이터 fetching, 상태 관리, 라우팅 같은 애플리케이션 관심사는 소비자 앱에 맡긴다.

## 특징

- **WebGL 네이티브 렌더링**: MapLibre GL JS v5 — fractional zoom, 벡터/래스터 source, 60fps 인터랙션.
- **선언적 React API**: props in, raw MapLibre 이벤트 out. 양방향 바인딩 wrapper 없음.
- **외부 store**: `useSyncExternalStore` 기반. 자식 컴포넌트는 필요한 slice만 구독하고, zoom/pan은 전체 트리를 re-render하지 않음.
- **stable callback**: 내장 `useEvent` hook — 핸들러는 항상 최신 closure를 호출하고 MapLibre는 재구성되지 않음.
- **내장 클러스터링**: `supercluster` + viewport culling. 화면 안 마커만 DOM에 mount.
- **SSR 안전**: 모든 DOM 모듈에 `'use client'` 명시. Next.js App Router에서 그대로 동작.
- **Zod 스키마**: 지역 bounded 좌표 factory 제공 (한국 preset 포함).

## 설치

```bash
npm install maplibre-vworld maplibre-gl 'zod@^4.4.3'
```

`react`, `react-dom`, `maplibre-gl`, `zod`는 peer dependency다.

> `apiKey` prop은 양 끝 whitespace가 자동으로 trim되고 URL-encode된다. zod v4 필수 (v3는 미지원).

## 빠른 시작

```tsx
import { VWorldMap, Marker } from 'maplibre-vworld';
import 'maplibre-vworld/style.css';

export function App() {
  return (
    <VWorldMap apiKey={process.env.VWORLD_API_KEY!} center={[127.024, 37.532]} zoom={12}>
      <Marker lngLat={[127.024, 37.532]} color="#ff0000" />
    </VWorldMap>
  );
}
```

## `<VWorldMap>` props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `apiKey` | `string` | **필수** | 빈/공백 문자열이면 `fallback`이 렌더링되고 MapLibre 인스턴스를 만들지 않음. |
| `center` | `[lng, lat]` | **필수** | 라이브러리가 위치를 가정하지 않음 — 앱이 적절한 중심을 지정. |
| `zoom` | `number` | `12` | |
| `pitch` / `bearing` | `number` | `0` / `0` | |
| `layerType` | `'Base' \| 'gray' \| 'midnight' \| 'Hybrid' \| 'Satellite'` | `'Base'` | |
| `minZoom` / `maxZoom` | `number` | `6` / `19` | `Satellite`/`Hybrid`는 z18까지 자동 clamp. |
| `maxBounds` | `LngLatBoundsLike` | — | |
| `navigation` / `geolocate` / `scale` | `boolean` | `true` | MapLibre 기본 컨트롤. |
| `semanticZoomThreshold` | `number` | — | 이 zoom 미만에서 마커가 단순화되도록 신호 (`SimpleMarker`, `PlaceMarker`, `WeatherMarker`). |
| `onLoad` | `(map) => void` | — | MapLibre `load` 1회 발화 후 호출. |
| `onClick` | `(MapMouseEvent) => void` | — | raw MapLibre click — `e.lngLat.lng/lat`로 좌표 추출. |
| `onContextMenu` | `(MapMouseEvent) => void` | — | raw 우클릭. |
| `onMoveEnd` / `onZoomEnd` / `onIdle` | `(MapLibreEvent) => void` | — | raw 카메라 이벤트 — 필요한 것만 구독. |
| `onError` | `(ErrorEvent) => void` | console.warn | raw MapLibre `error` 이벤트. `isVWorldTileError()`, `redactVWorldUrl()`과 함께 사용. |
| `transformRequest` | `RequestTransformFunction` | — | CORS / 인증 / 프록시 hook. |
| `fallback` | `ReactNode \| (info) => ReactNode` | — | `'missing-api-key'` 또는 `'map-init-error'` 시 지도 대신 렌더링. |
| `loadingSkeleton` | `ReactNode` | — | `load` 발화 전 표시할 오버레이. |
| `animateCameraChanges` | `boolean` | `true` | `false`면 카메라 prop 변경 시 `jumpTo`. |
| `flyToOptions` | `Omit<FlyToOptions, 'center' \| 'zoom' \| 'pitch' \| 'bearing'>` | — | `flyTo` duration/easing 튜닝 — 카메라 좌표는 prop에서. |
| `className` / `style` | — | — | 컨테이너 스타일. |

### 이벤트 핸들러 예시

```tsx
<VWorldMap
  apiKey={key}
  center={[127.024, 37.532]}
  onClick={(e) => setPicked([e.lngLat.lng, e.lngLat.lat])}
  onError={(e) => {
    if (isVWorldTileError(e)) {
      const url = (e.error as VWorldResourceError)?.url;
      logger.warn('tile fetch failed', redactVWorldUrl(url));
    }
  }}
  fallback={({ reason }) => <div>지도를 표시할 수 없음: {reason}</div>}
/>
```

## Hooks

모든 hook은 `<VWorldMap>` 자식에서 호출해야 한다.

```tsx
import { useMap, useMapZoom, useMapLoaded, useMapSelector, useEvent } from 'maplibre-vworld';

useMap();          // MapLibre 인스턴스 또는 mount 전이면 null. 안정적인 identity.
useMapZoom();      // 현재 zoom; zoomend 발화 시 re-render
useMapLoaded();    // load 발화 후 true
useMapSelector(s => s.zoom < 12);  // 임의의 slice, referential cache 지원
useEvent(handler); // 항상 최신 함수를 호출하는 stable callback
```

threshold cross 감지에는 `useMapSelector` 사용을 권장한다:

```tsx
const simplified = useMapSelector(
  useCallback((s) => s.zoom < (s.semanticZoomThreshold ?? 12), []),
);
```

이렇게 하면 zoom 11.5 → 11.7 같은 fractional 변화는 무시되고 threshold를 cross하는 순간(boolean flip)에만 1회 re-render한다.

## 마커

| 컴포넌트 | 용도 |
| --- | --- |
| `Marker` | 기본 pin (color 지정) 또는 portal로 임의 React children 주입. |
| `PinMarker` | 물방울형 pin (옵션: icon, label, tooltip). |
| `MakiMarker` | [Maki](https://labs.mapbox.com/maki-icons/) 아이콘 pin (CSS mask 로딩). |
| `PulsingMarker` | 파동 애니메이션 점 — "사용자 위치" 같은 곳에 적합. |
| `SimpleMarker` | 라벨 pill (옵션: zoom 단순화). |
| `PlaceMarker` | 제목/설명/사진 카드. |
| `PriceMarker` | Airbnb 스타일 가격 칩. |
| `WeatherMarker` | 날씨 조건 badge (옵션: 시간별 예보 popover). |
| `RoutePointMarker` | 번호 또는 알파벳 routing point. |
| `ClusterMarker` | `<ClusterLayer>`가 렌더하는 기본 클러스터 버블. |

대부분의 마커는 `selected`, `highlighted`, `zIndex`, `ariaLabel`, `className` 상태 prop을 지원한다. 엘리먼트에 `data-selected` / `data-highlighted` 속성이 노출되어 CSS hook으로 활용할 수 있다.

## 레이어

```tsx
<RouteLine id="route" data={geojsonFeature} color="#2196F3" width={4} />

<PolygonArea id="park" data={geojsonFeature} fillColor="..." outlineColor="..." />
```

`RouteLine`과 `PolygonArea`는 `setStyle()` (layer swap) 이후에도 자동 재등록된다 — `style.load` 이벤트 hook 사용.
개발 환경(`NODE_ENV !== 'production'`)에서는 입력된 GeoJSON의 유효성을 얕게 검사하는 런타임 Zod 검증이 활성화되어 콘솔에 경고를 출력한다.

## 팝업

```tsx
import { Popup } from 'maplibre-vworld';

<Popup lngLat={[127, 37]} onClose={() => setOpen(false)}>
  <h3>안녕</h3>
</Popup>
```

## 클러스터링

클라이언트 사이드 (supercluster):

```tsx
<ClusterLayer
  points={points}
  radius={50}
  maxZoom={16}
  generateId={true} // React Key Churn을 방지하는 클러스터 고유 ID 자동 생성 (기본값 true)
  renderMarker={(p) => <Marker key={p.id} lngLat={p.lngLat} />}
/>
```

서버 사이드 (백엔드에서 zoom 단위로 미리 그룹화한 경우):

```tsx
<ServerClusterLayer
  clusters={serverClusters}
  onClusterClick={(c) => console.log(c.id)}
/>
```

`ServerClusterPoint.bounds`가 있으면 `fitBounds`, 없으면 `flyTo`로 카메라가 이동한다.

## VWorld 유틸리티

```tsx
import {
  getVWorldTileUrl,
  getVWorldStyle,
  getVWorldMaxZoom,
  redactVWorldUrl,
  isVWorldTileError,
} from 'maplibre-vworld';

const style = getVWorldStyle(apiKey, 'Hybrid');
// → Hybrid (Satellite + 라벨) raster source가 포함된 MapLibre StyleSpecification

const safeForLog = redactVWorldUrl(error.url);
// → 'https://api.vworld.kr/req/wmts/1.0.0/***/Base/14/8000/12000.png'

if (isVWorldTileError(event)) { /* … */ }
```

## Zod 스키마

```tsx
import {
  LngLatSchema,
  BoundsSchema,
  PointSchema,
  extendPointSchema,
  makeBoundedLngLatSchema,
  formatLngLat,
} from 'maplibre-vworld';

// 일반 WGS84 bounded:
LngLatSchema.parse([127.024, 37.532]); // ✓

// 지역 bounded factory (예: 한국 preset):
const KoreaLngLat = makeBoundedLngLatSchema([124, 132], [33, 43]);

// 자체 속성을 더해 point shape 확장:
const PlaceSchema = extendPointSchema({ name: z.string(), rating: z.number() });
```

## 번들 / SSR

- ESM (`.mjs`) + UMD (`.umd.js`) 빌드 + declaration 파일.
- `react`, `react-dom`, `maplibre-gl`, `zod`는 externalize.
- 모든 DOM 모듈에 `'use client'` 명시 — Next.js React Server Component에서 그대로 import 가능. directive boundary가 작업을 client 번들로 이동시킴.

## 문제 해결

### CORS / 403 오류

브이월드 `api.vworld.kr`는 등록되지 않은 도메인(localhost, 사내망)의 요청에 403 또는 CORS 헤더 드랍을 반환할 수 있다. 두 가지 해결책:

1. VWorld 콘솔에서 운영 도메인을 등록 (`localhost`도 포함 가능).
2. `transformRequest` hook으로 로컬 프록시를 경유:

```tsx
<VWorldMap
  apiKey={key}
  center={[127.024, 37.532]}
  transformRequest={(url) => {
    if (url.includes('api.vworld.kr')) {
      return { url: url.replace('https://api.vworld.kr', '/proxy') };
    }
    return { url };
  }}
/>
```

### 타일 404 (zoom 너무 깊음)

`Satellite`와 `Hybrid`는 z18까지만 제공된다. `maxZoom`을 직접 지정하지 않거나 `getVWorldMaxZoom(layerType)`이 반환하는 값을 사용한다.

### API 키가 로그에 노출됨

`redactVWorldUrl(url)`로 마스킹한 뒤 로깅한다. `.env.local` 권한을 600으로 두고 절대 git에 커밋하지 않는다.

## 소비자 요구사항 로드맵

TripMate와 tour-map에서 필요한 lazy loading, 클릭 context, 지원되지 않는 타일 fallback, CI/CD 활성화 검토는 [`docs/consumer-requirements.md`](./docs/consumer-requirements.md)에 수용 기준과 예정 API 예제로 정리되어 있다. 2026-05-27 기준 해당 문서는 문서화 단계이며, 실제 public API 구현은 T-026~T-029 후속 작업에서 진행한다.

## 라이선스

MIT.

## 참고 문서

- [`CHANGELOG.md`](./CHANGELOG.md) — 사용자 가시 변경 이력
- [`docs/architecture.md`](./docs/architecture.md) — 내부 아키텍처 (`MapStore` + `useSyncExternalStore`)
- [`docs/decisions.md`](./docs/decisions.md) — Architecture Decision Records (ADR-1 ~ ADR-12)
- [`docs/consumer-requirements.md`](./docs/consumer-requirements.md) — TripMate/tour-map 요구사항과 예정 API 예제
- [`AI_AGENT_GUIDE.md`](./AI_AGENT_GUIDE.md) — 본 라이브러리를 소비자 앱에서 사용하는 AI/개발자 가이드
- [`CLAUDE.md`](./CLAUDE.md) — 본 저장소에서 작업하는 컨트리뷰터/에이전트 컨텍스트
- [`SKILL.md`](./SKILL.md) — 본 저장소 컨트리뷰터/에이전트 매뉴얼 (DO NOT, 자주 묻는 작업)
