const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: { type: String },
    name: { type: String, maxlength: 100 },
    //addresses: {type: Schema.ObjectId, ref: 'Address'},
    phone: {type: String, validate: {validator: v => /\d{10,13}/.test(v), message: props => `${props.value} 不符电话格式 xxx-xxx-xxxx` }},
    email: {type: String, validate: {validator: v => /\S+@\S+\.\S+/.test(v), message: props => `${props.value} 不符 email 格式` }}, 
    street: { type: String, required: '`street` 是必填字段', maxlength: 255 },
    city: { type: String, enum: ['Montreal', 'Longueuil', 'Brossard', 'Laval', 'Doval', 'Quebec'], default: 'Montreal'},
    province: { type: String, enum: ['QC', 'ON'], default: 'QC' },
    country: { type: String, enum: ['Canada', '加拿大'], default: 'Canada'},
    postal: { type: String, minlength: 6, maxlength: 6, required: '`postal` 是必填字段'},
    // createdAt: { type: Date, default: Date.now },
});

UserSchema.set('timestamps', true);
mongoose.model('User', UserSchema);

