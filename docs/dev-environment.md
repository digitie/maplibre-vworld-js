# 개발 환경

본 문서는 `maplibre-vworld-js` 로컬 개발 환경 셋업과 자주 마주치는 환경 문제를 정리한다. 빌드/테스트의 일반 사용법은 `SKILL.md` §2를 참고.

## 요구 사항

| 항목 | 버전 / 설정 |
|------|-------------|
| Node.js | 20 LTS |
| npm | Node 20에 동봉된 버전 (npm 10) |
| OS | Windows / macOS / Linux 모두 동작. 본 저장소는 Windows 호스트 기준 경로 표기 |
| 디스크 | `node_modules/` 약 800MB, `dist/` 약 200KB |

Node 20 사용을 권장한다. 다른 버전에서 동작은 하지만 보장 범위 밖이다. 본 저장소는 GitHub Actions/CI를 사용하지 않으므로(ADR-10) 모든 품질 게이트는 작업자가 PR 머지 전 로컬에서 직접 실행한다.

## 빠른 시작

```bash
cd F:\dev\maplibre-vworld-js
PUPPETEER_SKIP_DOWNLOAD=1 npm ci
cp dev/.env.example .env.local      # 필요 시
$EDITOR .env.local                  # VITE_VWORLD_API_KEY=... 채우기
npm run dev                         # http://localhost:5173
```

## 에이전트 worktree + CodeGraph

여러 AI 에이전트가 같은 저장소를 번갈아 작업하면 브랜치 전환, 캐시, 인덱스 상태가 서로 충돌한다. 본 저장소는 에이전트별 고정 worktree를 두고, 작업마다 해당 worktree 안에서 브랜치만 새로 딴다(ADR-12).

| 에이전트 | worktree 디렉토리 |
|----------|-------------------|
| ChatGPT Codex | `F:\dev\geo-codex` |
| Claude Code | `F:\dev\geo-claude` |
| Google Antigravity 2.0 | `F:\dev\geo-antigravity` |

최초 setup:

```bash
cd F:\dev\maplibre-vworld-js
git fetch
git worktree add ../geo-codex main

cd ../geo-codex
PUPPETEER_SKIP_DOWNLOAD=1 npm ci
codegraph init -i
```

작업 사이클:

```bash
cd F:\dev\geo-codex
git fetch
git switch -c agent/codex-next main

# .codegraph/가 이미 있으면 재초기화하지 않는다.
codegraph sync

# <작업 / commit / PR / merge>
```

`main` 브랜치는 원본 checkout(`F:\dev\maplibre-vworld-js`)에 고정해 둔다. worktree에서 직접 `main`으로 전환하지 않고, 최신 `main`을 기준으로 작업 브랜치만 새로 만든다.

원칙:

- `.codegraph/`는 worktree마다 1회만 만든다. 이후에는 `codegraph sync`로 유지한다.
- `.codegraph/`는 로컬 인덱스이므로 git에 커밋하지 않는다.
- CodeGraph는 컨텍스트 탐색 도구이지 품질 게이트가 아니다. `npm run type-check`, `npm test`, `npm run build`를 대체하지 않는다.
- MCP 서버는 프로젝트 루트의 `.codex/config.toml`에 등록한다. 현재 CLI 기준으로 `npx -y @colbymchenry/codegraph serve --mcp`를 사용한다.

## 환경변수

### `VITE_VWORLD_API_KEY` (dev 서버 / 테스트 스크립트)

