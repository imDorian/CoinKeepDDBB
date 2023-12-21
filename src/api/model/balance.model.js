const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BalanceSchema = new Schema({
    card: { type: Number },
    cash: { type: Number }
}, {
    timestamps: true
})

const Balance = mongoose.model('Balance', BalanceSchema)

module.exports = Balance
