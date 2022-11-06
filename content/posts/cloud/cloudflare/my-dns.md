---
title: github 블로그에 도메인 연결하기 by cloudflare
date: 2022-11-01
tags:
  - cloudflare
---


기존에는 github pages를 사용해 이 위키 사이트를 [padawanR0k.github.io/wiki](padawanR0k.github.io/wiki)에 배포했었다.
`padawanR0k.github.io`와 겹치는 부분때문에 뭔가 SEO가 잘  안되기도 했고, 예전부터 나만의 주소를 가보고 싶었어서 도메인 구매하기로 마음을 먹었다.

## cloudflare domains
구글링을 해보니 도메인을 구매할 수 있는 곳은 많았다. [godaddy](https://kr.godaddy.com/), [google domains](https://domains.google/), [가비아](https://www.gabia.com/) 등.
그러다가 cloudflare에서도 도메인을 살 수 있다는걸 알게됐다. cloudflare는 2022 [인프콘 방명록](https://github.com/inflearn/infcon2022-guestbook)을  `Pages` 로 배포하면서 처음 써봤다. 그 때 써보면서 사용성이 편하다고 느꼈다.  나중에 한번 써먹어봐야지 했는데 딱 적당한 기회인 것 같았다.

## 도메인 구매하기
내가 사려는 도메인이 얼마인지 확인할 수 있는 페이지는 로그인 후 좌측 LNB 영역에 Domain Registration - Register Domains 메뉴를 통해 접근할 수 있다.
결제를 하기 위해서는 해외결제가 가능한 카드가 필요하고 영문으로 주소를 입력해야한다. 영문주소는 [네이버](https://search.naver.com/search.naver?ie=UTF-8&query=%EC%98%81%EB%AC%B8%EC%A3%BC%EC%86%8C&sm=chr_hty)에서 확인가능하다.  주소 입력은 해당 [블로그](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=et119jin&logNo=221322949445)를 참고하면 좋다.
![[address-input.png]]


## 연동하기
이제 해당 도메인으로 접속했을때 github pages로 배포된 곳으로 리다이렉트 시키는 작업이 필요하다.
1. 좌측 LNB 영역에 Websites에서 `Add a Site` 버튼을 누르고 내가 구매한 도메인 입력
2. cloudflare에 캐싱될 수 있는 레코드들이 나온다. 필요한 레코드를 활성화 시키고 `Continue` 버튼 클릭
3. Free plan 클릭
4. Done
5. 방금 등록한 site의 DNS 메뉴로 이동
6. A레코드 등록
	1. 내 깃허브 블로그의 아이피를 알아내 다음과 같이 입력한다 ([링크 참조](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-a-records-with-your-dns-provider))
	2. ![[dns-setting.png]]
7. github setting에서 커스텀 도메인을 등록한다 ([링크 참조](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages))
	1. 그럼 인증을 위한 TXT 타입의 레코드를 추가하라고 안내가 나온다. 해당 레코드를 추가하고 인증을 완료하자
8. 블로그 레포지토리 setting - Pages - Custom Domain에 구매한 도메인을 입력한다.


## 구글한테 URL 변경을 알리자
SEO를 위해 [Google Search Console](https://search.google.com/search-console/about)을 사용중이라면, URL이 변경됐음을 구글에 알려야한다.
1. 서치 콘솔에 접속
2. 새롭게 사용할 도메인으로 속성을 추가한다.
3. 기존에 등록한 속성의 설정 - 일반 설정 - 주소 변경 클릭


## To do list
- Cloudflare 서비스 좀 더 활용해보기
	- Pages
	- Analytics
- wiki에 글 자주 올리기
- SEO 잘되는지 확인하기


## 번외) cloudflare 사용 전/후 로드 속도 비교
> 개발자도구 - 네트워크 탭에서 har를 다운받아 https://compare.sitespeed.io/ 에서 비교하여 볼 수 있다.

### 사용 전
![[har-before.png]]

### 사용 후
![[har-after.png]]

1줄요약: 초기 block시간이 3732ms -> 847ms 만큼 줄었음