`dev/main.tsx`와 `test_tiles.js`(deleted in PR #14)가 사용. `.env.local`에만 보관하고 git에 커밋하지 않는다.

```bash
# .env.local
VITE_VWORLD_API_KEY=your-actual-key-here
```

### `PUPPETEER_SKIP_DOWNLOAD=1` (설치)

Puppeteer는 transitive devDependency로 들어와 있다. 기본값은 설치 시 헤드리스 Chromium을 다운로드(약 200MB). 로컬 개발에서는 거의 사용하지 않으므로 환경변수로 건너뛴다.

```bash
PUPPETEER_SKIP_DOWNLOAD=1 npm ci
```

PowerShell:
```powershell
$env:PUPPETEER_SKIP_DOWNLOAD = '1'; npm ci
```

자주 쓴다면 사용자 환경변수로 등록해 두는 게 편하다.

### `NODE_ENV=production` (빌드)

`vite build`가 자동으로 production 모드로 빌드한다. 별도 환경변수 설정은 불필요.

## 파일 시스템 정책

### `dist/` 커밋

ADR-5에 따라 `dist/`는 저장소에 커밋한다. GitHub dependency 소비자가 별도 build step 없이 import할 수 있게 하기 위함.

```bash
npm run build
git add dist/
git commit -m "build: regenerate dist/"
```

PR을 푸시하기 전 반드시 `npm run build`를 실행하고 결과를 커밋한다. 작업자가 직접 `git diff --exit-code -- dist/`로 drift가 없는지 확인.

### `tsconfig.build.json` declaration scope

`vite-plugin-dts`가 declaration 파일을 생성할 때 `dev/`와 `test/`까지 잡으면 dev-only 타입 오류가 배포 산출물에 섞인다. `tsconfig.build.json`은 `src/`만 대상으로 한다.

```json
{
  "extends": "./tsconfig.json",
  "include": ["src"],
  "exclude": ["test", "dev", "**/*.test.ts", "**/*.test.tsx"]
}
```

신규 폴더를 추가할 때는 declaration emission 범위를 의도하는지 확인한다.

## 로컬 dev 서버

```bash
npm run dev
```

`vite`가 `http://localhost:5173`에서 `dev/index.html` + `dev/main.tsx`를 서비스한다. HMR 지원. VWorld 키는 `.env.local`의 `VITE_VWORLD_API_KEY`에서 읽힌다.

CORS 이슈로 타일이 안 뜨면:
1. 키가 등록된 도메인이 `localhost`를 포함하는지 VWorld 콘솔에서 확인.
2. `<VWorldMap transformRequest={...}>`로 프록시 경유.
3. `Network` 탭에서 401/403 응답 헤더의 `WWW-Authenticate` 메시지 확인.

## 빌드 산출물 검증

```bash
npm run build       # vite build
npm run pack:check  # npm pack --dry-run, tarball 내용 확인
```

`pack:check`가 출력하는 파일 목록에 다음이 모두 들어 있어야 한다:
- `dist/maplibre-vworld-js.mjs` (ESM)
- `dist/maplibre-vworld-js.umd.js` (UMD)
- `dist/maplibre-vworld-js.css`
- `dist/index.d.ts` (+ component declaration files)
- `README.md`, `LICENSE`, `package.json`

`dev/`, `test/`, `node_modules/`, `vite.config.ts`는 들어 있으면 안 된다(`package.json`의 `files` 필드와 `.npmignore`가 제어).

## 테스트 환경

vitest + jsdom + `@testing-library/react`. `test/setup.ts`가 `maplibre-gl`을 `vi.mock`으로 완전 대체 — 실제 WebGL이나 네트워크 호출이 발생하지 않는다.

새 MapLibre API를 컴포넌트에서 호출했는데 테스트가 `TypeError: map.foo is not a function`으로 실패하면 `test/setup.ts`의 `Map.mockImplementation` 반환 객체에 method를 추가한다:

```typescript
const Map = vi.fn().mockImplementation(function() {
  return {
    // ...
    foo: vi.fn(),  // ← 추가
  };
});
```

## 흔한 함정

- **`npm ci` 시간이 너무 오래 걸린다**: Puppeteer가 Chromium을 다운받고 있다. `PUPPETEER_SKIP_DOWNLOAD=1` 추가.
- **`vite build`가 React 모듈을 못 찾는다**: `peerDependencies`에 React가 있는데 `node_modules/`에 없는 상태. `npm ci`를 다시 실행.
- **타입 오류는 없는데 빌드만 실패**: `tsconfig.build.json`의 include/exclude를 확인. `dev/`나 `test/`가 declaration emission에 들어가 있을 수 있다.
- **dist/에 매 빌드마다 source map diff**: vite의 source map은 결정적이어야 하는데 OS별로 path separator가 달라질 수 있다. `vite.config.ts`의 `build.sourcemap`을 확인.
- **이전에는 깨끗했는데 갑자기 빌드/테스트 실패**: Node 버전 mismatch가 가장 흔하다. `node --version`이 `v20.x.x`인지 확인.
- **`npm test`가 jsdom not found**: `npm ci`가 중간에 끊겼을 가능성. `rm -rf node_modules package-lock.json && npm install`로 재설치.
