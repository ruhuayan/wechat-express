const express = require('express');
const mongoose = require('mongoose');
const Address = mongoose.model('Address');
const User = mongoose.model('User');
const Parcel = mongoose.model('Parcel');
const Package = mongoose.model('Package');
const router = express.Router();
const { WechatClient } = require('messaging-api-wechat');
const { ParcelStatus } = require('../libs/status');

module.exports = (app) => {
    app.use('/api', router);
};
const config = {
    appId: process.env.APPID,
    appSecret: process.env.APPSECRET,
};
const client = WechatClient.connect(config);
// add or edit parcel
router.post('/parcel', (req, res, next) => { console.log(req.body)
    if (!req.body.user) {
        return res.json({success: 0, msg: '缺少user参数'});
    }

    // if (req.body.signature !== '') {
    //     return res.json({success: 0, msg: '缺少user参数'});

    // }
    const newParcel = new Parcel(req.body);
    newParcel.save(function (e, parcel) {
        if (e) return res.status(500).send(e)
        return res.status(200).send(parcel);
    });

});

router.post('/parcel/:id', (req, res, next) => {
    if (!req.params.id) {
        return res.json({success: 0, msg: '缺少id参数'})
    }

    if (!req.body.user) {
        return res.json({success: 0, msg: '缺少user参数'});
    }

    Parcel.findByIdAndUpdate(req.params.id, req.body, (err, parcel) => {
        if (err) return res.status(500).send(err);
        if (!parcel) return res.json({success: 0, msg: `${req.params.id} does not exist`});
        return res.status(200).send(parcel);
    });
});

// delete parcel
router.delete('/parcel/:id', (req, res, next) =>{
    if (!req.params.id) {
        return res.json({success: 0, msg: '缺少id参数'})
    }
    Parcel.findByIdAndRemove(req.params.id, (err, parcel) => { console.log(err)
        
        if (err) return res.status(500).send(err);
        if (!parcel) return res.json({success: 0, msg: `${req.params.id} does not exist`});
        const response = {
            success: 1,
            message: "Parcel successfully deleted",
            id: parcel._id
        };
        return res.status(200).send(response);
    });
});

// add order 
router.post('/order', (req, res, next) => {
    if (!req.body.user) {
        return res.json({success: 0, msg: '缺少user参数'});
    }

    if (req.body.orderId) {
        Package.findByIdAndUpdate(req.body.orderId, req.body, (err, order) => {
            if (err || !order) return res.status(500).send(err);
            if (order.parcels) {
                order.parcels.forEach(id => Parcel.findByIdAndUpdate(id, {status: ParcelStatus.Confirm}).exec());
            }
            return res.status(200).send(order);
        });
    } else {
        const newPackage = new Package(req.body);
        newPackage.save(function (e, order) {
            if (e) return res.status(500).send(e);
            if (order && order.parcels) {
                order.parcels.forEach(id => Parcel.findByIdAndUpdate(id, {status: ParcelStatus.Confirm}).exec());
            }
            return res.status(200).send(order);
        });
    }
});

// search order
router.get('/order/:id', (req, res, next) => {
    if (!req.params.id) {
        return res.json({success: 0, msg: '缺少id参数'})
    }

    Package.find({"$where": `/^${req.params.id}/.test(this._id.str)`}).select('_id').exec((err, order) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(order);
    });
});

// edit order
router.post('/order/:id', (req, res, next) => {
    if (!req.params.id) {
        return res.json({success: 0, msg: '缺少id参数'})
    }

    if (!req.body.user) {
        return res.json({success: 0, msg: '缺少user参数'});
    }

    Package.findByIdAndUpdate(req.params.id, req.body, (err, order) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(order);
    });
});

// add address to order
router.post('/order/:id/add_address', (req, res) => {
    if (!req.params.id) {
        return res.json({success: 0, msg: '缺少id参数'})
    }
    Package.findByIdAndUpdate(req.params.id, {address: req.body.address}, (err, order) => {
        if (err) return res.status(500).send(err);
        if (!order) return res.json({success: 0, msg: '添加地址到`order`失败'});
        client.sendText(req.body.user, `单号（${req.params.id}）建立成功，要查看请点击 ${process.env.URL}/order/${req.params.id}`).catch(err=> {
            console.log('wechat client error: ', err)
        });
        return res.status(200).send(order);
    }); 
});
// create address then add to order or edit order address, 
router.post('/order/:id/address', (req, res) => {
    if (!req.params.id) {
        return res.json({success: 0, msg: '缺少id参数'})
    }
    
    if (req.body._id && req.body._id !== '') {
        Address.findByIdAndUpdate(req.body._id, req.body, (err, address) => {
            if (err) return res.status(500).send(err);
            if (!address) return res.json({success: 0, msg: `地址更改失败`});
            client.sendText(req.body.user, `单号（${req.params.id}）更改了送货地址. 查看订单请点击 ${process.env.URL}/order/${req.params.id}`).catch(err=> {
                console.log('wechat client error: ', err)
            });
            return res.status(200).send(address);
        });
    } else {
        const newAddress = new Address(req.body);
        newAddress.save((err, address) => {
            if (err) return res.status(500).send(err);
            if (!address) return res.json({success: 0, msg: `地址失败`});
            Package.findByIdAndUpdate(req.params.id, {address: address._id}, (err, order) => {
                if (err) return res.status(500).send(err);
                if (!order) return res.json({success: 0, msg: '添加地址到`order`失败'});
                client.sendText(req.body.user, `单号（${req.params.id}）建立成功，要查看请点击 ${req.host}/order/${req.params.id}`).catch(err=> {
                    console.log('wechat client error: ', err)
                });
                return res.status(200).send(order);
            });
            User.findByIdAndUpdate(req.body.user, {}, (err, user) => {
                if (err) return res.status(500).send(err);
                if (!user) return res.json({success: 0, msg: '添加地址到`user`失败'});
            });
        });  
    }
});

router.post('/parcel/:series/receive', (req, res) => {
    if (!req.params.series) {
        return res.json({success: 0, msg: '缺少series参数'})
    }
    if (!req.body.user) {
        return res.json({success: 0, msg: '缺少user参数'});
    }

    if (req.body.media) {
        console.log(req.body.media)
        // download then save media in db
    }
    Parcel.findOneAndUpdate({series: req.params.series}, {status: ParcelStatus.Received}, {new: true, upsert: true}, (err, parcel) => {
        if (err) return res.status(500).send(err);
        if (!parcel) return res.json({success: 0, msg: `${req.params.series} does not exist`});
        return res.status(200).send(parcel);
    });
});

router.post('/parcel/:id/remove', (req, res) => {
    if (!req.params.id) {
        return res.json({success: 0, msg: 'id'});
    }
    if (!req.body.user) {
        return res.json({success: 0, msg: '缺少user参数'});
    }

    Parcel.findByIdAndUpdate(req.params.id, {status: ParcelStatus.Confirm}, {new: true}, (err, parcel) => {
        if (err) return res.status(500).send(err);
        if (!parcel) return res.json({success: 0, msg: `${req.params.id} does not exist`});
        return res.status(200).send(parcel);
    });
});

router.post('/users/:id', (req, res) => {
    if (!req.params.id) {
        return res.json({success: 0, msg: '缺少userId参数'});
    }
    if (!req.body.phone) {
        return res.json({success: 0, msg: '缺少phone参数'});
    }

    User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
        if (err) return res.status(500).send(err);
        if (!user) return res.json({success: 0, msg: `user - ${req.params.id} does not exist`});
        return res.status(200).send(user);
    });

});