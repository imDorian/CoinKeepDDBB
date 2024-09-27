const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MonthGoalSchema = new Schema({
    monthGoal: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date }
}, {
    timestamps: true
})

const MonthGoal = mongoose.model('MonthGoal', MonthGoalSchema)

module.exports = MonthGoal
