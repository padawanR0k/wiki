---
title: 내 개발 환경 세팅 기록
date: 2022-05-31
updated: 2022-12-18T15:40:45+09:00
tags:
  - my-setting
created: 2022-12-18T15:40:45+09:00
---

> 내 개발환경 세팅에 대해 기록한다.

## alfred
- 현재 active 화면에서 보기
  - ![image](https://user-images.githubusercontent.com/35283339/183840211-1b1227ab-affe-4262-ab2e-0c187333ea59.png)
- 크롬 북마크를 alfred에서 검색하기
  - ![image](https://user-images.githubusercontent.com/35283339/183840943-e945c650-b7aa-4419-8100-5e6fe9fe1e35.png)

## history
M1 맥북으로 개발환경을 다시 구성하면서 터미널 history 도 옮기고 싶어서 방법을 생각해봤다.

[How can I transfer my bash history to a new system?](https://askubuntu.com/questions/652305/how-can-i-transfer-my-bash-history-to-a-new-system)

zsh의 history는 .zsh_history 에 문자열형태로 존재한다.

croc 을 사용하여 해당 파일을 터미널로 이동시켰다.

```
brew install croc
// 보내는 곳
croc send [file(s)-or-folder]

// 특정 코드를 보여준다.

// 받는 곳
croc [특정코드 입력]
```
