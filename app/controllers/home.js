const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Parcel = mongoose.model('Parcel');
const Package = mongoose.model('Package');
const Address = mongoose.model('Address');
const router = express.Router();
const jssdk = require('../libs/jssdk');
const {PackageStatus, StatusMessage, ParcelStatus} = require('../libs/status');
const USER_ID = 'oCXVSt-WnhdRwjsZbyFUG_GN1BXc';
module.exports = (app) => {
    app.use('/', router);
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
    Package.find({user: 'oCXVSt-WnhdRwjsZbyFUG_GN1BXc', status: PackageStatus.Confirm}).exec((err, Packages) => {
        res.render('index', {
            title: '首页',
            signPackage: JSON.stringify(req.signPackage),
            Packages,
        });
    });
});

router.get('/register_parcel', async(req, res, next) => {
    const user = await User.findById(USER_ID).exec();
    if (user && !user.phone) {
        return res.redirect('/user/profile?redirect=register_parcel')
    }
    Parcel.find({user: USER_ID, status: ParcelStatus.Create}).exec((err, parcels) => {
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
router.get('/order/:orderid/parcels', checkOrderId, (req, res, next) => {

    Package.findOne({_id: req.params.orderid}).select('_id parcels').populate({ path: 'parcels', select: 'series' }).exec(async(err, order) => {
        if (err || !order) {
            return orderNotFound(req, res);
        };
        res.render('parcel', {
            title: '填写地址',
            signPackage: JSON.stringify(req.signPackage),
            parcels: order.parcels,
            orderId: order._id,
        });
    });
});

router.get('/order/:orderid/address', checkOrderId, (req, res) => {
    
    Package.findOne({_id: req.params.orderid}).populate('address').exec(async(err, order) => {
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

    Package.findOne({_id: req.params.orderid})
        .populate('address')
        .populate({path: 'parcels', select:'series status'})
        .exec((err, order) => {

        res.render('order', {
            title: '订单',
            signPackage: JSON.stringify(req.signPackage),
            order,
            PackageStatus: PackageStatus
        });
    });
});

router.get('/warehouse-info', (req, res, next) => {
    res.send('warehouse page');
});

router.get('/cost-calculate', (req, res, next) => {
    res.send('cost calculate page');
});

router.get('/search', (req, res, next) => {
    res.render('search', {
        title: '订单追踪',
        signPackage: JSON.stringify(req.signPackage),
    });
});

router.get('/del-address', (req, res, next) => {
    res.send('del-address page');
});

router.get('/faq', (req, res, next) => {
    res.send('faq page');
});