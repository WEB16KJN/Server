const express = require('express');
const router = express.Router();

router.get('/list', require('./inquiryListGET'));
router.get('/schedule', require('./inquiryScheduleGET'));
router.get('/profile', require('./inquiryUserGET'));
router.post('/create', require('./inquiryCreatePOST'));
module.exports = router;
