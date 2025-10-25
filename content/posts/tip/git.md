---
title: git 관련 팁 정리
date: 2025-10-25
updated: 2025-10-25
tags:
  - webstorm
  - tip
created: 2025-10-25
---

### 명령어

> [!INFO] 꿀팁
> git 명령어를 통해 가져온 문자열을 `pbcopy`로 클립보드로 복사하면 프롬프팅하기 편하다



- `git log -p {{파일명}}` 
	- 특정 파일의 git history
- `git grep`
	- `-A 10` : 매치된 줄 이후 10줄 표시
	- `-B 10` : 매치된 줄 이전 10줄 표시
	- `-C 10` : 매치된 줄 앞뒤 10줄 표시 (A+B 조합)
	- `git grep -n "검색어"` : 라인 번호 포함
	- `git grep -i "검색어"` : 대소문자 무시
- `git diff`
	- 특정 브랜치와의 patch 확인

### github 관련
- github 다중 계정 사용시 편하게 사용하는 법
	- ssh 키 생성 `ssh-keygen`
	- ssh 키 등록 `ssh-add` 
	- ssh 키 깃허브 계정설정에 추가 후 repository remote 설정을 ssh로 복사하여 사용