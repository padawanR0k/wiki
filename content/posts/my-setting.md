---
title: 개발 생산성을 위한 내 개발 환경 세팅 기록
date: 2022-05-31
updated: 2025-11-13T15:40:45+09:00
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

### lazygit에서 Jira 티켓 여는법

#### 1) 단축키 등록

- 주의점
  * 사용 가능: `<c-o>`, `<a-o>` 같은 CTRL/ALT 조합
  * `customCommands.key` 는 **cmd(⌘)** 미지원
  * `cmd+o` 는 lazygit 기본키(openFile)로 예약되어 충돌 발생

#### 2) Jira 티켓 자동 추출 정규식

* 특정 prefix 없이 **아무 텍스트-숫자** 패턴 허용
* 사용 정규식:

  ```
  [A-Za-z][A-Za-z0-9]*-[0-9]+
  ```

  * 영문 시작 → 프로젝트 키 충돌 최소화
  * 예: `INFE-123`, `TASK-9`, `ABC1-999`

#### 3) 최종 custom command 예시

```yaml
customCommands:
  - key: "<c-o>"
    context: "localBranches"
    description: "Open Jira ticket"
    command: >
      bash -c 'ticket=$(echo {{.SelectedLocalBranch.Name}} |
      grep -oE "[A-Za-z][A-Za-z0-9]*-[0-9]+");
      if [ -n "$ticket" ]; then open "https://{{회사주소}}.atlassian.net/browse/$ticket"; fi'
    showOutput: false
```

#### 4) config.yml 위치

* macOS: `~/Library/Application Support/lazygit/config.yml`
* Linux: `~/.config/lazygit/config.yml`
* Windows: `%LOCALAPPDATA%\lazygit\config.yml`




## [Hammerspoon](https://www.hammerspoon.org/)
- lua 를 사용해 os 위에서 동작하는 스크립트 작성
	- 키보드 한/영 상태일 떄 특정 ui를 바꾸기, 지금 브라우저 URL의 일부분 바꾸기 같은것들을 단축키로 만들 수 있다. (로컬, 개발서버 왔다갔다 할 때 유용함)

## chezmoi를 통한 dotfile 관리

새 머신을 세팅하거나 OS를 밀 때마다 dotfile을 처음부터 다시 만드는 게 번거로웠다. 머신별로 설정이 달라야 하는 경우나 비밀 값 관리까지 한 곳에서 해결하고 싶어서 chezmoi로 정착했다.

### [age](https://github.com/FiloSottile/age)

공개키로 암호화하고, 비밀키로 복호화하는 파일 암호화 도구.

### 키 쌍

`age-keygen`으로 두 개의 키를 생성한다.
- **공개키 (recipient)**: `age12axqydw2l...` → 암호화할 때 사용, 공개해도 안전
- **비밀키 (identity)**: `AGE-SECRET-KEY-...` → 복호화할 때 사용, 절대 비공개

> 현재 비밀키는 `~/.config/chezmoi/key.txt`에 저장

### 암호화/복호화 흐름

```
평문 파일 → [공개키로 암호화] → .age 파일 (GitHub에 올라감)
.age 파일 → [비밀키로 복호화] → 평문 파일
```

### chezmoi와의 연동

**암호화 (chezmoi add --encrypt)**
1. chezmoi가 `~/.zshrc.secrets`를 읽음
2. `chezmoi.toml`의 recipient (공개키)로 age 암호화
3. `encrypted_dot_zshrc.secrets.age`로 저장 → git에 커밋됨

**복호화 (chezmoi apply)**
1. `.age` 파일을 읽음
2. identity (비밀키)로 복호화
3. `~/.zshrc.secrets`에 평문으로 복원

### 왜 안전한가

- `.age` 파일이 GitHub에 노출되어도 비밀키 없이는 복호화 불가
- 비밀키는 로컬(`key.txt`)에만 존재, `.gitignore`로 커밋 차단
- RSA가 아닌 X25519 (타원곡선) 기반이라 키가 짧고 빠름

## [chezmoi](https://www.chezmoi.io/)

홈 디렉토리의 dotfile들을 별도 소스 디렉토리에서 git으로 버전 관리하고, `apply`로 동기화하는 도구.

### 핵심 구조

```
~/code/dotfiles/ (소스, git 관리)     ~/ (실제 적용 위치)
├── dot_zshrc.tmpl          ──apply──→  .zshrc
├── dot_gitconfig.tmpl      ──apply──→  .gitconfig
├── encrypted_*.age         ──apply──→  복호화된 평문 파일
└── run_onchange_*.sh.tmpl  ──apply──→  (변경 시 스크립트 실행)
```

### 파일명 컨벤션

chezmoi는 소스 디렉토리의 **파일명 접두사**로 동작을 결정함:

| 접두사 | 의미 | 예시 |
|--------|------|------|
| `dot_` | `.`으로 변환 | `dot_zshrc` → `.zshrc` |
| `private_` | 권한 0600 적용 | `private_dot_ssh/` → `.ssh/` |
| `encrypted_` | age로 복호화 후 배치 | `encrypted_dot_zshrc.secrets.age` |
| `.tmpl` 접미사 | Go 템플릿 렌더링 | `{{ .chezmoi.homeDir }}` → `/Users/yuroklee` |
| `run_onchange_` | 내용 변경 시 스크립트 실행 | brew bundle 자동화 |

### 주요 워크플로우

```bash
# 파일 수정 → 소스에 반영
vim ~/.zshrc
chezmoi re-add ~/.zshrc    # 소스 디렉토리에 변경사항 덮어쓰기

# 소스 수정 → 홈에 반영
chezmoi edit ~/.zshrc      # 소스 파일을 직접 편집
chezmoi diff               # 적용 전 미리보기
chezmoi apply              # 홈 디렉토리에 적용

# 새 머신에서 한 방에 세팅
chezmoi init --apply <github-repo>
```

### 일반 symlink 방식과의 차이

| | symlink (stow 등) | chezmoi |
|--|---|---|
| 방식 | 심볼릭 링크 | 파일 복사 |
| 템플릿 | 불가 | `{{ .chezmoi.homeDir }}` 등 |
| 암호화 | 별도 도구 필요 | age 내장 지원 |
| 머신별 분기 | 수동 | `.tmpl`에서 OS/호스트별 조건 분기 |
