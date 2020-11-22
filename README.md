# 微信账号公众账号 信息推送 JS

使用JS开发微信内嵌网页，Node开发微信公众账号服务端， 用于 海运货物 流程中 信息推送 及 处理各种客户信息 自动 回复 。\
Nodejs + MongoDB + Express \
Wechat Admin Console： https://mp.weixin.qq.com/

## WeChat Official Account
WeChat Official Account (also known as “OA”) is a China-based marketing platform that acts as a complete brand hub to:

* Gather followers
* Send them targeted content
* Push them marketing and service notifications
* Redirect them to a website/e-commerce

WeChat Official Account back-end login URL：\
Wechat Admin Console： https://mp.weixin.qq.com/
## TEST

* gulp

## if you have nodejs higher than 11.15

npm install -g n\
sudo n 11.15.0\

npm install gulp@^3.9.1\
npm install \
npm rebuild node-sass\

## SETUP
create .env and setup the following three values from https://mp.weixin.qq.com/
APPID=xxxxx\
APPSECRET=xxxxxx\
TOKEN=xxxxxxx\
## 微信开发 - config:fail,invalid signature
首先,JS域名设置的只能是有域名,不能带http://

其次

1.确认签名算法正确，可用http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign 页面工具进行校验。

2.确认config中nonceStr（js中驼峰标准大写S）, timestamp与用以签名中的对应noncestr, timestamp一致。

3.确认url是页面完整的url(请在当前页面alert(location.href.split('#')[0])确认)，包括'http(s)://'部分，以及'？'后面的GET参数部分,但不包括'#'hash后面的部分。

4.确认 config 中的 appid 与用来获取 jsapi_ticket 的 appid 一致。

5.确保一定缓存access_token和jsapi_ticket。

6.确保你获取用来签名的url是动态获取的，动态页面可参见实例代码中php的实现方式。如果是html的静态页面在前端通过ajax将url传到后台签名，前端需要用js获取当前页面除去'#'hash部分的链接（可用location.href.split('#')[0]获取,而且需要encodeURIComponent），因为页面一旦分享，微信客户端会在你的链接末尾加入其它参数，如果不是动态获取当前链接，将导致分享后的页面签名失败。