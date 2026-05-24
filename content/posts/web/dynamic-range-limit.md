---
title: dynamic-range-limit - HDR 이미지/비디오 밝기 제한 CSS 속성
date: 2026-05-24
tags:
  - css
created: 2026-05-24T00:00:00+09:00
updated: 2026-05-24T00:00:00+09:00
---

## 발견 계기

velog.io 에서 특정 썸네일만 밝기가 유독 강하게 보여서 확인해보니 HDR 이미지였고, 이걸 제어하는 CSS 속성이 `dynamic-range-limit` 이라는 걸 알게 됨.

> [MDN - dynamic-range-limit](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/dynamic-range-limit)

## 이 속성이 뭐 하는 건데?

HDR(High Dynamic Range) 이미지/비디오의 **최대 밝기를 어디까지 허용할지** 정하는 CSS 속성.

요즘 디스플레이는 SDR(일반)의 밝기 한계를 넘어서는 HDR 콘텐츠를 표시할 수 있는데, 페이지 안에 HDR 이미지 하나가 끼어 있으면 그 부분만 눈이 부실 정도로 튀어 보이는 현상이 생긴다. (velog 썸네일이 딱 그 케이스)

`dynamic-range-limit` 으로 "이 요소(혹은 페이지 전체)는 HDR이어도 SDR 수준의 밝기로만 보여줘" 라고 강제할 수 있다.

## 값

- `no-limit` (기본값) — HDR 콘텐츠의 최대 밝기를 그대로 허용
- `standard` — SDR 수준으로 밝기 제한. HDR이어도 일반 이미지처럼 보이게 만듦
- `constrained-high` — `no-limit` 과 `standard` 사이의 중간 정도로 제한

## 언제 쓰면 좋은가

- 사용자가 올린 썸네일/이미지가 HDR이라 페이지 안에서 혼자 너무 튀는 경우 (velog 사례)
- 다크모드 화면에서 HDR 이미지 하나가 눈부심을 유발할 때
- 디자인 시스템 차원에서 "콘텐츠 영역의 시각적 밝기 균형"을 맞추고 싶을 때

```css
img {
  dynamic-range-limit: standard;
}
```

이미지 전체에 적용하면 페이지 안의 HDR 이미지가 일반 이미지처럼 보이게 된다.

## 지원 현황

비교적 최근에 추가된 속성이라 [MDN 호환성 표](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/dynamic-range-limit#browser_compatibility) 확인 필수. 현 시점 Chromium 계열 위주.
