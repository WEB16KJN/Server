// .env 파일에서 선언한 모듈 가져오기
// 환경변수는 여기에 저장
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASSWORD,
};