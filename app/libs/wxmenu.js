const request = require('request');
const jssdk = require('./jssdk');
const menuUrl = require('./api').menu;

module.exports = {
    createMenu: (token, menu) => {
        return new Promise(function(resolve, reject){
            const url = menuUrl.create(token);
            request.post({ url: url, json: menu }, (e, response, body) => {
                if (e) {
                    console.error('菜单创建失败', e);
                    reject(err);
                }

                console.log('菜单创建成功', response, body);
                resolve(body);
            });
        });  
    },
    deleteMenu: (token) => {
        return new Promise((resolve, reject) => {
            const url = menuUrl.delete(token);
            request.get(url, function (e, response, body) {
                if (e) {
                    console.error('菜单删除失败', e);
                    reject(e);
                }

                console.log('菜单删除成功', body);
                resolve(body);
            })
        });
    },
    fetchAccessToken: () => {
        return new Promise((resolve, reject) => {
            jssdk.getAccessToken((err, token) => {
                if (err || !token) {
                    console.error('获取 access_token 失败');
                    reject(err)
                }
                console.log({ token });
                resolve(token);
            });
        });
    }
}