const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Package = mongoose.model('Package');
const Parcel = mongoose.model('Parcel');
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

router.get('/packages', (req, res, next) => {

    Package.find({ user: 'oCXVSt-WnhdRwjsZbyFUG_GN1BXc' }).exec(function (err, packages) {
        res.render('user-packages', {
            title: '用户订单',
            signPackage: JSON.stringify(req.signPackage),
            packages,
            userId: 'oCXVSt-WnhdRwjsZbyFUG_GN1BXc'
        });
    });
});

router.get('/parcels', (req, res, next) => {
    Parcel.find({ user: 'oCXVSt-WnhdRwjsZbyFUG_GN1BXc' }).exec(function (err, parcels) {
        res.render('user-parcels', {
            title: '用户包裹',
            signPackage: JSON.stringify(req.signPackage),
            parcels,
            userId: 'oCXVSt-WnhdRwjsZbyFUG_GN1BXc'
        });
    });
});

router.get('/profile', (req, res) => {
    User.findOne({ _id: 'oCXVSt-WnhdRwjsZbyFUG_GN1BXc' }).populate('address').exec( async(err, user) => {
        const redirect = req.query.redirect;
       
        res.render('profile', {
            title: '个人信息',
            signPackage: JSON.stringify(req.signPackage),
            user,
            redirect
        });
    });
});