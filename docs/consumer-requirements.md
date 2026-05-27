# 소비자 앱 요구사항과 예제

본 문서는 TripMate와 tour-map 계열 소비자 앱이 `maplibre-vworld`에 기대하는 지도 기능을 정리한다. 2026-05-27 기준으로 이 문서는 **요구사항과 예제만** 추가하며, public API나 런타임 동작은 아직 바꾸지 않는다.

## 범위

- 라이브러리는 계속 범용 지도 primitive만 제공한다(ADR-7). TripMate나 tour-map의 카테고리 enum, 색상 팔레트, 통화 단위, API 응답 셰입은 소비자 앱에 둔다.
- 아래 예제 중 "예정 API"로 표시한 코드는 구현 방향을 고정하기 위한 예시다. 실제 사용 전에는 해당 T-NNN 구현 작업이 완료되어야 한다.
- 사람과 AI agent가 같은 기준으로 작업할 수 있도록 사용자 이야기, 수용 기준, 예제 코드를 함께 둔다.

## 요구사항 요약

| ID | 요구사항 | 상태 | 후속 작업 |
|----|----------|------|-----------|
| R-001 | lazy loading 지원 | 문서화 완료, 구현 필요 | T-026 |
| R-002 | 마커 클릭과 지도 클릭을 구분하는 context 지원 | 문서화 완료, 구현 필요 | T-027 |
| R-003 | 지원되지 않는 타일/zoom/layer에 대한 대체 타일 작성 | 문서화 완료, 구현 필요 | T-028 |
| R-004 | CI/CD 활성화 검토 | 문서화 완료, ADR-10 재검토 필요 | T-029 |
| R-005 | TripMate와 tour-map 요구사항을 범용 예제로 정리 | 완료 | T-024 |

## 공통 원칙

- 첫 번째 콜백 인자는 가능한 한 raw MapLibre 이벤트를 유지한다. 추가 정보가 필요하면 두 번째 인자로 context를 붙이는 방향을 우선 검토한다.
- zoom-driven UI는 `semanticZoomThreshold`와 `useMapSelector` 패턴을 넘어서 전체 마커 트리를 재렌더하지 않는다.
- 대형 배열, GeoJSON, `flyToOptions`는 소비자 앱이 `useMemo`나 stable ref로 보관한다는 전제를 유지한다.
- VWorld API key는 어떤 예제에도 평문으로 쓰지 않는다. 로그 예시는 항상 `redactVWorldUrl()`을 통과한다.
- 예제는 TripMate와 tour-map을 이름으로 언급하되, 라이브러리 내부에 도메인 지식을 넣지 않는 방식으로 작성한다.

## R-001: Lazy Loading

### 배경

TripMate의 여행 상세 화면과 tour-map 디버그 UI는 지도 외에도 일정표, 상세 패널, provider sync 상태, SQL EXPLAIN 같은 무거운 UI가 함께 올라온다. 첫 viewport에 지도가 보이지 않는 경우에도 MapLibre 인스턴스와 VWorld 타일 요청을 즉시 만들면 초기 렌더 비용과 API 요청이 불필요하게 발생한다.

### 수용 기준

- `lazy`가 켜진 지도는 컨테이너가 지정된 영역에 들어오기 전까지 MapLibre 인스턴스를 만들지 않는다.
- lazy 대기 중에는 `loadingSkeleton` 또는 `lazyFallback`만 렌더링한다.
- 한 번 초기화된 지도는 스크롤로 다시 화면 밖에 나가도 기본적으로 제거하지 않는다. 제거 정책이 필요하면 별도 prop으로 명시한다.
- SSR 환경에서 `IntersectionObserver`가 없어도 안전해야 한다. 이 경우 즉시 초기화 또는 fallback 렌더 중 하나를 명시적으로 선택한다.
- lazy 상태에서도 `apiKey` 누락, `fallback`, `onError`, `transformRequest` 계약은 기존과 동일하다.

### 예정 API 예시

