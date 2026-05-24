<div align="center">
  <img src="https://img.shields.io/badge/MapLibre-0081F2?style=for-the-badge&logo=maplibre&logoColor=white" alt="MapLibre" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/VWorld-Korea-blue?style=for-the-badge" alt="VWorld" />
  <img src="https://img.shields.io/badge/Antigravity-2.0-8A2BE2?style=for-the-badge" alt="Antigravity 2.0" />
  <img src="https://img.shields.io/badge/Gemini-3.1_Pro-1A73E8?style=for-the-badge" alt="Gemini 3.1 Pro" />
  
  <h1>🗺️ MapLibre VWorld JS</h1>
  <p><strong>MapLibre GL JS를 활용하여 브이월드(VWorld) 지도를 렌더링하는 고성능 React 라이브러리</strong></p>
  <p><em>Built entirely by <b>Antigravity 2.0</b> powered by <b>Gemini 3.1 Pro</b></em></p>
</div>

<br />

`maplibre-vworld-js`는 GPU 가속(WebGL) 기반의 지도 렌더링 엔진인 **MapLibre GL JS**를 사용하여, 국토교통부 **VWorld**의 고해상도 지도를 React 환경에서 네이티브 앱처럼 부드럽게 렌더링할 수 있도록 돕는 프리미엄 라이브러리입니다.

## ✨ 주요 기능 (Features)

- 🚀 **순수 WebGL GPU 렌더링**: 기존 Canvas 기반 지도 대비 압도적으로 부드러운 60fps 렌더링 (Fractional Zoom 지원)
- 🎯 **100% 선언형(Declarative) React 설계**: `map.panTo()` 등의 명령형 API 없이 Props 조작만으로 완벽한 상태 동기화
- 🌌 **초고속 클러스터링 내장**: 10만 건 이상의 데이터를 즉시 병합하는 Viewport Culling 및 KDBush 알고리즘 탑재 (`MarkerClusterer`)
- 🎨 **커스텀 마커 지원**: React 노드(Tailwind CSS, SVG 애니메이션 등)를 지도 위에 직접 올릴 수 있는 Portal 컴포넌트 제공
- 🛡️ **타입 안정성 보장**: TypeScript로 작성되었으며, `zod` 기반의 좌표 유효성 검사 스키마 제공
- 🌐 **SSR 완벽 지원**: Next.js (App/Pages Router) 및 Vite 환경에서 충돌 없이 렌더링 가능

---

## 📦 설치 (Installation)

```bash
npm install maplibre-vworld maplibre-gl zod
# 또는
yarn add maplibre-vworld maplibre-gl zod
```

`react`, `react-dom`, `maplibre-gl`, `zod`는 peer dependency입니다. React 애플리케이션에는 보통 `react`/`react-dom`이 이미 있으므로, 지도 엔진과 검증 스키마만 함께 설치하면 됩니다. GitHub 의존성으로 설치하는 경우에도 저장소에 커밋된 `dist/` 산출물을 사용하므로, 소비자 프로젝트에서 별도 빌드 스크립트를 실행할 필요가 없습니다.

---

## 🚀 빠른 시작 (Quick Start)

### 기본 사용법 (Vite / CRA)

```tsx
import React from 'react';
import { VWorldMap, MakiMarker } from 'maplibre-vworld';
import 'maplibre-vworld/style.css';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <VWorldMap 
        // 환경 변수(.env)에서 API Key를 불러오는 것을 권장합니다.
        apiKey={import.meta.env.VITE_VWORLD_API_KEY} 
        layerType="Base" 
        center={[127.0246, 37.5326]} 
        zoom={14}
      >
        <MakiMarker 
          lngLat={[127.0246, 37.5326]} 
          icon="cafe" 
          color="#FF5722" 
          size="large" 
        />
      </VWorldMap>
    </div>
  );
}

export default App;
```

---

## 💻 Next.js (App Router) 통합 가이드

MapLibre GL JS는 브라우저의 WebGL 환경(`window` 및 `document`)에 의존하므로, Next.js 환경에서는 반드시 **클라이언트 사이드 동적 임포트(Dynamic Import)**를 사용하여 SSR을 비활성화해야 합니다.

```tsx
'use client';
import dynamic from 'next/dynamic';
import { LngLatSchema } from 'maplibre-vworld';
import 'maplibre-vworld/style.css';

// 🚨 SSR을 끄기 위해 dynamic import를 사용합니다.
const VWorldMap = dynamic(
  () => import('maplibre-vworld').then((mod) => mod.VWorldMap),
  { ssr: false, loading: () => <p>지도를 불러오는 중입니다...</p> }
);

const PlaceMarker = dynamic(
  () => import('maplibre-vworld').then((mod) => mod.PlaceMarker),
  { ssr: false }
);

export default function MapPage() {
  // 백엔드에서 받아온 좌표의 유효성을 Zod로 안전하게 검증
  const parsedCoord = LngLatSchema.safeParse([127.024, 37.532]);

  if (!parsedCoord.success) return <p>잘못된 좌표입니다!</p>;

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <VWorldMap apiKey={process.env.NEXT_PUBLIC_VWORLD_API_KEY}>
        <PlaceMarker 
          lngLat={parsedCoord.data} 
          title="내 위치" 
          description="대한민국 서울" 
        />
      </VWorldMap>
    </div>
  );
}
```

---

## 🔒 CORS 및 VWorld API 보안/도메인 에러 해결

