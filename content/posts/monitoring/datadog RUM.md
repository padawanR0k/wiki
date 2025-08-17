---
title: 프론트엔드 모니터링 - datadog RUM 알아보기
date: 2025-08-16
updated: 2025-08-16
tags:
  - 모니터링
created:
---
# 어떤걸 수집하는가 - Attribute
프론트엔드에서 가져올 수 있는 거의 대부분의 정보를 가져와 수집합니다. 그리고 특정 기간동안 저장합니다. 어떤 정보들을 얼마나 오랫동안 저장하는지는 이 [링크](https://docs.datadoghq.com/ko/real_user_monitoring/browser/data_collected/#%EA%B0%9C%EC%9A%94)에서 확인할 수 있습니다.

![[Pasted image 20250817142735.png]]
저장하는 정보들의 구분은 위와 같은 계층을 가지고 있습니다. 위에서 볼 수 있듯 세션은 여러 뷰를 가지고 있고 뷰는 유저 액션, 리소스, 에러, 롱 태스크를 여러개 가질 수 있습니다.

그리고 각 계층은 어트리뷰트들을 가지고 있습니다. 
어떤 계층이 어떤 어트리뷰트를 남기고 어떤 정보를 남기는지에 대한 정보는 이 [링크](https://docs.datadoghq.com/ko/real_user_monitoring/browser/data_collected/#%EA%B8%B0%EB%B3%B8-%EC%86%8D%EC%84%B1)에 자세히 나와있습니다.

## 모니터링할 때 자주 보는것들만 나열하자면

### View 계층에 종속된 어트리뷰트

| 속성 이름                 | 설명                                                                                   | 팁                                                                                |
| --------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `view.referrer`       | 현재 요청된 페이지로 연결되는 링크를 따르는 이전 웹 페이지의 URL.                                              | - 페이지 유입이 어디서 왔나 확인하기 좋음.<br/>- 서비스 내부 이동 링크에 norefferer 를 사용하면 이 값을 볼 수 없음. |
| `view.url`            | 보기 URL.                                                                              |                                                                                  |
| `view.url_host`       | URL의 호스트 부분.                                                                         |                                                                                  |
| `view.url_path`       | URL의 경로 부분.                                                                          |                                                                                  |
| `view.url_path_group` | 유사한 URL(예: `/dashboard/123`및 `/dashboard/456`의 경우 `/dashboard/?`)에 대해 생성된 자동 URL 그룹. |                                                                                  |
| `view.url_query`      | URL의 쿼리 문자열 부분이 쿼리 파라미터 키/값 속성으로 분해됩니다.                                              |                                                                                  |

### Device, OS 정보

서비스에서 미디어를 제공하거나 특정 기기에 특화된 UX/UI를 제공하는 경우, 어떤 기기를 가진 유저가 어떻게 사이트를 활용하는지 보기 편합니다.

| 속성 이름          | 설명                                        | 팁                                                                                                                 |
| -------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `device.type`  | 디바이스에서 보고한 디바이스 유형 (User-Agent HTTP 헤더).  |                                                                                                                   |
| `device.brand` | 디바이스에서 보고한 디바이스 브랜드 (User-Agent HTTP 헤더). |                                                                                                                   |
| `device.model` | 디바이스에서 보고한 디바이스 모델 (User-Agent HTTP 헤더).  | - 안드로이드유저 중 모델 이름이 K인 경우가 자주보이는데 관련한 정보는 [페이지 참고](https://mobiforge.com/research-analysis/the-mysterious-model-k) |
| `device.name`  | 디바이스에서 보고한 디바이스 이름 (User-Agent HTTP 헤더).  |                                                                                                                   |

| 속성 이름              | 설명                                     |
| ------------------ | -------------------------------------- |
| `os.name`          | 디바이스에서 보고한 OS 이름 (User-Agent HTTP 헤더). |
| `os.version`       | 디바이스에서 보고한 OS 버전 (User-Agent HTTP 헤더). |
| `os.version_major` | 디바이스에서 보고한 OS 버전 (User-Agent HTTP 헤더). |

설명에서 볼 수 있듯 HTTP 헤더를 보고 분석하기 때문에 더 자세한 정보를 얻고 싶으면 [navigator.userAgentData.getHighEntropyValues](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/getHighEntropyValues) 같은 API를 사용해 정보를 조회해  custrom attributes로 기록해야합니다. 이런 기록은 [글로벌 컨텍스트 추가 API](https://docs.datadoghq.com/ko/real_user_monitoring/browser/advanced_configuration/?tab=npm#%EA%B8%80%EB%A1%9C%EB%B2%8C-%EC%BB%A8%ED%85%8D%EC%8A%A4%ED%8A%B8-%EC%86%8D%EC%84%B1-%EC%B6%94%EA%B0%80)를 사용하려 남길 수 있으며 세션 계층 레벨에서부터 확인할 수 있습니다.
- [Detect Windows 11 and CPU architecture using User-Agent Client Hints - Microsoft Edge Developer documentation | Microsoft Learn](https://learn.microsoft.com/ko-kr/microsoft-edge/web-platform/how-to-detect-win11)


## Geolocation
 어느 지역에서 접속했는지 확인할 수 있습니다. 국제화가 적용된 서비스의 경우 외국에서 접속한다고 해서 꼭 외국인이라는 보장이 없기 때문에 진짜 해외유저인지 확인하고 싶다면, 유저명을 남기거나 custom attributes에 가입할 때 입력한 국가를 럼에 표시하는걸 추천합니다.

| 이름                        | 설명                                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| `geo.country`             | 국가 이름.                                                                                               |
| `geo.country_subdivision` | 국가의 첫 번째 세분 수준 이름 (예: 미국에서 `California` 또는 프랑스에서 `Sarthe` 부서).                                       |
| `geo.continent`           | 대륙의 이름 (`Europe`, `Australia`, `North America`, `Africa`, `Antarctica`, `South America`, `Oceania`). |
| `geo.city`                | 도시 이름 (예, `Paris` 또는 `New York`).                                                                    |
| `geo.as.domain`           | 접속한 인터넷의 도메인 정보 (`skbroadband.com`)                                                                  |
| `geo.as.name`             | 인터넷 제공자 (`SK Broadband Co Ltd`)                                                                      |
| `geo.as.type`             | 인터넷 타입 (`isp`)                                                                                       |

가끔 특정 유저들에게만 특이한 오류 CS가 인입되서 트래킹하다보면 사내 네트워크 방화벽이 원인인 경우가 종종있는데 그런 경우 `geo.as.*` 정보가 파악에 도움이 됩니다.


# 어떻게 원하는걸 찾는가 - Query
데이터독에선 SQL처럼 정보를 조회하기 위한 쿼리를 제공합니다. 
해당 쿼리에 대한 문법은 이 [링크](https://docs.datadoghq.com/ko/logs/explorer/search_syntax/)에서 확인할 수 있습니다.
- 기본적인 `AND` , `OR` 연산자
- 특정 조건만 제외할 수 있는 `-` 
- 문자열 앞,뒤에 `*`를 붙여 와일드카드 검색 
- 숫자인 경우 계산된 검색 `@http.response_time:>100` 
등 다양한 쿼리를 지원합니다.

![[CleanShot 2025-08-17 at 16.03.24@2x.png]]
만약 Attribute는 있는데 쿼리로 조회할 수 없는 경우 facet 또는 measure 등록을 해야합니다.

### 데이터독에서의 facet, measure
Datadog의 Real User Monitoring(RUM)에서 커스텀 어트리뷰트를 검색 가능하게 만들기 위해서는 해당 어트리뷰트를 'Facet' 또는 'Measure'로 설정해야 합니다. 'Facet'과 'Measure'는 RUM 데이터를 효율적으로 분석하고 시각화하는 데 중요한 역할을 합니다.

**Facet**:

- **정의**: Facet은 로그의 특정 속성(attribute)이나 태그(tag)의 고유한 값들을 표시하며, 이를 통해 데이터를 필터링하거나 그룹화할 수 있습니다.
- **용도**: 주로 질적(qualitative) 데이터 분석에 사용되며, 특정 속성의 분포를 파악하거나 해당 속성으로 데이터를 필터링할 때 유용합니다.
- **예시**: 사용자의 국가, 브라우저 종류, 운영 체제 등과 같은 속성을 Facet으로 설정하여 해당 값들로 데이터를 분류하고 분석할 수 있습니다.

**Measure**:

- **정의**: Measure는 RUM 이벤트 내의 수치형(numerical) 값을 나타내는 속성입니다.
- **용도**: 주로 양적(quantitative) 데이터 분석에 사용되며, 특정 수치 데이터의 합계, 평균, 백분위수 등을 계산하고 시각화할 때 활용됩니다.
- **예시**: 페이지 로드 시간, 사용자 세션 지속 시간, 에러 발생 횟수 등을 Measure로 설정하여 해당 값들의 통계치를 분석할 수 있습니다.

커스텀 어트리뷰트를 Facet이나 Measure로 설정하려면, RUM Explorer에서 해당 어트리뷰트를 선택한 후 'Facet 추가' 또는 'Measure 추가' 옵션을 통해 설정할 수 있습니다. 이를 통해 해당 어트리뷰트를 검색, 필터링, 시각화 등에 활용할 수 있게 됩니다.



# 실제 사용 사례 

기록한걸 어떻게 활용할건지는 어떤 서비스를 운영하느냐에 따라 다 다를거 같습니다. 
아래는 실제 사용하는 예시이며 참고하여 인사이트를 얻는데 도움이 되면 좋을거 같습니다.

### 오래 걸리는 리소스를 파악하기 위한 쿼리
![[CleanShot 2025-08-17 at 16.10.19@2x.png]]

### 이미지 최적화 기능 적용 후 비교하기 위한 쿼리
- `@resource.url:(*w=* OR *f=avif*) @resource. type: image`
	- 특정 파라미터가 있는지 확인하고, 리소스 타입으로 필터함
![[CleanShot 2025-08-17 at 16.15.02@2x.png]]
![[CleanShot 2025-08-17 at 16.16.05@2x.png]]

###  특정 경로 접근하는 유저들의 기기 조회 쿼리
- `@view.url_path_group:/ja*`
	- 특정 경로로 접근하는 유저 조회

![[CleanShot 2025-08-17 at 16.20.32@2x.png]]

### 특정 경로 일 때 어떤 API가 느린지 조회 쿼리
- `@view.url_path_group:/ja/* @resource.url_host:{{API host url}} -@resource.url_host:{{제외하고 싶은 url}}`

![[CleanShot 2025-08-17 at 16.22.45@2x.png]]