```tsx
<VWorldMap
  apiKey={vworldKey}
  center={[127.024, 37.532]}
  zoom={13}
  lazy
  lazyRootMargin="360px"
  loadingSkeleton={<MapSkeleton label="지도를 준비하는 중" />}
>
  {features.map((feature) => (
    <PlaceMarker
      key={feature.id}
      lngLat={feature.lngLat}
      title={feature.name}
    />
  ))}
</VWorldMap>
```

TripMate 화면에서는 지도 탭이 열릴 때만 실제 타일 요청을 시작한다.

```tsx
function TripWorkspaceMap({ activeTab, features }: Props) {
  return (
    <VWorldMap
      apiKey={process.env.NEXT_PUBLIC_VWORLD_API_KEY!}
      center={features.initialCenter}
      zoom={12}
      lazy={activeTab !== 'map' ? 'manual' : true}
      lazyEnabled={activeTab === 'map'}
      loadingSkeleton={<TripMapSkeleton />}
    >
      <ClusterLayer points={features.points} renderMarker={renderFeatureMarker} />
    </VWorldMap>
  );
}
```

tour-map 디버그 UI에서는 목록과 상세 패널이 먼저 보이고, 지도 패널이 펼쳐질 때만 초기화한다.

```tsx
<DebugFeatureMapPanel collapsed={mapCollapsed}>
  <VWorldMap
    apiKey={vworldKey}
    center={debugCenter}
    zoom={10}
    lazy="manual"
    lazyEnabled={!mapCollapsed}
    loadingSkeleton={<DebugMapSkeleton />}
  />
</DebugFeatureMapPanel>
```

## R-002: 클릭 Context

### 배경

TripMate는 지도 빈 곳 클릭 시 선택을 해제하고, 마커 클릭 시 장소 상세를 열어야 한다. 현재처럼 지도와 마커가 각각 raw 이벤트만 받으면 마커 클릭이 지도 클릭으로 이어지는지 소비자 앱이 직접 방어해야 한다. tour-map 디버그 UI도 feature 마커, 클러스터, polygon, 빈 지도 클릭을 구분해야 상세 패널과 bbox 검색이 엉키지 않는다.

### 수용 기준

- 지도 클릭, 마커 클릭, 팝업 클릭, 클러스터 클릭을 구분할 수 있어야 한다.
- 기존 콜백의 첫 번째 인자는 raw MapLibre 또는 DOM 이벤트를 유지한다.
- 추가 context는 두 번째 인자로 전달하는 비파괴 확장을 우선한다.
- `context.source === 'map'`인 경우에만 빈 지도 클릭으로 간주한다.
- context에는 앱이 직접 넘긴 `interactionId` 또는 `featureId`를 보존할 수 있어야 한다.
- 마커 클릭 후 지도 클릭이 이어지는 경우에도 소비자 앱이 `setSelected(null)`을 잘못 호출하지 않아야 한다.

### 예정 API 예시

```tsx
type MapInteractionSource = 'map' | 'marker' | 'popup' | 'cluster' | 'layer';

interface MapInteractionContext {
  source: MapInteractionSource;
  interactionId?: string;
  lngLat?: [number, number];
  defaultPrevented: boolean;
}
```

```tsx
<VWorldMap
  apiKey={key}
  center={center}
  onClick={(event, context) => {
    if (context.source !== 'map') return;
    clearSelection();
  }}
>
  {features.map((feature) => (
    <PlaceMarker
      key={feature.id}
      interactionId={feature.id}
      lngLat={feature.lngLat}
      title={feature.name}
      onClick={(event, context) => {
        selectFeature(context.interactionId ?? feature.id);
      }}
    />
  ))}
</VWorldMap>
```

현재 버전에서의 임시 패턴은 소비자 앱이 suppression ref를 직접 두는 방식이다. 구현 완료 전까지 예제 코드에서만 사용한다.

```tsx
const suppressNextMapClickRef = useRef(false);

<VWorldMap
  apiKey={key}
  center={center}
  onClick={() => {
    if (suppressNextMapClickRef.current) {
      suppressNextMapClickRef.current = false;
      return;
    }
    clearSelection();
  }}
>
  <Marker
    lngLat={lngLat}
    onClick={() => {
      suppressNextMapClickRef.current = true;
      openDetail();
    }}
  />
</VWorldMap>
```

## R-003: 지원되지 않는 타일 대체

