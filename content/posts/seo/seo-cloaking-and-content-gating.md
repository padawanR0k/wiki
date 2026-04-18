---
title: SEO 클로킹과 콘텐츠 게이팅
date: 2026-04-18
updated: 2026-04-18
tags:
  - SEO
---

## 배경

Next.js 하이브리드 렌더링(SSR+CSR) 페이지의 TTFB/과부하 문제를 해결하기 위해 봇 전용 경량 서버(Hono 등)를 별도 운영하는 아키텍처를 고려할 때, Google 클로킹 정책을 위반하지 않기 위한 실무 기준 정리.

## Google이 비교하는 것과 비교하지 않는 것

Google WRS(Web Rendering Service)는 헤드리스 Chromium으로 페이지를 렌더링한 뒤, 봇에게 전달된 HTML과 사용자에게 최종 렌더링된 DOM을 비교한다.

### SEO-critical (봇/유저 불일치 시 위험)

| 비교 대상 | 위험 수준 |
| --- | --- |
| `<title>` 태그 텍스트 | 🔴 Critical |
| `<meta name="description">` | 🔴 Critical |
| `<link rel="canonical">` | 🔴 Critical |
| OG 태그 (og:title, og:description, og:image) | 🔴 Critical |
| H1 텍스트 | 🔴 Critical |
| H2~H3 헤딩 구조 | 🟡 Warning |
| JSON-LD 구조화 데이터 (특히 가격, 평점, 가용성) | 🔴 Critical |
| 내부 링크 (`<a>`) 구조 | 🟡 Warning |
| `<meta name="robots">` 지시문 | 🔴 Critical |
| 본문 텍스트 콘텐츠 | 🟡 Warning (50%+ 차이 시 플래그) |

### 비교하지 않는 것 (차이 허용)

| 차이가 있어도 괜찮은 것 | 이유 |
| --- | --- |
| HTML 전체 용량 차이 (20KB vs 200KB) | 렌더링 인프라일 뿐 콘텐츠가 아님 |
| React 하이드레이션 마커 유무 | 프레임워크 내부 구현 |
| `__NEXT_DATA__` JSON 블록 유무 | Next.js 전용 데이터 전달 방식 |
| 코드스플릿 `<script>` 태그 유무/차이 | JS 번들링 관련 |
| CSS Module 클래스명 차이 | 스타일링 구현 차이 |
| `<script>`, `<style>` 태그 수 | 기능적 리소스 |
| 레이아웃/디자인 차이 | 봇은 콘텐츠를 보며 디자인은 대상이 아님 |
| 팝업, 모달, 광고 제거 | Dynamic Serving에서 허용 |

**판단 기준**: "익명 사용자가 JS를 실행한 후 최종적으로 보게 되는 콘텐츠"와 "봇이 보는 콘텐츠"가 같으면 OK.

## 반드시 지켜야 할 필수 사항

### `Vary: User-Agent` 헤더

- 봇과 사용자에게 다른 HTML을 서빙할 때 응답 헤더에 필수 포함.
- 누락 시 Google이 한 버전만 캐시하고 다른 버전을 발견하지 못할 위험.
- Google 공식 모바일 퍼스트 인덱싱 문서에서 Dynamic Serving 시 필수로 명시.

```
Vary: User-Agent
```

### 동일 API 데이터 사용

- Next.js와 SEO 서버가 동일한 API 엔드포인트에서 데이터를 가져와야 함.
- 각각 다른 API를 호출하거나 한쪽에서 데이터를 가공해 다른 결과가 나오면 콘텐츠 드리프트의 원인.

권장 구조:

```
API 서버 (단일 엔드포인트)
    ├── Next.js → 사용자용 렌더링
    └── SEO 서버 → 봇용 렌더링
```

### 공용 모듈로 SEO-critical 요소 생성

양쪽 앱이 동일한 함수에서 생성해야 하는 대상.

- **title 생성**
- **meta description**
- **JSON-LD 구조화 데이터** — 특히 `price`, `aggregateRating` 필드
- **canonical URL** — 경로 상수 공유
- **OG 태그** — og:title, og:description, og:image

### JSON-LD 구조화 데이터 완전 일치

- JSON-LD는 Google Rich Results의 핵심이며, 불일치 시 리치 결과 자격이 박탈됨.
- HTML 본문에 표시된 값과 JSON-LD 값도 일치 필요.
- 예: JSON-LD `₩77,000` / 본문 `₩88,000` → 구조화 데이터 스팸으로 간주될 수 있음.

특히 위험한 필드:

- `offers.price` — 가격
- `offers.availability` — 수강/재고 가능 여부
- `aggregateRating.ratingValue` — 평점
- `aggregateRating.reviewCount` — 리뷰 수

## CSR 영역을 봇에게 SSR로 제공하기

### 허용되는 패턴 (클로킹 아님)

Next.js에서 수강평이 CSR(useEffect → API 호출)로 로드되는 페이지를 SEO 서버에서 같은 API 데이터로 SSR로 내려주는 것은 Google이 공식 허용하는 Dynamic Rendering 패턴.

