---
title: callback부터 async await까지 - Javascript 비동기
date: 2021-08-24
tags:
  - javascript
---

# 동기와 비동기
일반적으로 프로그램의 코드는 순차적으로 진행된다. 두번째 실행되는 코드는 첫번쨰 실행되는 코드가 완료될 때 까지 기다린 후 실행된다. 성능이 좋지 않은 컴퓨터로 특정 사이트에 접속했을 때, 화면이 보이기 전에 커서가 기다림을 나태나는 커서로 변하는걸 본적이 있을것이다. 이는 화면을 그리는 코드보다 먼저 실행되는 코드가 처리되는데 오래걸려서 생기는 현상이다. 이런 현상을 **blocking**이라 부르며, 이는 사용자의 경험을 망치는 요인중 하나이다. 여러 작업을 해야할 때 사용자를 기다리게하지 않기 위해 비동기 프로그래밍이 필요하다. **결국 사람이 편하자고 나온 것들이다 전부**

## 실생활에서의 예시
해결해야하는 A테스크와 B테스크가 있다고 가정하자.

### 동기적으로 일을 하는 경우
- 절차
  1. A테스크를 할일 목록에 넣는다.
  2. A테스크를 처리한다.
  3. B테스크를 할일 목록에 넣는다.
  4. B테스크를 처리한다.
- 실생활 예시
  - 줄을 서서 버스표예매를 하는 경우를 생각해보자. 가장 앞에 있는 사람만 표예매를 진행할 수 있고 뒤에있는 사람들은 그냥 기다리는 방법밖에없다.

### 비동기적으로 일을 하는 경우
- 절차
  1. A테스크를 할일 목록에 넣는다.
  2. B테스크를 할일 목록에 넣는다.
  3. A테스크를 처리한다.
  4. B테스크를 처리한다.
- 실생활 예시
  - 줄을 서있는 카페에 가서 커피를 시키는 경우를 생각해보자. 가장 앞에 있는 사람은 어떤것을 주문할지 말한 후, 진동벨을 받아 자리에 앉아 기다린다. 일하는 사람은 일단 주문부터 다 받고, 커피를 만들기 시작한다.

## Javascript가 비동기를 다루는 법
자바스크립트는 단일 스레드 위에서 작동한다. 함수가 호출되면 javascript 엔진은 함수를 평가하는 과정에서 해당 함수의 실행 컨텍스트를 생성한다. 그리고 그 컨텍스트는 콜 스택에 푸시된다. 콜 **스택**에 쌓인 실행 컨텍스트는 하나씩 POP되어 실행된다.

`setTimeout`, `setInterval`, HTTP 요청, 이벤트 핸들러같은 비동기적인 함수들은 어떻게 처리될까?

