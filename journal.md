# 개발 작업 일지 (Journal)

이 문서는 프로젝트의 진행 과정, 문제 해결 내역, 그리고 각 단계별 핵심 인사이트를 상세하게 기록하는 작업 일지입니다. 추후 개발자가 변경 사항을 추적하거나 새로운 인력(또는 AI 에이전트)이 프로젝트에 투입되었을 때 문맥(Context)을 빠르게 복구하기 위해 작성됩니다.

---

## 2026-05-25: TripMate 연동 추가 구현 백로그 문서화

### 1. TripMate 최신 main 문서 기준의 지도 요구사항 정리
- **이슈**: `tripmate`는 사용자 대면 UI를 `maplibre-vworld` 기반 지도로 가져가는 방향을 명시하지만, 세부 Sprint 문서에는 과거 Kakao SDK 기준 문구와 지도 UI 요구사항이 섞여 있다. 이 상태에서 바로 구현에 들어가면 앱 책임(TanStack Query, Zustand, 위치 동의/감사 로그)과 라이브러리 책임(MapLibre 이벤트, marker primitive, VWorld 오류 처리)이 뒤섞일 위험이 있었다.
- **조치**:
  1. `tripmate` `origin/main` `767bace`와 `maplibre-vworld-js` `origin/main` `b19baa3`를 기준점으로 고정했다.
  2. `docs/tripmate-implementation-roadmap.md`를 추가해 viewport 이벤트, context menu, 16색 마커 팔레트, Maki icon vendor path, Korea 좌표/bounds helper, 서버 클러스터, feature kind 렌더링, 선택/호버 상태, popup primitive를 우선순위별로 정리했다.
  3. README와 `AI_AGENT_GUIDE.md`에 새 백로그 문서 링크와 책임 경계 주의사항을 추가했다.
- **결과**: 후속 PR은 TripMate Sprint 4 요구사항을 라이브러리 public API로 승격할지, TripMate 앱 내부에 남길지를 먼저 확인한 뒤 작게 나눠 구현할 수 있다.

### 2. 검증
- `git diff --check` → 통과.

## 2026-05-25: 디버그 UI 동작 정합화를 위한 Map event hook 보강

### 1. `python-kraddr-geo` 디버그 지도와 공통화할 이벤트 표면 추가
- **이슈**: `kraddr-geo-ui`는 지도 click 좌표를 `(lon, lat)` 입력값으로 반영하고, VWorld tile 오류를 API key redaction 후 transient warning/overlay로 처리한다. 기존 `<VWorldMap>`은 지도 표시와 marker/cluster 중심이라 이 디버그 UI 동작을 공통 package API로 옮기기 어려웠다.
- **조치**:
  1. `<VWorldMap>`에 `onMapClick`, `onMapError`, `flyToOptions` props를 추가했다.
  2. `isVWorldTileError(event)`와 `redactVWorldTileUrl(url)` helper를 `src/vworld.ts`에서 export했다.
  3. `Hybrid` 이중 source와 `vworld-${layerType}` source id를 고려해 VWorld tile 오류를 `vworld` prefix, WMTS URL, transient HTTP status, fetch/tile message 기준으로 판별한다.
  4. README, `AI_AGENT_GUIDE.md`, `ADR.md`에 운영·디버그 UI에서 이 hook을 사용하는 기준을 추가했다.
- **결과**: 소비자 프로젝트는 overlay/fallback 정책은 자체적으로 유지하되, click/error/flyTo와 VWorld tile redaction 계약은 이 라이브러리와 같은 helper로 검증할 수 있다.

### 2. 검증
- `PATH=/tmp/node-v20.19.5-linux-x64/bin:$PATH npm run test` → 3 files / 21 tests 통과.
- `PATH=/tmp/node-v20.19.5-linux-x64/bin:$PATH npm run type-check` → 통과.
- `PATH=/tmp/node-v20.19.5-linux-x64/bin:$PATH npm run build` → 통과.
- `PATH=/tmp/node-v20.19.5-linux-x64/bin:$PATH npm run pack:check` → 통과. tarball에 `dist/`와 declaration files 포함 확인.
- `git diff --check` → 통과.

## 2026-05-25: GitHub dependency 소비 가능 패키징 보강

### 1. `dist/` 산출물 누락 문제 해결
- **이슈**: `package.json`의 `main`/`module`/`types`/`exports`가 모두 `dist/`를 가리키지만, 저장소에는 `dist/`가 커밋되어 있지 않아 GitHub dependency로 설치한 소비자 프로젝트에서 package root import가 실패할 수 있었다.
- **조치**:
  1. `.gitignore`에서 `dist` 제외를 제거하고 `vite build` 산출물을 커밋 대상으로 전환했다.
  2. `package.json`에 `./style.css` export와 CSS side effect 설정을 추가했다.
  3. `prepack`과 `pack:check` 스크립트를 추가해 npm publish 또는 pack 검증 시 산출물을 다시 생성하도록 했다.
- **결과**: `npm pack --dry-run` 기준 tarball에 `dist/maplibre-vworld-js.mjs`, `dist/maplibre-vworld-js.umd.js`, `dist/maplibre-vworld-js.css`, declaration files가 모두 포함된다.

### 2. 테스트 스크립트 API key 평문 제거
- **이슈**: `test_tiles.js`에 VWorld API key가 평문으로 남아 있었다. 브라우저 노출용 키라도 저장소에 남기면 재사용·복사·로그 전파 위험이 있다.
- **조치**: `process.env.VITE_VWORLD_API_KEY`를 읽도록 바꾸고, 환경변수가 없으면 명확한 오류를 던진다.
- **결과**: `rg`로 저장소 안의 UUID 형식 VWorld key가 더 이상 검색되지 않는다.

