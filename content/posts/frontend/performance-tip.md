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


### Next.js에서 Swiper 내부에 Image 컴포넌트 사용시 2번 호출되는 버그 해결
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

### Lazy 로딩 활용
- 반응형 디자인이 아니라 적응형 디자인이면서 클라이언트에서 디바이스 크기에 따라 분기처리를 하고 있다면 Lazy 로딩을 활용해 필요한 코드만 불러오도록 하자

### fetch 우선순위 설정하기
https://web.dev/articles/fetch-priority?hl=ko
- css-in-js를 사용하는 경우, css 내부에서 사용해야하는 이미지가 있는 경우, 브라우저는 자바스크립트가 모두 실행되고 나서야 해당 이미지가 필요한 것을 알 수 있다. 이를 메타태그를 활용해 미리 호출하도록 하자

#### 참고하면 좋은 링크들
- [Fetch Priority API로 리소스 로드 최적화](https://web.dev/articles/fetch-priority?hl=ko)
- [조기에 네트워크 연결을 설정하여 체감되는 페이지 속도 개선](https://web.dev/articles/preconnect-and-dns-prefetch?hl=ko)
- [Using dns-prefetch](https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch)
	- https://www.nray.dev/
- https://ui.toast.com/weekly-pick/ko_2021117