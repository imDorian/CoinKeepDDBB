const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExpenseSchema = new Schema({
    category: { type: String, required: true },
    type: { type: String, required: true },
    currency: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    method: { type: String, enum: ['card', 'cash'], required: true }
}, {
    timestamps: true
})

const Expense = mongoose.model('Expense', ExpenseSchema)

module.exports = Expense
