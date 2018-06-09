// Import dependencies
const mongoose = require('mongoose');
const config = require('../config/config');
mongoose.Promise = require('bluebird');

// Connect to mongodb
mongoose.connect(config.dbhost,{});

module.exports = mongoose;