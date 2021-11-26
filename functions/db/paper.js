const _ = require('lodash');
const convertSnakeToCamel = require('./../lib/convertSnakeToCamel');

const getAllPaper = async (client) => {
    const { rows } = await client.query(
      `
      SELECT * FROM paper
      `,
    );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = {getAllPaper };