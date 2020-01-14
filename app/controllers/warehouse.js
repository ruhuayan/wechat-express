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
const {PackageStatus, ParcelStatus} = require('../libs/status');

module.exports = (app) => {
    app.use('/warehouse.', router);
};
// middleware to get singPackage
router.use((req, res, next) => {
    jssdk.getSignPackage(`${process.env.URL}${req.originalUrl}`, (err, signPackage) => {
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