// 필요한 모듈들
// firebase 콘솔에 로그 나옴
const functions = require('firebase-functions');
const { Pool, Query } = require('pg');
// 날짜
const dayjs = require('dayjs');
const dotenv = require('dotenv');
// 이걸 해야 .env파일 사용 가능
dotenv.config();

// DB Config (유저, 호스트, DB 이름, 패스워드)를 로딩해줍시다.
const dbConfig = require('../config/dbConfig');

// NODE_ENV라는 글로벌 환경변수를 사용해서, 현재 환경이 어떤 '모드'인지 판별해줍시다.
// 로컬에서는 기본적으로 development로 되어 있다.
// devMode에서 콘솔 찍을 수 있게 나중에 설정할 것임
// production에서는 콘솔 로그를 찍지 않는 등 설정 가능
let devMode = process.env.NODE_ENV === 'development';

// SQL 쿼리문을 콘솔에 프린트할지 말지 결정해주는 변수를 선언합시다.
// 기본 설정으로는 콘솔에 안 찍힘
const sqlDebug = true;


// ~~~~ 편의를 위한 설정: sql을 콘솔에 찍게 만드는 코드
// 기본 설정에서는 우리가 실행하게 되는 SQL 쿼리문이 콘솔에 찍히지 않기 때문에,
// pg 라이브러리 내부의 함수를 살짝 손봐서 SQL 쿼리문이 콘솔에 찍히게 만들어 줍시다.
// postgres 라이브러리에서 제공하는 모듈을 뜯어서 콘솔에 찍을 수 있게
const submit = Query.prototype.submit;
Query.prototype.submit = function () {
  const text = this.text;
  const values = this.values || [];
  const query = text.replace(/\$([0-9]+)/g, (m, v) => JSON.stringify(values[parseInt(v) - 1]));
  // devMode === true 이면서 sqlDebug === true일 때 SQL 쿼리문을 콘솔에 찍겠다는 분기입니다.
  devMode && sqlDebug && console.log(`\n\n[👻 SQL STATEMENT]\n${query}\n_________\n`);
  submit.apply(this, arguments);
};

// 서버가 실행되면 현재 환경이 개발 모드(로컬)인지 프로덕션 모드(배포)인지 콘솔에 찍어줍시다.
console.log(`[🔥DB] ${process.env.NODE_ENV}`);




// 커넥션 풀을 생성해줍니다.
// 커넥션을 빌려오고, 릴리즈 하는 작업 계속함
const pool = new Pool({
  ...dbConfig,
  // 이 시간 지나면 알아서 끄기
  connectionTimeoutMillis: 60 * 1000,
  idleTimeoutMillis: 60 * 1000,
});

// 위에서 생성한 커넥션 풀에서 커넥션을 빌려오는 함수를 정의합니다.
// 기본적으로 제공되는 pool.connect()와 pool.connect().release() 함수에 디버깅용 메시지를 추가하는 작업입니다.

// // 필요한 곳에서 pool.connect()하고
// client.query("SELECT SOMETHING")해도 된다.
// 그런데 커넥션이 끊기거나 할 때 필요한 정보를 얻기 어렵다.
// 기본으로 쓰면 오류났을때 디버깅이 어려움
const connect = async (req) => {
  const now = dayjs();

  // 리퀘스트 객체를 먹인다.
  const string =
    !!req && !!req.method
      ? `[${req.method}] ${!!req.user ? `${req.user.id}` : ``} ${req.originalUrl}\n ${!!req.query && `query: ${JSON.stringify(req.query)}`} ${!!req.body && `body: ${JSON.stringify(req.body)}`} ${
          !!req.params && `params ${JSON.stringify(req.params)}`
        }`
      : `request 없음`;
  const callStack = new Error().stack;
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;

  const releaseChecker = setTimeout(() => {
    devMode
      ? console.error('[ERROR] client connection이 15초 동안 릴리즈되지 않았습니다.', { callStack })
      : functions.logger.error('[ERROR] client connection이 15초 동안 릴리즈되지 않았습니다.', { callStack });
    devMode ? console.error(`마지막으로 실행된 쿼리문입니다. ${client.lastQuery}`) : functions.logger.error(`마지막으로 실행된 쿼리문입니다. ${client.lastQuery}`);
  }, 15 * 1000);

  // 마지막 실행한 쿼리
  client.query = (...args) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };

  // 릴리즈가 늦게 일어나면 로그 찍기
  client.release = () => {
    clearTimeout(releaseChecker);
    const time = dayjs().diff(now, 'millisecond');
    if (time > 4000) {
      const message = `[RELEASE] in ${time} | ${string}`;
      devMode && console.log(message);
    }
    client.query = query;
    client.release = release;
    return release.apply(client);
  };
  return client;
};


module.exports = {
  connect,
};