const mongoose = require('mongoose');

const GiftRedemptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    giftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gift',
      required: true
    },
    pointsUsed: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('GiftRedemption', GiftRedemptionSchema);