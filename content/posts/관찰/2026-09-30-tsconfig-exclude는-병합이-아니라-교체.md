---
title: tsconfig exclude는 extends 시 병합이 아니라 교체다
date: 2026-09-30
updated: 2026-09-30
tags:
  - 관찰
  - 설정무시
target: tsconfig
version: TypeScript 전 버전
---

`tsconfig.build.json`이 자체 `exclude` 배열을 정의하면 `extends`한 부모의 `exclude`를 통째로 덮어쓴다. `files`·`include`·`exclude`는 배열 병합 없이 자식 값이 이기는 필드이고, `compilerOptions`만 키 단위로 병합된다. 부모에 넣은 exclude가 한 번도 적용된 적 없어도 아무 경고가 없다.

- **맥락**: pre-commit tsc가 30초 걸리는 원인을 파다가, 2024-11에 넣은 `i18next.d.ts` exclude가 한 번도 적용된 적 없었다는 걸 발견
- **처음엔**: i18n 타입이 무거운 게 문제라고 봤다. 실제로는 그걸 빼려던 설정이 죽어 있었던 것
