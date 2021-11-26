const express = require('express');
const router = express.Router();

router.get('/', require('./inquiryListGET'));
router.get('/schedule', require('./inquiryScheduleGET'));

module.exports = router;
