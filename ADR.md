# Architecture Decision Records (ADR)

이 문서는 `maplibre-vworld-js` 프로젝트의 핵심적인 아키텍처 결정 사항과 그 이유를 기록합니다.

## ADR 1: 렌더링 엔진으로 MapLibre GL JS 선택
- **배경**: 브이월드(VWorld) 지도를 렌더링할 때 기존 Canvas 2D 기반 엔진(예: OpenLayers 과거 버전, Kakao Maps)은 수천 개의 마커나 복잡한 폴리곤을 그릴 때 심각한 프레임 드랍(Lag)이 발생합니다.
- **결정**: GPU 하드웨어 가속(WebGL)을 완벽히 지원하고, 라이선스 이슈가 없는(오픈소스) **MapLibre GL JS**를 코어 렌더링 엔진으로 채택했습니다.
- **결과**: 네이티브 모바일 앱과 동일한 60fps의 부드러운 렌더링(Fractional Zoom)과 3D 피치 회전이 가능해졌습니다.

## ADR 2: React 통합 방식으로 `React.createPortal` 채택
- **배경**: MapLibre 내부에 커스텀 HTML 마커를 삽입할 때, 단순 문자열(HTML String)을 주입하면 React의 상태(State)나 라이프사이클과 동기화되지 않아 업데이트가 불가능해집니다.
- **결정**: `React.createPortal`을 사용하여, React가 렌더링하는 Virtual DOM 트리를 MapLibre가 생성한 물리적 마커 DOM 노드(`HTMLDivElement`) 속으로 직접 쏴주도록(Teleport) 설계했습니다.
- **결과**: 개발자는 `<Marker>` 컴포넌트 내부에 Tailwind CSS, SVG, Framer Motion 등 모든 종류의 최신 React 생태계를 제약 없이 자유롭게 사용할 수 있게 되었습니다.

## ADR 3: 대용량 마커 렌더링을 위한 `supercluster` 및 Viewport Culling 적용
- **배경**: DOM 노드는 브라우저 메모리를 가장 많이 잡아먹는 요소입니다. 화면 밖에 있는 10만 개의 마커를 모두 DOM에 유지하면 브라우저가 즉각 다운(Crash)됩니다.
- **결정**: KDBush 기반 알고리즘인 `supercluster` 라이브러리를 내장하여 데이터를 메모리 상에서 초고속으로 병합합니다. 또한 현재 지도의 영역(Bounds)을 계산하여, **화면 밖에 위치한 마커는 즉시 DOM 트리에서 마운트 해제(Unmount)**하는 Culling 기법을 자체 구현했습니다.
- **결과**: 10만 개가 넘는 부동산/배달 좌표 데이터를 불러와도 브라우저 메모리 사용량이 극도로 낮게 유지되며 성능 저하가 발생하지 않습니다.

## ADR 4: CORS 및 도메인 보안 제약 우회를 위한 `transformRequest` 구조 탑재
- **배경**: 브이월드(api.vworld.kr)는 등록되지 않은 도메인(Localhost, 사내망 등)의 요청에 대해 403 에러나 CORS 헤더 드랍으로 접근을 차단합니다.
- **결정**: 최상위 `<VWorldMap>` 컴포넌트 Props에 `transformRequest`를 뚫어두어, 타일이나 외부 리소스를 Fetch하기 직전에 URL을 가로채어(Intercept) 로컬 프록시 주소로 변환하거나 인증 헤더를 강제 주입할 수 있도록 설계했습니다.
- **결과**: 폐쇄망이나 깐깐한 보안 정책을 가진 B2B 환경에서도 유연하게 프록시 서버를 경유하여 지도를 띄울 수 있게 되었습니다.

## ADR 5: GitHub 의존성 소비자를 위해 `dist/` 산출물을 커밋한다
- **배경**: `maplibre-vworld`를 npm registry 배포 전 GitHub dependency로 설치하는 소비자 프로젝트가 있다. `package.json`의 `exports`는 `dist/`를 가리키는데 저장소에 `dist/`가 없으면, 소비자 `npm install` 또는 Next.js build가 package root import 단계에서 실패한다. `prepare` 스크립트로 GitHub 설치 시 빌드하는 방식은 소비자 설치 중 dev dependency 설치와 Puppeteer postinstall 비용을 유발한다.
- **결정**: `dist/`를 `.gitignore`에서 제거하고, `vite build` 산출물(`mjs`, `umd`, CSS, declaration files)을 저장소에 커밋한다. npm publish 전에는 `prepack`으로 다시 빌드하되, GitHub dependency 소비자는 커밋된 `dist/`만으로 import할 수 있게 한다.
- **결과**: 소비자는 별도 build step 없이 `import { VWorldMap } from "maplibre-vworld"`와 `import "maplibre-vworld/style.css"`를 사용할 수 있다. declaration generation은 `tsconfig.build.json`으로 `src/`만 대상으로 삼아 `dev/`와 `test/` 타입 오류가 배포 산출물에 섞이지 않도록 한다.
- **주의**: `react`, `react-dom`, `maplibre-gl`, `zod`는 peer dependency로 둔다. 특히 `zod`는 현재 `^3.25.76` 계열 declaration을 기준으로 빌드하므로, 소비자 프로젝트의 중복 zod 설치를 막기 위해 runtime dependency로 끌어오지 않는다.
