const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user: { type: String, ref: 'User', required: '`user`是必填字段' },
    msgid: { type: String, required: '`msgid`是必填参数'},
    fromUserId: {type: String, required: '`fromusername`是必填参数'},
    content: { type: String, required: '`content`是必填参数' },
    // createdAt: { type: Date, default: Date.now },
});
MessageSchema.set('timestamps', true);
mongoose.model('Message', MessageSchema);
