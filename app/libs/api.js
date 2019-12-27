const prefix = 'https://api.weixin.qq.com/cgi-bin';

const jssdk = {
    token: (appid, secret) => `${prefix}/token?grant_type=client_credential&appid=${appid}&secret=${secret}`,
    ticket: (token) => `${prefix}/ticket/getticket?type=jsapi&access_token=${token}`,
};
const menu = {
    create: (token) => `${prefix}/menu/create?access_token=${token}`, // 创建菜单
    get: (token) => `${prefix}/menu/get?access_token=${token}`,  // 获取菜单,GET请求
    delete: (token) => `${prefix}/menu/delete?access_token=${token}`,  // 删除菜单,GET请求
    // getInfo: (token) => `${prefix}get_current_selfmenu_info?access_token=${token}`  //access_token=ACCESS_TOKEN  获取自定义菜单配置接口
}

const oauth2 = {
    code: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect`,
    accessToken: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code`,
    refreshToken: `https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN`
}

module.exports = { jssdk, menu, oauth2 }