> "Googlebot generally doesn't consider dynamic rendering as cloaking. As long as your dynamic rendering produces similar content, Googlebot won't view dynamic rendering as cloaking." — Google Search Central

- **전달 방식(HOW) 차이는 OK, 최종 콘텐츠(WHAT) 차이는 NOT OK.**

### 주의할 경계선

- ✅ 사용자가 JS 실행 후 보게 되는 수강평 5개와 봇이 보는 수강평 5개가 동일 → OK
- ⚠️ 봇에게만 수강평 100개 전체를 펼쳐서 보여주고 사용자에게는 "더보기" 뒤에 숨김 → 경계선
- ❌ 봇에게만 존재하는 키워드 텍스트나 추가 링크 삽입 → 클로킹

## 로그인 게이팅 콘텐츠 (커뮤니티 등)

### Google의 공식 입장

> "If you operate a paywall or a content-gating mechanism, we don't consider this to be cloaking if Google can see the full content of what's behind the paywall just like any person who has access to the gated material and if you follow our Flexible Sampling general guidance." — Google Spam Policies

- "로그인 유저가 보는 것 = 봇이 보는 것"이면 클로킹이 아님.
- 금전 결제가 아닌 로그인 게이팅도 동일한 규칙 적용.

### 필수: 구조화 데이터 마크업

- 게이팅된 콘텐츠에는 `isAccessibleForFree` 구조화 데이터 필수.
- 누락 시 Google이 클로킹으로 오인할 수 있음.

```json
{
  "@context": "https://schema.org",
  "@type": "DiscussionForumPosting",
  "headline": "글 제목",
  "isAccessibleForFree": false,
  "hasPart": {
    "@type": "WebPageElement",
    "isAccessibleForFree": false,
    "cssSelector": ".gated-content"
  }
}
```

### 게이팅 범위별 전략

| 전략 | 설명 | 적합한 상황 |
| --- | --- | --- |
| Lead-in | 질문 본문은 공개, 답변/댓글만 로그인 뒤에 | 검색 유입 UX 중시 |
| Metered | 월 N개 글 전체 공개 후 게이팅 | 회원가입 전환 퍼널 중시 |
| Hard gate | 전체 비공개, 봇에게만 전체 공개 | 비권장 (UX 최악) |

- 어느 전략을 선택하더라도 `isAccessibleForFree` 마크업은 필수.

## 유지보수 드리프트 방지

클로킹의 가장 현실적 위험은 "의도적 클로킹"이 아니라 **시간이 지나면서 발생하는 사일런트 드리프트**.

### CI 패리티 체크 자동화

배포 파이프라인에서 Next.js 응답과 SEO 서버 응답의 SEO-critical 요소를 자동 비교.

**Critical (불일치 시 빌드 실패)**

- `<title>` 일치 여부
- H1 텍스트 일치 여부
- `<link rel="canonical">` 일치 여부
- `og:title`, `og:description` 일치 여부
- `<meta name="description">` 일치 여부
- JSON-LD의 `name`, `offers.price`, `aggregateRating` 일치 여부

**Warning (로그만 기록)**

- H2 개수 차이
- 내부 링크 수 30% 이상 차이

### 코드 변경 감지 알림

- Next.js 레포에서 주요 페이지 관련 파일이 변경되면 SEO 서버 담당자에게 알림.
- GitHub CODEOWNERS 또는 path-based notification 활용.

### 템플릿 버전 관리

- SEO 서버 응답 헤더에 템플릿 버전을 포함해 캐시 무효화와 디버깅에 활용.

```
X-Template-Version: 2026.03.20.1
```

- 캐시 키에도 버전 포함: `seo:course:${slug}:v${TEMPLATE_VERSION}`

### 정기 감사

- 월 1회 Google Search Console의 URL 검사 도구로 주요 페이지의 "Google이 본 페이지" 스크린샷 확인.
- 실제 페이지와 시각적으로 다른 점이 없는지 육안 검사.

## 절대 하면 안 되는 것

| 행위 | 위험도 | 이유 |
| --- | --- | --- |
| 봇에게만 추가 키워드 텍스트 삽입 | 🔴 즉시 페널티 | 클로킹의 교과서적 정의 |
| 봇에게만 존재하는 링크 추가 | 🔴 즉시 페널티 | 링크 스팸 + 클로킹 |
| JSON-LD에 실제와 다른 가격/평점 기입 | 🔴 리치 결과 박탈 | 구조화 데이터 스팸 |
| 봇에게만 다른 canonical URL 제공 | 🔴 인덱싱 혼란 | SEO 시그널 분열 |
| `Vary: User-Agent` 헤더 누락 | 🟡 캐시 문제 | Google이 한 버전만 인식 |
| 구조화 데이터 없이 게이팅 콘텐츠를 봇에게만 공개 | 🔴 클로킹 오인 | Google 공식 정책 위반 |
| 봇에게 다른 리다이렉트 경로 적용 | 🔴 즉시 페널티 | Sneaky redirect |
| `display:none`으로 숨긴 텍스트를 봇에게만 노출 | 🔴 즉시 페널티 | Hidden text abuse |

## 체크리스트

### 배포 전

