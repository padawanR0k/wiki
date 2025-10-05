---
title: 개발 생산성을 위한 내 개발 환경 세팅 기록
date: 2022-05-31
updated: 2022-12-18T15:40:45+09:00
tags:
  - my-setting
created: 2022-12-18T15:40:45+09:00
---

> 내 개발환경 세팅에 대해 기록한다.

## [Raycast](<[Raycast - Your shortcut to everything](https://www.raycast.com/)>)

- 클립 히스토리 관리
	- 텍스트, 이미지 등 복사한 내용을 바로 검색
		- 이미지의 텍스트까지 검색되는건 킥이다.
- 북마크 바로가기
	- 북마크한 링크에 동적으로 파라미터를 넣을수있다.
		- 모니터링툴, 어드민에 특정유저 ID를 검색할 때 유용함.
- 서비스 검색
	- 컨플루언스, 지라, 슬랙, 피그마 등 업무용 서비스 내부 파일 검색가능
## [Atuin - Shell History & Executable Runbooks](https://atuin.sh/) 
내가 실행한 명령어(history)를 검색하는 도구 (분석도 가능)

- 다른기기에 history 옮기기
	- [How can I transfer my bash history to a new system?](https://askubuntu.com/questions/652305/how-can-i-transfer-my-bash-history-to-a-new-system)
	- zsh의 history는 .zsh_history 에 문자열형태로 존재한다.
	- 나는 croc 을 사용하여 해당 파일을 터미널로 이동시켰다.
```
brew install croc
// 보내는 곳
croc send [file(s)-or-folder]

// 특정 코드를 보여준다.

// 받는 곳
croc [특정코드 입력]
```

## [GitHub - dandavison/delta: A syntax-highlighting pager for git, diff, grep, and blame output](https://github.com/dandavison/delta#get-started)

- 터미널에서 git diff 확인할 때 더 좋은 가독성을 찾다가 발견
- 나는 아래처럼 위 아래 분할로 나오도록 해서 사용한다.
![[CleanShot 2025-10-04 at 15.38.29@2x.png]]

- 이런것도 있음
	-  [GitHub - ymattw/ydiff: View colored, incremental diff in workspace or from stdin, side by side and auto paged.](https://github.com/ymattw/ydiff)

## [GitHub - jesseduffield/lazygit: simple terminal UI for git commands](https://github.com/jesseduffield/lazygit)
- CLI, 소스트리, 깃크라켄 써보다가 정착한 Git 도구. 근데 터미널을 곁들인
- 빠름, 키보드만 써도됨



## [Hammerspoon](https://www.hammerspoon.org/)
- lua 를 사용해 os 위에서 동작하는 스크립트 작성
	- 키보드 한/영 상태일 떄 특정 ui를 바꾸기, 지금 브라우저 URL의 일부분 바꾸기 같은것들을 단축키로 만들 수 있다. (로컬, 개발서버 왔다갔다 할 때 유용함) 
