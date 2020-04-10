const express = require('express');
const router = express.Router();

require('./routes/trips')(router);
require('./routes/cars')(router);

module.exports = router;