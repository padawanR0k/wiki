---
title: DOMMatrixReadOnly
tags:
  - Web api
---

[MDN 링크](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrixReadOnly)

> DOMMatrixReadOnly 인터페이스는 2D 및 3D 작업에 적합한 읽기 전용 4×4 행렬을 나타낸다. 


## Properties

### `is2D`  (Boolean)
matrix가 2D matrix로 생성되었으면 `true`를 반환한다. 3D일 경우 false를 반환한다.


### `isIdentity`  
- matrix가 [단위 행렬](https://en.wikipedia.org/wiki/Identity_matrix)인 경우 `true`를 반환한다.


### `m11`, `m12`, `m13`, `m14`, `m21`, `m22`, `m23`, `m24`, `m31`, `m32`, `m33`, `m34`, `m41`, `m42`, `m43`, `m44`
- [배정 밀도 부동 소수점 형식](https://en.wikipedia.org/wiki/Double-precision_floating-point_format)으로된 값이며 [4x4 매트릭스](https://www.w3.org/TR/geometry-1/#DOMMatrix)를 나타낸다.
- 이해하진 못햇지만 2d인 디스플레이 화면에서 3d를 나타내기 위해 벡터공간에서 4x4 행렬을 쓰는것같다.
	- https://www.youtube.com/watch?v=rHLEWRxRGiM&ab_channel=3Blue1Brown
	- https://stackoverflow.com/questions/32565827/whats-the-purpose-of-magic-4-of-last-row-in-matrix-4x4-for-3d-graphics
	- https://stackoverflow.com/questions/29079685/how-does-4x4-matrix-work-in-3d-graphic



### 찾아보게된 경위
- 수직으로 한칸 씩 이동하는 슬라이드를 구현하면서 `transform: translate3d()` 를 사용하게 되었고, 이때 `style` 어트리뷰트 문자열을 파싱하여 y값을 구하는 방법대신 Web API를 찾아보게됨.


### translate 값 조회하기
```javascript
function getTranslateXY(element) {
    const style = window.getComputedStyle(element)
    const matrix = new DOMMatrixReadOnly(style.transform)
    return {
        translateX: matrix.m41,
        translateY: matrix.m42
    }
}
```
