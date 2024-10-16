const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DataSchema = new Schema(
  {
    income: [{ type: Schema.Types.ObjectId, ref: 'Income' }],
    expense: [{ type: Schema.Types.ObjectId, ref: 'Expense' }],
    balance: { type: Schema.Types.ObjectId, ref: 'Balance' },
    valut: [{ type: Schema.Types.ObjectId, ref: 'Valut' }]
  },
  {
    timestamps: true
  }
)

const Data = mongoose.model('Data', DataSchema)

module.exports = Data
