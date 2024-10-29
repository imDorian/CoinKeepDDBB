const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ValutSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    goal: { type: Number, required: true },
    currency: { type: String, required: true },
    model: { type: String, enum: ['saving', 'investment'], required: true },
    accumulatedData: {
      type: Number,
      required: true,
      default: 0
    },
    data: [{ type: Schema.Types.ObjectId, ref: 'ValutElement' }]
  },
  {
    timestamps: true
  }
)

const Valut = mongoose.model('Valut', ValutSchema)

module.exports = Valut