### 이벤트 루프와 이벤트 큐
![https://poiemaweb.com/js-event](https://poiemaweb.com/img/event-loop.png)
이벤트 루프, 큐는 유튜브 영상을 보는 동시에 댓글도 작성할 수 있는 것처럼 여러작업을 동시에 하는 것을 지원해준다.
- 이벤트 루프
  - 콜 스택과 이벤트 큐를 계속 감시하고 있다가, 콜 스택이 비어 있으며 테스크 큐에 대기중인 비동기 함수가 있을 경우 대기중인 함수를 콜 스택에 이동시켜 실행시킴
- 이벤트 큐 (*콜백 큐, 테스크 큐 라고 불리기도함*)
  - 비동기 함수 또는 이벤트 핸들러가 일시적으로 보관되는 영역
- 마이크로 테스크 큐
  - Promise의 후속처리 메서드의 콜백 함수가 보관되는 영역

## 비동기 다뤄보기
### 1. callback패턴
```javascript
const request = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
        callback(xhr.response)
    }
    xhr.send();
}
request('https://jsonplaceholder.typicode.com/todos/1', console.log)
```
콜백 패턴은 가장 기본적인 패턴이다.

내장 API인 `XMLHttpRequest`는 `onload()`라는 이벤트 핸들러를 지원한다. 이는 요청이 에러없이 완료되었을 때 실행된다. 해당 함수는 요청에 성공하면 실행시킬 콜백 함수를 매개변수로서 전달하였다. 그런데 만약 A요청으로 얻어온 정보를 가지고 B요청에 사용하려 하면 어떻게 해야될까?
```javascript
request('https://jsonplaceholder.typicode.com/todos/1', (response) => {
  const userId = response.user.id; // 예시입니다.
  request(`https://jsonplaceholder.typicode.com/users/${userId}`, console.log)
})
```
이처럼 연속되는 비동기처리를 하려고하면 콜백 함수의 중첩이 발생하고 이는 코드의 복잡성을 높아지게한다.
```javascript
const request = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
        callback(xhr.response)
    }
    xhr.send();
}
try {
    request('https://jsonplaceholder.typicode.com/todos/1', () => {
        throw new Error()
    })
} catch (e){
    consooe.error(e)
}
// 에러가 캐치되지 않는다!
```
`try catch`문을 통해 에러가 캐치되지 않는 것도 큰 문제이다. 에러는 caller(함수를 호출한 컨테스트)방향으로 전파되는데, 에러가 발생했을 때는 전파되어야할 컨테스트가 사라지기 때문이다.
1. 비동기 함수인 `onload`가 호출되면 실행 컨텍스트가 만들어지고 콜 스택에 PUSH된다.
2. 비동기 함수이므로 콜백 함수가 호출되는 것을 기다리지 않고 바로 스택에서 제거된다.
3. 이후 응답을 받은 후 이벤트 큐에서 콜백 함수가 이벤트 큐로 이동되고 콜 스택이 비어질때 까지 기다리다가 이벤트 루프에 의해 콜 스택으로 PUSH되어 실행된다.

`2`에서 `onload`가 실행 컨텍스트가 제거되었기 때문에 콜백 함수의 caller는 `request`함수가 아니게되어 의도했던거처럼 전파가 되지않아 에러처리가 되지 않는다.

### 2. Promise
위 문제를 해결하기 위해 Promise 빌트인 객체가 도입되었다. Promise는 비동기 함수 성공와 실패를 처리할 콜백 함수를 받는다. 리턴값은 Promise객체이다. ([브라우저별 지원형황](https://caniuse.com/?search=Promise))

```javascript
const promise = new Promise((resolve, reject) => {
  ...
  if (비동기 성공여부) {
    resolve('성공');
  } else {
    reject('실패');
  }
})
console.log(promise) // Promise {<pending>}
```
Promise 객체는 3가지 상태를 가진다.
- `pending`
  - 비동기 처리 대기중 (기본상태)
- `fulfilled`
  - 비동기 처리 성공 (콜백 함수 내부 `resolve()`로 인해 변경됨)
- `rejected`
  - 비동기 처리 실패 (콜백 함수 내부 `reject()`로 인해 변경됨)

```javascript
const request = (url) => {
    return new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = () => {
            if (xhr.status === 200) {
                res(JSON.parse(xhr.response))
            } else {
                rej(xhr.status)
            }
        }
        xhr.send();
    })

}
request('https://jsonplaceholder.typicode.com/todos/1')
  .then(res => console.log(res)) // 성공시
  .catch(err => console.error(err)) // 실패시
```
- `Promise.prototype.then`
  - Promise가 `fulfilled`상태가 되면 호출되는 메서드
- `Promise.prototype.catch`
  - Promise가 `rejected`상태가 되면 호출되는 메서드

```javascript
request('https://jsonplaceholder.typicode.com/todos/1')
  .then(res => request(`https://jsonplaceholder.typicode.com/users/${res.userId}`))
  .then(res => console.log(res))
  .catch(err => console.error(err))
