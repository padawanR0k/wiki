---
title: 다국어 페이지 작업시 주의해야할 것 - hreflang / canonical
date: 2026-06-30
updated: 2026-06-30
tags:
  - SEO
  - i18n
---

한 페이지를 여러 언어로 서비스할 때, 검색엔진에 "같은 콘텐츠의 다른 언어 버전"이라는 설정을 제대로 하지 않으면 번역본이 검색엔진 색인에서 잘못될 수 있다.

## canonical은 자기 자신을 가리킨다

다국어 페이지의 정규 URL은 각 언어 페이지가 자기 자신을 가리키는 것이 정석이다. ko/en/ja를 하나의 대표 URL로 통합하면 그 한 언어만 색인되고 나머지 번역본은 검색 결과에 노출되지 않는다.

자기 참조만으로는 부족하다. "이 셋은 같은 콘텐츠의 번역결과"라는 신호를 hreflang으로 따로 줘야 한다.

## hreflang 필수 규칙

공식 문서 기준으로 다음 네 가지가 모두 지켜져야 태그가 유효하다.

| 규칙                           | 설명                                                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| 자기 자신 포함, 모든 언어 나열 | 각 페이지에 자기 자신을 포함한 전체 언어 버전 링크 세트가 박혀 있어야 한다                                 |
| 상호 참조 대칭성               | X가 Y를 가리키면 Y도 X를 되짚어 가리켜야 한다. 한쪽이라도 깨지면 Google이 hreflang 태그 자체를 무시한다    |
| 절대 URL                       | `https://`부터 포함한 절대 경로. 상대 경로는 불허                                                          |
| x-default                      | 어떤 언어에도 매칭되지 않는 사용자가 보게 될 기본 페이지. 보통 주력 시장 언어 또는 언어 선택 페이지로 지정 |

## canonical과 hreflang의 관계

**Google은 hreflang으로 묶인 URL 집합에 속한 페이지를 정규 URL로 선호한다.** hreflang을 제대로 설정해야 언어 매칭 신호뿐 아니라 정규 URL 선정에도 가산점이 붙는다.

## 정규 URL에 포함할 것과 제외할 것

- **추적용 파라미터(`gclid`, `utm_*`)**: 정규 URL에서 제외한다. 공식 문서가 `gclid`를 예시로 명시.
- **식별자 파라미터(`?exampleId=1`)**: 리소스당 1개로 고정이면 추적용보다 덜 위험하지만, 쿼리스트링 형태는 경로에 포함된 식별자보다 비추천.

## URL과 언어 코드는 단일 출처에서 파생시킨다

`og:locale`은 페이지별로 분기되는데 `product:locale`은 한 값으로 고정돼 있다면, 두 값이 서로 다른 곳에서 생성되고 있다는 신호다. 메타데이터 빌더가 통합되지 않으면 새 언어 추가 시 한쪽만 업데이트되는 사고가 반복된다.

URL 생성기와 언어 코드 매핑을 단일 빌더에서 파생시킨다. Next.js App Router에서는 `generateMetadata`의 `alternates.canonical`과 `alternates.languages`로 한 번에 처리할 수 있다.

## 자동 언어 리다이렉트의 색인 함정

공식 문서는 "한 언어 버전에서 다른 언어 버전으로 사용자를 자동 리다이렉트하지 말라"고 권고한다. IP 기반 강제 리다이렉트의 가장 큰 위험은 Googlebot에게도 적용된다는 점이다.

Googlebot은 주로 미국·유럽에서 크롤링한다. 외국 IP를 `/en/`으로 강제로 보내면 Googlebot이 한국어 페이지를 영구히 보지 못하는 상황이 생긴다. 언어 선택은 리다이렉트가 아니라 사용자 선택(배너 안내 등)으로 처리한다.

## 검증

브라우저 개발자도구는 CDN 캐시나 JS 동적 주입의 영향을 받는다. 언어 쿠키를 바꿔가며 curl로 메타데이터를 직접 조회하는 것이 가장 신뢰성이 높다.

```bash
curl -s -L -b "lang=ko" "URL" | grep -oE '<link[^>]*rel="(canonical|alternate)"[^>]*>'
```

## 참고

- [Localized versions of your pages](https://developers.google.com/search/docs/specialty/international/localized-versions) — hreflang 규칙, x-default, 흔한 실수
- [How to specify a canonical URL](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) — 정규 URL 방법론, hreflang 시너지, gclid 예시
- [Managing multi-regional sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) — 자동 리다이렉트 비권장
