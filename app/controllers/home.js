const express = require('express');
const wechat = require('wechat');
// const lodash = require('lodash');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = mongoose.model('User');
const Message = mongoose.model('Message');

module.exports = (app) => {
    app.use('/', router);
};

const config = {
    token: process.env.TOKEN,
    appid: process.env.APPID,
    checkSignature: false,
};

router.get('/', (req, res, next) => {
    res.send('Server works!'); 
});

// 只处理文本消息的函数
const handleWechatTextMessage = (req, res, next) => {
    const message = req.weixin;

    if (!message.Content) {
        return res.reply('没有发出信息');
    }

    const msg = new Message({
        user: req.user,
        msgid: message.MsgId,
        fromUserId: message.FromUserName,
        content: message.Content,
    });

    msg.save((e, msg) => {
        if (e) {
            return console.error('conversion save error:', e);
        }
        console.log(msg)
        // 更新会话次数
        req.user.messageCount = req.user.messageCount + 1;
        req.user.save(function (_e, u) {
            if (_e) {
                return console.error('user conversation stats save error:', _e);
            }
        });
    });
    return res.reply(message.Content);
};

// 只处理事件消息
const handleWechatEventMessage = (req, res, next) => {
    const message = req.weixin;
    const event = message.Event;
    const eventKey = message.EventKey;

    if (event === 'CLICK') {
        if (eventKey === 'package-history') {
            res.reply(`${baseUrl}/wechat/history/${req.user._id.toString()}`);
        } else {
            res.reply('无法处理的单击事件');
        }
    } else if (event === 'subscribe') {
        // 
        res.reply('谢谢添加xxxx公共帐号:)');
    } else {
        res.reply('无法处理的事件类型');
    }
};

const handleWechatRequest = wechat(config, (req, res, next) => {
    const message = req.weixin;

    if (message.MsgType === 'text') {
        // res.reply(message.Content);
        handleWechatTextMessage(req, res, next);
    } else if (message.MsgType === 'event') {

        handleWechatEventMessage(req, res, next);
    } else {
        res.reply('无法处理的消息类型');
    }
});

const handleUserSync = (req, res, next) => {
    if (!req.query.openid) {
        return next();
    }

    const openid = req.query.openid;
    User.findOne({ openid }).exec((err, user) => {
        if (err) {
            return next(err);
        }

        if (user) {
            console.log(`use existing user: ${openid}`);
            req.user = user;
            return next();
        }

        console.log(`create new user: ${openid}`);
        const newUser = new User({
            openid,
            messageCount: 0,
        });

        newUser.save(function (e, u) {
            if (e) {
                return next(e);
            }

            req.user = u;
            next();
        });
    });
};

router.get('/message', handleWechatRequest);
router.post('/message', handleUserSync, handleWechatRequest);