---

title: 웹팩을 쓰는 이유와 사용법 정리
date:  2021-01-18
tags:
	- javascript
keywords:
	- webpack
---

# 웹팩이란?
프론트엔드 개발시 여러 파일을 하나 혹은 N개의 결과물로 만들기 위한 모듈 번들러. 비슷한 도구로는 parcel, snowpack 등이 있다.
- 웹팩에서의 모듈
	- 하나의 역할을 수행할 수 있는 단위
	- 프로젝트를 구성하는 모든 자원 (html, css, js, font, image)

### 모듈을 번들링한다는게 무슨 말이지?
- `.js`, `.sass`, `.jpg` 등 프로젝트에 사용된 다수의 파일들을 빌드하면서 압축, 전처리, 최적화 등을 해주고 1개 혹은 n개의 파일로 묶어주는것
	- 웹팩 라이브러리를 사용하면 가능한것들의 예시
		- 개발시에 사용한 이미지를 webpack을 통해서 빌드하면 더 작은 용량으로 압축
		- `.scss`, `.sass`, `.less` 등으로 만들어진 preprocessors들을 브라우저에서 사용가능한 `.css` 파일로 변환
		- 여러개의 `.js`파일을 결과물을 1개의 `.js` 파일로 빌드
- 과거에는 `.html`파일 내부에 script태그로 라이브러리들을 불러오도록 작성했다. script태그로 비동기적으로 파일을 불러오게되면 네트워크의 상태나 script태그의 위치에 따라 개발자가 의도하지않았던 결과를 초래할 수 있고, 코드관리에도 불편한 점이 있었다. 웹팩은 이러한 점들 또한 해결해준다.

### 웹팩으로 번들링하는 이유는?
1. 초기 웹은 간단한 구조일거라고 생각하고 js를 개발함 -> 웹이 발전해가면서 js가 복잡해짐 -> 여러 문제점 발생
	- 변수 스코프 겹침
	- 브라우저별 HTTP 요청 숫자 제약
		> 최신 브라우저들은 대부분 한번에 6개의 요청을 보낼 수 있다. ie11은 13개
	- 미사용 코드 관리 등
2. 초기에는 grunt, gulp같은 웹 테스크 매니저툴이 웹팩과 비슷한 역할을 함
3. 웹 테스크 매니저의 한계를 개선하고, 추가적인 기능이 가능해진 웹팩이 만들어지게 됨
	- 간단한 설정
	- lazy-loading
	- task를 위한 라이브러리 관리

### 명령어
- `webpack`
	- 프로젝트 빌드를 수행함.
	- 보통 cli창에서 webpack 명령을 일일이 수행하지 않고 package.json 의 `scripts`옵션에 미리 등록하여 사용함
	- 옵션을 줘보자
		- `--mode=none|development|production`
			- 현재 빌드하려는 모드를 설정한다.
			- 이 값을 사용해 상황마다 특정 웹팩 라이브러리만 빌드에 사용되게 할수 있다.
				- ex) 개발시에는 난독화 라이브러리를 적용시키지 않도록하여 에러가 발생했을 때 좀 더 디버깅하기 쉬운 환경을 만들수 있다.
		- `--entry=src/index.js`
		- `--output=public/output.js`
		```json
		...
		"scripts": {
			"build": "webpack --mode=development --entry=src/index.js --output=dist/main.js"
		},
		...
		```
	- 이처럼 옵션값들을 package.json에서 수정하는 것들은 가독성, 유지보수 측면에서 매우 비효율적임.
		아래 처럼 js파일로 만들어 관리하는 것이 훨씬 가독성이 좋으며 권장되는 방법
		```js
		// webpack.config.js
		// `webpack` command will pick up this config setup by default
		var path = require('path');

		module.exports = {
			mode: 'none',
			entry: './src/index.js',
			output: {
				filename: 'main.js',
				path: path.resolve(__dirname, 'dist')
			}
		};
		```

### build 결과물
- webpack은 사용된 js파일을 배열로 관리한다.
- 결과물 내부는 즉시실행함수(IIFE)를 활용하여 작성된다.

#### build 결과물 - sourcemap
- 웹팩의 결과물은 난독화가 가능하다. 그러나 개발하면서 디버깅을 하기위해서는 가독성이 좋은 코드를 브라우저에서 볼수 있어야한다.
- 웹팩은 해당 부분을 설정할 수 있는 옵션을 제공한다
	```js
	...
		devtool: 'source-map'

	};
	...
	```


