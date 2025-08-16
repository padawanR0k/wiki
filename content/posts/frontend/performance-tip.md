---
title: 프론트엔드 성능 최적화 팁 기록
date: 2024-01-01
tags:
  - javascript
  - 성능최적화
created: 2023-10-14T17:49:20+09:00
updated: 2024-01-01T18:36:57+09:00
---
자세히는 적지 않고 기억을 위해 간단하게 작성한 문서입니다

## 잘못된 tsconfig 설정하지 않기 (`jsxImportSource`)
1줄 요약 : 잘못된 설정 수정하고 매우 간단한 로직이 들어간 공용 라이브러리 사이즈 98% 감량

- 문제 상황
	- 매우 간단한 코드에 비해 빌드 결과물이 이상하게 컸음.
- 원인 파악
	- 빌드 분석툴로 확인해보니 사용하지도 않는 `emotion/react` 의존성 존재

### 해결방법

`tsconfig.json`에서 `jsxImportSource` 설정을 제거

```diff
{
  "compilerOptions": {
    "jsx": "react-jsx",
-   "jsxImportSource": "@emotion/react"
  }
}
```

- 저 설정 때문에 실제 코드에서 Emotion의 `css prop`이나 `jsx`를 사용하지 않음에도 `jsxImportSource` 설정이 있는 것만으로 Emotion 런타임이 포함되게됨
### 인사이트

- **`jsxImportSource`는 단순 타입 설정이 아니라 컴파일 결과를 바꾸는 트리거다.**
    - JSX가 자동으로 `@emotion/react/jsx-runtime`으로 변환됨.
    - 그에 따라 Emotion 런타임 전체가 종속되어 번들에 포함됨.
- `jsxImportSource`는 다음 조건에서만 사용해야 한다:
    - 실제로 `css prop`을 쓰는 경우
- **Emotion을 쓰지 않는 패키지에서는 해당 설정이 있으면 안 된다.**
    - Emotion runtime은 side-effect가 포함되어 트리셰이킹이 잘 안 됨
- **라이브러리/패키지별로 `tsconfig.json` 설정을 분리하거나 override 해야 함**
    - 전역 `tsconfig.base.json` 설정 시, 불필요한 JSX runtime import가 번들 확장을 유발할 수 있음 -> 이번에 모노레포의 tsconfig 설정을 좀 수정했다.
        

```ts
import { jsx } from "@emotion/react/jsx-runtime" // ← 실제 코드 없어도 자동 주입됨
```


````markdown
# BEFORE
dist/index.mjs  34.34 kB │ gzip: 11.25 kB
dist/index.js   23.29 kB │ gzip: 9.42 kB

# AFTER
dist/index.mjs  2.61 kB │ gzip: 1.53 kB
dist/index.js   2.56 kB │ gzip: 1.51 kB
````

gzip 기준 약 **85% 이상 사이즈 감소**.



## Next.js에서 Swiper 내부에 Image 컴포넌트 사용시 2번 호출되는 버그 해결
```diff
<Image
	fill
	className="swiper-lazy"
-	data-src={url}
	loader={imageLoader}
	sizes="720px"
	css={companyRepresentativeImageStyle}

```
https://github.com/nolimits4web/swiper/issues/3017#issuecomment-477654257
이미지가 네트워크 탭에서 항상 2번 호출되는걸 확인할 수 있었다. 위 이슈를 참고하니, 코드 상의 버그인듯하여 수정

## Lazy 로딩 활용
- 반응형 디자인이 아니라 적응형 디자인이면서 클라이언트에서 디바이스 크기에 따라 분기처리를 하고 있다면 Lazy 로딩을 활용해 필요한 코드만 불러오도록 하자

## fetch 우선순위 설정하기
https://web.dev/articles/fetch-priority?hl=ko
- css-in-js를 사용하는 경우, css 내부에서 사용해야하는 이미지가 있는 경우, 브라우저는 자바스크립트가 모두 실행되고 나서야 해당 이미지가 필요한 것을 알 수 있다. 이를 메타태그를 활용해 미리 호출하도록 하자

## 참고하면 좋은 링크들
- [Fetch Priority API로 리소스 로드 최적화](https://web.dev/articles/fetch-priority?hl=ko)
- [조기에 네트워크 연결을 설정하여 체감되는 페이지 속도 개선](https://web.dev/articles/preconnect-and-dns-prefetch?hl=ko)
- [Using dns-prefetch](https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch)
	- https://www.nray.dev/
- https://ui.toast.com/weekly-pick/ko_2021117