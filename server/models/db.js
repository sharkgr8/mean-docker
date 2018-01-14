// Import dependencies
const mongoose = require('mongoose');
const config = require('../config/config');

// Connect to mongodb
mongoose.connect(config.dbhost,{
    useMongoClient: true,
    /* other options */
  });

module.exports = mongoose;