const _ = require('lodash');
const convertSnakeToCamel = require('./../lib/convertSnakeToCamel');

const getAllPaper = async (client) => {
    const { rows } = await client.query(
      `
      SELECT * FROM "paper"
      `,
    );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getPaperByPaperId = async (client, paperId) => {
    const { rows } = await client.query(
      `
      SELECT * FROM "paper"
      WHERE id = $1
      `,
      [paperId],
    );
  return convertSnakeToCamel.keysToCamel(rows);
};
module.exports = {getAllPaper, getPaperByPaperId };