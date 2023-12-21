const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PersonalBalanceSchema = new Schema({
    card: { type: Number },
    cash: { type: Number }
}, {
    timestamps: true
})

const PersonalBalance = mongoose.model('PersonalBalance', PersonalBalanceSchema)

module.exports = PersonalBalance
