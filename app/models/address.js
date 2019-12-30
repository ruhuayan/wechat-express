const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: '`user`是必填字段' },
    street: { type: String, required: '`street` 是必填字段', maxlength: 255 },
    city: { type: String, enum: ['Montreal', 'Quebec', 'Toronto'], default: 'Montreal'},
    province: { type: String, enum: ['QC', 'ON'], default: 'QC' },
    country: { type: String, enum: ['Canada', '加拿大'], default: 'Canada'},
    postal: { type: String, minlength: 6, maxlength: 6},
});

mongoose.model('Address', AddressSchema);
// module.exports = AddressSchema;