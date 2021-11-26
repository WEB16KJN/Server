const _ = require('lodash');
const convertSnakeToCamel = require('./../lib/convertSnakeToCamel');

const postFile = async (client,question_id,url) => {
    const { rows } = await client.query(
      `
      INSERT INTO file
      (question_id, url)
      VALUES
      ($1, $2)
      RETURNING *
      `,
      [question_id,url]
    );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = {postFile};