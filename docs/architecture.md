# 아키텍처

본 문서는 `maplibre-vworld-js`의 큰 구조를 다룬다. 결정의 역사는 `decisions.md`(ADR)에서 별도로 관리한다.

## 한 패키지, 두 표면

```
┌──────────────────────────────────┐    Next.js / Vite / 일반 React App
│  소비자 앱                       │
│  - import { VWorldMap } from     │
│    'maplibre-vworld'             │
│  - import 'maplibre-vworld/      │
│      style.css'                  │
└───────────────┬──────────────────┘
                │
                ▼
┌──────────────────────────────────┐
│  maplibre-vworld (이 저장소)     │
│  ──────────────────────────────  │
│  React 컴포넌트 (use client)     │
│   <VWorldMap> · <Marker> ·       │
│   <Popup> · <RouteLine> · …      │
│  ──────────────────────────────  │
│  store/  ← MapStore (vanilla)    │
│  schemas.ts ← zod                │
│  vworld.ts ← URL/style/redact    │
└───────────────┬──────────────────┘
                │ peer deps
                ▼
┌──────────────────────────────────┐
│  maplibre-gl · react · react-dom │
│  zod                             │
└──────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────┐
│  VWorld (api.vworld.kr/req/wmts) │
│  - Base · gray · midnight (z19)  │
│  - Satellite · Hybrid     (z18)  │
└──────────────────────────────────┘
```

라이브러리는 한 번에 두 가지 표면을 제공한다:

1. **컴포넌트 표면** — `<VWorldMap>`, `<Marker>`, `<Popup>`, layer 컴포넌트들.
2. **hook 표면** — `useMap`, `useMapZoom`, `useMapLoaded`, `useMapSelector`, `useEvent`. `<VWorldMap>` 자식에서 호출.

두 표면 모두 동일한 `MapStore` 인스턴스를 통과한다. 어떤 식으로 사용해도 일관된 동작.

## 계층

| 계층 | 위치 | 의존 대상 | 의존하지 않는 것 |
|------|------|-----------|------------------|
| schemas | `src/schemas.ts` | zod | React, MapLibre, DOM |
| vworld | `src/vworld.ts` | (없음) | React, MapLibre, DOM |
| store | `src/store/` | React (`useSyncExternalStore`), maplibre-gl 타입만 | DOM, components |
| components | `src/components/` | store, vworld, schemas, maplibre-gl, react-dom | (서로는 합성으로만) |
| public | `src/index.ts` | 위 전부 | — |

의존 방향은 **`schemas`/`vworld` → `store` → `components` → `index.ts`** 한 방향이다. 컴포넌트끼리는 합성 관계로 서로 import한다(`<PinMarker>`이 `<Marker>`를 합성하는 식).

## 외부 store + `useSyncExternalStore`

핵심 아이디어는 ADR-8에 상세히 적었지만, 구조만 다시 정리한다.

### `MapStore` (vanilla JS class)

```typescript
class MapStore {
  private snapshot: MapStoreSnapshot;
  private listeners: Set<() => void>;
  subscribe(listener): () => void;       // returns unsubscribe
  getSnapshot(): MapStoreSnapshot;
  setMap(map | null): void;
  setLoaded(loaded): void;
  setZoom(zoom): void;
  setSemanticZoomThreshold(threshold): void;
}
```

- `getSnapshot()`은 동일 상태에서 동일 참조를 반환. `useSyncExternalStore`의 tearing 방지 요건을 만족.
- `setMap`/`setLoaded`/`setZoom`/`setSemanticZoomThreshold`는 값이 실제로 바뀔 때만 새 snapshot을 만들고 listener를 호출.

### React 진입점

```typescript
useMap()                  → store.getSnapshot().map (Map | null)
useMapZoom()              → store.getSnapshot().zoom
useMapLoaded()            → store.getSnapshot().loaded
useMapSelector(selector)  → selector(snapshot), referential cached
useEvent(handler)         → stable callback, latest closure
```

`useMapSelector`는 selector를 ref에 보관 → consumer가 `useCallback`을 잊어도 무한 render가 일어나지 않음. cache key는 snapshot identity만, value 비교는 `Object.is`.

### `useEvent`