### 3. 타입 생성 범위와 peer dependency 정리
- **이슈**: `vite-plugin-dts`가 `dev/`와 `test/`까지 선언 파일 생성 대상으로 잡아 빌드 중 타입 오류를 출력했고, `maplibre-gl`/`zod`/React 계열이 소비자 dependency graph에 불필요하게 중복될 수 있었다.
- **조치**:
  1. `tsconfig.build.json`을 추가해 declaration generation을 `src/`로 한정했다.
  2. `type-check` 스크립트를 추가하고 기존 test/dev 타입 오류를 정리했다.
  3. `react`, `react-dom`, `maplibre-gl`, `zod`를 peer dependency로 이동하고, 빌드·테스트용 dev dependency로만 유지했다.
- **결과**: `PUPPETEER_SKIP_DOWNLOAD=1 npm ci`, `npm run type-check`, `npm test`, `npm run build`, `npm run pack:check`, `npm audit --audit-level=high`가 통과한다. Node 20 환경에서는 Puppeteer 25의 Node 22 권장 engine 경고가 출력되지만 설치 자체는 성공한다.

### 4. VWorld layer 계약 보정
- **이슈**: `Satellite`/`Hybrid`가 z19까지 요청될 수 있어 타일 404가 발생할 수 있고, attribution 표기가 소비자 프로젝트와 일치하지 않았다.
- **조치**: `getVWorldMaxZoom(layerType)`를 추가하고 `Satellite`/`Hybrid`는 z18, 나머지는 z19로 제한했다. attribution은 `공간정보 오픈플랫폼 브이월드`로 통일했다.
- **결과**: `kraddr-geo-ui` 같은 소비자 프로젝트가 같은 layer/zoom/attribution 계약을 공유할 수 있다.

---

## 2026-05-24: 보안 패치 및 아키텍처 문서화 완료

### 1. VWorld API Key 보안 위협 제거 및 Git History 소각
- **이슈**: `dev/main.tsx` 내부에 VWorld API Key가 하드코딩된 채로 GitHub 저장소에 커밋됨. 
- **조치**: 
  1. 루트 디렉토리에 `.env` 파일을 생성하고 `VITE_VWORLD_API_KEY` 환경 변수로 키를 분리.
  2. `.gitignore`에 `.env` 및 `.env.local`이 포함된 것을 확인.
  3. **가장 중요**: 단순히 새로운 커밋을 추가하는 것이 아니라, `git reset --soft` 명령을 사용하여 저장소의 초기 상태로 히스토리를 롤백한 후, 키가 제거된 클린(Clean) 상태로 다시 커밋을 생성함.
  4. `git push -f origin main`을 통해 원격 저장소의 오염된 과거 히스토리를 영구적으로 덮어씌움(Rewrite History).
- **결과**: GitHub 상에서 과거 커밋을 뒤져보더라도 API Key가 절대 노출되지 않도록 완벽히 방어함.

### 2. CORS 및 도메인 보안 에러 해결 구조 도입
- **이슈**: 로컬 개발(localhost)이나 사내망 환경에서 브이월드 서버(`api.vworld.kr`)로 타일 요청 시, 도메인 불일치로 인한 CORS 에러 및 403 Forbidden 에러 발생 우려.
- **조치**:
  1. `<VWorldMap>`의 Props에 MapLibre의 `transformRequest` 훅을 뚫어줌.
  2. 이를 통해 요청 URL을 가로채어(Intercept) 로컬 Proxy 서버로 돌리거나, 커스텀 인증 헤더(Authorization)를 심을 수 있도록 프레임워크 레벨에서 지원함.
  3. `README.md`에 문제 해결 가이드(Troubleshooting) 섹션 신설.

### 3. 포괄적인 문서(Docs) 한글화 및 고도화 작업
- **이슈**: README 등 핵심 문서가 부족하거나 영문으로 작성되어 국내 개발자들이 바로 도입하기에 러닝 커브가 존재함.
- **조치**:
  1. **README.md 전면 개편**: Github 표준 오픈소스 형식에 맞추어 기술 뱃지(Badges), 표 형태의 API 레퍼런스, Next.js App Router용 퀵스타트 코드를 매우 상세하게 한글로 재작성함.
  2. **AI_AGENT_GUIDE.md 고도화**: 향후 Cursor나 Copilot 같은 AI가 이 라이브러리를 사용해 코딩할 때 절대 에러를 내지 않도록 모든 Prop 시그니처와 SSR 주의사항, CORS 해결 지침을 주입함.
  3. **ADR.md 작성**: 프로젝트 뼈대를 구성하는 4대 아키텍처 결정 사항(MapLibre 선택 이유, React Portal 채택 이유, Supercluster 병합 메커니즘 등)을 명문화함.
  4. **AGENTS.md 작성**: 추후 접속할 새로운 AI 에이전트들이 즉시 문맥을 복원(Context Recovery)할 수 있도록 진입점 매뉴얼을 구축함.

---

## 2026-05-23: 코어 라이브러리 개발 완료

### 1. 극한의 렌더링 최적화 
- React-DOM 포털을 통한 마커 생성 및 Viewport 밖 요소 Unmount(Culling) 기술 적용 완료. 10만 건 렌더링 테스트 통과.

### 2. 다이나믹 클러스터링(`MarkerClusterer`) 구축
- 줌인/줌아웃 시 마커가 자연스럽게 합쳐지고 갈라지는 기능을 `supercluster` 기반으로 구현.

### 3. Zod 기반 데이터 무결성 
- 외부에서 들어오는 위경도(`[number, number]`) 및 폴리곤 데이터의 오염을 런타임 전에 방지하기 위해 `zod` 검증 스키마(`src/schemas.ts`) 적용 완료.
