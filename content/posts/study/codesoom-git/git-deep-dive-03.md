---
title: git 딥다이브 - history
date: 2022-10-02
updated: 2022-10-02
tags:
  - git
---

---


> 해당 내용은  코드숨 강의 `소프트웨어 개발의 지혜 <Git 편>` 을 보고 정리한 내용입니다.

개발을 하다보면 여러 커밋중 일부를 아예 없에거나, 되돌리되 기록을 남기거나 하고 싶은 경우가 있다. 이런 경우 revert 나 rebase 를 사용하여 문제를 해결할 수 있다.

# revert

![[revert-01.png]]

![[revert-02.png]]


-   특정 커밋이 가지고 있는 변경사항의 이전 내용을 복구한다. 새롭게 커밋이 추가되는데 이때 기본적으로 커밋의 메시지는 `Revert {{이전 커밋메시지}}` 이다.
-   특정 커밋이 아닌 범위를 지정할 수도 있다.

```bash
git revert HEAD~3 # head 포함 최근 커밋 3개

git revert -n master~5..master~2
```

# rebase

-   커밋의 내용들을 수정한다. `-i` 옵션은 interactive를 뜻한다. 터미널에서 해당 명령어를 실행시켜보면 유저의 입력과 상호작용하며 깃 히스토리를 수정할 수 있다.
    -   편집기에는 유저가 입력한 매개변수에 따라 커밋 리스트를 보여주고, 어떤 옵션이 있는지 주석으로 적혀있다.

        ```bash
        pick 9a54fd4 commit의 설명 추가
        pick 0d4a808 pull의 설명을 추가

        # Rebase 326fc9f..0d4a808 onto d286baa
        #
        # Commands:
        #  p, pick = 커밋 유지
        #  r, reword = 커밋 유지, 커밋 메시지 수정
        #  e, edit = 커밋 유지, 해당 커밋이 amend될 때 자동 병합을 멈춤
        #  s, squash = 커밋 유지, 다만 이전 커밋과 squash
        #  f, fixup =  like "squash", but discard this commit's log message
        #  x, exec = run command (the rest of the line) using shell
        #
        ```



커밋기록을 통해 코드를 이전 상태로 되돌리는 목적으로 사용되는것은 매한가지이다. 다만 각각의 명령어를 실행했을때 커밋이 바뀌는 메커니즘이 다르기 때문에 지금 처한 상황이 어떤지 파악하고, 어떻게 커밋 기록을 남겨야할지 고민한 후 적절한 명령어를 사용하면 된다.

## 영상 자료

솔직히 rebase는 텍스트로 보면 이해하기 힘들다. 대신 영상자료를 추천함

-   **[git 히스토리를 마음대로 편집하기 - interactive rebase](https://www.youtube.com/watch?v=ZMoB1SZ4Ceg&ab_channel=%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9)**
-   **[Git 무료 강좌 2-3. git merge, git rebase(#10, #11)](https://www.youtube.com/watch?v=Kh-m5mLedfs&ab_channel=ZeroChoTV)**