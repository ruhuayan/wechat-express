const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParcelSchema = new Schema({
    user: { type: String, ref: 'User', required: '`user`是必填字段' },
    series: { type: String, required: '`series`是必填参数', unique: true },
    weight: { type: Number, min: 0, default: 0 },
    description: { type: String, maxlength: 30, trim: true },
    packed: { type: Boolean, default: false }
    // images: [{type: String}],
});
ParcelSchema.set('timestamps', true);
mongoose.model('Parcel', ParcelSchema);