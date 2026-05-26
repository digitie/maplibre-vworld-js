## 배경 및 목적

지도 상에 밀집된 다수의 마커(Marker)나 팝업(Popup)이 렌더링될 때, 요소들이 서로 겹쳐서 사용자가 특정 요소를 클릭해도 가려져서 보이지 않는 사용성 문제가 있었습니다. 본 PR은 사용자가 특정 팝업이나 마커를 클릭했을 때 해당 요소의 DOM `z-index`를 동적으로 증가시켜 항상 최상단에 노출되도록 개선합니다.

## 기술적 변경 사항 및 구현 상세

### 1. `Popup` 컴포넌트 개선 (`Popup.tsx`)
- **전역 카운터 도입**: 모듈 레벨 변수 `let globalPopupZIndex = 1;`을 선언하여 모든 팝업 인스턴스가 공유하는 z-index 상태를 관리합니다.
- **클릭 이벤트 바인딩**: MapLibre 팝업 인스턴스 생성 시 `popup.getElement()`를 통해 루트 DOM 엘리먼트에 직접 `click` 이벤트 리스너를 추가했습니다.
- **동적 z-index 할당**: 사용자가 팝업을 클릭할 때마다 전역 카운터가 1씩 단조 증가(Monotonically Increasing)하며, 이를 해당 팝업 엘리먼트의 `style.zIndex`에 즉시 적용하여 가장 높은 스택 컨텍스트를 점유하도록 했습니다.

### 2. `Marker` 컴포넌트 개선 (`Marker.tsx`)
- **전역 카운터 및 레퍼런스 분리**: `let globalMarkerZIndex = 1000;` (일반적인 정적 z-index prop과의 충돌 방지를 위해 높은 값에서 시작) 및 각 마커별 `dynamicZIndexRef`를 선언했습니다.
- **상태 동기화 문제 해결**: 마커 클릭 시 부모 컴포넌트에서 `selected` prop을 변경하여 React 리렌더링이 발생하면, 기존 로직의 `applyMarkerState`가 동적으로 주입된 z-index를 초기화해버리는 문제가 발생할 수 있었습니다.
- **우선순위 재조정 (Effective z-index)**: `effectiveZIndex = dynamicZIndexRef.current ?? zIndex` 로직을 구성하여, 한 번이라도 클릭을 통해 부여받은 동적 z-index가 있다면 React 렌더 사이클(`selected`, `highlighted` 등 변경)에서도 사용자 정의 `zIndex` prop보다 우선하여 유지되도록 설계했습니다.

### 3. 테스트 및 빌드 무결성 확보
- **테스트 환경 동기화**: Vitest 환경의 `test/setup.ts` 내 MapLibre `Popup` Mock 객체가 실제 DOM 요소 참조를 반환하도록 `getElement()` 구현을 추가했습니다.
- **Unit Test 반영**: 마커 클릭 이벤트를 시뮬레이션하는 `Marker.test.tsx`의 검증부에서 동적 z-index(`1001`)를 정상적으로 참조하는지 Assert 로직을 수정했습니다.
- 빌드 산출물(`dist/`) 동기화 및 런타임 타입 체크 정상 통과 완료.
