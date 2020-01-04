const express = require('express');
// const moment = require('moment');
const mongoose = require('mongoose');
// const request = require('request');
const User = mongoose.model('User');
const Parcel = mongoose.model('Parcel');
const Order = mongoose.model('Order');
const Address = mongoose.model('Address');
const router = express.Router();
const jssdk = require('../libs/jssdk');
const baseUrl = 'https://34a631d7.ngrok.io';

module.exports = (app) => {
    app.use('/wechat', router);
};
// middleware to get singPackage
router.use((req, res, next) => {
    jssdk.getSignPackage(`${baseUrl}${req.originalUrl}`, (err, signPackage) => {
        if (err) {
            return next(err);
        }
        req.signPackage = signPackage;
        next();
    });
});

router.get('/',  (req, res, next) => {
    res.render('index', {
        title: '首页',
        signPackage: JSON.stringify(req.signPackage),
    });
});

router.get('/register_parcel', (req, res, next) => {
    Parcel.find({ packed: false, user: 'oCXVSt-WnhdRwjsZbyFUG_GN1BXc'}).exec((err, parcels) => {
        res.render('parcel', {
            title: '包裹登记',
            signPackage: JSON.stringify(req.signPackage),
            parcels,
        });
    });
});

router.get('/order/:orderid/edit_parcel', (req, res, next) => {
    if (!req.params.orderid) {
        return res.send('非法请求，缺少userid参数');
    }
});

router.get('/order/:orderid/edit_address', (req, res) => {
    if (!req.params.orderid) {
        return res.send('非法请求，缺少userid参数');
    }
    Order.findOne({_id: req.params.orderid}).populate('address')
        // .populate({path: 'user', select:'addresses', populate: {path: 'addresses'}})
        .exec(async(err, order) => {
        if (err || !order) {
            return res.send('没有找到订单');
        }
        
        const addresses = order.address? null : await Address.find({user: order.user}).sort({createdAt: -1}).limit(2).exec();
        
        res.render('address', {
            title: '填写地址',
            signPackage: JSON.stringify(req.signPackage),
            order,
            addresses,
        });
    });
});

router.get('/warehouse', (req, res, next) => {
    res.send('warehouse page');
});

router.get('/cost-calculate', (req, res, next) => {
    res.send('cost calculate page');
});

router.get('/search', (req, res, next) => {
    res.render('search', {
        title: '包裹追踪',
        signPackage: JSON.stringify(req.signPackage),
    });
});

router.get('/del-address', (req, res, next) => {
    res.send('del-address page');
});

router.get('/faq', (req, res, next) => {
    res.send('faq page');
});

router.get('/history/:userid', (req, res, next) => {
    if (!req.params.userid) {
        return res.send('非法请求，缺少userid参数');
    }

    User.findOne({ _id: req.params.userid }).exec(function (err, user) {
        if (err || !user) {
            return res.send('没有找到用户')
        }

        console.log(`find user: ${user}`);
    });

});