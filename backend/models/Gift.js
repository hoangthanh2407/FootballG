const mongoose = require('mongoose');

const GiftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên quà tặng'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả quà tặng']
    },
    image: {
      type: String,
      default: 'no-photo.jpg'
    },
    pointsCost: {
      type: Number,
      required: [true, 'Vui lòng nhập số điểm cần để đổi quà']
    },
    quantity: {
      type: Number,
      required: [true, 'Vui lòng nhập số lượng quà'],
      default: 1
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Gift', GiftSchema);