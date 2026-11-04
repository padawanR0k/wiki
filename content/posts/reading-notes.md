---
title: 관심이 가는 글들
date: 2026-11-04
updated: 2026-11-04
tags:
  - 읽을거리
---
읽다가 나중에 다시 꺼내볼 만한 글들. 링크랑 3줄 요약만 남기고, 제대로 소화한 건 따로 문서로 뺀다.

## 2026-11

- [Next.js を TanStack Start に替えたら Cloudflare Workers の CPU 時間が 10 分の 1 に](https://zenn.dev/honeymarron/articles/nextjs-to-tanstack-start-cloudflare-workers) `tanstack-start` `cloudflare`
	- Next.js를 OpenNext 어댑터로 Workers 무료 플랜에 올렸더니 요청당 CPU 한도(10ms)를 1주일에 8번 넘김 (1102 에러)
	- TanStack Start로 바꾸고 CPU 시간 중앙값 400ms → 30ms, 번들은 1/3. 화면이랑 head는 한 글자도 안 바꿨다고 함
	- 줄어든 건 대부분 콜드스타트 때 코드 읽는 시간. `next/*` import를 Vite alias로 호환 레이어에 돌려서 컴포넌트 수정 없이 한 페이지씩 옮김

## 2026-10

- [TanStack Start vs Next.js in 2026: Same App, Real Benchmarks](https://www.fabwaseem.com/blog/tanstack-start-vs-nextjs) `tanstack-start` `next.js`
	- 같은 쇼핑몰 앱을 2코어에서 돌려 비교. Start가 SSR 목록 2.9배, 상품 페이지 4.6배, API 8.6배 처리량
	- 프리렌더된 정적 페이지만 Next.js가 앞섬. 캐싱 가능한 콘텐츠라면 격차가 좁혀진다
	- 저자 결론: 잘 돌아가는 Next.js 앱을 이 수치 때문에 다시 만들진 않는다. 새로 만드는 인터랙티브 앱이면 Start 1.0이 기본 선택지

- [TanStack Start とはなんぞや。Next.jsすら怪しいのについていけないぜ。](https://zenn.dev/link/articles/b388036800ebb4) `tanstack-start` `next.js`
	- 같은 기능을 Next.js App Router와 Start 코드로 나란히 비교한 입문 글
	- Next.js는 컴포넌트 중심(Server/Client 경계), Start는 라우트 중심(`loader` + Server Function)
	- `page.tsx` ↔ `createFileRoute`, Server Action ↔ `createServerFn`, `revalidatePath` ↔ `router.invalidate` 대응표로 정리

## 2026-02

- [Is TanStack Start better than Next.js? (YouTube)](https://www.youtube.com/watch?v=JO2L6MfiQtY) `tanstack-start` `next.js`
	- 개발자 경험, 타입 안전성, 예측 가능한 캐싱은 Start 쪽이 낫다
	- AI 지원, 생태계, 이미지·i18n 같은 내장 기능은 Next.js가 낫다
	- Start가 RC 단계일 때 영상이라 AI 지원·안정성 평가는 지금(1.0 정식 출시 이후)과 다를 수 있음
