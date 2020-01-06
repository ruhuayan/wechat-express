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
const {PackageStatus, StatusMessage} = require('../libs/status');

module.exports = (app) => {
    app.use('/', router);
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

router.get('/',  (req, res) => {
    Order.find({user: 'oCXVSt-WnhdRwjsZbyFUG_GN1BXc', status: PackageStatus.Confirm}).exec((err, orders) => {
        res.render('index', {
            title: '首页',
            signPackage: JSON.stringify(req.signPackage),
            orders,
        });
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

function checkOrderId(req, res, next) {
    if (!req.params.orderid) {
        const matches = req.url.match(/(parcel)|(address)/g);
        const viewUrl = matches.length? matches[0] : 'order';
        return res.render(viewUrl, {
            title: '缺少userid参数',
            signPackage: JSON.stringify(req.signPackage),
        });
    } else next();
}

function orderNotFound(req, res) {
    return res.render('order', {
        title: '订单',
        signPackage: JSON.stringify(req.signPackage),
    });
}
router.get('/order/:orderid/parcel', checkOrderId, (req, res, next) => {

    Order.findOne({_id: req.params.orderid}).exec(async(err, order) => {
        if (err || !order) {
            return orderNotFound(req, res);
        };
        res.render('parcel', {
            title: '填写地址',
            signPackage: JSON.stringify(req.signPackage),
            parcels: order.parcels,
        });
    });
});

router.get('/order/:orderid/address', checkOrderId, (req, res) => {
    
    Order.findOne({_id: req.params.orderid}).populate('address').exec(async(err, order) => {
        if (err || !order) {
            return orderNotFound(req, res);
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

router.get('/order/:orderid', checkOrderId, (req, res) => {

    Order.findOne({_id: req.params.orderid})
        .populate('address')
        .populate({path: 'pacels', select:'series'})
        .exec((err, order) => {

        res.render('order', {
            title: '订单',
            signPackage: JSON.stringify(req.signPackage),
            order,
            status: StatusMessage
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

router.get('/orders', (req, res, next) => {

    User.findOne({ _id: 'oCXVSt-WnhdRwjsZbyFUG_GN1BXc' }).exec(function (err, user) {
        if (err || !user) {
            return res.send('没有找到用户')
        }

        res.json(user);
    });

});

router.get('/profile', (req, res) => {
    User.findOne({ _id: 'oCXVSt-WnhdRwjsZbyFUG_GN1BXc' }).exec(function (err, user) {
        if (err || !user) {
            return res.send('没有找到用户')
        }

        res.json(user);
    });
});