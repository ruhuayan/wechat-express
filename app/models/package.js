const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {PackageStatus} = require('../libs/status');

const PackageSchema = new Schema({
    user: { type: String, ref: 'User', required: '`user`是必填字段' },
    parcels: [{type: Schema.ObjectId, ref: 'Parcel'}],
    status: { type: String, enum: Object.values(PackageStatus), default: PackageStatus.Confirm },
    container: { type: String, maxlength: 100 },
});

PackageSchema.set('timestamps', true);
mongoose.model('Package', PackageSchema);