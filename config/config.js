require('dotenv').config();

module.exports = {
    DEBUG_MODE: process.env.DEBUG_MODE === 'true',
};
