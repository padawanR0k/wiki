---
title: "웹에서\b영상 재생을 하기 위한 주변 지식"
date: 2024-04-10
tags:
  - javascript
  - 플레이어
created: 2024-04-10T11:21:44+09:00
updated: 2024-04-10T11:21:44+09:00
---
# 영상재생

# HLS (HTTP Live Streaming)
- 장점
    - Apple에서 개발한 프로토콜로 iOS, macOS에서 기본 지원
    - HTTP 기반으로 CDN과 호환성이 좋음
    - 적응형 비트레이트 스트리밍으로 네트워크 상태에 따라 화질 조절 가능
- 단점
    - 초기 버퍼링 시간이 길 수 있음    
    - 라이브 스트리밍 시 지연 시간(latency)이 발생할 수 있음.m3u8, .ts
        
## 동작
1. **인코딩:** HLS 은 [H.264](https://www.cloudflare.com/learning/video/what-is-h264-avc/ "https://www.cloudflare.com/learning/video/what-is-h264-avc/")나 H.265 인코딩을 사용해야 합니다.
    1. 왜? 비디오 데이터의 포맷을 다시 설정하여 모든 장치가 데이터를 인식하고 해석할 수 있게 합니다.
2. **조각화:** 비디오는 몇 초 길이로 조각낸다 → 세그먼트. 세그먼트 길이는 다양하지만 기본 길이는 6초
    - 비디오를 세그먼트로 나누는 것과 더불어 HLS는 비디오 세그먼트의 인덱스 파일을 만들어 세그먼트의 순서를 기록합니다.        
    - HLS는 또한 480p, 720p, 1080p 등의 다양한 품질로 여러 세트의 세그먼트를 복제합니다
    - 조각난 파일은 `.ts` 확장자로 저장되고 불러옴
[참고](https://www.cloudflare.com/ko-kr/learning/video/what-is-http-live-streaming/ "https://www.cloudflare.com/ko-kr/learning/video/what-is-http-live-streaming/")

# DASH (Dynamic Adaptive Streaming over HTTP)
- 장점
    - MPEG에서 개발한 개방형 표준 프로토콜
    - 적응형 비트레이트 스트리밍으로 최적의 화질 제공
- 단점
    - 인코딩 및 패키징 과정이 복잡함
    - 브라우저별로 지원 여부가 다를 수 있음
        

## 동작

_HLS랑 동일하게 미디어 파일을 조각내서 저장_
- **인코딩 및 조각화:** 원본 서버가 비디오 파일을 몇 초 길이의 세그먼트로 나눕니다. 서버는 비디오 세그먼트에 대한 목차와 유사한 색인 파일도 생성합니다. 그런 다음 세그먼트를 인코딩하는데, 이는 다양한 장치가 해석할 수 있는 형식으로 변경된다는 말입니다. MPEG-DASH에서는 어떠한 인코딩 표준도 사용할 수 있습니다.
- **전송:** 사용자가 스트림을 보기 시작하면 인코딩된 비디오 세그먼트가 인터넷을 통해 클라이언트 장치로 푸시됩니다. 거의 모든 경우에 [콘텐츠 전송 네트워크 (CDN)](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/ "https://www.cloudflare.com/learning/cdn/what-is-a-cdn/")는 스트림을 보다 효율적으로 배포하는 데 도움이 됩니다.
- **디코딩 및 재생:** 사용자 장치가 스트리밍된 데이터를 수신하면 데이터를 디코딩하고 비디오를 재생합니다. 비디오 플레이어는 네트워크 조건에 적응하기 위해 품질 수준을 자동으로 전환합니다. 예를 들어 사용자의 대역폭이 작다면 비디오는 대역폭을 적게 사용하는 낮은 품질 수준에서 재생됩니다.
[링크](https://www.cloudflare.com/ko-kr/learning/video/what-is-mpeg-dash/ "https://www.cloudflare.com/ko-kr/learning/video/what-is-mpeg-dash/")

# .m3u8
- HLS에서 사용되는 재생 목록(playlist) 파일 포맷
- 비디오 **세그먼트** 정보와 URL을 포함하여 플레이어가 순차적으로 재생할 수 있도록 함
`세그먼트는 분할, 구간, 세부부분, 쪼개는 것 이라는 뜻을 가지고 있습니다`

# 세그먼트 파일 포맷

## .ts (MPEG-2 Transport Stream)

1. 개념
    - HLS에서 사용되는 비디오/오디오 세그먼트 파일 포맷
    - MPEG-2 TS 컨테이너에 인코딩된 비디오와 오디오를 포함
2. 장점
    - 방송 및 스트리밍에 최적화된 포맷
    - 다중 프로그램 전송 및 DRM 적용 가능
3. 단점
    - 파일 크기가 상대적으로 큼
        

## fMP4 (Fragmented MP4)
- DASH에서 주로 사용되는 세그먼트 파일 포맷
- MP4 컨테이너를 기반으로 하며, 파일 단위로 분할되어 전송
## WebM
- Google에서 개발한 개방형 미디어 파일 포맷
- VP8, VP9 비디오 코덱과 Vorbis, Opus 오디오 코덱 지원

# 저작권 보호

## HLS Encryption
- 개념
    - HLS에서 제공하는 콘텐츠 보호 메커니즘
    - AES-128 암호화를 사용하여 미디어 _세그먼트_를 암호화
    - 키 교환 과정을 통해 인증된 사용자만 복호화하여 재생 가능 ← 암호화 수단
- 장점
    - 대부분의 디바이스와 플레이어에서 지원
    - 키 교환 과정이 비교적 간단하여 구현이 용이    
- 단점
    - 키 관리 및 교환 과정에서 취약점 발생 가능    
        - 즉, 키 관리 방법을 뚫리게 되면 컨텐츠가 위험해진다.
    - 녹화가 되기에 높은 수준의 보안이 요구되는 콘텐츠에는 부적합할 수 있음

## DRM
- 개념
    - 디지털 콘텐츠의 불법 복제 및 유통을 방지하기 위한 기술
    - 암호화 ↔︎ 라이선스 관리 ↔︎ 사용자 인증 등을 통해 콘텐츠 보호
    - 각 DRM 솔루션마다 고유한 암호화 및 라이선스 관리 방식 사용    
- 장점
    - 제일 강력한 컨텐츠 보호 기능
    - 다양한 비즈니스 모델(구독, 대여, 구매 등) 지원
- 단점
    - DRM 솔루션 간 호환성 문제 발생 가능
    - 구현 및 유지보수 _비용 증가_
- DRM 솔루션 종류
    - fairplay
    - widevine
    - playready
        

### FairPlay
- Apple의 DRM 솔루션
- HLS와 함께 사용되며, iOS와 macOS에서 기본 지원
- 서버와 클라이언트 간 인증서 기반 키 교환 방식 사용

### Widevine
- Google의 DRM 솔루션
- DASH와 함께 사용되며, Android와 Chrome에서 기본 지원