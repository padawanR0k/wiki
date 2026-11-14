---
title: 모노레포 통합 시 git 커밋 이력 보존 - allow-unrelated-histories / filter-repo
date: 2026-11-14
updated: 2026-11-14
tags:
  - git
---

## 발견 계기

두 개로 나뉜 레포지토리 중 작은 몸집을 가진 모노레포를 없애고 그걸 한쪽에 이관시키려고 하면서 기술블로그 보다가 찾음.

레포를 합칠 때 파일만 복사하면 과거에 누가, 언제, 왜 수정했는지 `git blame`, `git log`로 따라갈 수 없게 된다. 그래서 커밋 이력을 어떻게 가져갈지부터 정해야 한다.

## `--allow-unrelated-histories`는 기존 커밋을 건드리지 않는다

공통 조상이 없는 두 레포지토리의 이력을 머지 커밋 하나로 잇는 방법. ([[git-deep-dive-02]]의 merge와 같은데, 두 이력의 시작점이 아예 다르다)

![[git-merge-commit-graph.jpeg]]

(그림은 공통 조상이 있는 일반 머지. unrelated histories는 공통 조상 없이 두 갈래가 머지 커밋에서 만난다)

```bash
git remote add legacy ../legacy-repo                 # 합칠 레포를 remote로 추가
git fetch legacy
git merge legacy/main --allow-unrelated-histories
```

- 과거 커밋의 SHA, 작성자, 변경 이력이 그대로 남는다
- 기존 커밋은 수정하지 않고 머지 커밋만 새로 생긴다
- 커밋 그래프가 여러 갈래로 합쳐지고, 파일 경로 충돌은 따로 해결해야 한다

## `filter-repo`는 과거 경로까지 바꾸지만 SHA가 새로 생긴다

기존 커밋 이력을 재작성해서 과거 파일 경로까지 바꾸는 방법.

![[git-history-rewrite.jpeg]]

```bash
# 원본 말고 별도 클론에서 실행
git filter-repo --to-subdirectory-filter apps/legacy
```

과거 모든 커밋에서 `src/App.tsx`가 `apps/legacy/src/App.tsx`로 바뀐다. 모노레포 디렉터리 구조가 과거 이력에도 그대로 적용된다.

**대신 재작성된 커밋은 SHA가 바뀐다.** 원본 SHA에 의존하는 외부 시스템이 있으면 호환성을 따져봐야 한다.

## 원본 SHA를 지키느냐, 과거 경로까지 맞추느냐

| 기준        | `--allow-unrelated-histories` | `filter-repo`      |
| ----------- | ----------------------------- | ------------------ |
| 목적        | 독립 이력 병합                | 이력 재작성        |
| 원본 SHA    | 유지                          | 변경               |
| 과거 이력   | 보존                          | 재작성하여 보존    |
| 파일 경로   | 별도 이동 필요                | 과거 경로까지 변경 |
| GitOps 영향 | 상대적으로 낮음               | SHA 참조 확인 필요 |

## 참고

- [From Many Repos to One: An Honest Nx Monorepo Migration Retrospective](https://bradleycarey.com/posts/migrating-large-enterprise-apps-from-angular-to-nx/) — 여러 Angular 레포를 Nx 모노레포로 합친 회고, 이력 전략 3가지 비교
- [Git Merge Tutorial | DataCamp](https://www.datacamp.com/tutorial/git-merge) — git merge 동작과 머지 커밋
- [git-filter-repo](https://github.com/newren/git-filter-repo) — filter-repo 공식 저장소
