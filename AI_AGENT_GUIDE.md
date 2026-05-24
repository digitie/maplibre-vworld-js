# AI 에이전트 컨텍스트 가이드: MapLibre VWorld JS

이 문서는 AI 코딩 어시스턴트(Cursor, GitHub Copilot, ChatGPT, Claude 등)가 `maplibre-vworld` 라이브러리를 사용하여 코드를 작성할 때, 오류를 범하지 않고 완벽한 코드를 생성할 수 있도록 **컨텍스트(Context)**를 주입하기 위해 특별히 설계된 가이드입니다.

## 1. 아키텍처 개요
- **핵심 기술**: MapLibre GL JS + React 18+
- **목적**: 커스텀 마커, 클러스터링, 다각형 및 경로 렌더링을 포함하여 대한민국 브이월드(VWorld) 지도를 고성능으로 렌더링.
- **SSR 호환성**: Next.js (App/Pages Router) 및 Vite 지원.
  - **🚨 CRITICAL (매우 중요)**: MapLibre는 브라우저의 `window` 객체와 WebGL에 강하게 의존합니다. 이 라이브러리를 Next.js에서 사용할 때는 **반드시 지도 컴포넌트를 `next/dynamic`(`ssr: false`) 옵션으로 동적 임포트(Dynamic Import)** 해야 합니다. 그렇지 않으면 서버 사이드 렌더링 에러가 발생합니다.
  - 클라이언트 컴포넌트(`"use client"`) 내부에서만 마커나 폴리곤 관련 코드가 실행되도록 해야 합니다. SSR 시점에 `document`나 `window`에 접근하면 치명적인 에러가 발생합니다.
- **패키징/소비자 설치**: `dist/`는 GitHub dependency 소비자가 바로 import할 수 있도록 저장소에 커밋합니다. `vite-plugin-dts`는 `tsconfig.build.json`으로 `src/`만 선언 파일 생성 대상에 포함하며, `dev/`와 `test/` 타입 오류가 패키지 빌드에 섞이면 안 됩니다.
- **스타일 import**: 소비자 예제에는 `import 'maplibre-vworld/style.css';`를 포함해야 합니다. 이 CSS export에는 MapLibre 기본 CSS와 라이브러리 스타일 산출물이 들어 있습니다.
- **Git Push 규칙**: 작업 내역을 원격 저장소의 `main` 브랜치에 직접 푸시(Direct Push)하는 것은 엄격히 금지됩니다. 반드시 별도의 브랜치를 따서 작업하고 PR(Pull Request)을 통해 반영해야 합니다.

## 🧭 컴포넌트 사용 가이드 (Next.js 기준)
이 라이브러리는 엄격한 데이터 검증을 위해 Zod 스키마를 내장하여 제공합니다. API 페이로드나 날 것의 좌표 데이터를 지도 컴포넌트로 넘기기 전에, 반드시 이 스키마를 사용하여 검증(Validate)하세요.

```typescript
import { LngLatSchema, BasePointDataSchema } from 'maplibre-vworld';

// AI 지시사항: 백엔드에서 가져온 좌표를 사용하기 전에 반드시 검증할 것!
const parsedCoordinate = LngLatSchema.safeParse([127.024, 37.532]);
if (!parsedCoordinate.success) throw new Error("유효하지 않은 좌표입니다.");
```

## 3. Next.js 연동 예제 (Next.js 13+ App Router)
```tsx
'use client';
import dynamic from 'next/dynamic';
import 'maplibre-vworld/style.css';

// 🚨 AI 지시사항: 지도 컴포넌트는 무조건 ssr: false 옵션과 함께 dynamic import 할 것!
const VWorldMap = dynamic(
  () => import('maplibre-vworld').then(mod => mod.VWorldMap),
  { ssr: false, loading: () => <p>지도 로딩 중...</p> }
);
```

## 4. 포괄적 API 레퍼런스

### `<VWorldMap>`
MapLibre 인스턴스를 초기화하고 관리하는 최상위 기본 컨테이너입니다.

**속성(Props) 시그니처:**
```typescript
interface VWorldMapProps {
  apiKey: string; // 필수: VWorld API Key (환경변수에서 주입 권장)
  layerType?: 'Base' | 'gray' | 'midnight' | 'Hybrid' | 'Satellite'; // 기본값: 'Base'
  center?: [number, number]; // [경도(Lng), 위도(Lat)]. 기본값: [126.9780, 37.5665] (서울)
  zoom?: number; // 기본값: 13
  minZoom?: number; // 기본값: 6
  maxZoom?: number; // 기본값: 19
  children?: ReactNode; // 하위 요소 (마커, 클러스터 등)
  showNavigationControl?: boolean; // 기본값: true
  showGeolocateControl?: boolean; // 기본값: true
  showScaleControl?: boolean; // 기본값: true
  transformRequest?: (url: string, resourceType: string) => { url: string, headers?: any }; // CORS 우회용 프록시 훅
}
```

**AI 지시사항**: `Satellite`와 `Hybrid`는 VWorld 타일 한계에 맞춰 z18까지만 요청해야 합니다. `Base`, `gray`, `midnight`는 z19까지 사용할 수 있습니다. 유틸 함수 `getVWorldMaxZoom(layerType)`를 사용해 지도 옵션과 style source의 `maxzoom`을 일관되게 맞추세요.

