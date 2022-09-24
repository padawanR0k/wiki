---
title: git 딥다이브 - git branch, tag, HEAD
tags:
  - git
---


> 해당 내용은  코드숨 강의 `소프트웨어 개발의 지혜 <Git 편>` 을 보고 정리한 내용입니다.


## Database
깃은 내부적으로 key-value형태인 db를 가지고 있다. 우리가 흔히 깃 로그에서보는 hash을 key로써 사용한다. 흔히 아는 DBMS에서는 CRUD가 가능하지만 git의 DB는 Create, Read만 가능하다. 즉 우리가 날려먹은 커밋은 항상 어딘가에 저장되어있다는 뜻이다.

### hash
해쉬함수는 동일한 입력에 대해서는 동일한 길이의 해쉬값을 반환하는 함수이다. 입력이 조금만 달라도 반환되는 해쉬값은 크게 달라질 수 있다.

깃은 루트 디렉토리부터 재귀적으로 탐색하며 해쉬값을 계산한다. 각 파일과 디렉토리는 해쉬값을 가지게 되고, 깃은 이를 트리구조로 다룬다. 동일한 내용을 가지고 있는 파일들은 같은 해쉬값을 가지기 때문에 중복되지 않게 1개만 저장한다. ([[Blob]] 형태로)


## commit
 `git add .` ,  `git commit -m "first commit"`  명령어로 남기는 commit은 다음과 같은 구조로 이루어져있다.
-   프로젝트의 스냅샷에 대한 최상위 트리의 해쉬값
-   부모 commit의 해쉬값(최초 commit의 경우 `null`)
-   메타데이터(작성자, 이메일, 날짜와 시간, 메시지 등등)
	- 이런 내용을 저장하고 있기 때문에 깃허브 같은곳에서 프로필을 보여줄수 있는것이다.

## git reset
 `git reset --hard bb178` 명령어를 실행시켰을때 코드가 변경되는 과정
 1. 루트 commit의 내용을 조회한다
 2. commit의 타입이 tree이라면 재귀적으로 다시 조회한다.
 3. commit의 타입이 blob이라면 탐색을 멈춘다.
	 1. 저장되어있는 blob과 해쉬값로 실제 데이터를 복구할 수 있다.

## git cat-file
그럼 조회는 어떻게 할 수 있을까?
`git cat-file`은 내부에 저장되어있는 데이터를 직접 조회하여 출력해준다. 실무에서는 사용할 일이 없는 저수준 명령어다. 우리가 흔히 사용하는 `git commit`, `git push` 등은 고수준 명령어다.

아래는 `git cat-file`을 통해 내부를 살펴보는 과정이다.  참고로 `-p` 옵션은 터미널에 출력하기 위해 사용하는 옵션이다.

```
// 가장 최근 commit해쉬값은 97a6d1d0adc60468907eb110edfa261235cbed65 이다
>> git cat-file -p 97a6d1d0adc60468907eb110edfa261235cbed65

tree e6322c144fd063164c7703a08e6b66bc67c3861a // 자식commit의 타입과 해쉬값
parent 2d7d2e753e11456416f094096e8133aa8491d2ca // 부토 commit의 해쉬값
author padawanr0k <padawanr0k@gmail.com> 1662276911 +0900 // 메타정보
committer padawanr0k <padawanr0k@gmail.com> 1662276911 +0900 // 메타정보

edit: update about page // commit 메시지
```

```
>> git cat-file -p e6322c144fd063164c7703a08e6b66bc67c3861a

// 파일인 경우 blob 타입이다.
040000 tree ba76e2fa97e49cd30dcc9cf2144535bfdfe86e4b	.circleci
100644 blob 555497f4ae4d817ea6dbc9fc8b7f1996984ff670	.editorconfig
100644 blob f7bc505cfbec1f078a5c8ebd2e478fa781353c4e	.eslintignore
100644 blob aac0d6af88901909a654863da54dde72b4396696	.eslintrc.js
040000 tree 4570719c6c57b3389e45456a4861a2b23300912a	.github
100644 blob 8a5c6433652426376c1e582f146c2b4ccdb2e989	.gitignore
100644 blob 8351c19397f4fcd5238d10034fa7fa384f14d580	.nvmrc
100644 blob ed1050f5c2796d9ddadad188bc3a6928fde850d6	.prettierrc
100644 blob 78a89585e2f058c91ff035437513739941f1bf62	LICENSE
100644 blob f89b2bb7e811eb7b71eadccad08ef64b8258a92f	README.md
100644 blob 17baafcdf24932a99c232e5989d17e7433bbbc5a	gatsby-config.js
100644 blob 703ed68983760b99ab225a206711950516940b45	gatsby-node.js
100644 blob 563e0ec37fe147f9de692f2e54a9f238e25b0bd1	package-lock.json
100644 blob 52c32892f9f9ca34f4f5c84198d1fe9808c80f7d	package.json
040000 tree c5840f799e2f4fe56eda6ee0d971d331c66dceb7	src
100644 blob 4b508f20101e30970715d0c13e13efe7db688cc9	tsconfig.json
100644 blob 4e09728775d202ffbab842557d6a04e851bf46d8	yarn.lock
```

