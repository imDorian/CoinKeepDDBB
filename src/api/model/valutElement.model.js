const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ValutElementSchema = new Schema(
  {
    quantity: { type: Number, required: true },
    currency: { type: String, required: true },
    method: { type: String, enum: ['card', 'cash'], required: true }
  },
  {
    timestamps: true
  }
)

const ValutElement = mongoose.model('ValutElement', ValutElementSchema)

module.exports = ValutElement
