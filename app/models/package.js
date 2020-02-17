const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {PackageStatus} = require('../libs/status');

const PackageSchema = new Schema({
    user: { type: String, ref: 'User', required: '`user`是必填字段' },
    parcels: [{type: Schema.ObjectId, ref: 'Parcel'}],
    status: { type: String, enum: Object.values(PackageStatus), default: PackageStatus.Confirm },
    container: { type: String, maxlength: 100 },
});

PackageSchema.statics.findOneOrCreate = function findOneOrCreate(condition, callback) {
    const self = this;
    self.findOne(condition, (err, result) => {
        return result ? callback(err, result) : self.create(condition, (err, result) => { return callback(err, result) })
    })
}
// PackageSchema.statics.findOneOrCreate = function findOneOrCreate(condition, doc) {
//     const self = this;
//     const newDocument = doc;
//     return new Promise((resolve, reject) => {
//         return self.findOne(condition)
//             .then((result) => {
//                 if (result) 
//                     return resolve(result);
                
//                 return self.create(newDocument)
//                     .then((result) => {
//                         return resolve(result);
//                     }).catch((error) => {
//                         return reject(error);
//                     })
//             }).catch((error) => {
//                 return reject(error);
//             })
//     });
// };
PackageSchema.set('timestamps', true);
mongoose.model('Package', PackageSchema);