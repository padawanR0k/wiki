---
title: nextjs SEO 개선을 위해 sitemap 수정하기
draft: true
date: 2022-11-09
updated: 2022-11-13T16:42:58+09:00
tags:
  - SEO
created: 2022-11-09T11:28:03+09:00
---

## 목표
- SEO개선
	- 기존에 next router들에 대한 정보만 존재하던 간단한 sitemap에 상세페이지들에 대한 정보를 추가한다.
	- 중요 상세페이지 접근시 url에 서치키워드를 추가한다. 물론 서치키워드가 붙은 채로 접근되는 경우에도 접근이 가능해야한다.

## 문제 해결과정

### 레퍼런스 찾기
일반적인 url 접근시 서치키워드를 붙여주는 ux는 stackoverflow에서 확인할 수 있다.
https://stackoverflow.com/questions/31079081 접근시 https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router 로 url이 변경된다.
뒤에 붙은 `programmatically-navigate-using-react-router`은 질문 타이틀에 있는 공백과 특수문자를 `-`로 치환시킨것과 동일하다.

단순히 코드로 이런 로직을 추가한다고 해서 SEO에 영향은 없기때문에 sitemap을 수정해줘야한다.
[잡플래닛이 자사 sitemap](https://www.jobplanet.co.kr/sitemaps/job-postings-sitemap-0.xml)에 이를 적용해놓은 걸 볼 수 있다.

### next-sitemap
next.js는 자동으로 만들어진 라우터들을 기반으로 `publiic` 폴더에 sitemap을 생성해준다. 그리고 이 sitemap은  [[robots.txt]] 에 명시되어 크롤러에게 사이트의 구조를 알려주는데 사용된다.
[next-sitemap](https://github.com/iamvishnusankar/next-sitemap)은 이렇게 SEO에 필요한 sitemap.xml, robots.txt 파일들을 관리하는걸 도와준다.

#### 설치
```
yarn add next-sitemap
```

#### 사용방법

1. root에 `next-sitemap.config.js` 생성
```javascript
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
}
```
2. package.json - script 추가
```json
"build": "next build && yarn postbuild",
"postbuild": "next-sitemap"
```
3. 이제 빌드시에 sitemap이 자동으로 생성된다.

### dynamic sitemap
동적으로 변경될 가능성이있는 상세페이지의 경우에는 sitemap을 next.js의 라우터를 사용해 서빙할 수 있다.
`pages` 하위 폴더에 `server-sitemap.xml/index.tsx` 파일을 생성하자
```tsx


export const getServerSideProps: GetServerSideProps = async (ctx) => {
	// 데이터를 호출합니다.
	const fields = response.map(({ id, title }) => ({ id, title })).map(
		({ id, title }) => {
				return {
					loc: `https://example.com/detail/${id}/${title}`, // seo의 대상이되는 url
					lastMod: new Date().toISOString(),
				};
			});

			return getServerSideSitemap(ctx, fields);
		});

const SitemapXML = () => {
	return null;
};



export default SitemapXML;
```

이제 `/server-sitemap.xml`에 접근하면 다음과 같이 사이트맵이 생성된걸 확인할 수 있다.
![[sitemap01.png]]

동적으로 생성된 sitemap이 있는 경우 설정에 명시해야한다.
```javascript

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  ...
  exclude: ['/server-sitemap.xml'], // 정적인 사이트맵 리스트에서 제외
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: [''], // 크롤링하면 안되는 페이지 pathname을 나열합니다.
      }
    ],
    additionalSitemaps: [
      `https://example.com/server-sitemap.xml`, // 동적으로 생성되는 사이트맵 포함
    ],
    transformRobotsTxt: async (_, robotsTxt) => `${robotsTxt}\n\n${customOptions}`, // robots.txt를 커스터마이징할 때 사용함
  },
}

```

## 적용 결과
사이트맵 적용전 robots.txt, 사이트맵 적용후
diff 캡쳐 보여주거나 code diff 보여주기

새롭게 추가된 server-sitemap.xml 보여주기


## 사이트맵 관련  정보 정리
- loc, lastmod 뜻
- good / bad 케이스 정리하기
- 사이트맵을 인덱싱해야하는 이유
	- 잡플래닛 예시 보여주기


## 아쉬운점
현재 구조로는 `server-sitemap.xml` 을 조회할 때마다 서버에서 로직이 실행되는 구조이다. 물론 사이트맵이라 자주 조회되는 페이지는 아니긴해서 딱히 문제될건 없어보인다.


## 참고링크
- https://medium.com/volla-live/next-js%EB%A5%BC-%EC%9C%84%ED%95%9C-sitemap-generator-%EB%A7%8C%EB%93%A4%EA%B8%B0-10fc917d307e
- https://www.zodaland.com/tech/16
- https://www.sitemaps.org/ko/protocol.html
- https://moonsupport.oopy.io/post/11
- https://stackoverflow.com/questions/2594179/multiple-sitemap-entries-in-robots-txt
