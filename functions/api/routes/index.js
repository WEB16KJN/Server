const express = require('express');
const router = express.Router();

router.use('/search', require('./search'));
router.use('/inquiry', require('./inquiry'));

module.exports = router;
