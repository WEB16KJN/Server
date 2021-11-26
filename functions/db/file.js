const _ = require('lodash');
const convertSnakeToCamel = require('./../lib/convertSnakeToCamel');

const 함수이름 = async (client) => {
    const { rows } = await client.query(
      `
      여기에 쿼리 작성
      `,
    );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = {함수이름 };