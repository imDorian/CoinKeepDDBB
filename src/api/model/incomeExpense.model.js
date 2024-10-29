const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IncomeExpenseSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    method: {
      type: String,
      enum: ['card', 'cash', 'other'],
      required: true
    },
    category: { type: String, required: true },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group'
    },
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    divide: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true },
        settled: { type: Boolean, default: false }
      }
    ],
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

const IncomeExpense = mongoose.model('IncomeExpense', IncomeExpenseSchema)
module.exports = IncomeExpense
