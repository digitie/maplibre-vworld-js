# 개발 작업 일지 (Journal)

이 문서는 프로젝트의 진행 과정, 문제 해결 내역, 그리고 각 단계별 핵심 인사이트를 상세하게 기록하는 작업 일지입니다. 추후 개발자가 변경 사항을 추적하거나 새로운 인력(또는 AI 에이전트)이 프로젝트에 투입되었을 때 문맥(Context)을 빠르게 복구하기 위해 작성됩니다.

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
