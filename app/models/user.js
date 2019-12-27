var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    openid: { type: String, required: '`openid`是必填参数' },
    // createdAt: { type: Date, default: Date.now },
    messageCount: { type: Number, default: 0 },
});
UserSchema.set('timestamps', true);
mongoose.model('User', UserSchema);