```typescript
function useEvent<T>(handler: T | undefined): T {
  const ref = useRef(handler);
  useLayoutEffect(() => { ref.current = handler; });
  return useCallback(((...args) => ref.current?.(...args)) as T, []);
}
```

`useLayoutEffect`로 commit 직전에 최신 handler를 ref에 심고, callback은 매 render마다 stable. MapLibre listener를 매번 재등록할 필요가 없다.

## `<VWorldMap>` 라이프사이클

```
mount
  ├── apiKey 검증 → 빈/공백이면 fallback 렌더, MapLibre 생성 안 함
  ├── new maplibregl.Map({ container, style, center, zoom, pitch, bearing })
  ├── store.setMap(map)
  ├── map.on('load',     () => { store.setLoaded(true); onLoadRef.current?.(map); })
  ├── map.on('zoomend',  () => { store.setZoom(map.getZoom()); onZoomEndRef.current?.(e); })
  ├── map.on('moveend',  applyPendingCameraIfAny + onMoveEndRef.current)
  ├── map.on('idle',     onIdleRef.current)
  ├── map.on('error',    onErrorRef.current ?? console.warn)
  ├── map.on('click' | 'contextmenu', stableHandler)
  └── controls (NavigationControl / GeolocateControl / ScaleControl) 등록

camera prop 변경 (center/zoom/pitch/bearing)
  ├── isMoving() || isEasing() 면 pendingCameraRef.current = snapshot
  └── 아니면 flyTo(snapshot, ...flyToOptions) 또는 jumpTo(snapshot)

moveend (사용자 제스처 종료)
  └── pendingCameraRef.current 가 있으면 한 번 더 시도 → 적용 또는 큐 유지

unmount
  ├── map.remove()
  └── store.setMap(null)
```

### camera prop drop 방지

```typescript
const pendingCameraRef = useRef<CameraSnapshot | null>(null);

function applyPendingCameraIfAny(map: Map): void {
  const pending = pendingCameraRef.current;
  if (!pending) return;
  if (map.isMoving() || map.isEasing()) return;  // 아직 idle 아님
  const { animateCameraChanges: animate, flyToOptions } = cameraOptionsRef.current;
  animate
    ? map.flyTo({ ...flyToOptions, ...pending })
    : map.jumpTo(pending);
  lastCameraRef.current = pending;
  pendingCameraRef.current = null;
}
```

