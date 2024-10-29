const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TransferSchema = new Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  note: { type: String } // Información adicional opcional
})

const Transfer = mongoose.model('Transfer', TransferSchema)

module.exports = Transfer
