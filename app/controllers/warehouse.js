const express = require('express');
// const moment = require('moment');
const mongoose = require('mongoose');
// const request = require('request');
const User = mongoose.model('User');
const Parcel = mongoose.model('Parcel');
const Package = mongoose.model('Package');
const Address = mongoose.model('Address');
const router = express.Router();
const jssdk = require('../libs/jssdk');
const {PackageStatus, ParcelStatus} = require('../libs/status');

module.exports = (app) => {
    app.use('/warehouse', router);
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
    Package.find({status: PackageStatus.Confirm}).exec((err, orders) => {
        res.render('warehouse', {
            title: '仓库管理',
            signPackage: JSON.stringify(req.signPackage),
            orders,
        });
    });
});

router.get('/cn',  (req, res) => {
    Parcel.find({status: ParcelStatus.Received}).exec((err, parcels) => {
        res.render('warehouse-cn', {
            title: '进中国仓',
            signPackage: JSON.stringify(req.signPackage),
            parcels,
        });
    });
});