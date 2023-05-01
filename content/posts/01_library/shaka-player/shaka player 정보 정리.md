---
created: 2023-03-23T16:21:22+09:00
updated: 2023-05-01T16:22:52+09:00
---
## 트러블 슈팅
- isSeeking()
	- Class: [shaka.ui.Controls](https://shaka-player-demo.appspot.com/docs/api/shaka.ui.Controls.html) 
	- 유저가 마우스나 손가락을 통해 컨트롤 바를 탐색할 때 true가 반환된다.
- trackchanged
	- 커스텀 이벤트로 플레이어에 전달되고 있던 트랙이 변경되면 이벤트가 트리거된다. 예를 들면 영상 자체가 변경되는 경우

### 에러 모니터링
shaka player에서 에러가 발생하면 다음과 같은 형태의 에러 로그를 남겨준다.
```typescript
{ category: number, code: number, data: unknown, severity: number }
```

각 프로퍼티별 숫자 코드가 나타내는 의미는 [공식 문서](https://shaka-player-demo.appspot.com/docs/api/shaka.util.Error.html#.Code)에서 확인할 수 있다.

### 동영상 실행 관련 지식
- 동영상을 전달하는 방식
	- [http chunk 스펙 활용 방식](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding)
		- 파일을 안자르고 http 스펙을 사용해서 자른것 처럼 보내는 방식
	- 실제로 파일을 잘라 전달하는 방식
		- ![[m3u8.png]]
		- 실제로 파일을 잘라서 전송하는 방식
			- m3u8: 영상 재생을 위한 메타 정보
			- ts: 잘개 쪼개진 실제 스트리밍 영상 데이터


## 관련 지식
- [EME (Encrypted Media Extension)란?](https://github.com/LeeJaeBin/About-EME)
- [동영상 플랫폼 이해하기 (1) - HLS](https://americanopeople.tistory.com/336)
- [HTTP Live Streaming](https://d2.naver.com/helloworld/7122)