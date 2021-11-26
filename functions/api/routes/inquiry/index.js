const express = require('express');
const router = express.Router();

router.get('/', require('./inquiryListGET'));

module.exports = router;
