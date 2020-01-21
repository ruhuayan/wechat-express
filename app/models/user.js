const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: { type: String },
    name: { type: String, maxlength: 100 },
    addresses: {type: Schema.ObjectId, ref: 'Address'},
    phone: {type: String, validate: {validator: v => /\d{3}-\d{3}-\d{4}/.test(v), message: props => `${props.value} 不符电话格式 xxx-xxx-xxxx` }},
    email: {type: String, validate: {validator: v => /\S+@\S+\.\S+/.test(v), message: props => `${props.value} 不符 email 格式` }}, 
    // createdAt: { type: Date, default: Date.now },
});

UserSchema.set('timestamps', true);
mongoose.model('User', UserSchema);