```
>> git cat-file -p 555497f4ae4d817ea6dbc9fc8b7f1996984ff670 // .editorconfig 파일의 해쉬값


# Editor configuration, see http://editorconfig.org
root = true

[*]
indent_style = space
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```


## commit 간의 상관관계
commit의 해쉬값은 프로젝트 내부의 해쉬값들을 하나의 해쉬값으로 취합한 것이다. 그러므로 파일이 하나라도 변경되면 새로운 commit 해쉬값이 생기는 것이다.
![[git-hash-tree.png]]
### 효율화
파일하나의 변경이 모든 해쉬값을 변경시킨다면 비효율적일 것이다. git db는 트리구조로 데이터들을 관리하기 때문에 변경된 부분의 부모노드를 타고 올라가며 재귀적으로 순회하며 변경한다. 그러므로 불필요하게 자식노드나 형제노드의 해쉬값은 변경되지 않는다. 이게 깃이 빠른 이유이다.

변경된 부분을 직접 출력해보고 싶다면 `git diff A커밋해쉬 B커밋해쉬` 명령어를 사용해보자


## branch, tag, HEAD
branch, tag, HEAD들은 하나의 레퍼런스이다. 특정위치를 기억하기 위해 해쉬값을 기억하고 있는 파일이

### branch
- 하나의 커밋에 고정되지 않고 자식 노드가 생기면 옮겨간다.
- `.git/refs/heads` 에 위치한다.
	-   태그와 비슷하게 브랜치명을 가진 파일이 존재하고, 해쉬값을 가지고 있다.
-   가끔씩 브랜치명에 `/`를 넣는 경우가 있다. 이 경우 내부적으로 파일이 생성될 때 하나의 파일이 아닌 디렉토리와 함께 생성된다.

### tag
하나의 커밋에 고정되어 움직이지 않는다.
-   `.git/refs/tags` 에 위치한다.
-   태그명으로된 파일은 해당 태그가 위치한 커밋의 해쉬를 가지고 있는데 이를 수정하면 태그의 위치도 변경되게된다. 마찬가지로 해달 파일을 삭제하면 태그가 삭제된다.

### HEAD
-   내가 현재 어떤 브랜치를 보고 있는지를 나타낸다.
-   `.git/HEAD` 에 위치한다.
	-   `ref: refs/heads/{{branch name}}` 처럼 현재 브랜치의 위치를 나타내는 값을 가지고 있다.

### git reset
`git reset` 명령어는 코드를 타임머신처럼 이동할 수 있게해준다. 내부적으로는 현재 브랜치가 바라보고 있는 커밋(해쉬값)을 바꾸기 때문에 가능한 것이다.

### logs
-   `git/logs/HEAD`
    -   지금까지 만든 커밋 해쉬값들을 저장하고 있다.
    -   `git reset`으로 실수로 커밋을 날렸을 때, 실제로는 커밋해쉬들이 여기에 저장되기 때문에 커밋이 날라간게 아니다
-   `git reflog`
    -   `git/logs/HEAD`에 저장된 커밋 해쉬들을 볼 수 있는 명령어다.

## 생각해보기

### **브랜치와 태그는 무엇인가요? 무엇을 저장하고 있나요?**
-   브랜치와 태그는 둘다 파일로 다루어진다.
-   브랜치명에 `/`를 추가하면 파일로 저장될때 폴더링이 되어 저장된다.
-   브랜치는 브랜치의 이름과 가장 최근 커밋을 저장하고 있다. 특정 브랜치에서 커밋을 추가하면 최근 커밋의 자식 노드가 생기고 자식노드는 이전 커밋을 부모로 가진다.
-   태그는 특정 커밋을 저장한다. 태그는 중복될 수 없다.
-   태그 또한 파일로 관리되는데, 이를 직접 편집기로 열어 수정하면 태그가 달리는 커밋을 변경할 수도 있다.

### **브랜치와 태그의 차이점은 무엇인가요?**
-   브랜치는 부모 브랜치로부터 분기가 된 후, 말단 노드를 계속 업데이트해 나간다. 브랜치 정보를 저장하고 있는 파일의 해쉬값은 커밋이 추가될 때 마다 변경된다.
-   태그는 변하지 않는다. 어떤 커밋에 태그를 달게 되면 태그파일이 생성되고, 태그파일에 해당 커밋 해쉬값을 저장한다.
-   브랜치는 마치 학교의 교장선생님, 교감선생님 직무와 비슷하다. 교장선생님들은 1대, 2대 이런식으로 몇대인지 앞에 태그가 붙게된다. 모두 같은 직무를 수행해나가고 있는건 맞지만, 구별하기 위해 태그를 붙인다.

### **현재 가리키고 있는 브랜치가 무엇인지 어떻게 알 수 있나요?**
-   현재 내가 위치한 곳의 정보는 git의 `HEAD`를 통해 알 수 있다.
-   `HEAD` 는 `git/HEAD` 파일에 저장된다. 해당 파일을 보면 `ref: refs/heads/{{branch name}}` 이런식으로 내가 현재 위치한 브랜치의 파일 위치를 저장하고 있기 때문에 현재 내가 위치한 브랜치가 어딘지 알 수 있다.