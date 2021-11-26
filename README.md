# DoosungpaperServer
### 1. 프로젝트 소개
클라이언트-서버 합동세미나 16조 두성종이 서버

### 2. 역할 분배
| jinyoung7165 | LeeJE20 | seoljiwon |
| --- | --- | --- |
| 코드 세팅 | DB 세팅 | 파이어베이스 세팅 |
| 유저 정보 가져오기 | 종이 게시글 좋아요 | 문의 리스트 보기 |
| 문의 올리기 | 종이 게시글 검색 | 문의 리스트 날짜 필터링 |

### 3. 폴더링

---

- 폴더링 구조
    
![image](https://user-images.githubusercontent.com/42895142/143576319-92a9c43c-1cd1-46fd-ac92-7b2a3df6f17b.png)
    

### 4. Git 사용법과 전략

---

- Git Branch Flow
    - main, dev → dev에서 `{feat/기능이름}` 으로 branch 생성
    - 기능 개발이 끝나면 main으로 merge
- Git Commit Message Convention
    
    영어로 작성, 동사원형으로 시작
    
    - feat: 새로운 기능 추가
    - fix: 버그를 고친 경우
    - style: 코드 포맷 변경
    - refactor: 코드 리팩토링
    - merge: 브랜치 머지
    - docs: 문서 작성
    - rename: 파일, 클래스, 메서드명, 폴더명 수정
    - chore: 설정 파일 등

### 5. 코드 컨벤션

---

- **constants**
    
    responseMessage.js
    
    ```jsx
    module.exports = {
      NULL_VALUE: '필요한 값이 없습니다',
      OUT_OF_VALUE: '파라미터 값이 잘못되었습니다',
      WRONG_QUERY: '쿼리 값이 잘못되었습니다',
    
      // 회원가입
      CREATED_USER: '회원 가입 성공',
      DELETE_USER: '회원 탈퇴 성공',
      ALREADY_EMAIL: '이미 사용중인 이메일입니다.',
    
      // 로그인
      LOGIN_SUCCESS: '로그인 성공',
      LOGIN_FAIL: '로그인 실패',
      NO_USER: '존재하지 않는 회원입니다.',
      MISS_MATCH_PW: '비밀번호가 맞지 않습니다.',
    
      // 프로필 조회
      READ_PROFILE_SUCCESS: '프로필 조회 성공',
    
    	// 종이
    	LIKE_SUCCESS: '좋아요 변환 성공',
    
    	// 조회
      READ_SUCCESS: '조회 성공',
    	NO_SEARCH_RESULT: '검색 결과 없음',
    	
    };
    ```
    
    statusCode.js
    
    ```jsx
    module.exports = {
      OK: 200,
      CREATED: 201,
      NO_CONTENT: 204,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      INTERNAL_SERVER_ERROR: 500,
      SERVICE_UNAVAILABLE: 503,
      DB_ERROR: 600,
    };
    ```
    
- **lib**
    
    util.js
    
    ```jsx
    module.exports = {
      success: (status, message, data) => {
        return {
          status,
          success: true,
          message,
          data,
        };
      },
      fail: (status, message) => {
        return {
          status,
          success: false,
          message,
        };
      },
    };
    ```
    
- .eslintrc.js
    
    ```jsx
    module.exports = {
      env: {
        node: true,
        commonjs: true,
        es2021: true,
      },
      extends: ["eslint:recommended", "eslint-config-prettier"],
      parserOptions: {
        ecmaVersion: 12,
      },
      rules: {
        "no-prototype-builtins": "off",
        "no-self-assign": "off",
        "no-empty": "off",
        "no-case-declarations": "off",
        "consistent-return": "off",
        "arrow-body-style": "off",
        camelcase: "off",
        quotes: "off",
        "no-unused-vars": "off",
        "comma-dangle": "off",
        "no-bitwise": "off",
        "no-use-before-define": "off",
        "no-extra-boolean-cast": "off",
        "no-empty-pattern": "off",
        curly: "off",
        "no-unreachable": "off",
      },
    };
    ```
    
- .prettierrc.js
    
    ```jsx
    module.exports = {
      bracketSpacing: true,
      jsxBracketSameLine: true,
      singleQuote: true,
      trailingComma: "all",
      arrowParens: "always",
      printWidth: 200,
      tabWidth: 2,
    };
    ```
    

### 6. API 문서

---

### Base URL:
[Check base URL here](https://www.notion.so/storypanda/bfc3e7cab746408fbc83098ec5be81f4)

### ERD:
![image](https://user-images.githubusercontent.com/42895142/143576401-4ad58bde-bcad-4c00-b541-e2d239f19abe.png)

### API
[API page link](https://www.notion.so/storypanda/api-108886224b6d4c18aef486fb3c5bd95e)
