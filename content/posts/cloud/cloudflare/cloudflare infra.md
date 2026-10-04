---
tags:
  - cloudflare
title: cloudflare 인프라 간단 정리
created: 2026-10-03
---
### Cloudflare Workers (컴퓨트)
V8 isolate 위에서 돌아가는 서버리스 함수
> [!NOTE] 설계 철학
> 컨테이너나 VM 대신 V8 isolate를 쓴 이유는 콜드 스타트를 사실상 없애기 위해서다. 요청마다 새 프로세스를 띄우는 대신, 이미 떠 있는 V8 엔진 안에 격리된 실행 컨텍스트만 새로 만든다. 그 대가로 Node.js API 전체를 쓸 수는 없고, Cloudflare가 제공하는 런타임 API(fetch, D1, KV 바인딩 등)에 맞춰 코드를 짜야 한다.


### Cloudflare Pages (호스팅)
정적/SSR 프론트엔드 배포 플랫폼


### Cloudflare D1 (데이터베이스)
SQLite 기반 서버리스 DB
> [!NOTE] 설계철학
> 전통적인 "항상 켜져 있는 DB 서버" 대신, SQLite 파일을 엣지에 복제해두고 Worker가 바인딩을 통해 직접 질의하는 방식이다. 연결 풀 관리 자체가 필요 없다는 게 핵심


### Cloudflare Turnstile (봇 방어)
reCAPTCHA 대체재. "Managed mode"로 설정하면 대부분의 사용자에게는 체크박스조차 안 보인다.

> [!NOTE] 설계 철학
> 사용자 마찰을 최소화하는 게 설계 목표다. 브라우저 신호(핑거프린트, 동작 패턴)만으로 대부분을 통과시키고, 의심스러운 트래픽에만 챌린지를 띄운다.



### Cloudflare Access - Zero Trust (인증)
애플리케이션 코드 바깥, 엣지 레벨에서 로그인을 강제하는 서비스. 

> [!NOTE] 설계 철학
> "VPN 없이도 사내 도구처럼 특정 경로를 보호한다"는 Zero Trust 모델의 구현체다. 애플리케이션(Worker/Pages) 코드는 로그인 로직을 전혀 몰라도 된다
