const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, require: true},
    name: {type: String, required: true},
    gender: {type: String},
    imageUrl: {type: String},
    googleId: {type: String},
    data: { type: Schema.Types.ObjectId, ref: 'Data' }
}, {
    timestamps: true
    })

const User = mongoose.model('User', UserSchema)

module.exports = User
