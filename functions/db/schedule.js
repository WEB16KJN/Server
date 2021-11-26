const _ = require('lodash');
const convertSnakeToCamel = require('./../lib/convertSnakeToCamel');

const getSchedule = async (client) => {
  const { rows } = await client.query(
    `
    SELECT status FROM schedule
    WHERE user_id=1
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { getSchedule };
