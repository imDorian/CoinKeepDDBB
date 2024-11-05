const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BalanceShareSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true
    },
    card: {
      type: Number,
      default: 0
    },
    cash: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

const BalanceShare = mongoose.model('BalanceShare', BalanceShareSchema)
module.exports = BalanceShare
