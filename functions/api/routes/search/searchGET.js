const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { paperDB, likeDB } = require('../../../db');

module.exports = async (req, res) => {
  const { keyword, category, weight } = req.query;
  let client;

  // 에러 트래킹을 위해 try / catch문을 사용합니다.
  // try문 안에서 우리의 로직을 실행합니다.
  try {
    // db/db.js에 정의한 connect 함수를 통해 connection pool에서 connection을 빌려옵니다.
    // release하기 전까지 쿼리 실행 가능
    client = await db.connect(req);

    // 빌려온 connection을 사용해 우리가 db/paper.js에서 미리 정의한 SQL 쿼리문을 날려줍니다.
    // 미리 정의한 쿼리를 가져온다.
    const paper = await paperDB.getAllPaper(client);
    // console.log(paper);
    let paperResult = paper;

    // 1. keyword 체크
    if (keyword) {
      // 공백 기준으로 분리
      let keywordList = keyword.split(' ');
      // null 제거
      keywordList = keywordList.filter((item) => item != '');

      paperResult = paperResult.filter((item) => keywordList.some((i) => item.name.includes(i)));
    }

    // 2. category 체크
    if (category) {
      // 공백 기준으로 분리
      let categoryList = category.split(' ');
      // null 제거
      categoryList = categoryList.filter((item) => item != '');

      paperResult = paperResult.filter((item) => categoryList.some((i) => item.category == i));
    }

    // 3. weight 체크
    if (weight) {
      // 공백 기준으로 분리
      console.log(weight);

      let weightList = weight.split(' ');
      // null 제거
      weightList = weightList.filter((item) => item != '');

      // weightList를 [[최솟값, 최댓값]] 형태로 변환
      for (let i = 0; i < weightList.length; i++) {
        if (weightList[i] === '100g이하') {
          weightList[i] = [0, 100];
        } else if (weightList[i] === '300g이상') {
          weightList[i] = [300, 999999];
        } else if (weightList[i].slice(-1) === 'g') {
          const tmp = weightList[i].split('~');
          weightList[i] = [Number(tmp[0].slice(0, -1)), Number(tmp[1].slice(0, -1))];
        } else {
          // 사용자 입력
          const tmp = weightList[i].split('~');
          weightList[i] = [Number(tmp[0]), Number(tmp[1])];
        }
      }
      paperResult = paperResult.filter((item) => weightList.some((i) => Number(item.weight) >= i[0] && Number(item.weight) <= i[1]));
    }

    // 검색은 성공했지만 해당하는 값이 없는 경우
    if (paperResult.length === 0) return res.status(statusCode.OK).send(util.success(statusCode.NO_CONTENT, responseMessage.NO_SEARCH_RESULT, paperResult));

    // response로 보낼 data 모양 만들어주기
    for (let i = 0; i < paperResult.length; i++) {
      const tmp = {
        id: paperResult[i].id,
        viewcount: paperResult[i].viewcount,
        img: paperResult[i].img,
        name: paperResult[i].name,
        like: false,
      };

      // like 체크
      const like = await likeDB.getLikeByPaperId(client, tmp.id);
      if (like.length >= 1 && like[0].isDeleted === false) {
        tmp.like = true;
      }
      paperResult[i] = tmp;
    }

    // paging: 8개만 보내기
    if (paperResult.length > 8) {
      paperResult = paperResult.slice(0, 8);
    }

    // 성공적으로 paper를 가져왔다면, response를 보내줍니다.
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_SUCCESS, paperResult));

    // try문 안에서 에러가 발생했을 시 catch문으로 error객체가 넘어옵니다.
    // 이 error  객체를 콘솔에 찍어서 어디에 문제가 있는지 알아냅니다.
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
    // 릴리즈 꼭 해야 함
    client.release();
  }
};
