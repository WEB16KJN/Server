const _ = require('lodash');
const functions = require('firebase-functions');
const util = require('./../../../lib/util');
const statusCode = require('./../../../constants/statusCode');
const responseMessage = require('./../../../constants/responseMessage');
const db = require('./../../../db/db');
const { questionDB } = require('./../../../db');

module.exports = async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    const questions = await questionDB.getQuestionsByDate(client, start, end);

    if (questions) {
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_SUCCESS, questions));
    } else {
      res.status(statusCode.NO_CONTENT).send(util.success(statusCode.NO_CONTENT, responseMessage.NO_SEARCH_RESULT, questions));
    }
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
