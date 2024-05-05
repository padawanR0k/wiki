---
created: 2024-05-05T17:03:35+09:00
updated: 2024-05-05T17:20:45+09:00
tags:
  - 디깅
---

## 환경

모노레포에서 패키지마다 vite + react (A), Next.js (B) 각각 다르게 사용중
Next.js 13을 쓰려다보니 vite + react 패키지에서 쓰는 17버전과 다르게 18버전을 사용해야함

B 패키지에 Swiper 설치 후 컴포넌트를 렌더링하면 아래와 같은 에러 메시지 발생
```text
Error: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.
    at resolveDispatcher (/node_modules/.pnpm/react@17.0.2/node_modules/react/cjs/react.development.js:1476:13)
    at useState (/node_modules/.pnpm/react@17.0.2/node_modules/react/cjs/react.development.js:1507:20)
    at /node_modules/.pnpm/swiper@10.3.1/node_modules/swiper/swiper-react.mjs:140:51
```

B의 package.json에 resolution을 명시해줘도 17버전을 참조함.
에러 디깅을 하다가 문득 next.js `transpilePackages` [옵션](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)이 떠오름.

이는 next.js에서 lodash-es를 쓰려고 하다가 commonjs 문제를 해결하기 위해 썼던 *특정 패키지를 트랜스 파일링해주는 옵션*임.

Swiper에서 자꾸 다른 패키지에서 사용되는 react 버전을 참조 문제가 해당 옵션을 통해 미리 B 패키지 레벨에서 트렌스 파일링하면 해당 패키지 리액트를 바라보게 되어 해결될거 라고 생각하였고 테스트 해보니 맞았음.



