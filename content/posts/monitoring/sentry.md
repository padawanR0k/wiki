---
title: Sentry
date: 2022-11-07
updated: 2023-05-01T15:55:37+09:00
tags:
  - Sentry
created: 2022-11-17T22:39:34+09:00
---

## crash free sessions 활성화
- crash free sessions는 특정 시간동안 앱이 깨지지 않고 작동한 시간 퍼센티지를 나타낸다.. 즉, 높을수록 안정적인 것
- 해당 퍼센티를 기준으로 [알림을 설정](https://docs.sentry.io/product/alerts/alert-types/#sessions-crash-rate-alerts)할 수도 있다.

## track deploys 활성화
- 배포 버전마다 모니터링 할 수 있도록 도와주는 기능이다.
	- Each release version (a short version of the release name without the hash)
	-  The associated project
	-  The adoption stage of each release
	-  The authors of each commit
	-  The percentage of crash-free users
	-  The percentage of crash-free sessions
- [사전 작업](https://docs.sentry.io/product/releases/) 을 완료해야한다.

## 불필요한 에러 수집 방지
- 센트리 실행시 `ingnoreErrors` 매개변수를 전달하여 불필요한 에러 수집을 방지할 수 있다. 아예 센트리로 데이터를 보내지 않기 때문에 비용 측면에서도 개선된다. Next.js같은 프레임워크를 사용하여 애플리케이션을 운영하다보면 해결 불가능한 에러이지만, 유저 경험에는 영향을 끼치지 않는 로그들을 종종 마주친다. 그런 로그들을 추가하면 될듯 하다.
	```typescript
	Sentry.init({
		...,
		ignoreErrors: ['Failed to fetch']
	})
	```