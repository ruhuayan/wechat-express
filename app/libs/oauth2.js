// const request = require('request');
// const fs = require('fs');
// const debug = require('debug')('wechat-express:oauth2');

module.exports = {
    getCode: function (url, scope, done) {
        // https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect
    },
    getAccessToken: function(done) {
        // https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
    },
    refreshToken: function(done) {
        // https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN
    }
}