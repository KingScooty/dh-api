'use strict';

var express = require('express');
var controller = require('./year.controller');

var router = express.Router();

router.get('/year', controller.profile);

module.exports = router;