### 과거의 툴 gulp, grunt
- 파일에 대해 개발자가 직접 설정을 해주고, 각 파일에대해 태스크를 진행하는 방식
	- project
		- js - js - js - js
		- css - css - css - css
		- jpg - jpg - jpg - jpg
	- 트리쉐이킹, 모듈 번들링이 불가능했음

- 웹팩은?
	- project
		- js - js - jpg - css
			- css
				- woff2
				- woff
				- svg
				- css
	- 진입점이 주어지면 나머지의 연관관계를 웹팩이 해석해서 결과물을 만들어냄
	- 트리쉐이킹, 모듈 번들링이 가능

# webpack의 주요 속성들
- entry
- output
- module
- mode

### entry
```js
// webpack.config.js
module.exports = {
  entry: './src/index.js'
}
```
- 웹팩이 프로젝트를 빌드할 때, 첫 진입점이 된다. (js파일 경로를 기입한다.)
	- entry를 분리하는 경우는 MPA에 적합함
- A라는 파일에서 B라는 파일을 import하게되면 A는 B파일에 의존하게된다 -> 의존성관계 생김 == 디펜던시
	- 웹팩은 디펜던시 그래프를 통해 어떤 파일들이 사용되는지 판단하고 빌드를 진행함


### output
```js
// webpack.config.js
module.exports = {
	output: {
		filename: 'bundle.js',
		filename: '[name].bundle.js', // 결과 파일명에 entry 속성을 포함
		filename: '[id].bundle.js', // 결과 파일 이름에 웹팩 내부적으로 사용하는 모듈 ID를 포함하는 옵션

    filename: '[name].[hash].bundle.js',
    // 매 빌드시 마다 고유 해시 값을 붙이는 옵션
    /**
     * A.a13.js
     * B.a13.js
     * ------
     * A 파일만 변경 후 빌드
     * ------
     * A.b2d.js
     * B.b2d.js
     *
     */



    filename: '[contenthash].bundle.js',
    // 각 파일마다 가지고 있는 콘텐츠에 의해 계산되는 hash값을 가짐
    /**
     * A.bs1.js
     * B.as2.js
     * ------
     * A 파일만 변경 후 빌드
     * ------
     * A.2oq.js
     * B.as2.js
     *
     */

    filename: '[chunkhash].bundle.js',
    // 웹팩의 각 모듈 내용을 기준으로 생생된 해시 값을 붙이는 옵션 (webpack entry를 기반으로 정의되어 고유의 hash 값을 가짐)
    // 각 파일마다 가지고 있는 콘텐츠에 의해 계산되는 hash값을 가짐
    /**
     * A.a13.js
     * B.a13.js
     * ------
     * A 파일만 변경 후 빌드
     * ------
     * A.baq.js
     * B.a13.js
     *
     */

  }
}
```
- 빌드가 완료된 후 결과물 파일의 경로와 파일명을 지정해준다.
- `hash`, `chunckhash` 옵션을 파일명에 추가한 경우, 배포시에 생기는 캐시문제를 해결해 줄수 있다. (빌드할 때 마다 다른 해쉬가 붙기때문에 `index.html`만 invalidation되면 새로운 js파일을 불러오기 때문이다)
	- `hash`
		- 빌드를 할 때마다, 매번 새로운 값들을 파일명 뒤에 붙게되고 이로 인해 변경사항이 없는 파일도 유저는 다시 로드하게되어 비효율적이다.
	- `chunkhash`
		- webpack entry를 기반으로 정의되어 고유의 hash 값을 가짐 (변경된 파일만  변경되어 `hash`보다는 효율적)
  - 참고
  	- [hash vs chunkhash vs contenthash](https://sk92.tistory.com/4)
		- [What is the purpose of webpack [hash] and [chunkhash]?](https://stackoverflow.com/questions/35176489/what-is-the-purpose-of-webpack-hash-and-chunkhash)


### loader
```js
// webpack.config.js
module.exports = {
  module: { // 엔트리나 아웃풋 속성과는 다르게 module라는 이름을 사용
    rules: []
  }
}
```
- js가 아닌 웹자원들을 변환하기 위해사용
	- sass -> css, svg -> svgr 등 다양함

```js
module: {
    rules: [
      {
        test: /\.css$/,
        use: ['css-loader']
      }
    ]
	}
```
- loader = 도구
- test = 도구를 적용시킬 대상의 파일명을 정규표현식으로 필터링한다.
- 예시
	- .ts 파일을 모두 .js로 트랜스파일한다.
	```js
	{ test: /\.ts$/, use: 'ts-loader' },
	```
	- 프로젝트에 사용된 .css파일을 로드한다.
	```js
	{ test: /\.css$/, use: 'css-loader' },
	```

> https://webpack.js.org/loaders/ <br/>
웹팩에서 사용가능한 로더들의 리스트. 각 로더에 대한 사용법과 github 저장소의 링크를 제공한다.


#### loader 적용순서는 오른쪽->왼쪽
```js
module: {
  rules: [
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }
  ]
}
```
1. 위에 코드는 `.scss`파일들을 찾아 sass-loader로 전처리하여 css로 변환하고
2. css-loader로 `.css`파일들을 웹팩에서 인식하게 해준다.
  - 난독화 되지않은 build 결과물을 보게되면, css코드로 보이는 문자열이 js내부에 존재하는걸 알수 있다.
  - js가 애플리케이션이 작동할 때 동적으로 html 내부에 style태그로 삽입해주는 것이다. 이런 이유로 index.html을 보면 head내부는 스타일태그가 없이 깨끗하다.
3. style-loader는 인식된 css를 js로 동적으로 로드할 수 있게끔 도와준다.

```js
module: {
  rules: [
    {
      test: /\.scss$/,
      use: ['css-loader', 'sass-loader', 'style-loader']
    }
  ]
}
```
위와 같이 설정하고 빌드를 시도하가 되면 아래 오류가 발생한다.
```sh
ERROR in ./src/base.css
Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):
ModuleParseError: Module parse failed: Unexpected token (1:2)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> p {
|       color: blue;
| }
```
- 이처럼 순서가 사용되는 로더의 순서가 제대로 배치되지 않으면 웹팩에서는 오류가 발생한다.
  - `.scss`, `.sass` 파일을 `.css`로 변환하기 위해서는 sass-loader가 선행되어야함. 그 이후 css-loader로 인식하게 한뒤 style-loader로 js내부에 css를 담도록 해야함

- 내가 사용하려는 파일에 따라 로더의 종류, 로더를 입력하는 순서가 달라진다.

### mode
- 웹팩실행시 어떤 환경을 위해 빌드하는지에 대한 구분자
- 웹팩에서 제공하는 기본값들은 `none`, `development`, `production`이 있다.

### plugins
- 웹팩의 동작에 추가적인 기능을 추가할 수 있는 기능
> loader: 파일을 해석하고 변환함 <br /> plugins: 결과물의 형태를 바꿈
- 플러그인 라이브러리의 instance를 배열형태로 받는다.

```js
// webpack.config.js
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.ProgressPlugin()
  ]
}
```


## [웹팩 데브 서버](https://webpack.js.org/configuration/dev-server/)
프론트엔드 개발시, 대부분의 개발이 react, angular, vue 등을 사용하여 진행된다. 각 도구들은 각자의 문법을 가지고 있고 react와 vue같은 경우는 파일확장자명도 다르다. (.jsx, .tsx, .vue) 이를 브라우저에서 실행시키기 위해서는 브라우저가 이해할 수 있는 html,css,js로 변경해야 한다. 하지만 개발할 때 코드 변경후 매번 저장하고 다시 빌드명령어를 치는건 비효율적이다. 웹팩 데브서버는 이런 부분을 해결해주고 추가적으로 로컬개발시 편의성을 제공해준다. (타입스크립트를 사용할 때 파일이 변경된걸 감지하고 매번 자동으로 트랜스파일을 해주는 tsc-watch와 비슷한 맥락)

- 설치
	```shell
	npm i webpack webpack-cli webpack-dev-server  -D
	```
- package.json에 명령어 등록
	```json
	"scripts": {
			"test": "echo \"Error: no test specified\" && exit 1",
			"dev": "webpack serve"
		},
	```
- 실행
	```shell
	npm run dev
	```

### 특징
- 데브서버로 빌드된 내용은 메모리상으로만 존재하고 파일시스템 상에는 존재하지 않는다. (메모리상에 적재하는 것이 파일시스템상에서 파일 입출력을 하는것 보다 빠르기 때문이다.)
- 파일을 저장할 때 마다 새로 빌드해서 최신코드를 반영해줌

## 웹팩 설정 파일 분석해보기
```js
var path = require('path')
var webpack = require('webpack')

module.exports = {
  mode: 'production', // 해당 웹팩 설정파일은 배포를 위한 모드이다.
  entry: './src/main.js', // 웹팩이 빌드를 시도할 때, 첫 진입점 파일을 의미한다.
  output: {
    path: path.resolve(__dirname, './dist'), // 빌드의 결과물이 저장될 폴더명
    publicPath: '/dist/', // 1) 아래 작성
    filename: 'build.js' // 빌드 결과물의 이름
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
			},
			// .css 확장자를 가진 파일 모두, css-loader, vue-style-loader를 적용시킨다.

      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
			},
			// .vue 확장자를 가진 파일 모두, vue-loader를 적용시킨다.

      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
			},
			// .js 확장자를 가진 파일 모두, babel-loader를 적용시킨다. 단, node_modules 폴더는 제외시킨다.

      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
			}
			// .png|jpg|gif|svg 확장자를 가진 파일 모두, file-loader를 적용시킨다. 이때 파일명 뒤에 해쉬를 붙인다. (이미지가 캐싱되어도 해쉬값이 변경되면 이미지 업데이트시 다시 새로운 이미지를 불러오게하기 위함)

    ]
	},

  resolve: {
		// 2
    alias: {
			'vue$': 'vue/dist/vue.esm.js'
    },
		// 3
    extensions: ['*', '.js', '.vue', '.json']
  },

	// 데브 서버 실행시, 옵션지정 참고 - https://webpack.js.org/configuration/dev-server/
	devServer: {
		historyApiFallback: true,
		noInfo: true,
		overlay: true
	},

	// 빌드결과물 크기에 대한 경고를 띄울수있는 옵션 - https://webpack.js.org/configuration/performance/
  performance: {
    hints: false
	},

	// 소스매핑스타일에 대한 옵션 (빌드에 대한 소요시간에 영향을 끼칠 수도 있다) - https://webpack.js.org/configuration/devtool/
  devtool: '#eval-source-map'
}
```

### 모르는 부분 검색결과
1. `output.publicPath`
	- `path`와는 다르게 빌드된 결과물이 배포되었을 때 해당 파일이 존재할 디렉토리를 의미한다.
	- `publicPath: "/dist"` 지정 여부에 따른 결과
		```html
		<script src="/bundle.js"></script></body>
		<script src="/dist/bundle.js"></script></body>
		```
		- https://example.com/bundle.js
		- https://example.com/dist/bundle.js
	- 이런것도 가능하다.
		- aws S3, cloudefront, route53를 사용한다고  가정함
		- `package.json` 내부에 version 변수를 js로 불러온 후 `publicPath`로 지정한다. 그 후 aws s3에 빌드파일을 S3에 업로드할 때 해당버킷에 폴더를 version 변수와 같은이름으로 생성한 후 업로드하면 버전별로 빌드파일을 분리해서 업로드할 수 있다.
	- 참고
	  - [Public Path](https://webpack.js.org/guides/public-path/)
		- [What does “publicPath” in Webpack do?](https://stackoverflow.com/questions/28846814/what-does-publicpath-in-webpack-do)
2. `resolve.alias`
	- 프로젝트 내부에서 사용할 별칭에 대해 실제 엔티티를 매칭해준다.
		- `'vue$': 'vue/dist/vue.esm.js'`
			```js
			import Something from  './component/some' // some.js some.json 위에서 등록한 확장자는 생략가능 (여기서 * 설정값은 모든 파일 확장자를 뜻함)
			```
3. `resolve.extensions`
	- 프로젝트 내부에서 사용할 모듈에 대해 import시 확장자를 붙이지 않아도 된다.
		- `['*', '.js', '.vue', '.json']`


> 본 내용은 [프론트엔드 개발자를 위한 웹팩](https://www.inflearn.com/course/%ED%94%84%EB%9F%B0%ED%8A%B8%EC%97%94%EB%93%9C-%EC%9B%B9%ED%8C%A9) 강의을 보고 정리한 내용입니다.
