const express = require('express');
const router = express.Router();

router.get('/', require('./inquiryListGET'));
router.get('/schedule', require('./inquiryScheduleGET'));

// router.get('/경로', require('./파일이름'));


module.exports = router;