const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PersonalSpendSchema = new Schema(
  {
    establishment: { type: String, required: true },
    product: { type: String, required: true },
    currency: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    method: { type: String, enum: ['card', 'cash'], required: true },
    date: { type: Date, required: true },
    model: { type: String, enum: ['personal'], required: true }
  },
  {
    timestamps: true
  }
)

const PersonalSpend = mongoose.model('PersonalSpend', PersonalSpendSchema)

module.exports = PersonalSpend
