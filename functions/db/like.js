const _ = require('lodash');
const convertSnakeToCamel = require('./../lib/convertSnakeToCamel');

// 첫 번째 쿼리
const getPaperIdLikesByUserId = async (client, user_id) => {
  // 클라이언트 객체를 가져옴
  // user는 postgres에서 예약된 이름이라서 "user"로 쓰는 것임
  // 쿼리 실행 결과가 rows에 담김'
  // 원래 data.rows로 해야 하는데 구조분해할당 한것임.
  const { rows } = await client.query(
    `
    SELECT * FROM like l
    WHERE is_deleted = FALSE
    AND l.user_id = $1
    `,
    [user_id],
  );

  // return rows; // 이렇게 하면 snake case로 리턴됨
  
  // recursive하게 camel 케이스로 바뀜
  // 즉, nested된 객체도 바뀜
  // 모든 키가 camel 케이스로 바뀜
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { getPaperIdLikesByUserId,  };