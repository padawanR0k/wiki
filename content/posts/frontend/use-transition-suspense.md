---
title: useTransition과 Suspense의 내부 상호작용
date: 2026-03-15
updated: 2026-03-15
tags:
  - react
  - javascript
---

## 핵심 관계

- `Suspense`는 내부에서 Promise throw를 감지하면 "데이터 없으면 fallback 보여줘"라는 로직으로 동작한다.
- `useTransition`을 써서 Promise를 throw하면 "데이터 올 때까지 기존 화면 유지하면서 정지 신호를 잠시 무시해줘"라는 신호를 보낸다.

## 내부 동작 원리

### 1. 기존 화면 유지 (Avoid Hiding Existing Content)

- 일반적으로 Suspense는 하위 컴포넌트가 Promise를 throw하면 즉시 fallback으로 전환
- `startTransition`으로 감싸진 상태 변경으로 Suspense가 발동되면, 리액트는 새 데이터가 준비될 때까지 **기존 화면을 유지**
- fallback으로 튕기지 않음

### 2. 오프스크린(Off-screen) 렌더링

리액트가 **두 개의 상태를 동시에 관리**한다:

- **현재 화면**: 사용자가 보고 있는 기존 데이터 기반 UI
- **미래 화면 (백그라운드)**: 새로운 값이 적용된 렌더링 시도 중인 UI

새 데이터 도착 시, 백그라운드에서 UI를 완성한 뒤 한 번에 교체(Commit)한다.

### 3. 우선순위 조정 (Interruptible Rendering)

- `useTransition` 내부 작업은 **낮은 우선순위**
- 사용자가 연속 입력 시 이전의 낮은 우선순위 렌더링을 **중단(Interrupt)**하고 최신 요청에 집중
- 브라우저 메인 스레드를 점유하지 않아 UI가 부드럽게 유지
