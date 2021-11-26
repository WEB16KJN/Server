const express = require('express');
const router = express.Router();

router.get('/', require('./searchGET'));

router.post('/:id/like', require('./searchIdLikePOST'));


module.exports = router;