```
`then`메서드 체이닝을 통해 연속적인 비동기 작업처리했다. 아까 콜백 패턴보다 더 보기 편하다.

### 3. 제너레이터
ES6에 도입된 제너레이터는 함수 내부 코드 블록을 실행했다가, 일시중지했다가 다시 실행시킬수 있는 특수한 함수다. 즉 기존 함수들은 들어가고 나가는게 1번씩만 가능하다. 제너레이터는 여러번 할 수 있다. ([브라우저별 지원현황](https://caniuse.com/?search=generator))

제너레이터 함수 선언시 `function`키워드 뒤에 `*`붙여 선언한다.
```javascript
function* genFunc() {
  yield 1;
  yield 2;
}
const generator = genFunc();
console.log(generator.next()); // {value: 1, done: false}
console.log(generator.next()); // {value: 2, done: false}
console.log(generator.next()); // {value: undefined, done: true}
```
제너레이터 함수는 제너레이터 객체를 반환한다. 반환된 객체는 [`Symbol.iterator`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)를 상속받는 [이터러블](https://ko.javascript.info/iterable)이면서 `next()`메서드를 가지고 있는 이터레이터이다.

1. 제너레이터 함수의 실행으로 제너레이터 객체가 만들어진다.
2. `next()`의 호출로 `yield`표현식까지의 코드블록을 실행하고 `yield`된 값을 가진 `{ value: 값, done: boolean }`객체를 반환한다.
3. 여러번 실행하여 모든 `yield`가 반환되면 `{ value: undefined, done: true }`형태로 반환된다.

```javascript
function* idMaker(){
  var index = 0;
  while(index < 3)
    yield index++;
}

var gen = idMaker();

console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // undefined
```
`yield`키워드는 코드를 일시정지 시킨 후 함수 호출자에게 제어권을 양도하게 된다. 그래서 `while`문 내부에서도 코드를 멈췄다가 재개하는게 가능하다.

```javascript
const asyncFunc = (generatorFunc) => {
  const generator = generatorFunc();
  const onResolved = (arg) => {
    const result = generator.next(arg);
    console.log(result)
    return result.done
      ? result.value
      : result.value.then(res => onResolved(res));
  }
}

(asyncFunc(function* fetchTodo() {
  const url = 'https://jsonplaceholder.typicode.com/todos/1';
  const response = yield fetch(url);
  const json = yield response.json();
  console.log(json)
})())
// {value: Promise, done: false} <- fetch()
// Promise {<pending>} <- fetch()의 결과
// {value: Promise, done: false} <- json()
// {userId: 1, id: 1, title: "delectus aut autem", completed: false} <- json()의 결과
// {value: undefined, done: true}
```
`asyncFunc()`함수 내부에서 재귀적으로 `onResolved()`를 실행하여 매개변수로 받은 제네레이터 함수내부의 `yield`를 처리하고, `Promise`객체의 `then`메소드를 실행시킨다.

### 4. async await
ES8에서 도입된 async/await는 더 가독성 좋은 비동기 처리를 도와준다. 이는 Promise를 기반으로 동작하며 `then`, `catch`같은 후속 메서드 사용없이 동기처럼 프로미스를 사용할 수 있다. ([브라우저별 지원현황](https://caniuse.com/?search=async%20await))



`async`키워드를 사용한 함수는 언제나 Promise객체를 반환한다.
```javascript
async function a() {
    return 1
}
console.log(a());
// Promise {<fulfilled>: 1}
```

`await`키워드는 Promise객체가 처리가 완료될 때까지 기다리다가 결과를 반환한다.
```javascript
async function fetchTodo() {
  const url = 'https://jsonplaceholder.typicode.com/todos/1';
  const response = await fetch(url);
  const json = await response.json();
  console.log(json)
}
fetchTodo();
```

만약 `async`함수내부에 `await`키워드가 여러개라면 순차적으로 처리가 완료될 때까지 가디린 후 반환한다. 내부에 여러개의 `await`함수가 필요한 경우 `Promise.all()`메서드를 사용하는 것이 좋다.
```javascript
async function foo() {
  // good
  const res = await Promise.all([
    new Promise(resolve => setTimeout(() => resolve(1), 3000))
    new Promise(resolve => setTimeout(() => resolve(2), 2000))
    new Promise(resolve => setTimeout(() => resolve(3), 1000))
  ]); // [1,2,3]


  // bad
  const a = await new Promise(resolve => setTimeout(() => resolve(1), 3000))
  const b = await new Promise(resolve => setTimeout(() => resolve(2), 2000))
  const c = await new Promise(resolve => setTimeout(() => resolve(3), 1000))
  const result = [a,b,c] // [1,2,3]
}
```

## 참고
- [일반적인 비동기 프로그래밍 개념](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Asynchronous/Concepts)
- [iterable 객체](https://ko.javascript.info/iterable)
- [모던 자바스크립트 Deep dive](http://www.yes24.com/Product/Goods/92742567)
