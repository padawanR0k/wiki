---
title: react-query 정리
draft: true
tags:
  - react-query
---


### option
- userQuery
	- options
		- stale time
			- 데이터가 `fresh` -> `stale` 상태로 변경되는데 걸리는 시간
				- 새로운 요청이 있어도 기존 값을 반환하는 시간 결정
		- cache time
			- 데이터가 `inactive` 상태일 때 캐싱된 상태로 남아있는 시간
				- 가비지 콜렉트 되기 전까지 얼마나 캐싱된 상태로 남길 것이냐