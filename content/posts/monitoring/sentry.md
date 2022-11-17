---
title: Sentry
date: 2022-11-07
updated: 2022-11-17T22:40:12+09:00
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