---
created: 2024-05-12T17:56:49+09:00
updated: 2024-05-24T14:27:21+09:00
---

가끔 구글에서 특정 키워드로 검색을 하고 난 후 검색 결과 페이지로 이동하면 그 키워드가 형광펜으로 칠해진 채로 이동하는 걸 볼 수 있다. 이는 DOM (Document Object Model)의 동작이라기 보다는 BOM (Browser Object Model)의 동작이다.

바로 [텍스트 프래그먼트](https://web.dev/articles/text-fragments?hl=ko)가 이를 가능하게 한다. URL 해시에 특정 구분자를 넣어 강조하고 싶은 문자열을 지정하면 문서에서 문자열과 매칭되는 곳에 강조표시를 해준다.

[`https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html==#:~:text=ECMAScript%20Modules%20in%20Web%20Workers==`](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules%20in%20Web%20Workers)
![[Pasted image 20240512175949.png]]
이런식으로 말이다.

크롬에서 우클릭하여


일치시킬 문자열은 다양한 방법으로 지정할 수 있다.
- [시작점과 종료점 설정](https://web.dev/articles/text-fragments?hl=ko)
- [`prefix-` , `-suffix` 일치 조건 설정](https://web.dev/articles/text-fragments?hl=ko#prefix-_and_-suffix)
- [한 번에 여러 개의 문자열 일치시키기](https://web.dev/articles/text-fragments?hl=ko#multiple_text_fragments_in_one_url)

### 스타일 지정
강조 표시는 노란색 배경색으로 입혀지는데, 이는 `::target-text` 선택자를 활용하여 커스텀할 수 있다
```css
:root::target-text {  color: black;  background-color: red;}
```

### 지원
아쉽게도 엣지와 크롬에서만 기본적으로 지원하고 사파리의 경우 [특정 플래그를 켜야지만](https://www.reddit.com/r/MacOS/comments/14l1gcu/how_to_disable_safari_automatically_highlighting/) 사용가능하다.

