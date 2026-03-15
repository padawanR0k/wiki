---
name: wiki-page
description: 개발 wiki에 새 페이지를 빠르게 생성합니다. 개념/단어와 정보를 받아 적절한 frontmatter, 태그를 포함한 md 파일을 만들고, 기존 페이지와의 관련성을 확인하여 백링크/참조 연결을 제안합니다.
---

# Wiki Page Creator

개발 wiki(content/posts/)에 새 마크다운 페이지를 생성하는 스킬.

## 언어: 모든 출력은 한국어

## 실행 흐름

### Step 1: 입력 파악

사용자가 제공한 정보에서 다음을 추출한다:
- **주제/개념**: 페이지의 핵심 주제
- **내용**: 사용자가 전달한 정보, 설명, 코드 등
- **카테고리 힌트**: 사용자가 명시한 분류가 있으면 사용

### Step 2: 기존 페이지 중복/관련성 검사

새 페이지를 생성하기 **전에** 반드시 기존 wiki 페이지를 검색한다:

1. `content/` 디렉토리 아래 모든 `.md` 파일을 Glob으로 탐색
2. 주제 키워드로 파일명 및 파일 내용을 Grep으로 검색
3. 관련 태그로도 검색

검색 결과를 다음과 같이 분류하여 사용자에게 보고:
- **중복 의심**: 동일 주제의 기존 페이지가 있는 경우 → 새로 만들지 기존 페이지를 업데이트할지 확인
- **관련 페이지**: 교차하는 지식이 있는 페이지 목록 → 백링크 연결 제안

### Step 3: 카테고리 및 경로 결정

기존 디렉토리 구조를 참고하여 적절한 위치를 결정한다:

```
content/posts/           # 기본 위치
content/posts/javascript/   # JS 관련
content/posts/library/      # 라이브러리/도구
content/posts/error/        # 버그/에러 해결
content/posts/books/        # 책 학습
content/posts/study/        # 강의/스터디
content/posts/frontend/     # 프론트엔드
content/posts/cloud/        # 클라우드/인프라
content/posts/web/          # 웹 일반
content/posts/monitoring/   # 모니터링
content/posts/seo/          # SEO
content/posts/regex/        # 정규표현식
content/Web_API/            # Web API
```

기존 카테고리에 맞지 않으면 `content/posts/` 바로 아래에 생성하거나, 필요시 새 하위 디렉토리를 제안한다.

### Step 4: 파일명 결정

- **기본**: kebab-case 영문 (`react-query-caching.md`)
- 한글 제목이 더 자연스러운 경우 한글 파일명도 허용
- 시리즈물이면 숫자 접미사: `topic-01.md`, `topic-02.md`

### Step 5: Frontmatter 생성

아래 형식을 따른다:

```yaml
---
title: {페이지 제목 - 한글 선호}
date: {오늘 날짜 YYYY-MM-DD}
updated: {오늘 날짜 YYYY-MM-DD}
tags:
  - {태그1}
  - {태그2}
---
```

**태그 규칙:**
- 기존 wiki에서 사용 중인 태그가 있으면 재사용 (일관성 유지)
- 기술명은 소문자 영문: `javascript`, `git`, `react-query`
- 한글 태그도 가능: `성능최적화`, `개선`, `디깅`
- 하이픈 포함 태그는 따옴표: `"react-query"`
- 1~3개가 적당

### Step 6: 내용 작성

사용자가 제공한 정보를 기반으로 wiki 페이지 본문을 작성한다:
- 간결하고 실용적인 톤
- 코드 예제가 있으면 적절한 언어 태그와 함께 코드블록 사용
- 핵심 개념을 먼저, 세부사항은 뒤에
- 외부 참조 링크가 있으면 `[텍스트](URL)` 형식으로

### Step 7: 백링크/참조 연결 제안

Step 2에서 발견한 관련 페이지에 대해:

1. 관련 페이지 목록을 보여준다
2. 사용자에게 묻는다:
   - "관련 페이지에 백링크를 걸까요?" (기존 페이지에 새 페이지 링크 추가)
   - "새 페이지에서 관련 페이지를 참조할까요?" (새 페이지에 `[[기존페이지]]` 링크 추가)
3. 사용자가 승인하면:
   - 새 페이지: `[[관련페이지]]` 형식으로 wiki 링크 추가
   - 기존 페이지: 적절한 위치에 `[[새페이지]]` 링크 추가

**링크 형식:**
- 내부 문서 참조: `[[파일명]]` (Obsidian wiki 링크)
- 외부 참조: `[텍스트](https://...)` (마크다운 링크)
- 이미지: `![[이미지파일.png]]`

## 출력 형식

### 페이지 생성 전 보고

```
📂 경로: content/posts/javascript/closure.md
📝 제목: 클로저(Closure) - JavaScript의 핵심 개념
🏷️ 태그: javascript

🔍 관련 페이지 검색 결과:
  - [관련] content/posts/javascript/asynchronous.md - 비동기에서 클로저 활용 언급
  - [관련] content/posts/javascript/scope.md - 스코프 체인 관련

이대로 생성할까요?
```

### 생성 후 백링크 제안

```
✅ 페이지가 생성되었습니다: content/posts/javascript/closure.md

🔗 백링크 제안:
  1. content/posts/javascript/asynchronous.md에 [[closure]] 링크 추가
  2. 새 페이지에서 [[asynchronous]] 참조 추가

연결할까요? (전체/선택/건너뛰기)
```
