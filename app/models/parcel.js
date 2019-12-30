var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ParcelSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: '`user`是必填字段' },
    series: { type: String, required: '`series`是必填参数' },
    weight: { type: Number, min: 0, default: 0 },
});
ParcelSchema.set('timestamps', true);
mongoose.model('Parcel', ParcelSchema);

