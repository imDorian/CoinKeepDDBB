const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShareSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Group'
      }
    ]
  },
  { timestamps: true }
)

const Share = mongoose.model('Share', ShareSchema)

module.exports = Share
