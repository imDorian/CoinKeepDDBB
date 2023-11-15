const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IncomeSchema = new Schema({
    category: { type: String, required: true },
    type: { type: String, required: true },
    currency: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    method: { type: String, enum: ['cash', 'card'], required: true }
}, {
    timestamps: true
})

const Income = mongoose.model('Income', IncomeSchema)

module.exports = Income
