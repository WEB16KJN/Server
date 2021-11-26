const _ = require('lodash');
const convertSnakeToCamel = require('./../lib/convertSnakeToCamel');

const getQuestionsByDate = async (client, start, end) => {
  const { rows } = await client.query(
    `
    SELECT title, date, status FROM question
    WHERE date >= '${start} 00:00:00'::timestamp 
    AND  date <  '${end} 23:59:59s'::timestamp
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { getQuestionsByDate };
