const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InvestmentSchema = new Schema({
    category: { type: String, required: true },
    type: { type: String, required: true },
    currency: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    method: { type: String, enum: ['card', 'cash'], required: true }
}, {
    timestamps: true
})

const Investment = mongoose.model('Investment', InvestmentSchema)

module.exports = Investment