- [ ] `Vary: User-Agent` 헤더가 SEO 서버 응답에 포함되어 있는가?
- [ ] `<title>`, H1, canonical, OG 태그가 Next.js와 동일한 공용 함수에서 생성되는가?
- [ ] JSON-LD의 price, aggregateRating이 본문 표시 값과 일치하는가?
- [ ] 봇에게만 보이는 추가 콘텐츠(텍스트, 링크)가 없는가?
- [ ] 게이팅된 콘텐츠에 `isAccessibleForFree` 구조화 데이터가 있는가?
- [ ] CI 패리티 체크가 통과하는가?
- [ ] SEO 서버 장애 시 Next.js로 폴백이 작동하는가?

### 정기 점검 (월 1회)

- [ ] Google Search Console URL 검사로 주요 페이지 렌더링 확인
- [ ] SEO 서버와 Next.js의 주요 페이지 HTML diff 수동 검토
- [ ] 구조화 데이터 Rich Results Test 통과 여부 확인
- [ ] 새로 추가된 Next.js 페이지 섹션이 SEO 서버에도 반영되었는가?

## 해외 콘텐츠 게이팅 사례

1. **Barry Adams — "Best Practices for Paywalls and SEO"** ([링크](https://www.seoforgooglenews.com/p/best-practices-for-paywalls-and-seo))
    - User-agent 방식 페이월에서 일반 사용자에게는 잠긴 HTML을, 검증된 Googlebot UA에게는 전체 기사와 완전한 NewsArticle 구조화 데이터가 포함된 HTML을 제공하는 패턴.
    - reverse IP lookup으로 Googlebot을 검증하면 거의 우회 불가.
    - `isAccessibleForFree: false` 미사용 시 클로킹 페널티 가능.
    - 뉴스 퍼블리셔 관점에서 페이월 유형별 기술 구현을 가장 체계적으로 정리. 커뮤니티 게이팅 시나리오에 가장 직접적으로 대응.

2. **CXL — "Paywalls, SEO, and the Need for a Damn Good Brand"** ([링크](https://cxl.com/blog/paywall-seo/))
    - Dan Smullen(Independent News & Media SEO 매니저)의 하이브리드 접근 상세.
    - 일반 사용자/봇에게는 HTML·구조화 데이터로 콘텐츠 미노출, 유효 IP의 Googlebot 접근 시 콘텐츠와 페이월 구조화 데이터를 함께 제공.
    - Irish Times의 실제 구현 방식(서버사이드 하드 게이팅 + Googlebot 전체 제공) 분석.

3. **Next.js Discussion #16665 — ISR 환경에서 Googlebot에 페이월 콘텐츠 허용하기** ([링크](https://github.com/vercel/next.js/discussions/16665))
    - Next.js 프로젝트에서 SSG + 클라이언트 사이드 페치로 구현한 사례.
    - 공개 데이터는 `getStaticProps`, 페이월 콘텐츠는 인증 사용자 또는 Googlebot 검증 후 클라이언트에서 페치.
    - Bearer 토큰 인증 외에 UA + reverse DNS IP 검증을 추가한 코드 패턴.
    - 프론트엔드 관점에서 바로 참고 가능한 실전 레퍼런스.

4. **INMA — "New York Times uses machine learning to create a smarter paywall"** ([링크](https://www.inma.org/blogs/ideas/post.cfm/new-york-times-uses-machine-learning-to-create-a-smarter-paywall))
    - NYT가 2011년 페이월 론칭 이후 Dynamic Meter(인과적 머신러닝 모델)로 사용자별 맞춤 열람 제한을 설정하는 과정.
    - 등록 사용자의 1st party 데이터로 학습하여 구독 전환과 콘텐츠 참여를 동시에 최적화.
    - 봇 서빙 아키텍처 자체는 아니지만 metered paywall의 서버사이드 의사결정 로직을 가장 깊이 있게 다룸.

## 참고 자료

### Google 공식 문서

- [Spam Policies for Google Web Search](https://developers.google.com/search/docs/essentials/spam-policies) — 클로킹 정의, 페이월/게이팅 콘텐츠 정책
- [Dynamic Rendering as a workaround](https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering) — "similar content" 기준
- [Subscription and Paywalled Content Markup](https://developers.google.com/search/docs/appearance/structured-data/paywalled-content) — `isAccessibleForFree` 구조화 데이터
- [Cloaking Policy](https://developers.google.com/search/docs/advanced/guidelines/cloaking) — 클로킹 vs 정당한 서빙 구분
- [Crawl Budget Management](https://developers.google.com/crawling/docs/crawl-budget) — TTFB와 크롤 버짓 관계

### Google Research

- [Cloak of Visibility](https://research.google.com/pubs/archive/45365.pdf) — 디클로킹 크롤러 (11개 에뮬레이터, 95.5% 정확도)

### 업계 분석

- [Cloaking in SEO: When It's Black Hat vs. Legitimate (2025)](https://cited.so/blog/cloaking) — 클로킹 감지 플래그 기준 (렌더된 텍스트 50%+ 차이, 헤딩 불일치, 구조화 데이터 변경 등)
