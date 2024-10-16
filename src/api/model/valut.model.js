const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ValutSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    category: { type: String, required: true },
    goal: { type: Number },
    currency: { type: String, required: true },
    model: { type: String, enum: ['saving', 'investment'], required: true },
    data: [{ type: Schema.Types.ObjectId, ref: 'ValutElement' }]
  },
  {
    timestamps: true
  }
)

const Valut = mongoose.model('Valut', ValutSchema)

module.exports = Valut
