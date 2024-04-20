---
created: 2023-03-23T16:21:22+09:00
updated: 2024-04-20T16:03:17+09:00
---

# 에러 모니터링
shaka player에서 에러가 발생하면 다음과 같은 형태의 에러 로그를 남겨준다.
```typescript
{ category: number, code: number, data: unknown, severity: number }
```

각 프로퍼티별 숫자 코드가 나타내는 의미는 [공식 문서](https://shaka-player-demo.appspot.com/docs/api/shaka.util.Error.html#.Code)에서 확인할 수 있다.

# 동영상 실행 관련 지식
- 동영상을 전달하는 방식
	- [http chunk 스펙 활용 방식](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding)
		- 파일을 안자르고 http 스펙을 사용해서 자른것 처럼 보내는 방식
	- 실제로 파일을 잘라 전달하는 방식
		- ![[m3u8.png]]
		- 실제로 파일을 잘라서 전송하는 방식
			- m3u8: 영상 재생을 위한 메타 정보
			- ts: 잘개 쪼개진 실제 스트리밍 영상 데이터

# shaka-player interface
- isSeeking()
	- Class: [shaka.ui.Controls](https://shaka-player-demo.appspot.com/docs/api/shaka.ui.Controls.html) 
	- 유저가 마우스나 손가락을 통해 컨트롤 바를 탐색할 때 true가 반환된다.
- trackchanged 이벤트
	- 커스텀 이벤트로 플레이어에 전달되고 있던 트랙이 변경되면 이벤트가 트리거된다. 예를 들면 영상 자체가 변경되는 경우
- getNetworkingEngine()
	- registerRequestFilter, registerRequestFilter
		- 각각 플레이어가 요청, 응답하는 네트워킹 활동에 대해서 파이프 함수를 등록할 수 있다.

# 에러 대응

## H.264 코덱 영상 재생시 4032, 3016 에러 발생
### 에러메시지
`Failed to read the 'buffered' property from 'SourceBuffer'`

### 원인
H.264 High 10 프로파일 코덱을 사용함.
웹 브라우저는 H.264 베이스라인, 메인, 하이 프로파일은 지원하지만 High 10 프로파일은 지원하지 않음.

### 해결방법
영상을 인코딩할 때 원본영상이 10bit라도 강제로 8bit로 인코딩 되도록 함.

### 해결과정
영상 관련지식 구글링하다가 크롬이 제공하는 개발자도구 중 chrome://media-internals 라는걸 알게됨 ([링크](https://www.chromium.org/audio-video/media-internals/))
해당 URL에서는 현재 브라우저에서 재생되고 있는 video/audio 들에 대한 정보와 로그들을 볼 수 있음. 로그에서 에러 관련 메시지를 확인할 수 있었음. 그러나 영상 관련해서 깊은 지식을 가지고 있진 않아 원인 파악 불가
하여 사용중인 claude3 ai 한테 넷플릭스의 영상 재생 전문가라는 역할을 부여한 후, 정보와 로그를 보여줌

그러자 정확한 원인과 해결방법 또한 알려줌. 해당 내용을 유관부서 담당자에게 전달하였고 가지고 있던 지식과 이 정보를 합쳐 문제 해결

0에서 1로 만드는 창의력이 필요한 작업이 아니라 이미 정답이 정해져 있는데, 그게 복잡하고 찾기 어려운 문제의 경우 대화형 AI를 활용하면 엄청 좋다는 걸 체감했다.


# 관련 지식
- [EME (Encrypted Media Extension)란?](https://github.com/LeeJaeBin/About-EME)
- [동영상 플랫폼 이해하기 (1) - HLS](https://americanopeople.tistory.com/336)
- [HTTP Live Streaming](https://d2.naver.com/helloworld/7122)