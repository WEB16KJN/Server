const _ = require('lodash');
const convertSnakeToCamel = require('./../lib/convertSnakeToCamel');


const getLikeByPaperId = async (client, paperId) => {
    const { rows } = await client.query(
      `
      SELECT * FROM "like" l
      WHERE paper_id = $1
      `,
      [paperId],
    );
    return convertSnakeToCamel.keysToCamel(rows);
  };

const createLikeByPaperId = async (client, userId, paperId) => {
    const { rows } = await client.query(
        `
        INSERT INTO "like"
        (user_id, paper_id)
        VALUES
        ($1, $2)
        RETURNING *
        `,
        [userId, paperId],
    );
    return convertSnakeToCamel.keysToCamel(rows);
};

const updateLike = async (client, userId, paperId, isDeleted) => {
    let newValue = true;

    // isDeleted가 true인 경우 false로 바꾸기
    if (isDeleted){
        newValue = false;
    }
    
    const { rows } = await client.query(
      `
      UPDATE "like" l
      SET user_id = $1, paper_id = $2, is_deleted = $3
      WHERE paper_id = $2
      AND user_id = $1
      RETURNING * 
      `,
      [userId, paperId, newValue],
    );
    return convertSnakeToCamel.keysToCamel(rows[0]);
  };

module.exports = {getLikeByPaperId, createLikeByPaperId, updateLike };