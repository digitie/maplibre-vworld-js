# AGENTS.md

## 문서 언어 정책

이 저장소의 모든 Markdown 문서는 한글로 작성한다. 공식 API 필드명, 코드 식별자, 명령어, URL, MapLibre/React 공식 용어, 라이브러리 prop 이름처럼 그대로 보존해야 하는 값만 영어를 유지한다. `README.md`와 `AI_AGENT_GUIDE.md`(영문 사용자 대상)는 예외다.

## 역할

이 저장소(GitHub 이름 `maplibre-vworld-js`, npm 패키지 `maplibre-vworld`)는 한국 공간정보 오픈플랫폼 브이월드(VWorld)의 WMTS 기반 타일을 React + MapLibre GL JS 환경에서 사용할 수 있도록 묶어 둔 **범용 지도 라이브러리**다. 마커·팝업·레이어·클러스터링 같은 지도 primitive만 제공하고, 데이터 fetching/상태 관리/감사 로그/도메인 카테고리는 소비자 앱이 담당한다(ADR-7).

## 식별자 (혼동 방지)

| 항목 | 값 |
|------|----|
| GitHub 저장소 이름 | `maplibre-vworld-js` |
| npm 패키지 이름 | `maplibre-vworld` |
| import 경로 | `import { VWorldMap } from 'maplibre-vworld'` |
| 스타일 import | `import 'maplibre-vworld/style.css'` |
| peer dependency | `react`, `react-dom`, `maplibre-gl`, `zod` (v4) |
| 데이터 소스 | VWorld (`api.vworld.kr/req/wmts/...`) |

## 개발 환경 정책

PC 개발은 Windows 호스트에서 직접 진행한다. 본 저장소는 Node.js 패키지이므로 WSL 강제는 아니지만, `node_modules/`와 `dist/`는 NTFS에서 정상 동작한다. 단:

- **Puppeteer postinstall 비용 회피**: `PUPPETEER_SKIP_DOWNLOAD=1`로 설치한다. 헤드리스 브라우저 검증은 CI에서만 수행.
- **`dist/`는 커밋 대상**: `vite build` 산출물을 저장소에 포함한다(ADR-5). 빌드 후 `git diff --exit-code -- dist/`가 깨끗해야 한다.
- **`tsconfig.build.json`만 declaration emission**: `dev/`와 `test/` 타입 오류가 배포 산출물에 섞이지 않도록 `tsconfig.build.json`이 `src/`만 대상으로 한다.

작업 전에 반드시 다음을 읽는다:

1. `CLAUDE.md` — 현재 작업과 잔존 부채
2. `SKILL.md` — DO NOT 룰, 자주 묻는 작업, 도메인 어휘
3. `docs/architecture.md` — `MapStore` + `useSyncExternalStore` 구조
4. `docs/decisions.md` — ADR-1 ~ ADR-8
5. `docs/tasks.md` — T-NNN 백로그

## 지시 우선순위

1. 사용자 요청
2. 이 `AGENTS.md`
3. `SKILL.md`
4. `docs/architecture.md`, `docs/decisions.md`
5. `docs/tasks.md`, `docs/journal.md`, `README.md`
6. 기존 코드와 테스트
7. 최소한의, 되돌릴 수 있는 가정

## 절대 하지 말 것 (DO NOT)

`SKILL.md` §4와 동일하지만 핵심만 다시 적는다:

1. **`main` 직접 푸시 금지** — 반드시 feature 브랜치 + PR.
2. **도메인 특화 코드 추가 금지** — TripMate, kraddr 같은 특정 소비자 도메인 지식(카테고리 enum, 통화 단위, 색상 팔레트)을 라이브러리에 넣지 않는다(ADR-7).
3. **`dist/` 커밋 누락 금지** — `src/` 변경 후 `npm run build`를 하지 않으면 CI가 실패한다(ADR-5).
4. **`'use client'` 누락 금지** — DOM-touching 모듈은 모두 첫 줄에 `'use client'`. Next.js App Router에서 RSC로부터 직접 import할 수 있어야 한다.
5. **`useMemo` 미적용 prop 금지** — 배열/GeoJSON/`flyToOptions`처럼 deep-equal이 비싼 prop은 consumer가 memoize해야 한다는 가정을 깨지 않는다.
6. **`map.setTerrain()` 호출 금지** — VWorld는 Terrain-RGB를 제공하지 않는다.
7. **`onError` wrapper envelope 추가 금지** — raw MapLibre `ErrorEvent`를 그대로 노출한다(ADR-7). 카운트/임계치는 소비자 앱 책임.
8. **`semanticZoomThreshold` 외 새 zoom-driven re-render 금지** — `useMapSelector` 패턴으로 thresh-crossing만 re-render한다(ADR-8).
9. **`createContext` value를 매 render마다 새 object로 생성 금지** — store가 단일 source of truth(ADR-8).
10. **zod v3 코드 추가 금지** — peer + dev 모두 v4 고정(ADR-6).
11. **API 키 평문 커밋 금지** — `.env.local`은 권한 600, 로그에는 `redactVWorldUrl()` 사용. `dev/`의 hardcode도 절대 금지(과거 보안 사고).
12. **`map.isMoving()` 가드 없이 카메라 prop 적용 금지** — 사용자 제스처 중 강제 `flyTo`는 진동을 만든다. 대신 `pendingCameraRef`로 큐잉하고 `moveend`에서 재시도.

## 외부 의존성 사용 원칙

- `maplibre-gl`, `react`, `react-dom`, `zod`는 peer dependency. 소비자 graph에서 단일 사본을 강제하기 위해 `vite.config.ts`의 `rollupOptions.external`에 포함한다.
- `supercluster`, `use-supercluster`는 일반 dependency. 라이브러리 내부 클러스터링 구현이 직접 노출되지 않으므로 peer로 두지 않는다.
- VWorld URL 조립은 `src/vworld.ts`에 모아 두고, 소비자가 직접 URL을 만들지 않게 한다. 키 redaction(`redactVWorldUrl`)과 tile 오류 분류(`isVWorldTileError`)도 같은 모듈에서 export.

## 작업 후 체크리스트

- [ ] `npm run type-check` 통과
- [ ] `npm test` 통과
- [ ] `npm run build` 통과 (`dist/` 갱신 후 커밋)
- [ ] `git diff --exit-code -- dist/` 통과 (CI와 동일)
- [ ] `npm run pack:check` 통과
- [ ] `docs/journal.md`에 작업 항목 추가 (역시간순)
- [ ] `docs/tasks.md`의 T-NNN 상태 갱신
- [ ] 의사결정이 있었다면 `docs/decisions.md`에 ADR 추가
- [ ] 사용자 가시 변경이면 `CHANGELOG.md` 갱신
- [ ] public API 변경이면 `README.md`와 `AI_AGENT_GUIDE.md` 동기화

## 검증

```bash
PUPPETEER_SKIP_DOWNLOAD=1 npm ci
npm run type-check
npm test
npm run build
git diff --exit-code -- dist/
npm run pack:check
```
