const _ = require('lodash');
const convertSnakeToCamel = require('./../lib/convertSnakeToCamel');

const getUser = async (client) => {
    const { rows } = await client.query(
      `
      SELECT * FROM "user"
      WHERE id=1
      `,
    );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = {getUser};