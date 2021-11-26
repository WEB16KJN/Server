const express = require('express');
const router = express.Router();

router.get('/', require('./inquiryListGET'));
router.get('/schedule', require('./inquiryScheduleGET'));
router.get('/profile',require('./inquiryUserGET'));
module.exports = router;