### 배경

VWorld는 layer별 지원 zoom 범위가 다르다. `Satellite`와 `Hybrid`는 z18, `Base`/`gray`/`midnight`는 z19가 현재 상한이다. 잘못된 layer, 너무 깊은 zoom, 일시적 provider 오류가 섞이면 사용자는 회색 빈 지도만 보게 된다. 금지 아이콘이 표시되더라도 전체 화면이 깨진 느낌이 들지 않도록 적절한 목업 이미지가 필요하다.

### 수용 기준

- 지원되지 않는 타일은 재시도 폭주를 만들지 않는다.
- 대체 이미지는 256x256 기준으로 반복 배치되어도 어색하지 않은 중립적인 지도 목업이어야 한다.
- 중앙에는 작은 금지 아이콘과 짧은 문구를 둘 수 있지만, 실제 지도처럼 오인될 정도의 상세 도로/지형은 넣지 않는다.
- API key, 요청 URL, provider 내부 오류 메시지는 이미지나 DOM에 직접 노출하지 않는다.
- `isVWorldTileError()`와 `redactVWorldUrl()`을 사용해 로깅한다.
- layer/zoom의 정적 상한은 `getVWorldMaxZoom(layerType)`과 일치해야 한다. T-019가 완료되면 `getCapabilities` 기반 동적 검증과 연결한다.

### 예정 API 예시

```tsx
<VWorldMap
  apiKey={key}
  center={center}
  zoom={19}
  layerType="Hybrid"
  unsupportedTileFallback={{
    imageUrl: '/maplibre-vworld/unsupported-tile.png',
    label: '지원하지 않는 타일',
  }}
  onError={(event) => {
    if (isVWorldTileError(event)) {
      const url = (event.error as VWorldResourceError | undefined)?.url;
      logger.warn('VWorld tile failed', { url: redactVWorldUrl(url) });
    }
  }}
/>
```

대체 이미지 디자인 가이드:

- 배경: 밝은 회색 또는 낮은 대비의 격자.
- 중심 요소: 24px 안팎의 금지 아이콘.
- 문구: `지원하지 않는 타일` 또는 `Tile unavailable`.
- 반복 타일 경계가 보이지 않도록 가장자리는 단색에 가깝게 유지.
- 다크 모드 지도에서도 튀지 않도록 `opacity`나 별도 dark asset을 검토.

## R-004: CI/CD 활성화 검토

### 배경

현재 ADR-10은 GitHub Actions/CI/CD 비사용을 결정한다. 새 요구사항의 "CI/CD 활성화"는 ADR-10과 충돌하므로, 구현 전 결정 기록을 먼저 갱신해야 한다. 문서 단계에서는 실행할 게이트와 금지 사항만 명확히 둔다.

### 수용 기준

- CI/CD를 되살릴 경우 ADR-10을 `superseded by ADR-XXX`로 표시하거나, 특정 범위만 예외로 허용하는 새 ADR을 추가한다.
- 최소 게이트는 로컬과 동일하다: `npm run type-check`, `npm test`, `npm run build`, `git diff --exit-code -- dist/`, `npm run pack:check`.
- `PUPPETEER_SKIP_DOWNLOAD=1`을 설정해 postinstall 비용을 막는다.
- VWorld API key가 필요한 브라우저 실타일 검증은 기본 CI에 넣지 않는다. 키가 필요한 검증은 수동 또는 보호된 환경에서만 실행한다.
- `dist/` drift가 생기면 실패해야 한다.

### 예정 workflow 예시

```yaml
name: local-quality-gate

on:
  pull_request:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    env:
      PUPPETEER_SKIP_DOWNLOAD: '1'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run type-check
      - run: npm test
      - run: npm run build
      - run: git diff --exit-code -- dist/
      - run: npm run pack:check
```

## TripMate 소비자 예제

TripMate는 여행 일정, 장소 후보, 날씨, 가격, 공지, 사용자 위치를 한 화면에 섞는다. 라이브러리 사용 시 지도 primitive는 유지하고, 도메인 매핑은 TripMate 내부 adapter에 둔다.

