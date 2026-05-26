# 개발 환경

본 문서는 `maplibre-vworld-js` 로컬 개발 환경 셋업과 자주 마주치는 환경 문제를 정리한다. 빌드/테스트의 일반 사용법은 `SKILL.md` §2를 참고.

## 요구 사항

| 항목 | 버전 / 설정 |
|------|-------------|
| Node.js | 20 LTS |
| npm | Node 20에 동봉된 버전 (npm 10) |
| OS | Windows / macOS / Linux 모두 동작. 본 저장소는 Windows 호스트 기준 경로 표기 |
| 디스크 | `node_modules/` 약 800MB, `dist/` 약 200KB |

CI는 `actions/setup-node@v4`로 Node 20을 사용한다. 로컬 개발도 Node 20을 권장한다. 다른 버전에서 동작은 하지만 보장 범위 밖이다.

## 빠른 시작

```bash
cd F:\dev\maplibre-vworld-js
PUPPETEER_SKIP_DOWNLOAD=1 npm ci
cp dev/.env.example .env.local      # 필요 시
$EDITOR .env.local                  # VITE_VWORLD_API_KEY=... 채우기
npm run dev                         # http://localhost:5173
```

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

CI는 job-level `env`로 같은 변수를 set하므로 자동 적용된다.

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

CI의 `git diff --exit-code -- dist/`가 drift를 막는다. PR을 푸시하기 전 반드시 `npm run build`를 실행하고 결과를 커밋한다.

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
- **CI는 통과하는데 로컬은 실패**: Node 버전 mismatch가 가장 흔하다. `node --version`이 `v20.x.x`인지 확인.
- **`npm test`가 jsdom not found**: `npm ci`가 중간에 끊겼을 가능성. `rm -rf node_modules package-lock.json && npm install`로 재설치.
