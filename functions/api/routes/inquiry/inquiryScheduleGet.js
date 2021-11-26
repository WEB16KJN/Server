const _ = require('lodash');
const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { scheduleDB } = require('../../../db');

module.exports = async (req, res) => {
  let client;
  let all;
  let planned;
  let completed = 0;
  let canceled = 0;
  let scheduleStatus = 0;

  try {
    client = await db.connect(req);

    const schedule = await scheduleDB.getSchedule(client);
    planned = schedule.filter((o) => o.status === 0).length;
    completed = schedule.filter((o) => o.status === 1).length;
    canceled = schedule.filter((o) => o.status === 2).length;

    scheduleStatus = {
      all: schedule.length,
      planned,
      completed,
      canceled,
    };

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_SUCCESS, scheduleStatus));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
