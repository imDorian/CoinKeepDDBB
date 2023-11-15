const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AvailablePersonalSpendSchema = new Schema({
    card: { type: Number },
    cash: { type: Number }
}, {
    timestamps: true
})

const AvailablePersonalSpend = mongoose.model('AvailablePersonalSpend', AvailablePersonalSpendSchema)

module.exports = AvailablePersonalSpend
