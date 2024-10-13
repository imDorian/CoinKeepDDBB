const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PersonalSpendSchema = new Schema(
  {
    quantity: { type: Number, required: true },
    method: { type: String, enum: ['card', 'cash'], required: true },
    category: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    currency: { type: String, required: true },
    model: { type: String, enum: ['personal'], required: true }
  },
  {
    timestamps: true
  }
)

const PersonalSpend = mongoose.model('PersonalSpend', PersonalSpendSchema)

module.exports = PersonalSpend
