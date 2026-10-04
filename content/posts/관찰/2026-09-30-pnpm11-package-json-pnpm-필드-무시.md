---
title: pnpm 11은 package.json의 pnpm 필드를 경고 없이 무시한다
date: 2026-09-30
updated: 2026-09-30
tags:
  - 관찰
  - 설정무시
target: pnpm
version: pnpm 11
---

`package.json`의 `pnpm` 필드에 있던 overrides·patchedDependencies가 pnpm 11에서는 적용되지 않는데, install은 성공한다. 11부터 설치 관련 설정의 원천이 `pnpm-workspace.yaml`로 옮겨졌기 때문이다. `packageManager`만 올리면 이 상태가 되고, 공식 `pnpm-v10-to-v11` codemod를 돌리면 옮겨진다.

- **맥락**: 4개 레포를 Node 24·pnpm 11로 올리다가 overrides가 사라진 채 install이 성공하는 걸 발견
- **출처**: pnpm 마이그레이션 가이드, 2026-09-23 업그레이드 작업
