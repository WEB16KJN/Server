const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { questionDB } = require('../../../db');
const { fileDB } = require('../../../db');

module.exports = async (req, res) => {
    const { title,secret,name,phone,content,file} = req.body; //secret,file은 option

    if(!title || !name || !phone || !content) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

    let client;

    try {
        client = await db.connect(req);
        let s;
        if(!secret){s=false;} //null이면 기본 false
        else{s=secret;}
        const question=await questionDB.postQuestion(client,title,s,name,phone,content);
        if(file){ //파일 경로 배열 body로 받았으면
            for(f of file){
                await fileDB.postFile(client,question.id,f)
            }
        }
        if(req.files){
            for(f of req.files){ //multer로 req.files배열 받았으면
                await fileDB.postFile(client,question.id,f)
            }
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.INQUIRY_POST_SUCCESS));
        } 
    catch (error) {
        functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
        console.log(error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    } 
    finally {
        client.release();
    }
}