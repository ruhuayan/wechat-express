const request = require('request');
const jssdk = require('./jssdk');
request.debug = true;

const menuItems = {
    "button":[
        {
            "type": "click",
            "name": "包裹登记",
            "key": "register-package"
        },
        {
            "type": "click",
            "name": "托运记录",
            "key": "package-history"
        }
    ]
};

doMenuSync();

function doMenuSync () {
    jssdk.getAccessToken(function (err, token) {
        if (err || !token) {
            return console.error('获取 access_token 失败');
        }

        console.log({ token });

        request.get(`https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${token}`, function (e, response, body) {
            if (e) {
                return console.error('菜单删除失败', e);
            }

            console.log('菜单删除成功', body);

            request.post({ url: `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`, json: menuItems }, function (_e, _response, _body) {
                if (_e) {
                    return console.error('菜单创建失败', _e);
                }

                console.log('菜单创建成功', body);
            });
        });
    });
};
module.exports = menuItems;
