const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DebtSchema = new Schema(
  {
    fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'settled'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
)

const Debt = mongoose.model('Debt', DebtSchema)

module.exports = Debt