VWorld 지도 타일(WMTS)을 요청할 때 브라우저 콘솔에 **CORS 에러** 또는 **403 Forbidden** 에러가 발생한다면 다음을 확인하세요.

1. **VWorld 개발자 센터 도메인 등록**: API Key를 발급받은 VWorld 개발자 센터에서 `허용 도메인`에 현재 개발 중인 로컬 주소(예: `http://localhost:5173` 또는 `http://127.0.0.1:5173`) 및 상용 배포 도메인을 정확히 입력해야 합니다. 도메인이 일치하지 않으면 VWorld 서버가 의도적으로 CORS 헤더를 내려주지 않거나 403 에러를 반환합니다.
2. **프록시 우회 (`transformRequest`)**: 사내망이나 특정 보안 정책으로 인해 브라우저에서 직접 외부 API 호출이 막혀 있는 경우, 프록시 서버를 통해 호출해야 합니다. 이때 `<VWorldMap>`의 `transformRequest` Prop을 사용하여 요청 URL을 가로채고 수정할 수 있습니다.

```tsx
<VWorldMap 
  apiKey={API_KEY}
  transformRequest={(url, resourceType) => {
    // VWorld API 요청을 로컬 프록시 서버로 우회
    if (url.includes('api.vworld.kr')) {
      return {
        url: url.replace('https://api.vworld.kr', '/api/vworld-proxy'),
        // 필요한 경우 인증 헤더 추가
        // headers: { 'Authorization': 'Bearer ...' }
      };
    }
    return { url };
  }}
>
```

---

## 📚 컴포넌트 API 레퍼런스

### 1. `<VWorldMap>`
지도를 렌더링하는 최상위 컨테이너입니다.
| 속성 (Prop) | 타입 (Type) | 기본값 (Default) | 설명 |
|---|---|---|---|
| `apiKey` | `string` | **필수** | 브이월드(VWorld)에서 발급받은 API Key |
| `layerType` | `VWorldLayerType` | `'Base'` | 지도 테마 (`Base`, `gray`, `midnight`, `Satellite`, `Hybrid`) |
| `center` | `[number, number]` | `[127.02, 37.53]` | 초기 카메라 중심 좌표 (경도, 위도) |
| `zoom` | `number` | `12` | 초기 줌 레벨 |
| `maxZoom` | `number` | `19` | 레이어별 상한과 함께 적용된다. `Satellite`/`Hybrid`는 VWorld 타일 한계에 맞춰 최대 z18까지만 요청한다. |

### 2. `<MarkerClusterer>`
만 개 이상의 마커를 그릴 때 필수적으로 사용해야 하는 고성능 클러스터링 엔진입니다. (화면 밖 마커 자동 제거 기능 포함)
| 속성 (Prop) | 타입 (Type) | 기본값 (Default) | 설명 |
|---|---|---|---|
| `points` | `ClusterPoint[]` | **필수** | 렌더링할 마커 데이터 객체 배열 |
| `radius` | `number` | `50` | 마커를 병합할 거리 반경 (픽셀) |
| `maxZoom` | `number` | `16` | 병합을 해제할 최대 줌 레벨 |
| `renderMarker` | `(point) => ReactNode` | **필수** | 개별 마커 렌더링 함수 |

### 3. `<PolygonArea>`
국립공원, 읍면동 등 폴리곤(다각형) 형태의 영역을 렌더링하고 클릭/호버 이벤트를 처리합니다.
| 속성 (Prop) | 타입 (Type) | 기본값 (Default) | 설명 |
|---|---|---|---|
| `id` | `string` | **필수** | 레이어 식별용 고유 ID |
| `data` | `GeoJSON \| string` | **필수** | GeoJSON Polygon/MultiPolygon 객체 또는 URL |
| `fillColor` | `string` | `'rgba(33, 150, 243, 0.4)'` | 영역 내부 색상 |
| `outlineColor` | `string` | `'#2196F3'` | 영역 테두리 색상 |
| `onClick` | `function` | `undefined` | 영역 클릭 이벤트 콜백 |
| `onMouseEnter` | `function` | `undefined` | 영역 마우스 진입 이벤트 콜백 |

### 4. `<RouteLine>`
복수의 좌표나 GeoJSON LineString 데이터를 받아 선(등산로, 트래킹 코스 등)을 그립니다.
| 속성 (Prop) | 타입 (Type) | 기본값 (Default) | 설명 |
|---|---|---|---|
| `id` | `string` | **필수** | 레이어 식별용 고유 ID |
| `coordinates` | `[number, number][]`| `undefined` | 연결할 좌표들의 배열 |
| `data` | `GeoJSON \| string` | `undefined` | GeoJSON LineString 객체 또는 URL |
| `color` | `string` | `'#2196F3'` | 선 색상 (Hex 코드) |
| `lineDasharray`| `number[]` | `undefined` | 점선 속성 (예: `[4, 4]`) |
| `onClick` | `function` | `undefined` | 선 클릭 이벤트 콜백 |

---

## 🤖 AI 에이전트 연동 가이드
이 라이브러리를 기반으로 Cursor, GitHub Copilot 등 AI에게 코드를 작성하게 할 때는, 프로젝트 루트 디렉토리에 있는 **[AGENTS.md](./AGENTS.md)** 및 **[AI_AGENT_GUIDE.md](./AI_AGENT_GUIDE.md)** 내용을 프롬프트에 제공해주세요. Race Condition이나 SSR 렌더링 충돌 없이 완벽한 코드를 자동 생성할 수 있습니다.

---

## 📄 라이선스 (License)
MIT License © 2026
