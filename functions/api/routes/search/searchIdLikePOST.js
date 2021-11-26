const functions = require('firebase-functions');
const util = require('./../../../lib/util');
const statusCode = require('./../../../constants/statusCode');
const responseMessage = require('./../../../constants/responseMessage');
const db = require('./../../../db/db');
const { likeDB } = require('./../../../db');
const { paperDB } = require('./../../../db');

module.exports = async (req, res) => {
  const { id } = req.params;
  // 필요한 값이 없을 때 보내주는 response
  if (!id) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

  let client;

  // 에러 트래킹을 위해 try / catch문을 사용합니다.
  // try문 안에서 우리의 로직을 실행합니다.
  try {
    // db/db.js에 정의한 connect 함수를 통해 connection pool에서 connection을 빌려옵니다.
    client = await db.connect(req);

    // 빌려온 connection을 사용해 우리가 db/[파일].js에서 미리 정의한 SQL 쿼리문을 날려줍니다.

    // 0. 실제로 있는 paper인지 확인
    const paper = await paperDB.getPaperByPaperId(client, id);
    if (paper.length === 0) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.OUT_OF_VALUE));
    }
    console.log(paper);

    // 1. likeDB에서 paper_id에 해당하는 like 상태 가져오기
    const like = await likeDB.getLikeByPaperId(client, id);
    let likeResult;

    // 2. like가 없다면 like 만들어주기
    if (like.length === 0) {
      likeResult = await likeDB.createLikeByPaperId(client, Number(1), Number(id));
      likeResult = likeResult[0];
    } else {
      // is_deleted가 true면 false로 바꾸기
      // is_deleted가 false면 true로 바꾸기
      likeResult = await likeDB.updateLike(client, like[0].userId, like[0].paperId, like[0].isDeleted);
    }

    //response로 보낼 paperResult 만들기
    const paperResult = {
      viewcount: paper[0].viewcount,
      img: paper[0].img,
      name: paper[0].name,
      like: true,
    };

    // isdeleted가 true면 like를 false로 바꾼다.
    if (likeResult.isDeleted) {
      paperResult.like = false;
    }

    // 성공적으로 users를 가져왔다면, response를 보내줍니다.
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.LIKE_SUCCESS, paperResult));

    // try문 안에서 에러가 발생했을 시 catch문으로 error객체가 넘어옵니다.
    // 이 error 객체를 콘솔에 찍어서 어디에 문제가 있는지 알아냅니다.
    // 이 때 단순히 console.log만 해주는 것이 아니라, Firebase 콘솔에서도 에러를 모아볼 수 있게 functions.logger.error도 함께 찍어줍니다.
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    // 그리고 역시 response 객체를 보내줍니다.
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));

    // finally문은 try문이 끝나든 catch문이 끝나든 반드시 실행되는 블록입니다.
    // 여기서는 db.connect(req)를 통해 빌려온 connection을 connection pool에 되돌려줍니다.
    // connection을 되돌려주는 작업은 반드시 이루어져야 합니다.
    // 그렇지 않으면 요청의 양이 일정 수준을 넘어갈 경우 쌓이기만 하고 해결되지 않는 문제가 발생합니다.
  } finally {
    client.release();
  }
};
