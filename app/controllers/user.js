const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Order = mongoose.model('Order');
const Address = mongoose.model('Address');
const router = express.Router();
const jssdk = require('../libs/jssdk');

module.exports = (app) => {
    app.use('/user', router);
};

router.use((req, res, next) => {
    jssdk.getSignPackage(`${process.env.URL}${req.originalUrl}`, (err, signPackage) => {
        if (err) {
            return next(err);
        }
        req.signPackage = signPackage;
        next();
    });
});

router.get('/orders', (req, res, next) => {

    Order.find({ user: 'oCXVSt-WnhdRwjsZbyFUG_GN1BXc' }).exec(function (err, orders) {
        res.render('user-orders', {
            title: '用户订单',
            signPackage: JSON.stringify(req.signPackage),
            orders,
            userId: 'oCXVSt-WnhdRwjsZbyFUG_GN1BXc'
        });
    });
});

router.get('/profile', (req, res) => {
    User.findOne({ _id: 'oCXVSt-WnhdRwjsZbyFUG_GN1BXc' }).exec( async(err, user) => {

        const addresses = user ? await Address.find({user: user._id}).sort({createdAt: -1}).limit(2).exec() : null;

        res.render('profile', {
            title: '个人信息',
            signPackage: JSON.stringify(req.signPackage),
            user,
            addresses
        });
    });
});