---
title: react-query 동작 안하는 이슈 해결
date: 2024-09-28
updated: 2024-09-28
tags:
  - react-query
	- 트러블슈팅
---

## 현상
최근 몇몇 소수의 유저들에게서 빈 화면이 노출되는 현상이 있었다.
한 서비스에서만 발생한게 아니라, 분리되어있는 서로 다른 react, Next.js 애플리케이션에서 발생해서 의아해했다.
해당 유저들의 공통점은 아무 요청을 하지 못해 마치 인터넷 연결이 끊겨있는 것처럼 보였다.
모니터링툴에서도 도움이 될만한 에러 로깅이 남지도 않아서 원인을 알 수 없었다.

## 과정
- 아예 요청 자체를 못보내는건가?
  - 디버깅용으로 일반 fetch코드를 심어 놓았다. 잘 요청되는게 확인됐다.
- 리액트 쿼리 4버전을 사용하고 있었다.
  - 작년에 리액트 쿼리 3버전에서 4버전으로 넘어오면서 이런 비슷한 이슈가 있었어서 팀원분이 디깅을 했었던 적이 있었다. 그 때 작성됐던 슬랙 쓰레드가 기억나서 확인해보니 [스택오버플로우 글](https://stackoverflow.com/questions/75538301/reactquery-queryfn-passed-to-usequery-is-never-run-happens-only-on-chrome)이 하나 있었다.
- 리액트 쿼리는 내부적으로 `window.navigator.onLine` [플래그 값을 사용하고 있는데](https://github.com/TanStack/query/blob/b82f05e3028718f03eb132a4dd92dc3d7623f7b5/packages/query-core/src/onlineManager.ts#L80-L87), 이 값이 인터넷에 연결되어있음에도 불구하고 `false`로 되어있는 경우가 있다는 이슈가 있었다. ([참고](https://issues.chromium.org/issues/41293401))
- 리액트 쿼리에서는 [networkMode](https://tanstack.com/query/v4/docs/framework/react/guides/network-mode#network-mode-online)라는 옵션을 설정 수 있는데, 위에서 문제가 됐던 `onLine` 플래그 값을 무시하고 항상 요청하도록 할 수 있도록 `always`로 설정하여 문제를 해결했다...!

## 교훈
- 프로그램이 동작하는 곳이 항상 제대로 동작할거라는 100% 믿음을 가지는것보다 가끔 의심을 가지는게 좋다.
- 동료가 남기는 자료들을 잘 챙겨보고, 잘 저장해놓자. (거의 1년이된 쓰레드에서 실마리를 발견했다)