이 패턴이 없으면 `isMoving()` 가드 때문에 사용자가 패닝 중에 들어온 prop이 영구히 silent drop된다(PR #14 직전까지의 회귀).

## Marker / Popup 라이프사이클

### Marker

```
mount
  ├── element = options.element ?? document.createElement('div')
  ├── new maplibregl.Marker({ element, anchor, offset, draggable, color })
  ├── marker.setLngLat(lngLat).addTo(map)
  ├── createPortal(children, element) — children은 React tree
  └── element.addEventListener('click' / 'contextmenu', stableHandler)

prop 변경
  ├── lngLat 변경 → marker.setLngLat(...)
  ├── offset  변경 → marker.setOffset(...)        ← anchor와 달리 setter로 적용 가능
  ├── className 변경 → token set diff (prev - next remove, next - prev add)
  ├── selected/highlighted → data-* attr + CSS var --vworld-marker-scale
  └── zIndex / aria-label → element style / attr

unmount
  ├── element.removeEventListener(...)
  ├── ReactDOM.unmountComponentAtNode(element) (portal teardown)
  └── marker.remove()
```

`anchor`는 construction-time 옵션 — MapLibre가 marker 생성 시 한 번만 읽는다. `offset`은 setter로 변경 가능 → consumer가 인라인 `[0, -8]` 같은 객체를 넘겨도 marker는 재생성되지 않는다(PR #14 직전까지의 회귀).

### Popup

```
mount
  ├── constructionOpts = { closeButton, closeOnClick, className, anchor }  ← 첫 render 시 ref snapshot
  ├── new maplibregl.Popup(constructionOpts)
  ├── popup.setDOMContent(container).setLngLat(lngLat).addTo(map)
  └── popup.on('close', onCloseRef.current)

prop 변경
  ├── lngLat   → popup.setLngLat(...)
  ├── offset   → popup.setOffset(...)
  ├── maxWidth → popup.setMaxWidth(...)
  └── children → React tree → container DOM 갱신

effect deps: [map, container]만 — construction-only 옵션 변경은 의도적으로 무시
```

construction-only 옵션을 `useRef`에 snapshot해 두는 이유: consumer가 `offset={[0, -8]}` 같은 인라인 배열을 넘겨도 매 render마다 popup이 remount되어 `onClose`가 발화하는 무한 루프를 막기 위함(PR #14에서 fix).

## 데이터 흐름 — semantic zoom

```
<VWorldMap semanticZoomThreshold={12}>
  <SimpleMarker lngLat={...}>...</SimpleMarker>
</VWorldMap>

zoom 이벤트
  ├── map.on('zoomend', () => store.setZoom(newZoom))
  └── store가 listener에 broadcast

SimpleMarker (useMapSelector 패턴)
  ├── const simplified = useMapSelector(s => s.zoom < (s.semanticZoomThreshold ?? 12))
  ├── selector는 boolean을 반환 → snapshot 새로 와도 값이 같으면 같은 참조
  └── boolean이 flip할 때만 re-render
```

이 패턴 덕분에 zoom 11.5 → 11.7 같은 fractional change는 marker tree를 re-render하지 않는다. 11.99 → 12.01에서 threshold cross가 발생할 때만 1회 re-render.

## RouteLine / PolygonArea — style.load 재등록

MapLibre는 `setStyle(...)` 호출 시 기존 layer/source를 모두 잃는다. `<RouteLine>`이 만든 layer를 보존하려면 style 교체 후 다시 등록해야 한다.

PR #14 이전에는 `styledata`로 listener를 걸었는데, 이 이벤트는 `setPaintProperty()` 같은 개별 mutation에도 발화 → 우리 자신의 paint update가 다시 `addOrUpdate`를 부르는 재진입이 생겼다.

**현재**: `style.load`만 등록. 이 이벤트는 `setStyle()` 완료 시 1회만 발화 → 우리 layer 보존 의도와 정확히 일치.

## 에러 분류

`onError`는 raw `maplibregl.ErrorEvent`를 그대로 받는다. 소비자는 다음 helper로 VWorld tile 오류인지 구분한다:

```typescript
import { isVWorldTileError, redactVWorldUrl } from 'maplibre-vworld';

onError={(event) => {
  if (isVWorldTileError(event)) {
    const url = (event.error as VWorldResourceError)?.url;
    logger.warn('VWorld tile failed', redactVWorldUrl(url));
  } else {
    Sentry.captureException(event.error);
  }
}}
```

`redactVWorldUrl`은 URL의 `apiKey` 세그먼트를 `***`로 마스킹 — 로그/Sentry에 키가 새지 않도록.

## 빌드 / 배포

- `vite build` → `dist/maplibre-vworld-js.mjs` (ESM) + `.umd.js` (UMD) + `.css` + declaration files.
- `tsconfig.build.json`이 declaration emission을 `src/`로 한정.
- `react`, `react-dom`, `maplibre-gl`, `zod`는 rollup external — 소비자 graph에서 단일 사본.
- `dist/`는 커밋(ADR-5). GitHub dependency 소비자(`npm install digitie/maplibre-vworld-js`)가 별도 build 없이 import 가능.
- 작업자가 PR 머지 전 직접 `git diff --exit-code -- dist/`로 drift를 확인한다. GitHub Actions/CI는 사용하지 않는다(ADR-10).

## 테스트

- vitest + `@testing-library/react` + jsdom.
- `test/setup.ts`가 `maplibre-gl`을 vi.mock으로 완전 대체 — 실제 WebGL/네트워크 호출 없음.
- mock된 `Map`이 `setTimeout(callback, 0)`로 비동기 `load` 발화 → `await waitFor(...)` 패턴으로 검증.
- 새 MapLibre API를 호출하면 setup.ts mock에 method를 추가해야 한다. 누락 시 `TypeError: map.someMethod is not a function`.

## 호환성

- React 18, 19 모두 지원 (`>=18 <20`).
- MapLibre GL JS v5만 지원. v4 호환 보장 없음.
- zod v4 강제(ADR-6). v3는 미지원.
- Next.js App Router(`'use client'` 경계). Pages Router에서도 `next/dynamic({ ssr: false })` 없이 동작.
