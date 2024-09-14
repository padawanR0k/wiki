---
title: eslint에서 biome로
date: 2024-09-14
updated: 2024-09-14
tags:
  - 개선
---

## 도입한 이유

eslint가 무거워서 웹스톰이 가끔 매우 느려진다. 온갖 설정을 해줘도..

lint-staged에서 eslint —fix를 쓰고 있는데 이것도 느리다..

## 과정

공식문서를 그대로 이행한다.
@biomejs/biome를 설치하고 (~~단순 biome으로 설치하지말 것~~)
기존에 있던 eslint룰을 마이그레이션 하기 위한 작업을 진행한다.

그 후 `pnpm biome lint --write` 명령어를 통해 린트를 돌려본다.
eslint와는 어떻게 다른지 린트에러나 워닝들을 수정해보면 알아갈 수 있다.
`--unsafe` 옵션을 붙이면 수정 가능한 부분은 알아서 수정해준다.

기존 eslint 의존성을 제거하고, 웹스톰에서도 eslint는 비활성화 시킨 후 biome로 동작하도록 기존 플러그인 제거 후 biome플러그인을 설치한다. 그 후 웹스톰을 리로드하면… 겁나 빨라진다.
기존 lint-stage 에서 eslint fix 를 실행시키던 것도 biome로 변경해주자

실제로 운영해보면서 장단점을 하나씩 정리해 나가자

### 비고

[Biome - 차세대 JS Linter와 Formatter](https://klloo.github.io/biome/)

- 러스트로 제작되었음
- 프리티어팀에서 개최한 대회에서 우승할 정도로 빠르고 프리티어 기능을 많이 지원함
- 린트와 포매터 역할을 동시에 해준다.
- 아직 지원하지 않는 언어들이 꽤 존재함.
