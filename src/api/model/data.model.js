const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DataSchema = new Schema({
    income: [{ type: Schema.Types.ObjectId, ref: 'Income' }],
    expense: [{ type: Schema.Types.ObjectId, ref: 'Expense' }],
    saving: [{ type: Schema.Types.ObjectId, ref: 'Saving' }],
    investment: [{ type: Schema.Types.ObjectId, ref: 'Investment' }],
    available_personal_spend: { type: Schema.Types.ObjectId, ref: 'AvailablePersonalSpend' },
    personal_balance: { type: Schema.Types.ObjectId, ref: 'PersonalBalance' },
    balance: { type: Schema.Types.ObjectId, ref: 'Balance' },
    personal_spend: [{ type: Schema.Types.ObjectId, ref: 'PersonalSpend' }],
    monthGoal: { type: Schema.Types.ObjectId, ref: 'MonthGoal' }
}, {
    timestamps: true
})

const Data = mongoose.model('Data', DataSchema)

module.exports = Data
