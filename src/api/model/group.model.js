const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GroupSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    currency: {
      type: String,
      required: true
    },
    boss: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    balances: [
      {
        type: Schema.Types.ObjectId,
        ref: 'BalanceShare'
      }
    ],
    expenses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'IncomeExpense'
      }
    ],
    incomes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'IncomeExpense'
      }
    ],
    transfers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Transfer'
      }
    ],
    debts: [
      {
        fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        toUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true },
        status: {
          type: String,
          enum: ['pending', 'settled'],
          default: 'pending'
        }
      }
    ],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
)

const Group = mongoose.model('Group', GroupSchema)
module.exports = Group
