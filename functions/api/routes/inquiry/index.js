const express = require('express');
const router = express.Router();
const multer = require('multer');

router.get('/', require('./inquiryListGET'));
router.get('/schedule', require('./inquiryScheduleGET'));
router.get('/profile',require('./inquiryUserGET'));
const upload = multer({
    storage: multer.diskStorage({
      destination(req,file,cb){
        cb(null, 'functions/uploads/');
      },
      filename(req,file,cb){
        const ext = path.extname(file.originalname);
        cb(null,path.basename(file.originalname,ext) + new Date().valueOf() + ext);
      },
    }),
    limits: {fileSize:5*1024*1024}, 
});
router.post('/create',upload.array('img',2),require('./inquiryCreatePOST'));
module.exports = router;
