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
    ],
    invitations: [
      {
        group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
        invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'declined'],
          default: 'pending'
        }
      }
    ]
  },
  { timestamps: true }
)

const Share = mongoose.model('Share', ShareSchema)

module.exports = Share
