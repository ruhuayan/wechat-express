const express = require('express');
const mongoose = require('mongoose');
const Address = mongoose.model('Address');
const User = mongoose.model('User');
const Parcel = mongoose.model('Parcel');
const Package = mongoose.model('Package');
const router = express.Router();
const { WechatClient } = require('messaging-api-wechat');
const { ParcelStatus, PackageStatus } = require('../libs/status');

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
        if (e || !parcel) return res.status(500).send({success: 0, msg: 'Create parcel error'});
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
    // only parcel with status 'Created' can be deleted 
    Parcel.findOneAndRemove({_id: req.params.id, status: ParcelStatus.Create}, (err, parcel) => {
        
        if (err) return res.status(500).send(err);
        if (!parcel) return res.json({success: 0, msg: `${req.params.id} does not exist or cannot be removed `});
        const response = {
            success: 1,
            message: "Parcel successfully deleted",
            id: parcel._id
        };
        return res.status(200).send(response);
    });
});

// add package 
// router.post('/package', (req, res, next) => {
//     if (!req.body.user) {
//         return res.json({success: 0, msg: '缺少user参数'});
//     }

//     if (req.body.packageId) {
//         Package.findByIdAndUpdate(req.body.packageId, req.body, (err, package) => {
//             if (err || !package) return res.status(500).send(err);
//             if (package.parcels) {
//                 package.parcels.forEach(id => Parcel.findByIdAndUpdate(id, {status: ParcelStatus.Confirm}).exec());
//             }
//             return res.status(200).send(package);
//         });
//     } else {
//         const newPackage = new Package(req.body);
//         newPackage.save(function (e, package) {
//             if (e) return res.status(500).send(e);
//             if (package && package.parcels) {
//                 package.parcels.forEach(id => Parcel.findByIdAndUpdate(id, {status: ParcelStatus.Confirm}).exec());
//             }
//             return res.status(200).send(package);
//         });
//     }
// });

// search order
router.get('/package/:id', (req, res, next) => {
    if (!req.params.id) {
        return res.json({success: 0, msg: '缺少id参数'})
    }

    Package.find({"$where": `/^${req.params.id}/.test(this._id.str)`}).select('_id').exec((err, packages) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(packages);
    });
});

// edit order
router.post('/package/:id', (req, res, next) => {
    if (!req.params.id) {
        return res.json({success: 0, msg: '缺少id参数'})
    }

    if (!req.body.user) {
        return res.json({success: 0, msg: '缺少user参数'});
    }

    Package.findByIdAndUpdate(req.params.id, req.body, (err, package) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(package);
    });
});

// add address to order
// router.post('/package/:id/add_address', (req, res) => {
//     if (!req.params.id) {
//         return res.json({success: 0, msg: '缺少id参数'})
//     }
//     Package.findByIdAndUpdate(req.params.id, {address: req.body.address}, (err, package) => {
//         if (err) return res.status(500).send(err);
//         if (!order) return res.json({success: 0, msg: '添加地址到`order`失败'});
//         return res.status(200).send(package);
//     }); 
// });
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

// when a parcel is received, find or create a package to put it
router.post('/parcel/:series/receive', (req, res) => {
    if (!req.params.series) {
        return res.json({success: 0, msg: '缺少series参数'})
    }
    if (!req.body.user) {
        return res.json({success: 0, msg: '缺少user参数'});
    }
    // find or create package
    Package.findOneOrCreate({user: req.body.user, status: PackageStatus.Confirm}, async(err, package) => {
        if (err || !package) return res.json({success: 0, msg: '`package` create失败'});
        
        let parcel = await Parcel.findOne({series: req.params.series});
        if (!parcel) return res.json({success: 0, msg: `${req.params.series} does not exist`});

        package.parcels.push(parcel._id);
        const p = await package.save();
        if (!p) return res.json({success: 0, msg: '`package` save 失败'});

        parcel.status = ParcelStatus.Received;
        parcel.package = package._id;
        parcel = await parcel.save();
        if (!parcel) return res.json({success: 0, msg: '`parcel` update 失败'});

        // send wechat message
        client.sendText(package.user, `单号（${package._id}）建立成功，要查看请点击 ${process.env.URL}/package/${package._id}`).catch(err=> {
            console.log('wechat client error: ', err)
        });

        return res.status(200).send(parcel);
    });
});

router.post('/parcel/:id/remove', (req, res) => {
    if (!req.params.id) {
        return res.json({success: 0, msg: 'id'});
    }
    if (!req.body.user || !req.body.pid) {
        return res.json({success: 0, msg: '缺少user参数 or package id'});
    }

    Package.findById(req.body.pid, async(err, package) => {
        if (err || !package) return res.json({success: 0, msg: '`package` find 失败'});

        let parcel = await Parcel.findById(req.params.id);
        if (!parcel) return res.json({success: 0, msg: `${req.params.series} does not exist`});

        package.parcels = package.parcels.filter(p => p != req.params.id);
        const p = await package.save();
        if (!p) return res.json({success: 0, msg: '`package` save 失败'});

        parcel.package = null;
        parcel.status = ParcelStatus.Create;
        if (!parcel) return res.json({success: 0, msg: '`parcel` update 失败'});
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