**🚨 AI 지시사항 (CORS / 보안 에러 처리)**:
- 사용자가 `CORS` 또는 `403 Forbidden` 에러를 겪는다고 보고하면, 가장 먼저 **"VWorld 개발자 센터에 현재 로컬 주소(예: localhost:5173)가 도메인으로 등록되어 있는지"** 확인하라고 안내하세요. VWorld는 등록되지 않은 도메인에 대해 의도적으로 CORS 헤더를 제거합니다.
- 사내 보안망 등으로 인해 프록시 서버 우회가 필요하다면, `<VWorldMap>`의 `transformRequest` Prop을 활용하여 `api.vworld.kr`로 향하는 요청을 로컬 프록시(예: `/api/vworld`)로 라우팅하는 코드를 제공하세요.

### `<MarkerClusterer>`
화면 밖의 요소를 제거(Viewport Culling)하여 극한의 렌더링 성능을 내는 클러스터 컴포넌트입니다. 수천 개의 `<Marker>` 엘리먼트를 직접 렌더링하는 대신 **항상 이 컴포넌트를 사용**하세요.

**속성(Props) 시그니처:**
```typescript
interface MarkerClustererProps {
  points: Array<{ id: string | number, lngLat: [number, number], [key: string]: any }>;
  renderMarker: (point: any) => React.ReactNode;
  renderCluster?: (cluster: any, pointCount: number) => React.ReactNode;
  radius?: number; // 클러스터링 반경 (픽셀). 기본값: 50
  maxZoom?: number; // 클러스터링이 완전히 풀리는 최대 줌 레벨. 기본값: 16
}
```
**AI 지시사항**: `MarkerClusterer`는 화면을 벗어난 마커를 DOM에서 자동으로 제거합니다. 클러스터링 기능 자체를 원하지 않더라도(`radius={0}`), 대량의 데이터셋을 다룰 때는 성능 최적화(Culling)를 위해 반드시 이 컴포넌트를 사용해야 합니다.

### `<RouteLine>`
GeoJSON 데이터 규격을 사용하여 다수의 `[경도, 위도]` 좌표를 연결하는 선을 그립니다.

**속성(Props) 시그니처:**
```typescript
interface RouteLineProps {
  id: string; // 필수: 경로선의 고유 ID
  coordinates: [number, number][]; // LngLat 튜플의 배열
  color?: string; // Hex 컬러 코드. 기본값: '#2196F3'
  lineWidth?: number; // 기본값: 4
  lineDasharray?: number[]; // 점선 표현 시 사용 (예: [4, 4])
}
```
**🚨 AI 지시사항**: `coordinates` 또는 `lineDasharray` 배열을 JSX 태그 내부에 인라인(Inline)으로 절대 작성하지 마세요 (예: `coordinates={[[1,2], [3,4]]}`). React의 렌더링 라이프사이클과 MapLibre 내부의 Style Mutation 충돌로 인해 무한 리렌더링이 발생하여 선이 투명해지거나 렌더링 엔진 버그가 발생할 수 있습니다. **배열은 항상 컴포넌트 외부에 상수로 정의하거나 `useMemo`를 사용하여 메모이제이션해야 합니다!**

### `<MakiMarker>`
Mapbox의 Maki 아이콘을 사용하며, CSS 마스크 기법을 통해 동적으로 색상을 변환합니다.

**속성(Props) 시그니처:**
```typescript
interface MakiMarkerProps {
  lngLat: [number, number];
  icon?: string; // Maki 아이콘 이름 (예: 'cafe', 'restaurant', 'museum'). 기본값: 'marker'
  color?: string; // Hex 컬러 코드. 기본값: '#FF5722'
  size?: 'small' | 'medium' | 'large'; // 기본값: 'medium'
  label?: string; // 마우스를 올렸을 때 보여줄 툴팁 텍스트
  onClick?: () => void;
}
```

### `<RoutePointMarker>`
경유지나 목적지를 표시하기 위한 번호 매기기 또는 알파벳 마커입니다.

**속성(Props) 시그니처:**
```typescript
interface RoutePointMarkerProps {
  lngLat: [number, number];
  label: string | number; // 표시할 숫자 또는 문자 (예: "1", "A")
  color?: string; // Hex 컬러 코드. 기본값: '#4CAF50'
}
```

## 5. 알려진 제약 사항 및 경고
- **DOM 주입 금지**: MapLibre의 기본 `addLayer` 내부에 표준 `HTML` 엘리먼트를 직접 주입하지 마세요. 항상 제공된 React 컴포넌트(`<Marker>`, `<PlaceMarker>`)를 사용해야 합니다. 이 컴포넌트들은 `createPortal`을 통해 React DOM 트리와 MapLibre 엘리먼트를 안전하게 매핑합니다.
- **Race Condition 방어**: 여러 개의 `<RouteLine>` 컴포넌트를 빠르게 렌더링/언마운트 할 때 주의하세요. 라이브러리가 내부적으로 MapLibre의 `getStyle()`을 통해 Race Condition을 막아주긴 하지만, 비정상적으로 빠른 언마운트 핑퐁은 메모리 누수를 유발할 수 있습니다.
- **VWorld 지형 제약**: VWorld API는 Mapbox Terrain RGB와 동일한 방식의 3D 지형(Terrain) 데이터를 원네이티브로 완벽 지원하지 않습니다. `map.setTerrain()`을 임의로 호출하지 마세요.
