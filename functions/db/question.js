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
const postQuestion = async (client,title,secret,name,phone,content) => {
  const { rows } = await client.query(
    `
    INSERT INTO question
    (title,secret,nickname,phone, content,user_id)
    VALUES
    ($1, $2, $3, $4, $5, 1)
    RETURNING *
    `,
    [title,secret,name,phone, content]
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
}

module.exports = { getQuestionsByDate ,postQuestion};
