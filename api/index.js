const express = require('express');
const router = require('express-promise-router')();
const passportConf = require('../passport');

require('./routes/trips')(router);
require('./routes/cars')(router);
require('./routes/users')(router);

module.exports = router;