const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {PackageStatus} = require('../libs/status');

const OrderSchema = new Schema({
    user: { type: String, ref: 'User', required: '`user`是必填字段' },
    parcels: [{type: Schema.ObjectId, ref: 'Parcel'}],
    status: { type: String, enum: Object.values(PackageStatus), default: PackageStatus.Confirm },
    address: { type: Schema.ObjectId, ref: 'Address' },
    includes: [{type: Schema.ObjectId, ref: 'Parcel'}],
    container: { type: String, maxlength: 100 },
    name: { type: String, maxlength: 100 },
    phone: {type: String, validate: {validator: v => /\d{3}-\d{3}-\d{4}/.test(v), message: props => `${props.value} 不符电话格式 xxx-xxx-xxxx` }},
});

OrderSchema.set('timestamps', true);
mongoose.model('Order', OrderSchema);