아래 코드는 R-001/R-002 구현 후의 목표 예시다. 현재 버전에서 그대로 복사하면 아직 존재하지 않는 prop이 포함된다.

```tsx
function TripMateMap({ features, selectedId, onSelect }: Props) {
  const points = useMemo(
    () => features.map((feature) => ({
      id: feature.id,
      lngLat: [feature.coord.longitude, feature.coord.latitude] as [number, number],
      properties: feature,
    })),
    [features],
  );

  return (
    <VWorldMap
      apiKey={process.env.NEXT_PUBLIC_VWORLD_API_KEY!}
      center={computeInitialCenter(features)}
      zoom={12}
      semanticZoomThreshold={12}
      onMoveEnd={(event) => updateViewport(event.target.getBounds())}
      onClick={(_event, context) => {
        if (context?.source === 'map') onSelect(null);
      }}
      lazy
    >
      <ClusterLayer
        points={points}
        generateId
        renderMarker={(point) => (
          <PlaceMarker
            interactionId={point.id}
            lngLat={point.lngLat}
            title={point.properties.name}
            selected={selectedId === point.id}
            onClick={() => onSelect(point.id)}
          />
        )}
      />
    </VWorldMap>
  );
}
```

주의:

- `MARKER_PALETTE`, category → icon 매핑, 가격 단위, 사용자 권한은 TripMate 내부에 둔다.
- `features`, `points`, GeoJSON은 반드시 memoize한다.
- 빈 지도 클릭으로 선택을 해제하는 코드는 R-002 구현 전까지 임시 suppression ref를 사용한다.

## tour-map 소비자 예제

tour-map 디버그 UI는 feature ingestion 결과와 provider 상태를 확인하는 내부 도구다. 10만 건 이상의 feature를 빠르게 훑어야 하므로 lazy loading, 클러스터링, bbox fetch, 오류 타일 fallback이 중요하다.

아래 코드는 R-001/R-003 구현 후의 목표 예시다. 현재 버전에서 사용하려면 `lazy`, `unsupportedTileFallback`, `interactionId` 같은 예정 prop을 제거해야 한다.

```tsx
function TourMapDebugMap({ apiBaseUrl, vworldKey }: Props) {
  const [viewport, setViewport] = useState<Viewport | null>(null);
  const { data } = useFeaturesInBounds(apiBaseUrl, viewport);

  const points = useMemo(
    () => (data?.features ?? []).map((feature) => ({
      id: feature.feature_id,
      lngLat: [feature.coord.lon, feature.coord.lat] as [number, number],
      properties: feature,
    })),
    [data],
  );

  return (
    <VWorldMap
      apiKey={vworldKey}
      center={[127.8, 36.4]}
      zoom={7}
      lazy
      lazyRootMargin="480px"
      unsupportedTileFallback={{ imageUrl: '/unsupported-tile.png' }}
      onMoveEnd={(event) => setViewport(boundsToViewport(event.target.getBounds()))}
    >
      <ClusterLayer
        points={points}
        radius={60}
        maxZoom={15}
        renderMarker={(point) => (
          <MakiMarker
            interactionId={point.id}
            lngLat={point.lngLat}
            icon={resolveMakiIcon(point.properties.category_code)}
            onClick={() => openFeaturePanel(point.id)}
          />
        )}
      />
    </VWorldMap>
  );
}
```

주의:

- tour-map의 provider DTO와 category tree는 라이브러리로 가져오지 않는다.
- 디버그 UI가 내부망 전용이어도 VWorld API key는 `NEXT_PUBLIC_*` 환경변수와 referrer 제한으로 관리한다.
- 실타일 검증이 필요하면 로컬 smoke test로 분리하고 기본 단위 테스트에는 네트워크를 넣지 않는다.

## 구현 순서 제안

1. R-002 클릭 context: TripMate 선택/해제 UX에 직접 영향을 주며 API 표면이 작다.
2. R-001 lazy loading: 초기 렌더 비용과 타일 요청량을 줄인다.
3. R-003 지원되지 않는 타일 fallback: VWorld 상한과 T-019 동적 검증에 연결한다.
4. R-004 CI/CD 활성화: ADR-10을 먼저 재검토한 뒤 workflow를 추가한다.
