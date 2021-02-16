require('dotenv').config();
const { DB_USERNAME, DB_PASSWORD, DB_NAME } = require('./config');
const { DIALECT } = require('./constants');

module.exports = {
    development: {
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
        dialect: DIALECT
    },
};
