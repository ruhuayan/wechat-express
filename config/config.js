// require('dotenv').config();
const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        root: rootPath,
        app: {
            name: 'wechat-express'
        },
        port: process.env.PORT || 3000,
        db: process.env.DB_DEV || 'mongodb://localhost/wechat-express-development'
    },

    test: {
        root: rootPath,
        app: {
            name: 'wechat-express'
        },
        port: process.env.PORT || 3000,
        db: process.env.DB_TEST || 'mongodb://localhost/wechat-express-test'
    },

    production: {
        root: rootPath,
        app: {
            name: 'wechat-express'
        },
        port: process.env.PORT || 3000,
        db: process.env.DB_PROD || 'mongodb://localhost/wechat-express-production'
    }
};

module.exports = config[env];
